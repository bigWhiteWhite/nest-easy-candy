/**
 * @description 用于入参校验
 */
import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common'
import { ValidationError, validate } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { LoggerService } from '@/shared/logger/logger.service'

@Injectable()
export class ValidationPipe implements PipeTransform {
	constructor(private logger: LoggerService) {}
	findConstraints(validationError: ValidationError): string | undefined {
		if (validationError.constraints) {
			// 如果当前 validationError 包含 constraints，返回它
			return Object.values(validationError.constraints)[0]
		} else if (validationError.children && validationError.children.length > 0) {
			// 如果有子级 validationError，则递归查找子级
			for (const child of validationError.children) {
				const childConstraints = this.findConstraints(child)
				if (childConstraints) {
					return childConstraints
				}
			}
		}
		// 未找到 constraints
		return undefined
	}

	async transform(value: any, { metatype }: ArgumentMetadata) {
		if (!metatype || !this.toValidate(metatype)) {
			// 如果没有传入验证规则，则不验证，直接返回数据
			return value
		}
		// 将对象转换为 Class 来验证
		const object = plainToClass(metatype, value)
		const errors = await validate(object)
		if (errors.length > 0) {
			// const msg = Object.values(errors[0].constraints)[0] 只需要取第一个错误信息并返回即可
			const msg = this.findConstraints(errors[0]) // 只需要取第一个错误信息并返回即可
			this.logger.error(`Validation failed: ${msg}`)
			throw new BadRequestException(`Validation failed: ${msg}`)
		}
		return value
	}

	private toValidate(metatype: any): boolean {
		const types: any[] = [String, Boolean, Number, Array, Object]
		return !types.includes(metatype)
	}
}
