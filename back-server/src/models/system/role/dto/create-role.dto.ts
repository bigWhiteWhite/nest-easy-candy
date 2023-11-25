import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsString, ValidateNested, IsNotEmpty, ArrayNotEmpty, IsArray } from 'class-validator'

export class SystemMenusIdsType {
	@ApiProperty({ description: '系统ID' })
	@IsNotEmpty()
	@IsString()
	readonly systemId: string

	@ApiProperty({ description: '系统名' })
	@IsNotEmpty()
	@IsString()
	readonly systemName: string

	@ApiProperty({ description: '菜单IDs' })
	@IsArray()
	@ArrayNotEmpty({
		message: '菜单Ids不能为空'
	})
	readonly menuIds: Array<string>
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
	@Type(() => SystemMenusIdsType)
	readonly systemMenusIds: SystemMenusIdsType[]
}

export class QueryRole {
	@ApiProperty({ description: '角色名称' })
	@IsNotEmpty()
	@IsString()
	readonly roleName: string
}
