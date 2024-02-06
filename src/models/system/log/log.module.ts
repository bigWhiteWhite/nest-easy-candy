import { Module } from '@nestjs/common'
import { LogService } from './log.service'
import { LogController } from './log.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import SysLoginLog from '@/entities/server/sys-login-log.entity'

@Module({
	imports: [TypeOrmModule.forFeature([SysLoginLog])],
	controllers: [LogController],
	providers: [LogService],
	exports: [LogService]
})
export class LogModule {}
