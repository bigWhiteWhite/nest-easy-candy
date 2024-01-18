import { Menus } from '@app/db/modules/system/sys-menus.model'
import { System } from '@app/db/modules/system/sys-system.model'
import { RoleSystemMenus } from '@app/db/modules/system/sys-role-system-menus.model'
import { Injectable } from '@nestjs/common'
import { CreateMenuDto, QueryMenu, MenuListDto, UpdateMenuDto } from './dto/menu.dto'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { isEmpty, uniq, groupBy } from 'lodash'
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
	async listMenu(pagination, query: QueryMenu): Promise<PageList<MenuListDto>> {
		try {
			const { name, outWarpParent, showBtnMenu = true } = query
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
			// 添加children
			const menusWithParent = await this.toggleRouterList(list, outWarpParent)
			const count = await this.menusModel.countDocuments(filter)
			return {
				list: menusWithParent,
				pagination: {
					pageSize: pageSize,
					current: current,
					total: outWarpParent ? count : menusWithParent.length
				}
			}
		} catch (error) {
			return Promise.reject(error)
		}
	}
	/**
	 * @description 检查菜单是否存在
	 */
	async hasMenu(id: string): Promise<void> {
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
	async infoMenu(id): Promise<MenuListDto> {
		try {
			const menus = await this.menusModel
				.findOne({
					_id: this.utilService.toObjectId(id),
					isEnable: 1
				})
				.sort({ pIndex: 1, cIndex: 1 })
				.populate({
					path: 'parentMenu',
					populate: {
						path: 'parentMenu',
						populate: {
							path: 'parentMenu'
						}
					}
				})
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
					menus: { $in: [menuId] }
				},
				{ $pull: { menus: { $in: [menuId] } } }
			)
			// 查询对应的角色系统表，将菜单同步删除
			const systemMenus = await this.roleSystemMenus.find({
				systemMenusIds: {
					$elemMatch: {
						menus: { $in: [menuId] }
					}
				}
			})
			await Promise.all(
				systemMenus.map(async (record) => {
					try {
						// 找到匹配的 systemMenusIds 子文档
						const updatedSystemMenusIds = record.systemMenusIds.map((item) => {
							const menuIds = item.menus.map((_) => _.toString())
							if (menuIds.includes(id)) {
								// 如果找到匹配的 systemMenu，则删除其中的 menuId
								const index = menuIds.indexOf(id)
								if (index !== -1) {
									item.menus.splice(index, 1)
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
	 * @description 根据parentMenu给菜单添加对应的children菜单
	 * @param outWarpParent 最外层是否只保存一级父集
	 */
	toggleRouterList(list: Array<UpdateMenuDto>, outWarpParent?: boolean): Array<MenuListDto> {
		let withoutParent = list
		let withParent = list
		if (!outWarpParent) {
			const groupedByParentMenu = groupBy(list, (node) => (node.parentMenu ? 'withParent' : 'withoutParent'))
			withoutParent = groupedByParentMenu['withoutParent'] || []
			withParent = groupedByParentMenu['withParent'] || []
		}
		const buildTree = (node) => {
			const { parentMenu, ...params } = node // 只返回parentId就够
			// 角色查询的时候传过来的parentMenu是字符串
			const parentId = typeof parentMenu === 'object' ? parentMenu?._id : parentMenu
			const children = withParent?.filter((child) => {
				const childPId = typeof child.parentMenu === 'object' ? child.parentMenu?._id : child.parentMenu
				return childPId.toString() === node._id.toString()
			})
			return {
				...params,
				parentId,
				children: children?.map((item) => buildTree(item))
			}
		}
		return withoutParent?.map((root) => buildTree(root))
	}

	/**
	 * @description 判断菜单列表是否存在于菜单表中,过滤出有效的菜单id
	 * @return 返回菜单和菜单ids
	 */
	async getMenus(menuIdArray: Array<Types.ObjectId | string>): Promise<{ menus?: Array<UpdateMenuDto>; menuIds?: Array<Types.ObjectId> }> {
		const uniqMenuIds = uniq(menuIdArray.map((_) => _.toString()))
		const menus = await this.menusModel
			.find({
				_id: { $in: uniqMenuIds.map((_) => this.utilService.toObjectId(_)) }
			})
			.lean()
			.exec() // .select('_id')
		const menuIds = menus.map((_) => _._id)
		return {
			menuIds,
			menus
		}
	}
	/**
	 * @description 获取指定的菜单menuIds并进行父子排序
	 * @param menuIds 指定menuIds
	 * @param outWarpParent 最外层是否只保存一级父集
	 */
	async handleMenus(menuIds: Array<Types.ObjectId>, outWarpParent?: boolean): Promise<Array<UpdateMenuDto>> {
		try {
			const ids = uniq(menuIds.map((_) => _.toString()))
			const { menus } = await this.getMenus(ids)
			return this.toggleRouterList(menus, outWarpParent)
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
