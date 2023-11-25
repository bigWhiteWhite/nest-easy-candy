# 01 【Sass 的安装使用】

## 1.介绍

### 1.1 CSS 预处理技术，及种类介绍

什么是 css 预处理技术

- CSS 预处理器定义了一种新的语言，其基本思想是，用一种专门的编程语言，为 CSS 增加了一些编程的特性，将 CSS 作为目标生成文件，然后开发者就只要使用这种语言进行编码工作。
- 通俗的说，“CSS 预处理器用一种专门的编程语言，进行 Web 页面样式设计，然后再编译成正常的 CSS 文件，以供项目使用。CSS 预处理器为 CSS 增加一些编程的特性，无需考虑浏览器的兼容性问题”，例如你可以在 CSS 中使用变量、简单的逻辑程序、函数（如变量$main-color）等等在编程语言中的一些基本特性，可以让你的 CSS 更加简洁、适应性更强、可读性更佳，更易于代码的维护等诸多好处。

css 预处理技术的种类

- Sass（SCSS）
- LESS
- Stylus
- Turbine
- Swithch CSS
- CSS Cacheer
- DT CSS

**如此之多的 CSS 预处理器，那么“我应该选择哪种 CSS 预处理器？”也相应成了最近网上的一大热门话题，各大技术论坛也是争论不休。**

到目前为止，在众多优秀的 CSS 预处理器语言中就属 `Sass`、`LESS` 和 `Stylus` 最优秀。

### 1.2 什么是 sass

Sass(Syntactically Awesome StyleSheets)是一种 CSS 预处理器(`preprocessor`)， 是一款强化 CSS 的辅助工具。可以高效的编写样式，同时实现变量、嵌套、组合、继承等编程语言功能。

> css 是一门非程序式语言，没有变量、函数、scope(作用域)等概念。
>
> - CSS 需要书写大量看似没有逻辑的代码，冗余度比较高
> - 不方便维护及扩展，难以复用
> - css 没有很好的计算能力
> - 非前端工程师往往会因为缺少 CSS 编写经验而很难写出组织良好且易于维护的 CSS 代码

CSS 预处理器定义了一种新的语言，其基本思想是，用一种专门的编程语言，为 CSS 增加了一些编程的特性，将 CSS 作为目标生成文件，然后开发者只要使用这种语言进行 CSS 的编码工作就可以了。

> “用一种专门的编程语言，进行 Web 页面样式设计，再通过编译器转化为正常的 CSS 文件，以供项目使用。”

## 2.关于 scss 和 sass

sass 是最早出现的 css 预处理语言，有着比 less 更强大的功能。采用 Ruby 语言编写。

最初版本采用的是严格缩进的风格（不带大括号( {} )和分号( ; )，这一语法也导致一开始，sass 并不太为开发者所接受）。

**从 V3 版本开始放弃了缩进式的风格，并完全兼容普通的 css 代码，也因此从第三代开始，sass 也被称为 scss。**

> Sass 3 就是 Scss，是 Sassy CSS 的简写，它是 CSS3 语法的超集，也就是说所有有效的 CSS/CSS3 样式也同样适合于 Sass。

对现代编程来说，sass 就是 scss，也因此，sass 现在的扩展名为`.scss`（如果是旧版本的 sass，可能扩展名会为`.sass`）。

## 3.安装和命令行编译

cmd 打开本地命令控制窗口，输入下面字符串然后回车就装好了。

```shell
npm install -g sass
```

**编译.scss 文件为.css 文件：**

Sass 使用.scss 作为文件后缀名，不能直接在< link >标签里使用，需要编译为 .css 文件。 **演示：**

1. 建一个 html 文件，随便写个 h1 标签：

   ![image-20220823140518434](https://i0.hdslb.com/bfs/album/bacbc180d9a88cd06ac988ab8fab52448a35348b.png)

2. 建一个.scss 后缀的文件，如 input.scss，写点基本样式 sass 的语法： ![image-20220823140550201](https://i0.hdslb.com/bfs/album/7446e8cfea1963feec70f74c98e15a5570f0a8cd.png)

3. 在 html 文件所在的路径下打开 cmd 命令控制符，输入：

   ```shell
   //单文件转换命令
   sass input.scss:output.css

   // 或 sass input.scss output.css
   ```

   表示把名字为 input.scss 转换成名字为 ouput.css 的文件。回车后，接下来发现就得到了 css 的文件。

   ![image-20220823140645814](https://i0.hdslb.com/bfs/album/cd57c9686d892e6f30e4f15aa3124c150a3038db.png)

> 使用 : 编译输出时，前后不能有空格，即 `:` 前紧跟输入的 scss 文件，`:` 后紧跟输出的 css 文件。

> `:` 冒号形式的命令，常用于编译文件夹（中的所有 sass 文件）的输入输出。

​ css 文件内容如下，可以看出转换好了： ​ ![image-20220823140750386](https://i0.hdslb.com/bfs/album/23a4e7317c5dc935065a7d17de1af039ef1fef0a.png) ​ 接下来就是老操作了，在 HTML 里用 < link >标签把 css 文件引入就行。

4. 但是不可能说写一句.scss 语句就转换一次，太麻烦，所以可以自动转换，当我在.scss 里写一句，.css 就自动生成一句。在 cmd 输入以下：

   ```bash
   sass --watch input.scss:ouput.css
   ```

   表示监视变化，当 input.scss 一变化，output.css 就变化

空格和冒号对应生成 css 的两中模式，如果是一对一模式（一个 scss 生成一个 css），使用空格即可；如果是多对多模式，比如一个文件夹生成到另一个文件夹，同时一次性有多个 scss 文件生成 css 文件等。

```bash
## 编译 light.scss 和 dark.scss 到 light.css 和 dark.css.
> sass light.scss:light.css dark.scss:dark.css

sass  --watch  fileFolder:outputFolder/css
```

当名字为`fileFolder`这个文件夹里任意一个.scss 后缀的文件变化时，就将其编译到名字`outputFolder/css`这个文件夹里面（会自动生成相应的.css 文件）

## 4.Sass 文件编译快览

### 4.1 命令行编译配置选项

可以通过 `sass -h` 或 `sass --help` 查看详细配置项。

配置选项可以指定编译后的 css 的排版、是否生成调试 map、开启 debug 等，最常用的是 `--style` 和 `--sourcemap`。

### 4.2 `--watch`监听文件变化

sass 使用`--watch`选项，用于监听 scss 文件的变化。这样，当 scss 文件内容有改动时，会自动编译为 css。

- 监听单个 scss 文件

```sh
sass --watch .\firstsass.scss .\firstsass1.css
```

- 监听 scss 文件夹

```sh
sass --watch .\scssdir\ .\cssdir\

sass --watch scssdir:cssdir
```

可以看到，**使用 `:` 可以指定输出的路径（文件夹），否则 css 将默认生成在源 scss 文件所在目录中。**

- 结合 `--style` 监听

```sh
sass --watch app/sass:public/stylesheets --style=compressed
```

> **使用压缩（compressed）的样式（style）输出 css 文件**

### 4.3 `--style`指定 css 的样式

`--style` 的 css 格式有两种：`expanded`（默认）、`compressed`。

> 旧版本的 Ruby 实现中有四种样式，还有`nested`、`compact`。

```sh
// 指定编译格式
sass input.scss:output.css --style=expanded
```

比如，一个 scss 文件如下：

```scss
.box {
	width: 300px;
	height: 400px;
	&-title {
		height: 30px;
		line-height: 30px;
	}
}
```

下面，可以查看`expanded`、`compressed`编译后的 css 格式。

1. `expanded` ：默认值，未压缩的展开的 css 格式

每个选择器和声明单独一行。

执行如下命令编译：

```sh
sass styletest.scss styletest.css --style=expanded

## 或 sass styletest.scss styletest.css
```

expanded 编译过后的样式，是标准的没有经过任何压缩，全部字符展开的 css 格式：

```css
.box {
	width: 300px;
	height: 400px;
}
.box-title {
	height: 30px;
	line-height: 30px;
}
```

1. `compressed` 去除所有的空白字符，全部 css 内容压缩为一行

**生产环境中推荐的 css 格式。**

执行如下命令编译，将 css 结果输出在命令行中：

```sh
sass --style=compressed styletest.scss

.box{width:300px;height:400px}.box-title{height:30px;line-height:30px}
```

## 5.使用 VSCode 插件编译

### 5.1 基本使用

**live sass compiler 是 VSCode 扩展，可以实时地将 SASS / SCSS 文件编译/转换为 CSS 文件。**

- 可以自动添加 css 兼容性前缀，-webkit-，-moz-，-ms，-o-等。
- 可以自定义 css 文件解析后的代码样式（expanded 展开，compact，compressed 压缩，nested）。
- 可自定义编译/转换后的文件扩展名（.css 或.min.css）。

**1.在 vscode 插件里搜索 live sass compiler 安装。**

**2.安装后，新建 scss 文件，在 vscode 底部状态栏中点击 watch sass，此时状态为 Watching ，即可自动解析 sass 为 css 文件。**

![image-20220823173100339](https://i0.hdslb.com/bfs/album/f18b5afe44e8a50d00093d9683a9c6965272617b.png)

### 5.2 自定义设置

在使用 live sass compiler 插件时，并不是所有的默认设置都如我们所愿，那么，我们来看一下如何自定义设置。

**1.编译/转换后的文件格式、扩展名、保存位置**

- 文件格式格式可以是 expanded，compact，compressed 或 nested。默认值为 expanded。
- 扩展名扩展名可以是.css 或.min.css。默认值为.css。
- 保存位置默认的转换后的 css 文件保存在 scss 文件的同级目录下，但实际，我们通常需要把所有 scss 文件保存在 scss 文件夹，而 css 文件希望保存在 css 的文件夹，如图所示： ![image-20220823173159840](https://i0.hdslb.com/bfs/album/50de6685454beb2c1ae13f5a12f7a70bc59d2c7d.png)

​ 我们在配置中如下设置：

```json
"liveSassCompile.settings.formats": [
  {
    "format": "expanded",
    "extensionName": ".css",
    "savePath": "~/../css/"
  }
]
```

savePath 即为导出后的文件保存位置。

**2.去掉编译时出现的 css.map 文件** 在每个文件编译后，默认设置下，会同时出现一个 map 格式的文件，有时并不需要该文件，那么我们如何去掉呢？

```json
"liveSassCompile.settings.generateMap": false,
```

默认值为 true，我们设置为 false 即可。

**3.设置 css 兼容性前缀** live sass compiler 可以在编译时自动添加 CSS 兼容性前缀（-webkit-，-moz-，-ms，-o-等），如下设置：

```json
"liveSassCompile.settings.autoprefix": [
  "> 1%",
  "last 3 versions"
],
```

其中，

- ">1%"是指 通过全球使用情况统计信息选择出的高于 1%使用率的浏览器版本。
- "last 3 versions"是指 每个浏览器的最后 3 个版本。

这里也可以设置为具体的浏览器，如下：

```json
"liveSassCompile.settings.autoprefix": [
  "ie >= 6",  //ie6以上
  "firefox >= 8",
  "chrome >= 24",
  "Opera>=10"
],
```

**总结**

个人配置：

```json
"liveSassCompile.settings.generateMap": true,
"liveSassCompile.settings.autoprefix": [
  "ie >= 6",  //ie6以上
  "firefox >= 8",
  "chrome >= 24",
  "Opera>=10"
],
"liveSassCompile.settings.excludeList": [
  "**/node_modules/**",
  ".vscode/**"
],
"liveSassCompile.settings.formats": [
  {
    "format": "expanded",
    "extensionName": ".css",
    "savePath": "~/../css/"
  },      "liveSassCompile.settings.showOutputWindow": true
]
```

> ```json
> 压缩生成min.css文件
> "liveSassCompile.settings.formats": [
>     // More Complex
>     {
>         "format": "compressed",
>         "extensionName": ".min.css",
>         "savePath": "~/../css/"
>     }
>  ]
> ```

> 感觉总体作用不大，还是结合 webpack 等工具，实时更新页面内容时，实时编译 scss，而不需要单独使用该工具。

## 6.使用 webpack 编译

在目前主流的前端项目中，一般是使用 [Webpack](https://www.webpackjs.com/loaders/sass-loader/) 来构建我们的前端项目，并且大多数都跑在 Node 环境下。

行如下命令安装 sass-loader ：

```bash
npm install mini-css-extract-plugin -D
npm install css-loader -D
npm install sass-loader --save-dev
```

`webpack.config.js`

```js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          '[MiniCssExtractPlugin.loader',
          // 将 css 文件整合到 js 文件中
          'css-loader',
          // 编译 sass 文件为 css 文件
          'sass-loader'
        ]
      }
    ]
  },
    plugins: [
    // 提取css成单独文件
    new MiniCssExtractPlugin({
      // 定义输出文件名和目录
      filename: "static/css/[name].css",
    }),
    ]
}
```
