import { HttpModule } from '@nestjs/axios'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisModule } from './redis/redis.module'
import { RedisService } from './redis/redis.service'
import { UtilService } from './tools/util.service'
import { WinstonLogLevel } from './logger/logger.interface'
import { LoggerModule } from './logger/logger.module'
import { LoggerService } from './logger/logger.service'
// ?使用了@Global()意味着其中定义的提供者（服务）将在整个 Nest.js 应用程序中可用
const providers = [UtilService, RedisService, LoggerModule, LoggerService]
@Global() // 全局共享模块
@Module({
	imports: [
		HttpModule.register({
			timeout: 5000,
			maxRedirects: 5
		}),
		RedisModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				host: configService.get<string>('redis.host'),
				port: configService.get<number>('redis.port'),
				password: configService.get<string>('redis.password'),
				db: configService.get<number>('redis.db')
			}),
			inject: [ConfigService]
		}),
		LoggerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => {
				return {
					level: configService.get<WinstonLogLevel>('logger.level'),
					consoleLevel: configService.get<WinstonLogLevel>('logger.consoleLevel'),
					timestamp: configService.get<boolean>('logger.timestamp'),
					maxFiles: configService.get<string>('logger.maxFiles'),
					maxFileSize: configService.get<string>('logger.maxFileSize'),
					disableConsoleAtProd: configService.get<boolean>('logger.disableConsoleAtProd'),
					dir: configService.get<string>('logger.dir'),
					errorLogName: configService.get<string>('logger.errorLogName'),
					appLogName: configService.get<string>('logger.appLogName')
				}
			},
			inject: [ConfigService]
		})
	],
	providers,
	exports: providers
})
export class SharedModule {}
