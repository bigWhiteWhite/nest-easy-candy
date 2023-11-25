<template>
	<div v-if="isShowBreadcrumb" class="layout-navbars-breadcrumb">
		<svg-icon
			class-name="layout-navbars-breadcrumb-icon"
			:icon-name="themeConfig.isCollapse ? 'ele-Expand' : 'ele-Fold'"
			@click="onThemeConfigChange"
		></svg-icon>
		<el-breadcrumb class="layout-navbars-breadcrumb-hide">
			<transition-group name="breadcrumb">
				<el-breadcrumb-item v-for="(v, k) in state.breadcrumbList" :key="!v.meta.tagsViewName ? v.meta.title : v.meta.tagsViewName">
					<span v-if="k === state.breadcrumbList.length - 1" class="layout-navbars-breadcrumb-span">
						<svg-icon v-if="themeConfig.isBreadcrumbIcon" :icon-name="v.meta.icon" class-name="layout-navbars-breadcrumb-iconfont" />
						<div v-if="!v.meta.tagsViewName">{{ $t(v.meta.title) }}</div>
						<div v-else>{{ v.meta.tagsViewName }}</div>
					</span>
					<a v-else @click.prevent="onBreadcrumbClick(v)">
						<svg-icon v-if="themeConfig.isBreadcrumbIcon" :icon-name="v.meta.icon" class-name="layout-navbars-breadcrumb-iconfont" />
						{{ $t(v.meta.title) }}
					</a>
				</el-breadcrumb-item>
			</transition-group>
		</el-breadcrumb>
	</div>
</template>

<script lang="ts" setup name="layoutBreadcrumbIndex">
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '@/store/modules/theme.config'
import { useRoutesList } from '@/store/modules/routesList'
import localCache from '@/utils/storage'
import other from '@/utils/other'
const route = useRoute()
const router = useRouter()
const { themeConfig } = storeToRefs(useThemeConfig())
const { routesList } = storeToRefs(useRoutesList())

// 定义接口来定义对象的类型
interface BreadcrumbState {
	breadcrumbList: Array<any>
	routeSplit: Array<string>
	routeSplitFirst: string
	routeSplitIndex: number
}
const state = reactive<BreadcrumbState>({
	breadcrumbList: [],
	routeSplit: [],
	routeSplitFirst: '',
	routeSplitIndex: 1
})

// 处理面包屑数据
const getBreadcrumbList = (arr: Array<string>) => {
	arr.forEach((item: any) => {
		state.routeSplit.forEach((v: any, k: number, arrs: any) => {
			if (state.routeSplitFirst === item.path) {
				state.routeSplitFirst += `/${arrs[state.routeSplitIndex]}`
				state.breadcrumbList.push(item)
				state.routeSplitIndex++
				if (item.children) getBreadcrumbList(item.children)
			}
		})
	})
}
// 当前路由字符串切割成数组，并删除第一项空内容
const initRouteSplit = (path: string) => {
	if (!themeConfig.value.isBreadcrumb) return false
	if (routesList?.value[0]) {
		state.breadcrumbList = [routesList.value[0]]
	}
	state.routeSplit = path.split('/')
	state.routeSplit.shift()
	state.routeSplitFirst = `/${state.routeSplit[0]}`
	state.routeSplitIndex = 1
	getBreadcrumbList(routesList.value)
	if (route.name === 'home' || (route.name === 'notFound' && state.breadcrumbList.length > 1)) state.breadcrumbList.shift()
	if (state.breadcrumbList.length > 0) state.breadcrumbList[state.breadcrumbList.length - 1].meta.tagsViewName = other.setTagsViewNameI18n(route)
}
// 动态设置经典、横向布局不显示
const isShowBreadcrumb = computed(() => {
	initRouteSplit(route.path)
	const { layout, isBreadcrumb } = themeConfig.value
	if (layout === 'classic' || layout === 'transverse') return false
	else return isBreadcrumb ? true : false
})

// 面包屑点击时
const onBreadcrumbClick = (v: any) => {
	const { redirect, path } = v
	if (redirect) router.push(redirect)
	else router.push(path)
}

// 存储布局配置
const setLocalThemeConfig = () => {
	localCache.remove('themeConfig', 'local')
	localCache.set('themeConfig', themeConfig.value, 'local')
}
// 展开/收起左侧菜单点击
const onThemeConfigChange = () => {
	themeConfig.value.isCollapse = !themeConfig.value.isCollapse
	setLocalThemeConfig()
}

// 页面加载时
// onMounted(() => {
// 	initRouteSplit(route.path)
// })
// // 路由更新时
// onBeforeRouteUpdate((to) => {
// 	initRouteSplit(to.path)
// })
</script>

<style scoped lang="less">
.layout-navbars-breadcrumb {
	flex: 1;
	height: inherit;
	display: flex;
	align-items: center;
	.layout-navbars-breadcrumb-icon {
		cursor: pointer;
		font-size: 18px;
		color: var(--next-bg-topBarColor);
		height: 100%;
		width: 40px;
		opacity: 0.8;
		&:hover {
			opacity: 1;
		}
	}
	.layout-navbars-breadcrumb-span {
		display: flex;
		opacity: 0.7;
		color: var(--next-bg-topBarColor);
	}
	.layout-navbars-breadcrumb-iconfont {
		font-size: 14px;
		margin-right: 5px;
	}
	:deep(.el-breadcrumb__separator) {
		opacity: 0.7;
		color: var(--next-bg-topBarColor);
	}
	:deep(.el-breadcrumb__inner a, .el-breadcrumb__inner.is-link) {
		font-weight: unset !important;
		color: var(--next-bg-topBarColor);
		&:hover {
			color: var(--el-color-primary) !important;
		}
	}
}
</style>
