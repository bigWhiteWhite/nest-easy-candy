import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { ADMIN_USER } from '../../admin.constant'
import { AdminUser } from '../../models/system/system.interface'
/**
 * @description auth.guard守卫已经在用户登录的时候将用户的信息存放于请求头上面
 * @description 使用这个装饰器，可以快速从请求头中获取用户信息
 * @params 第一个参数为装饰器传进来的参数
 * @param 第二个参数为请求上下文对象
 * */
export const UserInfo = createParamDecorator((data: string, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest<Request>()
	// auth guard will mount this
	const user = request.user || (request[ADMIN_USER] as AdminUser)
	if (data) {
		return user?.[data]
	} else {
		return user
	}
})
