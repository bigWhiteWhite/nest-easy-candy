export default {
	rootRoleId: '637f58f1e91b7562808e33d0',
	// mongoDB
	mongo: {
		DBPath: process.env.DB
	},
	// 启动服务
	server: {
		adminPort: process.env.ADMIN_PORT
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
	}
}
