import { RouteRecordRaw } from 'vue-router'
import { pinia } from '@/store/index'
import { useUserInfo } from '@/store/modules/userInfo'
import { storeToRefs } from 'pinia'
import { NextLoading } from '@/utils/loading'
import { useRoutesList } from '@/store/modules/routesList'
import { dynamicRoutes, notFoundAndNoPower } from '@/router/route'
import { formatTwoStageRoutes, formatFlatteningRoutes, router } from '@/router/index'
import { useTagsViewRoutes } from '@/store/modules/tagsViewRoutes'
import Cookies from 'js-cookie'
import { RouteMeta } from '@/types/Common/route'
import { cloneDeep } from 'lodash'
const layouModules: any = import.meta.glob('../layout/routerView/*.{vue,tsx}')
const viewsModules: any = import.meta.glob('../views/**/*.{vue,tsx}')

// 后端控制路由

/**
 * 获取目录下的 .vue、.tsx 全部文件
 * @method import.meta.glob
 * @link 参考：https://cn.vitejs.dev/guide/features.html#json
 */
const dynamicViewsModules: Record<string, Function> = Object.assign({}, { ...layouModules }, { ...viewsModules })

export async function initBackEndControlRoutes(currentSystem?: string) {
	// 界面 loading 动画开始执行
	if (window.nextLoading === undefined) NextLoading.start()
	// 无 token 停止执行下一步
	if (!Cookies.get('CmsSystemToken')) return false
	// 触发初始化用户信息 pinia
	await useUserInfo().setUserInfos()
	// 动态路由设置用户拥有的系统
	await useRoutesList().setSystemList()
	// 切换系统
	if (currentSystem) await useRoutesList().setActiveSystem(currentSystem)
	const { systemList, activeSystem } = (await storeToRefs(useRoutesList())) as any
	const currentSystemMenus = cloneDeep(await systemList.value[activeSystem.value]) as Array<RouteMeta>
	const Menus = toggleMenus(currentSystemMenus || [])
	// 获取路由菜单数据
	dynamicRoutes[0].children = await backEndComponent(Menus)
	await setAddRoute()
	// 设置路由到 routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
	await setFilterMenuAndCacheTagsViewRoutes()
}
/**
 * @description 将后端的路由进行处理，转换为合适的
 */
const switchData = (list: Array<RouteMeta>, path?: string): any => {
	list.forEach((item: any) => {
		const component = path ? path + item.path : item.path
		item.component = component
		if (item.children && item.children.length !== 0) {
			item.children = switchData(item.children, component) // 修改这里，将返回值赋值给 item.children
		}
	})
	return list
}
const toggleMenus = (list: Array<RouteMeta>) => {
	console.log('🚀 ~ file: backRouter.ts:59 ~ toggleMenus ~ list:', list)
	list.unshift({
		path: '/home',
		name: 'home',
		component: '/home',
		meta: {
			title: 'router.home',
			isLink: '',
			isHide: false,
			isKeepAlive: true, // 是否保存
			isAffix: true, // 标签是否是固定不可关闭的
			isIframe: false,
			icon: 'ele-HomeFilled'
		}
	})
	return switchData(list)
}
/**
 * 设置路由到 routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 * @description 用于左侧菜单、横向菜单的显示
 * @description 用于 tagsView、菜单搜索中：未过滤隐藏的(isHide)
 */
export function setFilterMenuAndCacheTagsViewRoutes() {
	const storesRoutesList = useRoutesList(pinia)
	storesRoutesList.setRoutesList(dynamicRoutes[0].children as any)
	setCacheTagsViewRoutes()
}
/**
 * 缓存多级嵌套数组处理后的一维数组
 * @description 用于 tagsView、菜单搜索中：未过滤隐藏的(isHide)
 */
export function setCacheTagsViewRoutes() {
	const storesTagsView = useTagsViewRoutes(pinia)
	storesTagsView.setTagsViewRoutes(formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes))[0].children)
}

/**
 * 后端路由 component 转换
 * @param routes 后端返回的路由表数组
 * @returns 返回处理成函数后的 component
 */
export function backEndComponent(routes: any) {
	if (!routes || routes.length === 0) return
	return routes.map((item: any) => {
		if (item.component) {
			item.component = dynamicImport(dynamicViewsModules, item.component as string)
		}
		item.children && backEndComponent(item.children)
		return item
	})
}

/**
 * 处理路由格式及添加捕获所有路由或 404 Not found 路由
 * @description 替换 dynamicRoutes（/@/router/route）第一个顶级 children 的路由
 * @returns 返回替换后的路由数组
 */
export function setFilterRouteEnd() {
	const filterRouteEnd: any = formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes))
	filterRouteEnd[0].children = [...filterRouteEnd[0].children, ...notFoundAndNoPower]
	return filterRouteEnd
}

/**
 * 后端路由 component 转换函数
 * @param dynamicViewsModules 获取目录下的 .vue、.tsx 全部文件
 * @param component 当前要处理项 component
 * @returns 返回处理成函数后的 component
 */
export function dynamicImport(dynamicViewsModules: Record<string, Function>, component: string) {
	const keys = Object.keys(dynamicViewsModules)
	const matchKeys = keys.filter((key) => {
		const k = key.replace(/..\/views|../, '')
		// return k.startsWith(`${component}`) && k.endsWith(`index.vue`)
		// return k.startsWith(`${component}`) || k.startsWith(`/${component}`)
		return k === `${component}/index.vue` || k.includes(`${component}/index.vue`)
	})
	if (matchKeys?.length === 1) {
		const matchKey = matchKeys[0]
		return dynamicViewsModules[matchKey]
	}
	if (matchKeys?.length > 1) {
		console.warn(`匹配目录超过1个 --> ${matchKeys}`)
		return false
	}
}

/**
 * 添加动态路由
 * @method router.addRoute
 * @description 此处循环为 dynamicRoutes（/@/router/route）第一个顶级 children 的路由一维数组，非多级嵌套
 * @link 参考：https://next.router.vuejs.org/zh/api/#addroute
 */
export async function setAddRoute() {
	await setFilterRouteEnd().forEach((route: RouteRecordRaw) => {
		router.addRoute(route)
	})
}
