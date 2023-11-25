import { defineStore } from 'pinia'
import { RoutesListState } from './interface'
import { systemList } from '@/router/route'
import localCache from '@/utils/storage'
import { useThemeConfig } from '@/store/modules/theme.config'
import { storeToRefs } from 'pinia'
import { useUserInfo } from './userInfo'
/**
 * 路由列表
 * @methods setRoutesList 设置路由数据
 * @methods setColumnsMenuHover 设置分栏布局菜单鼠标移入 boolean
 * @methods setColumnsNavHover 设置分栏布局最左侧导航鼠标移入 boolean
 */
export const useRoutesList = defineStore(
	// 唯一ID
	'routesList',
	{
		state: (): RoutesListState => ({
			routesList: [],
			isColumnsMenuHover: false,
			isColumnsNavHover: false,
			systemList: {},
			activeSystem: Object.keys(systemList)[0]
		}),
		actions: {
			async setSystemList() {
				const { themeConfig } = storeToRefs(useThemeConfig())
				const { userInfos } = storeToRefs(useUserInfo())
				console.log('🚀 ~ file: routesList.ts:31 ~ setSystemList ~ themeConfig.value.isRequestRoutes:', themeConfig.value.isRequestRoutes)
				if (themeConfig.value.isRequestRoutes) {
					userInfos.value.userSystemMenus.map((item) => {
						if (item.systemName) {
							this.systemList[item.systemName] = item.menus
						}
					})
					this.setActiveSystem()
				} else {
					this.systemList = systemList
					console.log('🚀 ~ file: routesList.ts:39 ~ setSystemList ~ systemList:', systemList)
				}
			},
			async setActiveSystem(activeSystem?: string) {
				if (activeSystem) {
					this.activeSystem = activeSystem
				} else if (localCache.get('activeSystem', 'local')) {
					this.activeSystem = localCache.get('activeSystem', 'local')
				} else {
					this.activeSystem = Object.keys(this.systemList)[0]
				}
				localCache.set('activeSystem', this.activeSystem, 'local')
			},
			async setRoutesList(data: Array<string>) {
				this.routesList = data
			},
			async setColumnsMenuHover(bool: Boolean) {
				this.isColumnsMenuHover = bool
			},
			async setColumnsNavHover(bool: Boolean) {
				this.isColumnsNavHover = bool
			}
		}
	}
)
