import { SetMetadata } from '@nestjs/common'
import { AUTHORIZE_KEY_METADATA } from '@/admin.constant'

/**
 * 开放授权Api装饰器，使用该注解则无需校验Token及权限
 * 在auth.guard中判断是否需要token
 */
export const Authorize = () => SetMetadata(AUTHORIZE_KEY_METADATA, true)
