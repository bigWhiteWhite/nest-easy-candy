interface Meta {
	// 菜单标题（国际化写法）--> 'router.home'
	title?: string
	// 菜单外链链接: 开启外链条件，`1、isLink: true 2、链接地址不为空（meta.isLink） 3、isIframe: false`
	isLink?: string
	// 是否内嵌: 开启条件，`1、isIframe: true 2、链接地址不为空（meta.isLink）`
	isIframe?: Boolean
	// 菜单是否隐藏（菜单不显示在界面，但可以进行跳转）
	isHide?: Boolean
	// 菜单是否缓存
	isKeepAlive?: Boolean
	// 菜单是否固定（固定在 tagsView 中，不可进行关闭），右键菜单无关闭项
	isAffix?: Boolean
	// 当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common, 之前 auth 取用户（角色下有多个用户）
	roles?: Array<string>
	// 菜单图标 iconfont icon-shouye
	icon?: string
	// 添加更多属性
	[propName: string]: any
}
export interface RouteMeta {
	// 上级菜单
	parentId?: string
	type?: 1 | 2
	// 路由名称
	name: string
	// 路由路径
	path: string
	// 组件路径
	component?: string
	// 一级菜单排序
	pIndex?: number
	// 子排序
	cIndex?: number
	// 路由重定向，有子集 children 时
	redirect?: string
	// 路由属性
	meta: Meta
	// 子路由
	children?: Array<RouteMeta>
}
