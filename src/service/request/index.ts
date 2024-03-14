import { LoggerModule } from '@/shared/logger/logger.module'
import { LoggerService } from '@/shared/logger/logger.service'
import { HttpModule as AxiosHttpModule, HttpService } from '@nestjs/axios'
import { Global, Module, OnModuleInit } from '@nestjs/common'
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const LOGGING_CONFIG_KEY = Symbol('kLoggingAxiosInterceptor')
// Merging our custom properties with the base config
interface LoggingConfig extends InternalAxiosRequestConfig {
	[LOGGING_CONFIG_KEY]: {
		startTime: number
	}
}

@Global()
@Module({
	imports: [AxiosHttpModule, LoggerModule],
	exports: [AxiosHttpModule, LoggerModule]
})
export class HttpModule extends AxiosHttpModule implements OnModuleInit {
	constructor(private readonly httpService: HttpService, private readonly loggerService: LoggerService) {
		super()
	}

	public onModuleInit(): any {
		const axios = this.httpService.axiosRef

		axios.interceptors.request.use(
			(config: LoggingConfig) => {
				config[LOGGING_CONFIG_KEY] = {
					startTime: Date.now()
				}
				return config
			},
			(err: AxiosError) => {
				this.loggerService.error(err)
				return err
			}
		)
		axios.interceptors.response.use(
			(response: AxiosResponse) => {
				const startTime = response.config[LOGGING_CONFIG_KEY].startTime
				const endTime = Date.now()
				const duration = endTime - startTime
				const log = `axios调用接口路由:${response.config.url};请求时间: ${duration}ms`
				this.loggerService.verbose(log)
				return response
			},
			(err: AxiosError) => {
				this.loggerService.error(err)
				return err
			}
		)
	}
}
