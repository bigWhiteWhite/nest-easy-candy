import type { FormContext } from 'element-plus'

export interface ColRowType {
	type?: 'flex'
	justify?: 'start' | 'end' | 'center' | 'space-around ' | 'space-between'
	align?: 'top' | 'middle' | 'bottom'
	span?: number | string
	xxl?: number | string
	xxxl?: number | string
	xl?: number | string
	lg?: number | string
	md?: number | string
	sm?: number | string
	xs?: number | string
	style?: any
}
export interface Layout {
	content?: ColRowType
	layoutRow?: ColRowType
	style?: any
}
export interface CommonLayoutType {
	layout?: Layout
	footerLayout?: ColRowType
	formProps?: FormContext
	commonStyle?: any
}
// formMain类型
type ComponentType =
	| 'input'
	| 'select'
	| 'inputNum'
	| 'inputNumber'
	| 'cascader'
	| 'virtually-select'
	| 'slot'
	| 'timePicker'
	| 'rangePicker'
	| 'datePicker'
	| 'radio'
	| 'checkbox'
	| 'textarea'
	| 'password'
	| 'compact' // 组合框

export type OptionsType = {
	label?: string
	title?: string
	value: number | string | boolean
	children?: OptionsType[]
}
// 当类型为select时，options为必填
type SelectItem = {
	type?: Extract<ComponentType, 'select'>
	options: OptionsType[]
}
type NonSelectItem = {
	type?: Exclude<ComponentType, 'select'>
	options?: OptionsType[]
}
// 当类型为virtually-select时，options为必填
type VirSelectItem = {
	type?: Extract<ComponentType, 'virtually-select'>
	options: OptionsType[]
}
type NonVirSelectItem = {
	type?: Exclude<ComponentType, 'virtually-select'>
	options?: OptionsType[]
}
// 当类型为radio时，radios为必填
type RadioItem = {
	type?: Extract<ComponentType, 'radio'>
	radios: OptionsType[]
}
type NonRadioItem = {
	type?: Exclude<ComponentType, 'radio'>
	radios?: OptionsType[]
}
// 当类型为radio时，radios为必填
type CheckboxsItem = {
	type?: Extract<ComponentType, 'checkbox'>
	checkboxs: OptionsType[]
}
type NonCheckboxsItem = {
	type?: Exclude<ComponentType, 'checkbox'>
	checkboxs?: OptionsType[]
}

export type SetOptions = SelectItem | NonSelectItem
export type SetVirOptions = VirSelectItem | NonVirSelectItem
export type SetRadios = RadioItem | NonRadioItem
export type SetCheckboxs = CheckboxsItem | NonCheckboxsItem
