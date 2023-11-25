import { $https } from '../index'

export const addMenu = (data?: any) => {
	return $https.post({
		url: `/menu`,
		data,
		successNotify: true
	})
}
export const getAllMenu = (data?: any) => {
	console.log('🚀 ~ file: admin.ts:10 ~ getAllMenu ~ data:', data)
	return $https.post({
		url: `/menu/list`,
		data
	})
}
export const getMenuInfo = (id: string) => {
	return $https.get({
		url: `/menu/${id}`
	})
}
export const editMenu = (id: string, data?: any) => {
	return $https.patch({
		url: `/menu/${id}`,
		data,
		successNotify: true
	})
}
export const deleteMenu = (id: string) => {
	return $https.delete({
		url: `/menu/${id}`,
		successNotify: true
	})
}

export const getAllSystem = (data) => {
	return $https.post({
		url: `/admin-system/list`,
		data
	})
}
export const getSystemIds = () => {
	return $https.post({
		url: `/admin-system/systemIds`
	})
}
export const getSystemInfo = (id) => {
	return $https.get({
		url: `/admin-system/${id}`
	})
}
export const addSystem = (data?: any) => {
	return $https.post({
		url: `/admin-system`,
		data,
		successNotify: true
	})
}
export const editSystem = (id: string, data?: any) => {
	return $https.patch({
		url: `/admin-system/${id}`,
		data,
		successNotify: true
	})
}
export const deleteSystem = (id: string) => {
	return $https.delete({
		url: `/admin-system/${id}`,
		successNotify: true
	})
}

export const getAllRole = (data) => {
	return $https.post({
		url: `/role/list`,
		data
	})
}
export const getRoleInfo = (id) => {
	return $https.get({
		url: `/role/${id}`
	})
}
export const addRole = (data: any) => {
	return $https.post({
		url: `/role`,
		data,
		successNotify: true
	})
}
export const editRole = (id: string, data?: any) => {
	return $https.patch({
		url: `/role/${id}`,
		data,
		successNotify: true
	})
}
export const deleteRole = (id: string) => {
	return $https.delete({
		url: `/role/${id}`,
		successNotify: true
	})
}
export const getAllUser = (data) => {
	return $https.post({
		url: `/user/list`,
		data
	})
}
export const editUser = (id: string, data?: any) => {
	return $https.patch({
		url: `/user/${id}`,
		data,
		successNotify: true
	})
}
export const getUserInfoId = (id) => {
	return $https.get({
		url: `/user/infoId/${id}`
	})
}
export const getOnlineList = () => {
	return $https.get({
		url: `/online/list`
	})
}
export const onlineKick = (id) => {
	return $https.get({
		url: `/online/kick/${id}`,
		successNotify: true
	})
}
