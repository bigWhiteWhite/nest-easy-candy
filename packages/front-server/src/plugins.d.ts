import { Socket } from 'socket.io-client'
declare module 'js-cookie'

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$socket: Socket // 这里的 Socket 类型需要根据你的实际使用来自定义
	}
}
