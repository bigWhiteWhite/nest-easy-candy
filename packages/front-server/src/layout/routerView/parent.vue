<template>
	<div class="h100">
		<router-view v-slot="{ Component }">
			<transition :name="setTransitionName" mode="out-in">
				<keep-alive :include="getKeepAliveNames">
					<component :is="Component" :key="state.refreshRouterViewKey" class="w100 main_container" />
				</keep-alive>
			</transition>
		</router-view>
	</div>
</template>

<script lang="ts" setup name="">
import { computed, reactive, getCurrentInstance, onBeforeMount, onUnmounted, nextTick, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '@/store/modules/theme.config'
import { useKeepALiveNames } from '@/store/modules/keepAliveNames'
import localCache from '@/utils/storage'
const { proxy } = <any>getCurrentInstance()
const route = useRoute()
const { cachedViews, keepAliveNames } = storeToRefs(useKeepALiveNames())
const { themeConfig } = storeToRefs(useThemeConfig())
// 定义接口来定义对象的类型
interface ParentViewState {
	refreshRouterViewKey: null | string
	keepAliveNameList: string[]
}

const state = reactive<ParentViewState>({
	refreshRouterViewKey: null,
	keepAliveNameList: []
})

// 设置主界面切换动画
const setTransitionName = computed(() => {
	return themeConfig.value.animation
})
// 获取组件缓存列表(name值)
const getKeepAliveNames = computed(() => {
	return themeConfig.value.isTagsview ? cachedViews.value : state.keepAliveNameList
})
// 页面加载前，处理缓存，页面刷新时路由缓存处理
onBeforeMount(() => {
	state.keepAliveNameList = keepAliveNames.value
	proxy.$mittBus.on('onTagsViewRefreshRouterView', (fullPath: string) => {
		state.keepAliveNameList = keepAliveNames.value.filter((name: string) => route.name !== name)
		state.refreshRouterViewKey = null
		nextTick(() => {
			state.refreshRouterViewKey = fullPath
			state.keepAliveNameList = keepAliveNames.value
		})
	})
})
// 页面加载时
onMounted(() => {
	nextTick(() => {
		setTimeout(() => {
			if (themeConfig.value.isCacheTagsView) cachedViews.value = localCache.get('tagsViewList', 'session').map((item: any) => item.name)
		}, 0)
	})
})
// 页面卸载时
onUnmounted(() => {
	proxy.$mittBus.off('onTagsViewRefreshRouterView', () => {})
})
// 监听路由变化，防止 tagsView 多标签时，切换动画消失
watch(
	() => route.fullPath,
	() => {
		state.refreshRouterViewKey = decodeURI(route.fullPath)
	}
)
</script>

<style scoped lang="less">
.main_container {
	background-color: var(--next-bg-page-main);
	padding: 15px;
	min-height: calc(100vh - 10%);
	border-radius: 15px;
}
</style>
