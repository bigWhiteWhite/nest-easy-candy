/* eslint-disable no-irregular-whitespace */
/**

 *每个事件添加都要new一个对应的实例去使用，不可多个事件中使用同一个rdt实例

 * const rdt = new Reduction();

 * 写法一 rdt.debounce(1000,(data)=>{},data);

 * 写法二 rdt.debounce(1000).then(()=>{});

*/

// 节流
export const throttle = (fn: { apply: (arg0: any, arg1: any[]) => void }, t: number) => {
	let flag = true
	const interval = t || 500
	return function (this: any, ...args: any) {
		if (flag) {
			fn.apply(this, args)
			flag = false
			setTimeout(() => {
				flag = true
			}, interval)
		}
	}
}

// 防抖
export const debounce = (fn: { apply: (arg0: any, arg1: any) => void }, t: number) => {
	let timeId: any = null
	const delay = t || 500
	return function (this: any, ...args: any) {
		if (timeId) {
			clearTimeout(timeId)
		}
		timeId = setTimeout(() => {
			timeId = null
			fn.apply(this, args)
		}, delay)
	}
}
