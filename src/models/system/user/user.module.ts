import { Global, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './user.controller'
import { UserService } from './user.service'

// ?使用了@Global()意味着其中定义的提供者（服务）将在整个 Nest.js 应用程序中可用
@Global()
@Module({
	imports: [PassportModule],
	controllers: [AuthController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}
