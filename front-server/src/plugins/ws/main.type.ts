import { Socket, ManagerOptions } from 'socket.io-client'
export type SocketConstant = WebSocket | Socket

// 传输数据时的处理函数类型定义 | Type definition of processing function when transferring data
export type storeHandler<T = any> = (
	eventName: string,
	event: {
		data: string
		mutation: string
		namespace: string
		action: string
	},
	opts?: T
) => void

// 插件调用者可以传的参数类型定义 | The parameter type definition that the plug-in caller can pass
export type websocketOpts<T = any> = {
	lib?: string // socketIo
	format: string // json
	reconnection?: boolean
	reconnectionAttempts?: number
	reconnectionDelay?: number
	connectManually?: boolean // 是否手动管理连接
	passToStoreHandler?: storeHandler
	store?: T
	mutations?: T
	protocol?: string
	WebSocket?: WebSocket
	$setInstance?: (event: EventTarget) => void
} & Partial<ManagerOptions>
