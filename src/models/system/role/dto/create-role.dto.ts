import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsString, ValidateNested, IsNotEmpty, ArrayNotEmpty, IsArray } from 'class-validator'
import { SystemInfoDto } from '../../admin-system/dto/admin-systen.dto'
import { UpdateMenuDto } from '../../menu/dto/menu.dto'

export class SystemMenusIdsType {
	@ApiProperty({ description: '系统名' })
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => SystemInfoDto)
	readonly system: SystemInfoDto

	@ApiProperty({ description: '菜单IDs' })
	@ValidateNested()
	@Type(() => UpdateMenuDto)
	readonly menus: Array<UpdateMenuDto>
}
export class CreateSystemMenusIds {
	@ApiProperty({ description: '系统名' })
	@IsNotEmpty()
	@IsString()
	readonly system: string

	@ApiProperty({ description: '菜单IDs' })
	@IsArray()
	@ArrayNotEmpty({
		message: '菜单Ids不能为空'
	})
	readonly menus: Array<string>
}

export class CreateRoleDto {
	@ApiProperty({ description: '角色名称' })
	@IsNotEmpty()
	@IsString()
	readonly roleName: string

	@ApiProperty({ description: '备注' })
	@IsString()
	@IsOptional()
	readonly remark: string

	@ApiProperty({ description: '角色拥有的所有系统' })
	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => CreateSystemMenusIds)
	readonly systemMenus: CreateSystemMenusIds[]
}

export class QueryRole {
	@ApiProperty({ description: '角色名称' })
	@IsString()
	@IsOptional()
	readonly roleName: string
}
