import { Module } from '@nestjs/common'
import SysLoginLog from '@/entities/server/sys-login-log.entity'
import SysUser from '@/entities/server/sys-user.entity'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LogService } from './log/log.service'
import { JwtStrategy } from './user/strategy/jwt.strategy'
import { LocalStrategy } from './user/strategy/local.strategy'
import { AuthController } from './user/user.controller'
import { LogController } from './log/log.controller'
import { UserService } from './user/user.service'
@Module({
	imports: [TypeOrmModule.forFeature([SysUser, SysLoginLog]), PassportModule],
	controllers: [AuthController, LogController],
	providers: [LocalStrategy, JwtStrategy, UserService, LogService],
	exports: [UserService, LogService]
})
export class SystemModule {}
