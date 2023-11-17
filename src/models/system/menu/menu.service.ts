import { Menus } from '@app/db/modules/system/sys-menus.model'
import { Injectable } from '@nestjs/common'
import {
	ChildrenMenuDto,
	CreateMenuDto,
	QueryMenu,
	UpdateMenuDto
} from './dto/menu.dto'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { isEmpty, uniq, filter, uniqBy } from 'lodash'
import { PageList } from '@/common/class/res.class'
import { ApiException } from '@/service/exceptions/api.exception'
import { UtilService } from '@/shared/tools/util.service'
import { WSService } from '@/shared/websocket/ws.service'
@Injectable()
export class MenuService {
	constructor(
		@InjectModel(Menus)
		private readonly menusModel: ReturnModelType<typeof Menus>,
		private utilService: UtilService,
		private wsService: WSService
	) {}

	/**
	 * @description 获取所有菜单及所拥有的菜单
	 */
	async listMenu(
		pagination,
		query: QueryMenu
	): Promise<PageList<UpdateMenuDto>> {
		try {
			const { name, onlyParent = false } = query
			const filter = {
				isEnable: 1
			} as any
			if (name) {
				// 模糊查询
				filter.name = {
					$regex: name,
					$options: 'i' // 忽略大小写
				}
			}
			const { current = 1, pageSize = 10 } = pagination
			const list: Array<UpdateMenuDto> = await this.menusModel
				.find(
					filter,
					{},
					{
						sort: { updatedAt: -1 },
						limit: pageSize,
						skip: (current - 1) * pageSize
					}
				)
				.lean()
			const menuList = await this.toggleRouterList(list, onlyParent)
			const count = await this.menusModel.countDocuments(filter)
			return {
				list: menuList,
				pagination: {
					pageSize: pageSize,
					current: current,
					total: count
				}
			}
		} catch (error) {
			return Promise.reject(error)
		}
	}

	/**
	 * @description 增加菜单
	 */
	async addMenu(body: CreateMenuDto) {
		try {
			const exists = await this.menusModel.findOne({
				path: body.path
			})
			if (!isEmpty(exists)) {
				throw new ApiException(10300)
			}
			if (body.parentId) {
				const pid = await this.menusModel.findOne({
					_id: this.utilService.toObjectId(body.parentId)
				})
				if (isEmpty(pid)) {
					throw new ApiException(10303)
				}
			}
			return await this.menusModel.create(body)
		} catch (error) {
			return Promise.reject(error)
		}
	}

	/**
	 * @description 更新菜单
	 */
	async updateMenu(body: CreateMenuDto, id: string) {
		try {
			if (body.parentId) {
				const pid = await this.menusModel.findOne({
					_id: this.utilService.toObjectId(body.parentId)
				})
				if (isEmpty(pid)) {
					throw new ApiException(10303)
				}
			}
			await this.menusModel.findByIdAndUpdate(id, body)
			this.wsService.noticeUpdateMenus(0)
		} catch (error) {
			return Promise.reject(error)
		}
	}

	/**
	 * @description 获取菜单信息
	 */
	async infoMenu(id) {
		try {
			const menus = await this.menusModel
				.findOne({
					_id: this.utilService.toObjectId(id),
					isEnable: 1
				})
				.sort({ pIndex: 1, cIndex: 1 })
				.lean()
			if (!isEmpty(menus)) {
				return menus
			}
		} catch (error) {
			return Promise.reject(error)
		}
	}

	/**
	 * @description 删除 - 如果有子节点，需要将子节点的菜单也删掉
	 */
	async deleteMenu(id) {
		try {
			const _ = await this.menusModel.findByIdAndDelete(id)
			if (isEmpty(_)) {
				throw new ApiException(10301)
			}
			await this.menusModel.deleteMany({
				parentId: { $in: id }
			})
			this.wsService.noticeUpdateMenus(0)
		} catch (error) {
			return Promise.reject(error)
		}
	}

	/**
	 * @deprecated 循环生成children
	 */
	toggleChildren(children: Array<ChildrenMenuDto>, list: Array<UpdateMenuDto>) {
		if (children && children.length !== 0) {
			children.map((item, index) => {
				if (item._id.toString() === item.parentId) throw new ApiException(10304)
				const c =
					filter(list, (o) => o.parentId === item._id.toString()) || false
				if (c && c.length !== 0) {
					children[index].children = c
					this.toggleChildren(children[index]?.children, list)
				}
			})
		}
	}

	/**
	 * @deprecated 挑选出一级路由
	 * @deprecated 从所有菜单中找到传入menuIds的父级菜单
	 * @param menus 未过滤前的路由列表，menus里面的_id是字符串
	 */
	async findParentIds(
		menus: Array<UpdateMenuDto>
	): Promise<Array<UpdateMenuDto>> {
		const parentMenus = []
		const findParent = async (menu: UpdateMenuDto) => {
			// 没有parentId，直接返回一级路由
			if (!menu.parentId) return parentMenus.push(menu)
			const parentMenu: UpdateMenuDto = await this.infoMenu(menu.parentId)
			// 判断父级路由存不存在
			if (parentMenu) {
				if (parentMenu.parentId) {
					// 说明还不是第一级路由，继续寻找
					return findParent(parentMenu)
				} else {
					// 返回第一级路由
					parentMenus.push(parentMenu)
				}
			}
		}
		await Promise.all(
			menus.map(async (menu) => {
				return findParent(menu)
			})
		)
		return uniqBy(
			parentMenus.map((_) => ({ ..._, _id: _._id.toString() })),
			'_id'
		)
	}

	/**
	 * @deprecated 挑选出一级路由，转换成父子嵌套children的形式
	 * @param list 未过滤前的路由列表,里面的_id是ObjectId
	 * @param onlyParent 只需要父级,还是全部菜单都找一遍children
	 */
	async toggleRouterList(
		list: Array<UpdateMenuDto>,
		onlyParent = true
	): Promise<Array<UpdateMenuDto>> {
		const sortList = uniqBy(
			list.map((_) => ({ ..._, _id: _._id.toString() })),
			'_id'
		)
		if (sortList.length === 0) return []
		if (onlyParent) {
			// const parent = sortList.filter(
			// 	(item) => !item.parentId
			// ) as Array<UpdateMenuDto>
			const parent = (await this.findParentIds(
				sortList
			)) as Array<UpdateMenuDto>
			return parent.map((_) => {
				const children =
					filter(
						sortList,
						(o: any) => o.parentId?.toString() === _._id.toString()
					) || []
				this.toggleChildren(children, sortList)
				return { ..._, children }
			})
		} else {
			return sortList.map((_) => {
				const children =
					filter(
						sortList,
						(o: any) => o.parentId.toString() === _._id.toString()
					) || []
				this.toggleChildren(children, sortList)
				return { ..._, children }
			})
		}
	}

	/**
	 * @description 过滤出有效的菜单id
	 */
	async filterValMenus(ids) {
		const menus = []
		await Promise.all(
			ids.map(async (id: string) => {
				const menu = await this.infoMenu(id)
				menu && menus.push(menu)
			})
		)
		return menus
	}

	/**
	 * @description 判断菜单列表是否存在于菜单表中
	 * @return 返回菜单和菜单ids
	 */
	async getMenus(
		menuIdArray: Array<string>
	): Promise<{ menus?: Array<CreateMenuDto>; menuIds?: Array<string> }> {
		const uniqMenuIds = uniq(menuIdArray)
		const menus: any = await this.menusModel
			.find({
				_id: { $in: uniqMenuIds.map((_) => this.utilService.toObjectId(_)) }
			})
			.lean() // .select('_id')
		const menuIds = menus.map((_) => _._id)
		// if (menuIds.length === 0) {
		// 	throw new ApiException(10302)
		// }
		return {
			menuIds,
			menus
		}
	}

	/**
	 * @description 获取指定的菜单menuIds并进行父子排序
	 * @param menuIds 指定menuIds
	 * @param onlyParent 只需要父级,还是全部菜单都找一遍children
	 */
	async handleMenus(
		menuIds: Array<string>,
		onlyParent = true
	): Promise<Array<UpdateMenuDto>> {
		try {
			const ids = uniq(menuIds)
			// const menus = await this.filterValMenus(ids)
			const { menus } = await this.getMenus(ids)
			return this.toggleRouterList(menus, onlyParent)
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
