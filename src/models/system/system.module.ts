import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { AdminSystemModule } from './admin-system/admin-system.module'
import { MenuModule } from './menu/menu.module'
import { RoleModule } from './role/role.module'
import { OnlineModule } from './online/online.module'
import { LogModule } from './log/log.module'
@Module({
	imports: [
		UserModule,
		AdminSystemModule,
		MenuModule,
		RoleModule,
		OnlineModule,
		LogModule
	]
})
export class SystemModule {}
