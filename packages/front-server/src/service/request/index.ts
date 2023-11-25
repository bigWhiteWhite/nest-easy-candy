import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { RequestHook, RequestConfig } from '../types/axios'
import { ElLoading } from 'element-plus'
import { LoadingInstance } from 'element-plus/es/components/loading/src/loading'
// import { ILoadingInstance } from 'element-plus/lib/components'

const DEFAULT_LOADING = false

class Request {
	instance: AxiosInstance // axios实例
	interceptors?: RequestHook // 拦截器
	showLoading: boolean // 是否要显示loading，默认显示
	loading?: LoadingInstance // loading

	constructor(config: RequestConfig) {
		this.instance = axios.create(config)
		this.showLoading = config.showLoading ?? DEFAULT_LOADING
		this.interceptors = config.interceptors
		// 实例特有的拦截器
		this.instance.interceptors.request.use(this.interceptors?.requestInterceptor, this.interceptors?.requestInterceptorsCatch)

		this.instance.interceptors.response.use(this.interceptors?.responseInterceptor, this.interceptors?.responseInterceptorsCatch)

		// 全局通用的拦截器,每一个实例都有
		this.instance.interceptors.request.use(
			(config) => {
				if (this.showLoading) {
					this.loading = ElLoading.service({
						lock: true,
						text: 'loading...'
					})
				}
				return config
			},
			(err) => {
				return err
			}
		)
		this.instance.interceptors.response.use(
			(res) => {
				// 只使用返回值中的data数据
				if (this.showLoading) {
					this.loading?.close()
				}
				return res
			},
			(err) => {
				return Promise.reject(err)
			}
		)
	}

	request<T = any>(config: RequestConfig<T>): Promise<T> {
		return new Promise((resolve, reject) => {
			// 单个请求对请求config的处理
			if (config.interceptors?.requestInterceptor) {
				config = config.interceptors.requestInterceptor(config)
			}
			// 判断是否需要loading
			if (config.showLoading === !DEFAULT_LOADING) {
				this.showLoading = !DEFAULT_LOADING
			}

			this.instance
				.request<any, T>(config)
				.then((res) => {
					if (config.interceptors?.responseInterceptor) {
						res = config.interceptors.responseInterceptor(res)
					}
					this.showLoading = DEFAULT_LOADING // 设定回初始值,不会影响到下一个请求
					resolve(res)
				})
				.catch((err) => {
					this.showLoading = DEFAULT_LOADING
					reject(err)
					return err
				})
		})
	}

	get<T = any>(config: RequestConfig<T>): Promise<T> {
		return this.request<T>({ ...config, method: 'GET' })
	}
	post<T = any>(config: RequestConfig<T>): Promise<T> {
		return this.request<T>({ ...config, method: 'POST' })
	}
	delete<T = any>(config: RequestConfig<T>): Promise<T> {
		return this.request<T>({ ...config, method: 'DELETE' })
	}
	patch<T = any>(config: RequestConfig<T>): Promise<T> {
		return this.request<T>({ ...config, method: 'PATCH' })
	}
}

export default Request
