import { LoginLog } from '@app/db/modules/system/sys-login-log.model'
import { User } from '@app/db/modules/system/sys-user.model'
import { Injectable } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { UAParser } from 'ua-parser-js'
import { LoginInfo } from './class/log.class'
import { AdminUser } from '../system.interface'
import { PageList } from '@/common/dto/page.dto'

@Injectable()
export class LogService {
	constructor(
		@InjectModel(LoginLog)
		private readonly loginLogModel: ReturnModelType<typeof LoginLog>,
		@InjectModel(User)
		private readonly userModel: ReturnModelType<typeof User>
	) {}

	/**
	 * 记录登录日志
	 */
	async saveLoginLog(user: AdminUser, ip: string, ua: string): Promise<void> {
		await this.loginLogModel.create({
			userId: user._id,
			username: user.username,
			phone: user.phone,
			ip,
			ua
		})
	}

	/**
	 * 计算登录日志日志总数
	 */
	async countLoginLog(): Promise<number> {
		const userIds = await this.userModel.distinct('_id')
		return await this.loginLogModel.count({
			userId: { $in: userIds }
		})
	}

	/**
	 * 分页加载登录日志信息
	 */
	async listLoginLog(pagination): Promise<PageList<LoginInfo>> {
		const { current = 1, pageSize = 10 } = pagination
		const loginLogList = await this.loginLogModel
			.find(
				{},
				{
					sort: { updatedAt: -1 },
					limit: pageSize,
					skip: (current - 1) * pageSize
				}
			)
			.lean()
		const count = await this.loginLogModel.countDocuments()
		const parser = new UAParser()
		return {
			list: loginLogList.map((log) => {
				const u = parser.setUA(log.ua).getResult()
				return {
					id: log._id,
					userId: log.userId,
					username: log.username,
					phone: log.phone,
					ip: log.ip,
					os: `${u.os.name} ${u.os.version}`,
					browser: `${u.browser.name} ${u.browser.version}`
				}
			}),
			pagination: {
				pageSize: pageSize,
				current: current,
				total: count
			}
		}
	}

	/**
	 * 清空表中的所有数据
	 */
	async clearLoginLog(): Promise<void> {
		await this.loginLogModel.remove()
	}

	/**
	 * 根据用户id列表查找最近登录信息和用户信息
	 */
	async findLastLoginInfoList(onlineIds: string[]): Promise<LoginInfo[]> {
		const result = await this.loginLogModel.find({
			userId: { $in: onlineIds }
		})
		if (result) {
			return result.map((e) => {
				const u = new UAParser().setUA(e.ua).getResult()
				return {
					id: e._id,
					userId: e.userId,
					username: e.username,
					phone: e.phone,
					ip: e.ip,
					os: `${u.os.name} ${u.os.version}`,
					browser: `${u.browser.name} ${u.browser.version}`
				}
			})
		}
		return []
	}
}
