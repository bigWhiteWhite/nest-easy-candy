import { Controller, Post, Body } from '@nestjs/common'
import { LogService } from './log.service'
import { ApiTags } from '@nestjs/swagger'
import { LoginInfo } from './class/log.class'
import { PageDto, PageList } from '@/common/dto/page.dto'

@Controller('admin/log')
@ApiTags('日志模块')
export class LogController {
	constructor(private readonly logService: LogService) {}

	@Post('listLoginLog')
	listLoginLog(@Body() body: PageDto): Promise<PageList<LoginInfo>> {
		const { pagination } = body
		return this.logService.listLoginLog(pagination)
	}
}
