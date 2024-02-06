import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { isEmpty } from 'lodash'
import { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { API_USER, AUTHORIZE_KEY_METADATA } from '../app.constant'
import { ApiException } from '../service/exceptions/api.exception'

// 注册身份验证守卫
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private reflector: Reflector, private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// 检测是否是开放类型的，例如获取验证码类型的接口不需要校验，可以加入@Authorize可自动放过
		const authorize = this.reflector.get<boolean>(AUTHORIZE_KEY_METADATA, context.getHandler())
		if (authorize) {
			return true
		}

		const request = context.switchToHttp().getRequest<Request>()
		const token = this.extractTokenFromHeader(request)
		if (isEmpty(token) || !this.validateAndSetUser(token, request)) {
			throw new ApiException(11001)
		}
		// 校验用户密码版本
		const pv = '1'
		if (pv && pv !== `${request[API_USER].pv}`) {
			// 密码版本不一致，登录期间已更改过密码
			throw new ApiException(11004)
		}
		return true
	}
	// 获取请求头上面的token
	private extractTokenFromHeader(request: Request): string | null {
		const authorizationHeader = request.headers['authorization'] as string
		return authorizationHeader?.replace('Bearer ', '') || null
	}
	// 在请求头上面挂载用户信息
	private validateAndSetUser(token: string, request: Request): boolean {
		try {
			const user = this.jwtService.verify(token)
			if (!isEmpty(user)) {
				request[API_USER] = user
				return true
			}
		} catch (e) {
			throw new ApiException(10005)
		}
		return false
	}
}
