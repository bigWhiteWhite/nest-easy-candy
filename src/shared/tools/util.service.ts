import { Injectable } from '@nestjs/common'
import { customAlphabet, nanoid } from 'nanoid'
import { Request } from 'express'
import * as CryptoJS from 'crypto-js'
import { PopulateOptions, Types } from 'mongoose'
import { ApiException } from '../../service/exceptions/api.exception'
import { isEqual } from 'lodash'
@Injectable()
export class UtilService {
	/**
	 * @description 获取请求IP
	 * @params oldDate 数据库中保存的数据
	 * @params updateData 更新数据
	 */
	compareData(oldData: any, updateData: any): boolean {
		return isEqual(oldData, updateData)
	}

	/**
	 * @description 生成多嵌套的Menus填充
	 */
	generatePopulateConfig(path: string, depth: number, params?: Partial<PopulateOptions>): PopulateOptions {
		console.log('🚀 ~ file: util.service.ts:23 ~ UtilService ~ generatePopulateConfig ~ path:', path)
		if (depth > 0) {
			return {
				...params,
				path,
				populate: this.generatePopulateConfig(path, depth - 1, params) as any
			}
		}
	}
	/**
	 * 获取请求IP
	 */
	getReqIP(req: Request): string {
		return (
			// 判断是否有反向代理 IP
			(
				(req.headers['x-forwarded-for'] as string) ||
				// 判断后端的 socket 的 IP
				req.socket.remoteAddress
			).replace('::ffff:', '')
		)
	}

	/**
	 * AES加密
	 */
	public aesEncrypt(msg: string, secret: string): string {
		return CryptoJS.AES.encrypt(msg, secret).toString()
	}

	/**
	 * @description 将字符串转换成ObjectId
	 * @param {string} id
	 * @returns {Types.ObjectId}
	 * @memberof AdminService
	 */
	public toObjectId(id: string | Types.ObjectId): Types.ObjectId {
		try {
			if (id instanceof Types.ObjectId) return id as Types.ObjectId
			return new Types.ObjectId(id as string)
		} catch (e) {
			throw new ApiException(10004)
		}
	}

	/**
	 * AES解密
	 */
	public aesDecrypt(encrypted: string, secret: string): string {
		return CryptoJS.AES.decrypt(encrypted, secret).toString(CryptoJS.enc.Utf8)
	}

	/**
	 * md5加密
	 */
	public md5(msg: string): string {
		return CryptoJS.MD5(msg).toString()
	}

	/**
	 * 生成一个UUID
	 */
	public generateUUID(): string {
		return nanoid()
	}

	/**
	 * 生成一个随机的值
	 */
	public generateRandomValue(length: number, placeholder = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'): string {
		const customNanoid = customAlphabet(placeholder, length)
		return customNanoid()
	}
}
