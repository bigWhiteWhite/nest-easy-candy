import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsString, IsNotEmpty, MinLength, IsArray, IsOptional, ArrayNotEmpty } from 'class-validator'
import { UpdateMenuDto } from '../../menu/dto/menu.dto'
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
export class SystemNameId {
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
}
export class SystemInfoDto extends PartialType(SystemNameId) {
	@ApiProperty({ description: '系统值' })
	@IsString()
	@MinLength(2)
	readonly systemValue: string

	@ApiProperty({ description: '系统下的所有菜单' })
	@IsArray()
	@ArrayNotEmpty()
	readonly menus: Array<UpdateMenuDto>

	// @ApiProperty({ description: '系统下的所有菜单Ids' })
	// @IsArray()
	// readonly menuIds: Array<Types.ObjectId>
}

export class SystemIds {
	@ApiProperty({ description: '系统ids' })
	@IsArray()
	@ArrayNotEmpty()
	readonly systemIds: Array<string>
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
