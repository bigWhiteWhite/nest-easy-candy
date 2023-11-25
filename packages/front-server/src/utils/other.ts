import { nextTick } from 'vue'
import type { App } from 'vue'
import { storeToRefs } from 'pinia'
import * as eleIcon from '@element-plus/icons-vue'
import { useThemeConfig } from '@/store/modules/theme.config'
import { i18n, messages } from '@/locales'
import router from '@/router/index'

/**
 * 导出全局注册 element plus svg 图标
 * @param app vue 实例
 * @description 使用：https://element-plus.gitee.io/zh-CN/component/icon.html
 */
const elIcon = (app: App) => {
	const icons = eleIcon as any
	for (const i in icons) {
		app.component(`ele-${icons[i].name}`, icons[i])
	}
}
/**
 * 全局组件大小
 * @returns 返回 `window.localStorage` 中读取的缓存值 `globalComponentSize`
 */
const globalComponentSize = (): string => {
	const { themeConfig } = storeToRefs(useThemeConfig())
	return themeConfig.value?.globalComponentSize
}
/**
 * 设置 自定义 tagsView 名称、 自定义 tagsView 名称国际化
 * @param params 路由 query、params 中的 tagsViewName
 * @returns 返回当前 tagsViewName 名称
 */
const setTagsViewNameI18n = (item: any) => {
	let tagsViewName: any = ''
	const { query, params, meta } = item
	if (query?.tagsViewName || params?.tagsViewName) {
		const localeReg = new RegExp(Object.keys(messages).join('|'))
		if (localeReg.test(query?.tagsViewName) || localeReg.test(params?.tagsViewName)) {
			// 国际化
			const urlTagsParams = (query?.tagsViewName && JSON.parse(query?.tagsViewName)) || (params?.tagsViewName && JSON.parse(params?.tagsViewName))
			tagsViewName = urlTagsParams[i18n.global.locale]
		} else {
			// 非国际化
			tagsViewName = query?.tagsViewName || params?.tagsViewName
		}
	} else {
		// 非自定义 tagsView 名称
		tagsViewName = meta.title ? i18n.global.t(<any>meta.title) : 'No Name'
	}
	return tagsViewName
}

/**
 * 设置浏览器标题国际化
 * @method const title = useTitle(); ==> title()
 */
const useTitle = () => {
	nextTick(() => {
		const { themeConfig } = storeToRefs(useThemeConfig())
		let webTitle = ''
		const globalTitle: string = themeConfig.value.globalTitle
		const { path, meta } = router.currentRoute.value
		if (path === '/login') {
			webTitle = <any>meta.title
		} else {
			webTitle = setTagsViewNameI18n(router.currentRoute.value)
		}
		document.title = `${webTitle} - ${globalTitle}` || globalTitle
	})
}

/**
 * 判断是否是移动端
 */
const isMobile = () => {
	if (
		navigator.userAgent.match(
			/('phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone')/i
		)
	) {
		return true
	} else {
		return false
	}
}

// 统一批量导出
export default {
	globalComponentSize,
	setTagsViewNameI18n,
	useTitle,
	elIcon,
	isMobile
}
