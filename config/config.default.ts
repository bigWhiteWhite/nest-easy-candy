import { defineConfig } from './defineConfig'

/**
 * 项目通用默认配置，但优先级最低
 */
export default defineConfig({
	rootRoleId: process.env.ROOT_ROLE_ID || '1',
	jwtExpires: 60 * 60 * 48 // jwt和redis的token过期时间
})
