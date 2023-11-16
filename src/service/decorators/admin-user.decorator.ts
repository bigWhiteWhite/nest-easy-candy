import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { ADMIN_USER } from '../../admin.constant'
/**
 * @description 自定义装饰器
 * @params 第一个参数为装饰器传进来的参数
 * @param 第二个参数为请求上下文对象
 * */
export const AdminUser = createParamDecorator(
	(data: string, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<Request>()
		// auth guard will mount this
		const user = request[ADMIN_USER]
		return data ? user?.[data] : user
	}
)
