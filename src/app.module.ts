import dayjs = require('dayjs')
import { APP_GUARD, APP_PIPE } from '@nestjs/core' // APP_GUARD
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common' // 模块的导入顺序会影响执行顺序
import { MulterModule } from '@nestjs/platform-express'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SharedModule } from './shared/shared.module'
import { diskStorage } from 'multer'
import { InitMiddleware } from './middleware/init.middleware'
import { AuthMiddleware } from './middleware/auth.middleware'
import Configuration from './config'
import { indexModule } from './models/index.module'
import { ValidationPipe } from './service/pipes/validation.pipe'
import { AdminController } from './app.controller'
import { AuthGuard } from './guards/auth.guard'
import { LoggerModule } from './shared/logger/logger.module'
import { LoggerModuleOptions } from './shared/logger/logger.interface'
import { LOGGER_MODULE_OPTIONS } from './shared/logger/logger.constants'
import { TypeORMLoggerService } from './shared/logger/typeorm-logger.service'
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [Configuration],
			envFilePath: ['.env', `.env.${process.env.NODE_ENV}`]
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule, LoggerModule],
			useFactory: (configService: ConfigService, loggerOptions: LoggerModuleOptions) => ({
				autoLoadEntities: true,
				type: configService.get<any>('database.type'),
				host: configService.get<string>('database.host'),
				port: configService.get<number>('database.port'),
				username: configService.get<string>('database.username'),
				password: configService.get<string>('database.password'),
				database: configService.get<string>('database.database'),
				synchronize: configService.get<boolean>('database.synchronize'),
				logging: configService.get('database.logging'),
				timezone: configService.get('database.timezone'), // 时区
				// 自定义日志
				logger: new TypeORMLoggerService(configService.get('database.logging'), loggerOptions)
			}),
			inject: [ConfigService, LOGGER_MODULE_OPTIONS]
		}),
		MulterModule.register({
			storage: diskStorage({
				// /根目录为项目目录，也就是nest-cli.json同级目录
				destination: `./public/upload/${dayjs().format('YYYY-MM-DD')}`,
				filename: (req, file, callback) => {
					// 在此处自定义保存后的文件名称
					const filename = file.originalname
					return callback(null, filename)
				}
			})
		}),
		SharedModule,
		indexModule
	], // 引入操作数据库模块, 这里的顺序也是swigger的顺序
	controllers: [AdminController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard
		},
		{
			// 模块中使用@UsePipes(new ValidationPipe())
			provide: APP_PIPE,
			useClass: ValidationPipe
		}
	]
})
export class ServerModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(InitMiddleware).forRoutes('*')
		consumer
			.apply(AuthMiddleware)
			.exclude(
				'api/user/register',
				'api/user/generate',
				{ path: 'api/user/login', method: RequestMethod.POST },
				{ path: 'api/user/captcha', method: RequestMethod.GET }
			)
			.forRoutes('api/*')
	}
}
