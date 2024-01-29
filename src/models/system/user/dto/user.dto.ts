import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	ArrayMinSize,
	ArrayNotEmpty,
	IsArray,
	IsIn,
	IsInt,
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsString,
	Matches,
	MinLength,
	ValidateNested
} from 'class-validator'
import { RoleSystemMenusIdInfo } from '../../role/dto/update-role.dto'
import { SystemInfo } from '../../admin-system/dto/admin-systen.dto'
import { MenuListDto } from '../../menu/dto/menu.dto'
export class UserBaseInfo {
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
		description: '手机号'
	})
	@IsOptional()
	readonly phone: number | string

	@ApiProperty({
		description: '备注'
	})
	@IsString()
	@IsOptional()
	readonly remark: string

	@ApiProperty({ description: '用户头像' })
	@IsString()
	@IsOptional()
	readonly userAvatar: string
}

export class RegisterAuthDto extends UserBaseInfo {
	@ApiProperty({
		description: '密码'
	})
	@IsString()
	@IsOptional()
	@MinLength(6)
	@Matches(/^[a-z0-9A-Z`~!#%^&*=+\\|{};:'\\",<>/?]+$/)
	password: string

	@ApiProperty({ description: '状态' }) // 用户是否禁用，0为禁用，1为正常
	@IsIn([0, 1])
	@IsOptional()
	status: number

	@ApiProperty({
		description: '归属角色',
		type: [Number]
	})
	@IsArray()
	@ArrayNotEmpty()
	@ArrayMinSize(1)
	roles: string[]
}

export class UserInfo extends UserBaseInfo {
	@ApiProperty({
		description: '角色菜单'
	})
	@ValidateNested()
	@Type(() => Array<RoleSystemMenusIdInfo>)
	roles: Array<RoleSystemMenusIdInfo>
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

export class UserSystemMenuId {
	@ApiProperty({ description: '系统对象' })
	@IsNotEmpty()
	@Type(() => SystemInfo)
	readonly system: SystemInfo

	@ApiProperty({ description: '系统菜单ids -- 涵盖该系统下的所有菜单' })
	@IsArray()
	menus?: Array<string>
}

export class UserSystemMenus {
	@ApiProperty({ description: '系统对象' })
	@IsNotEmpty()
	@Type(() => SystemInfo)
	readonly system: SystemInfo

	@ApiProperty({ description: '菜单' })
	@IsArray()
	readonly menus?: Array<MenuListDto>
}
