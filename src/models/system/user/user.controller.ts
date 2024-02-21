import { UtilService } from '@/shared/tools/util.service'
import { Body, Controller, Post, Req, UseGuards, Headers, Get, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { Request } from 'express'
import { Authorize } from '@/service/decorators/authorize.decorator'
import { CreateUserDto } from './dto/user.dto'
import { AuthGuard } from '@nestjs/passport'
import { UserInfo } from '@/service/decorators/user-uid.decorator'
import { AdminUser } from '../system.interface'
import { ImageCaptchaDto } from './dto'
import { ImageCaptcha } from './user.class'

@Controller('user')
@ApiTags('登录注册')
export class AuthController {
	constructor(private userService: UserService, private utilService: UtilService) {}

	@Post('register')
	@ApiOperation({ summary: '注册' })
	@Authorize()
	async register(@Body() dto: CreateUserDto) {
		return this.userService.register(dto)
	}

	@Post('login')
	@ApiOperation({ summary: '登陆' })
	@Authorize() // 无需认证token
	@UseGuards(AuthGuard('local')) // nest守卫使用passport，passport指定使用说明策略
	async login(@UserInfo() user: AdminUser, @Body() body: CreateUserDto, @Req() req: Request, @Headers('user-agent') ua: string) {
		await this.userService.checkImgCaptcha(body.validId, body.validCode)
		// user是一个参数,要先经过local策略（返回了user对象），然后再经过CurrentUser（得到user对象）
		const ip = this.utilService.getReqIP(req)
		return this.userService.login(user, ip, ua)
	}

	@Get('captcha')
	@ApiOkResponse({ type: ImageCaptcha })
	@ApiOperation({ summary: '获取验证码' })
	@Authorize()
	// @Keep() // 不需要进过api验证管道
	async getCaptchaCode(@Query() dto: ImageCaptchaDto): Promise<ImageCaptcha> {
		return await this.userService.createImageCaptcha(dto)
	}
}
