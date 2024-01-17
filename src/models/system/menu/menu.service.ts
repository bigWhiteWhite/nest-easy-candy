import { Menus } from '@app/db/modules/system/sys-menus.model'
import { System } from '@app/db/modules/system/sys-system.model'
import { RoleSystemMenus } from '@app/db/modules/system/sys-role-system-menus.model'
import { Injectable } from '@nestjs/common'
import { ChildrenMenuDto, CreateMenuDto, QueryMenu, UpdateMenuDto } from './dto/menu.dto'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { isEmpty, uniq, filter, uniqBy, map, keyBy } from 'lodash'
import { PageList } from '@/common/class/res.class'
import { ApiException } from '@/service/exceptions/api.exception'
import { UtilService } from '@/shared/tools/util.service'
import { WSService } from '@/shared/websocket/ws.service'
import { Types } from 'mongoose'
@Injectable()
export class MenuService {
	constructor(
		@InjectModel(Menus)
		private readonly menusModel: ReturnModelType<typeof Menus>,
		@InjectModel(System)
		private readonly systemModel: ReturnModelType<typeof System>,
		@InjectModel(RoleSystemMenus)
		private readonly roleSystemMenus: ReturnModelType<typeof RoleSystemMenus>,
		private utilService: UtilService,
		private wsService: WSService
	) {}

	/**
	 * @description 获取所有菜单及所拥有的菜单
	 */
	async listMenu(pagination, query: QueryMenu): Promise<PageList<UpdateMenuDto>> {
		try {
			const { name, onlyParent = false, showBtnMenu = true } = query
			const filter = {
				isEnable: 1
			} as any
			if (!showBtnMenu) {
				filter.type = 1
			}
			if (name) {
				// 模糊查询
				filter.name = {
					$regex: name,
					$options: 'i' // 忽略大小写
				}
			}
			const { current = 1, pageSize = 10 } = pagination
			const list = await this.menusModel
				.find()
				// 三级嵌套填充关联文档，如果不够再加
				.populate({
					path: 'parentMenu',
					populate: {
						path: 'parentMenu',
						populate: {
							path: 'parentMenu'
						}
					}
				})
				.lean()
				.exec()
			const menusWithParent = await this.toggleRouterList(list, onlyParent)
			const count = await this.menusModel.countDocuments(filter)
			return {
				list: list,
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
	 * @description 检查菜单是否存在
	 */
	async hasMenu(id: string) {
		if (id) {
			const menu = await this.menusModel
				.findOne({
					_id: this.utilService.toObjectId(id)
				})
				.exec()
			if (isEmpty(menu)) {
				throw new ApiException(10303)
			}
		}
	}

	/**
	 * @description 增加菜单
	 */
	async addMenu(body: CreateMenuDto) {
		try {
			// 已在model中判断path为唯一
			this.hasMenu(body.parentMenu)
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
			this.hasMenu(body.parentMenu)
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
				.populate('parentMenu')
				.exec()
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
	async deleteMenu(id: string) {
		try {
			const menuId = this.utilService.toObjectId(id)
			const _ = await this.menusModel.findByIdAndDelete(menuId)
			if (isEmpty(_)) {
				throw new ApiException(10301)
			}
			// 删除所拥有的子菜单
			await this.menusModel.deleteMany({
				parentMenu: { $in: id }
			})
			// 查询对应的系统表，将包含的菜单同步删除
			await this.systemModel.updateMany(
				{
					menuIds: { $in: [menuId] }
				},
				{ $pull: { menuIds: { $in: [menuId] } } }
			)
			// 查询对应的角色系统表，将菜单同步删除
			const systemMenus = await this.roleSystemMenus.find({
				systemMenusIds: {
					$elemMatch: {
						menuIds: { $in: [menuId] }
					}
				}
			})
			await Promise.all(
				systemMenus.map(async (record) => {
					try {
						// 找到匹配的 systemMenusIds 子文档
						const updatedSystemMenusIds = record.systemMenusIds.map((item) => {
							const menuIds = item.menuIds.map((_) => _.toString())
							if (menuIds.includes(id)) {
								// 如果找到匹配的 systemMenu，则删除其中的 menuId
								const index = menuIds.indexOf(id)
								if (index !== -1) {
									item.menuIds.splice(index, 1)
								}
							}
							return item
						})
						// 更新数据库中的文档
						await this.roleSystemMenus.updateOne({ _id: record._id }, { $set: { systemMenusIds: updatedSystemMenusIds } })
					} catch (error) {
						return Promise.reject(error)
					}
				})
			)
			this.wsService.noticeUpdateMenus(0)
		} catch (error) {
			return Promise.reject(error)
		}
	}

	/**
	 * @description 循环生成children
	 */
	toggleChildren(children: Array<ChildrenMenuDto>, list: Array<UpdateMenuDto>) {
		if (children && children.length !== 0) {
			children.map((item, index) => {
				if (item._id.toString() === item.parentMenu) throw new ApiException(10304)
				const c = filter(list, (o) => o.parentMenu === item._id.toString()) || false
				if (c && c.length !== 0) {
					children[index].children = c
					this.toggleChildren(children[index]?.children, list)
				}
			})
		}
	}

	/**
	 * @description 挑选出一级路由
	 * @description 从所有菜单中找到传入menuIds的父级菜单
	 * @param menus 未过滤前的路由列表，menus里面的_id是字符串
	 */
	// a/b/c 只传了c过来，但是下面的方法找parentId，只能找到a，没有办法回显b
	async findParentIds(menus: Array<UpdateMenuDto>): Promise<Array<UpdateMenuDto>> {
		const parentMenus = []
		const findParent = async (menu: UpdateMenuDto) => {
			// 没有parentId，直接返回一级路由
			if (!menu.parentMenu) return parentMenus.push(menu)
			const parentMenu: UpdateMenuDto = await this.infoMenu(menu.parentMenu)
			// 判断父级路由存不存在
			if (parentMenu) {
				if (parentMenu.parentMenu) {
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
	 * @description 挑选出一级路由，转换成父子嵌套children的形式
	 * @param list 未过滤前的路由列表,里面的_id是ObjectId
	 * @param onlyParent 只需要父级,还是全部菜单都找一遍children
	 */
	async toggleRouterList(list: Array<UpdateMenuDto>, onlyParent = true): Promise<Array<UpdateMenuDto>> {
		// const map = new Map()
		// // 将数组中的对象按照 _id 映射到 Map 中
		// list.forEach((item) => {
		// 	map.set(item._id, { ...item, children: [] })
		// })
		if (onlyParent) {
			// const parent = (await this.findParentIds(sortList)) as Array<UpdateMenuDto>
			// return parent.map((_) => {
			// 	const children =
			// 		filter(sortList, (o: any) => {
			// 			return o.parentMenu?.toString() === _._id.toString()
			// 		}) || []
			// 	this.toggleChildren(children, sortList)
			// 	return { ..._, children }
			// })
			// console.log('🚀 ~ file: menu.service.ts:268 ~ MenuService ~ toggleRouterList ~ map:', map)
			// 构建嵌套结构
			const convertArray = (root) => {
				const indexed = keyBy(root, '_id')
				const buildTree = (node) => {
					const child = indexed[node.parentMenu?._id]
					if (child) {
						return {
							...node,
							children: [buildTree(child)]
						}
					} else {
						return { ...node, children: [] }
					}
				}
				const roots = filter(root, (node) => !node.parentMenu)
				const result = roots.map((item) => buildTree(item))
				return result
			}
			console.log(convertArray(list))
			return []
		} else {
			// return sortList.map((_) => {
			// 	const children = filter(sortList, (o: any) => o.parentMenu.toString() === _._id.toString()) || []
			// 	this.toggleChildren(children, sortList)
			// 	return { ..._, children }
			// })
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
	async getMenus(menuIdArray: Array<Types.ObjectId | string>): Promise<{ menus?: Array<CreateMenuDto>; menuIds?: Array<Types.ObjectId> }> {
		const uniqMenuIds = uniq(menuIdArray.map((_) => _.toString()))
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
	async handleMenus(menuIds: Array<Types.ObjectId>, onlyParent = true): Promise<Array<UpdateMenuDto>> {
		try {
			const ids = uniq(menuIds.map((_) => _.toString()))
			// const menus = await this.filterValMenus(ids)
			const { menus } = await this.getMenus(ids)
			return this.toggleRouterList(menus, onlyParent)
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
