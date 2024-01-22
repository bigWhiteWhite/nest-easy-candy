import { ApiProperty, PartialType } from '@nestjs/swagger'
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator'
import { UpdateMenuDto } from '../../menu/dto/menu.dto'
import { Types } from 'mongoose'

export class QueryUser {
	@ApiProperty({ description: '用户名' })
	@IsString()
	readonly username: string
}
