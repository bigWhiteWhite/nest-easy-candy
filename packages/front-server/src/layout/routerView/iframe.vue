<template>
	<div v-loading="state.iframeLoading" class="layout-view-bg-white flex mt1" :style="{ height: `calc(100vh - ${setIframeHeight}`, border: 'none' }">
		<iframe v-show="!state.iframeLoading" id="iframe" :src="state.iframeUrl" frameborder="0" height="100%" width="100%"></iframe>
	</div>
</template>

<script lang="ts" setup name="iframeView">
import { reactive, onMounted, nextTick, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useThemeConfig } from '@/store/modules/theme.config'
import { useTagsViewRoutes } from '@/store/modules/tagsViewRoutes'
const storesThemeConfig = useThemeConfig()
const storesTagsViewRoutes = useTagsViewRoutes()
const { themeConfig } = storeToRefs(storesThemeConfig)
const { isTagsViewCurrentFull } = storeToRefs(storesTagsViewRoutes)
const route = useRoute()
const state = reactive({
	iframeLoading: true,
	iframeUrl: ''
})
const props = defineProps({
	iframeUrl: {
		type: String,
		default: () => ''
	}
})
// 初始化页面加载 loading
const initIframeLoad = () => {
	state.iframeUrl = props.iframeUrl || <any>route.meta.isLink
	nextTick(() => {
		state.iframeLoading = true
		const iframe = document.getElementById('iframe')
		if (!iframe) return false
		iframe.onload = () => {
			state.iframeLoading = false
		}
	})
}
// 设置 iframe 的高度
const setIframeHeight = computed(() => {
	const { isTagsview } = themeConfig.value
	if (isTagsViewCurrentFull.value) {
		return `1px`
	} else {
		if (isTagsview) return `86px`
		else return `51px`
	}
})
// 页面加载时
onMounted(() => {
	initIframeLoad()
})
// 监听路由变化，多个 iframe 时使用
watch(
	() => route.path,
	() => {
		initIframeLoad()
	}
)
</script>
