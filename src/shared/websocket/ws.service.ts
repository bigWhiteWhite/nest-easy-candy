import { Injectable } from '@nestjs/common'
import { RemoteSocket } from 'socket.io'
import { EVENT_UPDATE_MENU } from './ws.event'
import { JwtService } from '@nestjs/jwt'
import { WSGateway } from './ws.gateway'
@Injectable()
export class WSService {
	constructor(private jwtService: JwtService, private wsGateway: WSGateway) {}

	/**
	 * 获取当前在线用户
	 */
	async getOnlineSockets() {
		const onlineSockets = await this.wsGateway.socketServer.fetchSockets()
		return onlineSockets
	}

	/**
	 * 根据_id查找socketid
	 */
	async findSocketIdByUid(
		_id: string
	): Promise<RemoteSocket<unknown, unknown>> {
		const onlineSockets = await this.getOnlineSockets()
		const socket = onlineSockets.find((socket) => {
			const token = socket.handshake.query?.token as string
			const tokenUid = this.jwtService.verify(token)._id
			return tokenUid === _id
		})
		return socket
	}

	/**
	 * 根据uid数组过滤出socketid
	 */
	async filterSocketIdByUidArr(
		_ids: string[]
	): Promise<RemoteSocket<unknown, unknown>[]> {
		const onlineSockets = await this.getOnlineSockets()
		const sockets = onlineSockets.filter((socket) => {
			const token = socket.handshake.query?.token as string
			const tokenUid = this.jwtService.verify(token)._id
			return _ids.includes(tokenUid)
		})
		return sockets
	}

	/**
	 * 通知前端重新获取权限菜单
	 * @param _id
	 * @constructor
	 */
	async noticeUsersUpdateMenus(_id: string | string[], action: string) {
		const userIds = Array.isArray(_id) ? _id : [_id]
		const sockets = await this.filterSocketIdByUidArr(userIds)
		if (sockets && action) {
			// socket emit event
			this.wsGateway.socketServer.to(sockets.map((n) => n.id)).emit(action)
		}
	}

	/**
	 * 通知系统或者角色重新获取权限菜单
	 * @param type 0全部通知，1：系统，2：角色
	 * @param name 系统名或者角色
	 */
	async noticeUpdateMenus(type: 0 | 1 | 2, name?: string) {
		if (type === 0) {
			this.wsGateway.socketServer.emit(EVENT_UPDATE_MENU)
		} else if (type === 1) {
			this.wsGateway.socketServer.to(`sys:${name}`).emit(EVENT_UPDATE_MENU)
		} else if (type === 2) {
			this.wsGateway.socketServer.to(`role:${name}`).emit(EVENT_UPDATE_MENU)
		}
	}
}
