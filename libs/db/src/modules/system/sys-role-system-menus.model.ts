import { ApiProperty } from '@nestjs/swagger'
import { Ref, modelOptions, prop } from '@typegoose/typegoose'
import { Role } from './sys-role.model'
import { Menus } from './sys-menus.model'
import { System } from './sys-system.model'
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

	@ApiProperty({ description: '系统ID' })
	@prop({
		required: true,
		ref: 'System'
	})
	system: Ref<System>

	// immutable: true // 这个验证规则会禁止修改
	@ApiProperty({ description: '菜单' })
	@prop({
		required: true,
		allowMixed: 0,
		ref: 'Menus'
	})
	menus: Ref<Menus>[]
}
