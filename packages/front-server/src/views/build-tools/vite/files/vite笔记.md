# vite 简介

## 什么是 vite

> Vite 是一种新型的前端构建工具，它能显著改善前端开发体验。

- 基于 [esbuild](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%3A%2F%2Fmp.weixin.qq.com%2Fs%2FBCL1Cm64mps4cZe_V26Wtw) 实现的极速开发体验
- 多框架支持
- 兼容 Rollup 的插件机制与 API
- SSR 支持
- 旧浏览器支持

**产生 vite 工具原因：**

开始构建越来越大型的应用时，需要处理的 JavaScript 代码量也呈指数级增长。导致[启动慢](https://link.juejin.cn?target=https%3A%2F%2Fustcse.wolai.com%2F3MMrHCzxPLdfhHJwsVXJET%23upNK2vFAVGBiQWF7fyRnG8)[、](https://link.juejin.cn?target=https%3A%2F%2Fustcse.wolai.com%2F3MMrHCzxPLdfhHJwsVXJET%23upNK2vFAVGBiQWF7fyRnG8)[热更新慢](https://link.juejin.cn?target=https%3A%2F%2Fustcse.wolai.com%2F3MMrHCzxPLdfhHJwsVXJET%23upNK2vFAVGBiQWF7fyRnG8)

**产生 vite 的前提：**

浏览器开始原生支持 ES 模块，越来越多 JavaScript 工具使用编译型语言编写（esbuild 使用 go 编写）

**解决启动慢：**

依赖(不会改变的 js)：使用 [esbuild](https://link.juejin.cn?target=https%3A%2F%2Fesbuild.github.io%2F) [预构建依赖](https://link.juejin.cn?target=https%3A%2F%2Fcn.vitejs.dev%2Fguide%2Fdep-pre-bundling.html)

源码(需要转换的 js)：以 [原生 ESM](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FGuide%2FModules) 方式提供源码(由游览器接管打包工作)，按需编译

**解决热更新慢：**

基于原生 ESM ：开发环境启动时只需要启动两个 Server，一个用于页面加载，一个用于 HMR 的 Websocket。当浏览器发出原生的 ESM 请求，Server 收到请求只需要编译当前文件后返回给浏览器，不需要管理依赖。

利用游览器缓存：源码模块的请求会根据 `304 Not Modified` 进行协商缓存，而依赖模块请求则会通过 `Cache-Control: max-age=31536000,immutable` 进行强缓存，因此一旦被缓存它们将不需要再次请求。

**为什么生产环境仍需打包**

尽管原生 ESM 现在得到了广泛支持，但由于嵌套导入会导致额外的网络往返，在生产环境中发布未打包的 ESM 仍然效率低下（即使使用 HTTP/2）。为了在生产环境中获得最佳的加载性能，最好还是将代码进行 tree-shaking、懒加载和 chunk 分割（以获得更好的缓存）。

要确保开发服务器和生产环境构建之间的最优输出和行为一致并不容易。所以 Vite 附带了一套 [构建优化](https://link.juejin.cn?target=https%3A%2F%2Fcn.vitejs.dev%2Fguide%2Ffeatures.html%23build-optimizations) 的 [构建命令](https://link.juejin.cn?target=https%3A%2F%2Fcn.vitejs.dev%2Fguide%2Fbuild.html)，开箱即用。

**为何不用 ESBuild 打包**

虽然 `esbuild` 快得惊人，并且已经是一个在构建库方面比较出色的工具，但一些针对构建 _应用_ 的重要功能仍然还在持续开发中 —— 特别是代码分割和 CSS 处理方面。就目前来说，Rollup 在应用打包方面更加成熟和灵活。尽管如此，当未来这些功能稳定后，我们也不排除使用 `esbuild` 作为生产构建器的可能。

总的来说。vite 有两大特征：

1. 开发环境：使用 esbuild 预构建 npm 依赖包 +基于浏览器原生 ESM 的构建工具+按需编译
2. 生产环境：利用 Rollup 来构建代码，提供指令用来优化构建过程

### **Vite**

- 基于 ESM 运行时打包
- 借鉴了 Snowpack
- 生产环境使用 Rollup，集成度更高，相比 Snowpack 支持多页面、库模式、动态导入自动 polyfill 等

## 为什么使用 vite

### 快

构建工具的差异、代码量、项目复杂度等因素会导致两个问题：启动慢、HMR 慢

vite 是如何解决的呢？

| Webpack                                | Vite                                                                                                 |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 先打包生成 bundle，再启动开发服务器    | 先启动开发服务器，利用新一代浏览器的 ESM 能力，无需打包，直接请求所需模块并实时编译                  |
| HMR 时需要把改动模块及相关依赖全部编译 | HMR 时只需让浏览器重新请求该模块，同时利用浏览器的缓存（源码模块协商缓存，依赖模块强缓存）来优化请求 |
| 内存高效利用                           | -                                                                                                    |

启动慢方面：

- Vite 开发环境冷启动无需打包，无需分析模块之间的依赖，同时也无需在启动开发服务器前进行编译，启动时还会使用 esbuild 来进行预构建。
- Webpack 启动后会做一堆事情，经历一条很长的编译打包链条，从入口开始需要逐步经历语法解析、依赖收集、代码转译、打包合并、代码优化，最终将高版本的、离散的源码编译打包成低版本、高兼容性的产物代码，这可满满都是 CPU、IO 操作啊，在 Node 运行时下性能必然是有问题。

HMR 慢方面：

- Vite 利用了 ESM 和浏览器缓存技术，更新速度与项目复杂度无关。可以看到，如 Snowpack、Vite 这类面相非打包的构建工具，在开发环境启动时只需要启动两个 Server，一个用于页面加载，一个用于 HMR 的 Websocket。当浏览器发出原生的 ESM 请求，Server 收到请求只需要编译当前文件后返回给浏览器，不需要管理依赖。
- 而即使只有很小的改动，Webpack 依然需要构建完整的模块依赖图，并根据依赖图来进行转换。

这么一对比，Webpack 是啥都做了，浏览器只要运行编译好的低版本(es5)代码就行；

而 Vite 只处理问题的一部分，剩下的事情交由浏览器自行处理，那速度必然贼 TM 快。

**总结 Vite 开发环境下原理**：

Vite 运行 Dev 命令后只做了两件事情，一是启动了一个用于承载资源服务的 service；二是使用 [esbuild](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%3A%2F%2Fmp.weixin.qq.com%2Fs%2FBCL1Cm64mps4cZe_V26Wtw) 预构建 npm 依赖包。之后就一直躺着，直到浏览器以 http 方式发来 ESM 规范的模块请求时，Vite 才开始“**「按需编译」**”被请求的模块。

这里 Vite 预设的前提是：现代浏览器大多数已经原生支持 ESM 规范，构建工具 —— 特别是开发环境下已经没有太大必要为了低版本兼容把大量的时间花在编译打包上了！ ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d77d51c682a4746b1d8e871420f6fb4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 简单

执行以下命令行就可以得到了一个预设好的开发环境，可以开始愉快地写 demo 了，

Vite 开箱即用，包括 css 预处理器、html 预处理器、hash 命名、异步加载、分包、压缩、HMR 等

```sql
sql
复制代码yarn create @vitejs/app my-vue-app --template vue
```

Vite 的表现很容易让人联想到 vue-cli，不过两者区别还是挺大的：

- vue-cli 底层依赖 Webpack，实际的构建工作通常**由各种 Webpack loader、plugin 实现**，比如 less => css 由 less-loader 实现；图片加载由 img-loader 实现等。这套设计**很灵活**，你可以在 Webpack 体系下做任何你能想到的变更，只需要学习一点点 Webpack 的知识，包括百来个配置项、成千上万的插件、若干虚无缥缈的构建概念等（**学习成本高**）。
- Vite 显得特别简洁，它只是暴露了**极少数的配置项与 plugin 接口**，设计上就没打算让你做太多自定义操作。。。这是因为 Vite 从一开始就没打算做成另一个 Webpack，而是做成一套“能够显著提升前端开发体验的前端构建工具”，重在 **「开发体验」** 啊同学们，Vite 可谓是用心良苦，想尽办法**降低学习入门成本**，它就不希望你为了使用工具又学一大堆复杂、缥缈的概念，希望这些事情都在框架层面屏蔽了 —— 虽然代价是**丧失灵活性**。

简单说吧，vite 使用复杂度介于 Parcel 和 Webpack 的中间，只是暴露了极少数的配置项和 plugin 接口，既不会像 Parcel 一样配置不灵活，又不会像 Webpack 一样需要了解庞大的 loader、plugin 生态，灵活适中、复杂度适中。适合前端新手。

### 生态

除了极致的运行性能与简易的使用方法外，Vite 对已有生态的兼容性也不容忽略，主要体现在两个点：

- 与 Vue 解耦，兼容支持 React、Svelte、Preact、Vanilla 等，这意味着 Vite 可以被应用在大多数现代技术栈中
- 与 Rollup 极其接近的插件接口，这意味着可以复用 Rollup 生态中大部分已经被反复锤炼的工具

### 其他

除了启动阶段跳过编译操作之外，Vite 还有很多值得一提的性能优化，整体梳理一下：

- 预编译：npm 包这类基本不会变化的模块，使用 Esbuild 在 **「预构建」** 阶段先打包整理好，减少 http 请求数
- 按需编译：用户代码这一类频繁变动的模块，直到被使用时才会执行编译操作
- 客户端强缓存：请求过的模块会被以 http 头 `max-age=31536000,immutable` 设置为强缓存，如果模块发生变化则用附加的版本 query 使其失效
- 产物优化：相比于 Webpack ，Vite 直接锚定高版本浏览器，不需要在 build 产物中插入过多运行时与模板代码
- 内置更好的分包实现：不需要用户干预，默认启用一系列智能分包规则，尽可能减少模块的重复打包
- 更好的静态资源处理：Vite 尽量避免直接处理静态资源，而是选择遵循 ESM 方式提供服务，例如引入图片 `import img from 'xxx.png'` 语句，执行后 `img` 变量只是一个路径字符串。

![img]()

## 开发环境 VS 生产环境

开发环境

- 不需要对所有资源打包，只是使用 esbuild 对依赖进行预构建，将 CommonJS 和 UMD 发布的依赖转换为浏览器支持的 ESM，同时提高了后续页面的加载性能（lodash 的请求）。Vite 会将于构建的依赖缓存到 node_modules/.vite 目录下，它会根据几个源来决定是否需要重新运行预构建，包括 packages.json 中的 dependencies 列表、包管理器的 lockfile、可能在 vite.config.js 相关字段中配置过的。只要三者之一发生改变，才会重新预构建。
- 使用了浏览器缓存技术，解析后的依赖请求以 http 头的 max-age=31536000,immutable 强缓存，以提高页面性能。

生产环境

- 由于嵌套导入会导致发送大量的网络请求，即使使用 HTTP2.x（多路复用、首部压缩），在生产环境中发布未打包的 ESM 仍然性能低下。因此，对比在开发环境 Vite 使用 esbuild 来构建依赖，生产环境 Vite 则使用了更加成熟的 Rollup 来完成整个打包过程。因为 esbuild 虽然快，但针对应用级别的代码分割、CSS 处理仍然不够稳定，同时也未能兼容一些未提供 ESM 的 SDK。
- 为了在生产环境中获得最佳的加载性能，仍然需要对代码进行 tree-shaking、懒加载以及 chunk 分割（以获得更好的缓存）。

# vite 原理

## 依赖预构建

### ESM&esbuild

**ESM**

在 ES6 没有出现之前，随着 js 代码日益膨胀，往往会对资源模块化来提效，这也就出现了多个模块化方案。如 CommonJS 常用于服务端，AMD、CMD 规范常用在客户端。ES6 出现后，紧接着出现了 ESM。ESM 是浏览器支持的一种模块化方案，允许在浏览器实现模块化。[对比模块化规范工具](https://link.juejin.cn?target=https%3A%2F%2Fustcse.wolai.com%2FtHe7DgHwoXouZZSGTV79wd%233TBGcPu5apBUnjADNo8hrK)

- CommonJS：同步加载模块，如 Browserify 会对代码进行解析，整理出代码中的所有模块依赖关系，然后把 nodejs 的模块编译成浏览器可用的模块，相关的模块代码都打包在一起，形成一个完整的 JS 文件，这个文件中不会存在 require 这类的模块化语法，变成可以在浏览器中运行的普通 JS，运行时加载。这并不适合在浏览器环境，因为同步意味着阻塞加载，浏览器资源是异步加载的。
- AMD：异步加载模块，依赖前置，加载完依赖后立即执行依赖模块，依赖加载成功后执行回调。不过，AMD 规范开发成本高，代码的阅读和书写比较困难，模块定义方式的语义不顺畅。
- CMD：异步加载模块，延迟执行，就近依赖，先加载所有依赖模块，运行时才执行 require 内容，按顺序执行。不过，依赖 SPM 打包，模块的加载逻辑偏重。
- 与 CommonJS、AMD 不同，ESM 的对外接口只是一种静态定义，为编译时加载，遇到模块加载命令 import，就会生成一个只读引用。等脚本真正执行时，再根据这个只读引用，到被加载的那个模块内取值。由于 ESM 编译时就能确定模块的依赖关系，因此能够只包含要运行的代码，可以显著减少文件体积，降低浏览器压力。

[**esbuild**](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FBCL1Cm64mps4cZe_V26Wtw)

Vite 对 js/ts 的处理没有使用如 glup, rollup 等传统打包工具，而是使用了 esbuild。esbuild 是一个全新的 js 打包工具，底层使用了 go，大量使用了并行操作，可以充分利用 CPU 资源。esbuild 支持如 babel, 压缩等的功能。对比各打包工具性能，可以看到 esbuild 比 rollup 等工具快十几倍。

### 请求拦截

Vite 的基本实现原理，就是启动一个 koa 服务器拦截由浏览器请求 ESM 的请求。通过请求的路径找到目录下对应的文件做一定的处理最终以 ESM 的格式返回给客户端。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c1d9c94fbb4477d81182cbb79b2e7a7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### **依赖处理**

Vite 通过在一开始将应用中的模块区分为 **依赖** 和 **源码** 两类，改进了开发服务器启动时间。**依赖** 大多为在开发时不会变动的纯 JavaScript。一些较大的依赖（例如有上百个模块的组件库）处理的代价也很高。

**依赖解析**

平时开发中，webpack & rollup(rollup 有对应插件) 等打包工具会帮我们找到模块的路径，但浏览器只能通过相对路径去寻找，而如果是直接使用模块名比如：**import vue from 'vue'** ，浏览器就会报错，这个时候就需要一个三方包进行处理。

Vite 对 ESM 形式的 js 文件模块使用了 ES Module Lexer 处理。Lexer 会找到代码中以 import 语法导入的模块并以数组形式返回。Vite 通过该数组的值获取判断是否为一个 node_modules 模块。若是则重写路径为 @modules/:id 的形式，然后浏览器会发送 path 为 /@modules/:id 的对应请求，接下来会被 Vite 客户端做一层拦截来解析模块的真实位置。

**依赖预构建**

> Vite 使用 esbuild 在初次启动开发服务器前把检测到的依赖进行预构建。

依赖预构建主要有两个目的：

- **CommonJS 和 UMD 兼容性:** 开发阶段中，Vite 的开发服务器将所有代码视为原生 ES 模块。因此，Vite 必须先将作为 CommonJS 或 UMD 发布的依赖项转换为 ESM。
- **性能：** Vite 将有许多内部模块的 ESM 依赖关系转换为单个模块，以提高后续页面加载性能。

因为 Vite 基于 ESM，在使用某些模块时，由于模块依赖了另一些模块，依赖的模块又基于另一些模块。会出现页面初始化时一次发送数百个模块请求的情况。

所以 Vite 为了优化这个情况，利用 esbuild 在启动的时候预先把要导入的模块用到的所有内部模块全部打包成一个 bundle，这样就浏览器在请求导入的模块时，便只需要发送一次请求了。

注意：依赖预构建仅会在开发模式下应用，并会使用 `esbuild` 将依赖转为 ESM 模块。在生产构建中则会使用 `@rollup/plugin-commonjs`。

#### **静态资源加载**

当请求的路径符合 imageRE, mediaRE, fontsRE 或 JSON 格式，会被认为是一个静态资源。静态资源将处理成 ESM 模块返回。例如引入图片 `import img from 'xxx.png'` 语句，执行后 `img` 变量只是一个路径字符串。

#### **vue 文件缓存**

当 Vite 遇到一个 .vue 后缀的文件时。由于 .vue 模板文件的特殊性，它被拆分成 template, css, script 模块三个模块进行分别处理。最后会对 script, template, css 发送多个请求获取

#### ** js/ts 处理**

Vite 使用 esbuild 将 ts 转译到 js，约是 tsc 速度的 20 ～ 30 倍，同时 HMR 更新反应到浏览器的时间会小于 50ms。但是，由于 esbuild 转换 ts 到 js 对于类型操作仅仅是擦除，所以完全保证不了类型正确，因此需要额外校验类型，比如使用 tsc --noEmit。

将 ts 转换成 js 后，浏览器便可以利用 ESM 直接拿到 js 资源。

## 热更新原理

Vite 的热加载原理，其实就是在客户端与服务端建立了一个 websocket 连接，当代码被修改时，服务端发送消息通知客户端去请求修改模块的代码，完成热更新。

- 服务端：服务端做的就是监听代码文件的改变，在合适的时机向客户端发送 websocket 信息通知客户端去请求新的模块代码。
- 客户端：Vite 中客户端的 websocket 相关代码在处理 html 中时被写入代码中。可以看到在处理 html 时，vite/client 的相关代码已经被插入。

# 问题

1、构建工具和打包工具的区别？

> 构建过程应该包括 预编译、语法检查、词法检查、依赖处理、文件合并、文件压缩、单元测试、版本管理等 。打包工具更注重打包这一过程，主要包括依赖管理和版本管理。

2、Vite 有什么缺点？

- 目前 Vite 还是使用的 es module 模块不能直接使用生产环境（兼容性问题）。默认情况下，无论是 dev 还是 build 都会直接打出 ESM 版本的代码包，这就要求客户浏览器需要有一个比较新的版本，这放在现在的国情下还是有点难度的。不过 Vite 同时提供了一些弥补的方法，使用 build.polyfillDynamicImport 配置项配合 @vitejs/plugin-legacy 打包出一个看起来兼容性比较好的版本。

  默认的构建目标是能支持 [原生 ESM 语法的 script 标签](https://link.juejin.cn?target=https%3A%2F%2Fcaniuse.com%2Fes6-module)、[原生 ESM 动态导入](https://link.juejin.cn?target=https%3A%2F%2Fcaniuse.com%2Fes6-module-dynamic-import) 和 [`import.meta`](https://link.juejin.cn?target=https%3A%2F%2Fcaniuse.com%2Fmdn-javascript_operators_import_meta) 的浏览器。传统浏览器可以通过官方插件 [@vitejs/plugin-legacy](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvitejs%2Fvite%2Ftree%2Fmain%2Fpackages%2Fplugin-legacy) 支持 —— 查看 [构建生产版本](https://link.juejin.cn?target=https%3A%2F%2Fcn.vitejs.dev%2Fguide%2Fbuild.html) 章节获取更多细节。

- 生产环境使用 rollup 打包会造成开发环境与生产环境的不一致。

- 很多 第三方 sdk 没有产出 ems 格式的的代码，这个需要自己去做一些兼容。

3、Vite 生产环境用了 Rollup，那能在生产环境中直接使用 esm 吗？

- 其实目前的主要问题可能还是兼容性问题。
- 如果你的项目不需要兼容 IE11 等低版本的浏览器，自然是可以使用的。
- 但是更通用的方案可能还是类似 [ployfill.io](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttp%3A%2F%2Fployfill.io%2F) 的原理实现， 提前构建好 bundle.js 与 es module 两个版本的代码，根据浏览器的实际兼容性去动态选择导入哪个模块。

4、对于一些 没有产出 commonjs 的模块，如何去兼容呢？

首先业界是有一些如 lebab 的方法可以将 commjs 代码快速转化为 esm 的，但是对于一些格式不规范的代码，可能还是需要单独处理。

5、如果组件嵌套层级比较深，会影响速度吗？

- 可以看到请求 lodash 时 651 个请求只耗时 1.53s。这个耗时是完全可以接受的。
- Vite 是完全按需加载的，在页面初始化时只会请求初始化页面的一些组件，也就是说即使层级深，但如果未展示可以不加载。
- 缓存可以降低耗时
