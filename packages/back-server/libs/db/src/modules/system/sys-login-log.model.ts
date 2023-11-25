import { ApiProperty } from '@nestjs/swagger'
import { modelOptions, prop } from '@typegoose/typegoose'

// 可以定义模型的其他属性
@modelOptions({
	schemaOptions: {
		timestamps: true // 创建时间， 更新时间
	}
})
export class LoginLog {
	@ApiProperty({ description: '用户id' })
	@prop({
		required: true
	})
	userId: string

	@ApiProperty({ description: '呢称' })
	@prop({
		required: true
	})
	username: string

	@ApiProperty({ description: '手机号' })
	@prop({
		required: false
	})
	phone: number | string

	@ApiProperty({ description: '登录IP' })
	@prop({
		required: false
	})
	ip: string

	@ApiProperty({ description: 'ua' })
	@prop({
		required: true
	})
	ua: string
}
