import { Injectable } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { CreateSystemDto, QuerySystem, SystemIds, SystemInfoDto, SystemNameId, UpdateSystemDto } from './dto/admin-systen.dto'
import { intersection, isEmpty } from 'lodash'
import { MenuService } from '../menu/menu.service'
import { System } from '@app/db/modules/system/sys-system.model'
import { RoleSystemMenus } from '@app/db/modules/system/sys-role-system-menus.model'
import { PageList } from '@/common/class/res.class'
import { ApiException } from '@/service/exceptions/api.exception'
import { WSService } from '@/shared/websocket/ws.service'

@Injectable()
export class AdminSystemService {
	constructor(
		@InjectModel(System)
		private readonly systemModel: ReturnModelType<typeof System>,
		@InjectModel(RoleSystemMenus)
		private readonly roleSystemMenus: ReturnModelType<typeof RoleSystemMenus>,
		private menuService: MenuService,
		private wsService: WSService
	) {}

	/**
	 * @description 获取所有系统
	 */
	async listSystem(pagination, query: QuerySystem): Promise<PageList<SystemInfoDto>> {
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
					populate: {
						path: 'parentMenu',
						populate: {
							path: 'parentMenu',
							populate: {
								path: 'parentMenu'
							}
						}
					}
				})
				.lean()
				.exec()
			const list = await Promise.all(
				systemList.map(async (system) => {
					const menus = await this.menuService.toggleRouterList(system.menus)
					return {
						...system,
						menus
					}
				})
			)
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
	async updateSystem(body: UpdateSystemDto, id: string) {
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
	 */
	async infoSystem(id: string, isError?: boolean): Promise<SystemInfoDto> {
		try {
			const system = await this.systemModel.findById(id).lean().exec()
			if (isEmpty(system)) {
				if (!isError) {
					throw new ApiException(10201)
				} else {
					return null
				}
			}
			return system
		} catch (error) {
			return Promise.reject(error)
		}
	}

	/**
	 * @description 根据系统id返回处理以后的系统-菜单
	 * @params 系统ids
	 */
	async infoSystems({ systemIds }: SystemIds): Promise<Array<SystemInfoDto>> {
		try {
			const systemMenus = await Promise.all(
				systemIds.map(async (id) => {
					const info = await this.infoSystem(id, true)
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
	async getSystemIds(): Promise<Array<SystemNameId>> {
		try {
			return await this.systemModel.find().select('_id systemName')
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
