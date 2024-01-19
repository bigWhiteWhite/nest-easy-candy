import { Injectable } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { CreateSystemDto, QuerySystem, SystemIds, SystemInfoDto, SystemInfo, SystemId } from './dto/admin-systen.dto'
import { intersection, isEmpty } from 'lodash'
import { MenuService } from '../menu/menu.service'
import { System } from '@app/db/modules/system/sys-system.model'
import { RoleSystemMenus } from '@app/db/modules/system/sys-role-system-menus.model'
import { PageList, PageOptionsDto } from '@/common/class/res.class'
import { ApiException } from '@/service/exceptions/api.exception'
import { WSService } from '@/shared/websocket/ws.service'
import { MenuListDto } from '../menu/dto/menu.dto'
import { UtilService } from '@/shared/tools/util.service'

@Injectable()
export class AdminSystemService {
	constructor(
		@InjectModel(System)
		private readonly systemModel: ReturnModelType<typeof System>,
		@InjectModel(RoleSystemMenus)
		private readonly roleSystemMenus: ReturnModelType<typeof RoleSystemMenus>,
		private menuService: MenuService,
		private utilService: UtilService,
		private wsService: WSService
	) {}

	/**
	 * @description 获取所有系统
	 */
	async listSystem(pagination: PageOptionsDto, query: QuerySystem): Promise<PageList<SystemInfoDto>> {
		try {
			const { systemName, systemValue } = query
			const filter = {} as any
			if (systemName) {
				// 模糊查询
				filter.systemName = {
					$regex: systemName,
					$options: 'i' // 忽略大小写
				}
			}
			if (systemValue) {
				// 模糊查询
				filter.systemValue = {
					$regex: systemValue,
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
			const systemList = await this.systemModel
				.find(
					filter,
					{},
					{
						sort: { updatedAt: -1 },
						limit: pageSize,
						skip: (current - 1) * pageSize
					}
				)
				.populate({
					path: 'menus',
					populate: parentPopConfig
				})
				.lean()
				.exec()
			const list = systemList.map((system) => {
				const menus = this.menuService.toggleRouterList(system.menus)
				return {
					...system,
					menus
				}
			})
			const count = await this.systemModel.countDocuments(filter)
			return {
				list,
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
	 * @description 增加系统 - 还需判断菜单id是否存在于菜单表里面
	 */
	async addSystem(body: CreateSystemDto) {
		try {
			const exists = await this.systemModel.findOne({
				systemValue: body.systemValue
			})
			if (!isEmpty(exists)) {
				throw new ApiException(10200)
			}
			const { menuIds } = await this.menuService.getMenus(body.menus)
			return await this.systemModel.create({
				...body,
				menus: menuIds
			})
		} catch (error) {
			return Promise.reject(error)
		}
	}

	/**
	 * @description 更新系统 - 系统添加或者更新的时候有什么menuId就添加什么menuId，但是查询的时候如果menuId有pId就要返回对应pId
	 * @description 更新系统 - 通知当前系统下面的用户重新获取系统菜单
	 */
	async updateSystem(body: CreateSystemDto, id: string) {
		try {
			const { menuIds } = await this.menuService.getMenus(body.menus)
			const system = await this.systemModel.findByIdAndUpdate(id, {
				...body,
				menus: menuIds
			})
			if (!system) {
				throw new ApiException(10201)
			}
			this.wsService.noticeUpdateMenus(1, system.systemName)
		} catch (error) {
			return Promise.reject(error)
		}
	}

	/**
	 * @description 获取系统信息
	 * @params systemId 系统ids
	 * @params isError 当找不到系统时是否报错，默然报错，传true不报错
	 * @params shouldPopulate 是否填充系统的菜单，不填充则返回菜单id
	 */
	async infoSystem({ systemId, isError, shouldPopulate }: SystemId): Promise<SystemInfoDto> {
		try {
			const query = this.systemModel.findById(systemId)
			if (shouldPopulate) {
				const parentPopConfig = this.utilService.generatePopulateConfig('parentMenu', 4, {
					model: 'Menus',
					options: {
						lean: true
					}
				})
				query.populate({
					path: 'menus',
					options: {
						lean: true
					},
					populate: parentPopConfig
				})
			}
			const system = await query.lean().exec()
			if (isEmpty(system)) {
				if (!isError) {
					throw new ApiException(10201)
				} else {
					return null
				}
			}
			let menus = system.menus as unknown as Array<MenuListDto>
			if (shouldPopulate) {
				menus = this.menuService.toggleRouterList(system.menus)
			}
			return {
				...system,
				menus
			}
		} catch (error) {
			return Promise.reject(error)
		}
	}

	/**
	 * @description 根据系统id返回处理以后的系统-菜单
	 * @params systemIds 系统ids
	 * @params isError 当找不到系统时是否报错，默然报错，传true不报错
	 * @params shouldPopulate 是否填充系统的菜单，不填充则返回菜单id
	 */
	async infoSystems({ systemIds, isError = true, shouldPopulate }: SystemIds): Promise<Array<SystemInfoDto>> {
		try {
			const systemMenus = await Promise.all(
				systemIds.map(async (systemId) => {
					const info = await this.infoSystem({ systemId, isError, shouldPopulate })
					if (info) return info
				})
			)
			return systemMenus
		} catch (error) {
			return Promise.reject(error)
		}
	}

	/**
	 * @description 返回所有系统的id和系统名称
	 */
	async getSystemIds(): Promise<Array<SystemInfo>> {
		try {
			return await this.systemModel.find()
			// .select('_id systemName systemValue')
		} catch (error) {
			return Promise.reject(error)
		}
	}

	/**
	 * @description 删除
	 */
	async deleteSystem(id) {
		try {
			const system = await this.systemModel.findByIdAndDelete(id)
			if (isEmpty(system)) {
				throw new ApiException(10201)
			}
			// 查询对应的角色系统表，将系统同步删除
			await this.roleSystemMenus.updateMany(
				{
					systemMenusIds: {
						$elemMatch: {
							systemId: id
						}
					}
				},
				{ $pull: { systemMenusIds: { systemId: id } } }
			)
			this.wsService.noticeUpdateMenus(1, system.systemName)
		} catch (error) {
			return Promise.reject(error)
		}
	}

	/**
	 * @description 过滤出存在于当前系统id的菜单
	 * @params systemId - 系统id
	 * @params menusIds -	菜单id数组
	 */
	async filterSystemMenu(systemId: string, menusIds: Array<string>) {
		try {
			const { menus } = await this.systemModel.findById(systemId).exec()
			return intersection(
				menus.map((_) => _.toString()),
				menusIds
			)
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
