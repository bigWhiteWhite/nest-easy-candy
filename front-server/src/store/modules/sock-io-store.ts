import { defineStore } from 'pinia'
import { SocketIoStatus } from './interface'
import { ManagerOptions, io } from 'socket.io-client'
import Cookies from 'js-cookie'

export const useSocketIo = defineStore(
	// 唯一ID
	'socketIo',
	{
		state: (): SocketIoStatus => ({
			socket: null
		}),
		actions: {
			initSocket(
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
				// 检测连接状态
				console.log('🚀 ~ file: sock-io-store.ts:28 ~ this.socket:', this.socket)
				if (this.socket && this.socket.connected) {
					console.log('Already connected. Skipping url.')
					return
				}
				// 如果未连接，则进行连接操作
				this.socket = io(url, opts)
				// 监听连接成功事件
				this.socket.on('connect', () => {
					console.log('Connected to the server.')
				})
			},
			disconnect() {
				// 断开连接
				if (this.socket) {
					this.socket.disconnect()
					console.log('Disconnected from the server.')
				}
			}
		},
		// 持久化存储插件其他配置
		persist: {
			// 修改存储中使用的键名称，默认为当前 Store的 id
			key: 'socketIo',
			// sessionStorage | localStorage
			storage: window.localStorage,
			// 部分持久化状态的点符号路径数组，[]意味着没有状态被持久化(默认为undefined，持久化整个状态)
			paths: ['socket']
		}
	}
)
