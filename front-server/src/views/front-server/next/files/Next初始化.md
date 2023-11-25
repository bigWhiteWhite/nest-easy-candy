### 目录结构

1. pages(必需)：pages 目录是 nextjs 中最终要的一个目录，这个目录的每一个文件都会对应到每一个页面，可以根据地址栏的路由进行跳转。若 pages 下的 js 文件在一个目录下，那么 nextjs 默认会将这个目录也当作路由的路径。
2. components(非必需)：components 目录存放的是一些公用的组件，这些代码不能放在 pages 下，不然的话就会以页面的形式进行导出。
3. lib(非必需)：lib 目录存放一些工具方法，比如 util 等等。
4. static(非必需)：static 目录存放一些静态资源文件，比如图片和公共的 css 样式。

### next 的默认文件

1. index.js：nextjs 的 pages 下默认入口文件，这个文件会对应浏览器地址栏为根路径的那个页面
2. \_app.js：nextjs 的全局组件，一般来说我们需要对这个组件进行重写，重写的时候一般进行一些公共的操作，比如：导入全局的 css、给页面传入数据(执行每个页面的`getInitialProps`方法)、用`componentDidCatch`进行自定义错误处理等等
3. \_error.js：nextjs 的错误页面，这个页面也可以用来重写，当路由不存在时就会显示该页面。
4. \_document.js：nextjs 只在服务端运行的 js 文件，客户端运行时不起作用。一般来说它用来修改服务端渲染给客户端的 html 文件的格式，比如我们可以在这个 js 文件加入`styled-components`等`style-in-js`方案配置、修改返回给客户端的 html（给客户端的 html 文件加上 title 等等），

### 动态导入，加载动画

```jsx
import dynamic from 'next/dynamic'
import Loading from '@/components/loading/index'
const Content = dynamic(() => import('./content'), { loading: Loading })
```

### 预加载

- 预加载是性能优化的技术
- 所有所需的资源提前请求加载到本地，这样后面在需要用到的时候就直接从缓存中取资源
- 只在生产环境中有效

**Examples**

- Prefetching

Next.js 有允许你预加载页面的 API。

用 Next.js 服务端渲染你的页面，可以达到所有你应用里所有未来会跳转的路径即时响应，有效的应用 Next.js，可以通过预加载应用程序的功能，最大程度的初始化网站性能。查看更多.

> Next.js 的预加载功能只预加载 JS 代码。当页面渲染时，你可能需要等待数据请求。

#### Link 用法

你可以给`<Link>`添加 `prefetch` 属性，Next.js 将会在后台预加载这些页面。

```jsx
import Link from 'next/link'

// example header component
export default () => (
	<nav>
		<ul>
			<li>
				<Link prefetch href="/">
					<a>Home</a>
				</Link>
			</li>
		</ul>
	</nav>
)
```

#### 自定义 Link 标签

使用链接时，一个非常重要的功能是确定当前 URL 是什么，尤其是为活动链接分配一个类，因此我们可以将其样式设置为与其他 URL 不同。我们可以自己创建一个 Link 组件，然后将其存储在 Components 文件夹中的`Link.js`文件中，然后导入它而不是默认的`next/link` 。在组件内部，我们确定当前路径名是否与组件的`href`属性匹配，如果是，则将`selected`类附加到子代。

```jsx
import React, { Fragment } from 'react'
import { useRouter } from 'next/router'

const MyLink = ({ children, href }) => {
	const router = useRouter()
	console.log(children, href)
	console.log(router.asPath)

	const style = {
		marginRight: 10,
		color: router.asPath === href ? 'red' : 'black'
	}

	const handleClick = (e) => {
		e.preventDefault()
		router.push(href)
	}

	return (
		<a href={href} onClick={handleClick} style={style}>
			{children}
		</a>
	)
}
export default MyLink
```

**使用**

```jsx
import React, { Fragment } from 'react'
import MyLink from '@components/MyLink'
const Test03 = () => {
	return (
		<Fragment>
			<MyLink href="/text03">
				//点击去/text03
				<div>12213123</div>
			</MyLink>
		</Fragment>
	)
}
export default Test03
```

#### 命令式 prefetch 写法

大多数预加载是通过`<Link />`处理的，但是我们还提供了命令式 API 用于更复杂的场景。

```jsx
import { withRouter } from 'next/router'

export default withRouter(({ router }) => (
	<div>
		<a onClick={() => setTimeout(() => router.push('/dynamic'), 100)}>A route transition will happen after 100ms</a>
		{
			// but we can prefetch it!
			router.prefetch('/dynamic')
		}
	</div>
))
```

路由实例只允许在应用程序的客户端。以防服务端渲染发生错误，建议 prefetch 事件写在`componentDidMount()`生命周期里。

```jsx
import React from 'react'
import { withRouter } from 'next/router'

class MyLink extends React.Component {
	componentDidMount() {
		const { router } = this.props
		router.prefetch('/dynamic')
	}

	render() {
		const { router } = this.props
		return (
			<div>
				<a onClick={() => setTimeout(() => router.push('/dynamic'), 100)}>A route transition will happen after 100ms</a>
			</div>
		)
	}
}

export default withRouter(MyLink)
```

### 404 界面和 error

**在 pages/新建 404.tsx 和\_error.tsx** 404 界面是静态界面，\_error 因为要报告错误，所以它是动态的，当然我们可以去获取错误具体信息

```jsx
import React from 'react'

export default class Error extends React.Component {
	static getInitialProps({ res, err }) {
		const statusCode = res ? res.statusCode : err ? err.statusCode : null
		return { statusCode }
	}

	render() {
		return <p>{this.props.statusCode ? `An error ${this.props.statusCode} occurred on server` : 'An error occurred on client'}</p>
	}
}
```

### 组件生命周期

如果你需要一个有状态、生命周期或有初始数据的 React 组件（而不是上面的无状态函数），如下所示：

```jsx
import React from 'react'

export default class extends React.Component {
	static async getInitialProps({ req }) {
		const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
		return { userAgent }
	}

	render() {
		return <div>Hello World {this.props.userAgent}</div>
	}
}
```

相信你注意到，当页面渲染时加载数据，我们使用了一个异步方法`getInitialProps`。它能异步获取 JS 普通对象，并绑定在`props`上

当服务渲染时，`getInitialProps`将会把数据序列化，就像`JSON.stringify`。所以确保`getInitialProps`返回的是一个普通 JS 对象，而不是`Date`, `Map` 或 `Set`类型。

当页面初始化加载时，`getInitialProps`只会加载在服务端。只有当路由跳转（`Link`组件跳转或 API 方法跳转）时，客户端才会执行`getInitialProps`。

注意：`getInitialProps`将不能使用在子组件中。只能使用在`pages`页面中。

> 只有服务端用到的模块放在`getInitialProps`里，请确保正确的导入了它们，可参考 import them properly。 否则会拖慢你的应用速度。

你也可以给无状态组件定义`getInitialProps`：

```jsx
const Page = ({ stars }) => <div>Next stars: {stars}</div>

Page.getInitialProps = async ({ req }) => {
	const res = await fetch('https://api.github.com/repos/zeit/next.js')
	const json = await res.json()
	return { stars: json.stargazers_count }
}

export default Page
```

`getInitialProps`入参对象的属性如下：

- `pathname` – URL 的 path 部分
- `query` – URL 的 query 部分，并被解析成对象
- `asPath` – 显示在浏览器中的实际路径（包含查询部分），为`String`类型
- `req` – HTTP 请求对象 (只有服务器端有)
- `res` – HTTP 返回对象 (只有服务器端有)
- `jsonPageRes` – 获取数据响应对象 (只有客户端有)
- `err` – 渲染过程中的任何错误

### Next 获取数据的方式

Next.js 具有两种形式的预渲染：**静态生成和服务器端渲染** `getStaticProps`（静态生成）：在**构建时**获取数据。 ` getStaticPaths`（静态生成）：根据数据指定要[动态]渲染的[动态路由]。 `getServerSideProps`（服务器端渲染）：在**每个请求**上获取数据。

**getStaticProps（静态生成）**

**getStaticProps 的返回值是一个对象，其中对象必有一个 key 值为 props，并且这个 props 作为组件的 props**

呈现页面所需的数据可在构建时在用户请求之前获得。该页面必须预渲染（对于 SEO）并且必须非常快- getStaticProps 生成 HTML 和 JSON 文件，CDN 可以将它们都缓存以提高性能。

**！！！初始化**

```jsx
import Api from '@/https/api/index'
const { sample } = Api
const Home = (props) => {
	console.log(props)
}
export const getStaticProps = async () => {
	const data = await sample.list({
		pageNum: 1,
		pageSize: 1
	})
	return {
		props: { ...data.data } //不可以随意更改，不然会有500错误
	}
}

export default Home
```

**getStaticPaths（静态生成）**

**params：接受 getStaticPaths()返回的动态路径，方便请求动态数据**

如果页面具有动态路由并使用 `getStaticProps` 它，则需要定义一个在构建时必须呈现为 HTML 的路径列表。如果从使用动态路由的页面导出 async 调用的函数 getStaticPaths，则 Next.js 将静态预呈现由指定的所有路径 getStaticPaths。例如，假设有一个使用动态路由的页面 pages/posts/[id].js。如果您 getStaticPaths 从此页面导出并返回以下内容 paths： `getStaticPaths 仅在构建时在服务器端运行。`

```jsx
export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: '1' } },
      { params: { id: '2' } }
    ],
    fallback: true or false
  };
}

// 在使用 getStaticProps 静态生成
export async function getStaticProps({ params }) {
  // 参数包含post ' id '。
  // 如果路由类似/posts/1，则params。id是1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  // 通过道具将post数据传递到页面
  return { props: { post } }
}
```

**getServerSideProps（服务器端渲染）**

**getServerSideProps 的返回值是一个对象，其中对象必有一个 key 值为 props，并且这个 props 作为组件的 props**

getServerSideProps 仅在服务器端运行，而从不在浏览器上运行。 getServerSideProps 比 getStaticProp 花的时间要慢由于服务器必须在每个请求上计算结果，并且如果没有额外的配置，结果不能由 CDN 缓存。 `如果不需要预渲染数据，则应考虑在客户端获取数据。`

```jsx
import { GetServerSideProps } from 'next' //TypeScript：使用 GetServerSideProps

export async function getServerSideProps:GetServerSideProps (context) {
  return {
    props: {}, // 将作为道具传递到页面组件
  }
}
```

### 自定义 APP

自定义 APP 即重写\_app.js，来覆盖 next 提供的默认的\_app.js。那么重写\_app.js 的作用是什么呢？

1. 固定 layout
2. 保持一些公用的状态，比如 redux 的使用。
3. 给页面传入一些自定义的数据
4. 自定义错误处理

**传递自定义数据**

传递自定义数据即执行每个对象上得`getInitialProps`方法，然后传递到`Component`页面。

```javascript
import App from 'next/app'
import 'antd/dist/antd.css'

class myApp extends App {
	// 这里方法在每次切换页面都会执行
	static getInitialProps = async ({ Component }) => {
		let pageProps = {}
		// 判断当前页面是否存在getInitialProps方法
		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps()
		}
		return { pageProps }
	}

	render() {
		// 这个Component即渲染的页面
		const { Component, pageProps } = this.props
		console.log(Component)
		return <Component {...pageProps} name={'jocky'} />
	}
}

export default myApp
```

**固定 Layout**

```javascript
import React from 'react'
import App from 'next/app'

class Layout extends React.Component {
	render() {
		const { children } = this.props
		return <div className="layout">{children}</div>
	}
}

export default class MyApp extends App {
	render() {
		const { Component, pageProps } = this.props
		return (
			<Layout>
				<Component {...pageProps} />
			</Layout>
		)
	}
}
```

### 自定义 document

`_document`文件只会在服务端渲染的时候才会被调用，是用来修改服务端渲染的文档内容，一般来配合第三方`css-in-js`方案使用

```javascript
import Document, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'

export class MyDocument extends Document {
	// 不必重写该方法，重写了就必须执行Document.getInitialProps方法
	static getInitialProps = async () => {
		const pageProps = await Document.getInitialProps()
		return {
			...pageProps
		}
	}
	// 不必需重写render方法，重写了就必须包含Html、Head、Main、NextScript等标签
	render() {
		return (
			<Html>
				<Head>
					<title>自定义document</title>
					<style>{`
                    .test {
                        color: red
                    }
                    `}</style>
				</Head>
				<body className="test">
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
```

**styled-components 的集成**

`styled-components`的集成要修改`.babelrc`和`_document.js`的配置。 `.babelrc`:

```json
{
  "presets": ["next/babel"],
  "plugins": [["styled-components", { "ssr": true }]]
}
1234
```

`_document.js`:

```javascript
import Document from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps (ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }
}
test.js
import React, {Component, Fragment} from 'react'
import styled from 'styled-components'
const Span  = styled.span`
    color: red
`;

export default class App extends Component {
    render() {
        return (
            <Fragment>
                <Span>Index</Span>
            </Fragment>
        )
    }
}
```

### lazyloading 的运用

在 next 中，pages 下的所有页面都被切割成了不同的模块，当我们访问某个页面的时候才会去加载这个 js 文件，所以大部分时候这个功能已经够用了。但是我们仍然希望自己能够去控制某些模块的 lazyloading。

**异步加载模块**

```javascript
import React, { Component, Fragment } from 'react'
class App extends Component {
	static getInitialProps = async () => {
		// 执行到该行的时候才会去加载moment
		const moment = await import('moment')
		const promise = new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					name: 'ainuo',
					// 使用的时候使用default方法
					time: moment.default(Date.now() - 60 * 1000).fromNow()
				})
			}, 2000)
		})
		return await promise
	}

	render() {
		const { name, time } = this.props
		return (
			<Fragment>
				this is {name}, {time}
			</Fragment>
		)
	}
}

export default App
```

**异步加载组件**

```javascript
import React, { Component, Fragment } from 'react'

import dynamic from 'next/dynamic'
// 这里其实是es2019Api的dynamic引入
const Comp = dynamic(import('../components/comp'))

class App extends Component {
	static getInitialProps = async () => {
		// 执行到该行的时候才会去加载moment
		const moment = await import('moment')
		const promise = new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					name: 'ainuo',
					// 使用的时候使用default方法
					time: moment.default(Date.now() - 60 * 1000).fromNow()
				})
			}, 2000)
		})
		return await promise
	}

	render() {
		const { name, time } = this.props
		return (
			<Fragment>
				this is {name}, {time}
				{/*只有当渲染Comp的时候才会去执行改代码*/}
				<Comp />
			</Fragment>
		)
	}
}

export default App
```
