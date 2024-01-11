import { Injectable } from '@nestjs/common'
import { CreateRoleDto, SystemMenusIdsType } from './dto/create-role.dto'
import { AdminSystemService } from '../admin-system/admin-system.service'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { intersection, isEmpty, unionBy } from 'lodash'
import { MenuService } from '../menu/menu.service'
import { RoleSystemMenus } from '@app/db/modules/system/sys-role-system-menus.model'
import { Role } from '@app/db/modules/system/sys-role.model'
import { System } from '@app/db/modules/system/sys-system.model'
import { User } from '@app/db/modules/system/sys-user.model'
import { ApiException } from '@/service/exceptions/api.exception'
import { UtilService } from '@/shared/tools/util.service'
import { WSService } from '@/shared/websocket/ws.service'

@Injectable()
export class RoleService {
	constructor(
		@InjectModel(System)
		private readonly systemModel: ReturnModelType<typeof System>,
		@InjectModel(Role)
		private readonly roleModel: ReturnModelType<typeof Role>,
		@InjectModel(RoleSystemMenus)
		private readonly roleSystemMenus: ReturnModelType<typeof RoleSystemMenus>,
		@InjectModel(User)
		private readonly userModel: ReturnModelType<typeof User>,
		private readonly adminSystemService: AdminSystemService,
		private readonly menuService: MenuService,
		private readonly utilService: UtilService,
		private wsService: WSService
	) {}

	/**
	 * @description 角色表添加，判断有无角色
	 * @description 角色系统表关联，判断有无系统，系统合并，系统菜单合并，判断菜单是否存在
	 */
	async create(roleBody: CreateRoleDto) {
		try {
			const hasRole = await this.roleModel.findOne({
				// 判断角色是否存在
				roleName: roleBody.roleName
			})
			if (hasRole) throw new ApiException(10400)
			const systemMenusIds = await this.checkSystemMenu(roleBody)
			// 创建角色
			const { _id } = await this.roleModel.create({
				roleName: roleBody.roleName,
				remark: roleBody.remark
			})
			// 创建角色系统关联
			await this.roleSystemMenus.create({
				roleSystemId: _id,
				systemMenusIds
			})
		} catch (error) {
			return Promise.reject(error)
		}
	}

	async listRole(pagination, query) {
		try {
			const { roleName } = query
			const filter = {} as any
			if (roleName) {
				// 模糊查询
				filter.roleName = {
					$regex: roleName,
					$options: 'i' // 忽略大小写
				}
			}
			const { current = 1, pageSize = 10 } = pagination
			const roleList = await this.roleModel
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
			const count = await this.roleModel.countDocuments(filter)
			return {
				list: roleList,
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

	async findOne(id: string, isError?: boolean) {
		try {
			const role = await this.roleModel.findById(id).lean()
			if (isEmpty(role)) {
				if (!isError) {
					throw new ApiException(10401)
				} else {
					return null
				}
			}
			const { systemMenusIds } = await this.roleSystemMenus.findOne({
				roleSystemId: role._id
			})
			const systems = []
			await Promise.all(
				systemMenusIds.map(async (item) => {
					const info = await this.adminSystemService.infoSystem(item.systemId, true)
					if (info) {
						const { menus, menuIds: sysMenuIds, ...system } = info
						// 存在于系统中的菜单才是角色的有效的菜单
						const interIds = intersection(
							sysMenuIds.map((_) => _.toString()),
							item.menuIds.map((_) => _.toString())
						)
						const { menuIds } = await this.menuService.getMenus(interIds)
						systems.push({
							system,
							menuIds, // 拥有的菜单id
							menus // 系统下的所有菜单
						})
					}
				})
			)
			return { ...role, systems }
		} catch (error) {
			return Promise.reject(error)
		}
	}

	async update(id: string, roleBody: CreateRoleDto) {
		try {
			const hasRole = await this.roleModel.findById(id)
			// this.utilService.compareData(, updateRoleDto)
			if (!hasRole) throw new ApiException(10401)
			const systemMenusIds = await this.checkSystemMenu(roleBody)
			// 更新角色
			await this.roleModel.findByIdAndUpdate(id, {
				roleName: roleBody.roleName,
				remark: roleBody.remark
			})
			// 更新角色系统关联
			await this.roleSystemMenus.updateOne(
				{ roleSystemId: id },
				{
					$set: { systemMenusIds }
				}
			)
			// 角色改变，通知重新获取菜单
			this.wsService.noticeUpdateMenus(2, id)
		} catch (error) {
			return Promise.reject(error)
		}
	}

	async remove(id: string) {
		try {
			await this.roleModel.findByIdAndRemove(id)
			await this.roleSystemMenus.remove({
				roleSystemId: id
			})
			// 查询对应的用户表，将包含的角色同步删除
			await this.userModel.updateMany(
				{
					roles: { $in: [id] }
				},
				{ $pull: { roles: id } },
				{ multi: true }
			)
			// 角色改变，通知重新获取菜单
			this.wsService.noticeUpdateMenus(2, id)
		} catch (error) {
			return Promise.reject(error)
		}
	}

	async checkSystemMenu(roleBody: CreateRoleDto): Promise<Array<SystemMenusIdsType>> {
		try {
			const systemMenusIds = []
			await Promise.all(
				unionBy(roleBody.systemMenusIds, 'systemId').map(async (item: SystemMenusIdsType) => {
					// 判断系统是否存在
					const exists = await this.systemModel.findOne({
						_id: this.utilService.toObjectId(item.systemId)
					})
					if (!exists) {
						throw new ApiException(10201)
					}
					const { menuIds } = await this.menuService.getMenus(
						// 判断菜单是否存在
						item.menuIds
					)
					systemMenusIds.push({
						systemId: item.systemId,
						systemName: item.systemName,
						menuIds
					})
				})
			)
			return systemMenusIds
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
