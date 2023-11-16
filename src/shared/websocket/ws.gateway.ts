import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { AuthService } from './ws-auth.service'
import { EVENT_OFFLINE } from './ws.event'
import { AdminUser } from '../../models/system/system.interface'
/**
 * Admin WebSokcet网关，不含权限校验，Socket端只做通知相关操作
 */
@WebSocketGateway(parseInt(process.env.WS_PORT), {
	namespace: '/ws-admin',
	transports: ['websocket'], // default ['polling','websocket', 'webtransport']
	cors: {
		origin: '*'
	}
})
export class WSGateway
	implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
	// 原生特定库的服务器实例
	@WebSocketServer()
	private wss: Server

	get socketServer(): Server {
		return this.wss
	}
	constructor(private authService: AuthService) {}

	/**
	 * OnGatewayInit - 强制执行afterInit()方法。将特定于库的服务器实例作为参数
	 * @param server Server
	 */
	afterInit() {
		console.log('websocket init ...')
	}
	/**
	 * OnGatewayConnection - 强制执行handleConnection()方法。将特定于库的客户端 socket 实例作为参数。
	 */
	async handleConnection(client: Socket): Promise<void> {
		try {
			const user: AdminUser = this.authService.checkAdminAuthToken(
				client.handshake?.query?.token
			)
			this.authService.joinRoom(client, user)
		} catch (e) {
			client.disconnect()
			return
		}
	}
	/**
	 * OnGatewayDisconnect - 强制执行handleDisconnect()方法。将特定于库的客户端 socket 实例作为参数。
	 */
	async handleDisconnect(client: Socket): Promise<void> {
		try {
			const rooms = Object.keys(client.rooms)
			rooms
				.filter((room) => room !== client.id)
				.forEach((room) => {
					client.leave(room)
				})
			client.broadcast.to(rooms).emit(EVENT_OFFLINE) // Broadcast to the specific rooms
		} catch (error) {
			return Promise.reject(error)
		}
	}

	@SubscribeMessage('message')
	handleMessage(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
		console.log('🚀 ~ file: ws.gateway.ts:66 ~ handleMessage ~ client:', client)
		console.log('🚀 ~ file: ws.gateway.ts:44 ~ handleMessage ~ body:', body)
	}
}
