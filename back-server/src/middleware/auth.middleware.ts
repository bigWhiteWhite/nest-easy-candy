import { Injectable, NestMiddleware } from '@nestjs/common'
import { ResOp } from '../common/class/res.class'
import { ErrorCodeMap } from '@/service/contants/error-code.contants'
/**
 * @description 判断请求头有无带有authorization,无则拦截
 * @description 如果不需要就去app.module中间件中配置路由
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
	use(req: any, res: any, next: () => void) {
		if (!req.headers.authorization) {
			return res.send(new ResOp(11001, '', ErrorCodeMap[11001]))
		}
		next()
	}
}
