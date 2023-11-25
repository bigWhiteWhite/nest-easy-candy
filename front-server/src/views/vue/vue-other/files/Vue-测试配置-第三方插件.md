# 项目搭建规范

## 脚手架

```typescript
// vue create 项目名  脚手架版本，node版本要注意

Use class-style component syntax?  // no
Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX) // yes
Pick a linter / formatter config: // ESLint + Prettier
Pick additional lint features: (Press <space> to select, <a> to toggle all, <i> to invert selection) // Lint on save
 Where do you prefer placing config for Babel, ESLint, etc.? (Use arrow keys) // In dedicated config files
// 选项
```

## 一.代码规范

### 1.1 .editorconfig

**集成.editorconfig 配置**,EditorConfig 有助于为不同 IDE 编辑器上处理同一项目的多个开发人员维护一致的编码风格

```yaml
# https://editorconfig.org

root = true

[*] # 表示所有文件使用
charset = utf-8 # 设置文件字符串集为utf-8
indent_style = tab # 缩进风格(tab | space)
indent_size = 2 # 缩进大小
end_of_line = lf # 控制换行类型(lf | cr | crlf)
insert_final_newline = true # 去除行首的任意字符
trim_trailing_whitespace = true # 始终在文件末尾插入一个新行

[*.md] # 表示只有md文件适用以下规则
insert_final_newline = false
trim_trailing_whitespace = false
```

vscode 需要安装一个插件:**EditorConfig for VS Code**

### 1.2 适用 prettier 工具

vscode 需要安装一个插件:**prettier**

Prettier 是一款强大的代码格式化工具，支持很多语言，基本上前端使用到的样式都可以搞定，是当下最流行的代码格式化工具

**安装 prettier**

```npm
npm i prettier -D
```

**配置.prettierrc 文件：**

- useTabs:使用 tab 缩进还是空格缩进，选择 true
- tabWidth：tab 是空格的情况下，是几个空格，选择 2 个
- printWidth：当行字符的长度，推荐 80 100 120
- singleQuote: 使用单引号还是双引号，选择 true 为单引号
- trailingComma: 在多行输入的尾逗号是否添加，设置为 none 为不加
- semi：语句末尾是否要加分号，默认值 true，选择 false 表示不加

```json
{
	"useTabs": true,
	"tabWidth": 2,
	"printWidth": 80,
	"singleQuote": true,
	"trailingComma": "none",
	"semi": false
}
```

**配置.prettierignore 忽略文件：**

配置那些文件**不使用 prettier**

```typescript
/dist/*
.local
.output.js
/node_modules/**

**/*.svg
**/*.sh

/public/*
```

**package 文件配置脚本命令**

执行以后就可以对文件进行 prettier 的转化

```
"scripts": {
    "prettier": "prettier --write ."
}
```

### 1.3 使用 EsLint 检测

```typescript
npm install eslint --save-dev
// 额外的插件
yarn add
eslint-plugin-import
eslint-loader
eslint-plugin-import
eslint-plugin-node
eslint-plugin-promise
eslint-plugin-standard
```

如果在创建项目的时候选择了 eslint，那么 vue 会默认帮助我们配置需要的 eslint 环境

vscode 需要安装一个插件:**Eslint**

**解决 eslint 和 prettier 冲突的问题：**

安装插件：(vue 在创建项目时，如果选择 eslint 和 prettier，那么这两个插件会自动安装)

```vue
yarn add eslint-plugin-prettier eslint-config-prettier -D
```

`.eslintrc.js文件添加prettier插件`

```vue
extends:[ 'plugin:prettier/recommended' ]
```

如果还报警告，重启项目

在**代码编写**的时候，如果出现有一些代码是你想要的，比如说使用 common 引入库的时候，出现了 eslint 警告，那么就可以将**鼠标停留在警告上复制**，如：'@typescript-eslint/no-var-requires'

```typescript
// 进入.eslintrc.js文件
rules: {
    '@typescript-eslint/no-var-requires': 'off' // 关闭
}
```

### 1.4 使用 stylelint

**webpack+sass**

```powershell
yarn add stylelint stylelint-order stylelint-config-standard stylelint-scss stylelint-webpack-plugin --dev
```

### 1.5 git Husky 和 eslint

虽然我们已经要求项目使用 eslint，但是不能保证组员提交代码之前都把 eslint 中的问题解决掉了：

- 首先要保证项目有 git 绑定！！！
- 也就是我们希望保证代码仓库中的代码都是符合 eslint 规范的
- 那么我们需要在组员执行`git commit`命令的时候对其进行校验，如果不符合 eslint 规范，那么自动通过规范进行修复；
  - 那么如何做到这一点呢？可以通过 Husky 工具；
- husky 是一个 git hook 工具，可以帮助我们触发 git 提交的各个阶段：pre-commit，commit-msg，pre-push，如何使用 husky?
- 使用自动配置命令：

```typescript
npx husky-init && npm install
```

这里会做三件事：

1.安装 husky 相关依赖：

2.在项目目录下创建.husky 文件夹：

3.在 package.json 中添加一个脚本：`prepare:"husky install"`

**package.json** 脚本

husky 可以在 commit 提交之前执行脚本进行 eslint 的代码规范，

也就是执行 npm run lint

```typescript
"scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",

    "prettier": "prettier --write ."
    "prepare": "husky install"
}
```

在**.husky**文件夹中的**pre-commit**

```typescript
npm run lint
```

### 1.6 git commit 规范

#### 1.6.1 代码提交风格

通常我们的 git commit 会按照统一的风格来提交，这样可以快速定位每次提交的内容，方便之后对版本进行控制

但是每一次手动来编写这些是比较麻烦的，可以使用工具 Commitizen

- Commitizen 是一个帮助我们编写规范 commit message 的工具：

  1.安装 Commitizen

```typescript
npm install commitizen -D
```

2.安装 cz-conventional-changelog,并且初始化 cz-conventional-changelog：

```typescript
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

这个命令会帮助我们安装 cz-conventional-changelog ，并且进行配置

**git add .**

**npx cz**

提交代码需要使用**npx cz**：

- 第一步是选择 type，本次更新的类型

| Type     | 作用                                                                                   |
| -------- | -------------------------------------------------------------------------------------- |
| feat     | 新增特性(feature)                                                                      |
| fix      | 修复 Bug(bug fix)                                                                      |
| docs     | 修改文档(documentation)                                                                |
| style    | 代码格式修改(white-space,formatting,missing semi colons,etc)                           |
| refactor | 代码重构(refactor)                                                                     |
| perf     | 改善性能(A code change that improves perfromance)                                      |
| test     | 测试(when adding missing tests)                                                        |
| build    | 变更项目构建或外部依赖(例如 scopes：webpack，gulp，npm 等)                             |
| ci       | 更改持续集成软件的配置软件和 package 中的 scripts 命令，例如 scopes：Travis，Circle 等 |
| chore    | 变更构建流程或辅助工具(比如更改测试环境)                                               |
| revert   | 代码回退                                                                               |

- 第二步选择本次修改的范围(作用域)
- 第三步选择提交的信息
- 第四步询问你是否需要长的描述
- 第五步询问你是否是一个大的更新
- 第六步询问你是否是开源

#### 1.6.2 代码提交验证

如果我们按照 cz 来规范了提交风格，但是依然有同事通过 git commit 按照不规范的格式提交应该怎么办呢

- 我们可以通过 commitlint 来限制提交；

1、安装@commitlint/config-conventional 和@commitlint/cli -D

```typescript
npm i @commitlint/config-conventional @commitlint/cli -D
```

2、在根目录**创建 commitlint.config.js**文件，配置 commitlint

```typescript
module.exports = {
	extends: ['@commitlint/comfig-conventional']
}
```

3、使用 husky 生成 commit-msg 文件，验证提交信息

```typescript
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit $1'
```

如果不习惯用 npx cz 来进行 commit 操作的话，可以在 package.json 中加多一个脚本, **npm run commit**

```typescript
"scripts": {
    "commit": "cz",
}
```

## 二.第三方插件集成

### vue.config.js 配置

https://cli.vuejs.org/zh/config/#vue-config-js

像那种**配置的 js 文件都是使用 common.js 的形式暴露出去**，因为**node 默认使用 common 规范**，如 **module.export**；

最新版的 vue 脚手架中将 webpack 文件隐藏了起来，那么需要更改的时候就要配置 vue.config.js 文件，vue.config.js 有三种配置方式：

- 方式一：直接通过 CLI 提供给我们的选项来配置：
  - 比如 publicPath：配置应用程序部署的子目录(默认是/,相当于部署在https://www.my-app.com/);
  - 比如 outputDir：修改输出的文件夹；
- 方式二：通过 configureWebpack 修改 webpack 的配置
  - 可以是一个对象，直接会被合并；
  - 可以是一个函数，会接受一个 config，可以通过 config 来修改配置

```typescript
// 对象
module.exports = {
	outputDir: './builds',
	configureWebpack: {
		resolve: {
			alias: {
				// 默认里面@表示src
				components: '@/components'
			}
		}
	}
}

// 函数
module.exports = {
	outputDir: './builds',
	configureWebpack: (config) => {
		config.resolve.alias = {
			'@': path.resolve(__dirname, 'src'),
			components: '@/components'
		}
	}
}
```

- 方式三：通过 chainWebpack 来修改 webpack 的配置

  - 是一个函数，会接受一个基于 webpack-chain 的 config 对象，可以对配置进行修改

  ```typescript
  // 函数
  module.exports = {
     outputDir: './builds',
     chainWebpack: (config)=> {
         config.resolve.alias
             .set('@',path.resolve(__dirname,'src'))
             .set('components','@/components')
         }
     }
  }
  ```

### element 引入

不推荐

安装 babel 插件

```typescript
npm i babel-plugin-import -D
```

配置 babel.config.js

```typescript
module.exports = {
	plugins: [
		[
			'import',
			{
				libraryName: 'element-plus',
				customStyleName: (name) => {
					return `element-plus/theme-chalk/${name}.css`
				}
			}
		]
	],
	presets: ['@vue/cli-plugin-babel/preset']
}
```

### postman

```typescript
const res = pm.response.json()
pm.globals.set('token', res.data.token)

// 使用
{
	{
		token
	}
}
```

### postcss+pxtorem

```typescript
yarn add postcss-import postcss-loader postcss-url -D
yarn add postcss-pxtorem -D
yarn add autoprefixer -D // 用于兼容不同浏览器的css
```

```typescript
// postcss.config.js
const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')
module.exports = () => {
	// 如果个别地方不想转化px。可以简单的使用大写的 PX 或 Px
	return {
		plugins: [
			autoprefixer(),
			pxtorem({
				rootValue: 16,
				propList: ['*'],
				minPixelValue: 2
			})
		]
	}
}
```

### svg-sprite-loader

```typescript
yarn add svg-sprite-loader -D
```

#### vue2 配置

**vue.config.js**

```typescript
const argv = process.argv

module.exports = {
	// 配置自定义环境变量
	chainWebpack: (config) => {
		const svgRule = config.module.rule('svg')
		svgRule.uses.clear()
		svgRule
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({
				symbolId: 'icon-[name]'
			})
			.end()
		config.plugin('define').tap((args) => {
			// 启动命令行变量
			// console.log(args,'args')
			// args[0].CLIENT = JSON.stringify(argv);
			return args
		})
	}
}
```

**webpack.base.conf.js**

```typescript
module: {
	rules: [
		...(config.dev.useEslint ? [createLintingRule()] : []),
		{
			test: /\.svg$/,
			loader: 'svg-sprite-loader',
			include: [resolve('src/assets')],
			options: {
				symbolId: 'icon-[name]'
			}
		}
	]
}
```

**注册全局组件 svg-icon**

```vue
<template>
	<div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners" />
	<svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
		<use :xlink:href="iconName" />
	</svg>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { isExternal } from '@/utils/validate'

export default {
	name: 'SvgIcon',
	props: {
		iconClass: {
			type: String,
			required: true
		},
		className: {
			type: String,
			default: ''
		}
	},
	computed: {
		isExternal() {
			return isExternal(this.iconClass)
		},
		iconName() {
			return `#icon-${this.iconClass}`
		},
		svgClass() {
			if (this.className) {
				return 'svg-icon ' + this.className
			} else {
				return 'svg-icon'
			}
		},
		styleExternalIcon() {
			return {
				mask: `url(${this.iconClass}) no-repeat 50% 50%`,
				'-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
			}
		}
	}
}
</script>

<style scoped>
.svg-icon {
	width: 1em;
	height: 1em;
	vertical-align: -0.15em;
	fill: currentColor;
	overflow: hidden;
}

.svg-external-icon {
	background-color: currentColor;
	mask-size: cover !important;
	display: inline-block;
}
</style>
```

**引入全部的 svg 文件**

```typescript
// icon.js
import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon' // svg component

Vue.component('svg-icon', SvgIcon)

const req = require.context('../assets/svg', false, /\.svg$/)
const requireAll = (requireContext) => requireContext.keys().map(requireContext)
requireAll(req)

// index.js 直接引入这个文件即可
```

### vuex-persist

```text
yarn add vuex-persist
```

```text
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import createLogger from 'vuex/dist/logger'
import getters from '@/store/getters'
// import VuexPersist from 'vuex-persist/dist/umd';

import setting from '@/store/modules/setting'
import user from '@/store/modules/user'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
// 解决vuex刷新问题
const vuexLocal = new VuexPersistence({
	storage: window.sessionStorage
})

export default new Vuex.Store({
	modules: {
		setting,
		user
	},
	getters: getters,
	plugins: debug ? [createLogger(), vuexLocal.plugin] : [vuexLocal.plugin],
	strict: debug
})
```

### 环境变量

https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F%E5%92%8C%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F

环境变量，就是全局需要用到的变量，比如接口地址，项目名称等。项目又可能身处不同的环境，比如测试环境、开发环境不同，请求的接口地址不同。

环境变量文件位置于项目根目录，文件名是.env、.env.development 和.env.production

- 开发环境 development
- 生产环境 production
- 测试环境 test

```typescript
.env //所有环境都会加载的配置文件
.env.development //开发环境加载的配置文件(npm run serve启动会加载的配置)
.env.production //生产环境加载的配置文件(npm run build后dist项目会加载的配置)
//.env.development或.env.production里的变量会覆盖.env同名变量
```

**访问**

```typescript
import.meta.env.MODE // vite
process.env.MODE // webpack
```

**封装**

```text
// 环境的切换
if (process.env.NODE_ENV == 'development') {
	axios.defaults.baseURL = 'https://www.baidu.com'
} else if (process.env.NODE_ENV == 'debug') {
	axios.defaults.baseURL = 'https://www.ceshi.com'
} else if (process.env.NODE_ENV == 'production') {
	axios.defaults.baseURL = 'https://www.production.com'
}
```

.env

请注意，只有 `NODE_ENV`，`BASE_URL` 和以 `VUE_APP_` 开头的变量将通过 `webpack.DefinePlugin` 静态地嵌入到*客户端侧*的代码中。这是为了避免意外公开机器上可能具有相同名称的私钥。

```typescript
BASE_URL
NODE_ENV // webpack默认设置了环境development/production
VUE_APP_随便写
```

## 三.第三方库集成

### Echarts

**前端数据可视化工具**

- 常见框架：ECharts ，g2，d3，vis，hightChart 等等
- g2 框架封装：bizcharts(react), viser(vue)
- 地理可视化：g2，L7，高德的 Loca，菜鸟的鸟图
- 3D 可视化：three.js
- 数字变化库：countUp gsap

**下载引入**

```typescript
npm i echarts --save
yarn add echarts

import * as echarts form 'echarts '
// 初始化Echarts对象，并且设置配置进行绘制
// 通过echarts.init(dom, theme, options)初始化
// 通过setOption方法设置绘制的数据
```

**canvas 和 svg**

- 一般来说，canvas 更适合绘制图形元素数量非常大（这一般是由于数据量大导致）的图表（如热力图，地理图表系或者平行坐标系上的大规模线图或散点图等），也利于实现某些视觉特效
- 但是，在不少场景中，SVG 具有重要的优势：它的内存占用更低（这对移动端尤其重要），渲染性能略高，并且用户使用浏览器内置的缩放功能的时候不会模糊
- 环境较差，出现性能问题需要优化的场景下，可以通过试验来确定使用哪种渲染器
  - 当需要创建很多 ECharts 实例且浏览器易崩溃的情况下(可能是因为 Canvas 数量多导致内存占用超出手机承受能力)，可以使用 SVG 渲染器来改善
  - 如果图表运行在低端安卓机，或者我们在使用一些特定图表如水球图等，SVG 渲染器可能效果更好
  - 数据量大，较多交互的时候，可以使用 Canvas 渲染器

### swiper

#### vue2

https://blog.csdn.net/weixin_43978427/article/details/123567585

```typescript
yarn add vue-awesome-swiper@4.1.1
yarn add swiper@5.4.5
```

**引入**

```vue
<template>
	<swiper ref="mySwiper" :options="swiperOptions">
		<swiper-slide>123</swiper-slide>
		<div class="swiper-pagination" slot="pagination"></div>
	</swiper>
</template>
<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
export default {
	components: {
		Swiper,
		SwiperSlide
	},
	data() {
		return {
			swiperOptions: {
				pagination: {
					el: '.swiper-pagination',
					clickable: true
				},
				autoplay: {
					delay: 2000
				},
				loop: true
			}
		}
	}
}
</script>
```

### timeago.js

它是显示几小时之前，很多随时更新的网站和应用，为了显示出及时性，不再显示具体发布的时间，而是改为几分钟或者几小时前发布的。这样显着时效性更好。这个插件的作用就是这个。如果需要，请收藏好。

网址：https://github.com/hustcc/timeago.js

### Markdown 编辑器

Markdown ，作为程序员，编写 Markdown 格式的文档已经是必会技能了，所以如果是为程序员开发的应用和网站，一定要支持 Markdown 功能。我在选择 Markdown 编辑器时踩了很多坑，最终才找到了这款好用的组件。

网址：https://pandao.github.io/editor.md/

### 表单验证：validator.js

这个组件我想大部分人都用过，因为无论时用户端，还是管理端前台开发验证都时必须的，无论是公司，还是个人。我都一直在使用这个验证插件。

网址:https://github.com/validatorjs/validator.js

### vue-draggable -Vue 拖拽组件

vue-draggable, 用于现在开发的应用都需要有移动端，所以拖拽操作越来越多了，它是我目前看到的基于 Vue 的最好拖拽组件。

网址：https://www.itxst.com/vue-draggable/tutorial.html

### Vue 生成二维码

vue-qr 如果你需要生成二维码，用这个组件绝对没错，公司的项目一直在使用，可以方便快捷的生成任何形式的二维码。包括彩色和自定义样式。

网址：https://www.npmjs.com/package/vue-qr

### Vue 图片剪裁

vue-cropper 无论开发任何应用，都需要用户上传图片。但又为了保持页面的一致性，所以要对上传的图片，安装设计规范，进行裁切。这时候你就可以使用这个组件了。

网址：https://github.com/xyxiao001/vue-cropper

### 图片懒加载

vue-lazyload 其实很多 UI 组件库已经有这个图片懒加载的给功能了，但是还是单独提出来一下，因为它不会和其它 Vue 组件库冲突，而且功能更多。

网址：https://www.npmjs.com/package/vue-lazyload

### Vue 上传组件

vue-simple-upload 上传也是我们绕不开的开发需求，所以你必须拥有一个完全好用的上传组件。它非常好用，但缺点是没有官方网站，只有一个 Github 地址。

网址：https://github.com/saivarunk/vue-simple-upload

### 神策打点

Web Js SDK https://manual.sensorsdata.cn/sa/latest/web-js-sdk-7548149.html

全埋点 https://manual.sensorsdata.cn/sa/latest/tech_sdk_client_web_all_use-34537687.html

**初始化**

```powershell
npm i sa-sdk-javascript
yarn add sa-sdk-javascript
```

```text
// 神策打点 - 初始化相关
import sensors from 'sa-sdk-javascript'

export const sensorsMonitor = (config = {}) => {
	const isDev = process.env.NODE_ENV === 'development'
	sensors.init({
		server_url: isDev ? 'https://salasa.xcreditech.com/sa' : 'https://salasa.xcreditech.com/sa?project=production',
		heatmap: {
			// 是否开启点击图，default 表示开启，
			// 自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
			clickmap: 'default',
			// 是否开启触达注意力图，not_collect 表示关闭，
			// 不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
			scroll_notice_map: 'default',
			track_attr: ['data-sa', 'data-sensors'] // 全埋点自定义属性
		},
		is_track_single_page: true, // 是否单页面
		show_log: isDev, //true - false
		app_js_bridge: true,
		batch_send: true,
		is_track_device_id: true // 收集神策is_track_device_id
	})

	sensors.registerPage({
		current_url: window.location.href
	})
	sensors.quick('autoTrack')
	return sensors
}

export const SaSdk = sensorsMonitor()
```

**使用**

https://blog.csdn.net/qq_41619796/article/details/112028163

- **公共属性埋点**：可在初始化 SDK 后，sensors.quick('autoTrack') 前，调用 **registerPage()**

- **事件埋点**：SDK 初始后，即可以通过 **_track()_** 方法追踪用户行为事件，并添加自定义属性：

  - ```typescript
    const SaSdk = sensorsMonitor() // 创建打点对象

    // 可以在点击按钮函数中引入，记录用户点击了多少次
    SaSdk.track('BuyProduct', {
    	ProductName: 'MacBook Pro',
    	ProductPrice: 123.45,
    	IsAddedToFav: false
    })
    ```

- **自动采集事件埋点**：**quick()**,主要用于主动触发页面浏览事件，一般只在页面配置后调用一次即可。

```typescript
import { sensorsMonitor } from '@/utils'
const SaSdk = sensorsMonitor() // 创建打点对象

// 不同的界面中初始化打点对象，创建属于自己的打点对象，多在mounted挂载中使用
sensorsInit() {
    SaSdk.registerPage({
        current_url: window.location.href,
        pagename: '界面名称',
        appName: this.state.appRules.appName,
    })

    SaSdk.quick('autoTrack')
    SaSdk.track('permission_open') // 界面打开记录一次
}
```

**vue**自定义指令埋点

```typescript
/**
 * 指令：v-saclick
 * 使用示例：v-saclick="{clickName:'XXX',clickData:{params1:'XXX',params2:'XX'}}"
 * clickName：埋点函数名
 * clickData | Object   params当前埋点函数所需参数
 */
const saclick = Vue.directive('saclick', {
	bind: (el, binding) => {
		el.addEventListener('click', () => {
			const clickName = binding.value.clickName // 携带的数据
			const data = binding.value.clickData || {} //接收传参
			sa.track(clickName, data)
		})
	}
})

export { preventReClick, saclick }
```

**具体需求**

[常用 sdk](https://manual.sensorsdata.cn/kbs/latest/page-7548140.html#id-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98-%E5%A6%82%E4%BD%95%E8%AE%BE%E7%BD%AE%E9%A1%B5%E9%9D%A2%E5%8A%A0%E8%BD%BD%E6%97%B6%E9%97%B4)

**记录界面加载时间**

```typescript
// 获取白屏时间
export const getWhiteTime = () => {
	const t = window.performance.timing
	// 记录白屏时间 ms
	return (t.domInteractive || t.domLoading) - t.fetchStart
}
```

## 四.移动端测试

**vConsole**和**eruda**

http://wmm66.com/index/article/detail/id/113.html

https://blog.csdn.net/qq_36570464/article/details/109271012

https://segmentfault.com/a/1190000017486643

谷歌浏览器手机调试

https://www.cnblogs.com/linx/p/7111959.html
