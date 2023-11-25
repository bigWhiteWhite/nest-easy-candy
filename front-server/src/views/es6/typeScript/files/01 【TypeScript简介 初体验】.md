# 1.简介

## 1.1 TypeScript 简介

- [TS 官方文档](https://link.juejin.cn/?target=https%3A%2F%2Fwww.typescriptlang.org%2F)

1. **`TypeScript` 简称：TS，是 JavaScript 的超集**，简单来说就是：JS 有的 TS 都有。
2. 它对 JS 进行了扩展，向 JS 中引入了类型的概念，并添加了许多新的特性。
3. TS 代码需要通过编译器编译为 JS，然后再交由 JS 解析器执行。
4. TS 完全兼容 JS，换言之，任何的 JS 代码都可以直接当成 JS 使用。
5. 相较于 JS 而言，TS 拥有了静态类型，更加严格的语法，更强大的功能；TS 可以在代码执行前就完成代码的检查，减小了运行时异常的出现的几率；TS 代码可以编译为任意版本的 JS 代码，可有效解决不同 JS 运行环境的兼容问题；同样的功能，TS 的代码量要大于 JS，但由于 TS 的代码结构更加清晰，变量类型更加明确，在后期代码的维护中 TS 却远远胜于 JS。

![image-20220805180538856](https://i0.hdslb.com/bfs/album/ba8bd25384d6530bff2acf5a425b6c529dd8f6b1.png)

> TS 和 JS 之间的关系其实就是 Less/Sass 和 CSS 之间的关系就像 Less/Sass 是对 CSS 进行扩展一样, TS 也是对 JS 进行扩展就像 Less/Sass 最终会转换成 CSS 一样, 我们编写好的 TS 代码最终也会换成 JS

## 1.2 为什么要有 typescript

- 背景：JS 的类型系统存在“先天缺陷”弱类型，JS 代码中绝大部分错误都是类型错误（Uncaught TypeError）
  - 开发的时候，定义的变量本应该就有类型
- 这些经常出现的错误，导致了在使用 JS 进行项目开发时，增加了找 Bug、改 Bug 的时间，严重影响开发效率
- 从编程语言的动静来区分，**TypeScript 属于静态类型的编程语言**，**JavaScript 属于动态类型的编程语言**
  - 静态类型：**编译**期做类型检查
  - 动态类型：**执行**期做类型检查
- 代码编译和代码执行的顺序：1 编译 2 执行
- 对于 JS 来说：需要等到代码真正去执行的时候才能发现错误（晚）
- 对于 TS 来说：在代码编译的时候（代码执行前）就可以发现错误（早）

并且，配合 VSCode 等开发工具，TS 可以提前到**在编写代码的同时就发现代码中的错误**，减少找 Bug、改 Bug 时间

对比：

- 使用 JS：
  1. 在 VSCode 里面写代码
  2. 在浏览器中运行代码 --> 运行时，才会发现错误【晚】
- 使用 TS：
  1. 在 VSCode 里面写代码 --> 写代码的同时，就会发现错误【早】
  2. 在浏览器中运行代码

> 简单来说就是因为 JavaScript 是弱类型, 很多错误只有在运行时才会被发现而 TypeScript 提供了一套静态检测机制, 可以帮助我们在编译时就发现错误

## 1.3 TypeScript 相比 JS 的优势

1. 更早（写代码的同时）发现错误，减少找 Bug、改 Bug 时间，提升开发效率。
2. 程序中任何位置的代码都有提示，随时随地的安全感，增强了开发体验。
3. 强大的类型系统提升了代码的可维护性，使得重构代码更加容易。
4. 支持最新的 ECMAScript 语法，优先体验最新的语法，让你走在前端技术的最前沿。
5. TS 类型判断机制，不需要再代码中的每个地方都演示标注类型，让你在享受优势的同时，尽量降低来了成本。

除此之外，Vue 3 源码使用 TS 重写、Angular 默认支持 TS、React 与 TS 完美配合，TypeScript 已成为大中型前端 项目的首选编程语言。

目前，前端最新的开发技术栈：

1. React： TS + Hooks
2. Vue： TS + Vue3

- 注意： Vue2 对 TS 的支持不好~

# 2.TypeScript 初体验

## 2.1 TypeScript 开发环境搭建

问题：为什么要安装编译 TS 的工具包？

回答：Node.js/浏览器，只认识 JS 代码，不认识 TS 代码。需要将 TS 代码转化为 JS 代码，然后才能运行。

1. 下载 Node.js
   - 64 位：https://nodejs.org/dist/v14.15.1/node-v14.15.1-x64.msi
   - 32 位：https://nodejs.org/dist/v14.15.1/node-v14.15.1-x86.msi
2. 安装 Node.js
3. 使用 pnpm 全局安装 typescript
   - 进入命令行
   - 输入：pnpm i -g typescript

> - typescript 包：用来编译 TS 代码的包，提供了 `tsc` 命令，实现了 TS -> JS 的转化
> - 验证是否安装成功：tsc –v(查看 typescript 的版本)

![image-20220805183234278](https://i0.hdslb.com/bfs/album/ee182b1c607104b3bf9d296af15389c0b49b14fd.png)

## 2.2 编译并运行 TS 代码

- 创建 hello.ts 文件（注意：**TS 文件的后缀名为 `.ts`**）

- 将 TS 编译为 JS：在终端中输入命令，`tsc hello.ts`（此时，在同级目录中会出现一个同名的 JS 文件）
- 执行 JS 代码：在终端中输入命令，`node hello.js`

1 创建 ts 文件 ===> 2 编译 TS ===> 3 执行 JS

- 说明：所有合法的 JS 代码都是 TS 代码，有 JS 基础只需要学习 TS 的类型即可
- 注意：由 TS 编译生成的 JS 文件，代码中就没有类型信息了

**真正在开发过程中，其实不需要自己手动的通过 tsc 把 ts 文件转成 js 文件，这些工作应该交给 webpack 或者 vite 来完成**

## 2.3 简化运行 TS 的步骤

问题描述：每次修改代码后，都要重复执行两个命令，才能运行 TS 代码，太繁琐。

简化方式：使用 ts-node 包，直接在 Node.js 中执行 TS 代码。

安装命令：`pnpm i -g ts-node`(ts-node 包提供了 ts-node 命令)。

使用方式：`ts-node hello.ts`。(遇到错误了：在安装完 ts-node 之后执行这个使用命令会报错，原因是缺少安装东西，执行命令 `pnpm install -g tslib @types/node`)

解释：ts-node 命令在内部偷偷的将 TS->JS，然后，再运行 JS 代码。

## 2.4 官方 playground

官方也提供了一个在线开发 TypeScript 的云环境——[Playground](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fzh%2Fplay)。

基于它，我们无须在本地安装环境，只需要一个浏览器即可随时学习和编写 TypeScript，同时还可以方便地选择 TypeScript 版本、配置 tsconfig，并对 TypeScript 实时静态类型检测、转译输出 JavaScript 和在线执行。

而且在体验上，它也一点儿不逊色于任何本地的 IDE，对于刚刚学习 TypeScript 的我们来说，算是一个不错的选择
