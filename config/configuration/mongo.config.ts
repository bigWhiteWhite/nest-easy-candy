import { ConfigService } from '@nestjs/config'
import { TypegooseModuleOptions } from 'nestjs-typegoose'

export const getMongoConfig = async (configService: ConfigService): Promise<TypegooseModuleOptions> => {
	const dbConfig = {
		uri: getMongoString(configService)
	}
	console.log(
		'🚀 ~ file: mongo.config.ts:9 ~ getMongoConfig ~ port, host, dbConfig:',
		configService.get('ADMIN_PORT'),
		configService.get('MONGO_HOST'),
		dbConfig
	)
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
	configService.get('MONGO_AUTHDATABASE') +
	'?' +
	'replicaSet=' +
	configService.get('MONGO_REPLICA_NAME')
