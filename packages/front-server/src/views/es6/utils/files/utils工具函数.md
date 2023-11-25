# window 对象

window[对象常用属性和常用方法](https://www.cnblogs.com/c68ychen/p/13861160.html)

- `window.location.href` 返回当前页面的 href (URL)
- `window.location.host` 返回网络主机的域名,包含端口
- `window.location.hostname` 返回网络主机的域名,不包含端口
- `window.location.pathname` 返回当前页面的路径和文件名
- `window.location.protocol` 返回使用的网络协议（http: 或 https:)
- `window.location.assign()` 加载一个新文档
- `window.open(url)` 打开新的界面

# 正则表达式

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions#special-dollar

https://www.runoob.com/regexp/regexp-syntax.html

极客教程：https://geek-docs.com/regexp/regexp-tutorials/regular-expressions-match-numeric-ranges.html

```js
regExp: {
    // 单数至19
    //[min, max]:/^([min-9]|1[0-`max[1]`]$/
    "数字范围2-18": /^([2-9]|1[0-8]$/
    // 单数至20-99
    //[min, max]:/^([min-9]|[1-`max[0]-1`]\d|`max[0]`[0-`max[1]`])$/
    "数字范围7-31": /^([7-9]|[1-2]\d|3[0-1])$/
    // 单数至100-999
	//[min, max]:/^([min-9]|[1-9]\d|[0-`max[0]`][0-`max[1]`][0-max[2]]])$/
    "数字范围6-101": /^([6-9]|[1-9]\d|10[0-1])$/
	"数字范围6-131": /^([6-9]|[1-9]\d|1[0-3][0-1])$/
	"数字范围6-536": /^([6-9]|[1-9]\d|[0-5][0-3][0-6])$/,
    "小数后面只能保留6位": /^[0-9]+(.[0-9]{1,6})?$/

 	"是否为数字":/^[0-9]+.?[0-9]*$/, // 不准
    "非负整数": /^\\d+$/, // 包括0
    "正整数": /^[0-9]*[1-9][0-9]*$/,
    "非正整数": /^((-\\d+)|(0+))$/,
    "负整数": /^-[0-9]*[1-9][0-9]*$/,
    "整数": /^-?\\d+$/,
    "浮点数": /^(-?d )(.d )?$/,
    "正浮点数": /^(([0-9] .[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*.[0-9] )|([0-9]*[1-9][0-9]*))$/,
    "复浮点数": /^(-(([0-9] .[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*.[0-9] )|([0-9]*[1-9][0-9]*)))$/,
}

```

```js
正数：/^\d+(\.\d+)?$/ // 包括正数浮点数
数字：/^[0-9]*$/
n位的数字：^\d{n}$
至少n位的数字：^\d{n,}$
m-n位的数字：^\d{m,n}$
零和非零开头的数字：^(0|[1-9][0-9]*)$
非零开头的最多带两位小数的数字：^([1-9][0-9]*)+(\.[0-9]{1,2})?$
带1-2位小数的正数或负数：^(\-)?\d+(\.\d{1,2})$
正数、负数、和小数：^(\-|\+)?\d+(\.\d+)?$
有两位小数的正实数：^[0-9]+(\.[0-9]{2})?$
有1~3位小数的正实数：^[0-9]+(\.[0-9]{1,3})?$
非零的正整数：^[1-9]\d*$ 或 ^([1-9][0-9]*){1,3}$ 或 ^\+?[1-9][0-9]*$
非零的负整数：^\-[1-9][]0-9"*$ 或 ^-[1-9]\d*$
非负整数：^\d+$ 或 ^[1-9]\d*|0$
非正整数：^-[1-9]\d*|0$ 或 ^((-\d+)|(0+))$
非负浮点数：^\d+(\.\d+)?$ 或 ^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0$
非正浮点数：^((-\d+(\.\d+)?)|(0+(\.0+)?))$ 或 ^(-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|0?\.0+|0$
正浮点数：^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$ 或 ^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$
负浮点数：^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$ 或 ^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$
浮点数：^(-?\d+)(\.\d+)?$ 或 ^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$

汉字：^[\u4e00-\u9fa5]{0,}$
英文和数字：^[A-Za-z0-9]+$ 或 ^[A-Za-z0-9]{4,40}$
长度为3-20的所有字符：^.{3,20}$
由26个英文字母组成的字符串：^[A-Za-z]+$
由26个大写英文字母组成的字符串：^[A-Z]+$
由26个小写英文字母组成的字符串：^[a-z]+$
由数字和26个英文字母组成的字符串：^[A-Za-z0-9]+$
由数字、26个英文字母或者下划线组成的字符串：^\w+$ 或 ^\w{3,20}$
中文、英文、数字包括下划线：^[\u4E00-\u9FA5A-Za-z0-9_]+$
中文、英文、数字但不包括下划线等符号：^[\u4E00-\u9FA5A-Za-z0-9]+$ 或 ^[\u4E00-\u9FA5A-Za-z0-9]{2,20}$
可以输入含有^%&',;=?$\"等字符：[^%&',;=?$\x22]+
禁止输入含有~的字符：[^~\x22]+

Email地址：^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$
域名：[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?
InternetURL：[a-zA-z]+://[^\s]* 或 ^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$
手机号码：^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$
电话号码("XXX-XXXXXXX"、"XXXX-XXXXXXXX"、"XXX-XXXXXXX"、"XXX-XXXXXXXX"、"XXXXXXX"和"XXXXXXXX)：^(\(\d{3,4}-)|\d{3.4}-)?\d{7,8}$
国内电话号码(0511-4405222、021-87888822)：\d{3}-\d{8}|\d{4}-\d{7}
电话号码正则表达式（支持手机号码，3-4位区号，7-8位直播号码，1－4位分机号）: ((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)
身份证号(15位、18位数字)，最后一位是校验位，可能为数字或字符X：(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)
帐号是否合法(字母开头，允许5-16字节，允许字母数字下划线)：^[a-zA-Z][a-zA-Z0-9_]{4,15}$
密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)：^[a-zA-Z]\w{5,17}$
强密码(必须包含大小写字母和数字的组合，不能使用特殊字符，长度在 8-10 之间)：^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,10}$
强密码(必须包含大小写字母和数字的组合，可以使用特殊字符，长度在8-10之间)：^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$
日期格式：^\d{4}-\d{1,2}-\d{1,2}
一年的12个月(01～09和1～12)：^(0?[1-9]|1[0-2])$
一个月的31天(01～09和1～31)：^((0?[1-9])|((1|2)[0-9])|30|31)$
```

```js
regExp: {
	kong: /\S/, // 非空
	phone: /^1\d{10}$/, // 手机号
    num: /^[0-9]*$/	// 验证数字
	numPlus: /^[1-9]\d*$/, // 正整数的正则表达式(不包括0)
	number: /^[0-9]*$/, // 只能是数字x
	numberd: /^\d+(\.\d+)?$/, // 只能是数字和小数点
	numberdOrAmount: /^\d+(\.\d{2})?$/, // 限制输入数字，且小数点保留两位
	amount: /^([+-]?)((\d{1,3}(,\d{3})*)|(\d+))(\.\d{2})?$/, // 金额 开头只可为正号或者负号,也可以没有符号,小数点前可以输入任意位数的数字,小数点后只能输入两位数字.
	amountPlus: /^((\d{1,3}(,\d{3})*)|(\d+))(\.\d{2})?$/, // 只为正数的金额 ,其他跟amountReg一样
	regAmount: /^(([1-9][0-9]*)|(([0]))|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, // 金额的正则表达式 可为：0
	area: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, // 文本域：10-200个汉字或字母
	isZh: /^[\u4E00-\u9FA5]{2,10}$/, // 姓名
	isZhContract: /^[\u4E00-\u9FA5]{2,4}$/, // 姓名
	contactReg: /^[A-Za-z\u4e00-\u9fa5]+$|[a-z]]/, // 联系人：姓名至少一个汉字或字母
	contractNoReg: /\S/, // 合同编号 匹配由数字和26个英文字母组成的字符串
	nameReg: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, // 名称 至少一个汉字或字母
	busReg: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, // 商家/公司名称 姓名至少一个汉字或字母
	email: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, // 邮箱号码
	jypassword: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,15}$/, // 8-15位交易密码由数字和字母组成
	password: /^[\x21-\x7E]{6,20}$/, // 密码
	phoneEmail: /^[1]{1}[0-9]{10}$|(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, // 匹配手机邮箱
	idCard: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/, // 简单身份证校验
	banknum: /^(\d{16}|\d{17}|\d{18}|\d{19})$/, // 银行卡
	userContact: /^(1\d{10}$|(\w)+(\.\w+)*@(\w)+((\.\w+)+)$|[1-9][0-9]{4,14})$/, // 联系方式 手机／邮箱/QQ
	company: /^[a-zA-Z\u4e00-\u9fa5]+$/, // 判断是否是汉字、字母组成
	addresssSpace: /^(?!(\d+)$)(?!(\s+)$)[\u4e00-\u9fffa-zA-Z\d-_\s]+\s*/, // 可以是汉字、字母、数字、“-”、“_”“.”，但不能为纯数字
	nameSpace: /^[A-Za-z\u4e00-\u9fa5]+\s*/, // 名称 至少一个汉字或字母，允许结尾空格
	emailSpace: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)\s*/, // 邮箱号码，允许结尾空格
	numPlusSpace: /^([1-9]\d*|[0]{1,1})$/, // 正整数的正则表达式(包括0)，允许结尾空格
	companyTell: /^(0[0-9]{2,3}-)?([1-9][0-9]{6,7})+(-[0-9]{1,4})?$/, // 固定电话
	companyPhoneSpace: /^1[3456789]\d{9}\s*/, // 手机号码，允许结尾空格
	qqSpace: /^[1-9]\d{4,9}\s*/, // QQ号码，允许结尾空格
	mobile: /^0?1[3|4|5|6|7|8][0-9]\d{8}$/ // 手机号判断
}
```

```js
regExp: {
	// 验证网址
	isExternal: /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
	// 验证邮箱
	isEmail: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
	// 验证手机
	isPhone: /^[1][3,4,5,6,7,8,9][0-9]{9}$/
	// 验证身份证号
	isIdCard: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
	// 验证固定电话
	isTel: /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
	// 验证IP
	isIP: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
	// 英文
	isEnglish: /^[A-Za-z_]+$/
	// 中文
	isChinese: /[\u4E00-\u9FA5]/g
}
```

**不同国家手机号**

- **^** 匹配输入的开始
- **\d ** 匹配一个数字。等价于[0-9]
- **$** 匹配输入的结束

```js
regExp: {
    // 以6-9的数字开头，后面有9位数字的手机号：6-123456789
	rsrush:	/^[6-9]\d{9}$/,
    // 0开头,第二位只能为789,后面有9位数字的手机号：0-7-123456789
    XCredit:/^0[7|8|9]\d{9}$/,
    // 71开头，后面有8位数字：7-12345678
    Kashway:/^[7|1]\d{8}$/,
    // 10位数字
    iPeso:/\d{10}$/,
    // 3开头，第二，三位
    // +57（10位数字），号段为300-351开头
    ParceCredit:/^3(([0-4][0-9])|(5[0-1]))\d{7}$/
}
```

# 标题国际化

**国际设置**

```ts
//APP.vue
// 监听路由的变化，设置网站标题
import { useTitle } from '/@/utils/setWebTitle'
setup: () => {
	const title = useTitle()
	watch(
		() => route.path,
		() => {
			title()
		}
	)
}
```

```ts
//setWebTitle.ts
import { nextTick } from 'vue'
import router from '/@/router/index'
import { store } from '/@/store/index'
import { i18n } from '/@/i18n/index'

/**
 * 设置浏览器标题国际化
 */
export function useTitle() {
	return () => {
		nextTick(() => {
			let webTitle = ''
			let globalTitle: string = store.state.themeConfig.themeConfig.globalTitle
			router.currentRoute.value.path === '/login'
				? (webTitle = router.currentRoute.value.meta.title as any)
				: (webTitle = i18n.global.t(router.currentRoute.value.meta.title as any))
			document.title = `${webTitle} - ${globalTitle}` || globalTitle
		})
	}
}
```

**普通设置**

```ts
{
    path: '/',
    name:'主界面',
    component: () => import('@views/original.vue'),
    meta: {
      requireAuth: false,
    },
},
// 添加动态title
(<any>window).document.title = to.name
```

# loading

https://www.jianshu.com/p/e3f5953ded60 模仿 element 的加载动画

全局加载动画

```js
import { nextTick } from 'vue'
import loadingCss from '@/theme/sass/special/loading.scss' // 引入样式

/**
 * 页面全局 Loading,加载动画
 * @method setCss 载入 css
 * @method start 创建 loading
 * @method done 移除 loading
 */
export const NextLoading = {
	// 载入 css
	setCss: () => {
		let link = document.createElement('link')
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
```

**结合路由使用**

```js
NProgress.start()  // 进度条
router.beforeEach((to, from, next) => {
    ...
    if ((<any>window).nextLoading === undefined) NextLoading.start() //加载动画
}
// 路由加载后
router.afterEach(() => {
	NProgress.done()
	NextLoading.done()
})
```

# 加载第三方库

```js
/**
 * 批量设置字体图标、动态js
 * @method cssCdn 动态批量设置字体图标
 * @method jsCdn 动态批量设置第三方js
 */
interface cssLinkTpye {
	rel: string;
	href: string;
}
interface jsLinkTpye {
	src: string;
	integrity?: string;
	crossOrigin?: string;
}

const cssCdnUrlList: Array<cssLinkTpye> = [
	{ rel: 'stylesheet', href: '//at.alicdn.com/t/font_2732039_vhtxrftcp9.css' },
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{ rel: 'preconnect', href: 'https://fonts.gstatic.com' }
]

// 第三方 js url
const jsCdnUrlList: Array<jsLinkTpye> = [
	// { src: '//at.alicdn.com/t/font_2732039_vhtxrftcp9.js' }
]

const otherBase = {
	// 动态批量设置字体图标
	setCssCdn: () => {
		if (cssCdnUrlList.length <= 0) return false
		cssCdnUrlList.map((v) => {
			let link = document.createElement('link')
			link.rel = v.rel
			link.href = v.href
			link.crossOrigin = 'crossOrigin'
			//if (v.crossOrigin)  link.crossOrigin=v.crossOrigin;
			document.getElementsByTagName('head')[0].appendChild(link)
		})
	},
	// 第三方 js url
	setJsCdn: () => {
		if (jsCdnUrlList.length <= 0) return false
		jsCdnUrlList.map((v) => {
			let script = document.createElement('script')
			script.src = v.src
			v.integrity ? (script.integrity = v.integrity) : null
			//script.crossOrigin = 'anonymous';
			if (v.crossOrigin) script.crossOrigin = v.crossOrigin
			document.body.appendChild(script)
		})
	}
}

export default otherBase
```

# 删除 script 标签

https://www.jianshu.com/p/9229cbbd4786

```js
/**
 * 删除 script 文件
 * @param src
 */
export const removeScript = (src) => {
	const scripts = document.getElementsByTagName('script')

	for (let i = 0; i < scripts.length; i++) {
		if (scripts[i] && scripts[i].src && scripts[i].src.includes(src)) {
			scripts[i].parentNode.removeChild(scripts[i])
		}
	}
}

/**
 * 删除 link 文件
 * @param href
 */
function removeCss(href) {
	var links = document.getElementsByTagName('link')
	for (var i = 0; i < links.length; i++) {
		var _href = links[i].href
		if (links[i] && links[i].href && links[i].href.indexOf(href) != -1) {
			links[i].parentNode.removeChild(links[i])
		}
	}
}
```

# 缓存

```js
/**
 * window.localStorage 浏览器永久缓存
 * @method set 设置永久缓存
 * @method get 获取永久缓存
 * @method remove 移除永久缓存
 * @method clear 移除全部永久缓存
 */
export const Local = {
	// 设置永久缓存
	set(key: string, val: any) {
		window.localStorage.setItem(key, JSON.stringify(val))
	},
	// 获取永久缓存
	get(key: string) {
		let json: any = window.localStorage.getItem(key)
		return JSON.parse(json)
	},
	// 移除永久缓存
	remove(key: string) {
		window.localStorage.removeItem(key)
	},
	// 移除全部永久缓存
	clear() {
		window.localStorage.clear()
	}
}

/**
 * window.sessionStorage 浏览器临时缓存
 * @method set 设置临时缓存
 * @method get 获取临时缓存
 * @method remove 移除临时缓存
 * @method clear 移除全部临时缓存
 */
export const Session = {
	// 设置临时缓存
	set(key: string, val: any) {
		window.sessionStorage.setItem(key, JSON.stringify(val))
	},
	// 获取临时缓存
	get(key: string) {
		let json: any = window.sessionStorage.getItem(key)
		return JSON.parse(json)
	},
	// 移除临时缓存
	remove(key: string) {
		window.sessionStorage.removeItem(key)
	},
	// 移除全部临时缓存
	clear() {
		window.sessionStorage.clear()
	}
}
```

# rem

```js
/***
 * @重新规划rem
 */
;((doc: Document, win: Window) => {
	const docEl = doc.documentElement
	let resizeEvt: string = 'orientationchange' in window ? 'orientationchange' : 'resize'
	const recalc = () => {
		const clientWidth = docEl.clientWidth
		if (!clientWidth) return
		let rem = 3.3 * (clientWidth / 320) //3 * (clientWidth / 320) 14px
		if (rem < 14) rem = 14
		docEl.style.fontSize = rem + 'px'
	}
	if (!doc.addEventListener) return
	win.addEventListener(resizeEvt, recalc, false)
	doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
```

```js
const baseSize = 32
// 设置 rem 函数
function setRem() {
	// 当前页面宽度相对于 750 宽的缩放比例，可根据自己需要修改。
	const scale = document.documentElement.clientWidth / 750
	// 设置页面根节点字体大小
	document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function () {
	setRem()
}
```

# 正则验证函数

## 验证百分比

```typescript
/**
 * 验证百分比（不可以小数）
 * @param val 当前值字符串
 * @returns 返回处理后的字符串
 */
export function verifyNumberPercentage(val: string): string {
	// 匹配空格
	let v = val.replace(/(^\s*)|(\s*$)/g, '')
	// 只能是数字和小数点，不能是其他输入
	v = v.replace(/[^\d]/g, '')
	// 不能以0开始
	v = v.replace(/^0/g, '')
	// 数字超过100，赋值成最大值100
	v = v.replace(/^[1-9]\d\d{1,3}$/, '100')
	// 返回结果
	return v
}

/**
 * 验证百分比（可以小数）
 * @param val 当前值字符串
 * @returns 返回处理后的字符串
 */
export function verifyNumberPercentageFloat(val: string): string {
	let v = verifyNumberIntegerAndFloat(val)
	// 数字超过100，赋值成最大值100
	v = v.replace(/^[1-9]\d\d{1,3}$/, '100')
	// 超过100之后不给再输入值
	v = v.replace(/^100\.$/, '100')
	// 返回结果
	return v
}
```

## 手机号码

```typescript
/**
 * 手机号码
 * @param val 当前值字符串
 * @returns 返回 true: 手机号码正确
 */
export function verifyPhone(val: string) {
	// false: 手机号码不正确
	if (!/^((12[0-9])|(13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0|1,5-9]))\d{8}$/.test(val)) return false
	// true: 手机号码正确
	else return true
}

/**
 * 国内电话号码
 * @param val 当前值字符串
 * @returns 返回 true: 国内电话号码正确
 */
export function verifyTelPhone(val: string) {
	// false: 国内电话号码不正确
	if (!/\d{3}-\d{8}|\d{4}-\d{7}/.test(val)) return false
	// true: 国内电话号码正确
	else return true
}
```

## 登陆

### 账号

```typescript
/**
 * 登录账号 (字母开头，允许5-16字节，允许字母数字下划线)
 * @param val 当前值字符串
 * @returns 返回 true: 登录账号正确
 */
export function verifyAccount(val: string) {
	// false: 登录账号不正确
	if (!/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/.test(val)) return false
	// true: 登录账号正确
	else return true
}
```

### 密码

```js
/**
 * 密码 (以字母开头，长度在6~16之间，只能包含字母、数字和下划线)
 * @param val 当前值字符串
 * @returns 返回 true: 密码正确
 */
export function verifyPassword(val: string) {
	// false: 密码不正确
	if (!/^[a-zA-Z]\w{5,15}$/.test(val)) return false
	// true: 密码正确
	else return true
}

/**
 * 强密码 (字母+数字+特殊字符，长度在6-16之间)
 * @param val 当前值字符串
 * @returns 返回 true: 强密码正确
 */
export function verifyPasswordPowerful(val: string) {
	// false: 强密码不正确
	if (!/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&\.*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&\.*]+$)(?![\d!@#$%^&\.*]+$)[a-zA-Z\d!@#$%^&\.*]{6,16}$/.test(val)) {
		return false
	}
	// true: 强密码正确
	else return true
}

/**
 * 密码强度
 * @param val 当前值字符串
 * @description 弱：纯数字，纯字母，纯特殊字符
 * @description 中：字母+数字，字母+特殊字符，数字+特殊字符
 * @description 强：字母+数字+特殊字符
 * @returns 返回处理后的字符串：弱、中、强
 */
export function verifyPasswordStrength(val: string) {
	let v = ''
	// 弱：纯数字，纯字母，纯特殊字符
	if (/^(?:\d+|[a-zA-Z]+|[!@#$%^&\.*]+){6,16}$/.test(val)) v = '弱'
	// 中：字母+数字，字母+特殊字符，数字+特殊字符
	if (/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&\.*]+$)[a-zA-Z\d!@#$%^&\.*]{6,16}$/.test(val)) v = '中'
	// 强：字母+数字+特殊字符
	if (/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&\.*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&\.*]+$)(?![\d!@#$%^&\.*]+$)[a-zA-Z\d!@#$%^&\.*]{6,16}$/.test(val)) {
		v = '强'
	}
	// 返回结果
	return v
}
```

## ip 地址

```typescript
/**
 * IP地址
 * @param val 当前值字符串
 * @returns 返回 true: IP地址正确
 */
export function verifyIPAddress(val: string) {
	// false: IP地址不正确
	if (
		!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(
			val
		)
	) {
		return false
	}
	// true: IP地址正确
	else return true
}
```

## 邮箱

```typescript
/**
 * 邮箱
 * @param val 当前值字符串
 * @returns 返回 true: 邮箱正确
 */
export function verifyEmail(val: string) {
	// false: 邮箱不正确
	if (
		!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
			val
		)
	) {
		return false
	}
	// true: 邮箱正确
	else return true
}
```

## 身份证

```typescript
/**
 * 身份证
 * @param val 当前值字符串
 * @returns 返回 true: 身份证正确
 */
export function verifyIdCard(val: string) {
	// false: 身份证不正确
	if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(val)) return false
	// true: 身份证正确
	else return true
}
```

## 姓名

```typescript
/**
 * 姓名
 * @param val 当前值字符串
 * @returns 返回 true: 姓名正确
 */
export function verifyFullName(val: string) {
	// false: 姓名不正确
	if (!/^[\u4e00-\u9fa5]{1,6}(·[\u4e00-\u9fa5]{1,6}){0,2}$/.test(val)) return false
	// true: 姓名正确
	else return true
}
```

## 邮政编码

```typescript
/**
 * 邮政编码
 * @param val 当前值字符串
 * @returns 返回 true: 邮政编码正确
 */
export function verifyPostalCode(val: string) {
	// false: 邮政编码不正确
	if (!/^[1-9][0-9]{5}$/.test(val)) return false
	// true: 邮政编码正确
	else return true
}
```

## url 处理

```typescript
/**
 * url 处理
 * @param val 当前值字符串
 * @returns 返回 true: url 正确
 */
export function verifyUrl(val: string) {
	// false: url不正确
	if (
		!/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
			val
		)
	) {
		return false
	}
	// true: url正确
	else return true
}
```

## 车牌号

```js
/**
 * 车牌号
 * @param val 当前值字符串
 * @returns 返回 true：车牌号正确
 */
export function verifyCarNum(val: string) {
	// false: 车牌号不正确
	if (
		!/^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(
			val
		)
	) {
		return false
	}
	// true：车牌号正确
	else return true
}
```

## 数字

### 小数或整数(不可以负数)

```js
/**
 * 小数或整数(不可以负数)
 * @param val 当前值字符串
 * @returns 返回处理后的字符串
 */
export function verifyNumberIntegerAndFloat(val: string) {
	// 匹配空格
	let v = val.replace(/(^\s*)|(\s*$)/g, '')
	// 只能是数字和小数点，不能是其他输入
	v = v.replace(/[^\d.]/g, '')
	// 以0开始只能输入一个
	v = v.replace(/^0{2}$/g, '0')
	// 保证第一位只能是数字，不能是点
	v = v.replace(/^\./g, '')
	// 小数只能出现1位
	v = v.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
	// 小数点后面保留2位
	v = v.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
	// 返回结果
	return v
}
```

### 正整数验证

```js
/**
 * 正整数验证
 * @param val 当前值字符串
 * @returns 返回处理后的字符串
 */
export function verifiyNumberInteger(val: string) {
	// 匹配空格
	let v = val.replace(/(^\s*)|(\s*$)/g, '')
	// 去掉 '.' , 防止贴贴的时候出现问题 如 0.1.12.12
	v = v.replace(/[\.]*/g, '')
	// 去掉以 0 开始后面的数, 防止贴贴的时候出现问题 如 00121323
	v = v.replace(/(^0[\d]*)$/g, '0')
	// 首位是0,只能出现一次
	v = v.replace(/^0\d$/g, '0')
	// 只匹配数字
	v = v.replace(/[^\d]/g, '')
	// 返回结果
	return v
}
```

# 数组

## 数组去重

_使用**Map()数组去重**，不能去复杂数组类型_

```js
type uniArrType = string[] | number[]
uniMapArr: (array: uniArrType) => {
	//使用Map()数组去重，不能去复杂数组类型
	let map = new Map()
	let newArr = new Array()
	array.forEach((item: any) => {
		if (!map.has(item)) {
			map.set(item, 1)
			newArr.push(item)
		}
	})
	return newArr
}
```

**\*Set 数组去重**，可以去掉重复的 NaN，不能去复杂数组类型\*

```js
type uniArrType = string[] | number[]

uniSetArr: (array: uniArrType) => {
    return [...new Set(array)]
},
```

**\*filter 数组去重**，可以去掉 NaN 和复杂数据类型\*,包括**数组对象去重**，但是对象里面的属性**有排序要求**,顺序一样才会去掉

```js
const uni = (array: any) => {
    let obj = {} as any
    return array.filter((item: any) => {
        // eslint-disable-next-line no-prototype-builtins
        return obj.hasOwnProperty(typeof item + JSON.stringify(item))
            ? false
        : (obj[typeof item + JSON.stringify(item)] = true)
    })
}
```

**数组对象去重**，**没有排序要求**

**`Map`** 对象保存键值对，并且能够记住键的原始插入顺序。任何值(对象或者[原始值](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive)) 都可以作为一个键或一个值。

```js
const uni = (array: any) => {
	let map = new Map()
	for (let item of array) {
		if (!map.has(item.id)) {
			map.set(item.id, item) // 生成唯一的键对应数组中的各个值
		}
	}
	return [...map.values()]
}

const obj = [{ a: '1' }, { a: '1' }]
console.log(uni(obj)) // [{ a: '1' }]
```

**lodash**

https://www.lodashjs.com/docs/lodash.uniq

```js
import { isEqual, uniqWith, uniqBy, uniq } from 'lodash'
let arr = [{ id: 1, name: 'sli', year: 2012 }]
console.log('原数组:', uniq(arr))
console.log('根据id去掉相同的元素:', uniqBy(arr, 'id'))
console.log('深检查数组每一项进行去重:', uniqWith(arr, isEqual))
```

## 判断数组是否有某个值

```js
;[].includes(value)

dimArrayHas: (value: string, array: Array<string | object>) => {
	let has
	array.forEach((item) => {
		//模糊判断数组中是否有某个值
		if (value.indexOf(item) != -1) {
			return (has = 1)
		}
	})
	return has
}

arrHas: (value: any, array: Array<string | object>) => {
	//精准判断数组中是否有某个值
	let temp = new Set(array)
	const isHas = temp.has(value)
	return isHas
}

arrHasObj: (obj: object, arr: Array<object>) => {
	//判断数组中是否有某个对象
	const pos = JSON.stringify(arr).indexOf(JSON.stringify(obj))
	return pos
}
```

## 数组求和

```js
reduceTotal: (array: Array<number>) => {
    //使用reduce对数组求和
    const count = (total: number, currentValue: number) => {
        return total + currentValue
    }
    return array.reduce(count)
},
```

## 截取字符串

```js
getCaption: (content: string, chars: string, direction: number) => {
    //截取字符串
    const index = content.lastIndexOf(chars)
    if(index === -1) return content
    return content = direction === 0 ? content.substring(0, index) : content.substring(index + 1, content.length)
},
```

## 数组 toggle

_判断数组存在某个元素就移除该元素不存在就添加该元素_

```js
arrToggle: (val: string, arr: Array<string>) => {
	let pos = arr.indexOf(val)
	pos < 0 ? arr.push(val) : arr.splice(pos, 1)

	return { pos, arr }
}

arrToggle: (val: string, arr: Array<string>) => {
	let temp = new Set(arr)
	const isHas = temp.has(val)
	if (isHas) {
		const pos = arr.indexOf(val)
		arr.splice(pos, 1)
	} else {
		arr.push(val)
	}

	return { isHas, arr }
}
```

_判断数组是否存在这个对象，有就移除该对象,不存在就添加该对象_

```js
type objType {
    age: number,
    name: string
}
arrToggleObj: (obj: any, arr: Array<objType>) => {
    const pos = JSON.stringify(arr).indexOf(JSON.stringify(obj))

    if (pos < 0) {
        arr.push(obj)
    } else {
        arr = arr.filter((item: any) => {
            return item.id !== obj.id
        })
    }
    return arr
},
```

## 打乱数组

```js
export const shuffleArray = (arr) => arr.sort(() => 0.5 - Math.random())
```

# 字符串

## 是否是字符串

```typescript
export function isString(val: unknown): val is string {
	return is(val, 'String')
}
```

## 生成随机字符串

```js
/*使用方式
 *第一个参数指定位数，第二个字符串指定字符，都是可选参数，如果都不传，默认生成8位 uuid()
 */
export function uuid(length: number = 8, chars: string) {
	chars = chars || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
	let result: string
	for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
	return result
}
```

## 反转字符串

```js
export const reverse = (str) => str.split('').reverse().join('')
```

## 英文字符串首字母大写

```js
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)
```

## 获取字符串指定前后几位

```js
/** 获取字符串指定前几位
* @param str {String} 原字符串
* @param num {Number} 需求的位数
 **/
getStrFirstPart(str, num) {
    str = '' + str
    num = Number(num)
    if (num > str.length) {
        num = str.length
    }
    return str.slice(0, num)
}
/** 获取字符串指定最后几位
* @param str {String} 原字符串
* @param num {Number} 需求的位数
**/
getStrLastPart(str, num) {
    str = '' + str
    num = Number(num)
    return str.slice(-num)
},
```

# 工具函数

## 去掉中文及空格

```typescript
/**
 * 去掉中文及空格
 * @param val 当前值字符串
 * @returns 返回处理后的字符串
 */
export function verifyCnAndSpace(val: string) {
	// 匹配中文与空格
	let v = val.replace(/[\u4e00-\u9fa5\s]+/g, '')
	// 匹配空格
	v = v.replace(/(^\s*)|(\s*$)/g, '')
	// 返回结果
	return v
}
```

## 去掉英文及空格

```js
export function verifyEnAndSpace(val: string) {
	// 匹配英文与空格
	let v = val.replace(/[a-zA-Z]+/g, '')
	// 匹配空格
	v = v.replace(/(^\s*)|(\s*$)/g, '')
	// 返回结果
	return v
}
```

## 禁止输入空格

```typescript
export function verifyAndSpace(val: string) {
	// 匹配空格
	const v = val.replace(/(^\s*)|(\s*$)/g, '')
	// 返回结果
	return v
}
```

## 金额用 `,` 区分开

```typescript
/**
 * 金额用 `,` 区分开
 * @param val 当前值字符串
 * @returns 返回处理后的字符串
 */
export function verifyNumberComma(val: string) {
	// 调用小数或整数(不可以负数)方法
	let v: any = verifyNumberIntegerAndFloat(val)
	// 字符串转成数组
	v = v.toString().split('.')
	// \B 匹配非单词边界，两边都是单词字符或者两边都是非单词字符
	v[0] = v[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	// 数组转字符串
	v = v.join('.')
	// 返回结果
	return v
}
```

## 匹配文字变色（搜索时）

```typescript
/**
 * 匹配文字变色（搜索时）
 * @param val 当前值字符串
 * @param text 要处理的字符串值
 * @param color 搜索到时字体高亮颜色
 * @returns 返回处理后的字符串
 */
export function verifyTextColor(val: string, text = '', color = 'red') {
	// 返回内容，添加颜色
	const v = text.replace(new RegExp(val, 'gi'), `<span style='color: ${color}'>${val}</span>`)
	// 返回结果
	return v
}
```

## 数字转中文大写

```typescript
/**
 * 数字转中文大写
 * @param val 当前值字符串
 * @param unit 默认：仟佰拾亿仟佰拾万仟佰拾元角分
 * @returns 返回处理后的字符串
 */
export function verifyNumberCnUppercase(val: any, unit = '仟佰拾亿仟佰拾万仟佰拾元角分', v = '') {
	// 当前内容字符串添加 2个0，为什么??
	val += '00'
	// 返回某个指定的字符串值在字符串中首次出现的位置，没有出现，则该方法返回 -1
	const lookup = val.indexOf('.')
	// substring：不包含结束下标内容，substr：包含结束下标内容
	if (lookup >= 0) val = val.substring(0, lookup) + val.substr(lookup + 1, 2)
	// 根据内容 val 的长度，截取返回对应大写
	unit = unit.substr(unit.length - val.length)
	// 循环截取拼接大写
	for (let i = 0; i < val.length; i++) {
		v += '零壹贰叁肆伍陆柒捌玖'.substr(val.substr(i, 1), 1) + unit.substr(i, 1)
	}
	// 正则处理
	v = v
		.replace(/零角零分$/, '整')
		.replace(/零[仟佰拾]/g, '零')
		.replace(/零{2,}/g, '零')
		.replace(/零([亿|万])/g, '$1')
		.replace(/零+元/, '元')
		.replace(/亿零{0,3}万/, '亿')
		.replace(/^元/, '零元')
	// 返回结果
	return v
}
```

## 不是浏览器环境

```js
export const isServer = typeof window === 'undefined'
```

## 是否是对象

```typescript
export function isObject(val: any): val is Record<any, any> {
	return val !== null && is(val, 'Object')
}
```

## 是否是火狐

```typescript
export const isFirefox = function () {
	return !isServer && !!window.navigator.userAgent.match(/firefox/i)
}
```

## 是否是客户端

```typescript
export const isClient = () => {
	return typeof window !== 'undefined'
}
```

## 是否是 Dom 元素

```typescript
export const isElement = (val: unknown): val is Element => {
	return isObject(val) && !!val.tagName
}
```

## 设置浏览器标题国际化

```typescript
import { nextTick } from 'vue'
/**
 * 设置浏览器标题国际化
 * @method const title = useTitle(); ==> title()
 */
const useTitle = () => {
	nextTick(() => {
		const { themeConfig } = storeToRefs(appStore.useThemeConfig)
		let webTitle = ''
		const globalTitle: string = themeConfig.value.globalTitle
		const { path, meta } = router.currentRoute.value
		if (path === '/login') {
			webTitle = <any>meta.title
		} else {
			webTitle = setTagsViewNameI18n(router.currentRoute.value)
		}
		document.title = `${webTitle} - ${globalTitle}` || globalTitle
	})
}
```

## 判断用户使用设备类型

```js
/*
*判断是否 ios 设备
* */
deviceIsIOS() {
    const u = navigator.userAgent
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
},
/*
*判断是否 Android 设备
* */
deviceIsAndroid() {
	const u = navigator.userAgent
	return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
},
```

## 元素平滑滚动

```js
toScroll(el, total, scrollCount, scrollTime) {
    let distance = el.scrollTop
    let step = total / scrollCount
    const stepTime = scrollTime / scrollCount
    if (total > distance) {
        smoothDown()
    } else {
        const newTotal = distance - total
        step = newTotal / scrollCount
        smoothUp()
    }
    function smoothDown() {
        if (distance < total) {
            distance += step
            el.scrollTop = distance
            setTimeout(smoothDown, stepTime)
        } else {
            el.scrollTop = total
        }
    }
    function smoothUp() {
        if (distance > total) {
            distance -= step
            el.scrollTop = distance
            setTimeout(smoothUp, stepTime)
        } else {
            el.scrollTop = total
        }
    }
}
```

## 判断是否是移动端

```typescript
/**
 * 判断是否是移动端
 */
const isMobile = () => {
	if (
		navigator.userAgent.match(
			/('phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone')/i
		)
	) {
		return true
	} else {
		return false
	}
}
```

## 判断是否是微信浏览器

```js
isweixin() {
    const ua = window.navigator.userAgent.toLowerCase()
    if (ua.indexOf('micromessenger') > -1) {
        return true
    } else {
        return false
    }
}
```

## 银行卡每 4 位加入空格

```js
bankCardNumRule(num) {
    if (/\S{5}/.test(num)) {
        return num.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
    } else {
        return num
    }
}
```

## 去掉所有空格

```js
bankCardNumUtil(num) {
    return num.replace(/\s/g, '')
}
```

## 金额千分位格式化

```js
/** 金额千分位格式化
* @param num {Number} 金额
* @param digits {Number} 保留小数点后几位数
**/
addThousandSign(num, digits) {
    num = parseFloat(num)
    num = '' + num.toFixed(digits)
    return num.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
}
/** 删除金额千分位格式化
* @param num {String} 金额
**/
delThousandSign(num) {
    const x = num.split(',')
    return parseFloat(x.join(''))
}
```

## cookie

```js
/*
*说明：设置cookie方法
*key：对象  val：对象的值   time：过去时间（小时）
* */
setCookie(key, val, time) {
    if (time) {
        const date = new Date() // 获取当前时间
        const hours = time // 将date设置为n小时以后的时间
        date.setTime(date.getTime() + hours * 3600 * 1000) // 格式化为cookie识别的时间
        document.cookie = key + '=' + val + ';expires=' + date.toGMTString() // 设置cookie
    } else {
        document.cookie = key + '=' + val
    }
},
/*
*说明：获取cookie方法
*key：对象
* */
getCookie(key) {
    // 获取cookie，并且将获得的cookie格式化，去掉空格字符
    const getCookie = document.cookie.replace(/[ ]/g, '')
    // 将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
    const arrCookie = getCookie.split(';')
    let tips // 声明变量tips
    for (let i = 0; i < arrCookie.length; i++) {
        // 使用for循环查找cookie中的tips变量
        // 将单条cookie用"等号"为标识，将单条cookie保存为arr数组
        const arr = arrCookie[i].split('=')
        if (key === arr[0]) {
            // 匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
            tips = arr[1] // 将cookie的值赋给变量tips
            break // 终止for循环遍历
        }
    }
	return tips
},
/*
*说明：删除cookie方法
*key：对象
* */
deleteCookie(key) {
	// 删除cookie方法
	const date = new Date() // 获取当前时间
    date.setTime(date.getTime() - 10000) // 将date设置为过去的时间
    ocument.cookie = key + '=v; expires =' + date.toGMTString() // 设置cookie
}
```

## 获取文件后缀名

```js
/**
 * 获取文件后缀名
 * @param {String} filename
 * getExt("1.mp4") //->mp4
 */
export function getExt(filename: string) {
	return filename.split('.').pop().toLowerCase()
}
```

## 复制内容到剪切板

```js
/**
 * 复制内容到剪贴板
 * //如果复制成功返回true copyToBoard('lalallala')
 */
export function copyToBoard(value: string) {
	const element = document.createElement('textarea')
	document.body.appendChild(element)
	element.value = value
	element.select()
	if (document.execCommand('copy')) {
		document.execCommand('copy')
		document.body.removeChild(element)
		return true
	}
	document.body.removeChild(element)
	return false
}

export const copyToClipboard = (text) => navigator.clipboard.writeText(text)
```

## 休眠多少毫秒

```js
//使用方式
// const fetchData=async()=>{
//     await sleep(1000)
// }
export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
```

## 深拷贝

```js
//使用方式
// deepCopy(person) //new person
export function deepCopy(obj: object) {
	if (typeof obj != 'object' || obj == null) {
		return obj
	}
	return JSON.parse(JSON.stringify(obj))
}
```

## 对象转化为 formdata

上传图片等文件有用

```js
/**
 * 对象转化为formdata
 * @param {Object} object
 * fetch(getFormData(req))
 */
export function getFormData(object: any) {
	const formData = new FormData()
	Object.keys(object).forEach((key) => {
		const value = object[key]
		if (Array.isArray(value)) {
			value.forEach((subValue, i) => formData.append(key + `[${i}]`, subValue))
		} else {
			formData.append(key, object[key])
		}
	})
	return formData
}
```

## 保留小数点后几位

```js
export function cutNumber(number: number, no = 2) {
	if (typeof number != 'number') {
		number = Number(number)
	}
	return Number(number.toFixed(no))
}
```

## 从 URL 获取查询参数

```js
//getParameters(window.location)
export const getParameters = (URL: string) => {
	URL = JSON.parse('{"' + decodeURI(URL.split('?')[1]).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
	return JSON.stringify(URL)
}

export const getParamsLocation = () => Object.fromEntries(new URLSearchParams(window.location.search)) //从 URL 获取查询参数
```

```js
/*
*说明：获取指定的URL参数值
*url：需要解析的地址参数
*name：需要获取的参数名
* */
getParam(url, name) {
    const urlArr = (url || '')
    .substr(url.indexOf('?') + 1)
    .replace(/^\\#/, '')
    .split('&')
    for (let i = 0; i < urlArr.length; i++) {
        const dataName = urlArr[i].split('=')
        if (dataName.length === 2 && dataName[0] === name) {
            return dataName[1]
        }
    }
    return null
}
```

## 颜色相关

### RGB 转十六进制

```js
// 颜色RGB转十六进制
export const rgbToHex = (r, g, b) => '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
```

### 生成随机十六进制颜色

```js
// 生成随机十六进制颜色
export const randomHex = () =>
	`#${Math.floor(Math.random() * 0xffffff)
		.toString(16)
		.padEnd(6, '0')}`
```

### hex 颜色转 rgb 颜色

```js
/**
 * hex颜色转rgb颜色
 * @param str 颜色值字符串
 * @returns 返回处理后的颜色值
 */
export function hexToRgb(str: any) {
	let hexs: any = ''
	const reg = /^\#?[0-9A-Fa-f]{6}$/
	if (!reg.test(str)) return ElMessage.warning('输入错误的hex')
	str = str.replace('#', '')
	hexs = str.match(/../g)
	for (let i = 0; i < 3; i++) hexs[i] = parseInt(hexs[i], 16)
	return hexs
}
```

### rgb 颜色转 Hex 颜色

```typescript
/**
 * rgb颜色转Hex颜色
 * @param r 代表红色
 * @param g 代表绿色
 * @param b 代表蓝色
 * @returns 返回处理后的颜色值
 */
export function rgbToHex(r: any, g: any, b: any) {
	const reg = /^\d{1,3}$/
	if (!reg.test(r) || !reg.test(g) || !reg.test(b)) return ElMessage.warning('输入错误的rgb颜色值')
	const hexs = [r.toString(16), g.toString(16), b.toString(16)]
	for (let i = 0; i < 3; i++) if (hexs[i].length == 1) hexs[i] = `0${hexs[i]}`
	return `#${hexs.join('')}`
}
```

### 加深颜色值

```typescript
/**
 * 加深颜色值
 * @param color 颜色值字符串
 * @param level 加深的程度，限0-1之间
 * @returns 返回处理后的颜色值
 */
export function getDarkColor(color: string, level: number) {
	const reg = /^\#?[0-9A-Fa-f]{6}$/
	if (!reg.test(color)) return ElMessage.warning('输入错误的hex颜色值')
	const rgb = hexToRgb(color)
	for (let i = 0; i < 3; i++) rgb[i] = Math.floor(rgb[i] * (1 - level))
	return rgbToHex(rgb[0], rgb[1], rgb[2])
}
```

### 变浅颜色值

```typescript
/**
 * 变浅颜色值
 * @param color 颜色值字符串
 * @param level 加深的程度，限0-1之间
 * @returns 返回处理后的颜色值
 */
export function getLightColor(color: string, level: number) {
	const reg = /^\#?[0-9A-Fa-f]{6}$/
	if (!reg.test(color)) return ElMessage.warning('输入错误的hex颜色值')
	const rgb = hexToRgb(color)
	for (let i = 0; i < 3; i++) rgb[i] = Math.floor((255 - rgb[i]) * level + rgb[i])
	return rgbToHex(rgb[0], rgb[1], rgb[2])
}
```

### 加深颜色值

```typescript

```

### 加深颜色值

```typescript

```

### 加深颜色值

```typescript

```

### 加深颜色值

```typescript

```

## 日期相关

```js
// 查找日期位于一年中的第几天 dayOfYear(new Date())
export const dayOfYear = (date) => Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)

// 计算2个日期之间相差多少天 dayDif(new Date("2020-10-21"), new Date("2021-10-22"))
export const dayDif = (date1, date2) => Math.ceil(Math.abs(date1.getTime() - date2.getTime()) / 86400000)
```

```js
timecost(param) {
    const time = param / 1000

    const hour = polyfill(Math.floor(time / 60 / 60) % 24)

    const minute = polyfill(Math.floor(time / 60) % 60)

    const second = polyfill(Math.floor(time) % 60)

    function polyfill(params) {
        if (+params < 10) {
            return `0${params}`
        } else {
            return params
        }
    }

    return `${hour}${minute}${second}`
},
getTheTime() {
    const t = new Date()
    const Y = t.getFullYear()
    const M = polyfill(t.getMonth() + 1)
    const D = polyfill(t.getDate())
    const h = polyfill(t.getHours())
    const m = polyfill(t.getMinutes())
    const s = polyfill(t.getSeconds())
    function polyfill(params) {
        if (+params < 10) {
            return `0${params}`
        } else {
            return params
        }
    }
	return `${Y}${M}${D}${h}${m}${s}`
}
```

## 添加水印

```typescript
// 页面添加水印效果
const setWatermark = (str: string) => {
	const id = '1.23452384164.123412416'
	if (document.getElementById(id) !== null) document.body.removeChild(<HTMLElement>document.getElementById(id))
	const can = document.createElement('canvas')
	can.width = 200
	can.height = 130
	const cans: any = can.getContext('2d')
	cans.rotate((-20 * Math.PI) / 180)
	cans.font = '12px Vedana'
	cans.fillStyle = 'rgba(200, 200, 200, 0.30)'
	cans.textBaseline = 'Middle'
	cans.fillText(str, can.width / 10, can.height / 2)
	const div = document.createElement('div')
	div.id = id
	div.style.pointerEvents = 'none'
	div.style.top = '15px'
	div.style.left = '0px'
	div.style.position = 'fixed'
	div.style.zIndex = '10000000'
	div.style.width = `${document.documentElement.clientWidth}px`
	div.style.height = `${document.documentElement.clientHeight}px`
	div.style.background = `url(${can.toDataURL('image/png')}) left top repeat`
	document.body.appendChild(div)
	return id
}

/**
 * 页面添加水印效果
 * @method set 设置水印
 * @method del 删除水印
 */
const watermark = {
	// 设置水印
	set: (str: string) => {
		let id = setWatermark(str)
		if (document.getElementById(id) === null) id = setWatermark(str)
	},
	// 删除水印
	del: () => {
		const id = '1.23452384164.123412416'
		if (document.getElementById(id) !== null) document.body.removeChild(<HTMLElement>document.getElementById(id))
	}
}

// 导出方法
export default watermark
```

## 数字

### 校验数字是奇数还是偶数

```js
export const isEven = (num) => num % 2 === 0
```

### 求数字的平均值

```js
export const average = (...args) => args.reduce((a, b) => a + b) / args.length //average(1, 2, 3, 4);
```

## 回到顶部

```js
export const goToTop = () => window.scrollTo(0, 0)
```

## 获取用户选择的文本

```js
export const getSelectedText = () => window.getSelection().toString()
```

## 检查用户的设备是否处于暗模式

```js
export const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
```
