import { Types } from 'mongoose'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString, IsNotEmpty, MinLength, IsOptional, IsNumber, IsBoolean, ValidateNested, IsArray } from 'class-validator'
export class Meta {
	@ApiProperty({ description: '菜单标题' })
	@IsString()
	@IsOptional()
	readonly title: string

	@ApiProperty({
		description: '1、isLink: true 2、链接地址不为空(meta.isLink) 3、isIframe: false'
	})
	@IsBoolean()
	@IsOptional()
	readonly isLink: boolean

	@ApiProperty({
		description: '菜单是否缓存'
	})
	@IsBoolean()
	@IsOptional()
	readonly isKeepAlive: boolean

	@ApiProperty({
		description: '菜单是否在前端隐藏'
	})
	@IsBoolean()
	@IsOptional()
	readonly isHide: boolean

	@ApiProperty({
		description: '菜单是否固定'
	})
	@IsBoolean()
	@IsOptional()
	readonly isAffix: boolean

	@ApiProperty({
		description: '是否内嵌'
	})
	@IsBoolean()
	@IsOptional()
	readonly isIframe: boolean

	@ApiProperty({
		description: '菜单图标'
	})
	@IsString()
	@IsOptional()
	readonly icon: string
}
export class CreateMenuDto {
	@ApiProperty({ description: '父级菜单ID' })
	@IsString()
	@IsOptional()
	readonly parentId: string | null

	@ApiProperty({ description: '菜单路径' })
	@IsString()
	@MinLength(2)
	@IsNotEmpty()
	readonly path: string

	@ApiProperty({ description: '菜单类型 1为菜单, 2为按钮' })
	@IsNumber()
	@IsOptional()
	readonly type: number

	@ApiProperty({ description: '菜单name' })
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	readonly name: string

	@ApiProperty({
		description: '后端是否返回这个菜单'
	})
	@IsNumber()
	@IsOptional()
	readonly isEnable: number

	@ApiProperty({ description: '一级菜单排序' })
	@IsNumber()
	@IsOptional()
	readonly pIndex: number

	@ApiProperty({ description: '子排序' })
	@IsNumber()
	@IsOptional()
	readonly cIndex: number

	@ApiProperty({ description: '顶级菜单重定向路径' })
	@IsString()
	@IsOptional()
	readonly redirect?: string

	@ApiProperty({ description: 'meta' })
	@IsOptional()
	@ValidateNested()
	@Type(() => Meta)
	readonly meta: Meta
}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
	@ApiProperty({ description: '菜单ID' })
	@IsString()
	readonly _id?: string | Types.ObjectId
}

export class ChildrenMenuDto extends PartialType(UpdateMenuDto) {
	@ApiProperty({ description: '菜单ID' })
	@IsArray()
	children?: Array<UpdateMenuDto>
}

export class QueryMenu {
	@ApiProperty({ description: '菜单name' })
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	readonly name: string

	@ApiProperty({ description: '是否只要parent那一级' })
	@IsBoolean()
	@IsOptional()
	readonly onlyParent: boolean
}
