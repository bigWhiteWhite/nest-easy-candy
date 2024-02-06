import { UtilService } from '@/shared/tools/util.service'
import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'

@Controller('user')
@ApiTags('登录注册')
export class AuthController {
	constructor(private userService: UserService, private utilService: UtilService) {}
}
