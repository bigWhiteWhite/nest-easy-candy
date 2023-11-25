import localCache from '@/utils/storage'
import Cookies from 'js-cookie'

export const useLogout = () => {
	localCache.clear('session') // 清除缓存/token等
	Cookies.remove('CmsSystemToken')
	// 使用 reload 时，不需要调用 resetRoute() 重置路由
	window.location.reload()
}
