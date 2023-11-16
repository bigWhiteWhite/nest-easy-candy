import { Injectable } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import {
	CreateSystemDto,
	QuerySystem,
	SystemIds,
	SystemInfoDto,
	UpdateSystemDto
} from './dto/admin-systen.dto'
import { isEmpty } from 'lodash'
import { MenuService } from '../menu/menu.service'
import { System } from '@app/db/modules/system/sys-system.model'
import { PageList } from 'src/common/dto/page.dto'
import { ApiException } from 'src/service/exceptions/api.exception'
import { WSService } from 'src/shared/websocket/ws.service'

@Injectable()
export class AdminSystemService {
	constructor(
		@InjectModel(System)
		private readonly systemModel: ReturnModelType<typeof System>,
		private menuService: MenuService,
		private wsService: WSService
	) {}

	/**
	 * @description 获取所有系统
	 */
	async listSystem(
		pagination,
		query: QuerySystem
	): Promise<PageList<CreateSystemDto>> {
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
				.lean()
			const count = await this.systemModel.countDocuments(filter)
			const list: Array<CreateSystemDto> = await Promise.all(
				systemList.map(async (system) => {
					const menus = await this.menuService.handleMenus(system.menuIds, true)
					return {
						...system,
						menus
					}
				})
			)
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
			const { menuIds } = await this.menuService.getMenus(body.menuIds)
			return await this.systemModel.create({
				...body,
				menuIds
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
			const { menuIds } = await this.menuService.getMenus(body.menuIds)
			const system = await this.systemModel.findByIdAndUpdate(id, {
				...body,
				menuIds
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
			const system = await this.systemModel.findById(id).lean()
			if (isEmpty(system)) {
				if (!isError) {
					throw new ApiException(10201)
				} else {
					return null
				}
			}
			const menus = await this.menuService.handleMenus(system.menuIds, true)
			return { ...system, menus }
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

	async getSystemIds() {
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
			this.wsService.noticeUpdateMenus(1, system.systemName)
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
