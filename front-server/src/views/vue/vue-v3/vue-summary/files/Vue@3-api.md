## vue3 更新版本

```js
yarn add vue@next
yarn add @vue/compiler-sfc -D
```

## nvm 下载

https://www.cnblogs.com/ljh12138/p/14081121.html

https://www.freesion.com/article/6357870942/

node 版本：https://nodejs.org/en/download/releases/

## shourceTree 绑定 ssh

https://www.cnblogs.com/wqbin/p/11070273.html

**vscode 无法识别 npm 问题**，重启 vscode，然后**关闭终端**，重新启动

### shourceTree 绑定 ssh

https://www.cnblogs.com/wqbin/p/11070273.html

### vscode

先去**关闭终端**，vscode 关闭，重新启动

https://www.jianshu.com/p/2608ecf7f63d

切换终端，ctrl+shift+p，输入**select**，可以选择 cmd

https://www.jianshu.com/p/efa734089206

## v-once

`只渲染元素和组件一次。随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能。`

```vue
<!--包括子元素，只渲染一次-->
<div v-once>
  <h1>comment</h1>
  <p>{{msg}}</p>
</div>
```

## v-pre

- **不需要表达式**

- **用法**：

  跳过这个元素和它的子元素的编译过程。可以用来显示原始 Mustache 标签。跳过大量没有指令的节点会加快编译。

- **示例**：

  ```html
  <span v-pre>{{ this will not be compiled }}</span>
  <!--{{ this will not be compiled }}-->
  ```

## v-bind

### class 绑定

**也可以通过计算属性绑定**

```html
<!-- class 绑定 -->
<div class="abc" :class="{ red: isRed }"></div>
<div :class="[classA, classB]"></div>
<div :class="[classA, { classB: isB, classC: isC }]"></div>
<div :class="[classA, isAcitve ? 'show':'noShow']"></div>

<div :class="obj"></div>
<!--
data(){
    return {
        obj:{
            isAcitve:'true
        }
    }
}
-->
```

### style 绑定

**也可以通过计算属性绑定**

```vue
<!-- style 绑定 -->
<div :style="{ fontSize: size + 'px' }"></div>
<div :style="{ 'font-size': size + 'px' }"></div>
<div :style="[styleObjectA, styleObjectB]"></div>

<div :style="obj"></div>
<!--
data(){
    return {
        styleObjectA:{
            fontSize:'20px'
        },
        styleObjectB:{
            fontSize:'30px'
        },
        obj:{
            fontSize:'50px'
        }
    }
}
-->
```

### 动态绑定属性

**属性名称也是不确定的**

```html
<!-- 动态 attribute 名缩写 -->
<button :[key]="value"></button>
<!--
data(){
    return {
        key:'class',
        value:'asd'
    }
}
-->
```

### v-bind 直接绑定一个对象

```vue
<div v-bind="info"></div>
<div :="info"></div>
<!--<div class="header" style="color:red" height=1.88></div>-->

<!--
data(){
    return {
        info:{
            class:'header',
            style:"color:red",
            height:1.88
        }
    }
}
-->
```

## v-on

- **缩写**：`@`
- **预期**：`Function | Inline Statement | Object`
- **参数**：`event`
- **修饰符**：
  - `.stop` - 调用 `event.stopPropagation()`。
  - `.prevent` - 调用 `event.preventDefault()`。
  - `.capture` - 添加事件侦听器时使用 capture 模式。
  - `.self` - 只当事件是从侦听器绑定的元素本身触发时才触发回调。
  - `.{keyAlias}` - 仅当事件是从特定键触发时才触发回调。
  - `.once` - 只触发一次回调。
  - `.left` - 只当点击鼠标左键时触发。
  - `.right` - 只当点击鼠标右键时触发。
  - `.middle` - 只当点击鼠标中键时触发。
  - `.passive` - `{ passive: true }` 模式添加侦听器

```vue
<div @click='fun'></div>
<div @click='num++'></div> <!--内联表达式，用于简单的处理函数-->
<div @mousemove='fun'></div>

<!-- 方法处理器 -->
<button v-on:click="doThis"></button>

<!-- 动态事件 -->
<button v-on:[event]="doThis"></button>

<!-- 内联语句,传入$event -->
<button v-on:click="doThat('hello', $event)"></button>

<!-- 缩写 -->
<button @click="doThis"></button>

<!-- 动态事件缩写 -->
<button @[event]="doThis"></button>

<!-- 停止冒泡 -->
<button @click.stop="doThis"></button>

<!-- 阻止默认行为 -->
<button @click.prevent="doThis"></button>

<!-- 阻止默认行为，没有表达式 -->
<form @submit.prevent></form>

<!-- 串联修饰符 -->
<button @click.stop.prevent="doThis"></button>

<!-- 键修饰符，键别名 -->
<input @keyup.enter="onEnter" />

<!-- 点击回调只会触发一次 -->
<button v-on:click.once="doThis"></button>

<!-- 对象语法 -->
<button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
<button @="{ mousedown: doThis, mouseup: doThat }"></button>

<!--按了enter键以后才会触发-->
<input type='text' @keyup.enter='showValue'></input>
<!--
methods:{
    showVlue(e){  //获取input的值
        console.log(e.target.value)
    }
}
-->
```

## v-show

- **预期**：`any`

- **用法**：

  根据表达式的真假值，切换元素的 `display` CSS property。

  当条件变化时该指令触发过渡效果。**不可以和 v-else 搭配使用**

## v-if

- **预期**：`any`

- **用法**：

  根据表达式的真假值来有条件地渲染元素。在切换时元素及它的数据绑定 / 组件被销毁并重建。如果元素是 `<template>`，将提取它的内容作为条件块。

  当条件变化时该指令触发过渡效果。

  当和 `v-for` 一起使用时，`v-if` 的优先级比 `v-for` **更高**

## v-else

- **不需要表达式**

- **限制**：前一兄弟元素必须有 `v-if` 或 `v-else-if`。

- **用法**：

  为 `v-if` 或者 `v-else-if` 添加“else 块”。

  ```html
  <div v-if="Math.random() > 0.5"> Now you see me </div> <div v-else> Now you don't </div>
  ```

## v-else-if

- **预期**：`any`

- **限制**：前一兄弟元素必须有 `v-if` 或 `v-else-if`。

- **用法**：

  表示 `v-if` 的“else if 块”。可以链式调用。

  ```html
  <div v-if="type === 'A'"> A </div>
  <div v-else-if="type === 'B'"> B </div>
  <div v-else-if="type === 'C'"> C </div>
  <div v-else> Not A/B/C </div>
  ```

## v-for

- **预期**：`Array | Object | number | string | Iterable`

- **用法**：

  基于源数据多次渲染元素或模板块。此指令之值，必须使用特定语法 `alias in expression`，为当前遍历的元素提供别名：

  ```html
  <div v-for="item in items"> {{ item.text }} </div>
  ```

  另外也可以为数组索引指定别名 (或者用于对象的键)：

  ```html
  <div v-for="(item, index) in items"></div>
  <div v-for="(value, key) in object"></div>
  <div v-for="(value, name, index) in object"></div>
  ```

  `v-for` 的默认行为会尝试原地修改元素而不是移动它们。要强制其重新排序元素，你需要用特殊 attribute `key` 来提供一个排序提示：

  ```html
  <div v-for="item in items" :key="item.id"> {{ item.text }} </div>
  ```

  `v-for` 也可以在实现了[可迭代协议](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol)的值上使用，包括原生的 `Map` 和 `Set`。

  **遍历对象**

  ```vue
  <ul>
      <li v-for"(value,key,index) in info"></li>
  </ul>
  ```

<!--
  data(){
      return {
          info:{
              class:'header',
              style:"color:red",
              height:1.88
          }
      }
  }
  -->

````
**遍历数字**

```vue
<li v-for"(value,key) in 10"></li>
````

## v-data 页面级暂存

```vue
<template>
	<button @click="stash"></button>
</template>
<script>
export default {
	data() {
		const stash = localStorage.getItem('stash') ? JSON.parse(stashStr) : {}
		return Object.assign(
			{
				form: {
					name: ''
				}
			},
			stash
		)
	},
	methods: {
		stash() {
			localStorage.setItem('stash', Json.stringify(this.$data))
		}
	}
}
</script>
```

## v-model

v-model 本质上是一个语法糖,赋值给输入框和值改变时触发变量改变

```html
<input v-bind:value = 'value' v-on:input = "value = $event.target.value"></input>
```

- _:model-value_ 赋值
- _handleValueChange_ 触发

```html
<el-input :model-value="modelValue[formItem.filed]" @update:modelValue="handleValueChange($event, formItem.filed)" />
```

- **预期**：随表单控件类型不同而不同。

- **限制于**：

  - `<input>`
  - `<select>`
  - `<textarea>`
  - components

- **修饰符**：

  - [`.lazy`](https://v3.cn.vuejs.org/guide/forms.html#lazy) - 监听 `change` 而不是 `input` 事件,只有在提交(比如说回车)才会触发
  - [`.number`](https://v3.cn.vuejs.org/guide/forms.html#number) - 输入字符串转为有效的数字
  - [`.trim`](https://v3.cn.vuejs.org/guide/forms.html#trim) - 输入首尾空格过滤

- **用法**：

  在表单控件或者组件上创建双向绑定。

  ```vue
  <input v-model.lazy='value'></input>
  <input v-model.number='value'></input>
  <input v-model.trim='value'></input>
  ```

### 组件 v-model

```vue
<!--引用组件-->
<template>
	<!--组件上绑定v-model相当于干了两件事，传值和监听事件-->
	<zy-component v-model="message"></zy-component>
	<!--<zy-component :modelValue="message" @updata:model-value="message = $event"></zy-component>-->
</template>
<script>
import ZyComponent from 'ZyComponents'
export default {
   components:{
       ZyComponent
   },
   data() {
        return: {
            message:"hello"
        }
   }
   }
</script>

<!--组件-->
<template>
	<input v-model="value" />
</template>
<script>
export default {
	props: {
		modelValue: String // 默认传过来modelValue, vue2是value
	},
	emits: ['update:modelValue'], // 默认的监听事件
	computed: {
		value: {
			get() {
				return this.modelValue
			},
			set(value) {
				return this.emit('update:modelValue', value)
			}
		}
	}
}
</script>
```

### 组件 v-model 绑定多个值

```vue
<!--引用组件-->
<template>
	<!--组件的v-model是可以传参数的-->
	<zy-component v-model:title="title" v-model:message="message"></zy-component>
</template>
<script>
import ZyComponent from 'ZyComponents'
export default {
   components:{
       ZyComponent
   },
   data() {
        return: {
            message:"hello",
            title: "title"
        }
   }
   }
</script>

<!--组件-->
<template>
	<input v-model="value" />
	<input v-model="valueTitle" />
</template>
<script>
export default {
	props: {
		message: String, // message
		title: String // message
	},
	emits: ['update:message', 'update:title'], // 默认的监听事件
	computed: {
		value: {
			get() {
				return this.message
			},
			set(value) {
				return this.emit('update:message', value)
			}
		},
		valueTitle: {
			get() {
				return this.title
			},
			set(value) {
				return this.emit('update:title', value)
			}
		}
	}
	/**
            const formData = computed({
                get: () => props.modelValue,
                set: (newValue) => {
                    emit('update:modelValue', newValue)
                }
            })
         **/
}
</script>
```

## 表单组件绑定多个 value

- 使用监听属性

```vue
<template>
	<z-input v-model="formData" />
</template>
<script>
export default {
	setup(props, { emit }) {
		const formData = ref({
			id: '',
			name: ''
		})

		return formData
	}
}
</script>

<!--组件-->
<template>
	<input v-model="formData.id" />
	<input v-model="formData.name" />
</template>

<script>
export default {
    props: {
        modelValue: { // 这个属性是v-model默认的props属性,可以改变，参考上面的笔记
            type: Object
            required: true
        }
    },
     emits: ['update:modelValue'],
    setup(props, { emit }) {
        const formData = ref({ ...props.modelValue })

        watch(formData, newValue => {
            emit('update:modelValue', newValue)
        }, { deep: true })
        return {
            formData
        }
    }
}
</script>
```

- 使用函数

  - 不会改变 props 的值，而是使用函数当值发生改变的时候传递出去 a

  ```vue
  <template>
  	<z-input v-model="formData" />
  </template>
  <script>
  export default {
  	setup(props, { emit }) {
  		const formData = ref({
  			id: '',
  			name: ''
  		})

  		return formData
  	}
  }
  </script>

  <!--组件-->
  <template>
  	<el-date-picker :model-value="modelValue[formItem.filed]" @update:modelValue="handleValueChange($event, formItem.filed)"></el-date-picker>
  </template>

  <script>
  export default {
      props: {
          modelValue: { // 这个属性是v-model默认的props属性,可以改变，参考上面的笔记
              type: Object
              required: true
          }
      },
       emits: ['update:modelValue'],
      setup(props, { emit }) {
          // 1.重点,通过双向绑定,不直接改props的办法
          const handleValueChange = (value: any, filed: string) => {
              emit('update:modelValue', { ...props.modelValue, [filed]: value })
          }
          return { handleValueChange }
      }
  }
  </script>
  ```

## 函数同时传递 event 和其他参数

```html
<button @click="handleClick(123, $event)">按钮</button>
```

## 父子传值

### props

props 是**大小写不敏感的**,使用驼峰命名**浏览器**会转为小写,虽然在 vue-loader 中使用**不会出现问题**,但是还是推荐使用**短横线命名法**

props 可以是数组或对象，用于接收来自父组件的数据

数组 - props: ['size', 'myMessage']

```js
props: {
    // 检测类型 String Number Boolean Array Object Function Promise Symbol Date
    height: Number,
    // 检测类型 + 其他验证
    age: {
      type: Number, // 规定类型
      default: 0, // 默认值
      required: true, // 必传的值
      validator: (value) => { // 自定义校验
        return value >= 0
      }
    },
    arr: {
        type: Array, // 数组,函数,对象默认值要设定为一个函数返回值的形式
        default: () => { // 一定要是箭头函数，不然会有类型检查问题
            return ['1','2']
        }
    }
}
```

**具体类型**

```typescript
interface a {
	key: number
	title: string
}

// PropType接收一个泛型
import { PropType } from 'vue'
props: {
	items: {
		type: Array as PropType<a[]>
	}
}
```

### $attr

一个非 prop 的 attribute 是指传向一个组件，但是该组件并没有相应 prop 定义的 attribute。

即在向组件传递 id,class,value 等值,但是没有组件使用 props 接受,那么这些值又去往哪里呢?

`<my-component id="header" class="header"></my-component>`

```vue
<!-- Attribute继承 当组件有单个根节点时,非 Prop 的 Attribute会自动添加到根节点的Attribute -->
<div id="header" class="header"> // 根节点
    <h2>我不是根节点</h2>
<div>
<!-- 禁用Attribute
    如果我们不希望组件的根元素继承attribute,可以在组件中设置 inheritAttrs: false,
    可以通过$attrs来访问所有的非props的attribute -->
<div>
    <h2 :class="$attrs.class" :id="$attrs.id">我不是根节点</h2>
<div>
<div>
    <h2 v-bind="$attrs">我不是根节点</h2> <!--一次性绑定-->
<div>

<!-- 多根节点需要明确绑定到哪一个节点上,不然会有警告 -->
```

### $emit

- 当子组件有一些事情发生的时候,比如子组件发生了点击,父组件需要切换界面
- 子组件有一些值需要传递给父组件

步骤

1. 在**子组件上定义好在某些情况下触发的事件名称**
2. 在**父组件以 v-on 的方式传入要监听的事件名称**,并且绑定到对应的方法中
3. 在子组件发生某些事件的时候,**根据事件名称触发对应的事件**

```vue
<!-- 子组件触发事件 -->
<template>
	<div>
		<input type="text" v-model.number="step" />
		<button @click="increment"></button>
		<button @click="incrementMore"></button>
		<!-- 简写
            <button @click="$emit('add')"></button>
            <button @click="$sub('addMore',step)"></button>
        -->
	</div>
</template>
<script>
export default {
	emits: ['add', 'addMore'], // 声明,vue3中要使用
	/*
            emits:{
                add: null //没有参数
                addMore: payload => { // 返会值为布尔值,即使为false也会传过去,控制台报警告
                    return payload > 20 
                }
            }
        */
	data() {
		step: 10
	},
	methods: {
		increment() {
			this.$emit('add')
		},
		incrementMore() {
			// 传递参数,可以传递多个this.$emit('addMore',a,b,c)
			this.$emit('addMore', this.step)
		}
	}
}
</script>
```

```vue
<!-- 父组件监听事件 -->
<template>
	<h2>当前计数:{{ count }}</h2>
	<child @add="addNum" @addMore="addMore"></child>
</template>

<script>
import child from './child'
export default {
	emit: ['add'],
	data() {
		count: 0
	},
	methods: {
		addNum() {
			this.count++
		},
		addMore(step) {
			// 接受参数
			this.count += step
		}
	}
}
</script>
```

**vue3**

```js
setup(props, { emit }) {
    return {

    }
}
```

### 父组件调用子组件方法

**vue3**

```html
<template>
	<child-component ref="childRef"></child-component>
	<template />
	<script lang="ts">
		component: {
		    childComponent
		},
		export default defineComponent({
		    const childRef = ref<InstanceType<typeof childComponent>>()
		    const deleted = () => {
		        childRef.value?.deleted()
		    }
		})
	</script></template
>
```

## 祖孙传值

### provide

provide / inject 这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在其上下游关系成立的时间里始终生效。

- 无论层级结构有多深,父组件都可以作为其所有子组件的**依赖提供者**
- 父组件有一个**provide 选项**来提供数据;子组件有一个**inject 选项**来开始使用这些数据
- 可以看成长范围的 props,但是父组件不需要知道哪些子组件使用它 provide 的 property,子组件不需要知道 inject 的 property 来自哪里
- `provide` 和 `inject` 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的 property 还是可响应的。

```vue
<script>
 // 父组件
    import { computed } from 'vue'
provide: {
    foo: 'bar',
},
provide() { // this的指向问题,要使用函数
    return {
        foo: this.bar,
        length: computed(() => this.arr.length) // 响应式,传过去的就变成ref对象了,要使用length.value取值
    }
},
</script>
```

```vue
<script>
 // 子组件
inject: ['foo'],
/*inject: { // 可以通过设置默认值使其变成可选项
    foo: { default: 'foo' },
    abc: { // prop 的默认值类似，你需要对非原始值使用一个工厂方法
      from: 'bar', // 标明来源,可选
      default: () => [1, 2, 3]
    }
}*/
props: { // 使用一个注入的值作为一个 property 的默认值
    bar: {
      default () {
        return this.foo
      }
    }
},
data () { // 使用一个注入的值作为数据入口
    return {
      bar: this.foo
    }
}
</script>
```

## 自定义 hook 函数

- 什么是 hook？—— 本质是一个函数，把 setup 函数中使用的 Composition API 进行了封装。
- 类似于 vue2.x 中的 mixin。
- 自定义 hook 的优势: 复用代码, 让 setup 中的逻辑更清楚易懂。
- 约定俗成的**hooks 函数和 hooks 文件名**命名为**use**开头

```js
import { ref, computed } from 'vue'
export default () => {
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

### useTitle

```js
//封装改变界面title的hooks
import { ref, watch } from 'vue'
export default (title="默认标题") => {
    const titleRef = ref(title)

    watch(titleRef, (newValue) = >{
        document.title = newValue
    },{
        immediate: true
    })

    return titleRef
}

//
import useTitle from '@/hooks/useTitle'
setup() {
    const titleRef = useTitle('漂亮')
    setTimeout(() => {
        titleRef.value = '很漂亮'
    },1000)
}
```

### useScroll

```js
//封装界面滚动的hooks
import { ref } from 'vue'
export default () => {
    const scrollX = ref(0)
    const scrollY = ref(0)

    document.addEventListener('scroll', () => {
        scrollX = window.scrollX
        scrollY = window.scrollY
    })

    return {
        scrollX,
        scrollY
    }
}

//
import useScroll from '@/hooks/useScroll'
setup() {
    const { scrollX, scrollY } = useScroll()
}
```

### useMousePosition

```js
//封装鼠标位置的hooks
import { ref } from 'vue'
export default () => {
    const pageX = ref(0)
    const pageY = ref(0)

    window.addEventListener('mousemove', (e) => {
        pageX = e.pageX
        pageY = e.pageY
    })

    return {
        pageX,
        pageY
    }
}

//
import useMousePosition from '@/hooks/useMousePosition'
setup() {
    const { pageX, pageY } = useMousePosition()
}
```

### useStorage

```js
// 粗略的使用，应当在结合util函数更好
import { ref, watch } from 'vue'
export default (key, value) => {
    const data = ref(value)

    if(value) { // 保存
        window.localStorage.setItem(key, JSON.stringify(value))
    } else { // 获取
        data.value = window.parse(window.localStorage.getItem(key))
    }
    watch(data, (newValue) => {
        window.localStroage.setItem(key, JSON.stringify(newValue))
    })
    return data
}

//
import useStorage from '@/hooks/useStorage'
setup() {
    const data = useStorage('onfo',{ name:'asd', age:10 })
    const changeData = () => data.value = '哈哈哈' // 改变值
}
```

## app.use()

- 通常像 Vue 全局添加一些功能的时候，会采用插件的模式，它有两种编写方式

  - 对象类型：一个对象，但是**必须包含一个 install 函数，该函数会在安装插件的时候执行**

  - ```js
    import axios from '@/https/api/index'
    const obj = {
    	install(app) {
    		// 绑定全局属性
    		app.config.globalProperties.$axios = axios
    	}
    }
    export default obj

    // main.ts
    import obj from './obj'
    app.use(obj)
    ```

  - 函数类型：一个 function，这个函数会在**安装插件时自动执行**

插件的功能范围没有严格的限制——一般有下面几种：

- 添加全局方法或者 property。如：[vue-custom-element](https://github.com/karol-f/vue-custom-element)

- 添加全局资源：指令/过滤器/过渡等。如：[vue-touch](https://github.com/vuejs/vue-touch)）

- 通过全局 mixin 来添加一些组件选项。(如[vue-router](https://github.com/vuejs/vue-router))

- 添加全局实例方法，通过把它们添加到 `config.globalProperties` 上实现。

- 一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 [vue-router](https://github.com/vuejs/vue-router)

- **app.use() use 函数会传入一个 app 的参数**

```js
// 对象的方式，可以直接main中use，但是不方便
import { App } from 'vue'
import { ElButton, ElLoading } from 'element-plus'
import 'element-plus/dist/index.css'

const elementPlus = {
	install(app: App) {
		;[ElButton, ElLoading].map((_) => {
			app.use(_)
		})
	}
}

export default elementPlus
```

```js
// 函数的方式，可以更好的在index中暴露出去
/**
 * @elememt组件
 */
import { App } from 'vue'
import { ElButton, ElLoading } from 'element-plus'
import 'element-plus/dist/index.css'

export default (app: App) => {
    ;[ElButton, ElLoading].map((_) => {
        app.use(_)
    })
}

// index.ts
import { App } from 'vue'
import elementPlus from './element-ui'

import globalVar from './globalVar'
import './axios'
import '@/assets/sass/index.scss'

const plugins = [elementPlus, globalVar]

export default {
    install(app: App) {
        plugins.forEach((_) => {
            app.use(_)
        })
    }
}

// main.ts
import plugins from './plugins'
app.use(plugins)
```

## nextTick

将回调推迟到下一个 DOM 更新周期之后执行。在更改了一些数据以等待 DOM 更新后立即使用它。

- 比如我们有下面的要求
  - 点击一个按钮，我们会修改在 h2 中显示的 message
  - message 被修改后，获取最新 h2 的高度
- 实现上面的案例我们有三种方式
  - 在点击按钮后立即获取到 h2 的高度(错误的做法,获取到的是 DOM 更新前的高度)
  - 在 update 生命周期函数中获取 h2 的高度(但是其他数据更新，也会执行该操作)
  - 使用 nextTick 函数

```js
import { nextTick } from 'vue'

nextTick(() => {
	console.log(h2.value.height)
})
```

## 事件总线

兄弟组件或者没有任何关联的组件想要进行事件的关联

### vue2

#### 发送方

```vue
<template>
	<a-button @click="search"> 点击触发事件 </a-button>
</template>

<script>
export default {
	methods: {
		search() {
			// 点击触发事件总线发送事件
			this.$EventBus.$emit(this.queryName, this.formData)
		},
		created() {
			// 挂载事件总线,使用数据总线传递数据
			this.$EventBus.$emit(this.queryName, this.formData)
		}
	}
}
</script>
```

#### 接收方

```js
export default {
	data() {
		return {
			searchData: {}
		}
	},
	methods: {
		created() {
			// 监听事件总线，触发时获取搜索表单最新的值
			this.$EventBus.$on(this.queryName, (_) => {
				this.searchData = _
			})
		}
	}
}
```

### vue3

#### 发送方

```vue
<template>
	<a-button @click="search"> 点击触发事件 </a-button>
</template>
<script lang="ts" setup>
const { proxy } = <any>getCurrentInstance()
const search = () => {
	// 点击触发事件总线发送事件
	proxy.$mittBus.emit(props.queryName, state.formData)
}

onMounted(() => {
	// 挂载事件总线,使用数据总线传递数据
	proxy.$mittBus.emit(props.queryName, state.formData)
})
// 页面卸载时
onUnmounted(() => {
	proxy.$mittBus.off(props.queryName, () => {})
})
</script>
```

#### 接收方

```vue
<script lang="ts" setup>
onBeforeMount(() => {
	// 挂载事件总线,使用数据总线传递数据
	proxy.$mittBus.on('test', (res: any) => {
		console.log(res)
	})
})
// 页面卸载时
// 不是每一个都需要取消监听, 因为取消了监听，某些操作将不生效
onUnmounted(() => {
	proxy.$mittBus.off('test', () => {})
})
</script>
```

### $on

监听当前实例上的自定义事件。事件可以由 `vm.$emit` 触发。回调函数会接收所有传入事件触发函数的额外参数。

```js
vm.$on('test', function (msg) {
	// 开启事件并监听
	console.log(msg)
})
vm.$emit('test', 'hi') // 触发事件
// => "hi"
```

### $off

移除自定义事件监听器。

- 如果没有提供参数，则移除所有的事件监听器；
- 如果只提供了事件，则移除该事件所有的监听器；
- 如果同时提供了事件与回调，则只移除这个回调的监听器。

```js
vm.$off('test') // 移除事件
```

### $once

监听一个自定义事件，但是只触发一次。一旦触发之后，监听器就会被移除。

```js
vm.$once('test', function (msg) {
	// 开启事件并监听一次
	console.log(msg)
})
```

### vue@3

$on`，`$off`和`$once` 实例方法已被移除,`$emit` 仍然包含于现有的 API 中，因为它用于触发由父组件声明式添加的事件处理函数。

事件总线模式可以被替换为使用外部的、实现了事件触发器接口的库，例如 [mitt](https://github.com/developit/mitt)

#### mitt

```npm
npm install --save mitt
```

封装

```js
import mitt from 'mitt'

const emitter = mitt() // 可以创建多个实例
export default emitter
```

使用

```js
import emitter from '@/utils/mitt'

methods: { // 触发事件
    btnClick() {
        emitter.emit('foo','123')
    }
}

import emitter from '@/utils/mitt'
created() { // 监听事件并执行逻辑
   emitter.on('foo',(_) => {
       console.log(_)
   })

   emitter.on('*',(type,info) => { // 监听所有事件
       console.log(type,info)
   })

   emitter.all.clear() // 取消所有事件的监听
}
// 取消某一个事件的监听
function onFoo() {}
emitter.on('foo', onFoo)   // listen
emitter.off('foo', onFoo)  // unlisten
```

## Mixin 混合

https://v3.cn.vuejs.org/guide/mixins.html#mixin

组件和组件之间有的时候会存在**相同的代码逻辑**，我们希望对**代码逻辑进行抽取**

- Mixin 提供了一种非常灵活的方式，来**分发 Vue 组件中的可复用功能**
- 一个 Mixin 对象可以包含**任何组件选项**
- 当组件使用 Mixin 对象时，所有 Mixin 对象的选项将被**混合进入组件本身的选项**中
- Vue2 中**比较推荐使用 Mixi**n，而在 Vue3 中推荐使用**Composition API**

```js
export const demoMixin {
    data() {
        return {
            msg: 'hello'
        }
    },
    create() {
        console.log('world')
    }
}
```

```vue
<template>
	{{ msg }}
</template>
<script>
import { demoMixin } from '@/Mixins/demoMixin'
export default {
	mixins: [demoMixin] // 多个混合
}
</script>
```

### 合并规则

- 如果 Mixin 对象中的选项和组件对象中的选项发生了冲突，那么 Vue 会如何操作?
  - 情况一，如果是 data 函数的返回值对象，默认情况下会进行合并，如果 data 返回值对象的属性发生了冲突，那么会**保留组件自身的数据**
  - 情况二，生命周期钩子函数会被**合并到数组中**，都会被调用
  - 情况三，**值为对象的选项，例如：methods，components 和 directives 将会被合并为同一个对象**
    - 比如都有**methods 选项**，并且都定义了方法，那么**它们都会生效**
    - 但是如果**对象的 key 相同**，那么**会取组件对象的键值对**，**保留组件里面的**

### 全局混入

如果组件中的某些选项，是所有的组件都需要拥有的，那么这时候我们可以使用全局的 Mixin

- 全局的 Mixin 可以使用**应用 app 的方法 mixin**来完成注册
- 一旦注册，那么**全局混入的选项将会影响每一个组件**

```js
import App from './APP'

const app = create(App)

app.mixin({
    data() {
        return {
            msg: '123'
        }
    }
})

app.mounted(#app)
```

## 获取实例 this

### getCurrentInstance

- setup**不可以**使用 this 是**因为组件实例还没有被创建出来**

我们都知道在 Vue2 的任何一个组件中想要获取当前组件的实例可以通过 `this` 来得到，而在 Vue3 中我们大量的代码都在 `setup` 函数中运行，并且在该函数中 `this` 指向的是 `undefined`，那么该如何获取到当前组件的实例呢？

这时可以用到另一个方法，即 `getCurrentInstance`

```html
<template>
	<p>{{ num }}</p>
</template>
<script>
	import {ref, getCurrentInstance} from 'vue'
	export default {
	    setup() {
	        const num = ref(3)
	        const { ctx, proxy } = getCurrentInstance() as any
	        // const { $axios } = getCurrentInstance()?.proxy as any
	        // const { $axios } = getCurrentInstance()?.appContext.config.globalProperties as any
	        console.log(proxy.$axios)

	        return {num}
	    }
	}
</script>
```

**ctx 和 proxy 都可以访问到定义的全局方法，但是 ctx 只能在本地使用，线上环境使用 proxy**

或者使用

```tsx
const { $axios } = getCurrentInstance()?.appContext.config.globalProperties as any
console.log($axios)
```

### useStore

在 Vue2 中使用 Vuex，我们都是通过 `this.$store` 来与获取到 Vuex 实例，但上一部分说了原本 Vue2 中的 `this` 的获取方式不一样了，并且我们在 Vue3 的 `getCurrentInstance().ctx` 中也没有发现 `$store` 这个属性，那么如何获取到 Vuex 实例呢？这就要通过 `vuex` 中的一个方法了，即 `useStore`

```js
// store 文件夹下的 index.js
import Vuex from 'vuex'

const store = Vuex.createStore({
    state: {
        name: '前端印象',
        age: 22
    },
    mutations: {
        ……
    },
    ……
})

// example.vue
<script>
// 从 vuex 中导入 useStore 方法
import {useStore} from 'vuex'
export default {
    setup() {
        // 获取 vuex 实例
        const store = useStore()

        console.log(store)
    }
}
</script>
```

然后接下来就可以像之前一样正常使用 `vuex` 了

### 获取标签元素

最后再补充一个 `ref` 另外的作用，那就是可以获取到标签元素或组件

在 Vue2 中，我们获取元素都是通过给元素一个 `ref` 属性，然后通过 `this.$refs.xx` 来访问的，但这在 Vue3 中已经不再适用了

接下来看看 Vue3 中是如何获取元素的吧

```html
<template>
	<div>
		<div ref="el">div元素</div>
	</div>
</template>

<script>
	import { ref, onMounted } from 'vue'
	export default {
		setup() {
			// 创建一个DOM引用，名称必须与元素的ref属性名相同
			const el = ref(null)

			// 在挂载后才能通过 el 获取到目标元素
			onMounted(() => {
				el.value.innerHTML = '内容被修改'
			})

			// 把创建的引用 return 出去
			return { el }
		}
	}
</script>
```

获取元素的操作一共分为以下几个步骤：

1. 先给目标元素的 `ref` 属性设置一个值，假设为 `el`
2. 然后在 `setup` 函数中调用 `ref` 函数，值为 `null`，并赋值给变量 `el`，这里要注意，该变量名必须与我们给元素设置的 `ref` 属性名相同
3. 把对元素的引用变量 `el` 返回（return）出去

> **补充**：设置的元素引用变量只有在组件挂载后才能访问到，因此在挂载前对元素进行操作都是无效的

当然如果我们引用的是一个组件元素，那么获得的将是该组件的实例对象，这里就不做过多的演示了

## 插槽 slot

- 让使用者决定组件中某一块区域存放什么内容
- 插槽的使用过程其实就是**抽取共性,预留不同**
- 我们会将共同的元素,内容依然在组件内进行封装
- 同时会将不同的元素使用**slot 作为占位**,让外部决定到底显示什么样的元素

```vue
<!--如果只有一个slot，但是有三个h2，那么这3个h2都会生效，如果有3个slot那么会有3组h2，也就是9个-->
<template>
	<my-component>
		<h2>我是插槽里面的内容01</h2>
		<h2>我是插槽里面的内容02</h2>
		<h2>我是插槽里面的内容03</h2>
	</my-component>
</template>

<template>
	<my-component>
		<template>
			<h2>我是插槽里面的内容</h2>
		</template>
	</my-component>
</template>
```

```vue
<!--my-component-->
<template>
	<h2>我是组件</h2>
	<slot></slot>
</template>
```

### 默认插槽

为一个插槽指定备用 (也就是默认的) 内容是很有用的，它只会在**没有提供内容**的时候被渲染，当使用这个组件，但是不提供任何插槽内容时，**默认就会显示 slot 里面的内容**。

```vue
<!--my-component-->
<template>
	<h2>我是组件</h2>
	<slot><h2>我是插槽里面的默认内容</h2></slot>
</template>
```

### 具名插槽

**缩写：v-slot:name -> #name**

```vue
<!--my-component-->
<template>
	<h2>我是组件</h2>
	<slot name="header"><h2>header</h2></slot>
	<slot><h2>default</h2></slot>
	<slot name="footer"><h2>footer</h2></slot>
</template>

<!--引入my-component-->
<template>
	<my-component>
		<template v-slot:header>
			<h1>footer</h1>
		</template>

		<template v-slot:default>
			<!--可以不写default，默认-->
			<p>default</p>
		</template>

		<template #footer
			><!--语法糖-->
			<p>footer</p>
		</template>
	</my-component>
</template>
```

### 给 slot 绑定方法

在 Vue 中，你可以使用作用域插槽（scoped slots）来给 slot 绑定方法。作用域插槽可以让你将数据和方法从父组件传递到插槽内容，即使这些内容是在子组件的模板中定义的。

这是一个简单的例子，说明如何给 slot 绑定方法：

```vue
<template>
	<div>
		<slot :clickHandler="clickHandler"></slot>
	</div>
</template>

<script>
export default {
	methods: {
		clickHandler() {
			console.log('Button clicked from child component')
		}
	}
}
</script>
```

在以上的子组件中，我们创建了一个作用域插槽，并绑定了一个 `clickHandler` 方法。

```vue
<template>
	<div>
		<ChildComponent>
			<template v-slot:default="slotProps">
				<button @click="slotProps.clickHandler"> Click me </button>
			</template>
		</ChildComponent>
	</div>
</template>

<script>
import ChildComponent from './ChildComponent.vue'

export default {
	components: {
		ChildComponent
	}
}
</script>
```

在以上的父组件中，我们使用 `v-slot` 指令和一个特殊的变量 `slotProps` 来访问子组件传递给插槽的属性和方法。然后，我们在一个按钮上使用 `@click` 指令来绑定这个 `clickHandler` 方法。

当你点击按钮时，控制台将会打印出 "Button clicked from child component"。这就是给 slot 绑定方法的一种方式。

### 动态命名插槽

```vue
<template>
	<slot :name="move"><h2>footer</h2></slot>
</template>
<script>
export default {
	props: {
		move: {
			type: string,
			default: 'bigWhite'
		}
	}
}
</script>

<!--动态决定插槽名字-->
<template>
	<my-component>
		<template v-slot:[name]></template>
		<template #[name]></template>
	</my-component>
</template>
<script>
export default {
	data() {
		return {
			name: 'smallGray'
		}
	}
}
</script>
```

### 作用域插槽

- 父级模板里所有内容都是在**父级作用域中编译**的
- 子模板里所有内容都是在**子作用域中编译**的
- 有的时候希望让**插槽内容能够访问子组件中才有的数据**，那么作用域插槽是很有用的，当一个组件被用来渲染一个数组元素时，我们使用插槽，并且希望插槽中

```vue
<template v-for="(item, index) in categories" :key="index">
	<!--:category表示传递给外面-->
	<slot name="bigWhite" :item="item"></slot>
</template>

<list-card :categories="categories"> 
    <template #bigWhite='{ item }'> <!--v-slot:bigWhite="item" { }括号是结构赋值-->
        <span>{{ item }}</span>
    </template>

    <template v-slot="itemProps"> <!--默认插槽的话，v-slot:default="itemProps"，没有加括号就没有解构赋值-->
        <span>{{ itemProps.item }}</span>
    </template>
</list-card>
```

### 独占默认插槽

当被提供的内容*只有*默认插槽时，组件的标签才可以被当作插槽的模板来使用。这样我们就可以把 `v-slot` 直接用在组件上：

```html
<todo-list v-slot="slotProps">
	<i class="fas fa-check"></i>
	<span class="green">{{ slotProps.item }}</span>
</todo-list>
```

注意默认插槽的缩写语法**不能**和具名插槽混用，因为它会导致作用域不明确：

```html
<!-- 无效，会导致警告 -->
<todo-list v-slot="slotProps">
	<i class="fas fa-check"></i>
	<span class="green">{{ slotProps.item }}</span>

	<template v-slot:other="otherSlotProps"> slotProps 在此处不可用 </template>
</todo-list>
```

## 动态组件 component

动态组件不同组件之间进行动态切换是非常有用，以通过 Vue 的 `<component>` 元素加一个特殊的 `is` attribute 来实现：

```vue
<!-- 组件会在 `currentTabComponent` 改变时改变,可以在外面包裹keep-alive保存状态 -->
<component :is="currentTabComponent" name="test" @btnClick="btnClick">
</component>
<!-- component组件中的属性，如name，会传递给对应的组件props接收，显示那个组件，哪个组件就接收 -->
<script>
export default {
	components: {
		Home,
		Tab,
		Bottom
	},
	data() {
		return {
			currentTabComponent: 'Home'
		}
	},
	methods: {
		btnClick() {
			console.log('组件内部发生了点击')
		}
	}
}
</script>

<!--Home-->
<template>
	<button @click="$emit('btnClick')"></button>
</template>
```

```vue
<component :is="component" v-if="component" />
<script>
export default {
	props: {
		appName: {
			type: String
		}
	},
	data() {
		return {
			component: null
		}
	},
	computed: {
		loader() {
			return () => import(`./${this.appName}.vue`)
		}
	},
	mounted() {
		this.loader()
			.then(() => {
				this.component = () => this.loader()
			})
			.catch(() => {
				this.component = () => import('./default.vue')
			})
	}
}
</script>
```

### 子组件间互相传值

- 获取第一个子组件的 ref，将值存储在 data 中，在通过 props 传递给第二个组件，因为
  - component 组件中的属性，如 name，会传递给对应的组件**props 接收，显示那个组件，哪个组件就接收**

```js
<component
    :is="newEmployeeStep[stepActive]"
    ref="stepRef"
    :right_phone="right_phone"
></component>

// data
right_phone： ''

onNext() {
    this.loading = true
    // 只有第一步跳转第二部的时候才会赋值，后面要做判断
    this.right_phone = this.$refs.stepRef.phoneFrom.phone

    if(this.stepActive >= 2) return
    this.stepActive++
}
```

## 异步组件

### webpack 分包引入

```js
import('./sum').then({ sum } => {  // 通过import函数引入以后不会放在dist/app文件里面
    sum(10,30)
})
```

当所有的组件都放在 App.vue 里的时候，那么随着组件的增多，一层一层依赖打包以后，会导致打包后的 dist/app.js 文件非常的庞大，那么就会导致首屏渲染的时候特别慢。

只在需要的时候才从服务器加载一个模块,打包以后会放在单独的文件，不会全部放在 app.js 文件中。为了实现这个效果，Vue 有一个 `defineAsyncComponent` 方法：

https://v3.cn.vuejs.org/api/global-api.html#defineasynccomponent

```vue
<script>
// const asyncComponent = defineAsyncComponent(({
// loader:() => import("./async-component"),
// loadingComponent: loading 当异步组件没有加载好的时候渲染这个组件，需要引入
// delay: 200 异步组件如果规定时间没有加载完成再显示loadingComponent组件
// })
// 异步组件
import { defineAsyncComponent } from 'vue'
const asyncComponent = defineAsyncComponent(() => import('./async-component')) // 异步组件

export default {
	components: {
		Home,
		Tab,
		Bottom
	},
	data() {
		return {
			currentTabComponent: 'Home'
		}
	}
}
</script>
```

## Suspense

**Suspense**是一个内置的全局组件，有两个插槽

**default**：如果 default 可以显示，那么就显示 default 的内容

**fallback**：如果 default 无法显示，那么会显示 fallback 插槽的内容

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

## $Ref

**获得对模板内元素或组件实例的引用**

```vue
<div ref="root">This is a root element</div>
<!--vue3中使用-->
<script>
setup() {
  const root = ref(null)

  onMounted(() => {
    // DOM 元素将在初始渲染后分配给 ref
    console.log(root.value) // <div>This is a root element</div>
  })

  return {
    root
  }
}
</script>
```

**调用方法**

```vue
<div>
    <test-component ref="test"></test-component>
    <button @click="btnClick"></button>
</div>
<!--vue3中使用-->
<script>
export default {
	methods: {
		btnClick() {
			// 如果是绑定引入的组件的，那么获取到的是proxy对象,也就是组件实例
			console.log(this.$ref.test.message) // 你好
			this.$refs.test.show() // 我被调用了
		}
	}
}
</script>

<!--test-component-->
<script>
export default {
	data() {
		return {
			message: '你好'
		}
	},
	methods: {
		show() {
			// 甚至可以被调用
			console.log('我被调用了')
		}
	}
}
</script>
```

### $parent $root

```js
// 组件只有有一个父组件$parent，因为就像类一样，组件被引用的时候就会创建一个实例，每个实例对应一个父组件$parent
// console.log(this.$parent.message) 获取父组件的data数据
// console.log(this.$root.message) 获取根组件的data数据
// 不推荐使用
```

### $el

```js
// 组件实例正在使用的根 DOM 元素。
// console.log(this.$refs.navBar.$el)
```

## keep-alive

**name 是组件里面的 name 属性**

- **Props：**

  - `include` - `string | RegExp | Array`。只有名称匹配的组件会被缓存。
  - `exclude` - `string | RegExp | Array`。任何名称匹配的组件都不会被缓存。
  - `max` - `number | string`。最多可以缓存多少组件实例。

- **用法：**

  `<keep-alive>` 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。和 `<transition>` 相似，`<keep-alive>` 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中。

  当组件在 `<keep-alive>` 内被切换时，它的 `mounted` 和 `unmounted` 生命周期钩子不会被调用，取而代之的是 `activated` 和 `deactivated`。(这会运用在 `<keep-alive>` 的直接子节点及其所有子孙节点。)

  主要用于保留组件状态或避免重新渲染。

  ```html
  <!-- 基本 -->
  <keep-alive>
  	<component :is="view"></component>
  </keep-alive>

  <!-- 多个条件判断的子组件 -->
  <keep-alive>
  	<comp-a v-if="a > 1"></comp-a>
  	<comp-b v-else></comp-b>
  </keep-alive>

  <!-- 和 `<transition>` 一起使用 -->
  <transition>
  	<keep-alive>
  		<component :is="view"></component>
  	</keep-alive>
  </transition>
  ```

  注意，`<keep-alive>` 是用在其一个直属的子组件被切换的情形。如果你在其中有 `v-for` 则不会工作。如果有上述的多个条件性的子元素，`<keep-alive>` 要求同时只有一个子元素被渲染。

- **`include` 和 `exclude`**

  `include` 和 `exclude` prop 允许组件有条件地缓存。二者都可以用逗号分隔字符串、正则表达式或一个数组来表示：

  ```html
  <!-- 逗号分隔字符串 -->
  <keep-alive include="a,b">
  	<component :is="view"></component>
  </keep-alive>

  <!-- regex (使用 `v-bind`) -->
  <keep-alive :include="/a|b/">
  	<component :is="view"></component>
  </keep-alive>

  <!-- Array (使用 `v-bind`) -->
  <keep-alive :include="['a', 'b']">
  	<component :is="view"></component>
  </keep-alive>
  ```

  匹配首先

  检查组件自身的 `name` 选项，如果 `name` 选项不可用，则匹配它的局部注册名称 (父组件 `components` 选项的键值)。匿名组件不能被匹配。

- **`max`**

  最多可以缓存多少组件实例。一旦这个数字达到了，在新实例被创建之前，已缓存组件中最久没有被访问的实例会被销毁掉。

  ```html
  <keep-alive :max="10">
  	<component :is="view"></component>
  </keep-alive>
  ```

**currentTabComponent 的值**是：

- 可以是通过**component**函数注册的组件，**全局注册**
- 在一个组件对象的**components 对象**中注册的组件，**局部注册**

### 缓存组件生命周期

对于缓存的组件而言，再次进入时，**不会执行 created 和 mounded**等生命周期函数

但是有时候希望监听到**何时重新进入**了缓存组件，**何时离开了**组件

这个时候可以使用**activated 和 deactivated**这两个生命周期钩子函数来监听

## template

因为 v-if 是一个指令，所以必须将其添加到一个元素上，但是如果我们希望切换的是多个元素呢？

此时我们渲染 div，但是我们**并不希望**div 这种元素被渲染；

这个时候，我们可以选择 template；

**template 元素可以当做不可见的包裹元素**，并且在**v-if**上使用，但是最终 template 不会被渲染出来：有点类似于小程序中的 block

**v-show 不支持 template**

```vue
<!--不推荐在ul里面使用div，可以使用template进行包裹-->
<template v-if="isShow">
	<ul>
		<template v-for="(item, index) in 10">
			<li>{{ item }}</li>
		</template>
		<template>
			<li v-for="(item, index) in 10"></li>
		</template>
	</ul>
</template>
```

## vue 数组更新检测

### 数组方法

```js
//Vue将侦听到的数组的变更方法进行了包裹，所以它们也将触发视图更新，这些被包裹的方法包括：
push()
pop()
shift()
unshift()

sort() //排序 sort((a, b) => { ... } )
//return -1 那么 a 会被排列到 b 之前,即参数a,b的顺序保存原样
//return  0 , a 和 b 的相对位置不变
//return  >0 , b 会被排列到 a 之前,即交换参数a,b的顺序

reverse() //翻转数组的排序

splice() //做删除 插入 替换用的
//删除:splice(index,count) index:开始位置的索引 count:要删除元素的个数
//插入:splice(index,0,插入的项)
//替换:splice(index,1,插入的项) 删除1个，插入新的值
//替换多个:splice(0, 2, 'parrot', 'anemone', 'blue') 删除2个，插入新的值
```

```js
//替换数组的方法：上面数组的方法会直接修改原来的数组，但是某些方法不会替换原来的数组，而是会生成新的数组，比如
filter()
concat()
slice(start, end) //截取用的 参数:start:开始位置的索引 end:结束位置的索引(但不包含该索引位置的元素)
//这些方法就要使用data里面的变量接受新的数组，然后才会发生改变，发生更新
```

```js
const string = 'hello world'
string.split(' ').reverse().join('') //
```

### watch

```js
//默认情况下监听器只会针对监听的数据本身的改变(内部的变化时不能监听到的，也就是对象的某一个属性发生了改变监听不到，对象被重新赋值可以监听的到)

//vue2深度监听/立刻执行(一定会执行一次)
watch:{
    info:{
        handler:function(new,old){
            console.log(new,old)
        },
        deep:true,immediate:true
    },
    'info.name':function(new,old){//直接监听对象中的某个对象
            console.log(new,old)
    }
}

//多个函数,传入回调数组，会逐一调用
watch:{
    info:[
        'fun',//methods中的函数
        function handle2(new,old){
            console.log(new,old)
        }
        handler:function(new,old){
            console.log(new,old)
        }
    ],
}
```

#### $watch

```js
created(){
    const unwatch = this.$watch('info',(new,old)=>{
        console.log(new,old)
    },{deep:true,immediate:true})

    unwatch()//返回值可以取消监听
}
```

## $set

- **参数**：

  - `{Object | Array} target`
  - `{string | number} propertyName/index`
  - `{any} value`

- **返回值**：设置的值。

- **用法**：

  向响应式对象中添加一个 property，并确保这个新 property 同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新 property，因为 Vue 无法探测普通的新增 property (比如 `this.myObject.newProperty = 'hi'`)

  注意对象不能是 Vue 实例，或者 Vue 实例的根数据对象。

`若直接对data内的数组、对象进行修改，不会触发视图更新,如何正确修改数组、对象以触发视图更新`

```js
//1.使用数组方法可以被检测的到
//2.对数组/对象重新赋值
//如果是数组或者对象中的某个发生变化就检测不到
//$set(obj/arr,属性名/index,修改后的值)
created() {
    this.$set(this.items, 1, 'excess')
    this.$set(this.object, 'test', 'newthing')
}
```

## $delete

Vue.delete( target, propertyName/index

- - `{Object | Array} target`
  - `{string | number} propertyName/index`

- **用法**：

  删除对象的 property。如果对象是响应式的，确保删除能触发更新视图。这个方法主要用于避开 Vue 不能检测到 property 被删除的限制，但是你应该很少会使用它。

  目标对象不能是一个 Vue 实例或 Vue 实例的根数据对象。

  ```js
  created() {
      this.$delete(this.items, 1)
      this.$delete(this.object, 'test')
  }
  ```

## 对象的深浅拷贝

### 浅拷贝

只能拷贝对象，不能拷贝对象中的对象，对象中的对象保存的是地址值，拷贝的也只是地址值

```js
const person = {name:'name',age:{height:1.80'}}
const newA = Object.assign({},person) //将对象a中的所有属性拷贝一份放在前面的{}里
newA.age.height = 1.89
console.log(newA.c.d) // 1.89 依然会发生改变

//lodash
var objects = [{ 'a': 1 }, { 'b': 2 }];

var shallow = _.clone(objects);
console.log(shallow[0] === objects[0]); //true
```

### 深拷贝

可以拷贝对象中的对象

```js
//lodash
var objects = [{ a: 1 }, { b: 2 }]

var deep = _.cloneDeep(objects)
console.log(deep[0] === objects[0]) // => false
```

## 组件名大小写

在字符串模板或单个文件组件中定义组件时，定义组件名的方式有两种：

#### 使用 kebab-case

横线命名

```js
app.component('my-component-name', {
	/* ... */
})
```

当使用 kebab-case (短横线分隔命名) 定义一个组件时，你也必须在引用这个自定义元素时使用 kebab-case，例如 `<my-component-name>`。

#### 使用 PascalCase

驼峰命名

```js
app.component('MyComponentName', {
	/* ... */
})
```

当使用 PascalCase (首字母大写命名) 定义一个组件时，你在引用这个自定义元素时两种命名法都可以使用。也就是说 `<my-component-name>` 和 `<MyComponentName>` 都是可接受的。注意，尽管如此，直接在 DOM (即非字符串的模板) 中使用时**只有 kebab-case 是有效的**。

**注册组件可以使用驼峰命名法，使用组件尽量使用横线命名**

## 全局组件

全局组件往往是在应用程序一开始就会全局组件完成，也就意味着即使有些组件没有用到也会进行打包，那么用户就会增加无用的包。

```js
//解决方式，只有需要的时候才会引入数组中注册成为全局组件
import { App } from 'vue'
//import Loading from './loading/loading.vue'
import LoadingPage from './loading/loading-page.vue'

const components = [
	// Loading,LoadingPage
	LoadingPage
]

export {
	// Loading,LoadingPage
	LoadingPage
}

export default function (app: App) {
	components.forEach((item) => app.component(item.name, item))
}
```

## 开发依赖

```js
//开发依赖是只有开发阶段才会用到的包
npm i 'package' --save-dev
npm i 'package' -D // 简写
npm install 包@next  //下载最新的包
```

## 认识 h 函数

- Vue 推荐在绝大数情况下使用模板来创建你的 HTML，然后一些特殊场景，你真的需要 javascript 的完全编程的能力，这个时候你可以使用渲染函数，它比模板更接近编译器。
  - VNode 和 VDOM 的改变
  - Vue 在生成真实的 Dom 之前，会将我们的节点转换成 VNode，而 VNode 组合在一起形成**一棵树结构**，就是**虚拟 DOM(VDOM)**
  - 事实上，我们之前编写的 template 中的 HTML 最终也是**使用渲染函数**生成对应的 VNode
  - 那么，如果需要充分利用 javaScript 的编程能力，我们可以自己来编写**createVNode 函数**，**生成对应的 VNode**
  - 模板 template 先使用**render 函数**转化为**VNode**,VNode 再转化成**真实 DOM**，要做的就是我们自己编写**render 函数**
- 为了实现这样的目的，就要使用 h()函数
  - **h()函数**是一个用于**创建 vnode 的一个函数**
  - 更精准的命名是**createVNode()函数**，但是为了简便在 Vue 将之**简化为 h()函数**

`h()` 函数是一个用于创建 VNode 的实用程序。也许可以更准确地将其命名为 `createVNode()`，但由于频繁使用和简洁，它被称为 `h()` 。它接受三个参数：

```js
// @returns {VNode}
h(
	// {String | Object | Function} tag
	// 一个 HTML 标签名、一个组件、一个异步组件、或
	// 一个函数式组件。
	//
	// 必需的。
	'div',

	// {Object} props
	// 与 attribute、prop 和事件相对应的对象。
	// 这会在模板中用到。
	//
	// 可选的。
	{},

	// {String | Array | Object} children
	// 子 VNodes, 使用 `h()` 构建,
	// 或使用字符串获取 "文本 VNode" 或者
	// 有插槽的对象。
	//
	// 可选的。
	[
		'Some text comes first.',
		h('h1', 'A headline'),
		h(MyComponent, {
			someProp: 'foobar'
		})
	]
)
```

如果没有 prop，那么通常可以将 children 作为第二个参数传入。如果会产生歧义，可以将 `null` 作为第二个参数传入，将 children 作为第三个参数传入。

```vue
<script>
import { h } from 'vue'
    export default {
        setup() {
            const num = ref(0)

            return {
                num
            }
        }
        render() {
            return h('h2', {class: 'title'}, {
                h('h2', null, '当前计数：${ this.num }'),
                h('button', {
                    onClick:() => this.num++
                }, '+1')

            })
        }
    }
</script>
```

**setup 写法**

```vue
<script>
import { h } from 'vue'
    export default {
        setup() {
            const num = ref(0)

            return () => {
                return h('h2', {class: 'title'}, {
                    h('h2', null, '当前计数：${ num.value }'),
                    h('button', {
                            onClick:() => num.value++
                        },
                    '+1')
                })
            }
        }

    }
</script>
```

## jsx 的使用

**现在 webpack 脚手架默认可以使用 jsx**

https://www.aliyundrive.com/drive/folder/6166f689283de68e8c19431ba3ae6d891f86ed8f

- 如果需要在**项目中使用 jsx**，那么需要添加对 jsx 的支持

  - 通过**Babel 进行转换**(React 编写的 jsx 也是通过 babel 转换的)
  - 对于 Vue 来说，我们只需要在 Babel 中配置对应的插件即可

- 安装**Babel 支持 Vue 的 jsx**插件

  - ```base
    npm install @vue/babel-plugin-jsx -D
    ```

- 在**babel.config.js**配置插件

  - ```js
    module.export = {
    	presets: ['@vue/cli-plugin-babel/preset'],
    	plugins: ['@vue/babel-plugin-jsx']
    }
    ```

  ```jsx
  <script>
     export default {
         setup() {
             const num = ref(0)
  ```

         }
         render() {
             const add = () => this.num++

             return (
                 <div>
                     <h2>
                         { num }
                     </h2>
                     <button onClick={ add }></button>
                 </div>
             )
         }

  }

  </script>

```

```
