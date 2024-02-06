import { Injectable } from '@nestjs/common'
import { UAParser } from 'ua-parser-js'
import { LoginInfo } from './class/log.class'
import { AdminUser } from '../system.interface'
import { PageList } from '@/common/class/res.class'
import { InjectRepository } from '@nestjs/typeorm'
import SysLoginLog from '@/entities/server/sys-login-log.entity'
import SysUser from '@/entities/server/sys-user.entity'
import { In, Repository } from 'typeorm'

@Injectable()
export class LogService {
	constructor(
		@InjectRepository(SysLoginLog) private loginLogModel: Repository<SysLoginLog>,
		@InjectRepository(SysUser) private userModel: Repository<SysUser>
	) {}

	/**
	 * 记录登录日志
	 */
	async saveLoginLog(user: AdminUser, ip: string, ua: string): Promise<void> {
		await this.loginLogModel.save({
			userId: user.id,
			ip,
			ua
		})
	}

	/**
	 * 计算登录日志日志总数
	 */
	async countLoginLog(): Promise<number> {
		const userIds = await this.userModel.createQueryBuilder('user').select(['user.id']).getMany()
		return await this.loginLogModel.count({
			where: { userId: In(userIds.map((n) => n.id)) }
		})
	}

	/**
	 * 分页加载登录日志信息
	 */
	async listLoginLog(pagination): Promise<PageList<LoginInfo>> {
		const { current = 1, pageSize = 10 } = pagination
		const loginLogList = await this.loginLogModel
			.createQueryBuilder('login_log')
			.innerJoinAndSelect('sys_user', 'user', 'login_log.user_id = user.id')
			.orderBy('login_log.created_at', 'DESC')
			.offset(current * pageSize)
			.limit(pageSize)
			.getRawMany()
		const parser = new UAParser()
		return {
			list: loginLogList.map((log) => {
				const u = parser.setUA(log.ua).getResult()
				return {
					id: log._id,
					username: log.username,
					ip: log.ip,
					os: `${u.os.name} ${u.os.version}`,
					browser: `${u.browser.name} ${u.browser.version}`,
					time: log.login_log_created_at
				}
			}),
			pagination: {
				pageSize: pageSize,
				current: current,
				total: await this.countLoginLog()
			}
		}
	}

	/**
	 * 清空表中的所有数据
	 */
	async clearLoginLog(): Promise<void> {
		await this.loginLogModel.clear()
	}
}
