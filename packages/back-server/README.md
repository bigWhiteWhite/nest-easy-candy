## Docker

**参考博客**

1. [使用 Docker 实现前端应用的标准化构建、部署和运行 - 掘金 (juejin.cn)](https://juejin.cn/post/7269668219488354361)
2. [前言 - Docker — 从入门到实践 (gitbook.io)](https://yeasy.gitbook.io/docker_practice/)
3. [Docker化一个前端基础开发环境：简洁高效的选择 - 掘金 (juejin.cn)](https://juejin.cn/post/7264403008163201081?searchId=2023081817551184D71DDBF183A7BC83DA)

**常用命令**

- docker inspect 查看信息(环境变量)
- docker-compose --env-file 环境变量文件 up

示例

```dockerfile
# FROM 表示设置要制作的镜像基于哪个镜像，FROM指令必须是整个Dockerfile的第一个指令，如果指定的镜像不存在默认会自动从Docker Hub上下载。
# 指定我们的基础镜像是node，latest表示版本是最新, 如果要求空间极致，可以选择lts-alpine
# 使用 as 来为某一阶段命名
FROM node:16 as builder

# WORKDIR指令用于设置Dockerfile中的RUN、CMD和ENTRYPOINT指令执行命令的工作目录(默认为/目录)，该指令在Dockerfile文件中可以出现多次，
# 如果使用相对路径则为相对于WORKDIR上一次的值，
# 例如WORKDIR /data，WORKDIR logs，RUN pwd最终输出的当前目录是/data/logs。
# 设置了 Docker 容器中的工作目录为 /nest-easy-candy。
WORKDIR /nest-easy-candy

# set timezone - 设置容器的时区
RUN ln -sf /usr/share/zoneinfo/Asia/GuangZhou /etc/localtime
RUN echo 'Asia/GuangZhou' > /etc/timezone

# mirror acceleration
# RUN npm config set registry https://registry.npmmirror.com
# RUN pnpm config set registry https://registry.npmmirror.com
# RUN npm config rm proxy && npm config rm https-proxy

# 将当前目录下的所有文件复制到容器的工作目录中，然后运行 yarn install 安装应用程序的依赖。
# 第一个'./'代表源路径,第二个'./'代表源路径目标路径 - 这个命令将当前构建上下文中的所有文件复制到容器的工作目录中
# 使用相对路径可以成功，是因为前面指定了工作目录 - WORKDIR /nest-easy-candy
COPY ./ ./
# Node.js 默认提供 npm 包管理器，Corepack 为您提供 Yarn 和 pnpm，而无需安装它们。
RUN corepack enable
# install & build
RUN pnpm install \
  && pnpm build \
  # clean dev dep - 清理开发依赖,在生产环境中安装依赖，并清理掉开发依赖。
  && pnpm install --production \
  && pnpm cache clean
# 全局安装 PM2 - 在容器中全局安装 PM2 进程管理工具。
RUN pnpm global add pm2

# 暴露端口 - httpserver set port
EXPOSE 7001
# 暴露端口 - websokcet set port
EXPOSE 7002

# 容器启动时执行的命令，类似npm run start
# CMD ["pnpm", "start:prod"]
CMD ["pm2-runtime", "ecosystem.config.js"]
```

**docker-compose 和 Dockerfile的关系**

- **Dockerfile:**

  - `Dockerfile` 是一个文本文件，其中包含一系列的指令和配置，用于定义如何构建一个 Docker 镜像。

  - 它包括了从哪个基础镜像开始构建、如何设置工作目录、如何复制文件到容器内、如何运行命令等步骤。

  - 通过执行 `docker build` 命令，可以根据 `Dockerfile` 构建一个可执行的 Docker 镜像。
  - Dockerfile也可以被docker-compose中的服务使用

- **docker-compose:**

  - `docker-compose` 是一个工具，允许你通过一个单独的 YAML 文件来定义和管理多个 Docker 容器的配置。
  - 它允许你定义应用程序的服务、网络、卷等信息，并通过执行 `docker-compose` 命令来启动、停止、构建整个应用程序的多个容器。
  - `docker-compose.yml` 文件中描述了应用程序的整个架构，包括每个服务的镜像、端口映射、环境变量等配置。

在项目中同时使用这两个概念。`Dockerfile` 用于定义单个容器的构建规则，而 `docker-compose` 用于管理整个应用程序由多个容器组成的场景。在使用 `docker-compose up` 命令时，它会查找当前目录下的 `docker-compose.yml` 文件，并基于其中的配置启动相关的服务。

## WSL2.0使用任意Linux发行版

**参考博客**

1. [如何在WSL上导入任何Linux发行版_wsl 导入-CSDN博客](https://blog.csdn.net/B11050729/article/details/132580410)
2. [WSL2-win搭建Ubuntu子系统 - luoxian - 博客园 (cnblogs.com)](https://www.cnblogs.com/luoxian1011/p/15861471.html)
3. [如何在WSL2.0里面使用任意Linux发行版 | DevopsApple (uscwifi.xyz)](https://xyz.uscwifi.xyz/post/OlmHiO2uc/)

网络问题无法在微软商店下载linux发行版，也无法指向wsl --update | wsl --install 等命令下载发行版，只能从外部导入

- [下载发行版地址1](https://dl-cdn.alpinelinux.org/alpine/v3.9/releases/), [下载发行版地址2](https://alpinelinux.org/downloads/)
- [官方文档导入教程](https://learn.microsoft.com/zh-cn/windows/wsl/use-custom-distro)

- ```bash
  ## Distro-发行版名称 InstallLocation-下载路径 FileName-文件名
  wsl --import <Distro> <InstallLocation> <FileName>
  
  ## 示例
  wsl --import Alpine D:\alpine-netboot-3.9.0-x86_64 .\alpine-netboot-3.9.0-x86_64.tar.gz
  
  ##列出已安装的 Linux 发行版
  wsl -l -v
  ## 启动指定版本
  wsl -d Alpine3.9.0
	##检查 WSL 状态
  wsl --status
	##进入默认的发行版本，退出执行 exit
  wsl
	##终止指定的发行版或阻止其运行,例：wsl --terminate Ubuntu-18.04
  wsl --terminate
	##重启wsl服务
  wsl --shutdown
  ##设置默认 Linux 发行版
	wsl --set-default
  ##将WSL版本设置为1或2
	wsl --set-version
  ##设置默认 WSL 版本
	wsl --set-default-version
  ##运行特定的Linux发行版
	wsl --distribution --user
  ##以特定用户的身份运行
	wsl -u , wsl --user
  ##更改发行版的默认用户
	wsl config --default-user
  ##注销或卸载 Linux 发行版
	wsl --unregister
  ```

## Typescript

### extends 和 implements 的区别

总结：

- 都可以实现 **类与类** 之间的关联
- 对于抽象类中的抽象方法都必须要实现

下面罗列它俩的不同点

- extends 可以实现 **接口与接口**，**接口与类** 的继承，而 implements 不能实现接口与接口，接口与类的实现
- implements 可以实现 **类实现接口**，而 extends 不能实现类继承接口
- 使用 implements 时，**需要定义或实现所有属性和方法，而 extends 只需要重新定义或者实现方法即可**，对于属性来说，是可以直接继承，无需单独定义

**extends**翻译过来就是 **继承，扩展** 的意思

- **类只能继承类**

- 从父类或者接口继承所有的属性和方法，不可以重写属性，但可以重写方法

- 接口可以接口，也可以继承类(定义类时，其实是同时定义了一个类和类对应的类型接口，因此才可以实现接口继承类，**本质上是接口继承接口**)

- 非抽象类继承抽象类，非抽象类需要实现抽象类中的抽象方法，但对于属性，非抽象类可以直接继承，不用单独定义

  - 抽象类和抽象方法都是使用 **abstract** 关键字来标识，抽象方法定义在抽象类中，并且必须被实现。无法通过 **new** 创建抽象类的实例

  - ```ts
    abstract class AbstractParent {
    	abstract abstractFunc(): string
    }
    
    class child extends AbstractParent {
    	abstractFunc(): string {
    		return ''
    	}
    }
    ```

**implements**翻译过来是 **实现** 的意思

- **implements 本质上是用来实现接口(给类加类型定义)的**

- 一个新的类，从父类或者接口实现所有的属性和方法，同时可以重写属性和方法，包含一些新的功能

- **类实现类**

  - **非抽象类实现非抽象类**：实现类里面所有的属性和方法都要在目标类里重新定义和实现
  - **非抽象类实现抽象类**：抽象类里的所有属性和方法都需要在非抽象类里定义和实现
  - **抽象类实现抽象类**：实现类里面所有的属性都要在目标类里重新定义，所有方法需要被实现或者使用 **abstract** 定义为抽象方法
  - **抽象类实现非抽象类**：非抽象类里面所有的属性都要在抽象类里重新定义，所有方法需要被实现或者使用 **abstract** 定义为抽象方法

- **类实现接口**

  - **抽象类实现接口**：接口所有属性都要重新定义，接口所有方法需要实现或者使用 **abstract** 定义为抽象方法
  - **非抽象类实现接口**：接口所有属性都要重新定义，接口所有方法需要实现

- **接口实现接口**：接口不能实现接口

- **接口实现类**：接口不能实现类

  - ```ts
    abstract class AbstractParent {
    	name: string
    	abstract abstractFunc(): string
    }
    class parent {
    	name: string
    	func(): string {
    		return ''
    	}
    }
    interface IExample {
    	name: string
    	age: number
    	IExampleFunc(): string
    }
    
    // 非抽象类实现抽象类
    class child1 implements AbstractParent {
    	name: string
    	abstractFunc(): string {
    		return ''
    	}
    }
    // 非抽象类实现非抽象类
    class child2 implements parent {
    	name: string
    	func(): string {
    		return ''
    	}
    }
    // 抽象类实现非抽象类
    abstract class child3 implements parent {
    	name: string
    	abstract func(): string
    	func3Real(): string {
    		return ''
    	}
    }
    // 抽象类实现抽象类
    abstract class child4 implements AbstractParent {
    	name: string
    	abstract abstractFunc(): string
    	func4Real(): string {
    		return ''
    	}
    }
    // 抽象类实现接口
    abstract class child5 implements IExample {
    	name: string
    	age: number
    	abstract IExampleFunc(): string
    	func5Real(): string {
    		return ''
    	}
    }
    // 非抽象类实现接口
    class child6 implements IExample {
    	name: string
    	age: number
    	IExampleFunc(): string {
    		return ''
    	}
    	func6Real(): string {
    		return ''
    	}
    }
    ```

## 模块导入

### system.module

导入以后也相当于注册了这些模块的服务，可以引入上一级，但是不代表这些局部模块之间就可以互相引用了，这里只是一个聚合出口，可以让 admin.module 同时注册

```ts
import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { AdminSystemModule } from './admin-system/admin-system.module'
import { MenuModule } from './menu/menu.module'
import { RoleModule } from './role/role.module'
// 在这里providers的服务只能在system文件夹里面使用
@Module({
	imports: [UserModule, AdminSystemModule, MenuModule, RoleModule]
})
export class SystemModule {}
```

### 模块互相引用

```ts
// 模块互相引用也会导致程序中断，使用
@Inject(forwardRef(() => UserService))
private userService: UserService
```

### 局部模块

局部模块的服务如果想要被其他模块引入使用，需要在模块中使用**exports 属性**明确导出服务。同时引入其他模块的局部模块也需要明确在**providers**中注入其他模块的服务

```ts
import { Module } from '@nestjs/common'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'
import { AdminSystemService } from '../admin-system/admin-system.service'
import { MenuService } from '../menu/menu.service'
@Module({
	controllers: [RoleController],
	providers: [RoleService, AdminSystemService, MenuService],
	exports: [RoleService]
})
export class RoleModule {}
```

### 全局模块

全局模块需要明确使用**@Global()装饰器**，使用 **@Global()** 装饰器标记的模块将被注册为全局模块，这意味着其中定义的**提供者（服务）- exports&providers 将在整个 Nest.js 应用程序中可用**，而不仅仅在包含该模块的模块中可用。然而，**模块导入的其他模块本身不会被声明为全局模块。它们的提供者仅在它们所属的模块范围内可用**。

当一个模块被标记为全局模块时，它的提供者将在整个应用程序中成为全局提供者。这可以方便地共享一些通用的服务或状态，而不需要在每个模块中重新定义它们。但是，导入的其他模块仍然是普通模块，它们的提供者仅在它们自己的模块范围内可用。

如果你想要在多个模块之间共享某些提供者，而不仅仅在一个全局模块中共享，你可以考虑将这些提供者定义为全局模块，然后在需要它们的其他模块中导入这个全局模块。这样，你可以在多个模块中使用这些全局提供者

```ts
import { HttpModule } from '@nestjs/axios'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisModule } from './redis/redis.module'
import { RedisService } from './redis/redis.service'
import { UtilService } from './tools/util.service'
import { WSModule } from './websocket/ws.module'

const providers = [UtilService, RedisService]
/**
 * Global --- 全局共享模块
 */
@Global()
@Module({
	imports: [
		HttpModule.register({
			timeout: 5000,
			maxRedirects: 5
		}),
		RedisModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				host: configService.get<string>('redis.host'),
				port: configService.get<number>('redis.port'),
				password: configService.get<string>('redis.password'),
				db: configService.get<number>('redis.db')
			}),
			inject: [ConfigService]
		}),
		// 不会声明为全局模块
		WSModule
	],
	providers,
	exports: providers
})
export class SharedModule {}
```

## 比较函数

### 中间件实现

```ts
// compare-data.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class CompareDataMiddleware implements NestMiddleware {
	constructor(private readonly mongodbData: any) {}

	use(req: Request, res: Response, next: NextFunction) {
		try {
			// 比较传入的数据和传递进来的 MongoDB 数据是否相同
			const dataMatches = this.compareData(req.body.data, this.mongodbData)

			if (!dataMatches) {
				// 如果数据不匹配，返回错误响应
				return res.status(400).json({ message: 'Data does not match.' })
			}

			// 如果数据匹配，继续执行下一个中间件或路由处理
			next()
		} catch (error) {
			// 处理错误，例如数据比较错误
			console.error('Error comparing data:', error)
			res.status(500).json({ message: 'Internal server error' })
		}
	}

	private compareData(incomingData: any, mongodbData: any): boolean {
		// 在这里实现数据比较逻辑
		// 你需要根据你的数据结构和业务逻辑来定义比较规则
		// 这里只是一个简单的示例，你可能需要根据实际情况进行修改
		return JSON.stringify(incomingData) === JSON.stringify(mongodbData)
	}
}
```

```ts
// role.controller.ts

import { Controller, Patch, Body, Param, UseMiddleware } from '@nestjs/common'
import { CompareDataMiddleware } from './path-to-your-middleware/compare-data.middleware' // 替换为实际的中间件路径

@Controller('role')
export class RoleController {
	@Patch(':id')
	@UseMiddleware(new CompareDataMiddleware(/* MongoDB 数据 */))
	updateRole(@Param('id') id: string, @Body() data: any) {
		// 在这里处理更新角色的逻辑
		// 注意：CompareDataMiddleware 将在这里自动比较数据

		return { message: 'Role updated successfully.' }
	}
}
```

### 管道实现

在管道中不引入模块路径，而是在外部查询数据后传递，可以通过修改 `CompareDataPipe` 的构造函数，使其接受 MongoDB 数据作为参数。以下是相应的修改：

```ts
// compare-data.pipe.ts
import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common'

@Injectable()
export class CompareDataPipe implements PipeTransform {
	constructor(private readonly mongodbData: any) {}

	async transform(value: any, metadata: ArgumentMetadata) {
		if (metadata.type === 'body' && metadata.metatype === Object) {
			try {
				// 比较传入的数据和传递进来的 MongoDB 数据是否相同
				const dataMatches = this.compareData(value.data, this.mongodbData)

				if (!dataMatches) {
					// 如果数据不匹配，抛出 BadRequestException
					throw new BadRequestException('Data does not match.')
				}

				// 如果数据匹配，返回原始数据
				return value
			} catch (error) {
				// 处理错误，例如数据比较错误
				console.error('Error comparing data:', error)
				throw new BadRequestException('Internal server error')
			}
		}

		// 如果不是预期的元数据类型，返回原始值
		return value
	}

	private compareData(incomingData: any, mongodbData: any): boolean {
		// 在这里实现数据比较逻辑
		// 你需要根据你的数据结构和业务逻辑来定义比较规则
		// 这里只是一个简单的示例，你可能需要根据实际情况进行修改
		return JSON.stringify(incomingData) === JSON.stringify(mongodbData)
	}
}
```

在使用管道时，你需要在外部查询 MongoDB 数据，并将其传递给管道。以下是示例：

```ts
// role.controller.ts

import { Controller, Patch, Body, Param } from '@nestjs/common'
import { CompareDataPipe } from './path-to-your-pipe/compare-data.pipe' // 替换为实际的管道路径

@Controller('role')
export class RoleController {
	@Patch(':id')
	updateRole(@Param('id') id: string, @Body(new CompareDataPipe(/* MongoDB 数据 */)) data: any) {
		// 在这里处理更新角色的逻辑
		// 注意：CompareDataPipe 将在这里自动比较数据

		return { message: 'Role updated successfully.' }
	}
}
```

在这个示例中，`CompareDataPipe` 的构造函数接受 MongoDB 数据作为参数。在 `updateRole` 方法中，通过使用 `@Body(new CompareDataPipe(/* MongoDB 数据 */))` 将 MongoDB 数据传递给管道。这样，你就可以在管道中比较传入的数据和 MongoDB 数据，而无需在管道内部引入 MongoDB 模型。

## WebSocket

WebSocket 是一种网络通信协议，它允许在客户端和服务器之间建立持久、全双工的通信通道。WebSocket 的作用是**提供实时、低延迟的双向通信**，使服务器能够主动向客户端推送数据，而不需要客户端不断地发起请求。

### WebSocket 的作用：

1. **实时通信**：WebSocket 主要用于实现实时通信，例如在线聊天、实时游戏、实时协作应用等。它允许服务器主动向客户端推送数据，而不需要客户端发起请求。

2. **低延迟**：WebSocket 的设计目标之一是降低通信延迟。它使用持久连接，避免了不必要的连接和断开，从而减少了通信的延迟。

3. **双向通信**：WebSocket 支持全双工通信，客户端和服务器可以同时发送和接收数据。这使得实时互动变得更加容易。

4. **减少资源消耗**：相比于传统的轮询技术（如 HTTP 长轮询），WebSocket 可以减少服务器和客户端的资源消耗，因为不需要频繁的建立和关闭连接。

### WebSocket 的历史原因：

WebSocket 的出现是为了解决传统的 HTTP 请求-响应模型无法满足实时通信需求的问题。在传统的 HTTP 中，客户端必须发起请求，服务器才能响应。这意味着服务器不能主动向客户端发送数据，而必须等待客户端的请求。这对于需要实时更新的应用（如在线聊天）来说是不理想的，因为它会导致高延迟和不必要的资源消耗。

WebSocket 的出现填补了这一缺陷，它提供了一种更高效、实时的通信方式，可以在单个连接上实现双向通信。

### WebSocket 与 HTTP 长轮询的比较：

- **WebSocket**：

  - 全双工通信，客户端和服务器可以同时发送和接收数据。
  - 延迟低，因为连接保持打开状态，减少了连接和断开的开销。
  - 支持服务器主动推送数据。
  - 适用于实时通信和实时更新的应用。

- **HTTP 长轮询**：
  - 半双工通信，客户端和服务器之间的通信是单向的，需要不断地建立新连接。
  - 延迟较高，因为每次请求都需要建立连接。
  - 客户端发起请求，服务器响应，不能实现服务器主动推送数据。
  - 可能需要多次轮询才能获取最新数据，不适用于实时通信。

总之，WebSocket 提供了更高效、实时的通信方式，适用于需要实时通信的应用。HTTP 长轮询是早期实现实时通信的一种方法，但由于其高延迟和资源消耗，已经逐渐被 WebSocket 所取代。 WebSocket 的出现使得实时互动应用更加容易实现，为 Web 应用的实时性提供了强大支持。
