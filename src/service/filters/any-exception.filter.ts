/**
 * @description 捕获所有异常
 */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { ResOp } from '../../common/class/res.class'
import { ApiException } from '../exceptions/api.exception'
import { LoggerService } from '@/shared/logger/logger.service'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerService) {}
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse()
		const request = ctx.getRequest()

		const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
		// set json response
		response.header('Content-Type', 'application/json; charset=utf-8')
		const code = exception instanceof ApiException ? (exception as ApiException).getErrorCode() : status

		const logFormat = `
		<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
			Request original url: ${request.originalUrl}
			Method: ${request.method}
			IP: ${request.ip}
			Status code: ${status}
			Response: ${exception} \n
		<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    `
		this.logger.error(logFormat)
		const result = new ResOp(code, '', `Service Error: ${exception}`)
		response.status(status).send(result)
	}
}
