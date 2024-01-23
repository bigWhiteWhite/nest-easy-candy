import { Types } from 'mongoose'
export interface LoginInfo {
	id: string | Types.ObjectId
	userId: string
	username: string
	phone: number | string
	ip: string
	os: string
	browser: string
}
