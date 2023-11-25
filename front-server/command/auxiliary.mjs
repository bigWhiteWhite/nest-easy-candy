import chalk from 'chalk'
export class Auxiliary {
	// 统一成功代码定义
	successCode = {
		10000: 'success'
	}
	// 统一错误代码定义
	errorCode = {
		20000: '输入错误',
		20001: '文件名不可以为空',
		20002: '读取模板文件失败: 文件不存在',
		20003: '生成文件目录下已存在同名文件',
		20004: '读取目录失败',
		20005: '请选择模板文件'
	}
	constructor(errorCode) {
		if (errorCode) {
			this.errorCode = errorCode
		}
	}
	getErrorCode() {
		return this.errorCode
	}
	error(code) {
		return chalk.red(this.errorCode[code])
	}
	success(code) {
		return chalk.green(this.errorCode[code])
	}
}
