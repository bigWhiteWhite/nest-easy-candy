import type { AxiosRequestConfig, AxiosResponse } from 'axios'

interface RequestHook<T = AxiosResponse> {
	requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
	requestInterceptorsCatch?: (error: any) => any
	responseInterceptor?: (res: T) => T
	responseInterceptorsCatch?: (error: any) => any
}

interface RequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
	interceptors?: RequestHook<T>
	showLoading?: boolean
}

export { RequestHook, RequestConfig }
