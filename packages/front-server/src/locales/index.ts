import { createI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { pinia } from '@/store'
import { useThemeConfig } from '@/store/modules/theme.config'

import zhCnLocale from 'element-plus/dist/locale/zh-cn.mjs'
import enLocale from 'element-plus/dist/locale/en.mjs'
// import zhtwLocale from 'element-plus/lib/locale/lang/zh-tw';

import layoutZhCn from './layout/zh-cn'
import layoutEn from './layout/en'

const stores = useThemeConfig(pinia)
const { themeConfig } = storeToRefs(stores)

// 定义语言国际化内容
export const messages = {
	[zhCnLocale.name]: {
		label: '简体中文',
		...zhCnLocale,
		...layoutZhCn
	},
	[enLocale.name]: {
		label: 'English',
		...enLocale,
		...layoutEn
	}
}
// 导出语言国际化
export const i18n = createI18n({
	silentTranslationWarn: true,
	missingWarn: false,
	silentFallbackWarn: true,
	fallbackWarn: false,
	locale: themeConfig.value.globalI18n,
	fallbackLocale: enLocale.name,
	messages
})
