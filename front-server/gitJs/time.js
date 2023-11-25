const formatTime = (date, fmt) => {
	if (!date) {
		return ''
	}
	if (typeof date === 'string' || (typeof date === 'object' && date.constructor === Date)) {
		if (typeof date === 'string') {
			date = date.replace(/-/g, '/')
			const index = date.indexOf(',')
			if (index > -1) {
				date = date.substring(0, index)
			}
			date = new Date(date)
			if (date.toString() === 'Invalid Date') {
				return date
			}
		}
		const o = {
			'M+': Number(date.getMonth()) + 1, // 月份
			'D+': date.getDate(), // 日
			'd+': date.getDate(), // 日
			'h+': date.getHours(), // 小时
			'H+': date.getHours(), // 小时
			'm+': date.getMinutes(), // 分
			's+': date.getSeconds(), // 秒
			'q+': Math.floor((Number(date.getMonth()) + 3) / 3), // 季度
			S: date.getMilliseconds() // 毫秒
		}
		const matRet = fmt.match(/((y+)|(Y+))/)
		if (matRet) {
			const [, $1, $2] = matRet
			fmt = fmt.replace($1, (date.getFullYear() + '').substring(4 - $1.length, (date.getFullYear() + '').length))
		}
		for (const k in o) {
			const ret = fmt.match(new RegExp('(' + k + ')'))
			if (ret) {
				const [, $1] = ret
				fmt = fmt.replace($1, $1.length === 1 ? o[k] : ('00' + o[k]).substring(('' + o[k]).length, ('00' + o[k]).length))
			}
		}
		return fmt
	} else {
		return date
	}
}

exports.formatTime = formatTime
