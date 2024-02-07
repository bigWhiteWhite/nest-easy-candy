import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { BaseEntity } from '../base.entity'

@Entity({ name: 'sys_user' })
export default class SysUser extends BaseEntity {
	@PrimaryGeneratedColumn()
	@ApiProperty()
	id: number

	@Column({ nullable: true, default: 'user' })
	@ApiProperty()
	username: string

	@Column({ unique: true })
	@ApiProperty()
	phone: string

	@Column()
	@ApiProperty()
	password: string

	@Column({ name: 'avatar', nullable: true })
	@ApiProperty()
	avatar: string

	@Column({ nullable: true, unique: true })
	@ApiProperty()
	email: string

	@Column({ nullable: true })
	@ApiProperty()
	remark: string

	@Column({ type: 'tinyint', nullable: true, default: 1 })
	@ApiProperty()
	status: number
}
