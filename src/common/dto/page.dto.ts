import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	Min,
	ValidateNested
} from 'class-validator'

export class PageOptionsDto {
	@ApiProperty({
		description: '当前页包含数量',
		required: false,
		default: 10
	})
	@Type(() => Number)
	@IsInt()
	@Min(1)
	readonly pageSize: number = 10

	@ApiProperty({
		description: '当前页',
		required: false,
		default: 1
	})
	@Type(() => Number)
	@IsInt()
	@Min(1)
	readonly current: number = 1

	@ApiProperty({
		description: '数据总数',
		required: false
	})
	@Type(() => Number)
	@IsOptional()
	readonly total: number = 1
}

export class PageDto {
	@ValidateNested()
	@Type(() => PageOptionsDto)
	@IsNotEmpty()
	pagination: PageOptionsDto
}

export interface PageList<T> {
	list: Array<T>
	pagination: PageOptionsDto
}
