import { ApiProperty } from '@nestjs/swagger'

export class ImageCaptcha {
	@ApiProperty({
		description: 'base64格式的svg图片'
	})
	validCode: string

	@ApiProperty({
		description: '验证码对应的唯一ID'
	})
	validId: string
}
