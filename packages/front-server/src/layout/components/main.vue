<template>
	<el-main class="layout-main">
		<el-scrollbar
			ref="layoutScrollbarRef"
			:class="{
				'layout-scrollbar':
					(!isClassicOrTransverse && !state.currentRouteMeta.isLink && !state.currentRouteMeta.isIframe) ||
					(!isClassicOrTransverse && state.currentRouteMeta.isLink && !state.currentRouteMeta.isIframe)
			}"
		>
			<layout-parent-view
				:style="{
					padding: !isClassicOrTransverse || (state.currentRouteMeta.isLink && state.currentRouteMeta.isIframe) ? '0' : '15px',
					transition: 'padding 0.3s ease-in-out'
				}"
			/>
			<Footer v-if="themeConfig.isFooter" />
		</el-scrollbar>
	</el-main>
</template>

<script lang="ts" setup name="layoutMain">
import { reactive, getCurrentInstance, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { NextLoading } from '@/utils/loading'
import Footer from './footer.vue'
import LayoutParentView from '@/layout/routerView/parent.vue'
import { useThemeConfig } from '@/store/modules/theme.config'
const { proxy } = <any>getCurrentInstance()
const { themeConfig } = storeToRefs(useThemeConfig())
const route = useRoute()

// 定义接口来定义对象的类型
interface MainState {
	headerHeight: string | number
	currentRouteMeta: any
}

const state = reactive<MainState>({
	headerHeight: '',
	currentRouteMeta: {}
})
// 判断布局
const isClassicOrTransverse = computed(() => {
	const { layout } = themeConfig.value
	return layout === 'classic' || layout === 'transverse'
})
// 设置 main 的高度
const initHeaderHeight = () => {
	const bool = state.currentRouteMeta.isLink && state.currentRouteMeta.isIframe
	const { isTagsview } = themeConfig.value
	if (isTagsview) return (state.headerHeight = bool ? `86px` : `115px`)
	else return (state.headerHeight = `80px`)
}
// 初始化获取当前路由 meta，用于设置 iframes padding
const initGetMeta = () => {
	state.currentRouteMeta = route.meta
}
// 页面加载前
onMounted(async () => {
	await initGetMeta()
	initHeaderHeight()
	NextLoading.done()
})
// 监听路由变化
watch(
	() => route.path,
	() => {
		state.currentRouteMeta = route.meta
		const bool = state.currentRouteMeta.isLink && state.currentRouteMeta.isIframe
		state.headerHeight = bool ? `86px` : `115px`
		proxy.$refs.layoutScrollbarRef.update()
	}
)
// 监听 themeConfig 配置文件的变化，更新菜单 el-scrollbar 的高度
watch(
	themeConfig,
	(val) => {
		state.currentRouteMeta = route.meta
		const bool = state.currentRouteMeta.isLink && state.currentRouteMeta.isIframe
		state.headerHeight = val.isTagsview ? (bool ? `86px` : `115px`) : '51px'
		proxy.$refs?.layoutScrollbarRef?.update()
	},
	{
		deep: true
	}
)
</script>

<style scoped lang="less"></style>
