import { merge } from 'lodash'

export interface IConfig {
	rootRoleId: string | number
	jwtExpires: number // jwt和redis的token过期时间
	server: {
		apiPort: string
	}
	jwt: {
		secret: string
	}
	redis: {
		host: string // default value
		port: string // default value
		password: string
		db: string
	}
	database: {
		type: string
		host: string
		port: number
		username: string
		password: string
		database: string
		synchronize: boolean
		logging: boolean
		timezone: string
	}
}

/**
 * 用于智能提示
 */
const defineConfig = (config: Partial<IConfig>): Partial<IConfig> => {
	return config
}
/**
 * @returns 判断当前是否是开发环境
 */
export function isDev(): boolean {
	return process.env.NODE_ENV === 'dev'
}

/**
 * 根据环境变量判断使用配置
 */
export const Configuration = () => {
	let envConfig: Partial<IConfig> = {}
	try {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		envConfig = require(`./file/config.${process.env.NODE_ENV}`).default
	} catch (e) {
		// 无效配置则自动忽略
	}
	// 合并配置
	return merge(
		defineConfig({
			// 默认配置
			jwtExpires: 60 * 60 * 48 // jwt和redis的token过期时间
		}),
		envConfig
	)
}
