import { Injectable } from '@nestjs/common'
import { User } from '@app/db/modules/system/sys-user.model'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import {
	DeleteAuthDto,
	EditAuthDto,
	ImageCaptchaDto,
	RegisterAuthDto
} from './dto/user.dto'
import { faker } from '@faker-js/faker'
import { JwtService } from '@nestjs/jwt'
import { isEmpty, union } from 'lodash'
import { ImageCaptcha } from './user.class'
import * as svgCaptcha from 'svg-captcha'
import { Types } from 'mongoose'
import { compareSync } from 'bcryptjs'
import { ConfigService } from '@nestjs/config'
import {
	QueryUser,
	UserSysInfo,
	UserSysMenuId,
	UserSystemMenus
} from './dto/user-query.dto'
import { RoleService } from '../role/role.service'
import { MenuService } from '../menu/menu.service'
import { AdminUser } from '../system.interface'
import { LogService } from '../log/log.service'
import { USER_INIT_PASSWORD } from 'src/admin.constant'
import { ApiException } from 'src/service/exceptions/api.exception'
import { RedisService } from 'src/shared/redis/redis.service'
import { UtilService } from 'src/shared/tools/util.service'
import { EVENT_UPDATE_MENU, EVENT_KICK } from 'src/shared/websocket/ws.event'
import { WSService } from 'src/shared/websocket/ws.service'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User)
		private readonly userModel: ReturnModelType<typeof User>,
		private redisService: RedisService,
		private jwtService: JwtService,
		private utilService: UtilService,
		private configService: ConfigService,
		private roleService: RoleService,
		private menuService: MenuService,
		private logService: LogService,
		private wsService: WSService
	) {}

	/**
	 * 增加假用户数据
	 * @param param Object 对应SysUser实体类
	 */
	async generate(fakeNum: number) {
		const users = Array(Number(fakeNum))
			.fill(null)
			.map(() => ({
				username: faker.internet.userName(), // 随机生成的用户名
				account: faker.finance.accountNumber(), // 随机生成的帐号
				password: faker.internet.password(), // 随机生成的密码
				phone: faker.phone.number(), // 随机生成的电话号码
				userAvatar: faker.image.avatar() // 随机生成的头像URL
			}))
		await this.userModel.insertMany(users)
	}

	async listUser(pagination, query: QueryUser) {
		try {
			const { username } = query
			const filter = {} as any
			if (username) {
				// 模糊查询
				filter.username = {
					$regex: username,
					$options: 'i' // 忽略大小写
				}
			}
			const { current = 1, pageSize = 10 } = pagination
			const userList = await this.userModel
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
			const count = await this.userModel.countDocuments(filter)
			return {
				list: userList,
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
	 * 增加系统用户，如果返回false则表示已存在该用户
	 * @param param Object 对应SysUser实体类
	 */
	async register(body: RegisterAuthDto) {
		const exists = await this.userModel.findOne({
			account: body.account
		})
		if (!isEmpty(exists)) {
			throw new ApiException(10001)
		}
		if (!body.password) body.password = USER_INIT_PASSWORD
		return await this.userModel.create(body)
	}

	/**
	 * 编辑用户信息
	 */
	async edit(body: EditAuthDto, userId: string) {
		await this.userModel.findByIdAndUpdate(userId, body)
		this.wsService.noticeUsersUpdateMenus(userId, EVENT_UPDATE_MENU)
	}

	/**
	 * 删除单个用户
	 */
	async delete(userId: string) {
		await this.userModel.findByIdAndRemove(userId)
		this.wsService.noticeUsersUpdateMenus(userId, EVENT_KICK)
	}

	/**
	 * 批量删除用户
	 */
	async deleteMany(_: DeleteAuthDto) {
		const { userIds } = _
		await this.userModel.deleteMany({
			_id: { $in: userIds.map((_) => Types.ObjectId(_)) }
		})
		userIds.map((_) => {
			this.wsService.noticeUsersUpdateMenus(_, EVENT_KICK)
		})
	}

	/**
	 * 查找用户信息
	 * @param userId 用户id
	 */
	async info(userId: string): Promise<UserSysInfo> {
		const user = await this.userModel
			.findOne({
				_id: userId
			})
			.lean()
		if (isEmpty(user)) {
			throw new ApiException(10017)
		}
		const userSysMenuId = [] as Array<UserSysMenuId>
		await Promise.all(
			user.roles.map(async (roleId) => {
				const role = await this.roleService.findOne(roleId, true)
				if (role) {
					role.systems.map((item) => {
						const userSysMenu = userSysMenuId.find((sysMenus) => {
							return sysMenus._id.toString() === item.system?._id.toString()
						})
						if (userSysMenu) {
							userSysMenu.menuIds = union(userSysMenu.menuIds, item.menuIds)
						} else {
							userSysMenuId.push({
								...item.system,
								menuIds: item.menuIds
							})
						}
					})
				} else {
					user.roles = user.roles.filter((id) => id !== roleId) // 删除对应的 roleId
				}
			})
		)
		const userSystemMenus: Array<UserSystemMenus> = await Promise.all(
			userSysMenuId.map(async (sysMenu) => {
				const { menuIds, ..._ } = sysMenu
				const menus = await this.menuService.handleMenus(menuIds, true)
				return {
					..._,
					menus
				}
			})
		)
		return { ...user, userSystemMenus }
	}

	/**
	 * 创建验证码并缓存加入redis缓存
	 * @param captcha 验证码长宽
	 * @returns svg & id obj
	 */
	async createImageCaptcha(captcha: ImageCaptchaDto): Promise<ImageCaptcha> {
		const svg = svgCaptcha.create({
			size: 4,
			color: true,
			noise: 4,
			width: isEmpty(captcha.width) ? 100 : captcha.width,
			height: isEmpty(captcha.height) ? 50 : captcha.height,
			charPreset: '1234567890abcdefg'
		})
		const result = {
			validCode: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString(
				'base64'
			)}`,
			validId: this.utilService.generateUUID() // this.utils.generateUUID()
		}
		// 5分钟过期时间
		await this.redisService
			.getRedis()
			.set(`admin:captcha:code:${result.validId}`, svg.text, 'EX', 60 * 5)
		return result
	}

	/**
	 * 校验验证码
	 */
	async checkImgCaptcha(validId: string, validCode: string): Promise<void> {
		const result = await this.redisService
			.getRedis()
			.get(`admin:captcha:code:${validId}`)
		if (isEmpty(result) || validCode.toLowerCase() !== result.toLowerCase()) {
			throw new ApiException(10002)
		}
		// 校验成功后移除验证码
		await this.redisService.getRedis().del(`admin:captcha:code:${validId}`)
	}

	/**
	 * 用户登录
	 */
	async login(user: AdminUser, ip: string, ua: string) {
		const oldToken = await this.getRedisTokenById(user._id)
		// 每次登录都将密码版本设置为1
		await this.redisService
			.getRedis()
			.set(`admin:passwordVersion:${user._id}`, 1)
		// 目前是多点登录
		if (oldToken) return oldToken
		else {
			const jwtSign = this.jwtService.sign({
				_id: String(user._id),
				pv: 1,
				username: user.username,
				phone: user.phone,
				status: user.status
			})
			// Token设置过期时间 48小时， 需要同步更改jwtService的过期时间
			await this.redisService
				.getRedis()
				.set(
					`admin:token:${user._id}`,
					jwtSign,
					'EX',
					this.configService.get('jwtExpires')
				)
			// 设置用户所有的权限
			// await this.redisService
			// 	.getRedis()
			// 	.set(`admin:perms:${userId}`, JSON.stringify(perms))
			this.logService.saveLoginLog(user, ip, ua)
			return jwtSign
		}
	}

	/**
	 * 退出登录
	 */
	async logout(userId: string) {
		this.forbidden(userId)
	}

	/**
	 * 禁用用户
	 */
	async forbidden(userId: string): Promise<void> {
		// 清除用户的 JWT 令牌
		await this.redisService.getRedis().del(`admin:passwordVersion:${userId}`)
		// 可选：清除密码版本信息
		await this.redisService.getRedis().del(`admin:token:${userId}`)
		await this.redisService.getRedis().del(`admin:perms:${userId}`)
	}

	/**
	 * 用户更改密码
	 */
	async updatePassword(_id: string, { originPassword, newPassword }) {
		if (_id) {
			const user = await this.userModel
				.findOne({
					_id
				})
				.select('+password')
			if (isEmpty(user)) {
				throw new ApiException(10017)
			}
			// 验证旧密码
			const isValid = await compareSync(originPassword, user.password)
			if (!isValid) {
				throw new ApiException(10011)
			}
			await this.userModel.findByIdAndUpdate(_id, {
				password: newPassword
			})
			await this.upgradePasswordV(_id)
		} else {
			throw new ApiException(11002)
		}
	}

	/**
	 * 升级用户版本密码
	 */
	async upgradePasswordV(_id: string): Promise<void> {
		const v = await this.getRedisPasswordVersionById(_id)
		if (!isEmpty(v)) {
			await this.redisService
				.getRedis()
				.set(`admin:passwordVersion:${_id}`, this.utilService.generateUUID())
		}
	}

	// 获取用户登录过程中的密码版本
	async getRedisPasswordVersionById(_id: string): Promise<string> {
		return this.redisService.getRedis().get(`admin:passwordVersion:${_id}`)
	}

	async getRedisTokenById(id: string): Promise<string> {
		return this.redisService.getRedis().get(`admin:token:${id}`)
	}

	async getRedisPermsById(id: string): Promise<string> {
		return this.redisService.getRedis().get(`admin:perms:${id}`)
	}
}
