import { CommonLayoutType } from './common'
import type { Column, PaginationProps } from 'element-plus'
export interface ColumnsType {
	prop: string
	label: string
	formatter?: (row: any, value: any) => string | number
	columnOptions?: Column
}

export interface CurrentSize {
	current: number
	pageSize: number
	pageSizes?: string[] | number[]
}

export type PaginationOptions = PaginationProps

export interface BaseTableType extends CommonLayoutType {
	tableOptions?: any
	propList: ColumnsType[]
	currentSize?: CurrentSize
	paginationOptions?: PaginationOptions
}
