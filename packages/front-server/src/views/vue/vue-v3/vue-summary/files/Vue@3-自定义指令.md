https://juejin.cn/post/6968996649515515917#comment

## 自定义指令

- 自定义指令分为两种
  - _自定义局部指令_：组件中通过**directives 选项**，只能在当前组件中使用
  - _自定义全局指令_：app 的**directive 方法**，可以在任意组件中使用

我们让一个想让页面的输入框自动聚焦，我们可能会怎么做：

```vue
<template>
	<input ref="input" />
</template>

<script>
export default {
	mounted() {
		this.$refs.input.focus()
	}
}
</script>
```

上面的代码基本能实现我们需要的功能，但是要是有很多页面都需要这个功能，那我们就只能是复制这段代码过去了，而通过自定义指令我们就能回避这种问题，下面就看看如果使用指令，应该怎么做。

```js
Vue.directive('focus', {
	bind() {},
	inserted(el) {
		el.focus()
	},
	update() {},
	componentUpdated() {},
	unbind() {}
})
```

我们通过全局的 Vue 实例注册一个自定义指令，然后通过 `v-focus` 绑定到需要聚焦的 input 元素上。如果，其他组件或模块也需要聚焦功能，只要简单的绑定此指令即可。

```vue
<template>
	<input v-focus />
</template>
```

自定义指令能给我们带来极高的便利，而在 `Vue2` 中给一个指令定义对象可以提供 `bind`、`inserted`、`update`、`componentUpdated`、`unbind` 五个钩子函数。[更多详情](https://link.juejin.cn?target=https%3A%2F%2Fcn.vuejs.org%2Fv2%2Fguide%2Fcustom-directive.html)

但是在新发布的 `Vue3` 中对指令也做了一些改造，主要就是对其中的钩子函数进行了优化升级，还有一些小的注意点，下面我们就一起来看看。

## Vue3 指令

`Vue3` 对指令的生命周期钩子改造了一翻，使其更像和普通组件钩子一般，更加方便可读和记忆。

```js
app.directive('directiveName', {
	// 在绑定元素的 attribute 或事件监听器被应用之前调用, 在指令需要附加须要在普通的 v-on 事件监听器前调用的事件监听器时，这很有用
	created() {},
	// 当指令第一次绑定到元素并且在挂载父组件之前调用
	beforeMount() {},
	// 在绑定元素的父组件被挂载后调用
	mounted() {},
	// 在更新包含组件的 VNode 之前调用
	beforeUpdate() {},
	// 在包含组件的 VNode 及其子组件的 VNode 更新后调用
	updated() {},
	// 在卸载绑定元素的父组件之前调用
	beforeUnmount() {},
	// 当指令与元素解除绑定且父组件已卸载时, 只调用一次
	unmounted() {}
})
```

### 修饰符

```vue
<template>
	<!-- 字符串要使用单引号和双引号 -->
	<button v-copy.a.6="'copy'"></button>
</template>
<script>
export default {
	directive: {
		copy: {
			create(el, bindings, vnode, preVnode) {
				console.log(bindings) // 修饰符和参数都放在这里了
			}
		}
	}
}
</script>
```

### 生命周期

一个指令定义对象可以提供如下几个钩子函数 (均为可选)：

- `created`：在绑定元素的 attribute 或事件监听器被应用之前调用。在指令需要附加须要在普通的 `v-on` 事件监听器前调用的事件监听器时，这很有用。
- `beforeMount`：当指令第一次绑定到元素并且在挂载父组件之前调用。
- `mounted`：在绑定元素的父组件被挂载后调用。
- `beforeUpdate`：在更新包含组件的 VNode 之前调用。
- `updated`：在包含组件的 VNode **及其子组件的 VNode** 更新后调用。
- `beforeUnmount`：在卸载绑定元素的父组件之前调用
- `unmounted`：当指令与元素解除绑定且父组件已卸载时，只调用一次。

`Vue3` 改造后的生命周期钩子变成了七个，而且名称变得比较好记了。

| Vue3          | Vue2             |
| ------------- | ---------------- |
| created       |                  |
| beforeMount   | bind             |
| mounted       | inserted         |
| beforeUpdate  | update 被移除！  |
| updated       | componentUpdated |
| beforeUnmount |                  |
| unmounted     | unbind           |

**注意点**

`Vue3` 中开始支持 Fragment，也就是说，我们可以在一个组件中保留多个根节点。

```vue
// HelloWorld.vue
<template>
	<div>Hello</div>
	<div>World</div>
</template>
```

这会要是在一个**多根组件**上使用自定义指令，指令会被忽略，并且会抛出一个警告。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5703220e673c4d5790165bdb3f684870~tplv-k3u1fbpfcp-watermark.awebp)

如果只是**单根组件**上使 用自定义指令依旧和 `Vue2` 一样指令会应用在最外层节点上。

## 常见指令

### index 暴露

- **多个指令使用 index 暴露出去**，然后在**main**中引入，**每个指令如何暴露自身参考 copy 指令**

```js
import scroll from './scroll'
import copy from './copy'
import antiShake from './anti-shake'
import { debounce, throttle } from './lodash'
import lazyload from './lazyload'

const directivesList: any = {
	scroll,
	copy,
	debounce,
	throttle,
	antiShake,
	lazyload // 挂载
}

const directives: any = {
	install: (app: any) => {
		Object.keys(directivesList).forEach((key) => {
			app.directive(key, directivesList[key]) // 注册
		})
	}
}

export default directives // 抛出

// main.ts
import directives from '@/directive'

app.use(directives)
```

### 函数暴露

```js
// index.ts
import time from './time'
const registerDirectives = (app) => {
    time(app)
}

export default registerDirectives

// 各个指令
export default time = (app) => {
    app.directive('time', {
        mounted(el) {
            console.log(el)
        }
    })
}

// main.ts
import registerDirectives from '@/registerDirectives'
const app = createApp(APP)

registerDirectives(app) // 将app传入
```

### v-scroll 滚轮

vue2

```js
import Vue from 'vue'

Vue.directive('scroll', {
	inserted: function (el, binding) {
		let f = function (evt) {
			if (binding.value(evt, el)) {
				window.removeEventListener('scroll', f)
			}
		}
		window.addEventListener('scroll', f)
	}
})
```

vue3

```js
const scroll = {
	mounted: (el: any, binding: any) => {
		const f = function (evt: any) {
			if (binding.value(evt, el)) {
				window.removeEventListener('scroll', f)
			}
		}
		window.addEventListener('scroll', f)
	}
}

export default scroll
```

### v-copy 复制

对于 Web 端来说要实现复制内容到剪贴板，一般我们都会直接选择下一个 npm 依赖来使用，非常方便简单。而与 Vue 相关的插件，Vue2 有[vue-clipboard2](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FInndy%2Fvue-clipboard2)，Vue3 有它的升级版[vue-clipboard3](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsoerenmartius%2Fvue3-clipboard)。

但这次我们用原生方法来写，保证这个指令不用依赖其他包，而其中最重要的一个方法就是`document.execCommand('Copy')`，其作用就是将拷贝当前**选中**内容到剪贴板。

查了一下，这个 API 兼容性还行。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1484c6bc4f048059fff93458c4486d2~tplv-k3u1fbpfcp-watermark.awebp)

但看了一下 [MDN](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FDocument%2FexecCommand) 文档记载竟然是个废弃的 API，但现在依旧能在各大浏览器上跑，还没删除，只是没形成标准。

这本来是 IE 的私有 API，在 IE9 时被引入，后续的若干年里陆续被 Chrome / Firefix / Opera 等浏览器也做了兼容支持，但始终没有形成标准。

不过不用慌，只要还没删，我们就用它，到时有问题到时再说，哈哈哈。

在写正式代码前，我们先缕缕过程先：

- 首先，使用场景可能是我们点击某一个按钮，就复制了某个内容（目标内容）到剪贴板中了，通过 `ctrl+v` 能粘贴出来。
- 把内容塞进剪贴板，我们会用到上面提到的`document.execCommand('Copy')`API 来实现，但是这里要注意，该 API 的作用是将当前 **选中** 的内容拷贝进剪贴板，所以我们必须让我们的目标内容被选中，才能调用该 API 来完成功能。
- 让内容被**选中**我们能通过 **[HTML 事件](https://link.juejin.cn?target=https%3A%2F%2Fwww.runoob.com%2Ftags%2Fref-eventattributes.html)** 中的 `onselect()` 方法来实现，而 `<input />` 标签、`<textarea />` 标签都能支持该事件。
- 所以我们需要动态创建一个 `<textarea />` 标签，当然该标签只是个辅助工具，所以要把它移出可视区域外。
- 再将我们的目标内容赋值给它的 value 属性，将它插入到页面 DOM 结构中。
- 调用 `<textarea />` 标签的 `onselect()` 选中值，再通过 `document.execCommand('Copy')` API 把内容复制进剪贴板。
- 最后移除 `<textarea />` 标签就可以。

具体代码就如下：

```js
import { ElMessage } from 'element-plus'

const copy = {
	beforeMount(el: any, binding: any) {
		el.targetContent = binding.value
		el.addEventListener('click', () => {
			if (!el.targetContent) return ElMessage.warning('没有需要复制的目标内容')
			// 创建textarea标签
			const textarea = document.createElement('textarea') as any
			// 设置相关属性
			textarea.readOnly = 'readonly'
			textarea.style.position = 'fixed'
			textarea.style.top = '-99999px'
			// 把目标内容赋值给它的value属性
			textarea.value = el.targetContent
			// 插入到页面
			document.body.appendChild(textarea)
			// 调用onselect()方法
			textarea.select()
			// 把目标内容复制进剪贴板, 该API会返回一个Boolean
			const res = document.execCommand('Copy')
			res && ElMessage.success('复制成功，剪贴板内容：' + el.targetContent)
			// 移除textarea标签
			document.body.removeChild(textarea)
		})
	},
	updated(el: any, binding: any) {
		// 实时更新最新的目标内容
		el.targetContent = binding.value
	},
	unmounted(el: any) {
		el.removeEventListener('click', () => {})
	}
}

export default copy
```

有时我们在点击复制后，可能需要个回调方法去做其他骚操作，那我们再改造改造代码。

```js
app.directive('copy', {
  beforeMount(el, binding) {
    el.targetContent = binding.value;
    const success = binding.arg;
    el.addEventListener('click', () => {
      ...
      res && success ? success(el.targetContent) : console.log('复制成功，剪贴板内容：' + el.targetContent);
      ...
    })
  },
  ...
})
```

具体使用：

vue@3

```vue
<template>
	<button v-copy:[success]="msg">点击复制</button>
</template>

<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
	setup() {
		let msg = ref('我是目标内容')
		return {
			msg,
			success: (value) => {
				console.log(value)
			}
		}
	}
})
</script>
```

vue@2

```vue
<template>
	<button v-copy="msg">点击复制</button>
</template>

<script>
import { defineComponent, ref } from 'vue'
export default {
	data() {
		return {
			msg: '123'
		}
	}
}
</script>
```

### v-day 日期

```vue
// <p v-day"'YY-MM-DD'"></p>
import dayjs from 'dayjs'
const day = {
    mounted(el, bindings) {
        const content = parseInt(el.textContent)
        const time = bindings.value || 'YY-MM-DD hh:mm:ss'

        el.textContent = dayjs(content).format(time)
    }
}
export default day
```

### v-real-img 备胎图片

我们知道 `<img />` 标签支持 `onerror()` 事件，其作用就是在图片请求失败的时候显示另一张图片来替代，这样能有效提高用户体验。

具体使用：

```html
<img src="images/logo.png" onerror="this.src='images/errorLogo.png';" />
```

但这有可能会带来一个问题，假如这个 `errorLogo.png` 图片也请求失败了，那将又会触发 `onerror()` 事件，导致陷入触发这个事件的死循环中，最后造成页面卡死。

而且就算图片存在，但如果图片质量很大，网络不太通畅，也会触发 `onerror()` 事件，导致直接就显示`errorLogo.png` 图片了，这样也是不对的，当然解决这种情况的方法也有：

```vue
<template>
	<img src="images/logo.png" onerror="errorImgCb" />
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
	setup() {
		function errorImgCb(e) {
			let img = e.srcElement
			img.src = 'images/errorLogo.png'
			img.onerror = null // 防止进入死循环
		}

		return {
			errorImgCb
		}
	}
})
</script>
复制代码
```

上面的代码基本也能满足功能需求，但图片在项目中肯定有很多地方会用到，那么在不同的页面中写就很是很麻烦了，但通过指令形式就更加简单，下面我们通过 Vue 指令来解决这个问题，具体代码就如下：

```js
app.directive('real-img', {
	async beforeMount(el, binding) {
		const imgURL = binding.value
		if (imgURL) {
			const exist = await imageIsExist(imgURL)
			exist && el.setAttribute('src', imgURL)
		}
		// 判断一个图片是否存在, 注意是异步行为
		function imageIsExist(url) {
			return new Promise((resolve) => {
				let img = new Image()
				img.src = url
				img.onload = () => {
					if (img.complete) {
						resolve(true)
						img = null
					}
				}
				img.onerror = () => {
					resolve(false)
					img = null
				}
			})
		}
	}
})
```

具体使用：

```vue
<template>
	<img v-real-img="'images/logo.png'" src="images/errorLogo.png" />
</template>
```

这个指令思路大致会有两种方向：

- 一种是直接加载目标图片，等到加载失败的时候使用默认图片。
- 一种是直接加载默认图片，等图片加载完成之后再使用加载完成的目标图片。

这里我选择第二种，原因是，很多时候我们都能人为保证这个默认图片基本是存在的，而且图片大小可能也不会很大，成功加载它的概率明显会高于目标图片，并且直接加载默认图片也可以达到一个占位图效果，这是非常友好好的，当然如果你想反之，也只需要对换下两种路径即可。

### v-lazy-img 图片懒加载

**图片懒加载**作用就不用多说了，前端的必备知识，`Vue2` 中实现该功能最常见的依赖就是[vue-lazyload](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fhilongjw%2Fvue-lazyload)，`Vue3` 暂时好像还没发现什么插件能用。

图片懒加载核心就是**判断当前图片是否到了可视区域**，该过程的实现方式多种多样，只要实现该逻辑，剩下的其他逻辑就是小问题了。

具体代码就如下：

```js
app.directive('lazy-img', {
	beforeMount(el, binding) {
		el.$data_src = binding.value
	},
	mounted(el) {
		const io = new IntersectionObserver((entries) => {
			const realSrc = el.$data_src
			// 通过isIntersecting判断是否在可视区域内
			entries[0].isIntersecting && realSrc && (el.src = realSrc)
		})
		// 挂载实例, 提供给后续的unmounted钩子操作
		el.$io = io
		// 监听目标对象
		io.observe(el)
	},
	updated(el, binding) {
		// 实时更新最新的图片路径
		el.$data_src = binding.value
	},
	unmounted(el) {
		// 停止监听工作
		el.$io.disconnect()
	}
})
```

上面代码我们通过 [IntersectionObserver](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FIntersectionObserver) API 来实现了图片的懒加载，虽然 IntersectionObserver 非常好用，但不兼容 IE，对于 IE 有要求就只能通过原生 JS 的方式来了。

想用原生 JS 的方式来实现图片懒加载，我们可以通过监听原生的 `onscroll()` 滚动事件，当滚动事件时，判断图片元素是否进入可视区域，再显示图片即可。

这里关键是如何判断元素进入可视区域？

这里我们会借助 [getBoundingClientRect()](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FRange%2FgetBoundingClientRect) API 来完成，它的兼容性就是杠杠的了，而通过 getBoundingClientRect()方法我们能获取到**元素距离屏幕顶部的距离(top)** 与 **元素距离屏幕底部的距离(bottom)**。

当 `top < 当前视口高度 && bottom > 0` 条件成立就能判断元素进入视口可见区域了，而获取视口高度可以通过 `documentElement.clientHeight` 和 `body.clientHeight`。

具体代码就如下：

```js
app.directive('lazy-img', {
	beforeMount(el, binding) {
		el.$data_src = binding.value
	},
	mounted(el) {
		loadImg(el)
		window.addEventListener('scroll', () => {
			loadImg(el)
		})
	},
	updated(el, binding) {
		// 实时更新最新的图片路径
		el.$data_src = binding.value
	}
})

// 滚动触发后, 需要处理的后续逻辑
function loadImg(el) {
	const clientHeight = getClientHeight()
	const { top, bottom } = el.getBoundingClientRect()
	const realSrc = el.$data_src
	top < clientHeight && bottom > 0 && realSrc && (el.src = realSrc)
}

// 获取视口高度, 兼容不同浏览器厂商
function getClientHeight() {
	const dClientHeight = document.documentElement.clientHeight
	const bodyClientHeight = document.body.clientHeight
	let clientHeight = 0
	if (bodyClientHeight && dClientHeight) {
		clientHeight = bodyClientHeight < dClientHeight ? bodyClientHeight : dClientHeight
	} else {
		clientHeight = bodyClientHeight > dClientHeight ? bodyClientHeight : dClientHeight
	}
	return clientHeight
}
```

监听了滚动事件肯定得做一下节流处理啦。

```js
app.directive('lazy-img', {
  ...
  mounted(el) {
    const handler = throttler(loadImg, 250);
    loadImg(el);
    window.addEventListener('scroll', () => {
      handler(el);
    })
  },
  ...
})

// 节流函数
function throttler(fun, delay) {
  let last, deferTimer
  return function (args) {
    let that = this
    let _args = arguments
    let now = +new Date()
    if (last && now < last + delay) {
        clearTimeout(deferTimer)
        deferTimer = setTimeout(function () {
            last = now
            fun.apply(that, _args)
        }, delay)
    }else {
        last = now
        fun.apply(that,_args)
    }
  }
}
...
```

再等等，你不会又觉得这就完事了吧？肯定没有啦，上面有两种实现形式，我们需要把他们合到一起形成一个指令才算大功告成，那么为什么要合？如果浏览器支持 IntersectionObserver 对象我们直接使用它性能是比较高的，再者使用该指令就不用考虑什么后顾之忧了。

完整代码如下：

```js
app.directive('lazy-img', {
	beforeMount(el, binding) {
		el.$data_src = binding.value
	},
	mounted(el) {
		IntersectionObserver ? ioEvent(el) : scrollEvent(el)
	},
	updated(el, binding) {
		el.$data_src = binding.value
	},
	unmounted(el) {
		IntersectionObserver && el.$io.disconnect()
	}
})

function ioEvent(el) {
	const io = new IntersectionObserver((entries) => {
		const realSrc = el.$data_src
		entries[0].isIntersecting && realSrc && (el.src = realSrc)
	})
	el.$io = io
	io.observe(el)
}

function scrollEvent(el) {
	const handler = throttler(loadImg, 250)
	loadImg(el)
	window.addEventListener('scroll', () => {
		handler(el)
	})
}

function loadImg(el) {
	const clientHeight = getClientHeight()
	const { top, bottom } = el.getBoundingClientRect()
	const realSrc = el.$data_src
	top < clientHeight && bottom > 0 && realSrc && (el.src = realSrc)
}

function getClientHeight() {
	const dClientHeight = document.documentElement.clientHeight
	const bodyClientHeight = document.body.clientHeight
	let clientHeight = 0
	if (bodyClientHeight && dClientHeight) {
		clientHeight = bodyClientHeight < dClientHeight ? bodyClientHeight : dClientHeight
	} else {
		clientHeight = bodyClientHeight > dClientHeight ? bodyClientHeight : dClientHeight
	}
	return clientHeight
}

function throttler(fun, delay) {
	let last, deferTimer
	return function (args) {
		let that = this
		let _args = arguments
		let now = +new Date()
		if (last && now < last + delay) {
			clearTimeout(deferTimer)
			deferTimer = setTimeout(function () {
				last = now
				fun.apply(that, _args)
			}, delay)
		} else {
			last = now
			fun.apply(that, _args)
		}
	}
}
```

#### vueuse 实现

- 懒加载核心逻辑
  - 如何知道图片进入视口区域 --> 使用 vueuse
  - 进入到视口区域以后将 img.src = url

```js
import { useIntersectionObserver } from '@vueuse/core'

// 全局指令注册
app.directive('lazy-img', {
    // 指令挂载以后自动执行
    mounted(el, binding) {
		//el: 指令挂载到的那个元素 dom; binding： value 指令等于号后面的表达式的值
        const { stop } = useIntersectionObserver(
          target,
          ([{ isIntersecting }]) => {
            if(isIntersecting) {
                el.src = binding.value
                // 加载图片之后停止监听
                stop()
            }
          },
        )
    }
})

// 使用
const url = ''
<img v-lazy-img="url" />
```

### v-emoji 限制输入特定字符

限制用户不能输入某些特定的字符是非常常见的场景了，在 Web 端很多时候我们都需要限制用户输入一些特殊的字符，如表情、特殊字体等等，这些容易造成一些转义、存储的异常，非常不好处理。

要想限制这些特殊字符，我们不能一种情况一种情况去写逻辑去限制，反而我们可以转换下思路，比起去限制这种那种的特殊字符不能输入，我们不如来想只能允许那些字符可以输入，比较中文、数字、字母、问号(？)、井号(#)等等，这些我们能通过正则来直接匹配比较方便。

具体代码就如下：

```js
import inputFilter from './cursor.js'
app.directive('emoji', {
	mounted(el) {
		el.$handler = (el) => {
			const regRule = /[^\a-\z\A-\Z0-9\u4e00-\u9fa5\？\#]/
			// el.value = val.replace(regRule, '');
			inputFilter.replaceAndSetPos(el, regRule, '')
			trigger(el, 'input') // 派发自定义事件, 防止出现视图更新数据没有数据的情况
		}
		el.$handler(el)
	},
	updated(el) {
		el.$handler && el.$handler(el)
	}
})
// 派发自定义事件
const trigger = (el, type) => {
	const e = document.createEvent('HTMLEvents')
	e.initEvent(type, true, true)
	el.dispatchEvent(e)
}
复制代码
// cursor.js
/**
 * 获取光标位置
 * @param elObject: getElementsByTagName('INPUT')
 * @returns {number}: 光标位置
 */
function getCursorPos(elObject) {
	let CaretPos = 0
	// IE Support
	if (document.selection) {
		elObject.focus() // 获取光标位置函数
		let Sel = document.selection.createRange()
		Sel.moveStart('character', -elObject.value.length)
		CaretPos = Sel.text.length
	}
	// Firefox/Safari/Chrome/Opera support
	else if (elObject.selectionStart || elObject.selectionStart == '0') CaretPos = elObject.selectionEnd
	return CaretPos
}

/**
 * 设置光标位置
 * @param elObject: getElementsByTagName('INPUT')
 * @param pos: 光标位置
 */
function setCursorPos(elObject, pos) {
	// Firefox/Safari/Chrome/Opera
	if (elObject.setSelectionRange) elObject.setSelectionRange(pos, pos)
	// IE
	else if (elObject.createTextRange) {
		let range = elObject.createTextRange()
		range.collapse(true)
		range.moveEnd('character', pos)
		range.moveStart('character', pos)
		range.select()
	}
}

/**
 * 替换后定位光标在原处,可以这样调用onkeyup=replaceAndSetPos(this,/[^/d]/g,'');
 * @param elObject: getElementsByTagName('INPUT')
 * @param pattern: 正则
 * @param text
 */
const replaceAndSetPos = function (elObject, pattern, text) {
	/* if(event.shiftKey||event.altKey||event.ctrlKey||
        event.keyCode==16||event.keyCode==17||event.keyCode==18||
        (event.shiftKey&&event.keyCode==36)
     ) 
    return;
  */
	// 保存原始光标位置
	let pos = getCursorPos(elObject)
	// 保存原始值
	let temp = elObject.value
	// 替换掉非法值
	elObject.value = temp.replace(pattern, text)
	// 截掉超过长度限制的字串(要求设置maxlength属性)
	let max_length = elObject.getAttribute && elObject.getAttribute('maxlength') ? parseInt(elObject.getAttribute('maxlength')) : ''
	if (max_length && elObject.value.length > max_length) {
		// (1) elObject.value = elObject.value.substring(0, max_length); 若用户在中间进行输入，此方法则达不到效果

		// (2) 可以满足任何情况,当超过输入了,去掉新输入的字符
		let str1 = elObject.value.substring(0, pos - 1)
		let str2 = elObject.value.substring(pos, max_length + 1)
		elObject.value = str1 + str2

		/* (3) 在支持keycode等一系列的情况下使用
		 * var e=e||event;
		 * currKey=e.keyCode||e.which||e.charCode;
		 * currKey = 0;
		 * or
		 * window.onkeydown=function(){
		 * if( event.keyCode!=37 && event.keyCode!=39 && event.keyCode!=8 ){ // 左、右、删除
		 *   return false;
		 * }
		 */
	}

	pos = pos - (temp.length - elObject.value.length) // 当前光标位置
	setCursorPos(elObject, pos) // 设置光标
}

const inputFilter = {
	getCursorPos: getCursorPos,
	setCursorPos: setCursorPos,
	replaceAndSetPos: replaceAndSetPos
}

export default inputFilter
```

具体使用：

```vue
<template>
	<input v-model="inputValue" v-emoji />
</template>

<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
	setup() {
		let inputValue = ref('')
		return {
			inputValue
		}
	}
})
</script>
```

> 需要注意，使用该指令一定要绑定好 `v-model="inputValue"` 属性，因为指令逻辑应用在`updated钩子` 上，未绑定 v-model 属性，输入时并不会触发该钩子。如果你要在未绑定 v-model 属性时，输入也触发效果，可以在 `mounted钩子` 上监听 `keyup()` 事件来执行核心代码，但这会带来另一个场景无法支持，即通过鼠标复制黏贴情况。

当你需要支持输入其他字符，你可以直接修改上面的正则即可。`cursor.js` 文件主要是用来解决在中间输入特殊字符后，光标位置跑到末尾的情况。关于对光标的操作，在`cursor.js` 文件写了详情的注解了，不懂可以细细看看。最后，如果你需要光标一直保持在末尾，可以替换成 `el.value = val.replace(regRule, '');`

### v-longpress 鼠标长按事件

在我们熟悉的[HTML 事件](https://link.juejin.cn?target=https%3A%2F%2Fwww.runoob.com%2Ftags%2Fref-eventattributes.html) 中并没有规定所谓的长按事件，网上大部分实现方式都是通过间接的方法去实现，大致过程就是：

- 当用户按下鼠标左键触发 `mousedown()` 事件，则我们启动一个计时器，设定一个时间阈值，开始计时。
- 如果在阈值内 `mouseup()` 事件被触发了，我们就认为只是个普通点击事件，如果超过阈值后才触发事件则我们认为是长按事件。

```js
app.directive('longpress', {
	beforeMount(el, binding) {
		const cb = binding.value
		if (typeof cb !== 'function') return console.warn('v-longpress指令必须接收一个回调函数')
		let timer = null
		// 重置计时器
		const cancel = () => {
			if (timer !== null) {
				clearTimeout(timer)
				timer = null
			}
		}

		el.addEventListener('mousedown', (e) => {
			// 排除点击与右键情况, event.button: 0-左键  2-右键
			if (e.type === 'click' && e.button !== 0) return
			e.preventDefault()
			if (timer === null) {
				timer = setTimeout(() => {
					cb()
					timer = null
				}, 2000)
			}
		})

		el.addEventListener('click', cancel)
		el.addEventListener('mouseout', cancel)
		// or - 长按后移出元素外是否还有效
		// el.addEventListener('mouseup', cancel);
	},
	unmounted(el) {
		el.removeEventListener('mousedown', () => {})
		el.removeEventListener('click', () => {})
		el.removeEventListener('mouseout', () => {})
	}
})
```

具体使用：

```vue
<template>
	<button v-longpress="longpress">按钮</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
	setup() {
		return {
			longpress() {
				console.log('长按事件')
			}
		}
	}
})
</script>
```

上面代码中用 `click()` 和 `mouseout()` 事件来替换 `mouseup()` 事件，主要是考虑到在按钮上按住后，直接移动到外面并不需要触发长按事件了，这可根据场景来使用吧。

当然这样还并未完结呢，还要考虑下移动端的情况，还有这个阈值可能要配置的情况，可能有场景是长按 3 秒或者 5 秒再做某件事情，话不多说，就直接上代码吧。

```js
app.directive('longpress', {
	beforeMount(el, binding) {
		const cb = binding.value
		el.$duration = binding.arg || 3000 // 获取长按时长, 默认3秒执行长按事件
		if (typeof cb !== 'function') return console.warn('v-longpress指令必须接收一个回调函数')
		let timer = null
		const add = (e) => {
			// 排除点击与右键情况, event.button: 0-左键  2-右键
			if (e.type === 'click' && e.button !== 0) return
			e.preventDefault()
			if (timer === null) {
				timer = setTimeout(() => {
					cb()
					timer = null
				}, el.$duration)
			}
		}
		const cancel = () => {
			if (timer !== null) {
				clearTimeout(timer)
				timer = null
			}
		}

		// 添加计时器
		el.addEventListener('mousedown', add)
		el.addEventListener('touchstart', add)
		// 取消计时器
		el.addEventListener('click', cancel)
		el.addEventListener('mouseout', cancel)
		el.addEventListener('touchend', cancel)
		el.addEventListener('touchcancel', cancel)
	},
	updated(el, binding) {
		// 可以实时更新时长
		el.$duration = binding.arg
	},
	unmounted(el) {
		el.removeEventListener('mousedown', () => {})
		el.removeEventListener('touchstart', () => {})
		el.removeEventListener('click', () => {})
		el.removeEventListener('mouseout', () => {})
		el.removeEventListener('touchend', () => {})
		el.removeEventListener('touchcancel', () => {})
	}
})
```

具体使用：

```vue
<template>
	<button v-longpress:[1000]="longpress">按钮</button>
</template>
```

### v-input:type 限制输入框输入类型

这是一个扩展性指令，主要是方便用来限制一些输入框的输入要求。比如：只允许输入数字、只能输入数字和小数等等。

```js
app.directive('input', {
	mounted(el, binding) {
		const _type = binding.arg
		const types = ['number', 'decimal', 'decimal_2', 'customize']
		if (!_type || !types.includes(_type))
			return console.log(`使用v-input指令需要选择特定功能：v-input:type="inputValue";  type = ${types.join('/')}.`)
		el.$handler = (el) => {
			switch (_type) {
				// 数字
				case 'number':
					el.value = el.value.replace(/[^\d]/, '')
					break
				// 数字+小数
				case 'decimal':
					el.value = el.value.replace(/[^\d.]/g, '') // 清除数字和'.'以外的字符
					el.value = el.value.replace(/\.{2,}/g, '.') // 连续两个'.', 只保留第一个'.'
					el.value = el.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.') // 隔着字符, 也保证只有一个'.'
					el.value.indexOf('.') < 0 && el.value != '' && (el.value = parseFloat(el.value)) // 保证不会出现重复的: 00, 01, 02 ...
					el.value.indexOf('.') > -1 && el.value.length === 1 && (el.value = '') // 第一位不能以'.'开头
					break
				// 数字+两位小数
				case 'decimal_2':
					el.value = el.value.replace(/[^\d.]/g, '')
					el.value = el.value.replace(/\.{2,}/g, '.')
					el.value = el.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
					el.value = el.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两位小数
					el.value.indexOf('.') < 0 && el.value != '' && (el.value = parseFloat(el.value))
					el.value.indexOf('.') > -1 && el.value.length === 1 && (el.value = '')
					break
				// 自定义, 由data-rule提供规则
				case 'customize':
					const rule = el.dataset.rule && eval(el.dataset.rule) // 字符串正则转正则表达式
					el.value = el.value.replace(rule, '')
					break
			}
			trigger(el, 'input')
		}
		el.$handler(el)
	},
	updated(el) {
		el.$handler && el.$handler(el)
	}
})
// 派发自定义事件
const trigger = (el, type) => {
	const e = document.createEvent('HTMLEvents')
	e.initEvent(type, true, true)
	el.dispatchEvent(e)
}
```

具体使用：

```vue
<template>
	<input v-input:customize="inputValue" data-rule="/[^\d]/" v-model="inputValue" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
	setup() {
		let inputValue = ref('')
		return {
			inputValue
		}
	}
})
</script>
```

上面已经实现了 `type = ['number', 'decimal', 'decimal_2', 'customize'];` 四种类型的限制，`customize` 类型是允许你通过 `data-rule=` 传递一个自定义的正则表达式。

如果你有更多其他限制规则，你可以再添加相应的 `case` 来实现。如果你没有，那让我来给你找点事情做，上面的 `v-input:decimal_2` 用来限制只能输入数字和两位小数，如何来通过 `_2` 来控制位数的需求呢？

### v-draggable 拖拽

拖拽指令，让一个元素具备拖动能力。实现过程其实不难，我们就直接上代码了(_^ω^_)。

```js
app.directive('draggable', {
	mounted(el) {
		// 设置目标元素基础属性
		el.style.cursor = 'move'
		el.style.position = 'fixed'

		// 监听鼠标在目标元素上按下
		el.addEventListener('mousedown', (e) => {
			let { width, height } = el.getBoundingClientRect(el)
			// 当前目标元素的left与top
			const left = el.offsetLeft
			const top = el.offsetTop
			// 保存按下的鼠标的X与Y
			const mouseX = e.clientX
			const mouseY = e.clientY

			// 监听鼠标移动
			document.onmousemove = (e) => {
				// 鼠标移动的距离
				let disX = e.clientX - mouseX
				let disY = e.clientY - mouseY

				el.style.left = left + disX + 'px'
				el.style.top = top + disY + 'px'
				return false // 防止选中文本，文本拖动的问题
			}

			// 监听鼠标抬起
			document.onmouseup = () => {
				document.onmousemove = null
				document.onmouseup = null
			}
		})
	}
})
```

具体使用：

```vue
<div style="width: 500px;height:500px;border:1px solid red;margin: 100px 0 0 300px">
    <div v-draggable style="width:100px;height:100px;background:red;"</div>
</div>
```

通过上面的指令，我们基本就能实现一个元素的拖动了。

![t1.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f0717d68e344b4db2a9736a21debdf7~tplv-k3u1fbpfcp-watermark.awebp)

代码基本思路：通过给元素添加绝对 `fixed` 定位属性，计算鼠标在水平和垂直方向的移动的距离，改变元素的 `top` 与 `left` 就完事了，记得加上 `top` 与 `left` 原有的尺寸哦。

当然这还没有真正完呢，还存在两个问题：

- 我们要让它只在限制宽高的父级元素内移动。
- 或者没有限制的时候是相对于屏幕上的可视区内移动的。

下面我们就先来解决这两个问题先。

```js
app.directive('draggable', {
	mounted(el, binding) {
		// 设置目标元素基础属性
		el.style.cursor = 'move'
		el.style.position = 'fixed'
		// 获取容器宽高
		const containerId = binding.arg || null
		let containerWidth = window.innerWidth
		let containerHeight = window.innerHeight
		// 存在父级容器
		if (containerId) {
			const containerEle = document.getElementById(containerId)
			let { width, height } = containerEle.getBoundingClientRect()
			containerWidth = width
			containerHeight = height
			if (!['fixed', 'absolute', 'relative'].includes(getStyle(containerEle, 'position'))) {
				containerEle.style.position = 'relative'
			}
			el.style.position = 'absolute'
		}

		// 鼠标在目标元素上按下
		el.addEventListener('mousedown', (e) => {
			let { width, height } = el.getBoundingClientRect()
			// 当前目标元素的left与top
			const left = el.offsetLeft
			const top = el.offsetTop
			// 保存按下的鼠标的X与Y
			const mouseX = e.clientX
			const mouseY = e.clientY
			// 计算边界值
			const leftLimit = left
			const rightLimit = containerWidth - left - width
			const topLimit = top
			const bottomLimit = containerHeight - top - height

			// 监听鼠标移动
			document.onmousemove = (e) => {
				// 鼠标移动的距离
				let disX = e.clientX - mouseX
				let disY = e.clientY - mouseY
				// 左右边界
				if (disX < 0 && disX <= -leftLimit) {
					el.style.left = left - leftLimit + 'px'
				} else if (disX > 0 && disX >= rightLimit) {
					el.style.left = left + rightLimit + 'px'
				} else {
					el.style.left = left + disX + 'px'
				}
				// 上下边界
				if (disY < 0 && disY <= -topLimit) {
					el.style.top = top - topLimit + 'px'
				} else if (disY > 0 && disY >= bottomLimit) {
					el.style.top = top + bottomLimit + 'px'
				} else {
					el.style.top = top + disY + 'px'
				}
				return false
			}

			// 监听鼠标抬起
			document.onmouseup = () => {
				document.onmousemove = null
				document.onmouseup = null
			}
		})
	}
})
// 获取元素的相关CSS
function getStyle(el, attr) {
	return el.currentStyle ? el.currentStyle[attr] : window.getComputedStyle(el, false)[attr]
}
```

为了获取到父级元素的相关属性，我们必须给父级唯一个 `id` 值，通过 `v-draggable:draggableBox` 传递进去，具体使用：

```vue
<div id="draggableBox" style="width: 500px;height:500px;border:1px solid red;margin: 100px 0 0 300px">
    <div v-draggable:draggableBox style="width:100px;height:100px;background:red;"></div>
</div>
```

改造后的代码主要围绕两个要点：

- 确定拖动的容器，我们通过 `id` 的方式来确定。（这里是否还有其他更好的方式？）
- 计算四个方向的边界值，如果超过边界值就不能拖动了，而边界值实际上就是元素在这四个方向能拖动的最大距离，也就是 `disX` 与 `disY` 的最大值。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b8b60607a8d498dacd3f8fb192d2ea9~tplv-k3u1fbpfcp-watermark.awebp)

如图，我们计算出这四个边界值即可，需要注意右边与下边方向要减去元素本身的尺寸，要不就会拖到外面去了。还有 `leftLimit = left = el.offsetLeft` ，对 `offsetLeft` 属性不清楚的铁汁要努力学习了，它的大致意思是相对于父对象的左边距，如果父对象不具有 `relative/absolute/fixed` 属性，则相对于 `body`。

至此，你以为这就完了吗？ 当然还没，我们这行 `let containerWidth = window.innerWidth;` 代码还是有点问题，没有考虑出现滚动条的时候。

```js
app.directive('draggable', {
  mounted(el, binding) {
    ...
    let containerWidth = window.innerWidth - getScrollWidth();
    ...
  },
})
// 返回滚动条的宽度, 没有则返回0
function getScrollWidth() {
  let noScroll, scroll, oDiv = document.createElement("DIV");
  oDiv.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";
  noScroll = document.body.appendChild(oDiv).clientWidth;
  oDiv.style.overflowY = "scroll";
  scroll = oDiv.clientWidth;
  document.body.removeChild(oDiv);
  let isExsit = document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
  return isExsit ? noScroll - scroll : 0
}
```

### v-permission 权限

权限指令，这是个非常简单简单的指令，存在的目的主要是为了回避通过 `v-show/v-if` 来进来繁琐冗余的权限判断操作。

```js
var ownPermission = ['user', 'order']
function toolPermission(el, permission) {
	if (permission && !ownPermission.includes(permission)) {
		el.parentNode && el.parentNode.removeChild(el) // 关键代码, 没有权限则删除元素
	}
}

app.directive('permission', {
	mounted(el, binding) {
		toolPermission(el, binding.value)
	},
	updated(el, binding) {
		toolPermission(el, binding.value)
	}
})
```

具体使用：

```vue
<div>
  <button v-permission="'user'">用户模块</button>
  <button v-permission="'order'">订单模块</button>
  <button v-permission="'goods'">商品模块</button>
</div>
```

### v-loading 加载指令

`v-loading` 一个非常方便实用的指令，基本上主流 UI 框架上 Loading 组件都会提供这种指令的形式。

```js
app.directive('loading', {
	beforeMount(el, binding) {
		el.$instance = document.createElement('div')
		el.$instance.innerText = 'loading...'
		binding.value && toggleLoading(el, binding)
	},
	updated(el, binding) {
		binding.oldValue !== binding.value && toggleLoading(el, binding)
	},
	unmounted(el, binding) {
		el.$domInserted && toggleLoading(el, { value: false, modifiers: binding.modifiers })
		el.$instance && (el.$instance = null)
	}
})

// 获取元素的相关CSS
function getStyle(el, attr) {
	return el.currentStyle ? el.currentStyle[attr] : window.getComputedStyle(el, false)[attr]
}

// 控制loading的显示与隐藏
function toggleLoading(el, binding) {
	if (binding.value) {
		insertDom(el, el.$instance, binding)
	} else {
		el.$instance.parentNode && el.$instance.parentNode.removeChild(el.$instance)
	}
}

// 插入loading Dom
function insertDom(el, instance, binding) {
	// 给添加loading样式
	const styles = {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		'z-index': 1000,
		'background-color': 'rgba(0, 0, 0, 0.3)',
		display: 'flex',
		'justify-content': 'center',
		'align-items': 'center',
		'flex-direction': 'column'
	}
	Object.keys(styles).forEach((property) => {
		instance.style[property] = styles[property]
	})
	// 给父级添加relative
	if (!['fixed', 'absolute', 'relative'].includes(getStyle(el, 'position'))) {
		el.style.position = 'relative'
	}
	// 插入dom
	el.appendChild(instance)
	// 表明dom已插入
	el.domInserted = true
}
```

具体使用：

```vue
<template>
	<div style="padding: 50px">
		<div v-loading="flag" style="width:100px;height:100px;border:1px solid red"></div>
		<button @click="flag = !flag">显示/隐藏</button>
	</div>
</template>
```

![t2.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/046c7c694c6b4cefb7a463f66e7a3db7~tplv-k3u1fbpfcp-watermark.awebp)

代码很简单，也没啥好讲的，通过以上代码基本能实现一个局部 loading 层的效果了。

完了？

那我们在改造改造吧(手动狗头)。

```js
app.directive('loading', {
  beforeMount(el, binding) {
    el.$instance = document.createElement('div');
    // 获取提示语
    const text = el.getAttribute('loading-text') || '';
    // 生成loading内部结构
    el.$instance.innerHTML = createLoadingInn(text);
    binding.value && toggleLoading(el, binding);
  },
  ...
})
// 生成loading内部结构
function createLoadingInn(text = '') {
  // 创建CSS
  const loadingInnCSS = `
    .loading-circular {
      height: 50px;
      width: 50px;
      animation: loading-rotate 2s linear infinite;
    }
    .loading-circular-path {
      animation: loading-dash 1.5s ease-in-out infinite;
      stroke-dasharray: 90, 150;
      stroke-dashoffset: 0;
      stroke-width: 2px;
      stroke: #409eff;
      stroke-linecap: round;
    }
    .loading-text {
      font-size: 13px;
      color: #409eff;
      margin-top: 6px;
    }
    @keyframes loading-rotate {
      100% {
        transform: rotate(360deg);
      }
    }
  `;
  // 创建DOM
  const loadingInnHTML = `
  <svg class="loading-circular" viewBox="25 25 50 50">
    <circle class="loading-circular-path" cx="50" cy="50" r="20" fill="none"/>
  </svg>
  ${text ? '<span class="loading-text">' + text + '</span>' : ''}
  `;
  // 把CSS直接插入页面中
  const styleNode = document.createElement('style');
  styleNode.setAttribute('type','text/css');
  styleNode.innerHTML = loadingInnCSS;
  let headNode = document.querySelector('head');
  headNode.appendChild(styleNode);

  return loadingInnHTML
}
...
```

具体使用：

```vue
<template>
	<div style="padding: 50px">
		<div v-loading="flag" loading-text="加载中..." style="width:100px;height:100px;border:1px solid red">橙某人</div>
		<button @click="flag = !flag">显示/隐藏</button>
	</div>
</template>
```

![t3.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d93cb6c929c409cae65a9826132cf1b~tplv-k3u1fbpfcp-watermark.awebp)

改造后的代码添加了一个方法，具体细节就看上面代码咯，然后也能通过 `loading-text="加载中..."` 来控制提示语，如果你也控制背景与颜色，也能通过此方式来进行

### v-clickoutside 点击其他地方消失

“点击其他地方消失”这句话是不是常常能听到产品经理说或者在需求文档中看见？这确实是个比较普遍的需求了，像下面图中两种情况的场景就会涉及：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9160bac29a234579938fed04243067dc~tplv-k3u1fbpfcp-watermark.awebp)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eae41b7bec924951a0bb816ce827b688~tplv-k3u1fbpfcp-watermark.awebp)

如果你用的是 UI 框架那么这其中就不会有半点毛病，但是有时候我们项目中没有用到 UI 框架，但我们就想简单实现第二张图的效果，在一个元素上展示一个 `tip层` ，点击其他地方就消失。如果只是一个地方还好，直接就给 `document` 增加一个 `click` 事件就完事，如果多个地方都用到那就挺蛋疼了，这时封装成一个指令就很便捷了。

```js
app.directive('clickoutside', {
	beforeMount(el, binding) {
		document.addEventListener(
			'click',
			(e) => {
				el.contains(e.target) && binding.value()
			},
			false
		)
	},
	unmounted() {
		document.removeEventListener('click', () => {})
	}
})
```

具体使用：

```vue
<template>
	<button v-clickoutside="clickoutside">点击</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
	setup() {
		return {
			clickoutside(e) {
				console.log('非自身点击触发')
			}
		}
	}
})
</script>
```

实现过程代码并不多，关键是 `Node.contains()` 方法
