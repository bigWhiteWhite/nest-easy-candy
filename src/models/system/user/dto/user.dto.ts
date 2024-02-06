import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength, Matches, MaxLength, IsOptional, IsEmail, ValidateIf, IsIn, IsMobilePhone } from 'class-validator'
import { isEmpty } from 'lodash'

export class CreateUserDto {
	@ApiProperty({
		description: '用户姓名'
	})
	@IsString()
	@MinLength(2)
	username: string

	@ApiProperty({
		required: false,
		description: '手机号'
	})
	@IsMobilePhone(['zh-CN', 'zh-HK', 'zh-MO', 'zh-TW'])
	phone: string

	@ApiProperty({
		description: '登录密码'
	})
	@IsString()
	@Matches(/^[a-z0-9A-Z]+$/)
	@MinLength(6)
	@MaxLength(20)
	password: string

	@ApiProperty({
		required: false,
		description: '邮箱'
	})
	@IsEmail()
	@ValidateIf((o) => !isEmpty(o.email))
	email: string

	@ApiProperty({
		required: false,
		description: '头像'
	})
	@IsString()
	@IsOptional()
	avatar: string

	@ApiProperty({
		required: false,
		description: '备注'
	})
	@IsString()
	@IsOptional()
	remark: string

	@ApiProperty({
		description: '状态'
	})
	@IsIn([0, 1])
	status: number
}
