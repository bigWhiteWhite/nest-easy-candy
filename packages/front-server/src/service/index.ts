import Request from './request'
import { BASE_URL, TIME_OUT } from './request/config'
import { RequestConfig } from './types/axios'
import dayjs from 'dayjs'
import localCache from '@/utils/storage'
import { randomString } from '@/utils'
import Cookies from 'js-cookie'
import { ElMessage } from 'element-plus'
// 可以创建多个axios实例,拥有不同的拦截器
const $https = new Request({
	baseURL: BASE_URL,
	timeout: TIME_OUT,
	interceptors: {
		requestInterceptor: (config: RequestConfig) => {
			const CmsSystemToken = Cookies.get('CmsSystemToken')
			if (CmsSystemToken) {
				config.headers!['authorization'] = `Bearer ${CmsSystemToken}`
			}
			return config
		},
		requestInterceptorsCatch: (err) => {
			return err
		},
		responseInterceptor: (res) => {
			const { data, config } = res
			const { responseType, successNotify = false, failNotify = true } = config
			if ([200, 201].includes(res.status)) {
				if (responseType === 'blob') {
					return Promise.resolve({ file: res.data, fileName: res.headers['content-disposition'].split('=')[1] }) // 转换code 进行判断
				}
				if (data && [200].includes(data.statusCode)) {
					successNotify && ElMessage.success(data.message)
					return data.data
				} else if ([11001, 11002, 11003, 11004].includes(data.statusCode)) {
					localCache.clear('session') // 清除缓存/token等
					Cookies.remove('CmsSystemToken')
					// 使用 reload 时，不需要调用 resetRoute() 重置路由
					window.location.reload()
					failNotify && ElMessage.error(data.message || data.statusCode)
				} else {
					//如果状态码不是0000， 就抛出异常
					failNotify && ElMessage.error(data.message || data.statusCode)
					return Promise.reject(data)
				}
			} else {
				failNotify && ElMessage.error(data.message)
				return Promise.reject(new Error(data.message))
			}
		},
		responseInterceptorsCatch: (err) => {
			const { response } = err
			ElMessage.error(response.data.message || err.message)
			return Promise.reject(err)
		}
	}
})

export { $https }
