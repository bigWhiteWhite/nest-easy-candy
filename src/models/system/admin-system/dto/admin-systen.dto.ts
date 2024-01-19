import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsString, IsNotEmpty, MinLength, IsArray, IsOptional, ArrayNotEmpty, IsBoolean } from 'class-validator'
import { MenuListDto, UpdateMenuDto } from '../../menu/dto/menu.dto'
import { Types } from 'mongoose'

export class CreateSystemDto {
	@ApiProperty({ description: '系统名称' })
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	readonly systemName: string

	@ApiProperty({ description: '系统值' })
	@IsString()
	@IsOptional()
	@MinLength(2)
	readonly systemValue: string

	@ApiProperty({ description: '系统菜单ids -- 涵盖该系统下的所有菜单' })
	@IsArray()
	@ArrayNotEmpty()
	@IsOptional()
	readonly menus?: Array<string>
}
export class UpdateSystemDto extends PartialType(CreateSystemDto) {
	@ApiProperty({
		description: '系统ID'
	})
	@IsString()
	readonly _id?: string | Types.ObjectId
}
export class SystemInfo {
	@ApiProperty({
		description: '系统ID'
	})
	@IsString()
	readonly _id?: string | Types.ObjectId

	@ApiProperty({ description: '系统名称' })
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	readonly systemName: string

	@ApiProperty({ description: '系统值' })
	@IsString()
	@MinLength(2)
	readonly systemValue: string
}
export class SystemInfoDto extends PartialType(SystemInfo) {
	@ApiProperty({ description: '系统下的所有菜单' })
	@IsArray()
	@ArrayNotEmpty()
	readonly menus: Array<MenuListDto>
}

export class SystemQuery {
	@ApiProperty({ description: '是否需要填充' })
	@IsBoolean()
	@IsOptional()
	readonly shouldPopulate: boolean

	@ApiProperty({ description: '找不到系统是否报错' })
	@IsBoolean()
	@IsOptional()
	readonly isError: boolean
}
export class SystemIds extends SystemQuery {
	@ApiProperty({ description: '系统ids' })
	@IsArray()
	@ArrayNotEmpty()
	readonly systemIds: Array<string>
}
export class SystemId extends SystemQuery {
	@ApiProperty({ description: '系统ids' })
	@IsString()
	@IsNotEmpty()
	readonly systemId: string
}

export class QuerySystem {
	@ApiProperty({ description: '系统name' })
	@IsString()
	@IsNotEmpty()
	readonly systemName: string

	@ApiProperty({ description: '系统value' })
	@IsString()
	@IsNotEmpty()
	readonly systemValue: string
}
