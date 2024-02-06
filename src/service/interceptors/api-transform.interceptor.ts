import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Response } from 'express'
import { ResOp } from '../../common/class/res.class'
import { TRANSFORM_KEEP_KEY_METADATA } from '@/app.constant'
/**
 * 统一处理返回接口结果，如果不需要则添加@Keep装饰器
 */
export class ApiTransformInterceptor implements NestInterceptor {
	constructor(private readonly reflector: Reflector) {}
	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
		return next.handle().pipe(
			map((data) => {
				const keep = this.reflector.get<boolean>(TRANSFORM_KEEP_KEY_METADATA, context.getHandler())
				if (keep) {
					return data
				} else {
					const response = context.switchToHttp().getResponse<Response>()
					response.header('Content-Type', 'application/json; charset=utf-8')
					return new ResOp(200, data || '')
				}
			})
		)
	}
}
