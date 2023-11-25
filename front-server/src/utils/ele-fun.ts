import type { FormMainType, FormListType, EchoFormListType, OptionsType } from '@/types/ElementPlus'
// import dayjs from 'dayjs'
/**
 * @param 表单数组，所有要改动的表单项，添加进来的属性名
 * @param 更改表单中的表单项
 * @default 默认是添加输入规则
 * @returns 表单项包含新的属性的数组
 */
export const filterData = (_: FormMainType[], keyFun: any, name: string = 'inputRule') => {
	_.forEach((item) => {
		for (const obj of keyFun) {
			if (obj[item.value]) {
				item[name] = obj[item.value]
			}
		}
	})
	return _
}
/**
 * @param 表单数组，第几步的表单项，所有要改动的表单项，添加进来的属性名
 * @param 给弹出框中的表单项初始化，更新表单项
 */
export const listFilterData = (_: FormListType[], step: number, keyFun: any, name: string = 'inputRule') => {
	const form: FormListType | undefined = _.find((item): boolean => {
		return item.step === step
	})
	if (form?.initForm) {
		const formMain = filterData(form.initForm.formMain, keyFun, name)
		const initForm = { ...form.initForm, formMain }
		const formList = _.map((item) => {
			return item.step === step ? { ...item, initForm } : { ...item }
		})
		return formList
	}
	return _
}

/**
 * @param 初始化表单数据
 */
export const initData = (initArray: FormMainType[], initObj = {}) => {
	// 做数据回显,初始化表单数据
	const data = {}
	initArray.forEach((item) => {
		if (initObj[item.value] !== undefined && initObj[item.value] !== null) {
			data[item.value] = initObj[item.value]
		} else if (item.type === 'checkbox') {
			data[item.value] = [] // 这里很重要，多选框需要一个数组作为初始值，不然会爆length为undefined的错误
		} else if (item.type === 'inputNumber') {
			data[item.value] = 0
		} else {
			data[item.value] = ''
		}
	})
	return data
}

/**
 * @param 初始化多个表单数据
 */
export const initListData = (formList: FormListType[], echoFormList: Array<EchoFormListType> = []) => {
	const data = {}
	formList.forEach((item) => {
		if (item.initForm) {
			// 判断有无表单配置对象
			if (echoFormList.length !== 0) {
				echoFormList.forEach((initItem) => {
					if (item.name === initItem.name) {
						data[item.name] = initData(item.initForm.formMain, initItem.initForm)
					} else if (!item[initItem.name] && initItem[item.name]) {
						// formList不存在这个step，echoFormList存在
						data[initItem.name] = {}
					} else if (!initItem[item.name] && item[initItem.name]) {
						// formList存在这个step，echoFormList不存在
						data[item.name] = initData(item.initForm.formMain)
					}
				})
			} else {
				// 即使没有初始化数组也不至于报错
				// data[item.name] = {}
				data[item.name] = initData(item.initForm.formMain)
			}
		}
	})
	return data
}
/**
 * @param 初始化表单中的选择框
 */
export const initFormOptions = (formMain: FormMainType[], optionsList: OptionsType[]) => {
	const _ = Object.keys(optionsList)
	formMain.forEach((item) => {
		_.forEach((key) => {
			if (item.value === key && item.type === 'select') {
				item.options = optionsList[key]
			}
		})
	})
	return formMain
}

// 更新初始化，保留之前的初始化数据，也可以增加修改
export const initEchoFormList = (echoFormList: Array<EchoFormListType>, newEchoFormList: Array<EchoFormListType>) => {
	echoFormList.forEach((item) => {
		newEchoFormList.forEach((key) => {
			if (item.name === key.name) {
				item.initForm = { ...item.initForm, ...key.initForm }
			}
		})
	})
	return echoFormList
}
