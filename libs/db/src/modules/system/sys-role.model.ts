import { ApiProperty } from '@nestjs/swagger'
import { Ref, modelOptions, prop } from '@typegoose/typegoose'
import { RoleSystemMenus } from './sys-role-system-menus.model'

@modelOptions({
	schemaOptions: {
		timestamps: true // 创建时间， 更新时间
	}
})
export class Role {
	@ApiProperty({ description: '角色名称', example: 'role' }) // 接口文档里面对于字段的描述和默认值
	@prop({
		required: true,
		unique: true
	})
	roleName: string

	@ApiProperty({
		description: '备注'
	})
	@prop({
		required: false
	})
	remark: string

	//聚合查询
	@prop({
		ref: 'RoleSystemMenus',
		localField: '_id', // 表示本地键，也就是Course用哪一个键关联它的儿子
		foreignField: 'roleSystemId' // 外键是什么，也就是RoleSystemMenus中应该用什么键来关联
	})
	roleSystemMenus: Ref<RoleSystemMenus>[] // 变为虚拟字段，然后就可以查出来，数组类型定义
}
