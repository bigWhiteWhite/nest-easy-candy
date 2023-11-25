# Vue3

## 创建 Vue3 工程

### 1.使用 vue-cli 创建

文档：https://cli.vuejs.org/zh/guide/creating-a-project.html#vue-create

```bash
## 查看@vue/cli版本，确保@vue/cli版本在4.5.0以上
vue --version
## 安装或者升级你的@vue/cli
npm install -g @vue/cli
## 创建
vue create vue_test
## 启动
cd vue_test
npm run serve
```

### 2.使用 vite 创建通用工程

官方文档：https://v3.cn.vuejs.org/guide/installation.html#vite

vite 官网：

- https://vitejs.cn
- [vite2](https://vitejs.cn)

- https://cn.vitejs.dev/

- 什么是 vite？—— 新一代前端构建工具。
- 优势如下：
  - 开发环境中，无需打包操作，可快速的冷启动。
  - 轻量快速的热重载（HMR）。
  - 真正的按需编译，不再等待整个应用编译完成。

```bash
#vite2
npm init vite@latest
#vite3
npm create vite@latest
#vite2/3 yarn
yarn create vite

## 创建工程
npm init vite-app <project-name>
npm init vite@latest my-project --template vue --use vue-router,axios
## 进入工程目录
cd <project-name>
## 安装依赖
npm install
## 运行
npm run dev

## 选择ts
yarn create @vuejs/app
yarn add vue-router@4
yarn add axios
```

- 优势如下：
  - 开发环境中，无需打包操作，可快速的冷启动。
  - 轻量快速的热重载（HMR）。
  - 真正的按需编译，不再等待整个应用编译完成。
- 传统构建 与 vite 构建对比图

<img src="Vue3.assets/bundler.37740380.png" style="width:500px;height:280px;float:left">

### 3.使用 create-vue 脚手架

```bash
npm init vue@latest
```

## setup 语法糖

```vue
<template>
	<div class="bg-red-500">
		<Abc />
		<div v-click-outside />
	</div>
</template>

<script setup="props, { emit }" lang="ts">
import Abc from '@components/Abc.vue' //直接导入组件
import { directive as clickOutside } from 'v-click-outside' //直接导入指令
import { watchEffect } from 'vue'

watchEffect(() => console.log(props.msg))
emit('foo')
const props = defineProps({
	foo: String
})
</script>
<style lang="scss" scoped></style>
```

### props

```vue
<template>
	<button @click="emitEvent"></button>
</template>
<script setup lang="ts">
import { defineProps, defineEmit, withDefaults } from 'vue'

const props = defineProps({
    message: {
        type: String,
        default: "哈哈哈"
    }
})
// 或者

const props = withDefaults(
	defineProps<{
        width?: string,
    }>(),
    {
        width: '100px'
    }
)

const emits = defineEmit({"add", "delete"})

const emitEvent = () => {
    emits('add', 1000)
}
</script>
```

## 常用 Composition API

官方文档: https://v3.cn.vuejs.org/guide/composition-api-introduction.html

## 1.拉开序幕的 setup

1. 理解：Vue3.0 中一个新的配置项，值为一个函数。
2. setup 是所有<strong style="color:#DD5145">Composition API（组合 API）</strong><i style="color:gray;font-weight:bold">“ 表演的舞台 ”</i>。
3. 组件中所用到的：数据、方法等等，均要配置在 setup 中。
4. setup 函数的两种返回值：
   1. 若返回一个对象，则对象中的属性、方法, 在模板中均可以直接使用。
   2. 若返回一个渲染函数：则可以自定义渲染内容。（了解）
5. 注意点：
   1. 尽量不要与 Vue2.x 配置混用
      - Vue2.x 配置（data、methos、computed...）中<strong style="color:#DD5145">可以访问到</strong>setup 中的属性、方法。
      - 但在 setup 中<strong style="color:#DD5145">不能访问到</strong>Vue2.x 配置（data、methos、computed...）。
      - 如果有重名, setup 优先。
   2. setup 不能是一个 async 函数，因为 async 函数返回值不再是 return 的对象, 而是 promise, 模板看不到 return 对象中的属性。（后期也可以返回一个 Promise 实例，但需要 Suspense 和异步组件的配合）

### setup 参数

#### props

- `props`,`setup` 函数中的 `props` 是响应式的，当传入新的 prop 时，它将被更新。

  - 但是，因为 `props` 是响应式的，你**不能使用 ES6 解构**，它会消除 prop 的响应性。
  - 如果**需要解构 props**，可以在 `setup` 函数中使用 [`toRefs`](https://v3.cn.vuejs.org/guide/reactivity-fundamentals.html#响应式状态解构) 函数来完成此操作
  - 在 template 中依然可以使用 props 中的属性，比如 message
  - 对于 props 的类型，还是和之前的规则是一样的，在 props 中去定义
  - 在 setup 中不能使用 this 来获取 props，而是使用参数的形式获取

```js
// MyBook.vue
export default {
	props: {
		title: String
	},
	setup(props) {
		const { title } = toRefs(props)
		console.log(props.title)
	}
}
```

#### context

- `context`传递给 `setup` 函数的第二个参数是 `context`。
  - `context` 是一个普通 JavaScript 对象，暴露了其它可能在 `setup` 中有用的值
  - `context` 是一个普通的 JavaScript 对象，也就是说，它不是响应式的，这意味着你可以安全地对 `context` 使用 ES6 解构。

```js
// MyBook.vue

export default {
  setup(props, context) {
    // Attribute (非响应式对象，等同于 $attrs)
    console.log(context.attrs)

    // 插槽 (非响应式对象，等同于 $slots)
    console.log(context.slots)

    // 触发事件 (方法，等同于 $emit)
    console.log(context.emit)

    // 暴露公共 property (函数)
    console.log(context.expose)
  }
}

export dafault {
    setup(props, { emit, attrs, slots }) {
        // console.log( attrs.id, attrs.class )
    }
}
```

## 2.ref 函数

- 作用: 定义一个响应式的数据

- 语法: `const xxx = ref(initValue)`

  - 创建一个包含响应式数据的<strong style="color:#DD5145">引用对象（reference 对象，简称 ref 对象）</strong>。

  - JS 中操作数据： `xxx.value`

  - **模板中读取数据: 不需要.value**，直接：`<div>{{xxx}}</div>`

    ![image-20220215234914273](Vue3.assets/image-20220215234914273.png)

    （reference 引用 implement 实现）

  - JS 中操作数据：必须是`xxx.value`

  - 模板中读取数据: 不需要.value，直接：`<div>{{xxx}}</div>`

- 备注：

  - 接收的数据可以是：基本类型、也可以是对象类型。
  - 基本类型的数据：响应式依然是靠`Object.defineProperty()`的`get`与`set`完成的。
  - 对象类型的数据：内部 <i style="color:gray;font-weight:bold">“ 求助 ”</i> 了 Vue3.0 中的一个新函数—— `reactive`函数。
  - 如果**需要解构 ref**，可以在 `setup` 函数中使用 [`toRefs`](https://v3.cn.vuejs.org/guide/reactivity-fundamentals.html#响应式状态解构) 函数来完成此操作

在介绍 `setup` 函数时，我们使用了 `ref` 函数包装了一个响应式的数据对象，这里表面上看上去跟 `reactive` 好像功能一模一样啊，确实差不多，因为 `ref` 就是通过 `reactive` 包装了一个对象 ，然后是将值传给该对象中的 `value` 属性，这也就解释了为什么每次访问时我们都需要加上 `.value`

我们可以简单地把 `ref(obj)` 理解为这个样子 `reactive({value: obj})`

这里我们写一段代码来具体看一下

```html
<script>
	import { ref, reactive } from 'vue'
	export default {
		name: 'App',
		setup() {
			const obj = { count: 3 }
			const state1 = ref(obj)
			const state2 = reactive(obj)

			console.log(state1)
			console.log(state2)
		}
	}
</script>
```

来看一下打印结果

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201118122406844.png?x-oss-process=image)

> **注意：** 这里指的 `.value` 是在 `setup` 函数中访问 `ref` 包装后的对象时才需要加的，在 `template` 模板中访问时是不需要的，因为在编译时，会自动识别其是否为 `ref` 包装过的

那么我们到底该如何选择 `ref` 和 `reactive` 呢？

**建议：**

1. 基本类型值（`String` 、`Nmuber` 、`Boolean` 等）或单值对象（类似像 `{count: 3}` 这样只有一个属性值的对象）使用 `ref`
2. 引用类型值（`Object` 、`Array`）使用 `reactive`

## 3.reactive 函数

- 作用: 定义一个<strong style="color:#DD5145">对象类型</strong>的响应式数据（基本类型不要用它，要用`ref`函数）
- 语法：`const 代理对象= reactive(源对象)`接收一个对象（或数组），返回一个<strong style="color:#DD5145">代理对象（Proxy 的实例对象，简称 proxy 对象）</strong>
- reactive 定义的响应式数据是“深层次的”。
- 内部基于 ES6 的 Proxy 实现，通过代理对象操作源对象内部数据进行操作。
- 使用 reactive 函数处理我们的数据之后，数据被**再次使用时**就会**进行依赖收集**
- 当数据发生改变时，所有**收集到的依赖**都是**进行对应的响应式操作**(比如更新界面)
- 事实上，我们编写的**data 选项**，也是在内部**交给了 reactive 函数**将其变成响应式对象
- **不要对 reactive 创建的对象使用 ES6 解构赋值，会失去响应式**
- 如果**需要解构 reactived**，可以在 `setup` 函数中使用 [`toRefs`](https://v3.cn.vuejs.org/guide/reactivity-fundamentals.html#响应式状态解构) 函数来完成此操作

`reactive` 方法是用来创建一个响应式的数据对象，该 API 也很好地解决了 Vue2 通过 `defineProperty` 实现数据响应式的缺陷

用法很简单，只需将数据作为参数传入即可，代码如下

```vue
<template>
	<div id="app">
		<!-- 4. 访问响应式数据对象中的 count  -->
		{{ count }}
	</div>
</template>

<script>
// 1. 从 vue 中导入 reactive
import {reactive} from 'vue'
export default {
  name: 'App',
  setup() {
    const msg = ref('Hello World！')
      // 2. 创建响应式的数据对象
    const state = reactive({
        count: 3，
        msg // 将ref放入reactive中时，会进行解包所有深层的 refs，同时维持 ref 的响应性
    })
    const { count } = toRefs(state) // 解构依然是响应式
    // ref 会被解包
    console.log(state.msg === msg.value) // true

    // 它会更新 `obj.count`
    msg = 'no bad'
    console.log(mag.value) // no bad
    console.log(state.msg) // no bad

    // 它也会更新 `count` ref
    state.msg = 'good'
    console.log(state.msg) // good
    console.log(msg.value) // good

    // 3. 将响应式数据对象state return 出去，供template使用
    return {
        ...toRefs(state) //直接暴露
    }
  }
}
</script>
```

## 4.Vue3.0 中的响应式原理

### vue2.x 的响应式

- 实现原理：

  - 对象类型：通过`Object.defineProperty()`对属性的读取、修改进行拦截（数据劫持）。

  - 数组类型：通过重写更新数组的一系列方法来实现拦截。（对数组的变更方法进行了包裹）。

    ```js
    Object.defineProperty(data, 'count', {
    	get() {},
    	set() {}
    })
    ```

- 存在问题：

  - 新增属性、删除属性, 界面不会更新。
  - 直接通过下标修改数组, 界面不会自动更新。

### Vue3.0 的响应式

- 实现原理:

  - 通过 Proxy（代理）: 拦截对象中任意属性的变化, 包括：属性值的读写、属性的添加、属性的删除等。

  - 通过 Reflect（反射）: 对源对象的属性进行操作。

  - MDN 文档中描述的 Proxy 与 Reflect：

    - Proxy：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy

    - Reflect：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect

      ```js
      new Proxy(data, {
      	// 拦截读取属性值
      	get(target, prop) {
      		return Reflect.get(target, prop)
      	},
      	// 拦截设置属性值或添加新属性
      	set(target, prop, value) {
      		return Reflect.set(target, prop, value)
      	},
      	// 拦截删除属性
      	deleteProperty(target, prop) {
      		return Reflect.deleteProperty(target, prop)
      	}
      })

      proxy.name = 'tom'
      ```

## 5.reactive 对比 ref

- 从定义数据角度对比：
  - ref 用来定义：<strong style="color:#DD5145">基本类型数据</strong>。
  - reactive 用来定义：<strong style="color:#DD5145">对象（或数组）类型数据</strong>。
  - 备注：ref 也可以用来定义<strong style="color:#DD5145">对象（或数组）类型数据</strong>, 它内部会自动通过`reactive`转为<strong style="color:#DD5145">代理对象</strong>。
- 从原理角度对比：
  - ref 通过`Object.defineProperty()`的`get`与`set`来实现响应式（数据劫持）。
  - reactive 通过使用<strong style="color:#DD5145">Proxy</strong>来实现响应式（数据劫持）, 并通过<strong style="color:#DD5145">Reflect</strong>操作<strong style="color:orange">源对象</strong>内部的数据。
- 从使用角度对比：
  - ref 定义的数据：操作数据<strong style="color:#DD5145">需要</strong>`.value`，读取数据时模板中直接读取<strong style="color:#DD5145">不需要</strong>`.value`。
  - reactive 定义的数据：操作数据与读取数据：<strong style="color:#DD5145">均不需要</strong>`.value`。

## 6.setup 的两个注意点

```html
<!--子组件可以使用 $emit 触发父组件的自定义事件。-->
<child @child="gogo(data)"></child
><!--父组件-->
gogo(data){console.log(data)}

<!--子组件-->
<script lang="ts">
	setup(prop,{emit}){
	    const methods = {
	        go(){
	            emit("child",data)
	        }
	    }
	}
</script>
```

- setup 执行的时机

  - 在 beforeCreate 之前执行一次，this 是 undefined。

- setup 的参数

  - props：值为对象，包含：组件外部传递过来，且组件内部声明接收了的属性。

  - context：上下文对象

    - attrs: 值为对象，包含：组件外部传递过来，但没有在 props 配置中声明的属性, 相当于 `this.$attrs`。

    - slots: 收到的插槽内容, 相当于 `this.$slots`,v-slot:as。

    - emit: 分发自定义事件的函数, 相当于 `this.$emit`。

    - **使用 emit 需要在子组件配置**`emits:['eventName']`

    - ```js
      //<my-modal/>
      export default defineComponent ({
              props:{//组件外传进来的数据
                  isShow:Boolean
              },
              emits:{//组件外传进来的事件
                  "my-close":null
              },
              setup(props,{emit}){
                  const btnclose = ()=>{
                      emit("my-close")
                  }
                  return{
                      btnclose
                  }
              }
      })

      <my-modal @my-close="myModealHide" :isShow="myModalShow">my model hehe</my-modal>
      //...
       setup() {
          const Show = ref(false)
          const myModealHide=()=>{
            Show.value=false
          }
          return {
            myModealHide,
          }
        }
      ```

## 7.计算属性与监视

### 1.computed 函数

- 与 Vue2.x 中 computed 配置功能一致

- 写法

  ```js
  import {computed} from 'vue'

  setup(){
      ...
  	//计算属性——简写
      let fullName = computed(()=>{
          return person.firstName + '-' + person.lastName
      })
      //计算属性——完整
      let fullName = computed({
          get(){
              return person.firstName + '-' + person.lastName
          },
          set(value){
              const nameArr = value.split('-')
              person.firstName = nameArr[0]
              person.lastName = nameArr[1]
          }
      })
  }
  ```

### 2.watch 函数

`watch` 和 `watchEffect` 都是用来监视某项数据变化从而执行指定的操作的，但用法上还是有所区别

- watch 需要侦听特定的数据源，并在回调函数中执行副作用

- 默认情况下它是**惰性**的，只有当被侦听的源发生变化时才会执行回调

- 与 watchEffect 的比较，watch 允许我们

  - 懒执行副作用(第一次不会直接执行)
  - 更具体的说明当那些状态发生变化时，触发侦听器的执行
  - 访问侦听状态变化前后的值

  **watch**：watch( source, cb, [options] )

  参数说明：

- source：可以是表达式或函数，用于指定监听的依赖对象

- cb：依赖对象变化后执行的回调函数

- options：可参数，可以配置的属性有 immediate（立即触发回调函数）、deep（深度监听）

- 与 Vue2.x 中 watch 配置功能一致

- 两个小“坑”：

  - 监视 reactive 定义的响应式数据时：oldValue 无法正确获取、强制开启了深度监视（deep 配置失效）。
  - 监视 reactive 定义的响应式数据中某个属性时：deep 配置有效。

- watch 侦听函数的数据源有两种类型

  - 一个**getter 函数**：但是该 getter 函数必须引用可响应式的对象(比如 reactive 或者 ref)
  - 直接写入一个可响应式的对象，ref 或者 reactive
  - 如果是一个**reactive**的对象的侦听，**需要使用 getter 函数，并且对可响应对象进行解构**，因为无法正确获取 oldValue，而且获取到的 newValue 和 oldValue 本身都是**proxy 对象**，ref 获取到的是**value 值**

  ```js
  //情况一：监视ref定义的响应式数据
  watch(
  	sum,
  	(newValue, oldValue) => {
  		console.log('sum变化了', newValue, oldValue)
  	},
  	{ immediate: true }
  )

  //情况二：监视多个ref定义的响应式数据
  watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  	/* ... */
  })

  /* 情况三：监视reactive定义的响应式数据
  			若watch监视的是reactive定义的响应式数据，则无法正确获得oldValue！！
  			若watch监视的是reactive定义的响应式数据，则强制开启了深度监视 
  */
  watch(
  	person,
  	(newValue, oldValue) => {
  		console.log('person变化了', newValue, oldValue)
  	},
  	{ immediate: true, deep: false }
  ) //此处的deep配置不再奏效

  //情况四：监视reactive定义的响应式数据中的某个属性
  // 侦听器数据源可以是一个具有返回值的 getter 函数，也可以直接是一个 ref：
  watch(
  	() => person.job,
  	(newValue, oldValue) => {
  		console.log('person的job变化了', newValue, oldValue)
  	},
  	{ immediate: true, deep: true }
  )
  // 侦听一个 getter
  const state = reactive({ count: 0 })
  watch(
  	() => state.count,
  	(count, prevCount) => {
  		/* ... */
  	}
  )

  //情况五：监视reactive定义的响应式数据中的某些属性
  watch(
  	[() => person.job, () => person.name],
  	(newValue, oldValue) => {
  		console.log('person的job变化了', newValue, oldValue)
  	},
  	{ immediate: true, deep: true }
  )

  //特殊情况
  watch(
  	() => person.job,
  	(newValue, oldValue) => {
  		console.log('person的job变化了', newValue, oldValue)
  	},
  	{ deep: true }
  ) //此处由于监视的是reactive素定义的对象中的某个属性，所以deep配置有效
  ```

### 3.watchEffect 函数

- watch 的套路是：既要指明监视的属性，也要指明监视的回调。

- **自动收集响应式的依赖**

- watchEffect 的套路是：不用指明监视哪个属性，监视的回调中用到哪个属性，那就监视哪个属性。

- watchEffect 有点像 computed：

  - 但 computed 注重的计算出来的值（回调函数的返回值），所以必须要写返回值。
  - **默认情况下，立刻执行一次监听**
  - 而 watchEffect 更注重的是过程（回调函数的函数体），所以不用写返回值。

  ```js
  //watchEffect所指定的回调中用到的数据只要发生变化，则直接重新执行回调。
  const stop = watchEffect(() => {
  	const x1 = sum.value
  	const x2 = person.age
  	console.log('watchEffect配置的回调执行了')
  })

  setimeout(() => {
  	stop() // 停止监听
  }, 1000)
  ```

#### **watchEffect 清除副作用**

- 在开发中我们需要侦听函数中执行网络请求，但是网络请求还没有达到的时候，我们停止了侦听器，或者侦听函数被再次执行了

- 那么上一次的网络请求应该被取消掉，这个时候我们就可以清除上一次的副作用

- 在我们给 watchEffect 传入的函数被回调时，其实可以获取到一个参数：**onInvalidate**

  - 当副作用即将重新执行或者侦听器被停止时会执行该函数传入的回调函数
  - 我们可以在回调函数中，执行一些清除工作

```js
const stop = watchEffect((onInvalidate) => {
	onInvalidate(() => {
		// stop axios 或者停止定时器
	})
})
```

#### watchEffect 执行时机

- pre post sync(不推荐使用)

- 函数默认执行时机是立刻执行，**pre**

- 函数执行时机是**Dom 挂载完毕**以后在执行，post

- 强制效果始终同步触发，然而这是低效的，很少需要

```js
watchEffect(() => {}, {
	flush: 'post'
})
```

## 8.生命周期

<strong>vue3.0 的生命周期</strong>

- Vue3.0 中可以继续使用 Vue2.x 中的生命周期钩子，但有有两个被更名：
  - `beforeDestroy`改名为 `beforeUnmount`
  - `destroyed`改名为 `unmounted`
- Vue3.0 也提供了 Composition API 形式的生命周期钩子，与 Vue2.x 中钩子对应关系如下：
  - `beforeCreate`===>相当于`setup()`
  - `created`=======>相当于`setup()`
  - `beforeMount` ===>`onBeforeMount`
  - `mounted`=======>`onMounted`
  - `beforeUpdate`===>`onBeforeUpdate`
  - `updated` =======>`onUpdated`
  - `beforeUnmount` ==>`onBeforeUnmount`
  - `unmounted` =====>`onUnmounted`

Vue3 的这些生命周期调用也很简单，同样是先从 `vue` 中导入，再进行直接调用

```html
<template>
	<div id="app"></div>
</template>

<script>
	// 1. 从 vue 中引入 多个生命周期函数
	import { onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, unMounted } from 'vue'
	export default {
		name: 'App',
		setup() {
			onBeforeMount(() => {
				// 在挂载前执行某些代码
			})

			onMounted(() => {
				// 在挂载后执行某些代码
			})

			onBeforeUpdate(() => {
				// 在更新前前执行某些代码
			})

			onUpdated(() => {
				// 在更新后执行某些代码
			})

			onBeforeUnmount(() => {
				// 在组件销毁前执行某些代码
			})

			unMounted(() => {
				// 在组件销毁后执行某些代码
			})

			return {}
		}
	}
</script>
```

### onRenderTracked 和 onRenderTriggered 钩子函数使用

这两个钩子函数是`Vue3.x`版本新加的两个钩子函数，官方说是用来调试使用的，但是目前还没有给出具体的调试案例。

### 对新旧钩子函数的使用原则

Vue 官方的文档里，明确指出了。如果你使用 Vue3，请尽量使用新的生命周期钩子函数，也就是 P06 节写在`setup()`函数中带`on`的这些钩子函数。

### onRenderTracked 状态跟踪

`onRenderTracked`直译过来就是`状态跟踪`，它会跟踪页面上所有响应式变量和方法的状态，也就是我们用`return`返回去的值，它都会跟踪。只要页面有`update`的情况，它就会跟踪，然后生成一个`event`对象，我们通过`event`对象来查找程序的问题所在。

使用`onRenderTracked`同样要使用`import`进行引入。

```js
import { .... ,onRenderTracked,} from "vue";
```

引用后就可以在`setup()`函数中进行引用了。

```js
onRenderTracked((event) => {
	console.log('状态跟踪组件----------->')
	console.log(event)
})
```

在组件没有更新的时候`onRenderTracked`是不会执行的，组件更新时，它会跟组里边每个值和方法的变化。

### onRenderTriggered 状态触发

`onRenderTriggered`直译过来是`状态触发`，它不会跟踪每一个值，而是给你变化值的信息，并且新值和旧值都会给你明确的展示出来。

如果把`onRenderTracked`比喻成散弹枪，每个值都进行跟踪，那`onRenderTriggered`就是狙击枪，只精确跟踪发生变化的值，进行针对性调试。

使用它同样要先用`import`进行引入

```js
import { .... ,onRenderTriggered,} from "vue";
```

在使用`onRenderTriggered`前，记得注释相应的`onRenderTracked`代码，这样看起来会直观很多。 然后把`onRenderTriggered()`函数，写在`setup()`函数里边。

```js
onRenderTriggered((event) => {
	console.log('状态触发组件--------------->')
	console.log(event)
})
```

对 event 对象属性的详细介绍：

```js
- key 那边变量发生了变化
- newValue 更新后变量的值
- oldValue 更新前变量的值
- target 目前页面中的响应变量和函数
```

通过这些你能很好的对代码进行调试。这些调试用的钩子函数，如果你能正确合理的使用，是真的可以快速解决问题的。

## 9.自定义 hook 函数

- 约定俗成的 hooks 函数和 hooks 文件名命名为 use 开头

- 什么是 hook？—— 本质是一个函数，把 setup 函数中使用的 Composition API 进行了封装。

- 类似于 vue2.x 中的 mixin。

- 自定义 hook 的优势: 复用代码, 让 setup 中的逻辑更清楚易懂。

- ```js
  import { ref, computed } from 'vue'
  export default const useCounter = () => {
      const counter = ref(0)
      const doubleCounter = computed(() => counter.value * 2)
      return {
          counter, doubleCounter
      }
  }

  // 引入
  import useCounter from '@/hooks/useCounter'
  setup() {
      // const { counter, doubleCounter } from useCounter
      // 如果只是模板使用，也可以直接return出去
      return {
          ...useCounter()
      }
  }
  ```

## 10.toRef

- 作用：创建一个 ref 对象，其 value 值指向另一个对象中的某个属性。
- 语法：`const name = toRef(person,'name')`
- 应用: 要将响应式对象中的某个属性单独提供给外部使用时。

- 扩展：`toRefs` 与`toRef`功能一致，但可以批量创建多个 ref 对象，语法：`toRefs(person)`

`toRef` 是将某个对象中的某个值转化为响应式数据，其接收两个参数，第一个参数为 `obj` 对象；第二个参数为对象中的属性名

代码如下：

```html
<script>
	// 1. 导入 toRef
	import { toRef } from 'vue'
	export default {
		setup() {
			const obj = { count: 3 }
			// 2. 将 obj 对象中属性count的值转化为响应式数据
			const state = toRef(obj, 'count')

			// 3. 将toRef包装过的数据对象返回供template使用
			return { state }
		}
	}
</script>
```

但其实表面上看上去 `toRef` 这个 API 好像非常的没用，因为这个功能也可以用 `ref` 实现，代码如下

```html
<script>
	// 1. 导入 ref
	import { ref } from 'vue'
	export default {
		setup() {
			const obj = { count: 3 }
			// 2. 将 obj 对象中属性count的值转化为响应式数据
			const state = ref(obj.count)

			// 3. 将ref包装过的数据对象返回供template使用
			return { state }
		}
	}
</script>
```

乍一看好像还真是，其实这两者是有区别的，我们可以通过一个案例来比较一下，代码如下

```html
<template>
	<p>{{ state1 }}</p>
	<button @click="add1">增加</button>

	<p>{{ state2 }}</p>
	<button @click="add2">增加</button>
</template>

<script>
	import { ref, toRef } from 'vue'
	export default {
		setup() {
			const obj = { count: 3 }
			const state1 = ref(obj.count)
			const state2 = toRef(obj, 'count')

			function add1() {
				state1.value++
				console.log('原始值：', obj)
				console.log('响应式数据对象：', state1)
			}

			function add2() {
				state2.value++
				console.log('原始值：', obj)
				console.log('响应式数据对象：', state2)
			}

			return { state1, state2, add1, add2 }
		}
	}
</script>
```

我们分别用 `ref` 和 `toRef` 将 `obj` 中的 `count` 转化为响应式，并声明了两个方法分别使 `count` 值增加，每次增加后打印一下原始值 `obj` 和被包装过的响应式数据对象，同时还要看看视图的变化

**ref：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201118131536584.gif#pic_center) 可以看到，在对响应式数据的值进行 `+1` 操作后，视图改变了，原始值未改变，响应式数据对象的值也改变了，这说明 `ref` 是对原数据的一个**拷贝**，不会影响到原始值，同时响应式数据对象值改变后会同步更新视图

**toRef：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201118131948827.gif#pic_center) 可以看到，在对响应式数据的值进行 `+1` 操作后，视图未发生改变，原始值改变了，响应式数据对象的值也改变了，这说明 `toRef` 是对原数据的一个**引用**，会影响到原始值，但是响应式数据对象值改变后会不会更新视图

**总结：**

1. `ref` 是对传入数据的拷贝；`toRef` 是对传入数据的引用
2. `ref` 的值改变会更新视图；`toRef` 的值改变不会更新视图

## 11.toRefs

了解完 `toRef` 后，就很好理解 `toRefs` 了，其作用就是将传入的对象里所有的属性的值都转化为响应式数据对象，该函数支持一个参数，即 `obj` 对象

我们来看一下它的基本使用

```html
<script>
	// 1. 导入 toRefs
	import { toRefs } from 'vue'
	export default {
		setup() {
			const obj = {
				name: '前端印象',
				age: 22,
				gender: 0
			}
			// 2. 将 obj 对象中属性count的值转化为响应式数据
			const state = toRefs(obj)

			// 3. 打印查看一下
			console.log(state)
		}
	}
</script>
```

打印结果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201118132812793.png#pic_center) 返回的是一个对象，对象里包含了每一个包装过后的响应式数据对象

# 三、其它 Composition API

## 1.shallowReactive

- shallowReactive：只处理对象最外层属性的响应式（浅响应式）。
- 什么时候使用?
  - 如果有一个对象数据，结构比较深, 但变化时只是外层属性变化 ===> shallowReactive。
  - 如果有一个对象数据，后续功能不会修改该对象中的属性，而是生新的对象来替换 ===> shallowRef。

听这个 API 的名称就知道，这是一个渐层的 `reactive`，难道意思就是原本的 `reactive` 是深层的呗，没错，这是一个用于性能优化的 API

其实将 `obj` 作为参数传递给 `reactive` 生成响应式数据对象时，若 `obj` 的层级不止一层，那么会将每一层都用 `Proxy` 包装一次，我们来验证一下

```html
<script>
	import { reactive } from 'vue'
	export default {
		setup() {
			const obj = {
				a: 1,
				first: {
					b: 2,
					second: {
						c: 3
					}
				}
			}

			const state = reactive(obj)

			console.log(state)
			console.log(state.first)
			console.log(state.first.second)
		}
	}
</script>
```

来看一下打印结果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201118134158778.png#pic_center) 设想一下如果一个对象层级比较深，那么每一层都用 `Proxy` 包装后，对于性能是非常不友好的

接下来我们再来看看 `shallowReactive`

```html
<script>
	import { shallowReactive } from 'vue'
	export default {
		setup() {
			const obj = {
				a: 1,
				first: {
					b: 2,
					second: {
						c: 3
					}
				}
			}

			const state = shallowReactive(obj)

			console.log(state)
			console.log(state.first)
			console.log(state.first.second)
		}
	}
</script>
```

来看一下打印结果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201118134358346.png#pic_center) 结果非常的明了了，只有第一层被 `Proxy` 处理了，也就是说只有修改第一层的值时，才会响应式更新，代码如下：

```html
<template>
	<p>{{ state.a }}</p>
	<p>{{ state.first.b }}</p>
	<p>{{ state.first.second.c }}</p>
	<button @click="change1">改变1</button>
	<button @click="change2">改变2</button>
</template>
<script>
	import { shallowReactive } from 'vue'
	export default {
		setup() {
			const obj = {
				a: 1,
				first: {
					b: 2,
					second: {
						c: 3
					}
				}
			}

			const state = shallowReactive(obj)

			function change1() {
				state.a = 7
			}

			function change2() {
				state.first.b = 8
				state.first.second.c = 9
				console.log(state)
			}

			return { state }
		}
	}
</script>
```

来看一下具体过程：

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020111814184662.gif#pic_center) 首先我们点击了第二个按钮，改变了第二层的 `b` 和第三层的 `c`，虽然值发生了改变，但是视图却没有进行更新；

当我们点击了第一个按钮，改变了第一层的 `a` 时，整个视图进行了更新；

由此可说明，`shallowReactive` 监听了第一层属性的值，一旦发生改变，则更新视图

## 2.shallowRef

shallowRef：只处理基本数据类型的响应式, 不进行对象的响应式处理。

- 什么时候使用?
  - 如果有一个对象数据，结构比较深, 但变化时只是外层属性变化 ===> shallowReactive。
  - 如果有一个对象数据，后续功能不会修改该对象中的属性，而是生新的对象来替换 ===> shallowRef。

这是一个浅层的 `ref`，与 `shallowReactive` 一样是拿来做性能优化的

`shallowReactive` 是监听对象第一层的数据变化用于驱动视图更新，那么 `shallowRef` 则是监听 `.value` 的值的变化来更新视图的

我们来看一下具体代码

```html
<template>
	<p>{{ state.a }}</p>
	<p>{{ state.first.b }}</p>
	<p>{{ state.first.second.c }}</p>
	<button @click="change1">改变1</button>
	<button @click="change2">改变2</button>
</template>

<script>
	import { shallowRef } from 'vue'
	export default {
		setup() {
			const obj = {
				a: 1,
				first: {
					b: 2,
					second: {
						c: 3
					}
				}
			}

			const state = shallowRef(obj)
			console.log(state)

			function change1() {
				// 直接将state.value重新赋值
				state.value = {
					a: 7,
					first: {
						b: 8,
						second: {
							c: 9
						}
					}
				}
			}

			function change2() {
				state.value.first.b = 8
				state.value.first.second.c = 9
				console.log(state)
			}

			return { state, change1, change2 }
		}
	}
</script>
```

首先看一下被 `shallowRef` 包装过后是怎样的结构

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201119112420368.png?x-oss-process=image) 然后再来看看改变其值会有什么变化

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201119112840682.gif#pic_center) 我们先点击了第二个按钮，发现数据确实被改变了，但是视图并没随之更新；

于是点击了第一个按钮，即将整个 `.value` 重新赋值了，视图就立马更新了

这么一看，未免也太过麻烦了，改个数据还要重新赋值，不要担心，此时我们可以用到另一个 API，叫做 `triggerRef` ，调用它就可以立马更新视图，其接收一个参数 `state` ，即需要更新的 `ref` 对象

我们来使用一下

```html
<template>
	<p>{{ state.a }}</p>
	<p>{{ state.first.b }}</p>
	<p>{{ state.first.second.c }}</p>
	<button @click="change">改变</button>
</template>

<script>
	import { shallowRef, triggerRef } from 'vue'
	export default {
		setup() {
			const obj = {
				a: 1,
				first: {
					b: 2,
					second: {
						c: 3
					}
				}
			}

			const state = shallowRef(obj)
			console.log(state)

			function change() {
				state.value.first.b = 8
				state.value.first.second.c = 9
				// 修改值后立即驱动视图更新
				triggerRef(state)
				console.log(state)
			}

			return { state, change }
		}
	}
</script>
```

我们来看一下具体过程

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201119113821279.gif#pic_center) 可以看到，我们没有给 `.value` 重新赋值，只是在修改值后，调用了 `triggerRef` 就实现了视图的更新

## readonly

- readonly: 让一个响应式数据变为只读的（深只读）。
- 读应用场景: 别人传给你的响应式数据不希望数据被修改时。
- 在某些场景下，我们传入给其他地方(组件)的这个响应式对象希望在另外一个地方(组件)被使用，但是不能被修改
- readonly 会返回**原生对象的只读代理**(也就是它依然是一个 Proxy，但是 proxy 的**set 方法被劫持**)，并且不能对其进行修改。

```js
const original = reactive({ count: 0 })

const copy = readonly(original)

watchEffect(() => {
	// 用于响应性追踪
	console.log(copy.count)
})

// 变更 original 会触发依赖于副本的侦听器
original.count++

// 变更副本将失败并导致警告
copy.count++ // 警告!
```

与 [`reactive`](https://v3.cn.vuejs.org/api/basic-reactivity.html#reactive) 一样，如果任何 property 使用了 `ref`，当它通过代理访问时，则被自动解包：

```js
const raw = {
	count: ref(123)
}

const copy = readonly(raw)

console.log(raw.count.value) // 123
console.log(copy.count) // 123
```

- ## toRaw

- 作用：将一个由`reactive`生成的<strong style="color:orange">响应式对象</strong>转为<strong style="color:orange">普通对象</strong>。

- 使用场景：用于读取响应式对象对应的普通对象，对这个普通对象的所有操作，不会引起页面更新。

`toRaw` 方法是用于获取 `ref` 或 `reactive` 对象的原始数据的

先来看一段代码

```html
<template>
	<p>{{ state.name }}</p>
	<p>{{ state.age }}</p>
	<button @click="change">改变</button>
</template>

<script>
	import { reactive } from 'vue'
	export default {
		setup() {
			const obj = {
				name: '前端印象',
				age: 22
			}

			const state = reactive(obj)

			function change() {
				state.age = 90
				console.log(obj) // 打印原始数据obj
				console.log(state) // 打印 reactive对象
			}

			return { state, change }
		}
	}
</script>
```

来看看具体过程

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201119120334341.gif#pic_center) 我们改变了 `reactive` 对象中的数据，于是看到原始数据 `obj` 和被 `reactive` 包装过的对象的值都发生了变化，由此我们可以看出，这两者是一个引用关系

那么此时我们就想了，那如果直接改变原始数据 `obj` 的值，会怎么样呢？答案是： `reactive` 的值也会跟着改变，但是视图不会更新

由此可见，当我们想修改数据，但不想让视图更新时，可以选择直接修改原始数据上的值，因此需要先获取到原始数据，我们可以使用 Vue3 提供的 `toRaw` 方法

`toRaw` 接收一个参数，即 `ref` 对象或 `reactive` 对象

```html
<script>
	import { reactive, toRaw } from 'vue'
	export default {
		setup() {
			const obj = {
				name: '前端印象',
				age: 22
			}

			const state = reactive(obj)
			const raw = toRaw(state)

			console.log(obj === raw) // true
		}
	}
</script>
```

上述代码就证明了 `toRaw` 方法从 `reactive` 对象中获取到的是原始数据，因此我们就可以很方便的通过修改原始数据的值而不更新视图来做一些性能优化了

> **注意：** 补充一句，当 `toRaw` 方法接收的参数是 `ref` 对象时，需要加上 `.value` 才能获取到原始数据对象

## markRaw

- markRaw：

  - 作用：标记一个对象，使其永远不会再成为响应式对象。
  - 应用场景:

  1. 有些值不应被设置为响应式的，例如复杂的第三方类库等。
  2. 当渲染具有不可变数据源的大列表时，跳过响应式转换可以提高性能。

`markRaw` 方法可以将原始数据标记为非响应式的，即使用 `ref` 或 `reactive` 将其包装，仍无法实现数据响应式，其接收一个参数，即原始数据，并返回被标记后的数据

我们来看一下代码

```html
<template>
	<p>{{ state.name }}</p>
	<p>{{ state.age }}</p>
	<button @click="change">改变</button>
</template>

<script>
	import { reactive, markRaw } from 'vue'
	export default {
		setup() {
			const obj = {
				name: '前端印象',
				age: 22
			}
			// 通过markRaw标记原始数据obj, 使其数据更新不再被追踪
			const raw = markRaw(obj)
			// 试图用reactive包装raw, 使其变成响应式数据
			const state = reactive(raw)

			function change() {
				state.age = 90
				console.log(state)
			}

			return { state, change }
		}
	}
</script>
```

我们来看一下在被 `markRaw` 方法处理过后的数据是否还能被 `reactive` 包装成响应式数据

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201119130344291.gif#pic_center) 从图中可以看到，即使我们修改了值也不会更新视图了，即没有实现数据响应式

## 4.customRef

- 作用：创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制。

- 实现防抖效果：

  ```vue
  <template>
  	<input type="text" v-model="keyword" />
  	<h3>{{ keyword }}</h3>
  </template>

  <script>
  import { ref, customRef } from 'vue'
  export default {
  	name: 'Demo',
  	setup() {
  		// let keyword = ref('hello') //使用Vue准备好的内置ref
  		//自定义一个myRef
  		function myRef(value, delay) {
  			let timer
  			//通过customRef去实现自定义
  			return customRef((track, trigger) => {
  				return {
  					get() {
  						track() //告诉Vue这个value值是需要被“追踪”的
  						return value
  					},
  					set(newValue) {
  						clearTimeout(timer)
  						timer = setTimeout(() => {
  							value = newValue
  							trigger() //告诉Vue去更新界面
  						}, delay)
  					}
  				}
  			})
  		}
  		let keyword = myRef('hello', 500) //使用程序员自定义的ref
  		return {
  			keyword
  		}
  	}
  }
  </script>
  ```

## 5.provide 与 inject

<img src="Vue3.assets/components_provide.png" style="width:300px" />

- 作用：实现<strong style="color:#DD5145">祖与后代组件间</strong>通信

- 套路：父组件有一个 `provide` 选项来提供数据，后代组件有一个 `inject` 选项来开始使用这些数据

- 子组件尽量不要改变获取到的 provide，要符合单向数据流，不然传给那么多的组件，你不知道哪一个组件更改了数据

- 具体写法：

祖组件中：

```js
setup(){
    ......
    let car = reactive({name:'奔驰',price:'40万'})
    const age = ref(10)
    provide('car',readonly(car)
    provide('age',readonly(age) // 传过去只读不改
    ......
}
```

后代组件中：

```js
setup(props,context){
    ......
    const car = inject('car',// 默认值)
    const age = inject('age',)
    return {car}
    ......
}
```

               ```js
               //interface.ts
               const Key = 'formKey';
               interface Context {
                 model: Record<string, any>;
                 rules: AntFormRules;
                 validate: validateFunc;
                 addItem(item: Partial<FormItemContext>): void;
                 removeItem(id: string): void;
               }
               interface Item {
                 id: string;
                 prop: string;
                 validate: (value: string) => Promise<boolean | ErrorList>
                 handlerControlChange(value: string): void;
                 handlerControlBlur(value: string): void;
               }
               //祖先.vue
               import {Context,Key,Item} from '/path'
               const addItem = (item: Item) => {
                   console.log('formItems', item);
               }
               provide<Partial<Context>>(Key, {
                   model: props.model,
                   rules: props.rules,
                   addItem,
                   removeItem
               });
               //后代.vue
               import {Context,Key,Item} from '/path'
               const formItemCtx = inject<Item>(Key);
               formItemCtx.handlerControlChange()
               ```

与 Vue2 中的 `provide` 和 `inject` 作用相同，只不过在 Vue3 中需要手动从 `vue` 中导入

这里简单说明一下这两个方法的作用：

- **provide** ：向子组件以及子孙组件传递数据。接收两个参数，第一个参数是 `key`，即数据的名称；第二个参数为 `value`，即数据的值
- **inject** ：接收父组件或祖先组件传递过来的数据。接收一个参数 `key`，即父组件或祖先组件传递的数据名称

假设这有三个组件，分别是 `A.vue` 、`B.vue` 、`C.vue`，其中 `B.vue` 是 `A.vue` 的子组件，`C.vue` 是 `B.vue` 的子组件

```html
// A.vue
<script>
	import { provide } from 'vue'
	export default {
		setup() {
			const obj = {
				name: '前端印象',
				age: 22
			}

			// 向子组件以及子孙组件传递名为info的数据
			provide('info', obj)
		}
	}
</script>

// B.vue
<script>
	import { inject } from 'vue'
	export default {
		setup() {
			// 接收A.vue传递过来的数据
			inject('info') // {name: '前端印象', age: 22}
		}
	}
</script>

// C.vue
<script>
	import { inject } from 'vue'
	export default {
		setup() {
			// 接收A.vue传递过来的数据
			inject('info') // {name: '前端印象', age: 22}
		}
	}
</script>
```

## 6.响应式数据的判断

- isRef: 检查一个值是否为一个 ref 对象
- isReactive: 检查一个对象是否是由 `reactive` 创建的响应式代理
- isReadonly: 检查一个对象是否是由 `readonly` 创建的只读代理
- isProxy: 检查一个对象是否是由 `reactive` 或者 `readonly` 方法创建的代理
- shallowReadonly: 让一个响应式数据变为只读的（浅只读), 浅只读就是对象中的对象不会被限制 toRaw

# 四、Composition API 的优势

## 1.Options API 存在的问题

使用传统 OptionsAPI 中，新增或者修改一个需求，就需要分别在 data，methods，computed 里修改 。

## 2.Composition API 的优势

我们可以更加优雅的组织我们的代码，函数。让相关功能的代码更加有序的组织在一起。

![img](Vue3.assets/bc0be8211fc54b6c941c036791ba4efetplv-k3u1fbpfcp-watermark.image)

![img](Vue3.assets/6cc55165c0e34069a75fe36f8712eb80tplv-k3u1fbpfcp-watermark.image)

# 五、新的组件

## 1.Fragment

- 在 Vue2 中: 组件必须有一个根标签
- 在 Vue3 中: 组件可以没有根标签, 内部会将多个标签包含在一个 Fragment 虚拟元素中
- 好处: 减少标签层级, 减小内存占用

## 2.Teleport

- 什么是 Teleport？—— `Teleport` 是一种能够将我们的<strong style="color:#DD5145">组件 html 结构</strong>移动到指定位置的技术。

  ```vue
  <teleport to="移动位置">
  	<div v-if="isShow" class="mask">
  		<div class="dialog">
  			<h3>我是一个弹窗</h3>
  			<button @click="isShow = false">关闭弹窗</button>
  		</div>
  	</div>
  </teleport>
  ```

- 在组件化开发中，我们会封装一个组件 A，在另外一个组件中使用

  - 那么组件 A 中 template 的元素，会被**挂载到组件 B 中 template 的某个位置**
  - 最终应用程序会**形成一颗 DOM 结构**

- Teleport 是什么呢？

  - 它是一个 Vue 提供的内置组件，类似于 react 的 Portals
  - teleport 翻译过来就是心灵传输，远距离传输的意思
    - to：指定将其中的内容移动到目标元素，可以使用选择器
    - disable：是否禁用 teleport 的功能

## 3.Suspense

- 等待异步组件时渲染一些额外内容，让应用有更好的用户体验

- 使用步骤：

  - 异步引入组件

    ```js
    import { defineAsyncComponent } from 'vue'
    const Child = defineAsyncComponent(() => import('./components/Child.vue'))
    ```

  - 使用`Suspense`包裹组件，并配置好`default` 与 `fallback`

    ```vue
    <!--异步组件和suspense一起使用,不用也可以-->
    <suspense>
        <template #default>
          <async-component></async-component>
        </template>
    
        <template #fallback>
          <div>
            Loading...
          </div>
        </template>
    </suspense>
    <script>
    const asyncComponent = defineAsyncComponent(() => import('./async-component')) // 异步组件
    </script>
    ```

# 六、其他

## 1.全局 API 的转移

- Vue 2.x 有许多全局 API 和配置。

  - 例如：注册全局组件、注册全局指令等。

    ```js
    //注册全局组件
    Vue.component('MyButton', {
      data: () => ({
        count: 0
      }),
      template: '<button @click="count++">Clicked {{ count }} times.</button>'
    })

    //注册全局指令
    Vue.directive('focus', {
      inserted: el => el.focus()
    }
    ```

- Vue3.0 中对这些 API 做出了调整：

  - 将全局的 API，即：`Vue.xxx`调整到应用实例（`app`）上

    | 2.x 全局 API（`Vue`）    | 3.x 实例 API (`app`)                        |
    | ------------------------ | ------------------------------------------- |
    | Vue.config.xxxx          | app.config.xxxx                             |
    | Vue.config.productionTip | <strong style="color:#DD5145">移除</strong> |
    | Vue.component            | app.component                               |
    | Vue.directive            | app.directive                               |
    | Vue.mixin                | app.mixin                                   |
    | Vue.use                  | app.use                                     |
    | Vue.prototype            | app.config.globalProperties                 |

## 2.其他改变

- data 选项应始终被声明为一个函数。

- 过度类名的更改：

  - Vue2.x 写法

    ```css
    .v-enter,
    .v-leave-to {
    	opacity: 0;
    }
    .v-leave,
    .v-enter-to {
    	opacity: 1;
    }
    ```

  - Vue3.x 写法

    ```css
    .v-enter-from,
    .v-leave-to {
    	opacity: 0;
    }

    .v-leave-from,
    .v-enter-to {
    	opacity: 1;
    }
    ```

- <strong style="color:#DD5145">移除</strong>keyCode 作为 v-on 的修饰符，同时也不再支持`config.keyCodes`

- <strong style="color:#DD5145">移除</strong>`v-on.native`修饰符

  - 父组件中绑定事件

    ```vue
    <my-component v-on:close="handleComponentEvent" v-on:click="handleNativeClickEvent" />
    ```

  - 子组件中声明自定义事件

    ```vue
    <script>
    export default {
    	emits: ['close']
    }
    </script>
    ```

- <strong style="color:#DD5145">移除</strong>过滤器（filter）

  > 过滤器虽然这看起来很方便，但它需要一个自定义语法，打破大括号内表达式是 “只是 JavaScript” 的假设，这不仅有学习成本，而且有实现成本！建议用方法调用或计算属性去替换过滤器。

- ......
