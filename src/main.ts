import { NestFactory, Reflector } from '@nestjs/core'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ApiTransformInterceptor } from './service/interceptors/api-transform.interceptor'
import { TransformInterceptor } from './service/interceptors/transform.interceptor'
import { HttpExceptionFilter } from './service/filters/http-exception.filter'
import { AllExceptionsFilter } from './service/filters/any-exception.filter'
import { join } from 'path'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'
import * as expressSession from 'express-session'
import * as express from 'express'
import { Logger } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { LoggerService } from './shared/logger/logger.service'
import { ServerModule } from './app.module'
async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(ServerModule)
	const configService: ConfigService = app.get(ConfigService)
	// ? 加统一前缀
	app.setGlobalPrefix('api')
	// 配置静态资源路径: https://docs.nestjs.cn/8/techniques?id=mvc%e6%a8%a1%e5%9e%8b-%e8%a7%86%e5%9b%be%e6%8e%a7%e5%88%b6%e5%99%a8
	await app.useStaticAssets(join(__dirname, 'public'), {
		prefix: '/public'
	})
	app.use(express.json()) // For parsing application/json
	app.use(express.urlencoded({ extended: true })) // For parsing application/x-www-form-urlencoded
	// 监听所有的请求路由，并打印日志
	app.useLogger(app.get(LoggerService))
	// api interceptor 统一处理返回接口结果
	app.useGlobalInterceptors(new ApiTransformInterceptor(new Reflector()))
	// 使用全局拦截器打印出参
	app.useGlobalInterceptors(new TransformInterceptor(app.get(LoggerService)))
	// 过滤处理 HTTP 异常
	app.useGlobalFilters(new HttpExceptionFilter(app.get(LoggerService)))
	// 过滤所有异常
	app.useGlobalFilters(new AllExceptionsFilter(app.get(LoggerService)))
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
	const PORT = configService.get<string>('server.apiPort')
	const config = new DocumentBuilder().setTitle('前端API').setDescription('前端API').setVersion('1.0').addBearerAuth().build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('admin-api-docs', app, document)
	await app.listen(PORT)
	Logger.log(`API文档已生成,请访问: http://localhost:${PORT}/api-docs`)
}
bootstrap()
