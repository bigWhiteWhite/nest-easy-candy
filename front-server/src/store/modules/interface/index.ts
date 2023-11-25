import { RouteMeta } from '@/types/Common/route'
import type { Socket, ManagerOptions } from 'socket.io-client'
export interface SocketStore {
	// 连接状态
	isConnected: boolean
	// 消息内容
	message: string
	// 重新连接错误
	reconnectError: boolean
	// 心跳消息发送时间
	heartBeatInterval: number
	// 心跳定时器
	heartBeatTimer: number
}

export interface ThemeConfigState {
	isDrawer: boolean
	primary: string
	topBar: string
	topBarColor: string
	isTopBarColorGradual: boolean
	menuBar: string
	menuBarColor: string
	isMenuBarColorGradual: boolean
	columnsMenuBar: string
	columnsMenuBarColor: string
	isColumnsMenuBarColorGradual: boolean
	isCollapse: boolean
	isUniqueOpened: boolean
	isFixedHeader: boolean
	isFixedHeaderChange: boolean
	isClassicSplitMenu: boolean
	isLockScreen: boolean
	lockScreenTime: number
	isShowLogo: boolean
	isShowLogoChange: boolean
	isBreadcrumb: boolean
	isTagsview: boolean
	isBreadcrumbIcon: boolean
	isTagsviewIcon: boolean
	isCacheTagsView: boolean
	isSortableTagsView: boolean
	isShareTagsView: boolean
	isFooter: boolean
	isGrayscale: boolean
	isInvert: boolean
	isIsDark: boolean
	isWartermark: boolean
	wartermarkText: string
	tagsStyle: string
	animation: string
	columnsAsideStyle: string
	columnsAsideLayout: string
	isRequestRoutes: boolean
	globalTitle: string
	globalViceTitle: string
	globalI18n: 'zh-cn' | 'en' | string
	globalComponentSize: 'large' | 'default' | 'small' | string
	layout: 'defaults' | 'classic' | 'transverse' | 'columns' | string
}
// 布局配置
export interface ThemeConfigStates {
	themeConfig: ThemeConfigState
}
export interface UserSystemMenus {
	_id: string
	systemName: string
	menus: Array<RouteMeta>
}
// 用户信息
export interface UserInfosState {
	authComponentList: string[]
	roles: string[]
	username: string
	userAvatar: string
	userSystemMenus: Array<UserSystemMenus>
	userId?: string
	status: number | string
	phone: string
	needRole: boolean
	createdAt: string
	updatedAt: string
}
export interface UserInfosStates {
	userInfos: UserInfosState
}
// TagsView 路由列表
export interface TagsViewRoutesState {
	tagsViewRoutes: string[]
	isTagsViewCurrentFull: Boolean
}
// 路由列表
export interface RoutesListState {
	routesList: string[]
	isColumnsMenuHover: Boolean
	isColumnsNavHover: Boolean
	systemList: any
	activeSystem: string
}

// 路由缓存列表
export interface KeepAliveNamesState {
	keepAliveNames: string[]
	cachedViews: string[]
}

export interface SocketIoStatus {
	socket: Socket | null
}
