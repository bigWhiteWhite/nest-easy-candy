import { Controller, Get, Param } from '@nestjs/common'
import { OnlineService } from './online.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AdminUser } from '../system.interface'
import { UserInfo } from 'src/service/decorators/user-uid.decorator'
import { ApiException } from 'src/service/exceptions/api.exception'

@Controller('admin/online')
@ApiTags('在线用户模块')
export class OnlineController {
	constructor(private readonly onlineService: OnlineService) {}

	@ApiOperation({ summary: '查询当前在线用户' })
	@Get('list')
	list() {
		return this.onlineService.listOnlineUser()
	}

	@ApiOperation({ summary: '下线指定在线用户' })
	@Get('kick/:id')
	kick(@Param('id') id: string, @UserInfo() user: AdminUser) {
		if (id === user._id) {
			throw new ApiException(10012)
		}
		return this.onlineService.kick(user, id)
	}
}
