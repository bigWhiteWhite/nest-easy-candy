// src/interceptor/transform.interceptor.ts
import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ADMIN_USER } from '../../admin.constant'
import { Logger } from 'src/shared/logger'
/**
 * @description 添加日志, 出参信息-查看返回数据
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req = context.getArgByIndex(1).req
		return next.handle().pipe(
			map((data) => {
				const logFormat = `
				<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
					Request original url: ${req.originalUrl}
					Method: ${req.method}
					IP: ${req.ip}
					User: ${JSON.stringify(req[ADMIN_USER])}
					Response data:\n ${JSON.stringify(data)}
				<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
				`
				Logger.info(logFormat)
				Logger.access(logFormat)
				return data
			})
		)
	}
}
