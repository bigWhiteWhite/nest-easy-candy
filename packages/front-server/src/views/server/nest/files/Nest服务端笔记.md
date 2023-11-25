# Nest 学习笔记（一）

## 创建项目

- 官网地址：https://docs.nestjs.com/cli/overview
- 安装脚手架

```ts
npm install -g @nestjs/cli
yarn global add @nestjs/cli
```

- 查看命令：

```shell
nest-book git:(master) nest   # 输入的命令
Usage: nest <command> [options]

Options:
  -v, --version                                   查看当前nestjs-cli的版本
  -h, --help                                      查看帮助

Commands:
  new|n [options] [name]                          生成一个新的项目
  build [options] [app]                           构建一个项目
  start [options] [app]                           运行项目
  info|i                                          显示项目的具体信息
  update|u [options]                              升级之前的依赖包
  add [options] <library>                         将对外部库的支持添加到项目中。
```

- 生成一个新项目，入口 main.ts ，根模块 app.module.ts

```js
nest new project-name    //构建项目，server是项目名
```

## 命令

- typegoose 本质上就是操作 Mongoose，因为 Mongoose 对 ts 的支持不太好,注意版本，mongoose 的 6 版本自己支持类型但是不好用，用回 5 的类型

```js
pnpm add mongoose@5.13.14
pnpm add @typegoose/typegoose@6.0.0
pnpm add nestjs-typegoose
```

## 常用依赖

```js
pnpm add nestjs-mongoose-crud
pnpm add @nestjs/config
pnpm add @nestjs/swagger swagger-ui-express
```

## 创建模块与启动

创建方便的 crud

```js
pnpm add nestjs-mongoose-crud
```

- 创建**模块**

```ts
nest g mo 模块名
nest g mo -p server + 模块名         //子项目中的接口模型
```

- 创建控制器

```js
nest g co 控制器名
nest g co -p server + 控制器名 --no--spec       // server子项目中的控制器模型,不生成测试文件
```

- 创建**服务层**

```js
nest g s 服务层名
nest g s -p admin notes // 在项目admin下的notes模块创建一个服务层
```

- **建立数据库子项目，数据库是通用的**

```js
nest g lib db
```

- 启动接口文件名

```js
npm run start:dev            //测试使用，会自动生成一个dist文件夹，在本地端口可以访问到
nest start -w admin
nest start -w server
```

## 控制器

- nestjs 没有单独配置路由的地方，定义好控制器后 nestjs 会自动给我们配置对应的路由

- 装饰器为@Controller('artcle'),装饰器为@Controller('article'),装饰器参数里面的'article'就是我们的路由

- 获取接口请求的各种参数[https://docs.nestjs.com/controllers]()

  - ```ts
    @Request(), @Req()    req
    @Response(), @Res()*    res
    @Next()    next
    @Session()    req.session
    @Param(key?: string)    req.params / req.params[key]
    @Body(key?: string)    req.body / req.body[key]
    @Query(key?: string)    req.query / req.query[key]
    @Headers(name?: string)    req.headers / req.headers[name]
    @Ip()    req.ip
    @HostParam()    req.hosts
    ```

  - ```ts
    import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common'
    import { CreateCatDto, UpdateCatDto, ListAllEntities } from './dto'

    @Controller('cats')
    export class CatsController {
    	@Post()
    	@HttpCode(HttpStatus.GONE) // 改变响应的状态
    	create(@Body() createCatDto: CreateCatDto) {
    		return 'This action adds a new cat'
    	}

    	@Get()
    	findAll(@Query() query: ListAllEntities) {
    		return `This action returns all cats (limit: ${query.limit} items)`
    	}

    	@Get(':id')
    	findOne(@Param('id') id: string) {
    		return `This action returns a #${id} cat`
    	}

    	@Put(':id')
    	update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    		return `This action updates a #${id} cat`
    	}

    	@Delete(':id')
    	remove(@Param('id') id: string) {
    		return `This action removes a #${id} cat`
    	}
    }
    ```

-

## 基础理解

- nest 是想把所有东西变成一个个模块，模块可以使用@Module 的装饰器，传入参数可以导入导出或者使用多个控制器，多个服务。
- 控制器使用@controller 装饰器，controller 里的参数就是路由地址。控制器层负责处理传入的请求，并返回对客户端的响应，控制器的目的是接受应用的特定请求。路由机制控哪个控制器接受哪些请求。通常，每个控制器有多个路由，不同的路由可以执行不同的操作。
- 服务使用@injectable 装饰器，个人理解是用来返回逻辑之类的。
- 对于跨模块的导入导出，一个模块中控制器或服务导出后，可以在另一个模块中引入，其控制器可以通过 this 拿到导入的控制器或服务。
- 全局模块[参考官网](https://docs.nestjs.com/modules#global-modules)
- 动态模块https://docs.nestjs.com/fundamentals/dynamic-modules
- 这个动态模块有点复杂，有点奇怪。需要使用模块上的静态方法 register 导出，其中 providers 里提供服务以及前缀，并导出这个服务，provide 代表@inject 时的那个值，useValue 就是动态传入的值。最后在需要使用动态模块的模块里以 register 静态方法导入，此时，这个 prefix 即为 register 的参数，此模块控制器通过 this 拿到服务调用方法。
- 模块中的依赖注入有 3 种方式，除了前面的 useValue，还有 useClass，useFactory+inject 方式：

```ts
@Module({
	imports: [],
	controllers: [AppController],
	providers: [
		{
			provide: 'LOG',
			useClass: LogService
		},
		{
			provide: 'APP_SERVICE',
			useFactory: (logger: LogService): string => {
				console.log(logger)
				logger.log('使用工厂方式')
				return '工厂方法返回'
			},
			inject: ['LOG']
		},
		{
			provide: 'IS_DEV',
			useValue: { isDev: true }
		}
	],
	exports: []
})
export class AppModule {}
```

## 生命周期

- 这个模块服务控制器里都有这些：

```ts
  onModuleInit() {
    console.log('OnModuleInit2');
  }
  onApplicationBootstrap() {
    console.log('onApplicationBootstrap2');
  }
  onModuleDestroy() {
    console.log('onModuleDestroy2');
  }
  beforeApplicationShutdown() {
    console.log('beforeApplicationShutdown2');
  }
```

# Nest 学习笔记（二）

## 传参、模板、cookie、session 的使用。

- 继续学习 nest。本篇是传参、模板、cookie、session 的使用。

## 知识梳理

### 在`Nestjs`中接收浏览器上的参数

- 1、常见的方法列表

| No. | 名字                      | 字段说明(参考`express`框架字段)                                              |
| --- | ------------------------- | ---------------------------------------------------------------------------- |
| 1   | `@Request()`              | `req` 获取到 req 请求的参数，获取的是 req 对象，如果要 query，要写 req.query |
| 2   | `@Response()`             | `res` 使用了 res 就不使用使用 return 返回值需要使用 res.send()               |
| 3   | `@Next()`                 | next                                                                         |
| 4   | `@Session()`              | `req.`session                                                                |
| 5   | `@Param(key?: string)`    | `req.params` / `req.params[key]` 获取动态路由的参数                          |
| 6   | `@Body(key?: string)`     | `req.body` / `req.body[key]` 获取 post 请求提交的参数                        |
| 7   | `@Query(key?: string)`    | 直接获取`req.query` / `req.query[key]` 获取 get 请求 query 的参数            |
| 8   | `@Headers(name?: string)` | `req.headers` / `req.headers[name]` 获取请求头的参数                         |

- 2、关于`@Query()`获取全部的参数

  ```typescript
  @Controller('user')
  export class UserController {
  	// 批量获取全部的参数,接收到的是一个对象,你传递什么我就接收什么
  	@Get()
  	userList(@Query() query: any): string {
  		console.log(query)
  		return '用户列表'
  	}
  }
  // 浏览器访问的url地址:http://localhost:3000/user?name=hello&age=20
  ```

- 3、选择性接收`Query()`中带参数并且判断参数类型

  ```typescript
  @Controller('user')
  export class UserController {
  	// 只接收全部参数里面的其中一个或者多个,ParseIntPipe是nestjs中内置管道
  	@Get()
  	userList(@Query('age', new ParseIntPipe()) age: number, @Query('name') name: string): string {
  		// 我只要age和name字段,别的你传递多的给我，我也不接收也不处理
  		console.log(age, name)
  		return '用户列表'
  	}
  }
  // 浏览器访问的url地址:http://localhost:3000/user?name=hello&age=20
  ```

- 4、`@Param`参数的获取

  ```typescript
  @Get(":id")
  userInfo(
    @Param() params:any
  ) {
    console.log(params); // 输出{ id: '2' }
    return "用户详情"
  }
  // 浏览器访问的url地址:http://localhost:3000/user/2
  ```

- 5、`@Param`单独接受参数

  ```typescript
  @Get(":id")
  userInfo(
    @Param('id', new ParseIntPipe()) id: number
  ) {
    console.log(id);
    return "用户详情"
  }
  // 浏览器访问的url地址:http://localhost:3000/user/2
  ```

- 6、`@Body()`接受`post`提交过来的数据(一次性接收全部的,也可以在`@Body()`中加参数类似上面的方式一样的校验传递过来的参数[仅仅是针对参数比较少的情况下])

  ```typescript
  @Post()
  addUser(
    @Body() body: any
  ) {
    // 这种写法适合大规模的提交参数,自己又不想一个一个去校验
    console.log(body);
    return body
  }
  // 使用postman提交post请求地址:http://localhost:3000/user/
  ```

## 使用模板

- 服务端渲染一般都有模板，使用 ejs 进行渲染示例：
- 安装：

```ts
npm install ejs --save
1
```

- main.ts

```ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { Logger } from '@nestjs/common'
import 'dotenv/config'
const PORT = process.env.PORT || 8080
async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)
	app.useStaticAssets(join(__dirname, '..', 'public'), {
		prefix: '/static/'
	})
	// 配置视图文件的目录
	app.setBaseViewsDir(join(__dirname, '..', 'views'))
	app.setViewEngine('ejs')
	await app.listen(PORT, () => {
		Logger.log(`服务已经启动,请访问:http://wwww.localhost:${PORT}`)
	})
}
bootstrap()
```

- 根目录建立 view 与 public，view 下建 index.ejs，写个页面，控制器中渲染它。

```ts
import { Controller, Get, Render } from '@nestjs/common'

@Controller()
export class AppController {
	@Get()
	@Render('index')
	getHello(): any {
		return { name: '哈哈' }
	}
}
```

- public 放入图片，ejs 中加入图片也应该能渲染。
- 下面试着使用模板引擎渲染 title 字段：

```ts
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%=title%></title>
  </head>
  <script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
  <body>
    <h1><%=title%></h1>
    <form action="/user/login" method="post">
      <p>
        <input type="text" name="username" />
      </p>
      <p>
        <input type="password" name="password" />
      </p>
      <p>
        <button type="submit">提交</button>
      </p>
    </form>
  </body>
</html>
```

- 控制器加入：

```ts
import { Controller, Get, Render, Post, Body, Response } from '@nestjs/common'

@Controller('user')
export class UserController {
	@Get()
	index() {
		return '主页'
	}

	@Get('login')
	@Render('index') // 渲染views里面的ejs模板
	loginPage() {
		return { title: '登录页面' } // 返回给ejs模板的数据
	}

	@Post('login')
	login(@Body() body, @Response() res) {
		console.log(body) // 获取表单中提交的数据
		res.redirect('/user') // 重定向到用户首页
		// 注意如果在控制器函数中使用了@Response()就不能使用return返回值
	}
}
```

## 使用 cookie

- 先进行安装

```ts
npm install cookie-parser -S
npm install @types/cookie-parser -D
```

- main.ts 中引入：

```ts
import cookieParser from 'cookie-parser'
app.use(cookieParser())
```

- 控制器中设置与读取。

```ts
import { Controller, Get, Response, Request } from '@nestjs/common'

@Controller('user')
export class UserController {
	@Get()
	index(@Request() req) {
		console.log(req.cookies.name, '当前的cookie')
		return '主页'
	}

	@Get('login')
	login(@Response() res) {
		res.cookie('name', 'hello', { maxAge: 1000 * 5, httpOnly: true })
		res.send('登录页面')
	}
}
```

cookie 参数：

```
1    domain    String    指定域名下有效
2    expires    Date    过期时间(秒),设置在某个时间点后会在该cookoe后失效
3    httpOnly    Boolean    默认为false表示不允许客户端(通过js来获取cookie)
4    maxAge    String    最大失效时间(毫秒),设置在多少时间后失效
5    path    String    表示cookie影响到的路径,如:path=/如果路径不能匹配的时候,浏览器则不发送这个cookie
6    secure    Boolean    当 secure 值为 true 时,cookie 在 HTTP 中是无效,在 HTTPS 中才有效
7    signed    Boolean    表示是否签名cookie,如果设置为true的时候表示对这个cookie签名了,这样就需要用res.signedCookies()获取值cookie不是使用res.cookies()了,
1234567
```

- 签名 cookie

```ts
// main.ts中
app.use(cookieParser(process.env.SECRET)) // 配合dotenv包来使用
12
import { Controller, Get, Response, Request } from '@nestjs/common'

@Controller('user')
export class UserController {
	@Get()
	index(@Request() req) {
		console.log(req.signedCookies, '当前的cookie')
		return '主页'
	}

	@Get('login')
	login(@Response() res) {
		res.cookie('name', 'hello', {
			maxAge: 1000 * 5,
			httpOnly: true,
			signed: true
		})
		res.send('登录页面')
	}
}
```

## 使用 Session

- 安装：

```ts
npm install express-session
npm install @types/express-session -D
```

- main.ts 引入

```ts
app.use(session({ secret: 'yehuozhili', cookie: { maxAge: 60000 } }))
```

- controller

```ts
import { Controller, Get, Request, Response } from '@nestjs/common'

@Controller('user')
export class UserController {
	@Get()
	index(@Request() req: { [key: string]: any }): string {
		console.log(req.session)
		return '用户主页'
	}

	@Get('login')
	login(@Response() res: { [key: string]: any }, @Request() req: { [key: string]: any }): void {
		console.log(req.session)
		req.session.name = 'hello'
		res.send('登录页面')
	}
}
```

- 常见参数

```
1    secret    一个 String 类型的字符串，作为服务器端生成 session 的签名
2    name    返回客户端的key 的名称，默认为connect.sid,也可以自己设置
3    resave    强制保存 session 即使它并没有变化,。默认为 true。建议设置成 false
4    saveUninitalized    强制将未初始化的 session 存储。当新建了一个 session 且未设定属性或值时，它就处于 未初始化状态。在设定一个 cookie 前，这对于登陆验证，减轻服务端存储压力，权限控制是有帮助的。( 默认:true)。建议手动添加
5    cookie    设置返回到前端key 的属性，默认值为{ path: ‘/’, httpOnly: true, secure: false, maxAge: null }。
6    rolling    在每次请求时强行设置 cookie，这将重置 cookie 过期时间(默认:false)
```

# Nest 学习笔记（三）

## 增删改查 demo

- 本篇写个增删改查 demo 。 这个 nest 绝对是大神中的大神写的，ts 的装饰器跟别的语言装饰器不太一样，所以如果想手撕手写 nest 很难。别的语言装饰器比如 python 就跟语法糖一样，写出这种效果没啥稀奇，ts 写出这玩意真是牛 b，感觉作者 ts 水平高我好几个档次。

## 流程

- 做增删改查 demo，正常来说，需要一个数据库，但是毕竟初学，先直接使用内存变量替代数据库。
- 制作个模板，先试着渲染出来:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Document</title>
		<script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
	</head>
	<body>
		<p>文章列表</p>
		<ul>
			<% items.forEach(function(item){%>
			<li><%=item.title %></li>
			<% }) %>
		</ul>
		<button id="1"> 添加 </button>
		<button id="2"> 删除 </button>
		<button id="3"> 修改 </button>
		<button id="4"> 查询 </button>
	</body>
</html>
```

- main.ts：

```js
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { Logger } from '@nestjs/common'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import session from 'express-session'

const PORT = process.env.PORT || 8080
const SECRET = process.env.SECRET || 'true'

export const posts = [{ title: '文章1' }, { title: '文章2' }]

async function bootstrap() {
	const app = (await NestFactory.create) < NestExpressApplication > AppModule
	app.useStaticAssets(join(__dirname, '..', 'public'), {
		prefix: '/static/'
	})
	// 配置视图文件的目录
	app.setBaseViewsDir(join(__dirname, '..', 'views'))
	app.setViewEngine('ejs')
	app.use(cookieParser(SECRET))
	app.use(session({ secret: '123456', cookie: { maxAge: 60000 } }))
	await app.listen(PORT, () => {
		Logger.log(`服务已经启动,请访问:http://wwww.localhost:${PORT}`)
	})
}
bootstrap()
```

- 在控制器里进行渲染:

```ts
import { Controller, Get, Render } from '@nestjs/common'
import { posts } from '../../main'
@Controller('posts')
export class PostsController {
	@Get()
	@Render('post')
	getData() {
		return { items: posts }
	}
}
```

- 访问 /posts/ 就显示了列表
- 下面写点 js 来做增删改查，好久没写 jquery 差点忘了咋写了。。。。

```ts
 <script>
    $('#1').click(function() {
      $.ajax({
        url: '/posts/add',
        success: () => {
          window.location.reload();
        },
      });
    });
    $('#2').click(function() {
      $.ajax({
        url: '/posts/del',
        success: () => {
          window.location.reload();
        },
      });
    });
    $('#3').click(function() {
      $.ajax({
        url: '/posts/mod',
        success: () => {
          window.location.reload();
        },
      });
    });
    $('#4').click(function() {
      $.ajax({
        url: '/posts/find',
        success: res => {
          console.log(res);
        },
      });
    });
  </script>
```

- 然后控制器写些逻辑就 ok 了：

```ts
export class PostsController {
	@Get()
	@Render('post')
	getData() {
		return { items: posts }
	}

	@Get('add')
	addData() {
		posts.push({ title: '新增文章' })
		return 'success'
	}

	@Get('del')
	delData() {
		posts.pop()
		return 'success'
	}

	@Get('mod')
	modData() {
		if (posts.length > 0) {
			posts[0].title = 'xxx'
		}
		return 'success'
	}

	@Get('find')
	findData() {
		return JSON.stringify(posts)
	}
}
```

# Nest 学习笔记（四）

## IOC&DI，Reflect Metadata，以及 nest 中的大致原理。

- 本篇学习下 IOC&DI，Reflect Metadata，以及 nest 中的大致原理。
- 我主要就是这里比较薄弱，所以看了 nest 感觉和作者水平差距太大了。

## Reflect Metadata

- 在写 nest 时候，上面可能会导入 reflect metadata 。
- 官网 https://www.npmjs.com/package/reflect-metadata
- 官网上说了，使用这玩意需要 tsconfig 开启 2 个装饰器按钮：

```
To enable experimental support for metadata decorators in your TypeScript project, you must add "experimentalDecorators": true to your tsconfig.json file.
To enable experimental support for auto-generated type metadata in your TypeScript project, you must add "emitDecoratorMetadata": true to your tsconfig.json file.
Please note that auto-generated type metadata may have issues with circular or forward references for types.
123
```

- 这个介绍说，这个库目标就是讲元数据修改添加功能统一起来，并且还可以在 proxy 等上能正常设置获取。为了实现 IOC 等效果。
- 基本用法：

```ts
Reflect.defineMetadata(metadataKey, metadataValue, target)
Reflect.defineMetadata(metadataKey, metadataValue, target, property)
Reflect.getMetadata(metadataKey, target)
Reflect.getMetadata(metadataKey, target, property)
```

- 一个定义和一个获取。getmetadata 还有种 getOwnMetadata，这个
- 还自带装饰器

```ts
class C {
	@Reflect.metadata(metadataKey, metadataValue)
	method() {}
}
```

- 这个效果和用 api 一个意思，只是用的装饰器来表示。
- 同时这个装饰器如果在 class 上面，代表给类的静态增加元数据，而如果在方法上，代表给类的原型对象加（简单可以理解为加在哪就是定义哪）
- 这个 reflect.metadata 装饰器其实相当于这样：

```ts
function classMetadata(key, value) {
	return function (target) {
		Reflect.defineMetadata(key, value, target)
	}
}
@classMetadata('name', 'person')
class C {}
```

- 如果这个装饰器需要修饰类的原型，那么需要多加参数，否则报错：

```ts
function classMetadata(key, value) {
	return function (target, propertyName) {
		Reflect.defineMetadata(key, value, target, propertyName)
	}
}
class C {
	@classMetadata('name', 'person')
	hello() {}
}
```

## IOC&DI

- 控制反转先举个简单例子。
- 比如我要找个女朋友，女朋友要车和要房，没有车和没有房女朋友就不会有，于是会有这样的代码：

```ts
interface BigHouse {}
class MyHouse implements BigHouse {}
interface BigCar {}
class MyCar implements BigCar {}
class GirlFriend {
	house: BigHouse
	car: BigCar
	constructor(house: BigHouse, car: BigCar) {
		this.car = car
		this.house = house
	}
	start() {
		console.log('yehuozhili女朋友创建完毕')
	}
}
let GF = new GirlFriend(new MyHouse(), new MyCar())
GF.start()
```

- 这里我要手动创建我的房子和车，来满足女朋友要求的大房子和大车，这样女朋友才可以成功创建。
- 现在觉得这个模式是不是已经很舒服了，不用优化了？其实还有更牛 b 的优化方式。
- 按上面那个举例就是，由于我单身太久，于是符合了国家分配政策，这样我可以直接领取女朋友，而女朋友所要的房子和车子，国家会来分配给她。我只要干一件事，就是领女朋友就 ok。
- 这里就可能有个问题，本来我可以掌控我的女朋友好看或者不好看，只要满足她需求即可，但是领女朋友就不一样了，这就是控制反转，而里面的国家就是 IOC 里容器的概念。
- IOC 和 DI 是一个概念的不同角度描述，对于女朋友来说，她依赖国家分配的房子，那么她这种方式，就是依赖注入。
- 实际在 nest 中，我们拿到女朋友，还需要使用她，这个房子和车子是我们自己手工搭建的逻辑，可以对房子和车子进行控制，通过容器的注入整合，可以在各种女朋友上使用车和房，达到换女朋友不换车和房的效果。

## 结合 nest

- 一般 service 中处理业务逻辑，注入其他模块中的方法就是在 module 的装饰器里的 providers 数组里加入，同时，在 controller 的 constructor 里用 private 声明这个 service，这样这个 service 就可以使用了。
- 这个例子里面，controller 是女朋友，service 是车和房，module 的 providers 里加入 service 就代表注册车和房依赖，而 controller 是女朋友，也在 module 的 controllers 数组里进行了注册，这样这个 module 的容器里就全了。
- 除了直接在 providers 里面直接注册 service，还可以使用 useClass，useValue，useFactory 的形式，而 useValue 和 useFactory 是需要返回实例的。
- nest 里声明的 priviate 类型会当成注入形式的 provide 上面的类型，没有这个类型就会报错，如果 provide 想使用字符串，需要使用 Inject 装饰器装饰对应的未找到服务的声明。

# Nest 学习笔记（五）

## dooring

- 继续学习 nest，前几天花了点时间重构了下 dooring，学习计划拉的有点多。

## 中间件

- 1、Middlewares 中间件(作用在客户端和控制器之间)
- 2、Guards 守卫
- 3、Interceptors 拦截器(在流被操纵之前)
- 4、Pipes 管道
- 5、Interceptors 拦截器(在流被操纵之后)
- 6、Exception filters 过滤器(如果发现任何异常)

## 函数中间件

- 函数中间件就是跟 express 中间件写法一样：

```ts
import { NextFunction, Request, Response } from 'express'
export const testMiddleWares = () => {
	return (_req: Request, _res: Response, next: NextFunction) => {
		console.log('test中间件')
		next()
	}
}
1234567
```

- main.ts 里调用：

```ts
app.use(testMiddleWares())
1
```

- 然后发起请求后，就会走一下此中间件。其实这就是函数中间件，nest 官网上全局中间件只写了这方法

## Nest 方式创建中间件

- 使用命令：

```ts
nest g mi middlewares/log --no-spec
1
```

- nest 会创建出这样的：

```ts
import { Injectable, NestMiddleware } from '@nestjs/common'

@Injectable()
export class LogMiddleware implements NestMiddleware {
	use(req: any, res: any, next: () => void) {
		console.log('nest中间件')
		next()
	}
}
123456789
```

- 中间件还分好几种，一般配消费者，后面配控制器

```ts
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LogMiddleware).forRoutes(UserController)
	}
}
12345
```

- forRoutes 这个还支持路由通配符：

```ts
forRoutes({ path: 'ab*cd', method: RequestMethod.ALL })
forRoutes('cats')
forRoutes({ path: 'cats', method: RequestMethod.GET })
123
```

- 多个中间件使用 apply:

```ts
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController)
1
```

## 守卫

- https://docs.nestjs.com/guards
- 创建守卫：

```ts
nest g gu guard/auth
```

- 生成这样的：

```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class AuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		return true
	}
}
```

- 从定义的返回值可以看见，支持同步或者异步的 boolean，返回 true 就继续，否则就拦截了。
- context 定义是这样的：

```ts
export interface ExecutionContext extends ArgumentsHost {
	/**
	 * Returns the *type* of the controller class which the current handler belongs to.
	 */
	getClass<T = any>(): Type<T>
	/**
	 * Returns a reference to the handler (method) that will be invoked next in the
	 * request pipeline.
	 */
	getHandler(): Function
}
```

- arugmentsHost:

```ts
export interface ArgumentsHost {
	/**
	 * Returns the array of arguments being passed to the handler.
	 */
	getArgs<T extends Array<any> = any[]>(): T
	/**
	 * Returns a particular argument by index.
	 * @param index index of argument to retrieve
	 */
	getArgByIndex<T = any>(index: number): T
	/**
	 * Switch context to RPC.
	 * @returns interface with methods to retrieve RPC arguments
	 */
	switchToRpc(): RpcArgumentsHost
	/**
	 * Switch context to HTTP.
	 * @returns interface with methods to retrieve HTTP arguments
	 */
	switchToHttp(): HttpArgumentsHost
	/**
	 * Switch context to WebSockets.
	 * @returns interface with methods to retrieve WebSockets arguments
	 */
	switchToWs(): WsArgumentsHost
	/**
	 * Returns the current execution context type (string)
	 */
	getType<TContext extends string = ContextType>(): TContext
}
```

- 大概意思是说这玩意是请求时获取可以拿到一些控制器方法之类的东西。
- 使用方法有全局使用：

```ts
// 在main.ts中使用
app.useGlobalGuards(new AuthGuard())
```

- 此时访问会发现每次必走守卫。
- 如果守卫返回 false，直接返回 403
- 模块注入：

```ts
 providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
```

- 如果走此模块的直接会过一遍守卫。
- 控制器中使用：

```ts
@Controller('user')
@UseGuards(AuthGuard) // 在控制器层面控制
export class UserController {
```

- 只要走此控制器就要走守卫，其他控制器不影响。这个比较好用。
- 单个接口守卫：

```ts
  @UseGuards(AuthGuard)
  @Get()
  async userList(): Promise<UserEntity[]> {
    return await this.userService.userList();
  }
```

- 这个相当好用，非常灵活。

## 拦截器

- https://docs.nestjs.com/interceptors
- 拦截器是双向的，类似于洋葱模型的玩意。
- 可以：在函数执行之前/之后绑定额外的逻辑转换从函数返回的结果转换从函数抛出的异常扩展基本函数行为根据所选条件完全重写函数 (例如, 缓存目的)
- 创建拦截器：

```ts
nest g in interceptors/logging --no-spec
```

- 会生成这样：

```ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle()
	}
}
```

- 几种使用方式
- 在 main.ts 中引入：

```ts
app.useGlobalInterceptors(new LoggingInterceptor())
```

- 模块中注入：

```ts
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
```

- 控制器中使用：

```ts
@UseInterceptors(new LoggingInterceptor())
```

- 制作请求接口响应时间：

```ts
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		console.log('拦截器')
		const request = context.switchToHttp().getRequest()
		const method = request.method
		const url = request.url
		const now = Date.now()
		return next.handle().pipe(
			tap(() => {
				Logger.log(`${method} ${url} ${Date.now() - now}ms hhh`, context.getClass().name)
			})
		)
	}
}
```

- 可以发现 return 后面就是响应，前面是请求过来。

# Nest 学习笔记（六）

## 为管道和异常过滤器。

## 管道

- https://docs.nestjs.com/pipes
- 管道的主要作用对客户端传递的数据进行转换,依赖包 class-transformer(需要自己安装) 对客户端传递的数据进行校验,依赖包 class-validator(需要自己安装)
- Nestjs 官方提供的几个内置管道(官网说的开箱即用)

```
ValidationPipe
ParseIntPipe
ParseBoolPipe
ParseArrayPipe
ParseUUIDPipe
DefaultValuePipe
123456
```

- [内置管道官网说明](https://docs.nestjs.com/techniques/validation)
- [class-validator 提供了很多常用验证，官网](https://github.com/typestack/class-validator#validation-decorators)
- [class-transform 官网](https://github.com/typestack/class-transformer)，看了下说明，这玩意是可以把普通对象变为对应类的实例。
- 使用管道:
- 用之前要把上面 2 个包装一下，不然报错。
- 全局使用 main.ts 中加入：

```ts
import { ValidationPipe } from '@nestjs/common';
...
app.useGlobalPipes(new ValidationPipe());
```

- 模块注入：

```ts
import {  ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

@Module({
  ...
  providers: [
    ...
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    }
  ]
})
export class UserModule { }
```

- 控制器中使用：

```ts
@Get(':uuid')
async findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
  return this.catsService.findOne(uuid);
}
```

- 使用自定义管道

```ts
nest g pi pipes/validation/validation
```

- 会创建这样一个文件：

```ts
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ValidationPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		return value
	}
}
```

- 修改下：

```ts
import { ArgumentMetadata, Injectable, PipeTransform, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'

@Injectable()
export class MYValidationPipe implements PipeTransform {
	async transform(value: any, metadata: ArgumentMetadata) {
		console.log(metadata)
		const { metatype } = metadata
		// 如果没有传入验证规则，则不验证，直接返回数据
		if (!metatype || !this.toValidate(metatype)) {
			return value
		}
		// 将对象转换为 Class 来验证
		const object = plainToClass(metatype, value)
		const errors = await validate(object)
		Logger.log(errors, 'validation.pipe处理')
		if (errors.length > 0) {
			//获取第一个错误并且直接返回
			const msg = Object.values(errors[0].constraints)[0]
			// 统一抛出异常
			throw new HttpException({ message: msg }, HttpStatus.OK)
		}
		return value
	}

	private toValidate(metatype: any): boolean {
		const types = [String, Boolean, Number, Array, Object]
		return !types.includes(metatype)
	}
}
```

- 实际上这个 metaType，就是后面要传入编写的验证规则。metaData 里会像 bodyparser 一样规整传入格式，分配到对应对象。
- 这里利用的就是 classTransformer 中会试着把对象变为其实例，metaType 就是验证器的定义，而 value 就是普通对象，如果能成功变为其实例，则返回空数组，否则会有 error 产生，从而报错。
- 然后再全局使用此管道：

```ts
app.useGlobalPipes(new MYValidationPipe())
```

- 编写 dto 验证规则：

```ts
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateUserTdo {
	// 定义多个校验的装饰器,执行顺序是从下往上执行的,先执行IsNotEmpty然后执行IsString
	@IsString({ message: '用户名必须为字符串类型' })
	@IsNotEmpty({ message: '用户名不能为空' })
	username: string

	@IsString({ message: '密码必须为字符串类型' })
	@IsNotEmpty({ message: '密码不能为空' })
	password: string
}
```

- 对 createUser 进行校验：

```ts
  @Post()
  async createUser(@Body() data: CreateUserTdo): Promise<UserEntity> {
    return await this.userService.createUser(data);
  }
```

- 发送空用户名请求去验证：

```json
{
	"username": "",
	"password": "sasaddsads"
}
```

- 返回：

```ts
{
  "message": "用户名不能为空"
}
```

- 即生效。

## 管道拦截器统一数据格式

- 这个地方踩了下坑，怪不得会有这种 class-transformer 转换来转换去的。类似于 exclude 这种排除需要在返回其类的实例的情况下，但是像 service 的方法如果调用的是 repo 保存，虽然类型上写返回实例，实际却并不是其实例，需要自行转换。
- 生成拦截器：

```ts
nest g in interceptors/transform --no-spec
```

- 全局使用下
- 编写拦截器：

```ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
@Injectable()
export class TransformInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data: any) => {
				return {
					result: data,
					code: 0,
					message: '请求成功'
				}
			})
		)
	}
}
```

- 对密码做排除：

```ts
import { Exclude } from 'class-transformer';
...
@Exclude() // 排除返回字段,不返回给前端
@Column({
  type: 'varchar',
  nullable: false,
  length: 100,
  comment: '密码'
})
password: string;
```

- 最后进行验证，看是否返回密码。

## 异常过滤器

- https://docs.nestjs.com/exception-filters
- 创建:

```ts
nest g f filters/httpException --no-spec
```

- 会生成这玩意：

```ts
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
	catch(exception: T, host: ArgumentsHost) {}
}
```

- 定义全局错误返回格式：

```ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse()
		const request = ctx.getRequest()
		const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

		const message = exception.message
		Logger.log(exception, '错误提示')
		const errorResponse = {
			status,
			message,
			code: 1, // 自定义code
			path: request.url, // 错误的url地址
			method: request.method, // 请求方式
			timestamp: new Date().toISOString() // 错误的时间
		}
		// 打印日志
		Logger.error(`${request.method} ${request.url}`, JSON.stringify(errorResponse), 'HttpExceptionFilter')
		// 设置返回的状态码、请求头、发送错误信息
		response.status(status)
		response.header('Content-Type', 'application/json; charset=utf-8')
		response.send(errorResponse)
	}
}
```

- 全局使用下：

```ts
app.useGlobalFilters(new HttpExceptionFilter())
```

- 然后可以试验个未捕获错误，是否触发了此过滤器。

# Nest 学习笔记（七）

## jwt 使用和 passport 相关

## 官网

- https://docs.nestjs.com/techniques/authentication
- nest 官网介绍说验证最好结合使用 passport ，并且提供了@nestjs/passport
- passport: http://www.passportjs.org/docs/
- passport 自定义策略可以看看这个https://github.com/jwalton/passport-api-docs

## 流程

- nest 新开个项目 nest new xxx
- 按照指示，安装：

```
$ npm install --save @nestjs/passport passport passport-local
$ npm install --save-dev @types/passport-local
```

- 生成 auth 模块和 users 模块

```
$ nest g module auth
$ nest g service auth
$ nest g module users
$ nest g service users
```

- 修改 user 的服务：

```ts
import { Injectable } from '@nestjs/common'

export type User = any

@Injectable()
export class UsersService {
	private readonly users: User[]

	constructor() {
		this.users = [
			{
				userId: 1,
				username: 'john',
				password: 'changeme'
			},
			{
				userId: 2,
				username: 'chris',
				password: 'secret'
			},
			{
				userId: 3,
				username: 'maria',
				password: 'guess'
			}
		]
	}

	async findOne(username: string): Promise<User | undefined> {
		return this.users.find((user) => user.username === username)
	}
}
```

- modules 中将服务暴露

```
 exports: [UsersService],
```

- auth 服务中制作验证 user 的方法：

```ts
import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService) {}

	async validateUser(username: string, pass: string): Promise<any> {
		const user = await this.usersService.findOne(username)
		if (user && user.password === pass) {
			const { password, ...result } = user
			return result
		}
		return null
	}
}
```

- 同时 auth 的模块中导入 user 的模块
- 新建 local.strategy.ts：

```ts
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super()
	}

	async validate(username: string, password: string): Promise<any> {
		const user = await this.authService.validateUser(username, password)
		if (!user) {
			throw new UnauthorizedException()
		}
		return user
	}
}
```

- 使用别的字段在 super 里改 super({ usernameField: ‘email’ })
- 然后在模块中导入 passportModule，提供上面建立的服务：

```ts
@Module({
  imports: [UsersModule,PassportModule],
  providers: [AuthService,LocalStrategy],
})
```

- 在 appcontroller 里面用守卫做个 Post 路由：

```ts
import { Controller, Request, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Controller()
export class AppController {
	@UseGuards(AuthGuard('local'))
	@Post('auth/login')
	async login(@Request() req) {
		return req.user
	}
}
```

- 此时启动 nest ，已经可以 post 了，输入：

```
    {
        "username": "john",
        "password": "changeme"
    }
```

- 则可以正确返回 user ，否则直接跳 401。
- 还可以进行转换下，新建 local-auth.guard.ts：

```ts
import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
```

- 守卫处改为：

```
 @UseGuards(LocalAuthGuard)
```

### 结合 jwt

- 需要安装：

```
$ npm install --save @nestjs/jwt passport-jwt
$ npm install --save-dev @types/passport-jwt
```

- 首先在 auth 服务里声明 jwtService 并增加登录方法：

```ts
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private jwtService: JwtService) {}

	async validateUser(username: string, pass: string): Promise<any> {
		const user = await this.usersService.findOne(username)
		if (user && user.password === pass) {
			const { password, ...result } = user
			return result
		}
		return null
	}
	async login(user: any) {
		const payload = { username: user.username, sub: user.userId }
		return {
			access_token: this.jwtService.sign(payload)
		}
	}
}
```

- 需要设立个盐值：

```
export const jwtConstants = {
  secret: 'secretKey',
};
```

- auth 模块中导入注册：

```
 JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
```

- [jwt 更多配置](https://github.com/nestjs/jwt/blob/master/README.md)
- 修改控制器路由，当验证通过后，走 jwt 服务，传递 user 过去，jwt 服务对 user 进行加密，返回 accesstoken。
- 如果 import 了 authmodule，就别在 provider 里去引入服务，否则会让你再注册遍。
- controller 里直接调用服务：

```ts
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
```

- 这样输入正确后则返回 accesstoken。
- 下面制作 Jwt passport
- 新建 jwt.strategy.ts

```ts
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { jwtConstants } from './constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConstants.secret
		})
	}

	async validate(payload: any) {
		return { userId: payload.sub, username: payload.username }
	}
}
```

- jwtFromRequest 一般都是提取 bearerToken，这个是约定。
- 第二个忽略过期，就是过期就无效。
- provider 中导入它：

```
providers: [AuthService, LocalStrategy, JwtStrategy],
```

- 新建 jwt-auth.guard.ts：

```ts
import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

- 控制器老方法加一下：

```ts
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
```

- 此时就完成了。
- 可以试下，先拿到 accesstoken 然后设置请求头 Authorization 值为 Bearer token 返回符合预期即可成功。
- 有可能不满足现有 jwt 的验证，需要额外逻辑，可以这么写：

```ts
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	canActivate(context: ExecutionContext) {
		// Add your custom authentication logic here
		// for example, call super.logIn(request) to establish a session.
		return super.canActivate(context)
	}

	handleRequest(err, user, info) {
		// You can throw an exception based on either "info" or "err" arguments
		if (err || !user) {
			throw err || new UnauthorizedException()
		}
		return user
	}
}
```

# Nest 学习笔记（八）

## 单点登录

- 本篇利用上一节 jwt+local 策略+passport 的知识结合 redis 制作单点登录。

## 原理

- 主要利用 jwt 每次生成 token 不一样，再次登录时覆盖 redis 的键使得验证不通过。
- passport-jwt 守卫可以对已发出的 jwt token 进行验证，如果验证成功，再去 redis 上对比下即可完成单点登录。

## 流程

- 首先 nest new 一个项目出来。
- 同时安装 typeorm mysql

```
npm install --save @nestjs/typeorm typeorm mysql
npm i --save @nestjs/config  class-transformer class-validator
```

- 安装 passport 一套策略

```
$ npm install --save @nestjs/passport passport passport-local
$ npm install --save-dev @types/passport-local
$ npm install --save @nestjs/jwt passport-jwt
$ npm install --save-dev @types/passport-jwt
```

- 首先创建个数据库，然后 typeorm 链接它：

```ts
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
```

config:

```ts
export default () => ({
	type: process.env.DB_TYPE,
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	database: process.env.DB_DATABASE,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	logging: true,
	jwtSecret: process.env.JWT_TOKEN
})
```

ormconfig:

```js
module.exports = [
	{
		name: 'default',
		type: process.env.DB_TYPE,
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT),
		database: process.env.DB_DATABASE,
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		logging: false,
		synchronize: true,
		entities: ['dist/src/**/*.entity.{ts,js}'],
		migrations: ['src/migration/*.ts'],
		subscribers: ['src/subscriber/**/*.ts'],
		cli: {
			entitiesDir: 'src/',
			migrationsDir: 'src/migration',
			subscribersDir: 'src/subscriber'
		}
	}
]
```

- 能连接 Ok 后，下面需要弄点数据，制作实体。
- 首先制作 user 的实体，主要是用户密码，生成 user 的模块服务控制器一套：

```ts
import { Exclude, Expose } from 'class-transformer'
import { Column, CreateDateColumn, DeepPartial, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'user' })
export class UserEntity {
	@PrimaryGeneratedColumn({
		type: 'int',
		name: 'id',
		comment: '主键id'
	})
	id: number

	@Column({
		type: 'varchar',
		nullable: false,
		length: 50,
		unique: true,
		name: 'username',
		comment: '用户名'
	})
	username: string

	@Exclude() // 排除返回字段,不返回给前端
	@Column({
		type: 'varchar',
		nullable: false,
		length: 100,
		comment: '密码'
	})
	password: string

	@Column('tinyint', {
		nullable: false,
		default: () => 0,
		name: 'is_del',
		comment: '是否删除,1表示删除,0表示正常'
	})
	isDel: number

	@CreateDateColumn({
		type: 'timestamp',
		nullable: false,
		name: 'created_at',
		comment: '创建时间'
	})
	createdAt: Date

	@UpdateDateColumn({
		type: 'timestamp',
		nullable: false,
		name: 'updated_at',
		comment: '更新时间'
	})
	updateAt: Date

	@Expose()
	isDelStr(): string {
		return this.isDel ? '删除' : '正常'
	}
}

export type UserEntityDataType = DeepPartial<UserEntity>
```

- 导入它

```
imports: [TypeOrmModule.forFeature([UserEntity])],
```

- 然后需要制作个 register 来生成用户，login 来登录用户。
- 先制作 user 服务，创建和查询

```ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity, UserEntityDataType } from './user.entity'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}

	async createUser(data: UserEntityDataType): Promise<UserEntity> {
		const user = await this.userRepository.save(data) //这里密码以后需要加密
		const res = plainToClass(UserEntity, user) //只有变为实例才可以生效class-transformer的装饰器效果
		return res
	}

	async findOne(username: string): Promise<UserEntity> {
		return await this.userRepository.findOne({ where: { username: username } })
	}

	//这个验证会交给passport-local
	async validateUser(username: string, pass: string): Promise<UserEntity | null> {
		const user = await this.findOne(username)
		if (user && user.password === pass) {
			//这里密码以后需要加密，user.password是加密后的密码，pass也进行加密，看是否相等
			const result = user
			return result
		}
		return null
	}

	//通过守卫后进入login 到时候交给jwt服务返回token
	async login(user: any) {
		const payload = { username: user.username, sub: user.userId }
		return payload
	}
}
```

- 其实就是 typeorm module 里存了各种你定义的实体，声明下即可链接，然后拿到 connection 使用。
- 然后需要控制器调用服务：

```ts
  @Post('/register')
  async register(@Body() req) {
    const data: UserEntityDataType = {
      username: req.username,
      password: req.password,
    };
    console.log(data);
    return await this.userSrv.createUser(data);
  }
```

- 然后需要制作 dto 校验（其实我个人认为这个 dto 整的有点繁琐）。

```
nest g pi pipes/validation/validation
1
import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class MYValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const msg = Object.values(errors[0].constraints)[0];
      throw new HttpException({ message: msg }, HttpStatus.OK);
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

- 全局使用

```
app.useGlobalPipes(new MYValidationPipe());
```

- 编写 dto：

```ts
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateUserDto {
	@IsString({ message: '用户名必须为字符串类型' })
	@IsNotEmpty({ message: '用户名不能为空' })
	username: string

	@IsString({ message: '密码必须为字符串类型' })
	@IsNotEmpty({ message: '密码不能为空' })
	password: string
}
```

- 导入使用：

```ts
 async register(@Body() req :CreateUserDto) {
    const data: UserEntityDataType = {
      username: req.username,
      password: req.password,
    };
    console.log(data);
    return await this.userSrv.createUser(data);
  }
```

- 验证输入空用户注册，如果返回预期则 ok 。
- 下面制作登录，登录需要返回 jwt token 以及验证用户名密码
- 梳理下流程，首先是未登录状态走 login ，会进入 local 策略，验证用户密码，如果密码 ok ，交给 jwt 服务，分发 token。当访问要权限的接口时，进入 jwt 策略验签，成功验签则继续。单点登录时，走 jwt 服务时需要用户和 token 传给 redis，而访问权限接口时，进行验签，验签通过则检测 redis 的 token 和传来是否一致，不一致则表明用户不是单点登录状态。
- 首先先不考虑 redis，直接将 passport 策略完成。
- local 策略需要制作 local.strategy 以及 local.guard。

strategy:

```ts
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from './user.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private userSrv: UserService) {
		super()
	}

	async validate(username: string, password: string): Promise<any> {
		const user = await this.userSrv.validateUser(username, password)
		if (!user) {
			throw new UnauthorizedException()
		}
		return user
	}
}
```

guards:

```ts
import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
```

- 这样就有了个 local 策略的守卫，将其装饰到登录接口上：

```ts
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    //local策略会返回user实例，这个返回是自己写的，
    ///验证通过后去拿user实例的id 去jwt加密
    return await this.userSrv.login(req.user);
  }
```

- 别忘记在模块中提供 local 服务。
- 此时测试符合预期即可。下面制作 jwt 策略。
- 老样子，一个策略加一个守卫，加密需要用到 jwt 服务，所以要注入 module：

```ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import configuration from '../../config/database.config';
import 'dotenv/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().jwtSecret,
    });
  }

  async validate(payload: any) {
    console.log(payload);
    return 'hello';
  }
}
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
   JwtModule.register({
      secret: configuration().jwtSecret,
      signOptions: { expiresIn: '60s' },
    }),
```

- 修改通过 login 的逻辑，通过 Local 后，交给 jwt 服务加密：

```ts
  //通过守卫后进入login 到时候交给jwt服务返回token
  async login(user: UserEntity) {
    const payload = { username: user.username, id: user.id };
    const token = await this.jwtService.sign(payload);
    return {
      access_token: token,
    };
  }
```

- 这样可以测试下，符合预期就 ok。

## Redis

```ts
npm install nestjs-redis ioredis
```

- 生成其模块及服务：

```
>nest g mo redisUtils
>nest g s redisUtils
```

- 注册为全局模块:

```ts
import { Module, Global } from '@nestjs/common'
import { RedisModule } from 'nestjs-redis'
import { RedisUtilsService } from './redis-utils.service'

@Global()
@Module({
	imports: [
		RedisModule.register({
			port: 6379,
			host: '127.0.0.1',
			password: '',
			db: 0
		})
	],
	providers: [RedisUtilsService],
	exports: [RedisUtilsService]
})
export class RedisUtilsModule {}
```

- 封装服务：

```ts
import { Injectable } from '@nestjs/common'
import { RedisService } from 'nestjs-redis'
import { Redis } from 'ioredis'

@Injectable()
export class RedisUtilsService {
	public client: Redis
	constructor(private redisService: RedisService) {}

	onModuleInit(): void {
		this.getClient()
	}

	public getClient(): void {
		this.client = this.redisService.getClient()
	}

	public async set(key: string, value: { [propsName: string]: any } | string, second?: number): Promise<'OK'> {
		value = JSON.stringify(value)
		if (!second) {
			return await this.client.setex(key, 24 * 60 * 60, value)
		} else {
			return await this.client.set(key, value, 'EX', second)
		}
	}

	public async get(key: string): Promise<any> {
		const data = await this.client.get(key)
		if (data) {
			return JSON.parse(data)
		} else {
			return null
		}
	}

	public async del(key: string): Promise<number> {
		return await this.client.del(key)
	}

	public async flushall(): Promise<'OK'> {
		return await this.client.flushall()
	}
}
```

- 然后在 redis 加密时存入 redis :

```ts
  //通过守卫后进入login 到时候交给jwt服务返回token
  async login(user: UserEntity) {
    const payload = { username: user.username, id: user.id };
    const token = await this.jwtService.sign(payload);
    //存入redis
    const redisData = {
      token,
      user,
    };
    this.redisSrv.set(String(user.id), redisData);
    return {
      access_token: token,
    };
  }
```

- 修改 jwt 验签后流程，检查 token 是否一致：

```ts
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import configuration from '../../config/database.config'
import 'dotenv/config'
import { RedisUtilsService } from 'src/redis-utils/redis-utils.service'
import { Request } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private redisSrv: RedisUtilsService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configuration().jwtSecret,
			passReqToCallback: true
		})
	}

	async validate(req: Request, payload: any) {
		//payload为token解码后内容,能过来说明已验签成功，不管是不是多点登录
		const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)
		const redisData = await this.redisSrv.get(payload.id)
		//确认token身份, 查redis即可，因为写入redis时查了库
		if (redisData.user.username !== payload.username) {
			throw new UnauthorizedException('invalid token')
		}
		//对比token，看是否一致，不一致说明多点登录了
		if (token !== redisData.token) {
			throw new UnauthorizedException('you have logged in another place')
		}
		return payload
	}
}
```

- 制作 get 接口测试：

```ts
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
```

- 此时可以测试下，post 生成 token，开个接口放上 jwt 守卫，用第一次 token 能过，然后 post 第二个 token，此时用旧 token 会提示你已别处登录。新 token 可以正常登录。

## swagger 文档

- 基本上前面就已经实现完成了，最后用 swagger 做个接口文档：

```ts
npm install --save @nestjs/swagger swagger-ui-express
```

- nest 官方对 swagger 的文档位置：https://docs.nestjs.com/openapi/introduction
- 中文文档这方面比英文要详细：https://docs.nestjs.cn/7/introduction

```ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
const PREFIX = 'nest-passport-sso-demo'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.useGlobalPipes(new MYValidationPipe())

	const options = new DocumentBuilder()
		.setTitle('nest framework  api文档')
		.setDescription('nest framework  api接口文档')
		.addBearerAuth({ type: 'apiKey', in: 'header', name: 'Authorization' })
		.setVersion('0.0.1')
		.build()

	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup(`${PREFIX}`, app, document) //这里是swagger的路径
	console.log('3000', 'ok')
	await app.listen(3000)
}
bootstrap()
```

- prefix 即为 swagger 的路径，启动后可以访问即 ok。
- 控制器中加入说明：

```
@ApiTags('用户登录')
@Controller('user')
```

- 这个会在该控制器接口上方来个大字。
- dto 加属性：

```ts
export class CreateUserDto {
	@ApiProperty()
	@IsString({ message: '用户名必须为字符串类型' })
	@IsNotEmpty({ message: '用户名不能为空' })
	username: string
	@ApiProperty()
	@IsString({ message: '密码必须为字符串类型' })
	@IsNotEmpty({ message: '密码不能为空' })
	password: string
}
```

- 然后这么使用：

```ts
  @ApiOperation({
    summary: '用户登录',
    description: '用户名和密码登录',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateUserDto })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    //local策略会返回user实例，这个返回是自己写的，
    ///验证通过后去拿user实例的id 去jwt加密
    return await this.userSrv.login(req.user);
  }
  @ApiOperation({
    summary: '用户注册',
    description: '用户名和密码注册',
  })
  @Post('/register')
  async register(@Body() req: CreateUserDto) {
    const data: UserEntityDataType = {
      username: req.username,
      password: req.password,
    };
    return await this.userSrv.createUser(data);
  }

  @ApiOperation({
    summary: '测试接口',
    description: '需求权限的测试接口',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
```
