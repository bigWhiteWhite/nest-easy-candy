<template>
	<component :is="components[themeConfig.layout]" />
</template>

<script lang="ts" setup name="layout">
import { defineAsyncComponent, getCurrentInstance, onBeforeMount, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import localCache from '@/utils/storage'
import { useThemeConfig } from '@/store/modules/theme.config'

const { themeConfig } = storeToRefs(useThemeConfig())
const defaults = defineAsyncComponent(() => import('@/layout/main/defaults.vue'))
const classic = defineAsyncComponent(() => import('@/layout/main/classic.vue'))
const transverse = defineAsyncComponent(() => import('@/layout/main/transverse.vue'))
const columns = defineAsyncComponent(() => import('@/layout/main/columns.vue'))
const components: Record<string, any> = {
	defaults,
	classic,
	transverse,
	columns
}

const { proxy } = <any>getCurrentInstance()
const onLayoutResize = () => {
	if (!localCache.get('oldLayout', 'local')) localCache.set('oldLayout', themeConfig.value.layout, 'local')
	const clientWidth = document.body.clientWidth
	if (clientWidth < 1000) {
		themeConfig.value.isCollapse = false
		proxy.$mittBus.emit('layoutMobileResize', {
			layout: 'defaults',
			clientWidth
		})
	} else {
		proxy.$mittBus.emit('layoutMobileResize', {
			layout: localCache.get('oldLayout', 'local') || themeConfig.value.layout,
			clientWidth
		})
	}
}
// 页面加载前
onBeforeMount(() => {
	onLayoutResize()
	window.addEventListener('resize', onLayoutResize)
})
// 页面卸载时
onUnmounted(() => {
	window.removeEventListener('resize', onLayoutResize)
})
</script>

<style scoped lang="less"></style>
