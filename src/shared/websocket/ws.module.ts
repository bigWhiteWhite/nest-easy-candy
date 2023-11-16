import { Global, Module } from '@nestjs/common'
import { AuthService } from './ws-auth.service'
import { WSGateway } from './ws.gateway'
import { WSService } from './ws.service'
console.log('2')
const providers = [AuthService, WSService, WSGateway]
// ? 注册为全局模块，无需在局部模块中显式导入, 提供者在整个 Nest.js 应用程序中可用
@Global()
@Module({
	providers,
	exports: providers
})
export class WSModule {}
