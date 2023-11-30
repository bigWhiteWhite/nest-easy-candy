import { ConfigService } from '@nestjs/config'
import { TypegooseModuleOptions } from 'nestjs-typegoose'

export const getMongoConfig = async (configService: ConfigService): Promise<TypegooseModuleOptions> => {
	const dbConfig = {
		uri: getMongoString(configService),
		...getMongoOptions()
	}
	console.log('🚀 ~ file: mongo.config.ts:9 ~ getMongoConfig ~ dbConfig:', dbConfig)
	return dbConfig
}

const getMongoString = (configService: ConfigService) =>
	'mongodb://' +
	(configService.get('MONGO_LOGIN') || '') +
	':' +
	(configService.get('MONGO_PASSWORD') || '') +
	'@' +
	configService.get('MONGO_HOST') +
	':' +
	configService.get('MONGO_PORT') +
	'/' +
	configService.get('MONGO_AUTHDATABASE')

const getMongoOptions = () => ({
	useNewUrlParser: true,
	useUnifiedTopology: true, // 设置一个30秒的搜寻服务器的超时时间，就算服务器无法连接，也要等到超时以后才报错
	useCreateIndex: true,
	useFindAndModify: false
})
