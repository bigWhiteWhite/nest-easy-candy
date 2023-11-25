<template>
	<div class="el-menu-horizontal-warp">
		<el-scrollbar ref="elMenuHorizontalScrollRef" @wheel.native.prevent="onElMenuHorizontalScroll">
			<el-menu router :default-active="state.defaultActive" :ellipsis="false" background-color="transparent" mode="horizontal">
				<template v-for="val in menuLists">
					<el-sub-menu v-if="val.children && val.children.length > 0" :key="val.path" :index="val.path">
						<template #title>
							<svg-icon :icon-name="val.meta.icon" />
							<span>{{ $t(val.meta.title) }}</span>
						</template>
						<sub-item :parent="val.children" />
					</el-sub-menu>
					<template v-else>
						<el-menu-item :key="val.path" :index="val.path">
							<template v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)" #title>
								<svg-icon :icon-name="val.meta.icon" />
								{{ $t(val.meta.title) }}
							</template>
							<template v-else #title>
								<a :href="val.meta.isLink" target="_blank" rel="opener" class="w100">
									<svg-icon :icon-name="val.meta.icon" />
									{{ $t(val.meta.title) }}
								</a>
							</template>
						</el-menu-item>
					</template>
				</template>
			</el-menu>
		</el-scrollbar>
	</div>
</template>

<script lang="ts" setup name="navMenuHorizontal">
import { reactive, computed, getCurrentInstance, onMounted, nextTick, onBeforeMount } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { storeToRefs } from 'pinia'
import SubItem from './subItem.vue'
import { useThemeConfig } from '@/store/modules/theme.config'
import { useRoutesList } from '@/store/modules/routesList'
const { proxy } = <any>getCurrentInstance()
const { routesList } = storeToRefs(useRoutesList())
const { themeConfig } = storeToRefs(useThemeConfig())
const route = useRoute()

const props = defineProps({
	menuList: {
		type: Array,
		default: () => []
	}
})

const state = reactive({
	defaultActive: null
})
// 获取父级菜单数据
const menuLists = computed(() => {
	return <any>props.menuList
})
// 设置横向滚动条可以鼠标滚轮滚动
const onElMenuHorizontalScroll = (e: any) => {
	const eventDelta = e.wheelDelta || -e.deltaY * 40
	nextTick(() => {
		proxy.$refs.elMenuHorizontalScrollRef.$refs['wrapRef'].scrollLeft =
			proxy.$refs.elMenuHorizontalScrollRef.$refs['wrapRef'].scrollLeft + eventDelta / 4
	})
}
// 初始化数据，页面刷新时，滚动条滚动到对应位置
const initElMenuOffsetLeft = () => {
	nextTick(() => {
		const els: any = document.querySelector('.el-menu.el-menu--horizontal li.is-active')
		if (!els) return false
		proxy.$refs.elMenuHorizontalScrollRef.$refs['wrapRef'].scrollLeft = els.offsetLeft
	})
}
// 路由过滤递归函数
const filterRoutesFun = (arr: Array<string>) => {
	return arr
		.filter((item: any) => !item.meta.isHide)
		.map((item: any) => {
			item = Object.assign({}, item)
			if (item.children) item.children = filterRoutesFun(item.children)
			return item
		})
}
// 传送当前子级数据到菜单中
const setSendClassicChildren = (path: string) => {
	const currentPathSplit = path.split('/')
	const currentData: any = {}
	filterRoutesFun(routesList.value).map((v, k) => {
		if (v.path === `/${currentPathSplit[1]}`) {
			v['k'] = k
			currentData['item'] = [{ ...v }]
			currentData['children'] = [{ ...v }]
			if (v.children) currentData['children'] = v.children
		}
	})
	return currentData
}
// 设置页面当前路由高亮
const setCurrentRouterHighlight = (currentRoute: any) => {
	const { path, meta } = currentRoute
	if (themeConfig.value.layout === 'classic') {
		;(<any>state.defaultActive) = `/${path.split('/')[1]}`
	} else {
		const pathSplit = meta.isDynamic ? meta.isDynamicPath.split('/') : path.split('/')
		if (pathSplit.length >= 4 && meta.isHide) state.defaultActive = pathSplit.splice(0, 3).join('/')
		else state.defaultActive = path
	}
}
// 页面加载前
onBeforeMount(() => {
	setCurrentRouterHighlight(route)
})
// 页面加载时
onMounted(() => {
	initElMenuOffsetLeft()
})
// 路由更新时
onBeforeRouteUpdate((to) => {
	setCurrentRouterHighlight(to)
	// 修复经典布局开启切割菜单时，点击tagsView后左侧导航菜单数据不变的问题
	const { layout, isClassicSplitMenu } = themeConfig.value
	if (layout === 'classic' && isClassicSplitMenu) {
		proxy.$mittBus.emit('setSendClassicChildren', setSendClassicChildren(to.path))
	}
})
</script>

<style scoped lang="less"></style>
