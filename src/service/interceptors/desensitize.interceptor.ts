import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class DesensitizeInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data) => {
				if (typeof data === 'object') {
					// 对响应体中的数据进行脱敏，假设响应体是对象
					data.list = data.list.map((item) => {
						return {
							...item,
							phone: this.desensitizeString(item.phone)
						}
					})
				}
				return data
			})
		)
	}

	private desensitizeString(value: string): string {
		if (value && value.length >= 11) {
			// 保留前三位和后四位，中间用星号替换
			return value.substring(0, 3) + '****' + value.substring(value.length - 4)
		}
		return value
	}
}
