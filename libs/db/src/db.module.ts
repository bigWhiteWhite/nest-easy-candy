import { Global, Module } from '@nestjs/common'
import { DbService } from './db.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Configuration from 'config'
import { SystemModules } from './modules/system/index.model'

@Global() // 标记为全局使用
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [Configuration],
			// 后面的环境变量无法覆盖前面的环境变量
			envFilePath: ['.env', `.env.${process.env.NODE_ENV}`]
		}),
		// 添加环境变量时，环境变量加载需要时间，有可能出现读取不到process.env.DB，使用异步加载解决
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory(configService: ConfigService) {
				return {
					uri: configService.get<string>('mongo.DBPath'), // 连接数据库地址
					useNewUrlParser: true,
					useUnifiedTopology: true, // 设置一个30秒的搜寻服务器的超时时间，就算服务器无法连接，也要等到超时以后才报错
					useCreateIndex: true,
					useFindAndModify: false
				}
			},
			inject: [ConfigService]
		}),
		SystemModules // 导入所有的模型
	],
	providers: [DbService],
	exports: [DbService, SystemModules] // 暴露出去
})
export class DbModule {}
