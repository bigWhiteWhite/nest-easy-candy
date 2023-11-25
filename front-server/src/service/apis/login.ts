import { $https } from '../index'

export const captcha = () => {
	return $https.get({
		url: `user/captcha`
	})
}
export const register = (data: any) => {
	return $https.post({
		url: `/user/register`,
		data
	})
}
export const login = (data: any) => {
	return $https.post({
		url: `/user/login`,
		data
	})
}
export const deleteUser = (id: string) => {
	return $https.delete({
		url: `/user/${id}`,
		successNotify: true
	})
}
export const userInfo = () => {
	return $https.get({
		url: `/user/info`
	})
}
export const logout = () => {
	return $https.post({
		url: `/user/logout`
	})
}
export const setPassword = (data: any) => {
	return $https.post({
		url: `/user/password`,
		data
	})
}
