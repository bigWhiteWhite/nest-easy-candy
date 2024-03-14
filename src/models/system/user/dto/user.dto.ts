import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength, Matches, MaxLength, IsOptional, IsEmail, ValidateIf, IsIn, IsMobilePhone } from 'class-validator'
import { isEmpty } from 'lodash'

export class ValidInfo {
	@ApiProperty({
		required: false,
		description: '备注'
	})
	@IsString()
	@IsOptional()
	validId: string

	@ApiProperty({
		required: false,
		description: '备注'
	})
	@IsString()
	@IsOptional()
	validCode: string
}
export class CreateUserDto extends ValidInfo {
	@ApiProperty({
		description: '用户姓名'
	})
	@IsString()
	@IsOptional()
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
	@MinLength(4)
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
	@IsOptional()
	@IsIn([0, 1])
	status: number
}
