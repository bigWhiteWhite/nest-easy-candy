import { ApiProperty } from '@nestjs/swagger'
import { Ref, modelOptions, prop } from '@typegoose/typegoose'
import { Role } from './sys-role.model'
import { Types } from 'mongoose'
export class SystemMenusIds {
	@ApiProperty({ description: '系统ID' })
	@prop({
		required: true,
		unique: true,
		type: () => String
	})
	systemId: string

	@ApiProperty({ description: '系统名称' })
	@prop({
		required: true,
		unique: true,
		type: () => String
	})
	systemName: string

	@ApiProperty({ description: '菜单IDs' })
	@prop({
		required: true,
		allowMixed: 0,
		type: () => [Types.ObjectId],
		immutable: true // 这个验证规则会禁止修改
	})
	menuIds: Array<Types.ObjectId | string>
}
/**
 * @description 角色和系统值关联表
 */
@modelOptions({
	schemaOptions: {
		timestamps: true // 创建时间， 更新时间
	}
})
export class RoleSystemMenus {
	@ApiProperty({ description: '角色ID' })
	@prop({
		ref: 'Role'
	})
	roleSystemId: Ref<Role>

	// @ApiProperty({ description: '角色拥有的所有系统id' })
	// @prop({ required: true, type: () => Array<string> })
	// systemIds: string[]
	@ApiProperty({ description: '角色拥有的所有系统及对应系统下所拥有的菜单id' })
	@prop({
		required: true,
		allowMixed: 0,
		type: () => Array<SystemMenusIds>
	})
	systemMenusIds?: SystemMenusIds[]
}
