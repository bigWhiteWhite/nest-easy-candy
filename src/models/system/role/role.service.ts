import { Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { isEmpty, unionBy } from 'lodash'
import { RoleSystemMenus } from '@app/db/modules/system/sys-role-system-menus.model'
import { Role } from '@app/db/modules/system/sys-role.model'
import { User } from '@app/db/modules/system/sys-user.model'
import { ApiException } from '@/service/exceptions/api.exception'
import { WSService } from '@/shared/websocket/ws.service'
import { AdminSystemService } from '../admin-system/admin-system.service'
import { MenuService } from '../menu/menu.service'

@Injectable()
export class RoleService {
	constructor(
		@InjectModel(Role)
		private readonly roleModel: ReturnModelType<typeof Role>,
		@InjectModel(RoleSystemMenus)
		private readonly roleSystemMenus: ReturnModelType<typeof RoleSystemMenus>,
		@InjectModel(User)
		private readonly userModel: ReturnModelType<typeof User>,
		private readonly adminSystemService: AdminSystemService,
		private menuService: MenuService,
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
			const systemMenusIds = await Promise.all(
				unionBy(roleBody.systemMenusIds, 'system').map(async (item) => {
					return {
						system: item.system,
						menus: await this.adminSystemService.filterSystemMenu(item.system, item.menus)
					}
				})
			)
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
			const role = await this.roleModel
				.findById(id)
				.populate({
					path: 'roleSystemMenus',
					select: 'roleSystemMenus', // 可选字段 前面加-号是排除
					populate: {
						path: 'systemMenusIds',
						strictPopulate: false, // 设置为允许填充不在架构中的路径
						populate: [
							{
								strictPopulate: false, // 设置为允许填充不在架构中的路径
								path: 'system',
								model: 'System', // 用于填充的模型的可选名称
								select: 'systemName systemValue' // 可选字段 前面加-号是排除
							},
							{
								strictPopulate: false,
								path: 'menus',
								model: 'Menus',
								populate: {
									path: 'parentMenu',
									model: 'Menus',
									populate: {
										path: 'parentMenu',
										model: 'Menus',
										populate: {
											path: 'parentMenu',
											model: 'Menus'
										}
									}
								}
							}
						]
					}
				})
				.lean()
				.exec()
			if (isEmpty(role)) {
				if (!isError) {
					throw new ApiException(10401)
				} else {
					return null
				}
			}
			// const roleSystemMenus = role.roleSystemMenus.map((item) => {
			// 	console.log('🚀 ~ file: role.service.ts:137 ~ RoleService ~ roleSystemMenus ~ item:', item)
			// 	const systemMenusIds = item.systemMenusIds.map((systemMenus) => {
			// 		return {
			// 			...systemMenus,
			// 			menus: this.menuService.toggleRouterList(systemMenus.menus)
			// 		}
			// 	})
			// 	return {
			// 		...item,
			// 		systemMenusIds
			// 	}
			// })
			console.log('🚀 ~ file: role.service.ts:158 ~ RoleService ~ //roleSystemMenus ~  role.roleSystemMenus:', role.roleSystemMenus)

			return {
				...role
				// roleSystemMenus: role
			}
		} catch (error) {
			return Promise.reject(error)
		}
	}

	async update(id: string, roleBody: CreateRoleDto) {
		try {
			const hasRole = await this.roleModel.findById(id)
			if (!hasRole) throw new ApiException(10401)
			// 更新角色
			await this.roleModel.findByIdAndUpdate(id, {
				roleName: roleBody.roleName,
				remark: roleBody.remark
			})
			// 更新角色系统关联
			await this.roleSystemMenus.updateOne(
				{ roleSystemId: id },
				{
					$set: { systemMenusIds: roleBody.systemMenusIds }
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
			await this.roleModel.findByIdAndDelete(id)
			await this.roleSystemMenus.findOneAndDelete({
				roleSystemId: id
			})
			// 查询对应的用户表，将包含的角色同步删除
			await this.userModel.updateMany(
				{
					roles: { $in: [id] }
				},
				{ $pull: { roles: id } }
			)
			// 角色改变，通知重新获取菜单
			this.wsService.noticeUpdateMenus(2, id)
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
