import { DataSourceOptions } from 'typeorm'

export default {
	rootRoleId: '',
	// 启动服务
	server: {
		apiPort: process.env.API_PORT
	},
	// jwt sign secret
	jwt: {
		secret: process.env.JWT_SECRET
	},
	redis: {
		host: process.env.REDIS_HOST, // default value
		port: parseInt(process.env.REDIS_PORT, 10), // default value
		password: process.env.REDIS_PASSWORD,
		db: process.env.REDIS_DB
	},
	database: {
		type: 'mysql',
		host: process.env.DATABASE_HOST,
		port: parseInt(process.env.DATABASE_PORT, 10),
		username: process.env.MYSQL_USERNAME,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DATABASE,
		synchronize: false,
		logging: ['error'],
		timezone: '+08:00' // 东八区
	} as DataSourceOptions
}
