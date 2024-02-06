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
	}
}
