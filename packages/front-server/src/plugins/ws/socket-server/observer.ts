import Emitter from './emitter'
import { SocketConstant, websocketOpts } from '../main.type'
import io from 'socket.io-client'
export default class {
	private readonly format: string // 数据传输格式 | Data transmission format
	private readonly connectionUrl: string // 连接url | Connection url
	private readonly opts: websocketOpts // 调用者可以传入的自定义参数 | Custom parameters that the caller can pass in
	public reconnection: boolean // 是否开启重连 | Whether to enable reconnection
	public reconnectTimeoutId = 0 // 重连超时id | Reconnect timeout id
	public WebSocket: SocketConstant | undefined // websocket连接 | websocket connection
	/**
	 * 观察者模式, websocket服务核心功能封装 | Observer mode, websocket service core function package
	 * @param connectionUrl 连接的url
	 * @param opts 其它配置项 | Other configuration items
	 */
	constructor(connectionUrl: string, opts: websocketOpts = { format: '' }) {
		// 获取参数中的format并将其转成小写 | Get the format in the parameter and convert it to lowercase
		this.format = opts.format && opts.format.toLowerCase()

		// 如果url以//开始对其进行处理添加正确的websocket协议前缀 | If the URL starts with // to process it, add the correct websocket protocol prefix
		if (connectionUrl.startsWith('//')) {
			// 当前网站如果为https请求则添加wss前缀否则添加ws前缀 | If the current website is an https request, add the wss prefix, otherwise add the ws prefix
			const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws'
			connectionUrl = `${scheme}:${connectionUrl}`
		}
		// 将处理好的url和opts赋值给当前类内部变量 | Assign the processed url and opts to the internal variables of the current class
		this.connectionUrl = connectionUrl
		this.opts = opts
		this.reconnection = this.opts.reconnection || false

		// 建立连接 | establish connection
		this.connect()
		// 事件触发
		this.onEvent()
	}

	// 连接websocket | Connect websocket
	connect(): SocketConstant | undefined {
		// 获取配置参数传入的协议 | Get the protocol passed in the configuration parameter
		const protocol = this.opts.protocol || ''
		if (this.opts.lib === 'socketIo') {
			this.WebSocket = io(this.connectionUrl, this.opts)
		} else {
			// 如果没传协议就建立一个正常的websocket连接否则就创建带协议的websocket连接 | If no protocol is passed, establish a normal websocket connection, otherwise, create a websocket connection with protocol
			this.WebSocket = this.opts.WebSocket || (protocol === '' ? new WebSocket(this.connectionUrl) : new WebSocket(this.connectionUrl, protocol))
		}
		// 启用json发送 | Enable json sending
		if (this.format === 'json') {
			// 如果websocket中没有senObj就添加这个方法对象 | If there is no sen Obj in websocket, add this method object
			if (!('sendObj' in (this.WebSocket as SocketConstant))) {
				// 将发送的消息转为json字符串 | Convert the sent message into a json string
				;(this.WebSocket as WebSocket).sendObj = (obj: JSON) => (this.WebSocket as WebSocket).send(JSON.stringify(obj))
			}
		}
		return this.WebSocket
	}

	// 事件分发 | Event distribution
	onEvent(): void {
		;['onmessage', 'onclose', 'onerror', 'onopen'].forEach((eventType: string) => {
			// @ts-ignore
			;(this.WebSocket as SocketConstant)[eventType] = (event: any) => {
				Emitter.emit(eventType, event)
				// 处于重新连接状态切事件为onopen时执行 | Execute when the event is onopen in the reconnect state
				if (this.reconnection && eventType === 'onopen') {
					// 设置实例 | Setting example
					this.opts.$setInstance && this.opts.$setInstance(event.currentTarget)
				}
			}
		})
	}
}
