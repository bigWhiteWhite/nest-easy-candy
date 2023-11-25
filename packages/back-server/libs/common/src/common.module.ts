import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CommonService } from './common.service'
import { JwtModule } from '@nestjs/jwt'
import { DbModule } from '@app/db/index'
console.log('fff')
@Global() // 声明为全局模块
@Module({
	imports: [
		// jwt前后端都会用到，注册为全局模块
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('jwt.secret'),
				signOptions: {
					expiresIn: 60 * 60 * 48 // '48h'
				}
			}),
			inject: [ConfigService]
		}),
		DbModule
	],
	providers: [CommonService],
	exports: [CommonService, JwtModule] // 暴露出JwtModule
})
export class CommonModule {}
