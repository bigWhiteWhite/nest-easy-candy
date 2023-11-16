import { Injectable, NestMiddleware } from '@nestjs/common'

@Injectable()
export class InitMiddleware implements NestMiddleware {
	use(req: any, res: any, next: () => void) {
		console.log('中间件')
		next()
	}
}
