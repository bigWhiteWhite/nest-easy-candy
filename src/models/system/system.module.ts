import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import SysUser from '@/entities/server/sys-user.entity'
@Module({
	imports: [TypeOrmModule.forFeature([SysUser])]
})
export class SystemModule {}
