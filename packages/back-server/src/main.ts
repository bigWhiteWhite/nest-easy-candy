import { NestFactory, Reflector } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import * as cookieParser from 'cookie-parser'
import * as expressSession from 'express-session'
import * as express from 'express'
import { ConfigService } from '@nestjs/config'
import { AdminModule } from './admin.module'
import { ApiTransformInterceptor } from './service/interceptors/api-transform.interceptor'
import { TransformInterceptor } from './service/interceptors/transform.interceptor'
import { HttpExceptionFilter } from './service/filters/http-exception.filter'
import { AllExceptionsFilter } from './service/filters/any-exception.filter'
import { logger } from './middleware/logger.middleware'
import { Logger } from './shared/logger'
async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AdminModule)
	const configService: ConfigService = app.get(ConfigService)
	// 配置静态资源路径: https://docs.nestjs.cn/8/techniques?id=mvc%e6%a8%a1%e5%9e%8b-%e8%a7%86%e5%9b%be%e6%8e%a7%e5%88%b6%e5%99%a8
	await app.useStaticAssets(join(__dirname, 'public'), {
		prefix: '/public'
	})
	//  全局配置跨域
	// app.enableCors({
	// 	// 允许的请求源
	// 	origin: '*'
	// })
	app.use(express.json()) // For parsing application/json
	app.use(express.urlencoded({ extended: true })) // For parsing application/x-www-form-urlencoded
	// 监听所有的请求路由，并打印日志
	app.use(logger)
	// api interceptor 统一处理返回接口结果
	app.useGlobalInterceptors(new ApiTransformInterceptor(new Reflector()))
	// 使用全局拦截器打印出参
	app.useGlobalInterceptors(new TransformInterceptor())
	// 过滤处理 HTTP 异常
	app.useGlobalFilters(new HttpExceptionFilter())
	// 过滤所有异常
	app.useGlobalFilters(new AllExceptionsFilter())
	// 配置模板引擎
	app.setBaseViewsDir(join(__dirname, 'views'))
	// websocket
	app.useWebSocketAdapter(new IoAdapter())
	app.setViewEngine('ejs')
	// 配置cookie
	app.use(cookieParser())
	// 配置session
	app.use(
		expressSession({
			secret: 'keyboard cat',
			name: 'name',
			cookie: { maxAge: 60000 },
			resave: false,
			saveUninitialized: true
		})
	)
	const config = new DocumentBuilder()
		.setTitle('大白后台管理系统')
		.setDescription('供后台管理界面调用的Api')
		.setVersion('1.0')
		.addBearerAuth()
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('admin-api-docs', app, document)
	// const PORT = process.env.ADMIN_PORT || 3008
	const PORT = configService.get<string>('server.adminPort')
	await app.listen(PORT)
	Logger.log(`API文档已生成,请访问: http://localhost:${PORT}/admin-api-docs`)
}
bootstrap()
