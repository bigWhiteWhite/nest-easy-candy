import { defineStore } from 'pinia'
import { UserInfosStates } from './interface'
import localCache from '@/utils/storage'
import app from '@/main'

export const useUserInfo = defineStore(
	// 唯一ID
	'userInfo',
	{
		state: (): UserInfosStates => ({
			userInfos: {
				username: '',
				userAvatar: '',
				status: '',
				userId: '',
				roles: [],
				userSystemMenus: [],
				phone: '',
				// 本地路由不设置为false的话，会将roles和路由中meta的roles匹配，就出现返回空的路由, 这个开起来的话就要保证用户信息roles会包含meta的roles
				needRole: false,
				authComponentList: [], // 按钮权限数组
				createdAt: '',
				updatedAt: ''
			}
		}),
		actions: {
			async setUserInfos() {
				const userInfo = localCache.get('userInfo', 'local')
				// 用户信息
				const userInfos = {
					userAvatar: '先不使用图片作为用户头像',
					time: new Date().getTime(),
					roles: [],
					authComponentList: [],
					...userInfo
				}
				// 存储用户信息到浏览器缓存
				localCache.set('userInfo', userInfos, 'local')
				if (localCache.get('userInfo', 'local')) {
					this.userInfos = localCache.get('userInfo', 'local')
				} else {
					this.userInfos = userInfos as any
				}
			}
		}
	}
)
