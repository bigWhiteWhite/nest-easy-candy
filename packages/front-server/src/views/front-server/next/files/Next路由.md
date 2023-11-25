### 路由跳转

`Link` 组件可以接受以下属性：

- `href` - 导航的目标路径或 URL。这是唯一需要的属性
- `as` - 可选的路径装饰符，用于显示在浏览器的地址栏中。
- `passHref` - 强制 `Link` 将 `href` 属性传递给其子元素。默认值为 `false`
- `prefetch` - 在后台预取目标页面。默认值为 `true`。 处于视口（viewport）中（初始或滚动后）的任何 `<Link />` 都将被预加载。通过设置 `prefetch={false}` 可以禁止页面预取。当 `prefetch` 被设置为 `false` 时，鼠标悬停在 `<Link />` 上时仍然会触发预取。使用**静态生成**的页面（pages）将预加载带有数据的 `JSON` 文件，以实现更快的页面转换。预取功能只在生产环境中开启。
- `replace`- 替换当前的 `history` 状态，而不是在 `history` 堆栈中添加新的 url。默认值为 `false`
- `scroll`- 导航到新页面之后滚动到页面顶部。默认值为 `true`
- `shallow` - 更新当前页面的路径，并无需重新运行 `getStaticProps`、`getServerSideProps` 或 `getInitialProps`。默认值 false

**标签式路由跳转**

在 nextjs 中我们使用 next 内置的 Link 组件进行跳转，而是要 Link 组件本身不渲染组件，而要根据传入的组件进行渲染然后进行跳转。但是请注意这只是前端的跳转，相当于`react-router-dom`的 Link 组件

#### 传递 query

**href={"/a",query:{name:"123e"}}**

**href={`/a?name=${b}`}**

```html
import React, {Component, Fragment} from 'react'
import Link from 'next/link'
export default class App extends Component {
    render() {
        return (
            <Fragment>
                <Link href="/a">
                    <button>asd</button>
                </Link>
            </Fragment>
        )
    }
}
```

注意：**Link 组件下的 children 只能是单独的一个，而不能是多个子节点**，因为 Link 组件是给他的子节点增加点击事件，如果需要给多个组件绑定点击事件，可以用一个根节点包裹起来，比如：

```javascript
import React, { Component, Fragment } from 'react'
import Link from 'next/link'
export default class App extends Component {
	render() {
		return (
			<Fragment>
				<Link href="/a" title="aaa">
					<Fragment>
						<button>to a</button>
						<button>to A</button>
					</Fragment>
				</Link>
			</Fragment>
		)
	}
}
```

**编程式路由跳转**

- useRouter **import {useRouter} from 'next/router'** **适合函数组件，react hook**
  - router.push('/about',"/about/1")
  - router.push({pathname:'/about',query:{name:"abc"}})
- Router **import Router from 'next/router'** **旧版本**
  - Router.push('/about',"/about/1")
  - Router.push({pathname:'about',query:{name:"abc"}})
- withRouter **import {withRouter} from 'next/router'** **适合类组件，高阶组件**
  - router.push('/about',"/about/1")
  - router.pash({pathname:'/about',query:{name:"abc"}})

编程式路由跳转需要借助 next 的 router 模块，使用方法和`react-router-dom`的`history`模式一样，可以通过`push、replace`等等方法进行跳转

```javascript
import React, { Component, Fragment } from 'react'
import Router from 'next/router'
export default class App extends Component {
	goToTestB = () => {
		Router.push('/test/b')
	}
	goToTestC = () => {
		Router.push({
			pathname: '/test/c'
		})
	}
	render() {
		return (
			<Fragment>
				<button onClick={this.goToTestB}>this is a</button>
				<button onClick={this.goToTestC}>this is c</button>
			</Fragment>
		)
	}
}
```

### 动态路由

动态路由指的是：切换页面时我们需要给下一个页面传递一些参数，页面根据这些参数进行相关的渲染。    在`react-router-dom`中我们可以使用`params`和`query`的方式进行动态数据的传递，而在 next 的动态路由跳转中则只能使用`query`来传递相关参数。

​ **动态路由要使用 as 重命名这个属性和 href 搭配**

```html
<!--一个参数-->
<Link href='/list/[id]' as="/list/1"> //[id]为文件夹名字,id可以随便取
    <button>to a</button>
</Link>
<!--多个参数-->
{arr.map((item,index)=>(   //[...id]为文件夹名字
    <Link href='/list/[...id]' as={`/list/${item}/.../...`} key={index}>
        <button>to a</button>
    </Link>
))}
{/*标签式路由传参*/}
<!--http://localhost:3000/a?name=test-->
<Link href={{pathname:'/a',query:{name:'test'}}}>
    <button>to a</button>
</Link>


<!--接受-->
import {useRouter} from 'next/router'
import {withRouter} from 'next/router'
const router = useRouter()
const router = withRouter()
console.log(router.query)
```

### 路由映射

路由映射是指：比如有一个博文的 path 是`/post?id=2&articleId=199`，这样的路由看起来是不友好的。我们想要的是`:/post/2/199`，这样的路径。从前种方法到后种方法之间的转换就叫做路由映射。

**标签式路由映射**

在 next 中由于不能传递`params`，所以我们需要使用 next 种 Link 组件提供的**as**属性，在 as 属性中就可以通过传递`params`进行后面种类的 path。    在 next 的 Link 组件中的`as`和`href`的区别在于：as 是浏览器地址栏**显示**的 path，并不是真正的 path；而 href 才是真正的跳转路径（服务端的路径）。总的来说 as 是客户端显示的路径，而 href 是服务端真实跳转的路径。

**编程式路由映射**

在 next 的 Router 对象中我们也可以使用路由映射使客户端显示的路径变得更加简洁。即在`push`或其他方式进行跳转的时候传入第二个路径，这个路径就是在客户端地址栏显示的路径。

```javascript
import React, { Component, Fragment } from 'react'
import Router from 'next/router'
import Link from 'next/link'

export default class App extends Component {
	goToTestA = () => {
		Router.push(
			{
				pathname: '/a',
				query: {
					id: 1
				}
			},
			'/a/1'
		)
	}

	render() {
		return (
			<Fragment>
				<Link href="/a?id=1" as="/a/1">
					<button>to a</button>
				</Link>
				<button onClick={this.goToTestA}>to a</button>
			</Fragment>
		)
	}
}
```

**路由映射存在的问题**

路由映射存在的一个问题就是当我们通过路由映射跳转页面之后刷新，会找不到页面。因为这个时候我们刷新时服务器会根据我们地址栏的`path`在 pages 文件里面查找 a 文件夹的 1.js 文件，发现并不存在这个文件，所以浏览器会报 404 的错误。    那为什么之前我们却能成功进行跳转呢？因为我们实现的是一个单页应用，使用 next 提供的 Link 组件或 Router 对象的方法进行跳转时我们并没有发出请求，也没有刷新浏览器，是直接跳转的，这个时候并不会出现错误。但是当我们刷新页面时发出了请求，服务器就会根据路径在 pages 下寻找文件。

**路由映射问题的解决方法**

路由映射存在的问题就是在于对服务器发起请求的与否，所以我们需要在使用路由映射跳转的时候，需要使用`koa`进行相关的拦截，然后更新服务端的路径    以下例子是 koa 集成 next 服务器的例子：

```javascript
const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
// 创建一个app，并指定为开发状态
const dev = process.env.NODE_ENV !== 'production'
const app = next({
	dev
})
const handle = app.getRequestHandler()
// 等pages下面的所有页面编译完成之后启动服务，响应请求
app.prepare().then(() => {
	// 实例化KoaServer
	const server = new Koa()
	const router = new Router()
	server.use(router.routes())
	// 根据浏览器地址栏请求的params来进行相关query的配置
	router.get('/a/:id', async (ctx) => {
		const id = ctx.params.id
		await app.render(ctx.req, ctx.res, '/a', { id })
		ctx.respond = false
	})
	// 通配符
	router.get('*', async (ctx) => {
		await handle(ctx.req, ctx.res)
		// hack手段，兼容node底层的req和res
		ctx.respond = false
	})
	// 使用中间件
	server.use(async (ctx, next) => {
		ctx.res.statusCode = 200
		await next()
	})
	// 监听端口
	server.listen(3000, () => {
		console.log('koa server listening on 3000')
	})
})
```

### 路由生命周期

路由钩子指的是在 next 中进行路由跳转时，执行的函数。分别是：

1. routeChangeStart：开始跳转时触发。
2. routeChangeComplete：跳转完成之后触发。
3. routeChangeError：跳转到一个不存在的路径触发。
4. beforeHistoryChange：启用 history 路由，在跳转成功前触发。
5. hashChangeStart：启用 hash 路由时，在开始跳转时触发
6. hashChangeComplete：启用 hash 路由时，在跳转成功后触发。

```javascript
// index.js
const events = [
    'routeChangeStart',
    'routeChangeComplete',
    'routeChangeError',
    'beforeHistoryChange',
    'hashChangeStart',
    'hashChangeComplete'
];

emitEvent = (type) => {
    return (...args) => {
        console.log(type, ...args)
    }
};

componentDidMount() {
    events.forEach(event => {
            Router.events.on(event, this.emitEvent(event))
    })
}
//路由守卫
Router.events.on('routeChangeStart',(url)=>{

})
```

###
