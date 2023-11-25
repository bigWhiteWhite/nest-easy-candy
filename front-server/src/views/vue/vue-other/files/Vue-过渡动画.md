# Transition

https://v3.cn.vuejs.org/api/built-in-components.html#transition 官网

https://www.its404.com/article/Jie_1997/107841681 博客

在开发中，给一个组件的显示和消失添加某种过渡动画，可以很好的增加用户体验

没有动画的情况下，**整个内容的显示和隐藏会显得十分的生硬**

如果我们希望给**单元素**或者**组件**实现过渡动画，可以使用**transition 内置组件**来完成动画

- `name` - `string` 用于自动生成 CSS 过渡类名。例如：`name: 'fade'` 将自动拓展为 `.fade-enter`，`.fade-enter-active` 等。
- `persisted` - `boolean`。如果是 true，表示这是一个不真实插入/删除元素的转换，而是切换显示/隐藏状态。过渡钩子被注入，但渲染器将跳过。相反，自定义指令可以通过调用注入的钩子 (例如 `v-show`) 来控制转换。

```vue
<template>
	<button @click="show = !show"></button>
	<transition name="zhong">
		<h2 v-show="show">你好</h2>
	</transition>

	<!-- 动态组件 -->
	<transition name="zhong" mode="out-in" appear>
		<component :is="show ? 'view' : 'home'"></component>
	</transition>
</template>

<script>
import view from './view'
import home from './view'
export default {
	components: {
		view,
		home
	},
	data() {
		return {
			show: true
		}
	}
}
</script>
<style scoped>
.zhong-enter-from,
.zhong-leave-to {
	opacity: 0;
}
.zhong-enter-to,
.zhong-leave-from {
	opacity: 1;
}
.zhong-enter-active,
.zhong-leave-active {
	transition: opacity 2s;
}
</style>
```

- **transition 标签包裹的内容会有一个过渡的动画效果**
- 使用 transition 过渡组件需要满足的条件：
  1. 条件渲染（`v-if`）
  2. 条件展示（`v-show`）
  3. 动态组件
- 可以使用 `name` 属性给 transition 标签起名字
  1. class 选择器名字和 `name` 属性有关系，这里 `name` 属性名为 `fade`, 则 class 选择器名称前缀都已`fade`开头，
  2. 如果不写`name`属性，则**class 选择器名称前缀默认**以 `v` 开头
- transition 标签包裹的内容从隐藏变为显示时候动画原理
  1. 在动画即将被执行的一瞬间（动画执行的第一帧），会向 transition 内部的标签上增加两个 class 选择器名字，分别是`v-enter-from`、`v-enter-active`
  2. 在动画运行到第二帧的时候，会把 `v-enter-from` 的 class 选择器名称移除，然后增加一个`v-enter-to`的选择器名称
  3. 在动画执行结束的时候(动画执行的最后一帧），会把添加`v-enter-active`、`v-enter-to`的 class 选择器名称移除
- transition 标签包裹的内容从隐藏变为显示时候动画原理
  1. 在隐藏的第一个瞬间（动画执行的第一帧），会向 transition 内部的标签上增加两个 class 选择器名字，分别是`v-leave-from`、`v-leave-active`
  2. 在动画运行到第二帧的时候，会把 `v-leave-from` 的 class 选择器名称移除，然后增加一个`v-leave-to`的选择器名称
  3. 在动画执行结束的时候(动画执行的最后一帧），会把添加`v-leave-active`、`v-leave-to`的 class 选择器名称移除
- 过渡 CSS 类名<transition>中的 name 属性用于 替换 vue 钩子函数中的类名,**默认为 v**
  1. `v-enter-from`: 定义进入动画之前，元素的起始状态。在元素被插入时生效，在下一个帧移除。
  2. `v-enter-active`: 定义进入动画的状态。在元素被插入时生效，在 transition/animation 完成之后移除。
  3. `v-leave`:定义离开之后动画的终止状态。在离开过渡被触发时生效，在下一个帧移除。
  4. `v-leave-active`: 定义离开动画的结束状态。在离开过渡被触发时生效，在 transition/animation 完成之后移除。

**一个过渡动画的实例：**

```vue
<template>
	<div class="wrap">
		<transition name="fade">
			<div v-show="show">hello world</div>
		</transition>
		<button @click="handleClick">切换显隐</button>
	</div>
</template>
<script>
export default {
	data() {
		return {
			show: true
		}
	},
	methods: {
		handleClick() {
			this.show = !this.show
		}
	}
}
</script>
<style scoped>
.v-enter,
.v-leave-to {
	opacity: 0;
}
.v-enter-active,
.v-leave-active {
	transition: opacity 3s;
}
</style>
```

## 钩子函数

```html
<transition
	@before-enter="beforeEnter"
	@before-leave="beforeLeave"
	@enter="enter"
	@leave="leave"
	@appear="appear"
	@after-enter="afterEnter"
    @after-leave="afterLeave"
    @after-leave="afterLeave"
    @enter-cancelled="enterCancelled"
    @leave-cancelled="leaveCancelled" //仅v-show
    @appear-cancelled="appearCancelled"
    :css="false"
>
    <div v-show="ok">toggled content</div>
</transition>
<script>
const app = createApp({
  methods: {
    enter (el, done) {
      console.log(el)
    }
  }
})
</script>
```

## 路由中使用过渡

https://juejin.cn/post/6963205355702583303

在旧版本的 Vue 路由中，我们可以简单地用 `<transition>` 组件包装 `<router-view>`

```vue
<transition>
  <router-view />
</transition>
```

但是，在较新版本的 Vue 路由中则必须用 `v-slot` 来解构 props 并将它们传递到我们的内部 slot 中。 这将包含一个动态组件，该组件被过渡组件包围。

```vue
<router-view v-slot="{ Component }">
  <transition>
    <component :is="Component" />
  </transition>
</router-view>
```

# Vue 中使用 @keyframes

## @keyframes 的使用

1. `style` 中设置@keyframes
2. `transition` 标签 class 样式中使用 @keyframes 样式名称，这里为 **bounce-in**

```vue
<template>
	<div class="wrap">
		<transition name="fade">
			<div v-show="show">hello world</div>
		</transition>
		<button @click="handleClick">切换显隐</button>
	</div>
</template>
<script>
export default {
	data() {
		return {
			show: true
		}
	},
	methods: {
		handleClick() {
			this.show = !this.show
		}
	}
}
</script>
<style scoped>
@keyframes bounce-in {
	0% {
		transform: scale(0);
	}
	50% {
		transform: scale(1.5);
	}
	100% {
		transform: scale(1);
	}
}
/* 动画一般设置在active */
.fade-enter-active {
	transform-origin: left center;
	animation: bounce-in 1s;
}
.fade-leave-active {
	transform-origin: left center;
	animation: bounce-in 1s reverse; /* 动画反转 */
}
</style>
```

## 动画和过渡一起使用

动画和过渡可以共存,但是存在一个问题，如果动画的时间和过渡的时间不一样，那么听谁的呢？

- Vue 为了知道过渡的完成，内部是在监听 transitiond 或 animationend，到底使用哪一个取决于元素应用的 css 规则，如果只是使用了其中的一个，那么 Vue 能自动识别类型并设置监听
- 如果**同时使用了过渡和动画**，在这种情况下，可能某一个动画执行结束时，另外一个动画还没有结束
- 可以设置 type 属性为 animation 或者 transition 来明确的告知 Vue 监听的类型

- `type` - `string`。指定过渡事件类型，侦听过渡何时结束。有效值为 `"transition"` 和 `"animation"`。默认 Vue.js 将自动检测出持续时间长的为过渡事件类型。

```vue
<transition enter-active-class="active" leave-active-class="leave" type="animation">
      <div v-show="show">hello world</div>
</transition>
<style scoped>
@keyframes bounce-in {
	0% {
		transform: scale(0);
	}
	50% {
		transform: scale(1.5);
	}
	100% {
		transform: scale(1);
	}
}
/* 动画一般设置在active */
.fade-enter-active {
	transform-origin: left center;
	animation: bounce-in 1s;
}
.fade-leave-active {
	transform-origin: left center;
	animation: bounce-in 1s reverse; /* 动画反转 */
}
/* 动画和过渡可以共存,但是存在一个问题，如果动画的时间和过渡的时间不一样，那么听谁的呢 */
/* Vue为了知道过渡的完成，内部是在监听transitiond或animationend，到底使用哪一个取决于元素应用的css规则，如果只是使用了其中的一个，那么Vue能自动识别类型并设置监听 */
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
.fade-enter-active,
.fade-leave-avtive {
	transition: opacity 1s ease;
}
</style>
```

## 自定义标签的 class 名字

- `enter-from-class` - `string`定义进入过渡的开始状态，在元素被插入之前生效，在元素被插入之后的下一帧移除
- `enter-active-class` - `string`定义进入过渡生效时的状态，在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除，这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数
- `enter-to-class` - `string`定义进入过渡的结束状态，在元素被插入之后下一帧生效(与此同时 v-enter-from 被移除),在过渡/动画完成之后移除
- `leave-from-class` - `string`定义离开过渡的开始状态，在离开过渡被触发时立刻生效，下一帧被移除
- `leave-active-class` - `string`定义离开过渡生效时的状态，在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除，这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数
- `leave-to-class` - `string`定义离开过渡的结束状态，在离开过渡被触发之后下一帧生效(与此同时 v-leave-from 被移除),在过渡/动画完成之后移除
- `appear-class` - `string`
- `appear-active-class` - `string`
- `appear-to-class` - `string`

```vue
<template>
	<div class="wrap">
		<transition enter-active-class="active" leave-active-class="leave">
			<div v-show="show">hello world</div>
		</transition>
		<button @click="handleClick">切换显隐</button>
	</div>
</template>
<script>
export default {
	data() {
		return {
			show: true
		}
	},
	methods: {
		handleClick() {
			this.show = !this.show
		}
	}
}
</script>
<style scoped>
@keyframes bounce-in {
	0% {
		transform: scale(0);
	}
	50% {
		transform: scale(1.5);
	}
	100% {
		transform: scale(1);
	}
}
.active {
	transform-origin: left center;
	animation: bounce-in 1s;
}
.leave {
	transform-origin: left center;
	animation: bounce-in 1s reverse;
}
</style>
```

**自定义 class 和动画实例**

```vue
<template>
	<div class="wrap">
		<h2>css过渡动画</h2>
		<transition name="fade" enter-active-class="active" leave-active-class="leave">
			<div v-show="show">hello world</div>
		</transition>
		<button @click="handleClick">切换显隐</button>
	</div>
</template>
<script>
export default {
	data() {
		return {
			show: true
		}
	},
	methods: {
		handleClick() {
			this.show = !this.show
		}
	}
}
</script>
<style scoped>
@keyframes bounce-in {
	0% {
		transform: scale(0);
	}
	50% {
		transform: scale(1.5);
	}
	100% {
		transform: scale(1);
	}
}
.active {
	transform-origin: left center;
	animation: bounce-in 1s;
}
.leave {
	transform-origin: left center;
	animation: bounce-in 1s reverse;
}
</style>
```

# Vue 使用 Animate.css

## 使用 Animate.css 库，设置动画

Animate.css 官网：https://animate.style/

- 项目中引入 Animate.css 库使用教程：https://animate.style/#documentation

  ```js
  npm install animate.css --save

  import 'animate.css' // 引入
  ```

- 使用 Animate.css 库

`enter-active-class="animate__animated animate__bounceInDown"`

`leave-active-class="animate__animated animate__bounceInOut"`

```vue
<template>
	<div class="wrap">
		<h2>css过渡动画</h2>
		<!--使用类-->
		<transition name="fade" enter-active-class="animate__animated animate__bounceInDown" leave-active-class="animate__animated animate__bounceInOut">
			<div v-show="show">hello world</div>
		</transition>
		<!--使用动画帧-->
		<transition name="fade">
			<div v-show="show">hello world</div>
		</transition>

		<button @click="this.show = !this.show">切换显隐</button>
	</div>
</template>
<script>
export default {
	data() {
		return {
			show: true
		}
	}
}
</script>
<style scoped>
.fade-enter-active {
	animation: animate__backInUp 1s ease-in;
}
.fade-leave-active {
	animation: animate__backInUp 1s ease-in reverse; /* 不反转可以使用对应的相反动画替换animate__backInDown */
}
</style>
```

## 页面刷新，展示 Animate.css 库动画效果

上面设置的动画效果，在刷新的时候是没有效果的；如果需要在页面刷新时，也展示动画效果，需要添加以下设置：**appear** **appear-active-class**

```vue
<template>
	<div class="wrap">
		<h2>css过渡动画</h2>
		<transition
			name="fade"
			appear
			appear-active-class="animate__animated animate__bounceInDown"
			enter-active-class="animate__animated animate__bounceInDown"
			enter-active-class="animate__animated animate__bounceInDown"
		>
			<div v-show="show">hello world</div>
		</transition>

		<button @click="this.show = !this.show">切换显隐</button>
	</div>
</template>
```

## 同时使用 transition 动画和 Animate.css 库动画效果

- 增加 class 名
- 同时使用 transition 动画，和 Animate.css 库动画，动画时长不一致时，手动设置动画时长基准。设置 `type` 属性`type="transition"`,Animate.css 库动画默认为一秒结束，这里 transition 动画设置的时 3 秒结束，所以以 transition 动画为基准，三秒结束动画

```vue
<template>
	<div class="wrap">
		<h2>css过渡动画</h2>
		<transition
			:duration="{ enter: 5000, leave: 10000 }"
			name="fade"
			type="transiton"
			appear
			enter-active-class="animate__animated animate__bounce fade-enter-active"
			leave-active-class="animate__animated animate__shakeX fade-leave-active"
			appear-active-class="animate__animated animate__bounceInDown"
		>
			<div v-show="show">hello world</div>
		</transition>
		<button @click="this.show = !this.show">切换显隐</button>
	</div>
</template>
<style scoped>
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 3s;
}
</style>
```

## 自定义动画时长

- 为 transition 标签添加绑定 `duration` 属性，值为毫秒数`:duration="10000"`

- 自定义动画时长，分别设置显示和隐藏的动画时长为 transition 标签添加绑定 `duration` 属性，值为一个对象`:duration="{enter:5000,leave:10000}"`

```vue
<template>
	<div class="wrap">
		<h2>css过渡动画</h2>
		<transition
			:duration="{ enter: 5000, leave: 10000 }"
			name="fade"
			appear
			enter-active-class="animate__animated animate__bounce fade-enter-active"
			leave-active-class="animate__animated animate__shakeX fade-leave-active"
			appear-active-class="animate__animated animate__bounceInDown"
		>
			<div v-show="show">hello world</div>
		</transition>
		<button @click="this.show = !this.show">切换显隐</button>
	</div>
</template>
<script>
export default {
	data() {
		return {
			show: true
		}
	}
}
</script>
<style scoped>
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 3s;
}
</style>
```

## 两个元素切换

两个元素切换时存在问题，一个元素还没有消失，另外一个元素就出现了，就会把出现的元素压在下面，因为默认情况下进入和离开动画是同时发生的。

`mode` - `string` 控制离开/进入过渡的时间序列。有效的模式有 `"out-in"` 和 `"in-out"`；默认同时进行

```vue
<transition mode="out-in" name="zhong">
  <div v-if="ok">toggled content</div>
  <div v-else>toggled content2</div>
</transition>
```

# transition-group

如果希望渲染的是**一个列表**，并且**该列表中删除数据也希望有动画执行**，就需要**transition-group**组件来完成

- 默认情况下，它**不会渲染一个元素的包裹器**，但是你可以**指定一个元素并以 tag attribute 进行渲染**
- **过渡模式不可用**，因为我们不再相互切换特有的元素
- 内部元素总是**需要提供唯一的 key attribute 值**
- **css 过渡的类将会应用在内部的元素**中，而**不是这个组/容器本身**

- **Props：**
  - `tag` - `string` - 如果未定义，则不渲染动画元素。
  - `move-class` - 覆盖移动过渡期间应用的 CSS 类。
  - 除了 `mode` - 其他 attribute 和 `<transition>` 相同。
- **事件：**
  - 事件和 `<transition>` 相同。

```vue
<template>
	<transition-group tag="ul" name="why">
		<li v-for="item in items" :key="item.id">
			{{ item.text }}
		</li>
	</transition-group>
</template>
<style>
.why-enter-from,
.why-leave-to {
	opacity: 0;
	transfrom: translateY(30px);
}

.why-enter-active,
.why-leave-active {
	transtion: all 1s ease;
}
</style>
```

## 列表过渡的移动动画

- 虽然上面的案例中增加和删除是有动画的，但是其他需要移动的动画是没有动画的
- 我们可以通过使用一个新增的 v-move 的 class 来完成动画
- 它会在元素改变位置的过程中应用
- 像之前的名字应用，可以通过**name**来自定义前缀
- 在元素移除的时候会有问题，元素**还占据着之前的位置**，还是会一卡一卡的，所以在元素**why-leave-active**的时候添加**绝对定位**将他**移出文档流**

```vue
<template>
	<transition-group tag="ul" name="why">
		<li v-for="item in items" :key="item.id">
			{{ item.text }}
		</li>
	</transition-group>
</template>
<style>
.why-enter-from,
.why-leave-to {
	opacity: 0;
	transfrom: translateY(30px);
}

.why-enter-active,
.why-leave-active {
	transtion: all 1s ease;
}

.why-move {
	transtion: transfrom 1s ease;
}
.why-leave-active {
	position: absolute;
}
</style>
```

## 列表交替过渡的移动动画

**小技巧：可以将 index 绑定到 li 元素的 dataset 上面**

**:data-{ name } = 'value',取值 el.dataset.{ name }**

```vue
<template>
	<input v-model="value" />
	<transition-group tag="ul" name="why" :css="false" @before-enter="beforeEnter" @enter="enter" @leave="leave">
		<li v-for="(item, index) in showItems" :key="item.id" :data-index="index">
			{{ item.text }}
		</li>
	</transition-group>
</template>
<script>
import gsap from 'gasp'
export default {
	data() {
		return {
			value: '',
			items: ['axc', 'asd', 'asdsda', 'oasihhjk']
		}
	},
	computed: {
		showItems() {
			return this.items.filters((item) => item.indexOf(this.value) !== -1)
		}
	},
	methods: {
		beforeEnter(el, done) {
			el.style.opacity = 0
			el.style.height = 0
		},
		enter(el, done) {
			gsap.to(el, {
				opacity: 1,
				height: '1.5rem',
				delay: el.dataset.index * 0.5,
				onComplete: done
			})
		},
		leave(el, done) {
			gsap.to(el, {
				opacity: 0,
				height: '0',
				delay: el.dataset.index * 0.5,
				onComplete: done
			})
		}
	}
}
</script>
```

# Vue 中使用 gsap 库

https://github.com/greensock/GSAP

https://greensock.com/

使用 js 控制动画，当值是变化的时候，单纯使用 css 操控是不够的，通过 JavaScript 为 css 属性，svg，canvas 等设置动画，并且浏览器是兼容的。

```js
npm i gsap
import gsap from gsap // 局部引入,全局引入需要挂载
```

## **结合 transition 的钩子使用**

https://greensock.com/get-started/

- 当使用 jacascript 来执行过渡动画时，需要**进行 done 回调**，否则它们将会被同步调用，过渡会立刻完成
- 当我们使用 js 来控制动画的时候，如果不需要 css，那么就关闭掉，就不需要检测 css 属性了,可以提高性能

```vue
<transition mode="out-in" name="zhong" @enter="enter" @leave="enter" :css="false">
  <div v-if="true">toggled content</div>
  <div v-else>toggled content2</div>
</transition>
<script>
export default {
    data() {
        show: true,
        tranX: 200
    },
    methods: {
        enter(el, done) {
            gsap.from(el,{
                scale: 0,
                x: tranX，
                onComplete: done
            })
        },
        leave(el, done) {
            gsap.to(el,{
                scale: 0,
                x: tranX，
                onComplete: done
            })
        },
    }
}
</script>
```

## gsap 实现数字的变化

```vue
<template>
	<input v-model="couter" step="100" type="number" />
	<h2>{{ showCouter }}</h2>
	<!-- 效果都一样 -->
	<h2>{{ showNumber.toFixed(0) }}</h2>
</template>
<script>
import gsap from 'gsap'
export default {
    data() {
        couter: 0,
        showNumber: 0
    },
    computed: {
        showCouter() {
            return this.showNumber.toFixed(0) // 整数
        }
    },
    watch: {
        couter(new) {
            gsap.to(this,{
                duration: 1,
                showNumber: new
            })
        }
    }
}
</script>
```
