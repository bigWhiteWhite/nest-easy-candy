<template>
	<el-config-provider :size="getGlobalComponentSize" :locale="state.i18nLocale">
		<router-view v-slot="{ Component }">
			<transition name="router-fade" mode="out-in">
				<keep-alive>
					<component :is="Component" />
				</keep-alive>
			</transition>
		</router-view>
		<lock-screen v-if="themeConfig.isLockScreen" />
		<Setting ref="settingsRef" />
		<close-full v-if="!themeConfig.isLockScreen" />
	</el-config-provider>
</template>

<script lang="ts" setup>
import { computed, reactive, getCurrentInstance, onMounted, nextTick, ref, onUnmounted, watch, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '@/store/modules/theme.config'
import { useTagsViewRoutes } from '@/store/modules/tagsViewRoutes'
import other from '@/utils/other'
import Setting from '@/layout/navBars/breadcrumb/setting.vue'
import LockScreen from '@/layout/lockScreen/index.vue'
import CloseFull from '@/layout/navBars/breadcrumb/closeFull.vue'
import localCache from '@/utils/storage'
import setIntroduction from '@/utils/setIconfont'
import { useSocket } from '@/hooks/useSocket'
useSocket()
const route = useRoute()
const { proxy } = <any>getCurrentInstance()
const settingsRef = ref()
const { themeConfig } = storeToRefs(useThemeConfig())
const state = reactive({
	i18nLocale: null
})
// 获取全局组件大小
const getGlobalComponentSize = computed(() => {
	return other.globalComponentSize()
})
// 布局配置弹窗打开
const openSettingsDrawer = () => {
	settingsRef.value.openDrawer()
}

// 页面加载时
onMounted(() => {
	nextTick(() => {
		// 监听布局配置弹窗点击打开
		proxy.$mittBus.on('openSettingsDrawer', () => {
			openSettingsDrawer()
		})
		// 设置 i18n，App.vue 中的 el-config-provider
		proxy.$mittBus.on('getI18nConfig', (locale: string) => {
			;(state.i18nLocale as string | null) = locale
		})
		// 获取缓存中的布局配置
		if (localCache.get('themeConfig', 'local')) {
			useThemeConfig().setThemeConfig(localCache.get('themeConfig', 'local'))
			document.documentElement.style.cssText = localCache.get('themeConfigStyle', 'local')
		}
		// 获取缓存中的全屏配置
		if (localCache.get('isTagsViewCurrenFull', 'session')) {
			useTagsViewRoutes().setCurrenFullscreen(localCache.get('isTagsViewCurrenFull', 'session'))
		}
	})
})

// 设置初始化，防止刷新时恢复默认
onBeforeMount(() => {
	// 设置批量第三方 icon 图标
	setIntroduction.cssCdn()
	// 设置批量第三方 js
	setIntroduction.jsCdn()
})
// 页面销毁时，关闭监听布局配置/i18n监听
onUnmounted(() => {
	proxy.$mittBus.off('openSettingsDrawer', () => {})
	proxy.$mittBus.off('getI18nConfig', () => {})
})
// 监听路由的变化，设置网站标题
watch(
	() => route.path,
	() => {
		other.useTitle()
	},
	{
		deep: true
	}
)
</script>
