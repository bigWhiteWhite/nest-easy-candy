import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { API_USER } from '@/app.constant'
import { LoggerService } from '@/shared/logger/logger.service'
/**
 * @description 添加日志, 出参信息-查看返回数据
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
	constructor(private readonly logger: LoggerService) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req = context.getArgByIndex(1).req
		return next.handle().pipe(
			map((data) => {
				const logFormat = `
				<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
					Request original url: ${req.originalUrl}
					Method: ${req.method}
					IP: ${req.ip}
					User: ${JSON.stringify(req[API_USER])}
					Response data:\n ${JSON.stringify(data)}
				<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
				`
				this.logger.log(logFormat)
				this.logger.verbose(logFormat)
				return data
			})
		)
	}
}
