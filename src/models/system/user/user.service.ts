import { RedisService } from '@/shared/redis/redis.service'
import { UtilService } from '@/shared/tools/util.service'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { isEmpty } from 'lodash'
import { ImageCaptcha } from './user.class'
import * as svgCaptcha from 'svg-captcha'
import { ImageCaptchaDto } from './dto'
import { ApiException } from '@/service/exceptions/api.exception'
import SysUser from '@/entities/server/sys-user.entity'
import { EntityManager, Repository } from 'typeorm'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { CreateUserDto } from './dto/user.dto'
import { AdminUser } from '../system.interface'
import { hashSync } from 'bcryptjs'
@Injectable()
export class UserService {
	constructor(
		private readonly redisService: RedisService,
		private readonly jwtService: JwtService,
		private readonly utilService: UtilService,
		@InjectRepository(SysUser) private userRepository: Repository<SysUser>,
		@InjectEntityManager() private entityManager: EntityManager
	) {}
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
			charPreset: this.utilService.generateRandomValue(10)
		})
		const result = {
			validCode: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString('base64')}`,
			validId: this.utilService.generateUUID() // this.utils.generateUUID()
		}
		// 5分钟过期时间
		await this.redisService.getRedis().set(`server:captcha:code:${result.validId}`, svg.text, 'EX', 60 * 5)
		return result
	}
	/**
	 * 校验验证码
	 */
	async checkImgCaptcha(validId: string, validCode: string): Promise<void> {
		const result = await this.redisService.getRedis().get(`server:captcha:code:${validId}`)
		if (isEmpty(result) || validCode.toLowerCase() !== result.toLowerCase()) {
			throw new ApiException(10002)
		}
		// 校验成功后移除验证码
		await this.redisService.getRedis().del(`server:captcha:code:${validId}`)
	}

	/**
	 * 禁用用户, 清除登录状态信息
	 */
	async clearLoginStatus(uid: number): Promise<void> {
		await this.redisService.getRedis().del(`server:passwordVersion:${uid}`)
		await this.redisService.getRedis().del(`server:token:${uid}`)
		await this.redisService.getRedis().del(`server:perms:${uid}`)
	}

	/**
	 * 用户注册，如果返回false则表示已存在该用户
	 */
	async register(body: CreateUserDto) {
		const exists = this.userRepository.findOne({
			where: { phone: body.phone }
		})
		if (!isEmpty(exists)) {
			throw new ApiException(10001)
		}
		// 事务
		await this.entityManager.transaction(async (manager) => {
			const user = manager.create(SysUser, {
				phone: body.phone,
				password: body.password ? hashSync(body.password) : body.password
			})
			await manager.save(user)
		})
	}

	/**
	 * 用户登录
	 */
	async login(user: AdminUser, ip: string, ua: string) {
		const oldToken = await this.getRedisTokenById(user.id)
		// 每次登录都将密码版本设置为1
		await this.redisService.getRedis().set(`server:passwordVersion:${user.id}`, 1)
		// 目前是多点登录
		if (oldToken) return oldToken
		else {
			const jwtSign = this.jwtService.sign({
				id: String(user.id),
				pv: 1,
				username: user.username,
				phone: user.phone,
				status: user.status
			})
			return jwtSign
		}
	}

	async getRedisPasswordVersionById(id: number): Promise<string> {
		return this.redisService.getRedis().get(`server:passwordVersion:${id}`)
	}

	async getRedisTokenById(id: number): Promise<string> {
		return this.redisService.getRedis().get(`server:token:${id}`)
	}

	async getRedisPermsById(id: number): Promise<string> {
		return this.redisService.getRedis().get(`server:perms:${id}`)
	}
}
