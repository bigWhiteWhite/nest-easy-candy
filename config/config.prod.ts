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
	}
}
