import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateRoleDto } from './create-role.dto'
import { IsNotEmpty, IsString, IsOptional, ValidateNested, ArrayNotEmpty, IsArray } from 'class-validator'
import { Type } from 'class-transformer'
import { SystemInfo } from '../../admin-system/dto/admin-systen.dto'
import { MenuListDto } from '../../menu/dto/menu.dto'

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}

export class Menus {
	@ApiProperty({ description: '系统下的所有菜单' })
	@IsArray()
	@ArrayNotEmpty()
	readonly menus: Array<MenuListDto>
}

export class RoleSystemContent {
	@ApiProperty({ description: '关联ID' })
	@IsNotEmpty()
	@IsString()
	readonly _id?: string

	@ApiProperty({ description: '关联角色ID' })
	@IsNotEmpty()
	@IsString()
	readonly roleSystemId: string

	@ApiProperty({ description: '系统对象' })
	@IsNotEmpty()
	@Type(() => SystemInfo)
	readonly system: SystemInfo & Menus

	@ApiProperty({ description: '菜单数组' })
	@IsNotEmpty()
	@Type(() => Array<MenuListDto>)
	readonly menus: Array<MenuListDto>
}
export class RoleSystemIdContent {
	@ApiProperty({ description: '关联ID' })
	@IsNotEmpty()
	@IsString()
	readonly _id?: string

	@ApiProperty({ description: '关联角色ID' })
	@IsNotEmpty()
	@IsString()
	readonly roleSystemId: string

	@ApiProperty({ description: '系统对象' })
	@IsNotEmpty()
	@Type(() => SystemInfo)
	readonly system: SystemInfo

	@ApiProperty({ description: '菜单id数组' })
	@IsArray()
	@ArrayNotEmpty()
	readonly menus: Array<string>
}
export class RoleInfo {
	@ApiProperty({ description: '角色ID' })
	@IsNotEmpty()
	@IsString()
	readonly _id?: string

	@ApiProperty({ description: '角色名称' })
	@IsNotEmpty()
	@IsString()
	readonly roleName: string

	@ApiProperty({ description: '备注' })
	@IsString()
	@IsOptional()
	readonly remark: string
}
export class RoleSystemMenusInfo extends RoleInfo {
	@ApiProperty({ description: '角色拥有的系统菜单数组' })
	@ValidateNested()
	@Type(() => Array<RoleSystemContent>)
	readonly roleSystemMenus: Array<RoleSystemContent>
}
export class RoleSystemMenusIdInfo extends RoleInfo {
	@ApiProperty({ description: '角色拥有的系统菜单数组' })
	@ValidateNested()
	@Type(() => Array<RoleSystemIdContent>)
	readonly roleSystemMenus: Array<RoleSystemIdContent>
}
