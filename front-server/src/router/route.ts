import type { RouteRecordRaw } from 'vue-router'
import { whiteNote } from './routes/white-note.route'
import { grayNote } from './routes/gray-note.route'
// import type { RouteMeta } from '@/types/Common/route'
/**
 * 定义动态路由
 * 前端添加路由，请在顶级节点的 `children 数组` 里添加
 * @description 未开启 isRequestRoutes 为 true 时使用（前端控制路由），开启时第一个顶级 children 的路由将被替换成接口请求回来的路由数据
 * @returns 返回路由菜单数据w
 */

export const systemList = { whiteNote, grayNote }

export const notFoundAndNoPower = [
	{
		path: '/:path(.*)*',
		name: 'notFound',
		component: () => import('@/views/error/404.vue'),
		meta: {
			title: 'staticRoutes.notFound',
			isHide: true
		}
	},
	{
		path: '/401',
		name: 'noPower',
		component: () => import('@/views/error/401.vue'),
		meta: {
			title: 'staticRoutes.noPower',
			isHide: true
		}
	}
]
export const staticRoutes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: '/',
		component: () => import('@/layout/index.vue'),
		meta: {
			title: '布局界面',
			requireAuth: false,
			isKeepAlive: true
		},
		children: [...notFoundAndNoPower]
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('@/views/login/index.vue'),
		meta: {
			title: '登录'
		}
	}
]

export const dynamicRoutes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: '/',
		redirect: '/home',
		component: () => import('@/layout/index.vue'),
		meta: {
			isKeepAlive: true
		},
		children: []
	}
]
