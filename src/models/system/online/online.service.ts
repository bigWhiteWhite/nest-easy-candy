import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { LogService } from '../log/log.service'
import { EVENT_KICK } from '@/shared/websocket/ws.event'
import { WSGateway } from '@/shared/websocket/ws.gateway'
import { WSService } from '@/shared/websocket/ws.service'

@Injectable()
export class OnlineService {
	constructor(
		private wsService: WSService,
		private wsGateway: WSGateway,
		private jwtService: JwtService,
		private userService: UserService,
		private logService: LogService
	) {}

	/**
	 * 罗列在线用户列表
	 */
	async listOnlineUser() {
		const onlineSockets = await this.wsService.getOnlineSockets()
		if (!onlineSockets || onlineSockets.length <= 0) {
			return []
		}
		const onlineIds = onlineSockets.map((socket) => {
			const token = socket.handshake.query?.token as string
			return this.jwtService.verify(token)._id
		})
		return await this.logService.findLastLoginInfoList(onlineIds)
	}

	// 下线用户
	async kick(user, id: string) {
		await this.userService.forbidden(id)
		// socket emit
		const socket = await this.wsService.findSocketIdByUid(id)
		if (socket) {
			// socket emit event
			this.wsGateway.socketServer
				.to(socket.id)
				.emit(EVENT_KICK, { operater: user.username })
			// close socket
			socket.disconnect()
		}
	}
}
