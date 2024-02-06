import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'
import { ResOp } from '../../common/class/res.class'
import { Logger } from '../../shared/logger'
import { ApiException } from '../exceptions/api.exception'
import { isDev } from '@/config/env'
/**
 * @description 处理http报错，添加日志
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const request = ctx.getRequest<Request>()
		// check api exection
		const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
		// set json response
		response.header('Content-Type', 'application/json; charset=utf-8')
		const code = exception instanceof ApiException ? (exception as ApiException).getErrorCode() : status

		let message = '服务器异常，请稍后再试'
		// 开发模式下提示500类型错误，生产模式下屏蔽500内部错误提示
		if (isDev() || status < 500) {
			message = exception instanceof HttpException ? exception.message : `${exception}`
		}
		const logFormat = `
		<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
			Request original url: ${request.originalUrl}
			Method: ${request.method}
			IP: ${request.ip}
			Status code: ${status}
			Response: ${exception.toString()} \n
		<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    `
		Logger.info(logFormat)
		const result = new ResOp(code, '', message)
		response.status(status).send(result)
	}
}
