## router 路由

https://next.router.vuejs.org/zh/introduction.html

### setup

因为我们在 `setup` 里面没有访问 `this`，所以我们不能再直接访问 `this.$router` 或 `this.$route`。作为替代，我们使用 `useRouter` 函数：

```js
import { useRouter, useRoute } from 'vue-router'
export default {
	setup() {
		const router = useRouter()
		const route = useRoute()
	}
}
```

`route` 对象是一个响应式对象，所以它的任何属性都可以被监听，但你应该**避免监听整个 `route`** 对象：

```
import { useRoute } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    const userData = ref()

    // 当参数更改时获取用户信息
    watch(
      () => route.params,
      async newParams => {
        userData.value = await fetchUser(newParams.id)
      }
    )
  },
}
```

请注意，在模板中我们仍然可以访问 `$router` 和 `$route`，所以不需要在 `setup` 中返回 `router` 或 `route`。

### hash

- URL 的 hash 也就是锚点(#)，本质上是改变**window.location 的 href**属性
- 我们可以通过直接赋值 location.hash 来改变 href，但是界面**不发生刷新**
- hash 的优势就是兼容性好，在老版的 IE 中也可以运行，但是缺陷是有一个#，显得不像是一个真实的路径

**原理**

```html
<div>
	<a href="#/home"></a>
	<a href="#/about"></a>

	<div class="content"></div>
</div>
<script>
	const EL = document.querySelector('.content')
	window.addEventListen('hashchange', () => { // 监听hash值得改变
	    switch(location.hash) { // 判断hash值
	    	case '#/home'
	            EL.innerText = 'home'
	            break
	        case '#/about'
	            EL.innerText = 'about'
	            break
	    }
	})
</script>
```

### history

`createWebHistory`路由模式路径不带#号(生产环境下不能直接访问项目，需要 nginx 转发)

- history 接口是 HTML5 新增的，它有六种模式改变 URL 而不刷新界面
  - replaceState：替换原来的路径
  - pushState：使用新的路径
  - popState：路径的回退
  - go：向前或向后改变路径
  - forward：向前改变路径
  - back：向后改变路径

**原理**

```html
<div>
	<a href="/home"></a>
	<a href="/about"></a>

	<div class="content"></div>
</div>
<script>
	const EL = document.querySelector('.content')
	const aEls = document.getElementByTagName('a')
	for(let aEl of aEls) {
	    aEl.addEventListen('click', (e) => {
	        e.preventDefault() // 阻止a标签的默认行为，也就是不要跳转，跳转以后是会真的向服务器发起静态资源请求
	        const href = aEl.getAttribute('href')
	        history.pushState({}, '', href)
	        switch(location.pathname) { // 判断hash值
	            case '/home'
	                EL.innerText = 'home'
	                break
	            case '/about'
	                EL.innerText = 'about'
	                break
	        }
	    })
	}
</script>
```

```ts
const router = createRouter({
	history: createWebHistory(),
	routes
})
//提供的可选 base。当应用程序被托管在诸如 https://example.com/folder/ 之类的文件夹中时非常有用。
createWebHistory() // 没有 base，应用托管在域名 `https://example.com` 的根目录下。
createWebHistory('/folder/') // 给出的网址为 `https://example.com/folder/`
```

`createWebHashHistory`路由模式路径带#号

http://localhost:8080/

```ts
const router = createRouter({
	history: createWebHashHistory(),
	routes
})
```

### 编程式路由传参

[vue-router](https://router.vuejs.org/zh/guide/essentials/navigation.html#%E5%AF%BC%E8%88%AA%E5%88%B0%E4%B8%8D%E5%90%8C%E7%9A%84%E4%BD%8D%E7%BD%AE)

```js
// 字符串路径
router.push('/users/eduardo')

// 带有路径的对象
router.push({ path: '/users/eduardo' })

// 命名的路由，并加上参数，让路由建立 url
router.push({ name: 'user', params: { username: 'eduardo' } })

// 带查询参数，结果是 /register?plan=private
router.push({ path: '/register', query: { plan: 'private' } })

// 带 hash，结果是 /about#team
router.push({ path: '/about', hash: '#team' })
```

**注意**：如果提供了 `path`，`params` 会被忽略，上述例子中的 `query` 并不属于这种情况。取而代之的是下面例子的做法，你需要提供路由的 `name` 或手写完整的带有参数的 `path` ：

```js
const username = 'eduardo'
// 我们可以手动建立 url，但我们必须自己处理编码
router.push(`/user/${username}`) // -> /user/eduardo
// 同样
router.push({ path: `/user/${username}` }) // -> /user/eduardo
// 如果可能的话，使用 `name` 和 `params` 从自动 URL 编码中获益
router.push({ name: 'user', params: { username } }) // -> /user/eduardo
// `params` 不能与 `path` 一起使用
router.push({ path: '/user', params: { username } }) // -> /user
```

### 路由懒加载

懒加载中加上**特定的注释**，webpack 打包以后就会将这个路由放在特定的文件

```js
{
    path: '/',
    component: () => import(/* webpackChunkName: 'home-chunk' */ '@/view/home')
}
```

### 嵌套路由

```js
const routes = [
	{
		path: '/user/:id',
		component: User,
		children: [
			{
				// 跳转默认路由，会显示profile。刷新以后也会加多一个profile
				path: '',
				redirect: '/profile'
			},
			{
				// 当 /user/:id/profile 匹配成功
				// 子路由前面不加 /
				path: 'profile',
				component: UserProfile
			}
		]
	}
]
```

### 默认子路由

```js
// 子路由的默认路由就是''，可是当使用重定向的时候，如果重定向到父路由'寸题金库'，那么无法默认显示'首页'子路由，而需要直接跳转到子路由首页
	{
		path: '/',
		redirect: { name: '首页' }
	},
	{
		path: '/',
		name: '寸题金库',
		component: () => import('@/views/Home.vue'),
		meta: { // 自定义属性
			requireAuth: false
		},
		// redirect: '/home',
		children: [
			{
				path: '',
				name: '首页',
				component: () => import('@/views/About.vue')
			},
		]
    }
```

### 路由重定向

```js
import type { RouteRecordRaw } from 'vue-router'
// 无论重定向放哪里，如果不想显示localhost:3000/home,然后刷新还加多一个home的话，那么子路由的path要为'',重定向使用name属性
export const staticRoutes: Array<RouteRecordRaw> = [
	// 重定向放在外面
	// {
	// 	path: '/',
	// 	redirect: { name: '首页' }
	// },
	{
		path: '/',
		name: '寸题金库',
		component: () => import('@/views/Home.vue'),
		meta: {
			requireAuth: false
		},
		// 重定向放在里面
		redirect: { name: '首页' },
		children: [
			{
				path: '',
				name: '首页',
				component: () => import('@/views/About.vue'),
				meta: {
					requireAuth: false
				}
			}
		]
	},
	{
		// 当匹配不到路由就跳转到这个界面
		path: '/:catchAll(.*)',
		name: '默认界面',
		component: () => import('@/views/404.vue')
	}
]
```

### 动态路由匹配

```js
const routes = [
	// 动态段以冒号开始
	{ path: '/users/:id', component: User }
]

// $route.params.id
```

你可以在同一个路由中设置有多个 _路径参数_，它们会映射到 `$route.params` 上的相应字段。例如：

| 匹配模式                       | 匹配路径                 | $route.params                            |
| ------------------------------ | ------------------------ | ---------------------------------------- |
| /users/:username               | /users/eduardo           | `{ username: 'eduardo' }`                |
| /users/:username/posts/:postId | /users/eduardo/posts/123 | `{ username: 'eduardo', postId: '123' }` |

除了 `$route.params` 之外，`$route` 对象还公开了其他有用的信息，如 `$route.query`（如果 URL 中存在参数）、`$route.hash` 等。

### 动态添加路由

在做后台管理系统的时候，**不同的角色对应不同的权限**，虽然可以改变菜单，但是用户可以**改变 url 进行非法访问**，当然也可以给路由的 meta 加上变量判断权限，要实现以上的效果，动态添加路由就显得十分重要

- 菜单动态生成路由

动态路由主要通过两个函数实现。`router.addRoute()` 和 `router.removeRoute()`。它们**只**注册一个新的路由，也就是说，如果新增加的路由与当前位置相匹配，就需要你用 `router.push()` 或 `router.replace()` 来**手动导航**，才能显示该新路由。

```js
// router.js
const categroy = {
	path: '/categroy',
	component: () => import('@/views/categroy.vue')
}

router.addRoute(categroy) // 顶级路由添加

router.addRoute('home', {
	// 添加子路由
	path: 'moment',
	component: () => import('@/views/home/components/moment.vue')
})

router.addRoute({
	// 添加子路由
	name: 'admin',
	path: '/admin',
	component: Admin,
	children: [{ path: 'settings', component: AdminSettings }]
})
```

### 删除路由

有几个不同的方法来删除现有的路由：

- 通过添加一个名称冲突的路由。如果添加与现有途径名称相同的途径，会先删除路由，再添加路由：

  ```js
  router.addRoute({ path: '/about', name: 'about', component: About })
  // 这将会删除之前已经添加的路由，因为他们具有相同的名字且名字必须是唯一的
  router.addRoute({ path: '/other', name: 'about', component: Other })
  ```

- 通过调用

  ```js
  router.addRoute()
  ```

  返回的回调：

  ```js
  const removeRoute = router.addRoute(routeRecord)
  removeRoute() // 删除路由如果存在的话
  ```

  当路由没有名称时，这很有用。

- 通过使用

  ```js
  router.removeRoute()
  ```

  按名称删除路由：

  ```js
  router.addRoute({ path: '/about', name: 'about', component: About })
  // 删除路由
  router.removeRoute('about')
  ```

  需要注意的是，如果你想使用这个功能，但又想避免名字的冲突，可以在路由中使用*Symbol*作为名字。

当路由被删除时，**所有的别名和子路由也会被同时删除**

### 查看现有路由

Vue Router 提供了两个功能来查看现有的路由：

- [`router.hasRoute()`](https://next.router.vuejs.org/zh/api/#hasroute)：检查路由是否存在。
- [`router.getRoutes()`](https://next.router.vuejs.org/zh/api/#getroutes)：获取一个包含所有路由记录的数组。

### 404

_$route.params.pathMatch_ 获取用户乱输入的东西

```js
// 如果是有重定向的路由，直接改变url还是会重定向到那个网页，要$router的跳转才有用
// @click="$router.push('/about/asdasdad')"

{//当匹配不到路由就跳转到这个界面,后面加多一个*号就是会解析/，将/的参数放在数组里面，获取的时候就会获取用户乱输入的参数的数组
    path: '/:catchAll(.*)',
    name:'默认界面',
    component: () => import('@/views/404.vue')
}

{//当匹配不到路由就跳转到这个界面
    path: '/:pathMatch(.*)',
    name:'默认界面',
    component: () => import('@/views/404.vue')
}
```

## [路由导航守卫](https://next.router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%85%A8%E5%B1%80%E5%89%8D%E7%BD%AE%E5%AE%88%E5%8D%AB)

vue-router 提供的导航守卫主要用来通过跳转或取消的方式守卫导航。这里有很多方式植入路由导航中：全局的，单个路由独享的，或者组件级的。

- 当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于**等待中**。

  每个守卫方法接收两个参数：

  - **`to`**: 即将要进入的目标 [用一种标准化的方式](https://next.router.vuejs.org/zh/api/#routelocationnormalized)

  - **`from`**: 当前导航正要离开的路由 [用一种标准化的方式](https://next.router.vuejs.org/zh/api/#routelocationnormalized)

  - ```js
    router.beforeEach((to, from) => {
    	// ...
    	// 返回 false 以取消导航
    	return false
    })
    ```

- 可以**返回的值**如下:

  - **false**: **取消当前的导航**。如果浏览器的 URL 改变了(可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 `from` 路由对应的地址。

  - 没有返回值或者 undefine 那么就默认可以跳转

  - **路由地址**: 通过一个路由地址跳转到一个不同的地址，就像你调用 [`router.push()`](https://next.router.vuejs.org/zh/api/#push) 一样，你可以设置诸如 `replace: true` 或 `name: 'home'` 之类的配置。当前的导航被中断，然后进行一个新的导航，就和 `from` 一样。

  - **对象**：类似于 router.push({ path: '/login', query: ...})

  - 可选的第三个参数：vue2 中可以使用**next**，vue3 中不再推荐使用

  - ```js
    router.beforeEach((to, from) => {
    	if (to.path.indexof('/home') !== -1) {
    		return '/login'
    	}
    	return false
    })

    router.beforeEach((to, from) => {
    	const token = window.locoStorage.getItem('token')
    	if (to.path !== '/login' && !token) {
    		return '/login'
    	}
    })
    ```

## 完整的导航解析流程

- 导航被触发。

- 在失活的组件里调用 `beforeRouteLeave` 守卫。

- 调用全局的 `beforeEach` 守卫。

- 在重用的组件里调用 `beforeRouteUpdate` 守卫(2.2+)。

- 在路由配置里调用 `beforeEnter`。

- 解析异步路由组件。

- 在被激活的组件里调用 `beforeRouteEnter`。

- 调用全局的 `beforeResolve` 守卫(2.5+)。

- 导航被确认。

- 调用全局的 `afterEach` 钩子。

- 触发 DOM 更新。

- 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

  - `beforeRouteEnter` 守卫 **不能** 访问 `this`，因为守卫在导航确认前被调用，因此即将登场的新组件还没被创建。

    不过，你可以通过传一个回调给 `next` 来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数：

    ```js
    beforeRouteEnter (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
      })
    }
    ```

## router-link

https://next.router.vuejs.org/zh/api/#to

### v-slot 插槽

`<router-link>` 通过一个[作用域插槽](https://v3.vuejs.org/guide/component-slots.html#scoped-slots)暴露底层的定制能力。这是一个更高阶的 API，主要面向库作者，但也可以为开发者提供便利，大多数情况下用在一个类似 _NavLink_ 这样的组件里。

注意

记得把 `custom` 配置传递给 `<router-link>`，以防止它将内容包裹在 `<a>` 元素内。

```vue
<router-link to="/about" custom v-slot="{ href, route, navigate, isActive, isExactActive }">
  <NavLink :active="isActive" :href="href" @click="navigate" :class="'active':isActive">
    {{ route.fullPath }}
  </NavLink>
</router-link>
```

- `href`：解析后的 URL。将会作为一个 `<a>` 元素的 `href` 属性。如果什么都没提供，则它会包含 `base`。
- `route`：解析后的规范化的地址。
- `navigate`：触发导航的函数。 **会在必要时自动阻止事件**，和 `router-link` 一样。例如：`ctrl` 或者 `cmd` + 点击仍然会被 `navigate` 忽略。
- `isActive`：如果需要应用 [active class](https://next.router.vuejs.org/zh/api/#active-class)，则为 `true`。允许应用一个任意的 class。
- `isExactActive`：如果需要应用 [exact active class](https://next.router.vuejs.org/zh/api/#exact-active-class)，则为 `true`。允许应用一个任意的 class。

**示例：将激活的 class 应用在外层元素**

有的时候我们可能想把激活的 class 应用到一个外部元素而不是 `<a>` 标签本身，这时你可以在一个 `router-link` 中包裹该元素并使用 `v-slot` 属性来创建链接：

```vue
<router-link to="/foo" custom v-slot="{ href, route, navigate, isActive, isExactActive }">
  <li
    :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']"
  >
    <a :href="href" @click="navigate">{{ route.fullPath }}</a>
  </li>
</router-link>
```

提示

如果你在 `a` 元素上添加一个 `target="_blank"`，你必须省略 `@click="navigate"` 的处理。

### tag

- vue2 可以使用通过给 router-link 添加属性 tag 来更换 a 标签为你指定的标签
- vue3 使用属性 custom

### custom

- **类型**：`boolean`

- **默认值**：`false`

- **详细内容**：

  `<router-link>` 是否应该将其内容包裹在 `<a>` 元素中。在使用 [`v-slot`](https://next.router.vuejs.org/zh/api/#router-link-s-v-slot) 创建自定义 RouterLink 时很有用。默认情况下，`<router-link>` 会将其内容包裹在 `<a>` 元素中，即使使用 `v-slot` 也是如此。传递`自定义的` prop，可以去除这种行为。

- 这样外层就没有 a 标签了，里面想要跳的话，要借助**v-slot**的属性**navigate**

- **例如**：

  ```vue
  <router-link to="/home" custom v-slot="{ navigate, href, route }">
    <button @click="navigate">{{ route.fullPath }}</button>
  </router-link>
  ```

  渲染成 `<button>/home</button>`。

  ```
  <router-link to="/home" v-slot="{ route }">
    <span>{{ route.fullPath }}</span>
  </router-link>
  ```

  渲染成 `<a href="/home"><span>/home</span></a>`。

### to

```vue
<!-- 字符串 -->
<router-link to="/home">Home</router-link>

<!-- 使用 v-bind 的 JS 表达式 -->
<router-link :to="'/home'">Home</router-link>

<!-- 同上 -->
<router-link :to="{ path: '/home' }">Home</router-link>

<!-- 命名的路由 -->
<router-link :to="{ name: 'user', params: { userId: '123' } }">User</router-link>

<!-- 带查询参数，下面的结果为 `/register?plan=private` -->
<router-link :to="{ path: '/register', query: { plan: 'private' } }">
  Register
</router-link>
```

### replace

设置 `replace` 属性的话，当点击时，会调用 `router.replace()`，而不是 `router.push()`，所以导航后不会留下历史记录。

```vue
<router-link to="/abc" replace></router-link>
```

### active-class

- **默认值**：`"router-link-active"` (或者全局 [`linkActiveClass`](https://next.router.vuejs.org/zh/api/#linkactiveclass))

- **详细内容**：

  链接激活时，应用于渲染的 `<a>` 的 class。

```vue
<router-link to="/abc" active-class="hello-active"></router-link>

<style>
.hello-active {
	color: red;
}
</style>
```

### exact-active-class

- **默认值**：`"exact-active-class"` (或者全局 [`linkExactActiveClass`](https://next.router.vuejs.org/zh/api/#linkexactactiveclass))

- **详细内容**：

  链接精准激活时，应用于渲染的 `<a>` 的 class。

- 一般来说，就算**url 不匹配**，比如说跳转到**/home/title**，那么**home**这个**router-link**还是会有**active-class**，但是他不会有**exact-active-class**这个 class 属性,只有**url 精准匹配**的/home/title 才会有 exact-active-class 这个 class 属性，也就是**匹配的子路由的时候**，子路由的 router-link 才会有 exact-active-class 这个 class 属性

## router-view

- router-view 也提供了一个插槽，可以用于<transition>和<keep-alive>组件来包裹你的路由组件
- Component：要渲染的组件
- route：解析出的标准化路由对象

`<router-view>` 暴露了一个 `v-slot` API，主要使用 `<transition>` 和 `<keep-alive>` 组件来包裹你的路由组件。

_bug 记录：当回退时会出现白屏，单纯使用 router-view 不会 ，问题在于**router-view 里面的组件都要有根组件**，而且 router-view 里面只能有**一个节点**，也**不能有注释**，也会出现白屏_

```vue
<Suspense>
  <template #default>
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <keep-alive>
          <component
            :is="Component"
            :key="route.meta.usePathKey ? route.path : undefined"
          />
        </keep-alive>
      </transition>
    </router-view>
  </template>
  <template #fallback> Loading... </template>
</Suspense>
```

- `Component`: 要传递给 `<component>` 的 VNodes `是` prop。
- `route`: 解析出的标准化[路由地址](https://next.router.vuejs.org/zh/api/#routelocationnormalized)。

### 路由逻辑的处理

![图片](https://mmbiz.qpic.cn/mmbiz_png/HGCZWzWIk2mKuxdyF7typbJDjxmUlhb6swuLE468MQzSPO3cYFOZvTUz4cQeyh6FRW2mia5A71uw7PVvs6bJwPg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

视野中出现了焦点，也就出现了盲点。路由逻辑处理这块，我就坑到自己了，我焦点都在组合式 API，在组合式 API 文档我找不到进入路由时候的生命周期函数。结果就导致我部分页面逻辑写在了 router.js 里面。

```ts
// 路由文件
{
  path: '/index',
  component: HOME,
  beforeEnter: (to, from) => {
    if (from.path === "/read") {
      to.meta = {
        updateHistory: 'read',
      }
    }
  }
};
// 页面文件
watch(() => route.meta,(val) => {
  if (val.updateHistory) {
    getHistoryHandler()
  }
});
```

这是一个非常非常不好的写法，页面逻辑和路由逻辑耦合在一起，后期维护带来了很大的问题，后来同事指点，纠正了这个问题。我竟然忽略了它原来的语法，去执着与他的新语法。

![图片](https://mmbiz.qpic.cn/mmbiz_png/HGCZWzWIk2mKuxdyF7typbJDjxmUlhb60udzhXdQ8QN1ib12VkADOibtglgkZlMct8y1Piavjq7ZRUoXDjTAkv7kw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

所有页面需要统一的动态的一级路由前缀，即路由的一级域名不是由前端控制的，但是在实际开发中，前端路由规则是要关注一级路由的。按照一贯的逻辑是所有的路由配置动态路由即`path: '/:flag/index', path: '/:flag/listen'....`只要是有路由就需要在前面加上`/:flag`,某些情况下还需要处理在业务逻辑里面单独处理，这个逻辑混在比较多，不利于后期的维护。

想偷懒，思考有没有简单的解决方法，同事一番研究花了不少时间，不断试错不断研究，终于发现可在路由上面做文章，一句代码解决了大量重复的劳力。简直开心的不能再开心，分分钟搞定了 createWebHistory 支持设置 base 文件目录[2]

```ts
createWebHistory(location.pathname.split('/')[1])
```

## ![图片](https://mmbiz.qpic.cn/mmbiz_png/HGCZWzWIk2mKuxdyF7typbJDjxmUlhb6EtQnCEVIc69gR7FbrVVpu4iamOC70tibcRZm0tibFhYcE0ib33icuy9icoFQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

原来打包的时候还能动态的指定路由方式，真棒。

## Api

### scrollBehavior

使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样。 vue-router 能做到，而且更好，它让你可以自定义路由切换时页面如何滚动。

[滚动行为](https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html)

`savedPosition`，只有当这是一个 `popstate` 导航时才可用（由浏览器的后退/前进按钮触发）。

```js
const router = new Router({
	mode: 'history',
	fallback: false,
	routes,
	scrollBehavior(to, from, savedPosition) {
		if (to.path === '/home' && to.query.step) {
			const y = store.state.scrollMap[to.query.step]
			return { y }
		} else if (savedPosition) {
			return savedPosition
		} else {
			return { x: 0, y: 0 }
		}
	}
})
```

# 动态添加路由

## 路由数据封装

前台把路由写在代码里，这种方式只适用部分情况，所以大部分情况是路由后台提供，比如返回格式如下：

```js
{
    "id": 2000,
    "parentId": -1,
    "icon": "iconquanxian",
    "name": "权限管理",
    "path": "/organization",
    "component": "Layout",
    "redirect": null,
    "type": "0",
    "children": [{
        "id": 2100,
        "parentId": 2000,
        "children": [],
        "icon": "iconyonghuguanli",
        "name": "菜单管理",
        "path": "/menu",
        "component": "views/system/user/index",
        "redirect": null,
        "type": "0",
    }],

}]
```

} 这种是后台树型结构返回，前台不需要进行二次处理可以直接显示成菜单，

```html
<a-menutheme ="dark" mode="inline">
	<a-sub-menu v-for="subitem in menuData.menu" :key="subitem.path">
		<template #title>
			<Icon-font :type="subitem.icon" />
			<span
				>{{ subitem.name }}span> template>
				<a-menu-item v-for="item in subitem.children" :key="item.path"
					>{{ item.name }}a-menu-item> a-sub-menu> a-menu>
					<!--但是路由需要重新封装，先说说用到的字段，path-路由地址、component这个现在有两种，一种是Layout代表父菜单，另一种views开头的是组件地址。那么我们就可以开始动态生成路由了，写法和Vue2项目有所不同，首先定义一个方法--></a-menu-item
				></span
			></template
		></a-sub-menu
	></a-menutheme
>
```

### router.addRoute

```ts
const routerPackag = (routers) => {
	routers.filter((itemRouter) => {
		if (itemRouter.component != 'Layout') {
			router.addRoute('BasicLayout', {
				path: `${itemRouter.path}`,
				name: itemRouter.name,
				component: () => import(`@/${itemRouter.component}`)
			})
		}
		// 是否存在子集
		if (itemRouter.children && itemRouter.children.length) {
			routerPackag(itemRouter.children)
		}
		return true
	})
}
```

上面这个方式是动态生成路由，接下来就是调用这个方法。

```ts
getBasisMenu().then((res) => {
	if (res.code == 0) {
		routerPackag(res.data)
	}
})
```

### vite

**引入所有的菜单模块，然后通过接口获取后端返回来的用户菜单，过滤掉用户菜单中不存在的路由，然后映射剩余模块菜单的路由引入路径**

- 引入模块

```typescript
// vite
const layoutModules: any = import.meta.glob('../layout/routerView/*.{vue,tsx}')
const viewsModules: any = import.meta.glob('../views/**/*.{vue,tsx}')

// webpack
const layoutModules = require.context('../layout/routerView', true, /\.vue$/)
```

- 总执行函数(store)

  ```typescript
  export async function initBackEndControlRoutes() {
  	// 界面 loading 动画开始执行
  	if (window.nextLoading === undefined) NextLoading.start()
  	// 无 token 停止执行下一步
  	if (!Session.get('token')) return false
  	// 触发初始化用户信息
  	store.dispatch('userInfos/setUserInfos')
  	// 获取路由菜单数据
  	const res: any = await getBackEndControlRoutes()
  	// 存储接口原始路由（未处理component），根据需求选择使用
  	store.dispatch('requestOldRoutes/setBackEndControlRoutes', JSON.parse(JSON.stringify(res.data)))
  	// 处理路由（component），替换 dynamicRoutes（/@/router/route）第一个顶级 children 的路由
  	dynamicRoutes[0].children = await backEndComponent(res.data)
  	// 添加动态路由
  	await setAddRoute()
  	// 设置递归过滤有权限的路由到 vuex routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
  	setFilterMenuAndCacheTagsViewRoutes()
  }
  ```

  - getBackEndControlRoutes **判断不同的用户返回不同的菜单路由**

    ```typescript
    /**
     * 请求后端路由菜单接口
     * @description isRequestRoutes 为 true，则开启后端控制路由
     * @returns 返回后端路由菜单数据
     */
    export function getBackEndControlRoutes() {
    	// 模拟 admin 与 test
    	const auth = store.state.userInfos.userInfos.roles[0]
    	// 管理员 admin
    	if (auth === 'admin') return Menu.getMenuAdmin()
    	// 其它用户 test
    	else return Menu.getMenuTest()
    }
    ```

  - backEndComponent

    ```typescript
    /**
     * 后端路由 component 转换
     * @param routes 后端返回的路由表数组
     * @returns 返回处理成函数后的 component
     */
    export function backEndComponent(routes: any) {
    	if (!routes) return
    	return routes.map((item: any) => {
    		if (item.component) item.component = dynamicImport(dynamicViewsModules, item.component as string)
    		// 有children就进行递归
    		item.children && backEndComponent(item.children)
    		return item
    	})
    }
    ```

  - dynamicImport

    - keys 里面是模块的路径，将前面的**../view 等去掉**，然后进行匹配，**利用 startsWith 方法**，如果**菜单中有而且用户的路由中也有**就留下，也就是相当于过滤掉用户没有权限的菜单了
    - startsWith 方法用来判断当前字符串是否以另外一个给定的子字符串开头，并根据判断结果返回 `true`
    - **返回的就是路径的函数**了*() => import("/src/layout/routerView/iframes.vue")*

    ```typescript
    /**
     * 后端路由 component 转换函数
     * @param dynamicViewsModules 获取目录下的 .vue、.tsx 全部文件
     * @param component 当前要处理项 component
     * @returns 返回处理成函数后的 component
     */
    export function dynamicImport(dynamicViewsModules: Record<string, Function>, component: string) {
    	const keys = Object.keys(dynamicViewsModules)
    	const matchKeys = keys.filter((key) => {
    		const k = key.replace(/..\/views|../, '')
    		return k.startsWith(`${component}`) || k.startsWith(`/${component}`)
    	})
    	if (matchKeys?.length === 1) {
    		const matchKey = matchKeys[0]
    		// matchKey: '../views/menu/menu1/menu12/menu121/index.vue'
    		// 返回的就是路径的函数
    		return dynamicViewsModules[matchKey]
    	}
    	if (matchKeys?.length > 1) {
    		return false
    	}
    }
    ```
