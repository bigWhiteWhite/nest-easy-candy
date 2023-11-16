import { User } from './sys-user.model'
import { Role } from './sys-role.model'
import { RoleSystemMenus } from './sys-role-system-menus.model'
import { Menus } from './sys-menus.model'
import { System } from './sys-system.model'
import { LoginLog } from './sys-login-log.model'
import { TypegooseModule } from 'nestjs-typegoose'

export const SystemModules = TypegooseModule.forFeature([
	User,
	Role,
	System,
	Menus,
	RoleSystemMenus,
	LoginLog
])
