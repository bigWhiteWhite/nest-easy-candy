import { FormMainType } from './base-form'
export interface FormListType {
	confirmText?: string
	cancelText?: string
	prevText?: string
	nextText?: string
	step: number
	name: string
	initForm: {
		formMain: Array<FormMainType>
		[propName: string]: any
	}
}
export interface EchoFormListType {
	name: string
	initForm: any
}

export interface BaseDialogType {
	dialogOptions: {
		width: string
	}
	formList: FormListType[]
	echoFormList?: Array<EchoFormListType>
}
