import { ApiProperty, PartialType } from '@nestjs/swagger'
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator'
import { UpdateMenuDto } from '../../menu/dto/menu.dto'
import { EditAuthDto } from './user.dto'

export class QueryUser {
	@ApiProperty({ description: '用户名' })
	@IsString()
	readonly username: string
}

export class UserSysMenuId {
	@ApiProperty({ description: '系统ID' })
	@IsNotEmpty()
	@IsString()
	_id?: string

	@ApiProperty({ description: '系统名称' })
	@IsString()
	systemName?: string

	@ApiProperty({ description: '系统菜单ids -- 涵盖该系统下的所有菜单' })
	@IsArray()
	menuIds?: Array<string>
}

export class UserSystemMenus extends PartialType(UserSysMenuId) {
	@ApiProperty({ description: '系统下的所有菜单' })
	@IsArray()
	@ArrayNotEmpty()
	readonly menus: Array<UpdateMenuDto>
}
export class UserSysInfo extends EditAuthDto {
	@ApiProperty({ description: '用户ID' })
	@ArrayNotEmpty()
	userSystemMenus: Array<UserSystemMenus>
}
