import { Module } from '@nestjs/common'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'
import { AdminSystemService } from '../admin-system/admin-system.service'
import { MenuService } from '../menu/menu.service'
@Module({
	controllers: [RoleController],
	providers: [RoleService, AdminSystemService, MenuService],
	exports: [RoleService]
})
export class RoleModule {}
