import { SetMetadata } from '@nestjs/common'
import { TRANSFORM_KEEP_KEY_METADATA } from 'src/admin.constant'

/**
 * 不转化成JSON结构，保留原有返回
 */
export const Keep = () => SetMetadata(TRANSFORM_KEEP_KEY_METADATA, true)
