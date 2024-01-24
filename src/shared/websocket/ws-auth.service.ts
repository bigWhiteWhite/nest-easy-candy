import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { isEmpty } from 'lodash'
import { SocketException } from '../../service/exceptions/socket.exception'
import { UserService } from '../../models/system/user/user.service'
import { AdminUser } from '../../models/system/system.interface'
import { Socket } from 'socket.io'
import { EVENT_ONLINE } from './ws.event'

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		@Inject(forwardRef(() => UserService))
		private userService: UserService
	) {}

	/**
	 * @param token 用户token
	 */
	checkAdminAuthToken(token: string | string[] | undefined): AdminUser | never {
		if (isEmpty(token)) {
			throw new SocketException(11001)
		}
		try {
			// 挂载对象到当前请求上
			return this.jwtService.verify(Array.isArray(token) ? token[0] : token)
		} catch (e) {
			// 无法通过token校验
			throw new SocketException(11001)
		}
	}

	/**
	 * @description 用户在连接websocket时都进入所属系统的房间
	 */
	async joinRoom(client: Socket, user: AdminUser) {
		try {
			const { username, userSystemMenus } = await this.userService.infoWithSystem(user._id)
			const { roles } = await this.userService.info(user._id)
			const systemNames = userSystemMenus.map((item) => item.system.systemName)
			client.join(`user:${user._id}`)
			systemNames.forEach((name) => {
				console.log(`${username}加入系统sys:${name}房间`)
				client.join(`sys:${name}`)
			})
			roles.forEach((id) => {
				console.log(`${username}加入角色role:${id}房间`)
				client.join(`role:${id}`)
			})
			client.broadcast.to(systemNames).emit(EVENT_ONLINE, { username })
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
