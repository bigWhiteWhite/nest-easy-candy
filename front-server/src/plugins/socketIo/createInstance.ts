import type { Socket, ManagerOptions } from 'socket.io-client'
import io from 'socket.io-client'
import Cookies from 'js-cookie'

export class CreateSocketInstance {
	private url: string
	private opts: Partial<ManagerOptions>
	private socket: null | Socket = null
	constructor(
		url: string = import.meta.env.VITE_WEBSOCKET_URL,
		opts: Partial<ManagerOptions> = {
			query: {
				token: Cookies.get('CmsSystemToken') || ''
			},
			transports: ['websocket'], // default ['polling','websocket', 'webtransport']
			reconnectionDelay: 3000, // 重连延迟时间（毫秒）
			reconnectionDelayMax: 5000, // 重连延迟的最大值（5 秒）
			randomizationFactor: 0.5 // 引入随机性
		}
	) {
		this.url = url
		this.opts = opts
	}

	connect() {
		// 检测连接状态
		if (this.socket && this.socket.connected) {
			console.log('Already connected. Skipping url.')
			return
		}
		// 如果未连接，则进行连接操作
		this.socket = io(this.url, this.opts)
		// 监听连接成功事件
		this.socket.on('connect', () => {
			console.log('Connected to the server.')
		})
	}

	disconnect() {
		// 断开连接
		if (this.socket) {
			this.socket.disconnect()
			console.log('Disconnected from the server.')
		}
	}
}
