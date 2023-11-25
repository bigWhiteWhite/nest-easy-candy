[vue-tsx](https://cn.vuejs.org/guide/extras/render-function.html)

[vite 插件](https://cn.vitejs.dev/plugins/)

## 示例

```tsx
import { defineComponent, reactive, toRefs, provide, inject } from 'vue'
// 父组件
export default defineComponent({
	name: 'App',
	props: {},
	emits: [],
	setup(props, { attrs, emit, expose, slots }) {
		const state = reactive({})
        const reload = () => {
            console.log('注入成功')
        }
        provide('reload', reload)
		return {
			...toRefs(state)
		}
	},
	render() {
		return <div></div> // <></>
	}
})

// 子组件
export default defineComponent({
	name: 'page',
	props: {}, // 如果没有props传进来的话不要写这个选项，会有ts报错
    inject: ['reload'],
	emits: [],
	setup(props, { attrs, emit, expose, slots }) {
		const state = reactive({})
        const reload: any = inject('reload')
		return {
			...toRefs(state)，
            reload
		}
	},
	render() {
		return <div onClick={this.reload}>Text1</div>
	}
})
```

## vue 中使用 jsx 写法

这种写法需要配置 babel，Vite 在构建项目时，一般情况下会自动读取并应用 `babel.config.js` 文件中的配置。但是，Vite 默认使用 esbuild 作为其 JavaScript 编译器，这意味着 `babel.config.js` 可能不会在开发服务器或某些构建情况下被读取。

如果你在 Vite 项目中使用了一些需要 Babel 来处理的高级 JavaScript 语法或特性（例如 JSX），你可能需要通过 `esbuild` 配置项强制 Vite 使用 Babel，然而，请注意，**使用 Babel 而不是 esbuild 可能会使你的项目构建和热更新速度变慢**，因为 Babel 的编译速度通常会比 esbuild 慢。

此外，你需要确保你的 `babel.config.js` 文件正确配置并位于项目的根目录。同时，确保你已经安装了所有你在 `babel.config.js` 文件中指定的 Babel 插件和预设。

```vue
<script>
import { withModifiers, defineComponent } from 'vue'
export default defineComponent({
	setup() {
		const count = ref(0)

		const inc = () => {
			count.value++
		}
		return {
			inc,
			count
		}
	},
	render() {
		return () => <div onClick={withModifiers(this.inc, ['self'])}>{this.count.value}</div>
	}
})
</script>
```

## .vue 文件中引入 tsx 组件

就和普通的 vue 组件引入就可以了

```tsx
<template>
	<Text />
</template>

<script lang="ts" setup>
import Text from './text'
</script>
```

### h 函数

[API](https://cn.vuejs.org/api/render-function.html)

Vue 提供了一个 `h()` 函数用于创建 vnodes：

`h()` 是 **hyperscript** 的简称——意思是“能生成 HTML (超文本标记语言) 的 JavaScript”。这个名字来源于许多虚拟 DOM 实现默认形成的约定。一个更准确的名称应该是 `createVnode()`，但当你需要多次使用渲染函数时，一个简短的名字会更省力。

`h()` 函数的使用方式非常的灵活：

```ts
import { h } from 'vue'

// 除了 type 外，其他参数都是可选的
h('div')
h('div', { id: 'foo' })

// attribute 和 property 都可以用于 prop
// Vue 会自动选择正确的方式来分配它
h('div', { class: 'bar', innerHTML: 'hello' })

// class 与 style 可以像在模板中一样
// 用数组或对象的形式书写
h('div', { class: [foo, { bar }], style: { color: 'red' } })

// 事件监听器应以 onXxx 的形式书写
h('div', { onClick: () => {} })

// children 可以是一个字符串
h('div', { id: 'foo' }, 'hello')

// 没有 prop 时可以省略不写
h('div', 'hello')
h('div', [h('span', 'hello')])

// children 数组可以同时包含 vnode 和字符串
h('div', ['hello', h('span', 'hello')])
```

**示例**

```tsx
h(
	'div',
	{
		key: repay.repayName,
		class: [methodStyle['item_container'], methodStyle[repay.repayName], repayState.value.currentMethod === repay && methodStyle['active']]
	},
	[
		h('div', [
			h(
				'p',
				{
					class: methodStyle['list_title']
				},
				repay.title
			),
			repay.repayName !== 'cash' &&
				h(
					'p',
					{
						class: methodStyle['list_msg']
					},
					`Comisión de pago $ ${filterMoney(repay.showRepayFee, moneyFormat)}`
				)
		]),
		h(
			Radio,
			{
				name: repay
			},
			{
				icon: (checked) => {
					return <img class={methodStyle['img-icon']} src={checked ? main.value.chooseIcon : main.value.unChooseIcon} />
				}
			}
		)
	]
)
```

### 声明渲染函数

当组合式 API 与模板一起使用时，`setup()` 钩子的返回值是用于暴露数据给模板。然而当我们使用渲染函数时，可以直接把渲染函数返回：

```vue
<script>
import { ref, h } from 'vue'

export default {
	props: {
		/* ... */
	},
	setup(props) {
		const count = ref(1)

		// 返回渲染函数
		return () => h('div', props.msg + count.value)
	}
}
</script>
```

### 函数组件

```tsx
import { defineComponent, h, ref, renderSlot } from 'vue'
import Test from './test'
const renderComponent = ({ props }) => {
	return Array.from({ length: 100 }, (_, i) => i + 1).map((item, index) => {
		return h('div', { class: `item${index}`, ...props }, item)
	})
}
export default defineComponent({
	setup(props, { slots }) {
		return () => <div>{renderComponent({ props: { name: 'item' } })}</div>
	}
})
```

在 `setup()` 内部声明的渲染函数天生能够访问在同一范围内声明的 props 和许多响应式状态。

除了返回一个 vnode，你还可以返回字符串或数组：

```vue
<script>
export default {
	setup() {
		return () => 'hello world!'
	}
}
</script>
```

```vue
<script>
import { h } from 'vue'

export default {
	setup() {
		// 使用数组返回多个根节点
		return () => [h('div'), h('div'), h('div')]
	}
}
</script>
```

TIP

请确保返回的是一个函数而不是一个值！`setup()` 函数在每个组件中只会被调用一次，而返回的渲染函数将会被调用多次。

如果一个渲染函数组件不需要任何实例状态，为了简洁起见，它们也可以直接被声明为一个函数：

```vue
function Hello() { return 'hello world!' }
```

### component

```tsx
render() {
    return (
        this.component && (
            <Transition name='toggle' mode='out-in' appear>
                <KeepAlive>{h(resolveDynamicComponent(this.component) as any)}</KeepAlive>
                <KeepAlive>{h(this.component, { class: [this.appMain.class] })}</KeepAlive>
                {/* <KeepAlive>{b}</KeepAlive> */}
            </Transition>
        )
    )
}
```

## 传值

### 父子传值

```tsx
// 父组件
const more = {
	itemStyle: { color: 'red' }
}
h(this.component, {
	...this.more,
	class: [this.appMain.class],
	size: 'small',
	loadComponent: (page) => this.loadComponent(page)
})
// 子组件
import { CSSProperties, PropType, defineComponent, reactive, toRefs } from 'vue'
export default defineComponent({
	name: 'Child',
	props: {
		size: {
			type: [String, Number] as PropType<string | number>,
			// type: String as PropType<'left' | 'right'>,
			// type: Array as PropType<Array<string>>,
			// type: Object as PropType<IMeta>,
			// type: Object as PropType<Ref<Array<LinkOption>>>,
			// type: String as PropType<string | CSSProperties>,
			// type: Function as PropType<() => void>,
			default: 590
		},
		// 'onUpdate:value': [Function, Array] as PropType<MaybeArray<OnUpdateValue>>,
		// onUpdateValue: [Function, Array] as PropType<MaybeArray<OnUpdateValue>>,
		loadComponent: {
			type: Function as PropType<(page) => void>,
			required: true
		},
		itemStyle: {
			type: Object as PropType<{ itemStyle?: string | CSSProperties }>,
			default: () => ({})
		}
	},
	setup(props) {
		console.log('🚀 ~ file: default.tsx:7 ~ setup ~ props:', props)
		const state = reactive({})
		return {
			...toRefs(state)
		}
	},
	render() {
		return (
			<div>
				KenyaDefault <button onClick={() => this.loadComponent('test')}>btn</button>
			</div>
		)
	}
})
```

### provide 传值

```tsx
// 上司组件
import { provide } from 'vue'
provide('loadComponent', loadComponent)
// 下属组件
import { defineComponent, inject } from 'vue'
export default defineComponent({
	name: 'subordinate',
	setup(props) {
		const loadComponent: any = inject('loadComponent')
		return () => <div onClick={() => loadComponent('test')}>下属组件触发</div>
	}
})
```

### 子 emit

```tsx
// 父组件 --- 需要写上on
;<div>
	<Test onInit={() => console.log('子组件触发')}></Test>
	{/* h函数 */}
	{h(component.value, { class: [appMain.value.class], onLoadComponent: (page) => loadComponent(page) })}
</div>

// 子组件
import { defineComponent } from 'vue'
export default defineComponent({
	name: 'KenyaDefault',
	props: {},
	emits: ['loadComponent', 'init'], // 触发不需要写on
	setup(props, { emit }) {
		return () => (
			<div>
				<button onClick={() => emit('loadComponent', 'test')}>子组件触发</button>
				<button onClick={() => emit('init')}>子组件触发</button>
			</div>
		)
	}
})
```

## 获取示例

### expose; attrs;

```tsx
// 父组件
import { Ref, defineComponent, ref } from 'vue'
import Test from './test'
export default defineComponent({
	name: 'KenyaDefault',
	setup() {
		const testRef: Ref<HTMLDivElement | null> = ref(null)
		const hRef: Ref<HTMLDivElement | null> = ref(null)
		console.log('🚀 ~ file: default.tsx:9 ~ setup ~ testRef:', testRef)
		return () => (
			<div>
				<Test ref={testRef} class={'test'}></Test>
				{/* h函数渲染的组件 */}
				{h('div', { ref: hRef })}
			</div>
		)
	}
})

// 子组件
import { defineComponent, reactive } from 'vue'
export default defineComponent({
	name: 'Test',
	setup(props, { expose, attrs }) {
		const state = reactive({
			color: 'red'
		})
		expose({ state }) // expose出去才可以被ref示例获取
		return () => (
			<div>
				<span {...attrs}>子组件</span>
			</div>
		)
	}
})
```

## [插槽](https://cn.vuejs.org/guide/extras/render-function.html#rendering-slots)

### 示例

```tsx
// 爷组件
import Father from './father'
export default defineComponent({
	name: 'Father',
	setup() {
		return () => (
			<div>
				<Father>
					{
                        h('div', null, {
                            content: ({ text, showSlots }) => h('div', { onClick: () => showSlots() }, text)
                        })
                    }
				</Father>
			</div>
		)
	}
})
// 父组件
import Child from './child'
export default defineComponent({
	name: 'Father',
	setup() {
		return () => (
			<div>
				<Child>
					{{
						header: ({ text, showSlots }) => <div onClick={() => showSlots()}>{text}</div>,
						footer: ({ text, showSlots }) => <div onClick={() => showSlots()}>{text}</div>
					}}
				</Child>
                {/* 插槽中转 */}
                {h(Child, null, {
                    content: ({ text, showSlots }) => {
                        return [renderSlot(slots, 'content', { { text, showSlots } })]
                    }
                })}
				{/* h函数渲染的组件 */}
				{h(Child, null, {
					header: ({ text, showSlots }) => h('div', { onClick: () => showSlots() }, text),
					footer: ({ text, showSlots }) => h('div', { onClick: () => showSlots() }, text)
				})}
			</div>
		)
	}
})
// 子组件
export default defineComponent({
	name: 'Child',
	setup(props, { slots }) {
		const showSlots = () => {
			console.log('🚀 ~ file: test.tsx:6 ~ setup ~ slots:', slots)
		}
		return () => (
			<div>
				{slots.header?.({ text: 'header', showSlots })}
                {/* 可以用renderSlot完成中转站的概念,也就是爷组件对孙子组件的插槽 */}
                {renderSlot(slots, 'content', { text: 'content', showSlots })}
				{h('div', slots.footer?.({ text: 'footer', showSlots }))}
			</div>
		)
	}
})
```

### 渲染插槽[](https://cn.vuejs.org/guide/extras/render-function.html#rendering-slots)

在渲染函数中，插槽可以通过 `setup()` 的上下文来访问。每个 `slots` 对象中的插槽都是一个**返回 vnodes 数组的函数**：

js

```tsx
export default {
	props: ['message'],
	setup(props, { slots }) {
		return () => [
			// 默认插槽：
			// <div><slot /></div>
			h('div', slots.default()),

			// 具名插槽：
			// <div><slot name="footer" :text="message" /></div>
			h(
				'div',
				slots.footer({
					text: props.message
				})
			)
		]
	}
}
```

等价 JSX 语法：

```tsx
// 默认插槽
<div>{slots.default()}</div>

// 具名插槽
<div>{slots.footer({ text: props.message })}</div>
```

### 传递插槽[](https://cn.vuejs.org/guide/extras/render-function.html#passing-slots)

向组件传递子元素的方式与向元素传递子元素的方式有些许不同。我们需要传递一个插槽函数或者是一个包含插槽函数的对象而非是数组，插槽函数的返回值同一个正常的渲染函数的返回值一样——并且在子组件中被访问时总是会被转化为一个 vnodes 数组。

```tsx
// 单个默认插槽
h(MyComponent, () => 'hello')

// 具名插槽
// 注意 `null` 是必需的
// 以避免 slot 对象被当成 prop 处理
h(MyComponent, null, {
	default: () => 'default slot',
	foo: () => h('div', 'foo'),
	bar: () => [h('span', 'one'), h('span', 'two')]
})
```

等价 JSX 语法：

```tsx
// 默认插槽
<MyComponent>{() => 'hello'}</MyComponent>

// 具名插槽
<MyComponent>{{
  default: () => 'default slot',
  foo: () => <div>foo</div>,
  bar: () => [<span>one</span>, <span>two</span>]
}}</MyComponent>
```

插槽以函数的形式传递使得它们可以被子组件懒调用。这能确保它被注册为子组件的依赖关系，而不是父组件。这使得更新更加准确及有效。

### 内置组件[](https://cn.vuejs.org/guide/extras/render-function.html#built-in-components)

诸如 `<KeepAlive>`、`<Transition>`、`<TransitionGroup>`、`<Teleport>` 和 `<Suspense>` 等[内置组件](https://cn.vuejs.org/api/built-in-components.html)在渲染函数中必须导入才能使用：

```tsx
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
	setup() {
		return () => h(Transition, { mode: 'out-in' } /* ... */)
	}
}
```

### `v-model`[](https://cn.vuejs.org/guide/extras/render-function.html#v-model)

`v-model` 指令扩展为 `modelValue` 和 `onUpdate:modelValue` 在模板编译过程中，我们必须自己提供这些 props：

```tsx
export default {
	props: ['modelValue'],
	emits: ['update:modelValue'],
	setup(props, { emit }) {
		return () =>
			h(SomeComponent, {
				modelValue: props.modelValue,
				'onUpdate:modelValue': (value) => emit('update:modelValue', value)
			})
	}
}
```
