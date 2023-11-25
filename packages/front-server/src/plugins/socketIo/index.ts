import { App } from 'vue'
import type { Socket, ManagerOptions } from 'socket.io-client'
import io from 'socket.io-client'

export default {
	install(app: App, connection: string, opts: ManagerOptions): void {
		// 没有传入连接，抛出异常 | No incoming connection, throw an exception
		if (!connection) {
			throw new Error('socket cannot locate connection')
		}
		const socket = io(connection, opts)
		console.log('🚀 ~ file: index.ts:12 ~ install ~ socket:', socket)
	}
}
