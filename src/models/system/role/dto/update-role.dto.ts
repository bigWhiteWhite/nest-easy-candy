import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateRoleDto } from './create-role.dto'
import { IsNotEmpty, IsString, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { SystemInfo } from '../../admin-system/dto/admin-systen.dto'
import { MenuListDto } from '../../menu/dto/menu.dto'

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}

export class SystemMenusIds {
	@ApiProperty({ description: '系统对象' })
	@IsNotEmpty()
	@Type(() => RoleSystemMenus)
	system: SystemInfo

	@ApiProperty({ description: '菜单数组' })
	@IsNotEmpty()
	@Type(() => Array<MenuListDto>)
	menus: Array<MenuListDto>
}
export class RoleSystemContent {
	@ApiProperty({ description: '关联ID' })
	@IsNotEmpty()
	@IsString()
	_id?: string

	@ApiProperty({ description: '关联角色ID' })
	@IsNotEmpty()
	@IsString()
	roleSystemId: string

	@ApiProperty({ description: '系统菜单对象' })
	@IsNotEmpty()
	@Type(() => SystemMenusIds)
	systemMenusIds: Array<SystemMenusIds>
}
export class RoleInfo {
	@ApiProperty({ description: '角色ID' })
	@IsNotEmpty()
	@IsString()
	_id?: string

	@ApiProperty({ description: '角色名称' })
	@IsNotEmpty()
	@IsString()
	readonly roleName: string

	@ApiProperty({ description: '备注' })
	@IsString()
	@IsOptional()
	readonly remark: string
}
export class RoleSystemMenus extends RoleInfo {
	@ApiProperty({ description: '角色拥有的系统菜单数组' })
	@ValidateNested()
	@Type(() => Array<RoleSystemContent>)
	roleSystemMenus: Array<RoleSystemContent>
}
export class RoleInfoSystem extends RoleInfo {
	@ApiProperty({ description: '角色系统记录对象' })
	@IsNotEmpty()
	@Type(() => RoleSystemMenus)
	roleSystemMenus?: RoleSystemMenus
}
