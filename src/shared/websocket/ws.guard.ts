import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Socket } from 'socket.io'
import { AuthService } from './ws-auth.service'
import { SocketException } from '../../service/exceptions/socket.exception'

@Injectable()
export class WSGuard implements CanActivate {
	constructor(private authService: AuthService) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const client = context.switchToWs().getClient<Socket>()
		const token = client?.handshake?.query?.token
		try {
			// 挂载对象到当前请求上
			this.authService.checkAdminAuthToken(token)
			return true
		} catch (e) {
			console.log('🚀 ~ file: ws.guard.ts:21 ~ WSGuard ~ e:', e)
			// close
			client.disconnect()
			// 无法通过token校验
			throw new SocketException(11001)
		}
	}
}
