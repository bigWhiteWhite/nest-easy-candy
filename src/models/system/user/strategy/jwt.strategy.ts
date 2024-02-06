import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import Configuration from '@/config'
import SysUser from '@/entities/server/sys-user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(@InjectRepository(SysUser) private userRepository: Repository<SysUser>) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从请求头中取出token
			secretOrKey: Configuration()?.jwt.secret // 环境变量中的SECRET解析token
		} as StrategyOptions)
	}

	async validate(user) {
		// 从数据库查找解析出来的用户id
		return await this.userRepository.findOne({ where: { id: user.id } })
	}
}
