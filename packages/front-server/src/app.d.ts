import { AxiosRequestConfig } from 'axios'
import { Socket } from 'socket.io-client'
declare module 'axios' {
	export interface AxiosRequestConfig {
		successNotify?: boolean
		failNotify?: boolean
	}
}
declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$socket: Socket // 这里的 Socket 类型需要根据你的实际使用来自定义
	}
}
