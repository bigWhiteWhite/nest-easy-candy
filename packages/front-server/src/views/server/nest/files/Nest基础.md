# Nest参考文章

- [Nestjs从0到1](https://juejin.cn/column/6960949607794737159)
- [从0搭建nestjs项目并部署到本地docker](https://juejin.cn/post/7215844385614528549#heading-27)
- [jenkins+docker-compose+gitee实现自动化部署nestjs项目](https://juejin.cn/post/7215881683295207481)

# class-validator

[文档](https://www.npmjs.com/package/class-validator#validation-groups)

- 校验嵌套对象

  - ```ts
    export class Meta {
    	@IsString()
    	readonly title: string
    }
    export class CreateMenuDto {
        @ValidateNested()
        @Type(() => Meta)
        readonly meta: Meta
    }|
    ```

- 校验数组对象

  - ```ts
    export class CreateSystemDto {
    	@IsString()
    	readonly systemName: string
    }
    export class CreateRoleDto {
        @IsArray()
        @ArrayNotEmpty()
        @ValidateNested({ each: true })
        @Type(() => CreateSystemDto)
        readonly systems: CreateSystemDto[]
    }
    ```

  - 

# Nest 基础

## 术语

| 词汇         |          | 作用描述                                                                                    |
| ------------ | -------- | ------------------------------------------------------------------------------------------- |
| class        | 类       | 基本的 ES6/TypeScript 类结构，用于定义控制器、服务、模块等。                                |
| dto          | 检验器   | 对象，定义如何通过网络发送数据的结构。通常与验证装饰器一起使用，确保输入/输出格式符合预期。 |
| guards       | 守卫     | 函数，确定是否应执行特定的路由处理程序。常用于认证和授权。                                  |
| middleware   | 中间件   | 在路由处理程序之前/之后执行的函数，如日志记录、错误处理、请求转换等。                       |
| decorators   | 装饰器   | 函数，为类、方法、属性或参数添加元数据。在 Nest 中，常用于路由、依赖注入等。                |
| strategy     | 策略     | 在 Nest 中的 Passport.js 集成中，定义了特定类型的身份验证策略（例如 JWT、本地、OAuth2）。   |
| constants    | 常量     | 在应用程序中可重复使用的不变值或配置对象。                                                  |
| exceptions   | 特定错误 | 自定义错误，描述应用程序中的特定错误情况。                                                  |
| filters      | 过滤器   | 函数，处理异常并将其转换为用户友好的响应。                                                  |
| interceptors | 拦截器   | 在方法或路由处理程序被调用之前/之后执行的函数。常用于日志记录、转换响应、性能度量等。       |
| pipes        | 管道     | 管道函数，用于在路由处理程序之前验证和转换参数。                                            |

在 Nest.js 中，这些概念帮助您构建结构化、可扩展且维护性强的应用程序。它们为复杂的后端逻辑提供了清晰的结构和组织。

## 创建项目

- 官网地址：https://docs.nestjs.com/cli/overview
- 安装脚手架

```ts
npm install -g @nestjs/cli
yarn global add @nestjs/cli
```

### [创建模块命令](https://docs.nestjs.cn/8/cli?id=cli%e5%91%bd%e4%bb%a4%e5%8f%82%e8%80%83)

nest 的命令是有规律的

```typescript
nest -v // 查看当前nestjs-cli的版本
nest -h // 查看帮助
nest new project-name    //构建项目，server是项目名
nest g app project-name // Monorepo模式
nest g mo -p server + name // 也就是全局建立一个模块，路径在server项目下，名字为name
// nest g [options] -p [projectName] [optionsName]
options: 全称      别名(一般我们使用别名就可以)
┌───────────────┬─────────────┐
│ name          │ alias       │
│ application   │ application │
│ class         │ cl          │
│ configuration │ config      │
│ controller    │ co          │            // 控制器
│ decorator     │ d           │            // 装饰器
│ filter        │ f           │            // 过滤器
│ gateway       │ ga          │            // 网关
│ guard         │ gu          │            // 守卫
│ interceptor   │ in          │            // 拦截器
│ interface     │ interface   │            // 接口
│ middleware    │ mi          │            // 中间层
│ module        │ mo          │            // 模块
│ pipe          │ pi          │            // 管道
│ provider      │ pr          │
│ resolver      │ r           │            // graphql使用相当于上面的控制器
│ service       │ s           │            // 创建服务
│ library       │ lib         │
│ sub-app       │ app         │
└───────────────┴─────────────┘
```

- 快速**创建curd模块**

```ts
nest g resource -p admin models/test --no-spec
```

- 创建**模块**

```ts
nest g mo // 模块名
nest g mo -p 项目名 + 模块名 --no-spec        //子项目中的接口模型
```

- 创建**控制器**

```js
nest g co // 控制器名
nest g co -p 项目名 + 控制器名 --no--spec       // server子项目中的控制器模型,不生成测试文件
```

- 创建**服务层**

```js
nest g s // 服务层名
nest g s -p 项目名 notes --no-spec // 在项目admin下的notes模块创建一个服务层
```

- 创建**中间件**

```js
nest g middleware [中间件路径名: 文件夹名/中间件文件名]
nest g middleware -p 项目名 middleware/init // Monorepo模式
```

- **建立数据库子项目，数据库是通用的**

```js
nest g lib db
```

- **启动接口文件名**

```js
npm run start:dev  //测试使用，会自动生成一个dist文件夹，在本地端口可以访问到
nest start -w admin
nest start -w server
```

### 依赖

#### 更新依赖

- npm

  - ```ts
    // 升级单个依赖:
    npm install [package-name]@latest
    // 升级所有依赖:
    npm outdated // 首先，您可以使用以下命令查看可用的更新
    npm update // 然后，使用以下命令更新所有列出的包：
    //-u 如果您想更新到最新的大版本（可能包括一些不兼容的更改），您可以使用如下的工具
    npx npm-check-updates
    npm install
    ```

- yarn

  - ```ts
    // 升级单个依赖:
    yarn upgrade [package-name]@latest
    // 升级所有依赖:
    yarn upgrade --latest
    ```

- pnpm

  - ```ts
    // 升级单个依赖:
    pnpm add [package-name]@latest
    // 升级所有依赖:
    pnpm outdated // 首先，您可以使用以下命令查看可用的更新
    pnpm update --latest// 然后，要更新所有直接依赖和所有间接依赖，请运行：
    pnpm update // 如果您只想更新直接依赖，请使用：
    pnpm update [package-name] // 要更新特定的依赖，您可以运行：
    ```

#### 生产依赖

常用的依赖项

| 依赖项                   | 描述                                                      |
| ------------------------ | --------------------------------------------------------- |
| @nestjs/axios            | NestJS 的 Axios 模块，用于进行 HTTP 请求。                |
| @nestjs/common           | NestJS 的核心通用模块，提供了很多装饰器、助手函数和工具。 |
| @nestjs/config           | NestJS 配置管理模块，用于处理配置环境。                   |
| @nestjs/core             | NestJS 的核心模块。                                       |
| @nestjs/jwt              | 提供 JWT 认证的工具和装饰器。                             |
| @nestjs/passport         | NestJS 的 Passport.js 集成，用于身份验证。                |
| @nestjs/platform-express | NestJS 的 Express 平台包。                                |
| @nestjs/swagger          | 用于 NestJS 的 Swagger UI 工具集成。                      |
| @typegoose/typegoose     | 用于 Mongoose 的类类型定义。                              |
| bcryptjs                 | 密码哈希库。                                              |
| chalk                    | 用于控制台输出彩色文本。                                  |
| class-transformer        | 提供类转换的工具和装饰器。                                |
| class-validator          | 验证 JavaScript 类的装饰器。                              |
| cookie-parser            | Express 的中间件，用于解析 cookie。                       |
| crypto-js                | 加密库。                                                  |
| dayjs                    | 轻量级的日期处理库。                                      |
| ejs                      | JavaScript 模板引擎。                                     |
| express                  | Node.js 的 web 服务器框架。                               |
| express-session          | Express 的会话管理中间件。                                |
| ioredis                  | 一个强大的 Redis 客户端。                                 |
| lodash                   | JavaScript 工具库。                                       |
| log4js                   | 用于 Node.js 的日志管理工具。                             |
| mongoose                 | MongoDB 的对象建模工具。                                  |
| multer                   | Node.js 中间件，用于处理 multipart/form-data。            |
| nanoid                   | 生成短、非递增、URL 友好的唯一 ID。                       |
| nestjs-mongoose-crud     | 基于 nestjs 和 mongoose 的 CRUD 生成器。                  |
| nestjs-typegoose         | NestJS 的 Typegoose 集成。                                |
| passport                 | Node.js 的身份验证中间件。                                |
| passport-jwt             | Passport 策略，用于 JWT 身份验证。                        |
| passport-local           | Passport 策略，用于用户名和密码身份验证。                 |
| reflect-metadata         | 元数据反射 API 的 polyfill。                              |
| rxjs                     | 响应式编程库。                                            |
| stacktrace-js            | JavaScript 堆栈跟踪库。                                   |
| svg-captcha              | SVG 验证码生成器。                                        |
| swagger-ui-express       | Swagger UI 集成到 Express 应用中。                        |

## 基础

### Monorepo 模式

也就是多个项目在一个文件夹下面，控制同一个数据库

启用 Monorepo 模式可以先建立起标准的项目，然后运行命令更换模式

```shell
nest g app project-name
```

#### 设置静态资源和模板引擎

[设置静态资源官网文档](https://docs.nestjs.cn/8/techniques?id=mvc%e6%a8%a1%e5%9e%8b-%e8%a7%86%e5%9b%be%e6%8e%a7%e5%88%b6%e5%99%a8)

[nest-cli 配置工作空间](https://docs.nestjs.cn/8/cli?id=%e5%b7%a5%e4%bd%9c%e7%a9%ba%e9%97%b4)

```typescript
// nest-cli.json
{
    "projects": {
        "admin": {
			"compilerOptions": {
				"watchAssets": true,
				"assets": [
					{
						"include": "../public", // 根目录是子项目的src
						"outDir": "./dist/apps/admin/public" // 打包后文件位置
					},
					{
						"include": "../views/*.ejs",
						"outDir": "./dist/apps/admin/views"
					}
				]
			}
		},
    }
}

// main.ts
import { NestExpressApplication } from '@nestjs/platform-express'
async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AdminModule)
	// 配置静态资源路径,默认指向dist下的目录，所以要在nest-cli.json中设置路径确保将文件打包进dist
	await app.useStaticAssets(join(__dirname, 'public'), {
		prefix: '/public' // 虚拟路径
	})
	// 配置模板引擎
	app.setBaseViewsDir(join(__dirname, 'views'))
	app.setViewEngine('ejs')
}

// 使用模板引擎， **.controller.ts
	@Get()
	@Render('index') // 模板引擎文件路径
	test() {
		return { name: '张三' }
	}
```

### 设置 Cookies

| opiton | 解释 |
| :-: | --- |
| domain | 域名 |
| expires | 过 期 时 间 （ 秒 ） ， 在 设 置 的 某 个 时 间 点 后 该 Cookie 就会失效，如 expires=Wednesday, 09-Nov-99 23:12:40 GMT |
| maxAge | 最大失效时间（毫秒），设置在多少后失效 |
| secure | 当 secure 值为 true 时，cookie 在 HTTP 中是无效，在 HTTPS 中才有效 path： 表示 cookie 影响到的路，如 path=/。如果路径不能匹配时，浏览器则不发送这个 Cookie |
| httpOnly | 是微软对 COOKIE 做的扩展。如果在 COOKIE 中设置了“httpOnly”属性，则通过程序（JS 脚本、applet 等）将无法读取到 COOKIE 信息，防止 XSS 攻击产生 signed ： 表 示 是 否 签 名 cookie, 设 为 true 会 对 这 个 cookie 签名，这样就需要用 res.signedCookies 而不是 res.cookies 访问它。被篡改的签名 cookie 会被服务器拒绝，并且 cookie 值会重置为它的原始值 |

```typescript
// main.ts
import * as cookieParser from 'cookie-parser'
async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AdminModule)
    app.use(cookieParser()) // 配置cookie中间件，可以添加参数为加密cookie的秘钥
}
// **.controller.ts
@Get('setCookie')
setCookie(@Response() res) {
    res.cookie('key', 'value, {
        maxAge: 1000 * 60 * 10, // 超时时间
        httpOnly: true // 只允许后台设置
    })
    res.send('设置曲奇') // 使用Response就不可以使用return
}

// 获取cookie **.controller.ts,设置完cookie以后，在请求中就会带有cookies
@Get('getCookie')
getCookie(@Req() req) {
	console.log(req.cookies.key)
}

// 删除cookie就将时间设定为当前，或者最大失效时间为0
res.cookie('key', '', { expires: new Date(0)});
res.cookie('key','value',{ maxAge:0, httpOnly:true });

// cookie加密
// 1. 配置中间件的时候需要传参
app.use(cookieParser('123456'))
// 2. 设置 cookie 的时候配置 signed 属性
res.cookie('userinfo','hahaha',{domain:'.ccc.com',maxAge:900000,httpOnly:true,signed:true});
// 3. signedCookies 调用设置的 cookie
console.log(req.signedCookies);
```

### 设置 Session

[session 官方文档](https://docs.nestjs.cn/8/techniques?id=session%e4%bc%9a%e8%af%9d)

| opiton | 解释 |
| :-: | --- |
| secret | 一个 String 类型的字符串，作为服务器端生成 session 的签名。 |
| name | 返回客户端的 key 的名称，默认为 connect.sid,也可以自己设置。 |
| resave | 强制保存 session 即使它并没有变化,。默认为 true。建议设置成 false。don't savesessionifunmodifie |
| saveUninitialized | 强制将未初始化的 session 存储。当新建了一个 session 且未设定属性或值时，它就处于未初始化状态。在设定一个 cookie 前，这对于登陆验证，减轻服务端存储压力，权限控制是有帮助的。（默认：true）。建议手动添加。 |
| cookie | 设置返回到前端 key 的属性，默认值为{ path: ‘/’, httpOnly: true, secure: false, maxAge: null}。 |
| rolling | 在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false） |

session 是另一种记录客户状态的机制，不同的是 Cookie 保存在客户端浏览器中，而 session 保存在服务器上，当浏览器访问服务器并发送第一次请求时，服务器端会创建一个 session 对象，生成一个类似于 key,value 的键值对，然后将 key(cookie)返回到浏览器(客户)端，浏览器下次再访问时，携带 key(cookie)，找到对应的 session(value)。 客户的信息都保存在 session 中

```typescript
// pnpm add express-session  ------ pnpm add @types/express-session -D
import * as expressSession from 'express-session'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AdminModule)
	app.use(
		session({
			secret: '12345',
			name: 'name',
			cookie: { maxAge: 60000 },
			resave: false,
			saveUninitialized: true
		})
	)
}

// express-session 的常用方法:
req.session.destroy((err) => {
	/*销毁 session*/
})
req.session.username = '张三' //设置 session
req.session.username //获取 session
req.session.cookie.maxAge = 0 //重新设置 cookie 的过期时间
```

### 单文件上传和多文件上传

**前端要传输表单数据**

[官方文档](https://docs.nestjs.cn/8/techniques?id=%e6%96%87%e4%bb%b6%e4%b8%8a%e4%bc%a0)

```ts
// __dirname指向的是dist下的目录，要配置好路径的话Monorepo模式太麻烦
// 单文件上传
import { Controller, Get, Render, Post,UseInterceptors,UploadedFile} from '@nestjs/common';
import { FileInterceptor,FilesInterceptor } from '@nestjs/platform-express';

@Post('doAdd')
@UseInterceptors(FileInterceptor('pic')) // pic为上传文件的字段名
addUser(@UploadedFile() file,@Body() body){
    console.log(body);
    console.log(file);
    const writeImage = createWriteStream(join(__dirname, '..','../public/upload', `${file.originalname}`))
    writeImage.write(file.buffer)
    return '上传成功';
}

// 多文件上传
import { Controller, Get, Render, Post,UseInterceptors,UploadedFiles} from '@nestjs/common';
import { FileInterceptor,FilesInterceptor } from '@nestjs/platform-express';
@Post('doAddAll')
@UseInterceptors(FilesInterceptor('pic'))
addAllUser(@UploadedFiles() files,@Body() body){
    for (const file of files) {
    const writeImage =
    createWriteStream(join(__dirname, '../../', 'public/upload', `${body.name}-${Date.now()}-${file.originalname}`));
    writeImage.write(file.buffer)}
    return '上传成功';
}
```

**使用 MulterModule 的方法保存文件**

引入 MulterModule

```js
import { MulterModule } from '@nestjs/platform-express'
// admin.module.ts
@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                // /根目录为项目目录，也就是nest-cli.json同级目录
                destination: `./apps/admin/public/upload/${dayjs().format(
                	'YYYY-MM-DD'
                )}`,
                filename: (req, file, callback) => {
                    // 在此处自定义保存后的文件名称
                    const filename = file.originalname
                    return callback(null, filename)
                }
            )
        })
    ]
})
```

**使用**

```typescript
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { UploadedFiles, UseInterceptors} from '@nestjs/common'

// 单文件上传
@Post('uploads')
@UseInterceptors(FileInterceptor('file'))
Upload(@UploadedFile() file) {
	return file
}

// 多文件上传
@Post({'upload')
@UseInterceptors(FilesInterceptor('file'))
Uploads(@UploadedFiles() files) {
	return files
}}
```

### Nest 中间件

[官方文档](https://docs.nestjs.cn/8/middlewares)

**关于 Nextjs 中间件**

- 通俗的讲：中间件就是匹配路由之前或者匹配路由完成做的一系列的操作。中间件中如果想往下匹配的话，那么需要写 next()

- Nestjs 的中间件实际上等价于 express 中间件。 下面是 Express 官方文档中所述的中间件功能： 中间件函数可以执行以下任务:
  - 执行任何代码。
  - 对请求和响应对象进行更改。
  - 结束请求-响应周期。
  - 调用堆栈中的下一个中间件函数。
  - 如果当前的中间件函数没有结束请求-响应周期, 它必须调用 next() 将控制传递给下一个中间件函数。否则, 请求将被挂起。
  - Nest 中间件可以是一个函数，也可以是一个带有 @Injectable() 装饰器的类

**Nestjs 中创建使用中间件**

```typescript
nest g middleware [中间件路径名: 文件夹名/中间件文件名]
nest g middleware -p 项目名 middleware/init // Monorepo模式

// admin.module.ts
import { InitMiddleware } from './middleware/init.middleware'
import { UserMiddleware } from './middleware/user.middleware'

export class AdminModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(InitMiddleware).forRoutes('*') // 匹配所有路由
        // 具体的查看官方文档
        // forRoutes({ path: 'ab*cd', method: RequestMethod.ALL }) 正则匹配路径,包括所有的方法类型(get,post...)

        consumer // // 匹配多个路由 InitMiddleware中间件先过滤，然后UserMiddleware再过滤
        	.apply(InitMiddleware).forRoutes('*')
            .apply(UserMiddleware).forRoutes('user')

        consumer. // 匹配多个中间件
        	.apply(InitMiddleware, UserMiddleware).forRoutes('*')
	}
}

// 引入全局中间件只能使用函数式中间件
export function logger(req, res, next) {
  console.log(`Request...`);
  next();
}
// main.ts
app.use(logger);
```

### Nest 中的管道

[官方文档](https://docs.nestjs.cn/8/pipes)

[hapi/joi 官方文档](https://joi.dev/api/?v=17.6.0)

管道有两个类型:

- **转换**：管道将输入数据转换为所需的数据输出
- **验证**：对输入数据进行验证，如果验证成功继续传递; 验证失败则抛出异常;

在这两种情况下, 管道 `参数(arguments)` 会由 [控制器(controllers)的路由处理程序](https://docs.nestjs.cn/8/controllers?id=路由参数) 进行处理. Nest 会在调用这个方法之前插入一个管道，管道会先拦截方法的调用参数,进行转换或是验证处理，然后用转换好或是验证好的参数调用原方法。

管道在异常区域内运行。这意味着当抛出异常时，它们由核心异常处理程序和应用于当前上下文的 [异常过滤器](https://docs.nestjs.cn/8/exceptionfilters) 处理。当在 Pipe 中发生异常，controller 不会继续执行任何方法。

```typescript
nest g pi [中间件路径名: 文件夹名/中间件文件名]
nest g pi -p 项目名 pipe/init // Monorepo模式 nest g pi -p admin note-group/pipe

$ pnpm add --save @hapi/joi
$ pnpm add --save-dev @types/hapi__joi
```

```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { ObjectSchema } from '@hapi/joi'

@Injectable()
export class JoiValidationPipe implements PipeTransform {
	constructor(private schema: ObjectSchema) {} // 构造函数接受schema

	transform(value: any, metadata: ArgumentMetadata) {
		const { error } = this.schema.validate(value)
		if (error) {
			throw new BadRequestException('Validation failed')
		}
		return value
	}
}

// 控制器
import { Controller, Get, UsePipes, Query } from '@nestjs/common'
import { JoiValidationPipe } from '../../JoiValidationPipe.pipe'
import * as Joi from '@hapi/joi'

let rootInfo = Joi.object().keys({
	name: Joi.string().required(),
	age: Joi.number().integer().min(6).max(66).required()
})

@Controller('user')
export class UserController {
	@Get('pipe')
	// 插入管道处理数据,rootInfo为传入schema校验规则，
	@UsePipes(new JoiValidationPipe(rootInfo))
	pipe(@Query() info) {
		console.log(info)
		return `this is Pipe`
	}
}
```

**转换管道**

验证不是管道唯一的用处。在本章的开始部分，我已经提到管道也可以将输入数据**转换**为所需的输出。这是可以的，因为从 `transform` 函数返回的值完全覆盖了参数先前的值。在什么时候使用？有时从客户端传来的数据需要经过一些修改（例如字符串转化为整数），然后处理函数才能正确的处理。还有种情况，比如有些数据具有默认值，用户不必传递带默认值参数，一旦用户不传就使用默认值。**转换管道**被插入在客户端请求和请求处理程序之间用来处理客户端请求。

> parse-int.pipe.ts

```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
	transform(value: string, metadata: ArgumentMetadata): number {
		const val = parseInt(value, 10)
		if (isNaN(val)) {
			throw new BadRequestException('Validation failed')
		}
		return val
	}
}
```

### Nest 登陆策略

[官方文档](https://docs.nestjs.cn/8/security?id=%e8%ae%a4%e8%af%81%ef%bc%88authentication%ef%bc%89)

`Passport`具有丰富的策略生态系统(包括 git，微信登陆)，可实施各种身份验证机制。 尽管概念上很简单，但是您可以选择的 `Passport` 策略集非常多，并且有很多种类。 `Passport` 将这些不同的步骤抽象为标准模式，而 `@nestjs/passport` 模块将该模式包装并标准化为熟悉的 Nest 构造。

**依赖**

```js
pnpm add bcryptjs // bcryptjs加密
pnpm add @nestjs/jwt passport-jwt @nestjs/passport passport passport-local // 下载passport和nest支持
pnpm add @types/bcryptjs @types/passport @types/passport-jwt @types/passport-local @types/bcryptjs -D // ts语言支持
```

**本地策略: 账户密码存储在数据库内，利用 token 登陆**

```js
// user.model.ts
@prop({
    required: true,
    unique: true
})
userName: string

@prop({
    required: true,
    select: false, // 默认查询不返回这个字段
    // 预定义模式修饰符  Getters与 Setters修饰符
    get: (value) => {
        return value
    },
    set: (value) => {
        return value ? hashSync(value) : value // 数据库存密码时进行加密
    }
})
password: string

// auth.model.ts
@Module({
	imports: [PassportModule], // 引入passport模块
	controllers: [AuthController],
	providers: [AdminService, LocalStrategy] // 注入策略和服务
})

// local.strategy, 新建文件
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	// 本地策略,local为策略名,在auth.model引入以后，然后在控制器里面指明使用local策略就可以了
	constructor(private adminServer: AdminService) {
		super({
			usernameField: 'username',
			passwordField: 'password'
		} as IStrategyOptions)
	}

	async validata(username: string, password: string) {
		const user = this.adminServer
			.findOne('user', { username })
			.select('+password') // 指明要返回password字段
		if (!user) {
			throw new BadRequestException('用户不存在')
		}
		if (!compareSync(password, user.password)) {
			throw new BadRequestException('密码不正确')
		}
	}
}

// auth.controller
@Controller('admin/auth')
export class AuthController {
	constructor(private adminServer: AdminService) {}

	@Post()
	@ApiOperation({ summary: '注册' })
	async register(@Body() body) {
		const { username, password } = body
		const user = await this.adminServer.create('user', {
			username,
			password
		})
		return user
	}

	@Post()
	@ApiOperation({ summary: '登陆' })
	@UseGuards(AuthGuard('local')) // nest守卫使用passport，passport指定使用说明策略
	async login(@Body() body) {}
}
```

**jwt 策略: token**

```js
// common.module 全局引用jwt
import { JwtModule } from '@nestjs/jwt'

@Module({
	imports: [
		ConfigModule.forRoot({
			/// 环境变量
			isGlobal: true
		}),
		// jwt前后端都会用到，注册为全局模块
		JwtModule.registerAsync({
			useFactory() {
				return {
					secret: process.env.SECRET
				}
			}
		}),
		DbModule
	],
	providers: [CommonService],
	exports: [CommonService, JwtModule] // 暴露出JwtModule
})

// jwt.strategy.ts
// 记得在auth.module中引入策略
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		@InjectModel(User) private userModel: ReturnModelType<typeof User>
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从请求头中取出token
			secretOrKey: process.env.SECRET // 环境变量中的SECRET解析token
		} as StrategyOptions)
	}

	async validate(id) {
		// 从数据库查找解析出来的用户id
		return await this.userModel.findById(id)
	}
}

// auth.controller.ts
@Get('user')
@UseGuards(AuthGuard('jwt'))
async user(@CurrentUser() user: UserDocument) {
    return user
}
```

### 验证码

生成图形验证码，并且给图形验证码一个唯一 id 存入 redis

```ts
/**
* 创建验证码并缓存加入redis缓存
* @param captcha 验证码长宽
* @returns svg & id obj
*/
async createImageCaptcha(captcha: ImageCaptchaDto): Promise<ImageCaptcha> {
    const svg = svgCaptcha.create({
        size: 4,
        color: true,
        noise: 4,
        width: isEmpty(captcha.width) ? 100 : captcha.width,
        height: isEmpty(captcha.height) ? 50 : captcha.height,
        charPreset: '1234567890abcdefg'
	})
    const result = {
        validCode: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString(
            'base64'
        )}`,
        validId: this.util.generateUUID() // this.utils.generateUUID()
    }
    // 5分钟过期时间
    await this.redisService
        .getRedis()
        .set(`server:captcha:code:${result.validId}`, svg.text, 'EX', 60 * 5)
    return result
}
```

从 redis 取出验证码进行对比

```ts
/**
* 校验验证码
*/
async checkImgCaptcha(validId: string, validCode: string): Promise<void> {
    const result = await this.redisService
    .getRedis()
        .get(`server:captcha:code:${validId}`)
    if (isEmpty(result) || validCode.toLowerCase() !== result.toLowerCase()) {
        throw new ApiException(10002)
    }
    // 校验成功后移除验证码
    await this.redisService.getRedis().del(`server:captcha:code:${validId}`)
}
```

### SetMetadata 帮助函数

在 NestJS 中，`SetMetadata` 是一个帮助函数，用于为路由处理程序或控制器设置自定义的元数据。这些元数据可以在稍后使用 NestJS 的`Reflector`类进行检索，通常在守卫（Guards）或拦截器（Interceptors）中进行检索。

一般来说，`SetMetadata`是创建自定义装饰器时的常用工具，这些装饰器能够在请求的生命周期中为你提供更多的上下文。

举个简单的例子：

假设你希望在某些路由上限制角色访问。首先，你可以使用`SetMetadata`创建一个`@Roles`装饰器：

```ts
typescriptCopy codeimport { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

然后，你可以在路由处理程序或控制器上使用新的`@Roles`装饰器：

```ts
typescriptCopy code@Post()
@Roles('admin')
create() {
  // ...
}
```

接下来，你可以创建一个守卫，该守卫使用`Reflector`来获取`roles`元数据，并基于当前用户的角色进行检查：

```ts
typescriptCopy codeimport { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    // 在此进行角色检查，例如检查请求中的用户是否具有所需的角色
    // 如果他们有，返回true；如果没有，返回false
  }
}
```

总之，`SetMetadata` 允许你为 NestJS 的路由处理程序或控制器设置自定义元数据，然后你可以在守卫、拦截器或其他地方使用这些元数据来做出决策或提供更多的上下文。
