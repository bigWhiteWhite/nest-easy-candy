import { CommonLayoutType, SetOptions, SetRadios, SetCheckboxs, ColRowType, SetVirOptions } from './common'
import type { CSSProperties } from 'vue'
import type { FormContext, FormItemRule, FormItemProps } from 'element-plus'
export interface ItemOptionsType {
	maxLength?: number
	rows?: ColRowType
	style?: CSSProperties
	'addon-before'?: string
	[propName: string]: any //多余属性不报错
}
// Partial可以将所有的属性变成非必填
type OtherFormItemProps = {
	style: CSSProperties
}
export type FormItemOptions = Partial<FormItemProps & OtherFormItemProps>

export type FormMainType = {
	value: string
	label: string
	class?: string
	colClass?: string
	loading?: boolean
	RegExp?: RegExp
	disabled?: boolean
	shortcuts?: any
	prepend?: boolean
	append?: boolean
	dynamicHide?: boolean
	itemOptions?: ItemOptionsType
	formItemOptions?: FormItemOptions
	colProps?: ColRowType
	formItemSlots?: Array<string>
	// [propName: string]: any
} & SetOptions &
	SetVirOptions &
	SetRadios &
	SetCheckboxs

// rules类型
export type RulesType = {
	[propName: string]: Array<FormItemRule>
}
export interface BaseFormType extends CommonLayoutType {
	modelValue?: any
	formProps?: FormContext
	formMain: FormMainType[]
	formItemOptions?: FormItemOptions
	itemOptions?: ItemOptionsType
	rowProps?: ColRowType
	colProps?: ColRowType
	rules?: RulesType
}
