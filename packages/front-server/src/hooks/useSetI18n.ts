import { getCurrentInstance, ref } from 'vue'
import { storeToRefs } from 'pinia'
import localCache from '@/utils/storage'
import other from '@/utils/other'
import { useThemeConfig } from '@/store/modules/theme.config'
import { messages } from '@/locales'

export const useSetI18n = () => {
	const { themeConfig } = storeToRefs(useThemeConfig())
	const { proxy } = <any>getCurrentInstance()
	const disabledI18n = ref('zh-cn')
	// 设置 element plus 组件的国际化
	const setI18nConfig = (locale: string) => {
		// proxy.$mittBus.emit('getI18nConfig', proxy.$i18n.messages[locale])
		const currentI18n = messages[locale]
		proxy.$mittBus.emit('getI18nConfig', currentI18n)
	}
	// 初始化言语国际化
	const initI18n = () => {
		const localI18n = localCache.get('themeConfig', 'local').globalI18n || 'zh-cn'
		disabledI18n.value = localI18n
		setI18nConfig(localI18n)
	}
	// 语言切换
	const onLanguageChange = (lang: string) => {
		localCache.remove('themeConfig', 'local')
		themeConfig.value.globalI18n = lang
		localCache.set('themeConfig', themeConfig.value, 'local')
		proxy.$i18n.locale = lang
		initI18n()
		other.useTitle()
	}

	return {
		disabledI18n,
		initI18n,
		onLanguageChange
	}
}
