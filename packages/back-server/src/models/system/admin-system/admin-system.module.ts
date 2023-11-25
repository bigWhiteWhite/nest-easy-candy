import { Module } from '@nestjs/common'
import { AdminSystemController } from './admin-system.controller'
import { AdminSystemService } from './admin-system.service'
import { MenuService } from '../menu/menu.service'

@Module({
	controllers: [AdminSystemController],
	providers: [AdminSystemService, MenuService],
	exports: [AdminSystemService]
})
export class AdminSystemModule {}
