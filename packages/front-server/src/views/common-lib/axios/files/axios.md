# 跨域代理

**vue.config.js**

- 3 个/loan3rd 都要写！！！

```js
devServer: {
		// 设置代理
		hot: true, //热加载
		host: '0.0.0.0', //ip地址
		port: 8085, //端口
		// https: false, //false关闭https，true为开启
		open: true, //自动打开浏览器
		proxy: {
			'/loan3rd': {
				//本地
				target: 'http://192.168.201.199:7000/', // 目标代理接口地址
				secure: false,
				// ws: true, // 是否启用websockets
				changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
				pathRewrite: {
					'^/loan3rd': '/loan3rd' // 重点
				}
			}
		}
	}
```

**base-url**

```js
BASE_URL = '/loan3rd'
```

请求

```js
save(data) {
    return $https.get({
        url: `/checkup/save?${qs.stringify(data)}`
    })
}
```

## **理解和使用**

- 首先，代理会**解析你的前面的接口路径**，**匹配的**就帮你代理
  - 例如，我把**BASE_URL 设置成/gold_sub**,也就是每一个请求接口前面都会有这个，那么代理就会匹配到这个值，然后换成 target，也就是/gold_sub/book/pageBookCondition/=== http://8.140.117.209:8160/gold_sub/book/pageBookCondition/,实际上请求是带有/gold_sub的，所以不注意就会404
  - 而路径重写就是我的接口实际上路径是没有/gold_sub 的，真实的路径是/front/book/pageBookCondition/所以我要重写为/front，那么真实的就为http://8.140.117.209:8160/front/book/pageBookCondition/
  - 但是浏览器上显示 http://localhost:8080/gold_sub/book/pageBookCondition/，**即使路径已经重写**

```js
proxy: {
    '/gold_sub': {
        target: 'http://8.140.117.209:8160',
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, //是否跨域
        ws: true,
        pathRewrite: {
        "^/gold_sub": '/front'
        }
    }
},
```

```js
if (process.env.NODE_ENV === 'development') {
	BASE_URL = '/gold_sub'
} else if (process.env.NODE_ENV === 'production') {
	BASE_URL = '/gold_sub'
} else {
	BASE_URL = '/gold_sub'
}
```

## 多个匹配

```js
'/nownowmoney|/9jaCash': {
    target: 'http://119.8.109.35:9090', // 目标代理接口地址
    secure: false,
    changeOrigin: true,
    pathRewrite: {
    '^/nownowmoney': '/loan',
    '^/9jaCash': '/loan'
    }
},
```

# axios 基本使用

## axios 基本配置

```js
// 默认配置
axios.defaults.header
axios.defaults.timeout
axios.defaults.baseURL
// 可以个性化配置
axios.get(`${base.url}/topic/${id}`, {
	timeout: 1000
})
```

## Qs 字段序列化

```js
import qs from 'qs'

const query = { pageNum: 1, pageSize: 12 }

qs.stringify(query) // pageNum=1&pageSize=12
// axios.get(`${base.url}/topic/${id}?${qs.stringify(params)}`)
```

## 封装

```js
articleDetail(id: number, params: string) {
    return axios.get(`${base.url}/topic/${id}`, {
        params, // query参数，推荐使用qs写在url中
        data: body, // body参数
        headers: {
            token
        }
    })
}
```

```typescript
list(body: any, token: any) {
    const query = { pageNum: 1, pageSize: 12 } // pageNum=1&pageSize=12
    return axios({
        url: `${base.url}/shop/agritainment/list?${qs.stringify(query)}`,
        method: 'get',
        data: body, // body参数
        params, // query参数，推荐使用qs写在url中
        headers: {
            token
        }
    })
}
```

## 调用

```js
this.$axios
	.getBook()
	.then((res) => {
		console.log(res)
	})
	.catch((err) => {
		console.log(err)
	})
```

## axios.all

发送多个请求,按顺序返回

```js
$axios.all([axios.get('url'), axios.post('url')]).then((res) => {
	console.log(res)
})
```

# Axios 的封装

### axios 的安装

安装

```js
npm install axios; // 安装axios
```

引入

一般我会在项目的 src 目录中，新建一个 request 文件夹，然后在里面新建一个 http.js 和一个 api.js 文件。http.js 文件用来封装我们的 axios，api.js 用来统一管理我们的接口。

```js
// 在http.js中引入axios
import axios from 'axios' // 引入axios
import QS from 'qs' // 引入qs模块，用来序列化post类型的数据，后面会提到
// vant的toast提示框组件，大家可根据自己的ui组件更改。
import { Toast } from 'vant'
```

### 环境的切换

我们的项目环境可能有开发环境、测试环境和生产环境。我们通过 node 的环境变量来匹配我们的默认的接口 url 前缀。axios.defaults.baseURL 可以设置 axios 的默认请求地址就不多说了。

```js
// 环境的切换
if (process.env.NODE_ENV == 'development') {
	axios.defaults.baseURL = 'https://www.baidu.com'
} else if (process.env.NODE_ENV == 'debug') {
	axios.defaults.baseURL = 'https://www.ceshi.com'
} else if (process.env.NODE_ENV == 'production') {
	axios.defaults.baseURL = 'https://www.production.com'
}
```

### 设置请求超时

通过 axios.defaults.timeout 设置默认的请求超时时间。例如超过了 10s，就会告知用户当前请求超时，请刷新等。

```js
axios.defaults.timeout = 10000
```

### post 请求头的设置

post 请求的时候，我们需要加上一个请求头，所以可以在这里进行一个默认的设置，即设置 post 的请求头为`application/x-www-form-urlencoded;charset=UTF-8`

```js
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
```

- 请求拦截

我们在发送请求前可以进行一个请求的拦截，为什么要拦截呢，我们拦截请求是用来做什么的呢？比如，有些请求是需要用户登录之后才能访问的，或者 post 请求的时候，我们需要序列化我们提交的数据。这时候，我们可以在请求被发送之前进行一个拦截，从而进行我们想要的操作。

### 请求拦截

```js
// 先导入vuex,因为我们要使用到里面的状态对象
// vuex的路径根据自己的路径去写
import store from '@/store/index'

// 请求拦截器
axios.interceptors.request.use(
	(config) => {
		// 每次发送请求之前判断vuex中是否存在token
		// 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
		// 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
		const token = store.state.token
		token && (config.headers.Authorization = token)
		return config
	},
	(error) => {
		return Promise.error(error)
	}
)
```

这里说一下 token，一般是在登录完成之后，将用户的 token 通过 localStorage 或者 cookie 存在本地，然后用户每次在进入页面的时候（即在 main.js 中），会首先从本地存储中读取 token，如果 token 存在说明用户已经登陆过，则更新 vuex 中的 token 状态。然后，在每次请求接口的时候，都会在请求的 header 中携带 token，后台人员就可以根据你携带的 token 来判断你的登录是否过期，如果没有携带，则说明没有登录过。这时候或许有些小伙伴会有疑问了，就是每个请求都携带 token，那么要是一个页面不需要用户登录就可以访问的怎么办呢？其实，你前端的请求可以携带 token，但是后台可以选择不接收啊！

### 响应拦截

```js
// 响应拦截器
axios.interceptors.response.use(
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // 否则的话抛出错误
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    // 服务器状态码不是2开头的的情况
    // 这里可以跟你们的后台开发人员协商好统一的错误状态码
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    // 下面列举几个常见的操作，其他需求可自行扩展
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                // 401: 未登录
                // 未登录则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页操作。
                case 401:
                    router.replace({
                        path: '/login',
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    });
                    break;

                // 403 token过期
                // 登录过期对用户进行提示
                // 清除本地token和清空vuex中token对象
                // 跳转登录页面
                case 403:
                     Toast({
                        message: '登录过期，请重新登录',
                        duration: 1000,
                        forbidClick: true
                    });
                    // 清除token
                    localStorage.removeItem('token');
                    store.commit('loginSuccess', null);
                    // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                    setTimeout(() => {
                        router.replace({
                            path: '/login',
                            query: {
                                redirect: router.currentRoute.fullPath
                            }
                        });
                    }, 1000);
                    break;

                // 404请求不存在
                case 404:
                    Toast({
                        message: '网络请求不存在',
                        duration: 1500,
                        forbidClick: true
                    });
                    break;
                // 其他错误，直接抛出错误提示
                default:
                    Toast({
                        message: error.response.data.message,
                        duration: 1500,
                        forbidClick: true
                    });
            }
            return Promise.reject(error.response);
        }
    }
});
```

响应拦截器很好理解，就是服务器返回给我们的数据，我们在拿到之前可以对他进行一些处理。例如上面的思想：如果后台返回的状态码是 200，则正常返回数据，否则的根据错误的状态码类型进行一些我们需要的错误，其实这里主要就是进行了错误的统一处理和没登录或登录过期后调整登录页的一个操作。

**要注意的是，上面的 Toast()方法，是我引入的 vant 库中的 toast 轻提示组件，你根据你的 ui 库，对应使用你的一个提示组件。**

### 封装 get 方法和 post 方法

我们常用的 ajax 请求方法有 get、post、put 等方法，相信小伙伴都不会陌生。axios 对应的也有很多类似的方法，不清楚的可以看下文档。但是为了简化我们的代码，我们还是要对其进行一个简单的封装。下面我们主要封装两个方法：get 和 post。

**get 方法**：我们通过定义一个 get 函数，get 函数有两个参数，第一个参数表示我们要请求的 url 地址，第二个参数是我们要携带的请求参数。get 函数返回一个 promise 对象，当 axios 其请求成功时 resolve 服务器返回 值，请求失败时 reject 错误值。最后通过 export 抛出 get 函数。

```js
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
	return new Promise((resolve, reject) => {
		axios
			.get(url, {
				params: params
			})
			.then((res) => {
				resolve(res.data)
			})
			.catch((err) => {
				reject(err.data)
			})
	})
}
```

**post 方法：**原理同 get 基本一样，但是要注意的是，post 方法必须要使用对提交从参数对象进行序列化的操作，所以这里我们通过 node 的 qs 模块来序列化我们的参数。这个很重要，如果没有序列化操作，后台是拿不到你提交的数据的。这就是文章开头我们 import QS from 'qs';的原因。如果不明白序列化是什么意思的，就百度一下吧，答案一大堆。

```js
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
	return new Promise((resolve, reject) => {
		axios
			.post(url, QS.stringify(params))
			.then((res) => {
				resolve(res.data)
			})
			.catch((err) => {
				reject(err.data)
			})
	})
}
```

这里有个小细节说下，`axios.get()`方法和`axios.post()`在提交数据时参数的书写方式还是有区别的。区别就是，get 的第二个参数是一个{}，然后这个对象的 params 属性值是一个参数对象的。而 post 的第二个参数就是一个参数对象。两者略微的区别要留意哦！

## 初次封装

```js
/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios'
import QS from 'qs'
import { Toast } from 'vant'
import store from '../store/index'

// 环境的切换
if (process.env.NODE_ENV == 'development') {
	axios.defaults.baseURL = '/api'
} else if (process.env.NODE_ENV == 'debug') {
	axios.defaults.baseURL = ''
} else if (process.env.NODE_ENV == 'production') {
	axios.defaults.baseURL = 'http://api.123dailu.com/'
}

// 请求超时时间
axios.defaults.timeout = 10000

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 请求拦截器
axios.interceptors.request.use(
	(config) => {
		// 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
		// 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
		const token = store.state.token
		token && (config.headers.Authorization = token)
		return config
	},
	(error) => {
		return Promise.error(error)
	}
)

// 响应拦截器
axios.interceptors.response.use(
	(response) => {
		if (response.status === 200) {
			return Promise.resolve(response)
		} else {
			return Promise.reject(response)
		}
	},
	// 服务器状态码不是200的情况
	(error) => {
		if (error.response.status) {
			switch (error.response.status) {
				// 401: 未登录
				// 未登录则跳转登录页面，并携带当前页面的路径
				// 在登录成功后返回当前页面，这一步需要在登录页操作。
				case 401:
					router.replace({
						path: '/login',
						query: { redirect: router.currentRoute.fullPath }
					})
					break
				// 403 token过期
				// 登录过期对用户进行提示
				// 清除本地token和清空vuex中token对象
				// 跳转登录页面
				case 403:
					Toast({
						message: '登录过期，请重新登录',
						duration: 1000,
						forbidClick: true
					})
					// 清除token
					localStorage.removeItem('token')
					store.commit('loginSuccess', null)
					// 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
					setTimeout(() => {
						router.replace({
							path: '/login',
							query: {
								redirect: router.currentRoute.fullPath
							}
						})
					}, 1000)
					break
				// 404请求不存在
				case 404:
					Toast({
						message: '网络请求不存在',
						duration: 1500,
						forbidClick: true
					})
					break
				// 其他错误，直接抛出错误提示
				default:
					Toast({
						message: error.response.data.message,
						duration: 1500,
						forbidClick: true
					})
			}
			return Promise.reject(error.response)
		}
	}
)
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
	return new Promise((resolve, reject) => {
		axios
			.get(url, {
				params: params
			})
			.then((res) => {
				resolve(res.data)
			})
			.catch((err) => {
				reject(err.data)
			})
	})
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
	return new Promise((resolve, reject) => {
		axios
			.post(url, QS.stringify(params))
			.then((res) => {
				resolve(res.data)
			})
			.catch((err) => {
				reject(err.data)
			})
	})
}
```

## 二次更新

axios 的封装根据需求的不同而不同。这里非常感谢评论里一些很中肯的建议，我也对此进行了思考和针对不同需求的改善。主要有以下改变：

**1.优化 axios 封装，去掉之前的 get 和 post**

**2.断网情况处理**

**3.更加模块化的 api 管理**

**4.接口域名有多个的情况**

**5.api 挂载到 vue.prototype 上省去引入的步骤**

```js
/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios'
import router from '../router'
import store from '../store/index'
import { Toast } from 'vant'

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const tip = (msg) => {
	Toast({
		message: msg,
		duration: 1000,
		forbidClick: true
	})
}

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
	router.replace({
		path: '/login',
		query: {
			redirect: router.currentRoute.fullPath
		}
	})
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
	// 状态码判断
	switch (status) {
		// 401: 未登录状态，跳转登录页
		case 401:
			toLogin()
			break
		// 403 token过期
		// 清除token并跳转登录页
		case 403:
			tip('登录过期，请重新登录')
			localStorage.removeItem('token')
			store.commit('loginSuccess', null)
			setTimeout(() => {
				toLogin()
			}, 1000)
			break
		// 404请求不存在
		case 404:
			tip('请求的资源不存在')
			break
		default:
			console.log(other)
	}
}

// 创建axios实例
var instance = axios.create({ timeout: 1000 * 12 })
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
	(config) => {
		// 登录流程控制中，根据本地是否存在token判断用户的登录情况
		// 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
		// 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
		// 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
		const token = store.state.token
		token && (config.headers.Authorization = token)
		return config
	},
	(error) => Promise.error(error)
)

// 响应拦截器
instance.interceptors.response.use(
	// 请求成功
	(res) => (res.status === 200 ? Promise.resolve(res) : Promise.reject(res)),
	// 请求失败
	(error) => {
		const { response } = error
		if (response) {
			// 请求已发出，但是不在2xx的范围
			errorHandle(response.status, response.data.message)
			return Promise.reject(response)
		} else {
			// 处理断网的情况
			// eg:请求超时或断网时，更新state的network状态
			// network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
			// 关于断网组件中的刷新重新获取数据，会在断网组件中说明
			if (!window.navigator.onLine) {
				store.commit('changeNetwork', false)
			} else {
				return Promise.reject(error)
			}
		}
	}
)

export default instance
```

这个 axios 和之前的大同小异，做了如下几点改变：

1.去掉了之前 get 和 post 方法的封装，通过创建一个 axios 实例然后 export default 方法导出，这样使用起来更灵活一些。

2.去掉了通过环境变量控制 baseUrl 的值。考虑到接口会有多个不同域名的情况，所以准备通过 js 变量来控制接口域名。这点具体在 api 里会介绍。

3.增加了请求超时，即断网状态的处理。说下思路，当断网时，通过更新 vuex 中 network 的状态来控制断网提示组件的显示隐藏。断网提示一般会有重新加载数据的操作，这步会在后面对应的地方介绍。

4.公用函数进行抽出，简化代码，尽量保证单一职责原则。

**下面说下 api 这块，考虑到一下需求：**

1.更加模块化

2.更方便多人开发，有效减少解决命名冲突

3.处理接口域名有多个情况

这里这里呢新建了一个 api 文件夹，里面有一个 index.js 和一个 base.js，以及多个根据模块划分的接口 js 文件。index.js 是一个 api 的出口，base.js 管理接口域名，其他 js 则用来管理各个模块的接口。

先放 index.js 代码：

```js
/**
 * api接口的统一出口
 */
// 文章模块接口
import article from '@/api/article'
// 其他模块的接口……

// 导出接口
export default {
	article
	// ……
}
```

index.js 是一个 api 接口的出口，这样就可以把 api 接口根据功能划分为多个模块，利于多人协作开发，比如一个人只负责一个模块的开发等，还能方便每个模块中接口的命名哦。

base.js:

```
/**
 * 接口域名的管理
 */
const base = {
    sq: 'https://xxxx111111.com/api/v1',
    bd: 'http://xxxxx22222.com/api'
}

export default base;
```

通过 base.js 来管理我们的接口域名，不管有多少个都可以通过这里进行接口的定义。即使修改起来，也是很方便的。

### 接口模块

```js
/**
 * article模块接口列表
 */

import base from './base' // 导入接口域名列表
import axios from '@/utils/http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块

const article = {
	// 新闻列表
	articleList() {
		return axios.get(`${base.sq}/topics`)
	},
	// 新闻详情,演示
	articleDetail(id, params) {
		return axios.get(`${base.sq}/topic/${id}`, {
			params: params
		})
	},
	// post提交
	login(params) {
		return axios.post(`${base.sq}/accesstoken`, qs.stringify(params))
	}
	// 其他接口…………
}

export default article
```

1.通过直接引入我们封装好的 axios 实例，然后定义接口、调用 axios 实例并返回，可以更灵活的使用 axios，比如你可以对 post 请求时提交的数据进行一个 qs 序列化的处理等。

2.请求的配置更灵活，你可以针对某个需求进行一个不同的配置。关于配置的优先级，axios 文档说的很清楚，这个顺序是：在 `lib/defaults.js` 找到的库的默认值，然后是实例的 `defaults` 属性，最后是请求的 `config` 参数。后者将优先于前者。

3.restful 风格的接口，也可以通过这种方式灵活的设置 api 接口地址。

最后，为了方便 api 的调用，我们需要将其挂载到 vue 的原型上。在 main.js 中：

```js
import Vue from 'vue'
import App from './App'
import router from './router' // 导入路由文件
import store from './store' // 导入vuex文件
import api from './api' // 导入api接口

Vue.prototype.$api = api // 将api挂载到vue的原型上
```

然后我们可以在页面中这样调用接口，eg：

```js
methods: {
    onLoad(id) {
        this.$api.article.articleDetail(id, {
            api: 123
        }).then(res=> {
            // 执行某些操作
        })
    }
}
```

### 断网的处理

```js
<template>
    <div id="app">
        <div v-if="!network">
            <h3>我没网了</h3>
            <div @click="onRefresh">刷新</div>
        </div>
        <router-view/>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: 'App',
        computed: {
            ...mapState(['network'])
        },
        methods: {
            // 通过跳转一个空页面再返回的方式来实现刷新当前页面数据的目的
            onRefresh () {
                this.$router.replace('/refresh')
            }
        }
    }
</script>
```

这是 app.vue，这里简单演示一下断网。在 http.js 中介绍了，我们会在断网的时候，来更新 vue 中 network 的状态，那么这里我们根据 network 的状态来判断是否需要加载这个断网组件。断网情况下，加载断网组件，不加载对应页面的组件。当点击刷新的时候，我们通过跳转 refesh 页面然后立即返回的方式来实现重新获取数据的操作。因此我们需要新建一个 refresh.vue 页面，并在其`beforeRouteEnter`钩子中再返回当前页面。

```js
// refresh.vue
beforeRouteEnter (to, from, next) {
    next(vm => {
        vm.$router.replace(from.fullPath)
    })
}
```

这是一种全局通用的断网提示，当然了，也可以根据自己的项目需求操作。具体操作就仁者见仁智者见智了。

如果更多的需求，或者说是不一样的需求，可以根据自己的需求进行一个改进。

# Axios 传参的三种方式

开发过程中，经常需要全局设置，许多前端开发时容易忽略请求头的配置，常用的请求头有 2 种：

### 常用的请求头

```js
axios.defaults.timeout = 15000 //超时响应
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded' // 配置请求头（推荐）
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'; // 配置请求头
axios.defaults.baseURL = $core.use('http') //确认协议和地址
axios.defaults.withCredentials = true // axios 默认不发送cookie，需要全局设置true发送cookie
```

### 一：get 请求

axios 中常见的 get/delete 请求，也称作 query 请求：

```js
//一般发送请求是这么写（不推荐）：
axios.get('/user?id=12345&name=user')
.then(function (res) {
    console.log(res);
}).catch(function (err) {
    console.log(err);
});

//但是为了方便全局统一调用封装的axios，我一般采用（推荐）
axios.get('/user', {  //params参数必写 , 如果没有参数传{}也可以
    params: {
       id: 12345，
       name: user
    }
})
.then(function (res) {
    console.log(res);
})
.catch(function (err) {
    console.log(err);
});
```

### 二：post/put/patch 请求

传参方式大致用的有 3 种 **(1) 'Content-Type'= 'multipart/form-data' 传参格式为 formData** （全局请求头:'Content-Type'= 'application/x-www-form-urlencoded'） （request 的 Header:'Content-Type'= 'multipart/form-data'）

```js
var formData = new FormData()
formData.append('user', 123456)
formData.append('pass', 12345678)

axios
	.post('/notice', formData)
	.then((res) => {
		return res
	})
	.catch((err) => {
		return err
	})
```

**(2) 'Content-Type'= 'application/x-www-form-urlencoded' 传参格式为 query 形式,使用$qs.stringify** （全局请求头:'Content-Type'= 'application/x-www-form-urlencoded'） （request 的 Header:'Content-Type'= 'application/x-www-form-urlencoded'）

```js
import axios from 'axios'
import qs from 'Qs'
let data = { code: '1234', name: 'yyyy' }
axios
	.post(
		`${this.$url}/test/testRequest`,
		qs.stringify({
			data
		})
	)
	.then((res) => {
		console.log('res=>', res)
	})
```

**(3) 'Content-Type'= 'application/json 传参格式为 raw (JSON 格式)** （全局请求头:'Content-Type'= 'application/x-www-form-urlencoded'） （request 的 Header:'Content-Type'= 'application/json;charset=UTF-8'）

```js
//方法一：
import axios from 'axios'
let data = { code: '1234', name: 'yyyy' }
axios.post(`${this.$url}/test/testRequest`, data).then((res) => {
	console.log('res=>', res)
})

//方法二：
var readyData = JSON.stringify({
	id: 1234,
	name: user
})
axios
	.post('/notice', readyData)
	.then((res) => {
		return res
	})
	.catch((err) => {
		return err
	})
```

# 解决跨域问题

config 中的 index.js

```js
proxyTable: {
      '/api': {
        target:'http://8.140.117.209:8081/', // 你请求的第三方接口
        changeOrigin:true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite:{  // 路径重写，
          '^/api': ''  // 替换target中的请求地址，也就是说以后你在请求http://api.douban.com/v2/XXXXX这个地址的时候直接写成/api即可。
        }
      }
    },
```

axios.js 中

```js
const _axios = axios.create({
	timeout: 1000 * 12,
	baseURL: '/api'
})

// post请求头
_axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
```
