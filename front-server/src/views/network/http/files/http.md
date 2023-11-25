# http

## http 和 https

## http 缓存

### 强缓存和协商缓存

强缓存：浏览器不会像服务器发送任何请求，直接从本地缓存中读取文件并返回 Status Code: 200 OK

![img](http.assets/16a8bdbc4b9c8720~tplv-t2oaga2asx-watermark.awebp)

> 200 form memory cache : 不访问服务器，一般已经加载过该资源且缓存在了内存当中，直接从内存中读取缓存。浏览器关闭后，数据将不存在（资源被释放掉了），再次打开相同的页面时，不会出现 from memory cache。

> 200 from disk cache： 不访问服务器，已经在之前的某个时间加载过该资源，直接从硬盘中读取缓存，关闭浏览器后，数据依然存在，此资源不会随着该页面的关闭而释放掉下次打开仍然会是 from disk cache。

> 优先访问 memory cache,其次是 disk cache，最后是请求网络资源

协商缓存: 向服务器发送请求，服务器会根据这个请求的 request header 的一些参数来判断是否命中协商缓存，如果命中，则返回 304 状态码并带上新的 response header 通知浏览器从缓存中读取资源

![img](http.assets/16a8bc3172e3a167~tplv-t2oaga2asx-watermark.awebp)

两类缓存规则可以同时存在，强制缓存优先级高于协商缓存，也就是说，当执行强制缓存的规则时，如果缓存生效，直接使用缓存，不再执行协商缓存规则。

### expires

服务器和浏览器以 GMT 格式标准时间约定文件过期时间，用 expires 字段控制。下次请求时，请求时间小于服务端返回的到期时间则直接使用缓存（没有走到服务端）。

缺点：

1. 缓存过期后，不论目标文件是否产生过变化，都会再次读取目标文件并返回到浏览器
2. 服务器和浏览器时间可能不同步，缓存使用不精准

### Cache-Control

| 字段值   | 作用                                                                         |
| -------- | ---------------------------------------------------------------------------- |
| no-cache | 防止从缓存中返回过期的资源，所以使用之前，需要和源服务器发起请求比对过期时间 |
| no-store | 这个指令才是真正的不进行缓存，暗示请求报文中可能含有机密信息，不可缓存       |
| max-age  | 在指定时间内（单位秒），缓存服务器不再对资源的有效性进行确认，可以使用       |
| private  | 只有某个在通过缓存服务器的时候，得到缓存资源                                 |
| public   | 所有的用户在通过缓存服务器的时候，都可以缓存这个资源。                       |

针对浏览器和服务器时间不同步，加入了新的缓存方案；这次服务器不是直接告诉浏览器过期时间，而是告诉一个相对时间`max-age=10`，意思是 10 秒内，直接使用浏览器缓存。

![cache-control](http.assets/16531214de157f88~tplv-t2oaga2asx-watermark.awebp)

### Last-Modified / If-Modified-Since

服务器比较请求头中的`If-Modified-Since `，如果一致则给出 304 状态码，不返回目标文件；如果不一致，则返回目标文件并告知浏览器目标文件最新的`Last-Modified`

缺点：

1. Last-Modified 过期时间只能精确到秒。无法应对同一秒内文件密集更新的情况
2. Last-Modified 只匹配时间，不匹配文件内容。无法应对目标文件实际被覆盖然而内容前后未发生改变的情况

### Etag / If-None-Match

应对文件内容不变的情况，在服务器引入 Etag 响应头，

![img](http.assets/16a8c60fb0ef49f0~tplv-t2oaga2asx-watermark.awebp)

# 跨域

- 同源策略请求 ajax / fetch
- 跨域传输（非同源策略请求）

部署在同一个 web 服务器上：同源策略

- xampp 修改本地的 host 文件

  ```js
  127.0.0.1:1234 http://api.qq.com 模拟同源
  ```

开发过程中不是同源策略

服务器拆分

web 服务器：静态资源 kbs.sports.qq.com

data 服务器：业务逻辑和数据分析 api.sports.qq.com

图片服务器

三者都一样就是同源，否则就是跨域

- 协议
- 域名
- 端口号

WEB 服务器地址：http://127.0.0.1:3000/index.html

数据接口地址：http://127.0.0.1:4000/list

## JSONP

不存在跨域请求限制的标签

- script
- img
- link
- iframe

![image-20210321214455304](跨域.assets\image-20210321214455304.png)

问题：JSONP 只能处理 GET 请求

## CORS

跨域资源共享

- 客户端（发送 ajax/fetch）

- 服务器端设置相关的头信息（需处理 options 试探性请求）

  `Access-Control-Allow-Origin`设置为 `*`就不允许携带 cookie 了

```js
app.use((req, res, next) => {
	const { ALLOW_ORIGIN, CREDENTIALS, HEADERS, ALLOW_METHODS } = CONFIG.CROS
	res.header('Access-Control-Allow-Origin', ALLOW_ORIGIN)
	res.header('Access-Control-Allow-Credentials', CREDENTIALS)
	res.header('Access-Control-Allow-Headers', HEADERS)
	res.header('Access-Control-Allow-Methods', ALLOW_METHODS)
	req.method === 'OPTIONS' ? res.send('CURRENT SERVICES SUPPORT CROSS DOMAIN REQUESTS!') : next()
})

//config.js
module.exports = {
	//=>WEB服务端口号
	PORT: 3001,

	//=>CROS跨域相关信息
	CROS: {
		ALLOW_ORIGIN: 'http://127.0.0.1:5500', // => *
		ALLOW_METHODS: 'PUT,POST,GET,DELETE,OPTIONS,HEAD',
		HEADERS: 'Content-Type,Content-Length,Authorization, Accept,X-Requested-With',
		CREDENTIALS: true
	},

	//=>SESSION存储相关信息
	SESSION: {
		secret: 'ZFPX',
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 30
		}
	}
}
```

## http proxy

=>webpack webpack-dev-server

## Nginx 反向代理

## postMessage

## WebSocket 协议跨域

## document.domain + iframe

![image-20210322000148300](跨域.assets\image-20210322000148300.png)

## window.name + iframe

## location.hash + iframe
