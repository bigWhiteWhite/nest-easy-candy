import { PassportStrategy } from '@nestjs/passport'
import { IStrategyOptions, Strategy } from 'passport-local'
import { compareSync } from 'bcryptjs'
import { ReturnModelType } from '@typegoose/typegoose'
import { User } from '@app/db/modules/system/sys-user.model'
import { InjectModel } from 'nestjs-typegoose'
import { ApiException } from 'src/service/exceptions/api.exception'

export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	// 本地策略,local为策略名,在auth.model引入以后，然后在控制器里面指明使用local策略就可以了
	constructor(
		@InjectModel(User) private userModel: ReturnModelType<typeof User>
	) {
		super({
			usernameField: 'account',
			passwordField: 'password'
		} as IStrategyOptions)
	}
	/**
	 * @description 在 node.js 世界中，将授权用户附加到 request 对象是一种常见的做法。
	 */
	async validate(account: string, password: string) {
		// .select('+password') // 指明要返回password字段
		const user = await this.userModel.findOne({ account }).select('+password')
		if (!user) {
			throw new ApiException(10017)
		}
		if (!compareSync(password, user.password)) {
			throw new ApiException(10003)
			// throw new BadRequestException('密码不正确')
		}
		// 这里返回的参数都会被放到user对象(不可换名)中，然后塞入到ctx.switchToHttp().getRequest()中
		return user
	}
}
