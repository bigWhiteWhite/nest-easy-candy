import { nextTick } from 'vue'
import loadingCss from '@/theme/sass/special/loading.scss'

/**
 * 页面全局 Loading,加载动画
 * @method setCss 载入 css
 * @method start 创建 loading
 * @method done 移除 loading
 */
export const NextLoading = {
	// 载入 css
	setCss: () => {
		const link = document.createElement('link')
		link.rel = 'stylesheet'
		link.href = loadingCss
		link.crossOrigin = 'anonymous'
		document.getElementsByTagName('head')[0].appendChild(link)
	},
	// 创建 loading
	start: () => {
		const bodys: Element = document.body
		const div = document.createElement('div')
		div.setAttribute('class', 'loading-next')
		const htmls = `
		<div class="sk-folding-box">
			<div class="sk-folding-cube">
				<div class="sk-cube1 sk-cube"></div>
				<div class="sk-cube2 sk-cube"></div>
				<div class="sk-cube4 sk-cube"></div>
				<div class="sk-cube3 sk-cube"></div>
			</div>
		<div>
		`
		div.innerHTML = htmls
		bodys.insertBefore(div, bodys.childNodes[0])
		;(<any>window).nextLoading = true
	},
	// 移除 loading
	done: () => {
		nextTick(() => {
			setTimeout(() => {
				;(<any>window).nextLoading = false
				const el = document.querySelector('.loading-next')
				if (el && el.parentNode) {
					el.parentNode.removeChild(el)
				}
			}, 1000)
		})
	}
}
