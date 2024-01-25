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
import { RoleSystemMenusInfo } from './dto/update-role.dto'
import { UtilService } from '@/shared/tools/util.service'
import { PopulateOptions, Types } from 'mongoose'

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
		private readonly utilService: UtilService,
		private readonly menuService: MenuService,
		private readonly wsService: WSService
	) {}

	/**
	 * @description 角色表添加，判断有无角色
	 * @description 角色系统表关联，判断有无系统，系统合并，系统菜单合并，判断菜单是否存在
	 */
	async create(roleBody: CreateRoleDto) {
		// 添加事务锁
		// const session = await this.roleModel.startSession()
		// session.startTransaction()
		try {
			const hasRole = await this.roleModel.findOne({
				// 判断角色是否存在
				roleName: roleBody.roleName
			})
			if (hasRole) throw new ApiException(10400)
			const role = await this.roleModel.create({
				roleName: roleBody.roleName,
				remark: roleBody.remark
			})
			await Promise.all(
				unionBy(roleBody.systemMenus, 'system').map(async (item) => {
					// 创建角色系统关联
					await this.roleSystemMenus.create({
						roleSystemId: role._id,
						system: item.system,
						menus: await this.adminSystemService.filterSystemMenu(item.system, item.menus)
					})
				})
			)
			// 创建角色 - 事务 https://mongoosejs.com/docs/api/model.html#Model.create()
			// const role = await this.roleModel.create(
			// 	[
			// 		{
			// 			roleName: roleBody.roleName,
			// 			remark: roleBody.remark
			// 		}
			// 	],
			// 	{
			// 		session
			// 	}
			// )
			// await Promise.all(
			// 	unionBy(roleBody.roleSystemMenus, 'system').map(async (item) => {
			// 		// 创建角色系统关联
			// 		await this.roleSystemMenus.create(
			// 			{
			// 				roleSystemId: role._id,
			// 				system: item.system,
			// 				menus: await this.adminSystemService.filterSystemMenu(item.system, item.menus)
			// 			},
			// 			{ session }
			// 		)
			// 	})
			// )
			// await session.commitTransaction()
		} catch (error) {
			// await session.abortTransaction()
			return Promise.reject(error)
		} finally {
			// session.endSession()
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

	async findRoleWithPopulate(id: string, isError?: boolean) {
		try {
			const role = (await this.roleModel
				.findById(id)
				.populate({
					path: 'roleSystemMenus',
					populate: [
						{
							strictPopulate: false, // 设置为允许填充不在架构中的路径
							path: 'system',
							model: 'System', // 用于填充的模型的可选名称
							select: 'systemName systemValue menus', // 可选字段 前面加-号是排除
							options: {
								lean: true // 通过 Mongoose 的 populate 方法填充的,返回的是Mongoose文档而不是普通的 JavaScript 对象
							}
						}
					]
				})
				.lean()
				.exec()) as unknown as RoleSystemMenusInfo
			if (isEmpty(role)) {
				if (!isError) {
					throw new ApiException(10401)
				} else {
					return null
				}
			}
			const roleSystemMenus = await Promise.all(
				role.roleSystemMenus.map(async (item) => {
					return {
						system: {
							_id: item.system._id,
							systemName: item.system.systemName,
							systemValue: item.system.systemValue
						},
						systemMenus: await this.menuService.handleMenus((item.system.menus as Array<Types.ObjectId>) || []),
						menus: await this.menuService.handleMenus(item.menus as Array<Types.ObjectId>)
					}
				})
			)
			return {
				...role,
				roleSystemMenus
			}
		} catch (error) {
			return Promise.reject(error)
		}
	}

	async findRoleNoPopulate(id: string, isError?: boolean) {
		try {
			const role = (await this.roleModel
				.findById(id)
				.populate({
					path: 'roleSystemMenus',
					populate: [
						{
							strictPopulate: false, // 设置为允许填充不在架构中的路径
							path: 'system',
							model: 'System', // 用于填充的模型的可选名称
							select: 'systemName systemValue menus', // 可选字段 前面加-号是排除
							options: {
								lean: true // 通过 Mongoose 的 populate 方法填充的,返回的是Mongoose文档而不是普通的 JavaScript 对象
							}
						}
					]
				})
				.lean()
				.exec()) as unknown as RoleSystemMenusInfo
			if (isEmpty(role)) {
				if (!isError) {
					throw new ApiException(10401)
				} else {
					return null
				}
			}
			const roleSystemMenus = await Promise.all(
				role.roleSystemMenus.map(async (item) => {
					return {
						system: {
							_id: item.system._id,
							systemName: item.system.systemName,
							systemValue: item.system.systemValue
						},
						systemMenus: await this.menuService.handleMenus((item.system.menus as Array<Types.ObjectId>) || []),
						menus: item.menus
					}
				})
			)
			return {
				...role,
				roleSystemMenus
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
			await Promise.all(
				roleBody.systemMenus.map(async (item) => {
					await this.roleSystemMenus.updateOne(
						{ roleSystemId: id, system: item.system },
						{
							$set: { menus: item.menus }
						},
						{
							upsert: true // 找不到指定的记录则创建一条新的记录
						}
					)
				})
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
