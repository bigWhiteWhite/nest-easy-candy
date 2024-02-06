import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { LogModule } from './log/log.module'
@Module({
	imports: [UserModule, LogModule]
})
export class SystemModule {}
