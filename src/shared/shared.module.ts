import { HttpModule } from '@nestjs/axios'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisModule } from './redis/redis.module'
import { RedisService } from './redis/redis.service'
import { UtilService } from './tools/util.service'
// ?使用了@Global()意味着其中定义的提供者（服务）将在整个 Nest.js 应用程序中可用
const providers = [UtilService, RedisService]
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
		})
	],
	providers,
	exports: providers
})
export class SharedModule {}
