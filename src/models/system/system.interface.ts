import { Types } from 'mongoose'

export interface AdminUser {
	_id: string
	pv: number
	username: string
	phone: number
	status: number
	iat: number
	exp: number
	roles: Array<Types.ObjectId>
}
