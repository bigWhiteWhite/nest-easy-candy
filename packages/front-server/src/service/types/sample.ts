export interface Sample {
	id: string
	name: string
}

export interface DataType<T> {
	// 接口返回值类型
	code: number
	data: T
}
