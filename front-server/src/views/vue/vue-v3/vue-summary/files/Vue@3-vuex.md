## 安装

https://next.vuex.vuejs.org/zh/guide/modules.html

```js
npm i vuex@next  // 下载最新版本
```

## 持久化存储 vuex

将本地存储的数据每一次刷新后都注入 vuex

**mutations**

```js
saveToken(state: UserInfosState, token: string) {
	state.token = token
}
```

**actions**

```js
// actions异步获取token
async setToken({ commit }) {
    // axios->get(token)
    const token = '123'
    localCache.set('token', token, 'session')
    commit('saveToken', token)
},
// 本地存储数据注入vuex,可以注入多个
loadLocalData({ commit }) {
    commit('saveToken', localCache.get('token', 'session'))
    // commit('saveUserInfos', localCache.get('userInfos', 'session'))
},
```

**index 暴露出调用函数**

```js
// 找个地方调用，main可以，plugins也可以
export function setupStore() {
	store.dispatch('userInfos/loadLocalData')
}
```

## vuex 改动

使用模块化 vuex 后

```ts
//在modules中写模块，然后在interface文件夹中写接口，一定要暴露出去，然后才能使用它

// 主接口(顶级类型声明)
export interface RootStateTypes {
	//themeConfig: ThemeConfigState;
	routesList: RoutesListState
	//keepAliveNames: KeepAliveNamesState;
	//tagsViewRoutes: TagsViewRoutesState;
	userInfos: UserInfosState
	//requestOldRoutes: RequestOldRoutesState;
}
```

### vue2

#### state

```js
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

// mapState
computed： {
    ...mapState(['age', 'name']),
    ...mapState({
        sAge: age  => state.age, // 如果state的值和data的值冲突，可以更改名字
        sex: (state) => state.sex, // 第二种写法
    	from: function (state) { // 用普通函数this指向vue实例,要注意
          return this.str + ':' + state.from
        },
        // 注意下面的写法看起来和上面相同,事实上箭头函数的this指针并没有指向vue实例,因此不要滥用箭头函数
        // from: (state) => this.str + ':' + state.from
        myCmpted: function () {
          // 这里不需要state,测试一下computed的原有用法
          return '测试' + this.str
        }),
}
```

#### mutations

```js
// mapMutations
<button @click="addAge({ num:123 })"><button>
methods:{
 ...mapMutations(['addAge'])
}

```

#### getters

```js
// mapGetters
{{ $store.getters.name }}
getters: {// modules中,getters可以调用其他的getters
    num(state, getters) {

    }
}
getters: {// 往getter中传参数
    hasNum(state) {
        return (num) => {
            return state.allNum.map((_) => {
                return _ > num
            })
        }
    }
}
computed： {
	...mapGetters(['realname','money_us'])
    ...mapGetters({
        realname: 'name'
    })
}
// 命名空间中使用辅助函数，可以使用createNamespacedHelpers，也可以：
import { mapGetters } from 'vuex'
computed: {
    ...mapGetters(['common/getQueryParams'])
}
created() {
    console.log(this['common/getQueryParams'])
}
```

#### actions

```js
// mapActions
methods:{
 ...mapActions(['addAge'])
}
/* Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters */
actions: {
    num({commit, state, getters, dispatch, rootGetters, rootState}) {

    }
}

// action可以返回一个promise
action: {
    getName() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('异步')
            },1000)
        }).catch(err => {
            console.log(err)
        })
    }
}
// 返回值可以是一个promise对象
store.dispatch('getName').then(res => {

})
```

#### 命名空间使用 map 辅助函数

[vuex](https://vuex.vuejs.org/zh/guide/modules.html#%E5%B8%A6%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E7%9A%84%E7%BB%91%E5%AE%9A%E5%87%BD%E6%95%B0)

**命名空间使用辅助函数**

```vue
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapActions } = createNamespacedHelpers('common')
export default {
    computed: {
        ...mapGetters(['getQueryParams']),
        ...mapState(['state'])
    },
    methods: {
        ...mapActions(['fun'])
    }
    create() {
        console.log(this.getQueryParams)
    }
}
</script>
```

### vue3

#### **useMap**

```js
// import { useStore } from 'vuex'
import { store } from '@/store'
import { computed } from 'vue'
export const useMap = (mapper: any,mapTypeFns: any) => {
	// 获取到对应的对象function：{name：function，age：function}
	const mapFns = mapTypeFns(mapper)

	// 对数据进行转换
	const mapTypeState = {} as any
	Object.keys(mapFns).forEach(fnKey => {
			const fn = mapFns[fnKey].bind({$store: store})
			mapTypeState[fnKey] = computed(fn)
	})

	return mapTypeState
}
```

#### **useState**

_模块封装_

```js
import { createNamespacedHelpers, mapState } from 'vuex'
import { useMap } from './useMaps'

export const useState = (moduleName: string, mapper: any) => {
	let mapperFn: any = mapState

	if (typeof moduleName === 'string' && moduleName.length > 0) {
		mapperFn = createNamespacedHelpers(moduleName).mapState
	}

	return useMap(mapper, mapperFn)
}

export default useState
```

```vue
<template>
	{{ exclude }}
</template>
<script lang="ts">
export default {
	setup() {
		const storeState = useState('keepAlive', ['exclude']) // 模块中使用

		const state = useState({
			sAge: (age) => state.age,
			sName: (age) => state.name
		})
		return {
			...state,
			...storeState
		}
	}
}
</script>
```

#### **useGetters**

_模块封装_

```js
import { mapGetters, createNamespacedHelpers } from 'vuex'
import { useMap } from './useMaps'

const useGetters = (moduleName: string, mapper: any) => {
	let mapperFn: any = mapGetters

	if (typeof moduleName === 'string' && moduleName.length > 0) {
		mapperFn = createNamespacedHelpers(moduleName).mapGetters
	}

	return useMap(mapper, mapperFn)
}

export default useGetters
```

**使用**

```vue
<template>
	{{ exclude }}
</template>
<script lang="ts">
import { useGetters } from '@/hooks'
export default {
	setup() {
		const storeState = useGetters('keepAlive', ['exclude']) // 模块名，模块中的getters

		const state = useGetters({
			sAge: (age) => state.age,
			sName: (age) => state.name
		})
		return {
			...state,
			...storeState
		}
	}
}
</script>
```

#### mapActions

不需要封装

```js
import { mapActions } from 'vuex'
setup() {
    const action = mapActions(['addAge'])
    const action2 = mapActions({
        add: 'addAge'
    })

    return {
        ...action,
        ...action2
    }
}

// action可以返回一个promise
action: {
    getName() {
        return axios.get('url')
    }
}
store.dispatch('getName').then(res => {

})
```

#### mapMutations

```js
import { mapMutations } from 'vuex'
setup() {
  const action = mapMutations(['addAge'])
    const action2 = mapMutations({
        add: 'addAge'
    })

    return {
        ...action,
        ...action2
    }
}
```

### vite

```js
// 封装好以后的store和useStore不要再直接从vuex中引入
{{ keepAlive.test }} // 模块中的state

import { store } from '@/store/index'
setup() {
    const { keepAlive } = toRefs(store.state) // 解构赋值vuex中的state
    return {
        keepAlive
    }
}
```

### Module

- 由于使用单一状态树，应用的所有状态会集中到一个比较大的对象，当应用变得非常复杂的时候，store 会变得非常的臃肿
- vuex 允许我们将 store 分割成模块(module)
- 每个模块拥有自己的 state，mutation，action，getter，甚至是嵌套子模块

#### 命名空间

默认情况下，模块内部的 action、mutation 和 getter 是注册在**全局命名空间**的——这样使得多个模块能够对同一 mutation 或 action 作出响应。

如果希望你的模块具有更高的封装度和复用性，你可以通过添加 **`namespaced: true`** 的方式使其成为带命名空间的模块。

当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名,也就是使用以后访问模块里面的东西要加上**模块名来访问**，而**不是直接注册在全局**里面

#### 基础语法

```js
import { useStore } from '@/store/index';
const store = useStore()
console.log(store.state.'模块'.'变量')

store.dispatch('userInfos/test', value)
store.commit('userInfos/test', { ...value }) // 传过去一个对象比较好
```

#### 辅助函数

```js
// 1.模块名， 模块变量
computed: {
    // 分模块
    ...mapState('home', ['homeAdd'])
    ...mapGetters('home', ['homeAdd'])
},
methods: {
    ...mapMutations('home', ['homeAdd']),
	...mapActions('home', ['homeAdd']),
}
```

推荐写法

```js
import { createNamespacedHelpers } from 'vuex'
const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('home')

export default {
    computed: {
        ...mapState(['homeAdd'])
        ...mapGetters(['homeAdd'])
    },
    methods: {
        ...mapMutations(['homeAdd']),
        ...mapActions(['homeAdd']),
    }
}
```

#### state

```js
const { keepAlive } = toRefs(store.state)
const age = computed(() => store.state.age)

return {
	keepAlive // {{ keepAlive.test }}
}
```

#### getters

- 类型: `{ [key: string]: Function }`

在 store 上注册 getter，getter 方法接受以下参数：

```js
state,     // 如果在模块中定义则为模块的局部状态
getters,   // 等同于 store.getters
```

当定义在一个模块里时会特别一些：

```js
state, // 如果在模块中定义则为模块的局部状态
	getters, // 等同于 store.getters
	rootState // 等同于 store.state
rootGetters // 所有 getters
```

```js
getters: {
	sample: (state, getters, rootState, rootGetters) => {}
}
```

注册的 getter 暴露为 `store.getters`。

```js
// {{ $store.getters['routesList/routesList'] }} 命名空间
store.getters['keepAlive/include']
const include = computed(() => store.getters['keepAlive/include'])
```

#### actions

- 类型: `{ [type: string]: Function }`

在 store 上注册 action。处理函数总是接受 `context` 作为第一个参数，`payload` 作为第二个参数（可选）。

`context` 对象包含以下属性：

```js
state, // 等同于 `store.state`，若在模块中则为局部状态
	rootState, // 等同于 `store.state`，只存在于模块中
	commit, // 等同于 `store.commit`
	dispatch, // 等同于 `store.dispatch`
	getters, // 等同于 `store.getters`
	rootGetters // 等同于 `store.getters`，只存在于模块中
```

```js
// 如何调用根下的commit
// 参数：根方法， 参数(没有设置为空)， 指定为root
actions: {
	sample: ({ commit, dispatch }) => {
		commit('add', null, { root: true })
		dispatch('add', null, { root: true })
	}
}
```

# pinia

https://juejin.cn/post/7057439040911441957

## 使用

```vue
<script setup lang="ts" name="conponent">
import { storeToRefs } from 'pinia'
import appStore from '@/store'

// setup composition API模式
const { count } = storeToRefs(appStore.useCounterStoreForSetup)
const { increment, doubleCount } = appStore.useCounterStoreForSetup
</script>
```
