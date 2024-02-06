import dayjs = require('dayjs')
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common' // 模块的导入顺序会影响执行顺序
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { InitMiddleware } from './middleware/init.middleware'
import { AuthMiddleware } from './middleware/auth.middleware'
// import { AuthGuard } from './guards/auth.guard'
import { APP_PIPE } from '@nestjs/core' // APP_GUARD
import { indexModule } from './models/index.module'
import { SharedModule } from './shared/shared.module'
import { ValidationPipe } from './service/pipes/validation.pipe'
import { AdminController } from './admin.controller'
@Module({
	imports: [
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
		indexModule,
		SharedModule
	], // 引入操作数据库模块, 这里的顺序也是swigger的顺序
	controllers: [AdminController],
	providers: [
		// {
		// 	provide: APP_GUARD,
		// 	useClass: AuthGuard
		// },
		{
			// 模块中使用@UsePipes(new ValidationPipe())
			provide: APP_PIPE,
			useClass: ValidationPipe
		}
	]
})
export class AdminModule implements NestModule {
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
