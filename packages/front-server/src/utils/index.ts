import { sampleSize } from 'lodash'

/**
 * @description: 获取任意长度的随机数字字母组合字符串
 * @param {*} len 随机字符串的长度
 */
export const randomString = (len = 30) => {
	const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_'
	return sampleSize(charSet, len).toString().replace(/,/g, '') as string
}

/**
 * 转换枚举类型的名字
 * @param {String} arrs 枚举数组类型
 * @param {any} v 当前值
 * @param {any} isReal 查找不到是否返回为当前值，false返回unknow/true返回原值
 */
export const labelType = (arrs: any[], v: number, isReal?: boolean) => {
	if (!v && v !== 0) return v
	const index = arrs.findIndex((item) => {
		return item.value.toString() === v.toString()
	})
	if (index === -1) {
		if (isReal) return v
		return v + ':unknow'
	} else {
		return arrs[index].label || arrs[index].name
	}
}

export const downloadMain = (file: any, name = '', type = 'excel') => {
	if (!file) return
	const fileMap = {
		//这里需要根据不同的文件格式写不同的参数
		word: 'application/msword;charset=utf-8',
		excel: 'application/vnd.ms-excel;charset=utf-8',
		// 需要在axios中指明 responseType: "arraybuffer"
		excelBuffer: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
		zip: 'application/zip'
	}
	const blob = new Blob([file], {
		type: fileMap[type]
	})
	// 创建a标签
	const a = document.createElement('a')
	// 创建下载的链接
	a.style.display = 'none'
	a.href = window.URL.createObjectURL(blob)
	// 下载后文件名
	const fileName = name || 'file'
	a.download = fileName

	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
	window.URL.revokeObjectURL(a.href) // 释放掉blob对象
}
