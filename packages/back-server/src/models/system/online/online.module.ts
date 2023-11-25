import { Module } from '@nestjs/common'
import { OnlineService } from './online.service'
import { OnlineController } from './online.controller'
import { LogService } from '../log/log.service'

@Module({
	controllers: [OnlineController],
	providers: [OnlineService, LogService]
})
export class OnlineModule {}
