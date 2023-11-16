export class ResOp {
	readonly data: any
	readonly statusCode: string | number
	readonly message: string

	constructor(statusCode: string | number, data?: any, message = 'success') {
		this.statusCode = statusCode
		this.data = data
		this.message = message
	}

	static success(data?: any) {
		return new ResOp(200, data || '')
	}
}

export class Pagination {
	total: number
	pageSize: number
	currentPage: number
}

export class PageResult<T> {
	list?: Array<T>
	pagination: Pagination
}
