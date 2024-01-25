import { Menus } from '@app/db/modules/system/sys-menus.model'
import { System } from '@app/db/modules/system/sys-system.model'
import { RoleSystemMenus } from '@app/db/modules/system/sys-role-system-menus.model'
import { Injectable } from '@nestjs/common'
import { CreateMenuDto, QueryMenu, MenuListDto, UpdateMenuDto } from './dto/menu.dto'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { isEmpty, uniq, unionBy } from 'lodash'
import { PageList } from '@/common/class/res.class'
import { ApiException } from '@/service/exceptions/api.exception'
import { UtilService } from '@/shared/tools/util.service'
import { WSService } from '@/shared/websocket/ws.service'
import { PopulateOptions, Types } from 'mongoose'
@Injectable()
export class MenuService {
	readonly menuPopConfig = {} as PopulateOptions // 填充菜单配置

	constructor(
		@InjectModel(Menus)
		private readonly menusModel: ReturnModelType<typeof Menus>,
		@InjectModel(System)
		private readonly systemModel: ReturnModelType<typeof System>,
		@InjectModel(RoleSystemMenus)
		private readonly roleSystemMenus: ReturnModelType<typeof RoleSystemMenus>,
		private readonly utilService: UtilService,
		private readonly wsService: WSService
	) {
		this.menuPopConfig = this.utilService.generatePopulateConfig('parentMenu', 4, {
			model: 'Menus',
			options: {
				lean: true
			}
		})
	}

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
			const parentPopConfig = this.utilService.generatePopulateConfig('parentMenu', 4, {
				model: 'Menus',
				options: {
					lean: true
				}
			})
			const list = await this.menusModel
				.find(
					filter,
					{},
					{
						sort: { updatedAt: -1 },
						limit: pageSize,
						skip: (current - 1) * pageSize
					}
				)
				// 三级嵌套填充关联文档，如果不够再加
				.populate(parentPopConfig)
				.lean()
				.exec()
			// 添加children，这里无需使用handleMenus方法，因为已经把所有的菜单都传过去，不会漏子菜单
			const menusWithParent = this.toggleRouterList(list, outWarpParent)
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
	 * @description ?更新了父级菜单？
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
	async infoMenu(id: string, shouldPopulate?: boolean): Promise<MenuListDto> {
		try {
			const query = this.menusModel
				.findOne({
					_id: this.utilService.toObjectId(id),
					isEnable: 1
				})
				.sort({ pIndex: 1, cIndex: 1 })
			if (shouldPopulate) {
				query.populate(this.menuPopConfig)
			}
			const menus = await query.exec()
			if (!isEmpty(menus)) {
				return menus
			}
		} catch (error) {
			return Promise.reject(error)
		}
	}

	/**
	 * @description 找寻该id下所有的子菜单id
	 */
	async findChildIds(id: Types.ObjectId) {
		try {
			const childIds = []
			const findChildId = async (ids: Array<Types.ObjectId>) => {
				await Promise.all(
					ids.map(async (id) => {
						childIds.push(id)
						const menus = await this.menusModel
							.find({
								parentMenu: { $in: [id] }
							})
							.select('_id')
							.lean()
							.exec()
						if (menus.length > 0) {
							await findChildId(menus.map((_) => _._id))
						}
					})
				)
			}
			await findChildId([id])
			return childIds
		} catch (error) {
			return Promise.reject(error)
		}
	}

	/**
	 * @description 删除 - 如果有子节点，需要将子节点的菜单也删掉
	 */
	async deleteMenu(id: string) {
		try {
			const menuIds = await this.findChildIds(this.utilService.toObjectId(id))
			const _ = await this.menusModel.deleteMany({
				_id: menuIds
			})
			if (isEmpty(_)) {
				throw new ApiException(10301)
			}
			// 查询对应的系统表，将包含的菜单同步删除
			await this.systemModel.updateMany(
				{
					menus: { $in: menuIds }
				},
				{ $pull: { menus: { $in: menuIds } } }
			)
			// 查询对应的角色系统表，将菜单同步删除
			await this.roleSystemMenus.updateMany(
				{
					menus: { $in: menuIds }
				},
				{ $pull: { menus: { $in: menuIds } } }
			)
			this.wsService.noticeUpdateMenus(0)
		} catch (error) {
			return Promise.reject(error)
		}
	}

	/**
	 * @description 根据parentMenu给菜单添加对应的children菜单
	 * @param outWarpParent 最外层是否只保存一级父集,默认保存
	 * @param list 菜单id如果是父级菜单，则需要找出下属的所有子菜单id
	 */
	toggleRouterList(list: Array<UpdateMenuDto>, outWarpParent?: boolean): Array<MenuListDto> {
		let withParent = list
		let withoutParent = list
		if (!outWarpParent) {
			const menuTopParent = [] // 顶点父级路由
			const menuWithParent = [] // 父级路由不包含顶点
			const getParentLevel = (item: UpdateMenuDto) => {
				const data = {
					...item,
					_id: item._id.toString()
				}
				if (item.parentMenu) {
					menuWithParent.push(data)
					getParentLevel(data.parentMenu)
				} else {
					menuTopParent.push(data)
				}
			}
			list.map((item) => getParentLevel(item)) // 找出并分类父级路由
			// const a = this.findChildIds(list.map((_) => this.utilService.toObjectId(_._id)))
			withoutParent = unionBy(menuTopParent, '_id')
			withParent = unionBy(menuWithParent, '_id')
		}
		const buildTree = (node) => {
			const { parentMenu, ...params } = node // 只返回parentId就够
			const children = withParent?.filter((child) => {
				return child.parentMenu?._id.toString() === node._id.toString()
			})
			return {
				...params,
				parentId: parentMenu?._id,
				children: children?.map((item) => buildTree(item))
			}
		}
		return withoutParent?.map((root) => buildTree(root))
	}

	/**
	 * @description 判断菜单列表是否存在于菜单表中,过滤出有效的菜单id
	 * @params needChildMenu 是否找出菜单下属的所有子菜单
	 * @return 返回菜单和菜单ids
	 */
	async getMenus(
		menuIdArray: Array<Types.ObjectId | string>,
		needChildMenu = false
	): Promise<{ menus?: Array<UpdateMenuDto>; menuIds?: Array<Types.ObjectId> }> {
		let uniqMenuIds = uniq(menuIdArray.map((_) => _.toString()))
		if (needChildMenu) {
			// 找出菜单下属的所有子菜单
			let childMenuId = []
			const findChildIds = async (ids) => {
				const childMenu = await this.menusModel
					.find({
						parentMenu: { $in: ids.map((_) => this.utilService.toObjectId(_)) }
						// parentMenu: { $in: uniqMenuIds.map((_) => this.utilService.toObjectId(_)) }
					})
					.select('_id')
					.lean()
					.exec()
				if (childMenu.length > 0) {
					const childIds = childMenu.map((_) => _._id) as Array<Types.ObjectId>
					childMenuId = childMenuId.concat(childIds)
					await findChildIds(childIds)
				}
			}
			await findChildIds(uniqMenuIds)
			uniqMenuIds = uniqMenuIds.concat(childMenuId)
		}
		const menus = await this.menusModel
			.find({
				_id: { $in: uniqMenuIds.map((_) => this.utilService.toObjectId(_)) }
			})
			.populate(this.menuPopConfig)
			.lean()
			.exec()
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
	async handleMenus(menuIds: Array<Types.ObjectId | string>, outWarpParent?: boolean): Promise<Array<UpdateMenuDto>> {
		try {
			const ids = uniq(menuIds.map((_) => _.toString()))
			const { menus } = await this.getMenus(ids, true)
			return this.toggleRouterList(menus, outWarpParent)
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
