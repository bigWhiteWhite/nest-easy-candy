// 数字产品后端
export const backSystemList = {
	aiProduct: [
		{
			// 权限管理
			menuUrl: '/authority-management',
			menuName: 'authority-management',
			title: 'router.authorityManagement',
			pid: null,
			menuId: 0,
			layer: 0,
			porder: 0,
			icon: 'ele-Key',
			isLink: '',
			isEnable: true,
			isKeepAlive: true, // 是否保存
			isAffix: false, // 标签是否是固定不可关闭的
			isIframe: false
		},
		{
			// 用户管理
			menuUrl: '/authority-management/user-management',
			menuName: 'user-management',
			title: 'router.userManagement',
			pid: 0,
			menuId: 1,
			layer: 0,
			porder: 1,
			icon: 'ele-User'
		},
		{
			// 角色管理
			menuUrl: '/authority-management/role-management',
			menuName: 'role-management',
			title: 'router.roleManagement',
			pid: 0,
			menuId: 2,
			layer: 0,
			porder: 2,
			icon: 'ele-Avatar'
		}
	]
}
