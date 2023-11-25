import type { CSSProperties } from 'vue'
import type { CardProps } from 'element-plus'
export interface CardList {
	value: string
	name: string
	cardOptions?: {
		style?: CSSProperties
	} & CardProps
}
interface DecList {
	title: string
	value: string
	name: string
}
export type Collapses = {
	title: string
	value: string
	name: string
	collapseType: 'description' | 'table'
	panelOptions?: {
		name: string | number
		title: string
		disabled: boolean
	}
	desOptions?: {
		title: string
		border?: boolean
		column?: number
		direction?: 'vertical' | 'horizontal'
		size?: 'large' | 'default' | 'small'
		extra?: string
	}
	decList: DecList[]
}
