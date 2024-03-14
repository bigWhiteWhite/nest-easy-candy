import { Module } from '@nestjs/common'
import { SystemModule } from './system/system.module'
import { FakerModule } from './faker/faker.module'
@Module({
	imports: [SystemModule, FakerModule],
	exports: [SystemModule, FakerModule]
})
export class indexModule {}
