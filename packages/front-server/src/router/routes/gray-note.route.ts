import { RouteMeta } from '@/types/Common/route'
import type { RouteRecordRaw } from 'vue-router'

type route = Array<RouteRecordRaw | RouteMeta>
export const grayNote: route = [
	{
		path: '/',
		name: '/',
		component: () => import('@/layout/index.vue'),
		redirect: '/home',
		meta: {
			isKeepAlive: true
		},
		children: [
			{
				path: '/home',
				name: 'home',
				component: () => import('@/views/home/index.vue'),
				meta: {
					title: 'router.home',
					isLink: '',
					isHide: false,
					isKeepAlive: true, // 是否保存
					isAffix: true, // 标签是否是固定不可关闭的
					isIframe: false,
					// roles: ['1', '8'],
					icon: 'ele-HomeFilled'
				}
			},
			{
				path: '/git',
				name: 'Git',
				component: () => import('@/views/git/index.vue'),
				meta: {
					title: 'router.git',
					icon: 'git'
				}
			}
		]
	}
]
