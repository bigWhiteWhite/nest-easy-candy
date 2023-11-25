<template>
	<el-menu
		router
		:default-active="state.defaultActive"
		background-color="transparent"
		:collapse="state.isCollapse"
		:unique-opened="getThemeConfig.isUniqueOpened"
		:collapse-transition="false"
	>
		<template v-for="val in menuLists">
			<el-sub-menu v-if="val.children && val.children.length > 0" :key="val.path" :index="val.path">
				<template #title>
					<svg-icon :icon-name="val.meta.icon"></svg-icon>
					<span>{{ $t(val.meta.title) }}</span>
				</template>
				<sub-item :parent="val.children" />
			</el-sub-menu>
			<template v-else>
				<el-menu-item :key="val.path" :index="val.path">
					<svg-icon :icon-name="val.meta.icon"></svg-icon>
					<template v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)" #title>
						<span>{{ $t(val.meta.title) }}</span>
					</template>
					<template v-else #title>
						<a :href="val.meta.isLink" target="_blank" rel="opener" class="w100">{{ $t(val.meta.title) }}</a>
					</template>
				</el-menu-item>
			</template>
		</template>
	</el-menu>
</template>

<script lang="ts" setup name="navMenuVertical">
import { reactive, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router' // onBeforeRouteUpdate
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '@/store/modules/theme.config'
import SubItem from './subItem.vue'

const { themeConfig } = storeToRefs(useThemeConfig())
const route = useRoute()
const props = defineProps({
	menuList: {
		type: Array,
		default: () => []
	}
})
const state = reactive({
	defaultActive: route.meta.isDynamic ? route.meta.isDynamicPath : route.path,
	isCollapse: false
})

// 获取父级菜单数据
const menuLists = computed(() => {
	return <any>props.menuList
})
// 获取布局配置信息
const getThemeConfig = computed(() => {
	return themeConfig.value
})
// 菜单高亮（详情时，父级高亮）
const setParentHighlight = (currentRoute: any) => {
	const { path, meta } = currentRoute
	const pathSplit = meta.isDynamic ? meta.isDynamicPath.split('/') : path.split('/')
	if (pathSplit.length >= 4 && meta.isHide) return pathSplit.splice(0, 3).join('/')
	else return path
}
// 设置菜单的收起/展开
watch(
	themeConfig.value,
	() => {
		document.body.clientWidth <= 1000 ? (state.isCollapse = false) : (state.isCollapse = themeConfig.value.isCollapse)
	},
	{
		immediate: true
	}
)
// 监听切换系统时路由的变化
watch(
	route,
	(toRoute) => {
		state.defaultActive = setParentHighlight(toRoute)
		const clientWidth = document.body.clientWidth
		if (clientWidth < 1000) themeConfig.value.isCollapse = false
	},
	{
		immediate: true
	}
)
// 页面加载时
onMounted(() => {
	state.defaultActive = setParentHighlight(route)
})
// 路由更新时,先关闭看看效果
// onBeforeRouteUpdate((to) => {
// 	// 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
// 	state.defaultActive = setParentHighlight(to)
// 	const clientWidth = document.body.clientWidth
// 	if (clientWidth < 1000) themeConfig.value.isCollapse = false
// })
</script>

<style scoped lang="less"></style>
