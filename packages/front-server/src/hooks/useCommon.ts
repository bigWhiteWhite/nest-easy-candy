import { initBackEndControlRoutes } from '@/router/backRouter'
import { logout, userInfo } from '@/service/apis/login'
import localCache from '@/utils/storage'
import Cookies from 'js-cookie'
import { useThemeConfig } from '@/store/modules/theme.config'

export const useCommon = () => {
	const { proxy } = <any>getCurrentInstance()
	const { themeConfig } = storeToRefs(useThemeConfig())

	// 获取用户信息，更新菜单
	const getUserMenu = async () => {
		const info = await userInfo()
		// 存储用户信息
		localCache.set('userInfo', { ...info, userId: info._id }, 'local')
		localCache.set('CmsSetting', {}, 'local')
		// 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
		await initBackEndControlRoutes()
	}
	// 退出登陆
	const logOut = async () => {
		if (themeConfig.value.isRequestRoutes) {
			await logout()
		}
		await proxy.$disconnect()
		localCache.clear('session') // 清除缓存/token等
		Cookies.remove('CmsSystemToken')
		// 使用 reload 时，不需要调用 resetRoute() 重置路由,有可能用户本来有的路由又没有了会404
		window.location.reload()
	}
	return {
		proxy,
		logOut,
		getUserMenu
	}
}
