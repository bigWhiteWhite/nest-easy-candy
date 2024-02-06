/**
 * 用于智能提示
 */
export function defineConfig(config: Partial<IConfig>): Partial<IConfig> {
	return config
}

export interface IConfig {
	rootRoleId: string | number
	jwtExpires: number // jwt和redis的token过期时间
	mongo: {
		DBPath: string
	}
	server: {
		apiPort: string
	}
	// jwt sign secret
	jwt: {
		secret: string
	}
}
