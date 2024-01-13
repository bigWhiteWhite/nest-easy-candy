import { ApiProperty } from '@nestjs/swagger'
import { modelOptions, prop } from '@typegoose/typegoose'

class Meta {
	@ApiProperty({ description: '菜单标题' })
	@prop({
		default: ''
	})
	title: string

	@ApiProperty({ description: '当isLink||isIframe为真,这个是必填' })
	@prop({
		default: ''
	})
	link: string

	@ApiProperty({
		description: '1、isLink: true 2、链接地址不为空(meta.isLink) 3、isIframe: false'
	})
	@prop({
		default: false
	})
	isLink: boolean

	@ApiProperty({ description: '菜单是否缓存' })
	@prop({
		default: true
	})
	isKeepAlive: boolean

	@ApiProperty({
		description: '菜单是否在前端隐藏,常用于详情页'
	})
	@prop({
		default: false
	})
	isHide: boolean

	@ApiProperty({
		description: '菜单是否固定（固定在 tagsView 中，不可进行关闭），右键菜单无 `关闭` 项'
	})
	@prop({
		default: false
	})
	isAffix: boolean

	@ApiProperty({
		description: '是否内嵌:1、isIframe: true 2、链接地址不为空(meta.isLink), 3、isLink: true'
	})
	@prop({
		default: false
	})
	isIframe: boolean

	@ApiProperty({
		description: '菜单图标'
	})
	@prop({
		default: ''
	})
	icon: string
}
@modelOptions({
	schemaOptions: {
		timestamps: true // 创建时间， 更新时间
	}
})
export class Menus {
	@ApiProperty({ description: '父级菜单ID' })
	@prop({
		required: false
	})
	parentId: string | null

	@ApiProperty({ description: '菜单路径' })
	@prop({
		default: '',
		unique: true
	})
	path: string

	@ApiProperty({ description: '菜单类型 - 1为菜单, 2为按钮' })
	@prop({
		required: true,
		default: 1
	})
	type: number

	@ApiProperty({ description: '菜单name' })
	@prop({
		required: true,
		unique: true
	})
	name: string

	@ApiProperty({ description: '后端是否返回这个菜单' })
	@prop({
		required: false,
		default: 1
	})
	isEnable: number

	@ApiProperty({ description: '一级菜单排序' })
	@prop({
		required: false
	})
	pIndex: number

	@ApiProperty({ description: '子排序' })
	@prop({
		required: false
	})
	cIndex: number

	@ApiProperty({ description: '顶级菜单重定向路径' })
	@prop({
		required: false
	})
	redirect: string

	@ApiProperty({ description: 'meta' })
	@prop({
		_id: false,
		required: false,
		default: () => ({
			title: '',
			isKeepAlive: true,
			link: '',
			isLink: false,
			isHide: false,
			isAffix: false,
			isIframe: false,
			icon: ''
		})
	})
	meta: Meta
}
