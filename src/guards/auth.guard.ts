import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { isEmpty } from 'lodash'
import { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { API_USER, AUTHORIZE_KEY_METADATA } from '../app.constant'
import { ApiException } from '../service/exceptions/api.exception'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '@/models/system/user/user.service'

// 注册身份验证守卫
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService, private readonly userService: UserService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// 检测是否是开放类型的，例如获取验证码类型的接口不需要校验，可以加入@Authorize可自动放过
		const authorize = this.reflector.get<boolean>(AUTHORIZE_KEY_METADATA, context.getHandler())
		if (authorize) {
			return true
		}
		const request = context.switchToHttp().getRequest<Request>()
		const token = request.headers['authorization'] as string
		if (isEmpty(token)) {
			throw new ApiException(11001)
		}
		try {
			// 挂载对象到当前请求上
			request[API_USER] = this.jwtService.verify(token)
		} catch (e) {
			// 无法通过token校验
			throw new ApiException(11001)
		}
		if (isEmpty(request[API_USER])) {
			throw new ApiException(11001)
		}
		const pv = await this.userService.getRedisPasswordVersionById(request[API_USER].uid)
		if (pv !== `${request[API_USER].pv}`) {
			// 密码版本不一致，登录期间已更改过密码
			throw new ApiException(11002)
		}
		const redisToken = await this.userService.getRedisTokenById(request[API_USER].uid)
		if (token !== redisToken) {
			// 与redis保存不一致
			throw new ApiException(11002)
		}
		const perms: string = await this.userService.getRedisPermsById(request[API_USER].uid)
		// 安全判空
		if (isEmpty(perms)) {
			throw new ApiException(11001)
		}
		// pass
		return true
	}
}
