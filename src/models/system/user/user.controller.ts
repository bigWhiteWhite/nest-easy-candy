import {
	Body,
	Controller,
	Get,
	Post,
	Delete,
	Patch,
	UseGuards,
	Query,
	UseInterceptors,
	Param,
	Req,
	Headers
} from '@nestjs/common'
import { Request } from 'express'
import { UserService } from './user.service'
import {
	ApiBody,
	ApiOperation,
	ApiTags,
	ApiBearerAuth,
	ApiSecurity,
	ApiOkResponse
} from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { User } from '@app/db/modules/system/sys-user.model'
import {
	DeleteAuthDto,
	EditAuthDto,
	ImageCaptchaDto,
	RegisterAuthDto,
	LoginUserDto,
	UpdatePasswordDto
} from './dto/user.dto'
import { ImageCaptcha } from './user.class'
import { QueryUser, UserSysInfo } from './dto/user-query.dto'
import { AdminUser } from '../system.interface'
import { ADMIN_PREFIX } from '@/admin.constant'
import { PageDto } from '@/common/dto/page.dto'
import { Authorize } from '@/service/decorators/authorize.decorator'
import { UserInfo } from '@/service/decorators/user-uid.decorator'
import { DesensitizeInterceptor } from '@/service/interceptors/desensitize.interceptor'
import { UtilService } from '@/shared/tools/util.service'
@ApiSecurity(ADMIN_PREFIX)
@Controller('admin/user')
@ApiTags('登录注册')
export class AuthController {
	constructor(
		private userService: UserService,
		private utilService: UtilService
	) {}

	@Post('generate')
	@ApiOperation({ summary: '批量生产假用户' })
	@Authorize()
	async generate(@Query() query) {
		const { fakeNum = 10 } = query
		return this.userService.generate(fakeNum)
	}

	@Post('register')
	@ApiBody({ required: true, type: User })
	@ApiOperation({ summary: '注册' })
	@Authorize()
	async register(@Body() dto: RegisterAuthDto) {
		return this.userService.register(dto)
	}

	@Post('list')
	@UseInterceptors(DesensitizeInterceptor)
	@ApiOperation({ summary: '获取所有用户' })
	findAll(@Body() body: PageDto & QueryUser) {
		const { pagination, ..._ } = body
		return this.userService.listUser(pagination, _)
	}

	@Patch(':id')
	@ApiOperation({ summary: '更新用户信息' })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	async edit(@Body() dto: EditAuthDto, @Param('id') id: string): Promise<void> {
		return this.userService.edit(dto, id)
	}

	@Post('deleteMany')
	@ApiOperation({ summary: '批量删除用户' })
	@ApiBearerAuth()
	async deleteMany(@Body() dto: DeleteAuthDto): Promise<void> {
		await this.userService.deleteMany(dto)
	}

	@Delete(':id')
	@ApiOperation({ summary: '删除用户' })
	@ApiBearerAuth()
	async delete(@Param('id') id: string): Promise<void> {
		await this.userService.delete(id)
	}

	// https://www.programcreek.com/typescript/?api=@nestjs/swagger.ApiBody
	@Post('login')
	@ApiOperation({ summary: '登陆' })
	@ApiBody({
		required: true,
		type: User
	})
	@Authorize() // 无需认证token
	@UseGuards(AuthGuard('local')) // nest守卫使用passport，passport指定使用说明策略
	// @UserInfo() 从请求参数中获取user
	async login(
		@UserInfo() user: AdminUser,
		@Body() body: LoginUserDto,
		@Req() req: Request,
		@Headers('user-agent') ua: string
	) {
		// await this.userService.checkImgCaptcha(body.validId, body.validCode)
		// user是一个参数,要先经过local策略（返回了user对象），然后再经过CurrentUser（得到user对象）
		const ip = this.utilService.getReqIP(req)
		return this.userService.login(user, ip, ua)
	}

	@Post('logout')
	async logout(@UserInfo() user: AdminUser) {
		return this.userService.logout(user._id)
	}

	@Get('info')
	@ApiOperation({ summary: '获取登录个人信息' })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	async info(@UserInfo() user: AdminUser): Promise<any> {
		return await this.userService.info(user._id)
	}

	@Get('infoId/:id')
	@ApiOperation({ summary: '根据用户id获取个人信息' })
	async infoId(@Param('id') id: string): Promise<UserSysInfo> {
		return await this.userService.info(id)
	}

	@Post('password')
	@ApiOperation({
		summary: '更改密码'
	})
	async password(
		@UserInfo('_id') _id: string,
		@Body() dto: UpdatePasswordDto
	): Promise<void> {
		return await this.userService.updatePassword(_id, dto)
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
