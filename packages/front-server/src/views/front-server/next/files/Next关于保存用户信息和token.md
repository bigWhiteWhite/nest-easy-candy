## local

`如果使用localstroage或者sessionstroage要在组件中保存window的值，因为服务端没有window和document，要在组件都挂载完毕以后才能调用window`

```jsx
import {Local} from '@/utils/...'
//...
const [window,setWindow] = React.useState(null) as any

React.useEffect(()=>{
    Local.get('name',window)
},[])
```

保存用户信息的关键点在于

- 使用 cookies 保存用户信息和 token
- 将 cookies 解析并且调用函数传入 axios 中的请求拦截器中，改变 header 中的 token
- 只有在发生请求的时候才会触发请求拦截器，所以说要尽快改变 axios 中的 token，比如：在首页就进行一次请求，触发请求拦截器，改变 header 中的 token,**任何请求都行，只要能够触发 axios 中的请求器就行**

## Cookie

`在Next中还是使用cookie来进行登录校验`

**npm install react-cookie cookie**

```jsx
import { useCookies } from 'react-cookie' //只能在组件中使用，可以设置cookie
import cookie from 'cookie' //解析cookie，将cookie解析成JSON格式

//_app.jsx
import React from 'react'
import App from './App'
import { CookiesProvider } from 'react-cookie'

export default function Root() {
	return (
		<Provider store={store}>
			<CookiesProvider>
				<ConfigProvider locale={zh_CN}>
					<Component {...pageProps} />
				</ConfigProvider>
			</CookiesProvider>
		</Provider>
	)
}
```

### 保存用户信息

https://www.npmjs.com/package/react-cookie

详细去看网页

```jsx
import { useCookies } from 'react-cookie';

const a = ()=>{
    const [cookies,setCookie] = useCookies(['qus_bank_user']) as any//不可以放在useEffect中
    //保存用户信息
    const user_form = async (token) => {
        const {data} = await user_login.getMemberLogonInfo()
        const res = data.data
        setCookie('qus_bank_user', JSON.stringify({token,res}), {
            path: "/",
            maxAge: 36000, // cookeie 一小时后过期
            sameSite: true,
        })
    }
    React.useEffect(() => {
        const {token} = router
        if(token){//获取token，并且缓存到redux
            user_form(token)
        }
    },[router])
}

```

### 传递给 axios

```jsx
import cookie from "cookie"
import {_axios,getCookie} from '@/https/axios'

const Home = (props) => {
  getCookie(props.token)//将token传过去axios，不要放在useEffect中,放在useEffect中就要等到组件挂载完毕，应该要立刻执行

  //console.log(props);
   const a = async() => {
       const {data} = await all_textbook.list({page:1,limit:1})
       console.log(data);
   }

  React.useEffect(() => {
    a()
    getCookie(props.token)
  },[])

  return (
	//...
  )
}
Home.getInitialProps = async ({req}) => {
  const headers = req.headers
  const {qus_bank_user} = cookie.parse(req ? req.headers.cookie || "" : document.cookie)//解析
  const {token} = JSON.parse(qus_bank_user)
  headers.token = token//将token放在服务端的请求头headers里
  return { ...headers }
}

export default Home
```

### axios

```jsx
export const getCookie = (value: string) => {
	//请求拦截
	_axios.interceptors.request.use(
		(config) => {
			config.headers.token = value
			console.log(config)
			//router_authority.axiosAuthority(config.headers.token)
			return config
		},
		(error) => Promise.reject(error)
	)
}
```

### get

```jsx
import { useCookies } from "react-cookie"
const [cookies,setCookie,removeCookie] = useCookies(['qus_bank_user']) as any
console.log(cookies);


```

## 大问题

服务端没有持久性变量存储，所以说前面的方法没有用，只能一个接口一个接口的传递 token，直接使用 cookie 获取 cookie 不稳定，在父组件使用下面的方式，然后传值给子组件更加稳妥

```jsx
import cookie from "cookie"

export const getServerSideProps = async (ctx) => {
    const {id} = ctx.query
    const {qus_bank_user} = cookie.parse(ctx.req ? ctx.req.headers.cookie || "" : document.cookie)
    const result = JSON.parse(qus_bank_user)
    const {token} = result
    const res = await all_textbook.book_detail({id,token})
    return {
        props: { ...res.data,token}//不可以随意更改，不然会有500错误
    }
}
const TeachBookDetail = (props) => {
    const {data,token} = props
}

//
export const getServerSideProps = async (ctx) => {
    const {qus_bank_users} = cookie.parse(ctx.req ? ctx.req.headers.cookie || "" : document.cookie)
    const result = JSON.parse(qus_bank_users)
    return {
        props: { ...result }//一定要返回一个对象解析
    }
}

const HomeWork = (props) => {
    const {token} = props
    console.log(props,'12313');
}

//
const [zuserInfo,setZUserInfo] = React.useState(null) as any
React.useEffect(() => {
        if(cookies.qus_bank_user){
            const {userInfo}  = cookies.qus_bank_user
            setZUserInfo(userInfo)
        }
}, [])
```

## window

```jsx
//使用引入的组件的时候，会报document不存在或者window不存在
//引入的时候不使用服务端渲染
const ReactQuill = dynamic(() => import('@/components/codeEdited/react-quill'), { ssr: false })
```
