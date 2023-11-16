import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { User } from '@app/db/modules/system/sys-user.model'
import configuration from 'config'
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		@InjectModel(User) private userModel: ReturnModelType<typeof User>
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从请求头中取出token
			secretOrKey: configuration()?.jwt.secret // 环境变量中的SECRET解析token
		} as StrategyOptions)
	}

	async validate(user) {
		// 从数据库查找解析出来的用户id
		return await this.userModel.findById(user._id)
	}
}
