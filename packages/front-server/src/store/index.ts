import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// import { useThemeConfig } from './modules/theme.config'
// import { useTagsViewRoutes } from './modules/tagsViewRoutes'
// import { useRoutesList } from './modules/routesList'
// import { useUserInfo } from './modules/userInfo'
// import { useKeepALiveNames } from './modules/keepAliveNames'
export const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

// export interface IAppStore {
// 	useThemeConfig: ReturnType<typeof useThemeConfig>
// 	useTagsViewRoutes: ReturnType<typeof useTagsViewRoutes>
// 	useRoutesList: ReturnType<typeof useRoutesList>
// 	useUserInfo: ReturnType<typeof useUserInfo>
// 	useKeepALiveNames: ReturnType<typeof useKeepALiveNames>
// }
