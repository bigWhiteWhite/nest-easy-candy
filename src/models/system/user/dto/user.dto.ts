import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ArrayMinSize, ArrayNotEmpty, IsIn, IsInt, IsNumberString, IsOptional, IsString, Matches, MinLength } from 'class-validator'

export class RegisterAuthDto {
	@ApiProperty({
		description: '账号'
	})
	@IsNumberString()
	readonly account: string | number

	@ApiProperty({
		description: '用户名'
	})
	@IsString()
	readonly username: string

	@ApiProperty({
		description: '呢称'
	})
	@IsString()
	@IsOptional()
	readonly nickName: string

	@ApiProperty({
		description: '密码'
	})
	@IsString()
	@IsOptional()
	@MinLength(6)
	@Matches(/^[a-z0-9A-Z`~!#%^&*=+\\|{};:'\\",<>/?]+$/)
	password: string

	@ApiProperty({
		description: '归属角色',
		type: [Number]
	})
	@IsOptional()
	roleIds: string[]

	@ApiProperty({
		description: '手机号'
	})
	@IsOptional()
	phone: number | string

	@ApiProperty({
		description: '备注'
	})
	@IsString()
	@IsOptional()
	remark: string

	@ApiProperty({ description: '状态' }) // 用户是否禁用，0为禁用，1为正常
	@IsIn([0, 1])
	@IsOptional()
	status: number

	@ApiProperty({ description: '用户头像' })
	@IsString()
	@IsOptional()
	userAvatar: string
}

export class EditAuthDto {
	@ApiProperty({
		description: '用户id'
	})
	@IsString()
	readonly _id?: string

	@ApiProperty({
		description: '呢称'
	})
	@IsString()
	readonly username: string

	@ApiProperty({
		description: '归属角色',
		type: [Number]
	})
	@ArrayNotEmpty()
	@ArrayMinSize(1)
	roles: string[]

	@ApiProperty({
		description: '手机号'
	})
	@IsOptional()
	phone: number | string

	@ApiProperty({
		description: '备注'
	})
	@IsString()
	@IsOptional()
	remark: string

	@ApiProperty({ description: '状态' }) // 用户是否禁用，0为禁用，1为正常
	@IsIn([0, 1])
	@IsOptional()
	status: number

	@ApiProperty({ description: '用户头像' })
	@IsString()
	@IsOptional()
	userAvatar: string
}

export class DeleteAuthDto {
	@ApiProperty({ description: '用户ID' })
	@ArrayNotEmpty()
	userIds: Array<string>
}

export class ImageCaptchaDto {
	@ApiProperty({
		required: false,
		default: 100,
		description: '验证码宽度'
	})
	@Type(() => Number)
	@IsInt()
	@IsOptional()
	readonly width: number = 100

	@ApiProperty({
		required: false,
		default: 50,
		description: '验证码高度'
	})
	@Type(() => Number)
	@IsInt()
	@IsOptional()
	readonly height: number = 50
}

export class LoginUserDto {
	@ApiProperty({
		required: true,
		description: '账号'
	})
	@Type(() => Number)
	@IsInt()
	readonly account: number

	@ApiProperty({
		required: true,
		description: '密码'
	})
	@IsString()
	readonly password: string

	@ApiProperty({
		required: true,
		description: '验证码Id'
	})
	@IsString()
	readonly validId: string

	@ApiProperty({
		required: true,
		description: '验证码'
	})
	@IsString()
	readonly validCode: string
}

export class UpdatePasswordDto {
	@ApiProperty({
		required: true,
		description: '更改前的密码'
	})
	@IsString()
	@MinLength(6)
	@Matches(/^[a-z0-9A-Z`~!#%^&*=+\\|{};:'\\",<>/?]+$/)
	originPassword: string

	@ApiProperty({
		required: true,
		description: '更改后的密码'
	})
	@MinLength(6)
	@Matches(/^[a-z0-9A-Z`~!#%^&*=+\\|{};:'\\",<>/?]+$/)
	newPassword: string
}
