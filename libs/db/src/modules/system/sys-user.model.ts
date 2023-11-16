import { ApiProperty } from '@nestjs/swagger'
import { modelOptions, prop, DocumentType } from '@typegoose/typegoose'
import { hashSync } from 'bcryptjs'

export type UserDocument = DocumentType<User>

// 可以定义模型的其他属性
@modelOptions({
	schemaOptions: {
		timestamps: true // 创建时间， 更新时间
	}
})
export class User {
	@ApiProperty({ description: '账号', example: 'user1' }) // 接口文档里面对于字段的描述和默认值
	// 定义字段,描述字段是否是必选等属性
	@prop({
		required: true,
		unique: true
	})
	account: number | string

	@ApiProperty({ description: '呢称', example: '呢称' }) // 接口文档里面对于字段的描述和默认值
	// 定义字段,描述字段是否是必选等属性
	@prop({
		required: true
	})
	username: string

	@ApiProperty({ description: '密码', example: '123456' })
	@prop({
		required: true,
		select: false, // 默认查询不返回这个字段 --> 可以指定.select('+password')去提出password
		// 预定义模式修饰符  Getters与 Setters修饰符
		get: (value) => {
			return value
		},
		set: (value) => {
			return value ? hashSync(value) : value // 数据库存密码时进行加密
		}
	})
	password: string

	@ApiProperty({ description: '手机号' })
	@prop({
		required: false
	})
	phone: number | string

	@ApiProperty({ description: '备注' })
	@prop({
		required: false
	})
	remark: string

	@ApiProperty({ description: '状态' }) // 用户是否禁用，0为禁用，1为正常
	@prop({
		required: true,
		default: 1
	})
	status: number

	@ApiProperty({
		description: '用户头像',
		example:
			'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1813762643,1914315241&fm=26&gp=0.jpg'
	})
	@prop({
		required: false
	})
	userAvatar: string

	@ApiProperty({ description: '用户拥有的角色ID' })
	// 定义字段,描述字段是否是必选等属性
	@prop({
		required: true,
		default: []
	})
	roles: Array<string>
}
