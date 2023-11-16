import { Global, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './user.controller'
import { LocalStrategy } from './strategy/local.strategy'
import { JwtStrategy } from './strategy/jwt.strategy'
import { UserService } from './user.service'
import { RoleService } from '../role/role.service'
import { AdminSystemService } from '../admin-system/admin-system.service'
import { MenuService } from '../menu/menu.service'
import { LogService } from '../log/log.service'
import { AdminService } from '@/admin.service'

// ?使用了@Global()意味着其中定义的提供者（服务）将在整个 Nest.js 应用程序中可用
@Global()
@Module({
	imports: [PassportModule],
	controllers: [AuthController],
	providers: [
		LocalStrategy,
		JwtStrategy,
		AdminService,
		RoleService,
		UserService,
		AdminSystemService,
		MenuService,
		LogService
	],
	exports: [UserService]
})
export class UserModule {}
