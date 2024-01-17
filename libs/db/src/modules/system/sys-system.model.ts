import { ApiProperty } from '@nestjs/swagger'
import { Ref, modelOptions, prop } from '@typegoose/typegoose'
import { Menus } from './sys-menus.model'
/**
 * @description 系统表
 */
@modelOptions({
	schemaOptions: {
		timestamps: true // 创建时间， 更新时间
	}
})
export class System {
	@ApiProperty({ description: '系统名称' })
	@prop({
		required: true,
		unique: true,
		type: () => String
	})
	systemName: string

	@ApiProperty({ description: '系统值' })
	@prop({
		required: true,
		unique: true,
		type: () => String
	})
	systemValue: string

	@ApiProperty({ description: '系统菜单ids -- 涵盖该系统下的所有菜单' })
	@prop({
		required: true,
		allowMixed: 0,
		ref: 'Menus'
	})
	menus: Ref<Menus>[]
}
