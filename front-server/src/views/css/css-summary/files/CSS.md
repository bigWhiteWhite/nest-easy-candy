# 谷歌字体

```html
<!-- 添加字体，link引入 -->
<link href="https://fonts.googlefonts.cn/css?family=Lato|Poppins:600i|Roboto:400,500i,700,700i" rel="stylesheet" />

<!-- 直接使用 SemiBold 600 Italic是字体风格 -->
font-family: 'Poppins', sans-serif; font-family: 'Poppins SemiBold 600 Italic', sans-serif;
```

# vue 和 sass

```vue
<!-- vue传值给sass -->
<template>
	<div :style="{ '--scssVar': scssVar, '--content': content }" :sass-data="content"> </div>
	<span :style="spanStyle" class="span1">hello world</span>
</template>

<script lang="ts">
setup() {
    const scssVar = '300px' // 有单位要加上单位
    const spanStyle = relative({ // 多个style属性
        '--color': 'red',
           'width': '300px'
    })
    // 变量值是作用在伪类before、after的content上时，一定要在值上多包一层双引号
    const content = "'我爱祖国'"
    // 使用style传递url
    imageUrl = ref(`url(...)`)
    // this.$refs.Ele.style.setProperty("--imageUrl",imageUrl)
    return {
        scssVar,
        content
    }
}
</script>
<style lang="scss" scoped>
$content: var(--content);
.home {
	width: var(--scssVar);
	&::after {
		content: $content;
		width: 20px;
		height: 20px;
	}
	&::before {
		content: attr(sass-data); /* 只生效于伪元素的content */
		width: 20px;
		height: 20px;
	}
}
</style>
```

## 主题切换

https://vueuse.org/core/useColorMode/#basic-usage

https://vueuse.org/core/useDark/

https://zoo.team/article/theme-scss

第三方库：https://darkmodejs.learn.uno/

原理，在 body 上添加 class，class 下的类会有属性,通过**改变 body 上的 class 来改变主题**,

vueuse 有持久化存储的功能

```vue
<template>
	<button @click="toggleDark">切换</button>
</template>
<script lang="ts">
import { useToggle, useDark } from '@vueuse/core'
const isDark = useDark({
	selector: 'body',
	attribute: 'class',
	valueDark: 'dark-theme',
	valueLight: 'light-theme'
})
const toggleDark = useToggle(isDark)
return {
	toggleDark
}
</script>
```

**scss**

```scss
$--light-theme: rgb(237, 211, 211) !default;
$--dark-theme: #000 !default;
$--btn-dark-color: #000
$--btn-light-color: white
.dark-theme {
    background: $--dark-theme;，
    .btn {
         color: $--btn-dark-color
    }
}
.light-theme {
    background: $--light-theme;
    .btn {
         color: $--btn-light-color
    }
}
```

# PxtoRem

```js
// yarn add postcss-pxtorem@5.1.1 -D
// 配置文件postcss.config.js
const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')

module.exports = () => {
	// 如果个别地方不想转化px。可以简单的使用大写的 PX 或 Px
	return {
		plugins: [
			autoprefixer(),
			pxtorem({
				rootValue: 37.5,
				propList: ['*'],
				minPixelValue: 2
			})
		]
	}
}
```

# DOM

- 获取元素位置宽高等信息

- getBoundingClientRect 方法返回元素的大小及其相对于视口的位置

  - 如果是标准盒子模型，元素的尺寸等于`width/height` + `padding` + `border-width`的总和。如果`box-sizing: border-box`，元素的的尺寸等于 `width/height`。
  - bottom top left right

  - width height

  - x y

  - 返回的结果是包含完整元素的最小矩形，并且拥有`left`, `top`, `right`, `bottom`, `x`, `y`, `width`, 和 `height`这几个以像素为单位的只读属性用于描述整个边框。除了`width` 和 `height` 以外的属性是相对于视图窗口的左上角来计算的。

    ![DOMRect 示例图](DOM.assets\rect.png)

**vue**

```js
// event
const { top } = event.target.getBoundingClientRect()
// ref ul是ref
const { top: parTop } = ul.value.getBoundingClientRect()
```

**react**

```js
const { top, height: hei } = event.target.getBoundingClientRect()
const { top: parTop } = ul.current.getBoundingClientRect()
```

```js
//<div ref="element"></div>
let height = this.$refs.element.offsetHeight
let height = parseInt(getComputedStyle(this.$refs.element).height) //只读，不可更改
let height = this.$refs.element.style.height //（非内联样式无法获取）
var fontSize = window.getComputedStyle(this.$refs.element, '::before').getPropertyValue('font-size')
//获取before伪元素的字号大小

textContent.replace(/\S/g, '<span>$&</span>') //替换标题里面的文字的标签
void h1.offsetWidth //当界面不重新计算的时候，强制界面重新计算
```

**属性**

https://segmentfault.com/a/1190000002405897

**event.clientX/Y**

- **clientX/Y**获取到的是触发点**相对浏览器可视区域左上角距离**，不随页面**滚动**而改变。兼容性：所有浏览器均支持

**event.pageX/Y**

- **pageX/Y**获取到的是触发点**相对文档区域左上角距离**，会**随着页面滚动**而改变兼容性：除 IE6/7/8 不支持外，其余浏览器均支持

**event.offsetX/Y**

- **offsetX/Y**获取到是**触发点相对被触发 dom 的左上角距离**，不过左上角基准点在不同浏览器中有区别，其中在 IE 中以内容区左上角为基准点不包括边框，如果触发点在边框上会返回负值，而 chrome 中以边框左上角为基准点。

  兼容性：IE 所有版本，chrome，Safari 均完美支持，Firefox 不支持

**event.layerX/Y**

- **layerX/Y**获取到的是触发点相对被触发 dom 左上角的距离，数值与 offsetX/Y 相同，这个**变量就是 firefox 用来替代 offsetX/Y 的**，基准点为边框左上角，**但是有个条件就是，被触发的 dom 需要设置为 position:relative 或者 position:absolut**e，否则会返回相对 html 文档区域左上角的距离。

  兼容性：IE6/7/8 不支持，opera 不支持，IE9/10 和 Chrome、Safari 均支持

**event.screenX/Y**

- **screenX/Y**获取到的是触发点相对显示器屏幕左上角的距离，不随页面滚动而改变。兼容性：所有浏览器均支持

**event.screenTop/screenLeft**

- screenLeft 和 screenTop 属性返回窗口相对于屏幕的 X 和 Y 坐标。火狐不支持，火狐请使用"window.screenX" 和 "window.screenY"。

**offset**

- `offsetWidth`/`offsetHeight`是「元素本身」的宽度/高度，并完整了**包含了边框 border、垂直滚动条 、padding**。
- `offsetTop`获得 HTML 元素距离上方或外层元素的位置,和 style.top 的区别是
  - offsetTop 只读，而 style.top 可读写。
  - offsetTop 返回的是数字，而 style.top 返回的是字符串，除了数字外还带有单位：px
  - 如果没有给 HTML 元素指定过 top 样式，则 style.top 返回的是空字符串

**client**

- `clientWidth`/`clientHeight`则是元素所包含的「子元素」的宽度/高度，其中包含了 padding，但**不包含边框 border、 垂直滚动条、margin**。

**scroll**

- `scrollWidth`/`scrollHeight`也是元素所包含的「子元素」的「完整」宽度和高度，其中包含了超出卷轴之外的部分的宽度与高度。在没有垂直滚动条的情况下，这个值就等于`clientWidth`/ `clientHeight`。

- **scrollTop**属性可以获取或设置一个元素的内容垂直滚动的像素数

  - ```js
    let top = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset
    ```

## 判断页面是否滚动到底部

```js
const scrollTop = document.body.scrollTop
const scrollHeight = document.body.scrollHeight
const clientHeight = document.body.clientHeight
if (scrollTop + clientHeight + 50 >= scrollHeight) {
	console.log('reach bottom')
}
```

## contextmenu

打开上下文菜单触发该事件，通常为鼠标右键点击触发。

如果想要实现右击鼠标不打开默认的浏览器菜单，可以通过`preventDefault()`取消默认行为实现。

监听鼠标右键的另一个方法：

```js
document.onmousedown = function (event) {
	if (event.button == 2) {
		//鼠标右键
	}
}
```

## Node.appendChild

[Node.appendChild - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/appendChild)

**`Node.appendChild()`** 方法将一个节点附加到指定父节点的子节点列表的末尾处。如果将被插入的节点已经存在于当前文档的文档树中，那么 `appendChild()` 只会将它从原先的位置移动到新的位置（不需要事先移除要移动的节点）。

这意味着，一个节点不可能同时出现在文档的不同位置。所以，如果某个节点已经拥有父节点，在被传递给此方法后，它首先会被移除，再被插入到新的位置。若要保留已在文档中的节点，可以先使用 [`Node.cloneNode()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/cloneNode) 方法来为它创建一个副本，再将副本附加到目标父节点下。请注意，用 `cloneNode` 制作的副本不会自动保持同步。

# Class 和 style

## style.setProperty

style.**setProperty(propertyName, value 可选, priority)**

- propertyName 必需。一个字符串，表示创建或修改的属性

- value 可选，**新的属性值** 。如果没有指定, 则当作空字符串。value **不能包含** "!important"，如果要包含应该使用 priority 参数.

- priority 可选，规定是否需要设置属性的优先级 important || undefined

```javascript
next.style.setProperty('--scale', 1 + scale * offset)

font-size: calc(6rem * var(--scale));//css计算属性

e.target.classList.toggle('pinned',(e.intersectionRatio<1))//给class中的pinned添加属性
```

## js 控制 Class

假如在程序运行的过程中，有一个 DOM 的样式改变很大，那么如果通过在 style 上面添加变量会显得很麻烦。

通过**js**来**控制 class**的改变，就可以间接控制一个复杂的样式。

```javascript
element.className = "className"                    //直接设定节点的类，覆盖其他的类
element.classList.add("className")                //添加新的类名，如已经存在，取消添加
element.classList.remove("className")            //移除已经存在的类名
element.classList.toggle("className")            //如果classList中存在给定的值，删除它，否则，添加它；
element.classList.replace("oldClassName"，"newClassName")    //类名替换
element.classList.contains("oldClassName")        //确定元素中是否包含指定的类名，返回值为true 、false；
```

## currentTarget 和 target

https://juejin.cn/post/6844904047913205767

当**点击页面的一个元素的时候**，事件会从这个**元素的祖先元素逐层传递下来**，这个过程成为`事件捕获`；

当**事件传递到这个元素之后**，又会把**事件逐成层传递回去**，直到根元素为止，这个阶段是事件的`冒泡阶段`。

event.target 指向**引起触发事件的元素**，而**event.currentTarget 则是事件绑定的元素**，

_只有被点击的那个目标元素的 event.target 才会等于 event.currentTarget_

```javascript
//当将相同的事件处理程序附加到多个元素时 event.currentTarget 就很有用。
li.addEventListener('click', (e) => {
	e.currentTarget.classList.add('loading')
})

//触发事件的对象 (某个DOM元素) 的引用。当事件处理程序在事件的冒泡或捕获阶段被调用时，它与event.currentTarget不同。
li.addEventListener('mousemove', (e) => {
	let item = e.target
})
```

## 动态修改伪元素属性

```javascript
//第一种
//html
<span :style="spanStyle" class="span1">hello world</span>
<span :style="{'--width': widthVar}" class="span2">hello earth</span>
//vue
data() {
    return {
        spanStyle: {
            "--color": "red"
        },
        bgStyle: {
        	'--bgUrl': `url(${this.meetUs.topBg})`
        }
        widthVar: "100px"
    };
}
//css
.span1 {
    color: var(--color);
}
.span2 {
    text-align: center;
    position: relative;
    width: var(--width);
}
.span2::after {
    width: var(--width);
    height: var(--width);
}
.container {
	&::after {
		content: ' ';
		background-image: var(--bgUrl);
	}
}


//第二种2
this.imageUrl = `url(...)`
this.$refs.lsc.style.setProperty("--imageUrl",this.imageUrl)
```

## 循环遍历变量

less 循环：https://www.jianshu.com/p/1d323b1dbfe0

```less
// 总数 起点数 y偏移值
.iconFn(@total, @index, @baseY) when(@index <= @total) {
	.icon-@{index} {
		.icon_bg(@baseY * @index);
	}
	.iconFn(@total, (@index + 1), @baseY);
}
.iconFn(6, 1, -95px);

// 10 - 32 次循环
.font(@i, @n) when (@i =< @n) {
	.font@{i} {
		font-size: @i + 0px !important;
	}
	.font((@i + 1), @n);
}

.font(10, 32);
```

```scss
// sass
$colors: (
	parent: transparent
);
@each $key, $value in $colors {
	.bg-#{$key} {
		background-color: $value; //.bg-parent --transparent
	}
}
@each $key in (red, blue) {
	.bg-#{$key} {
		background-color: $key; //.bg-red --red
	}
}
```

## 元素选择器

```scss
/* 多类选择器,中间没有空格,同时含有&(父类)，和user的元素 */
&.user {
	@include theme();
}

/*第一种方法：使用not选择器    :not(:first-child)*/
&:not(:first-child) {
	//不选择第一个
	background: red;
}
//不选择最后一个
&:not(:last-child) {
	border-bottom: 1px red solid;
}
/*选择最后一个边框为none*/
border-bottom: 1px red solid;
&:nth-last-child(1) {
	border-bottom: none;
}

/*第二种方法:使用nth-child选择器
* nth-child(n)匹配属于其父元素的第 n个子元素，不论元素的类型
* div:nth-child(n+2)，匹配到div的父元素的第2个及之后的子元素
*/
#od div:nth-child(n + 2) {
	background: red;
}

/*第三种方法：使用nth-of-type选择器
* 用法与nth-child选择器基本一致，唯一的区别是：nth-child选择器不论元素类型，nth-of-type选择器指定元素类型
* div:nth-of-type(n+2) ，匹配到div的父元素的第2个及之后的div子元素
*/
#od div:nth-of-type(n + 2) {
	background: red;
}

/*第四种方法：巧妙使用+兄弟选择符(选中的是相邻元素中的第二个)*/
#od div + div {
	background: red;
}
```

## root 全局变量

```scss
//!default如果变量已经被赋值，不会再被重新赋值，但是如果变量还没有被赋值，则会被赋予新的值。
$--color-primary: #409eff !default;
$--color-primary-light-1: mix($--color-whites, $--color-primary, 10%) !default;

/* 赋值给:root
------------------------------- */
:root {
	--color-primary: #{$--color-primary};
}

//在其他scss文件中直接调用
background-color: var(--color-primary);
```

**修改全局变量**

```js
nextTick(() => {
	document.getElementsByTagName('body')[0].style.setProperty('--color-primary', 'red')
})

nextTick(() => {
	const res = document.documentElement.style.getPropertyValue('--light-theme')
	console.log(res)
})
```

## 混合 mixin

```scss
//element-mixins.scss
@mixin Button($main, $c1, $c2) {
	color: set-color($main);
	background: set-color($c1);
	border-color: set-color($c2);
}
//调用
@import 'mixins/element-mixins.scss';
.el-button--default:focus {
	@include Button(primary, primary-light-8, primary-light-6);
}
```

## 函数调用

```scss
//function.scss
@function set-color($key) {
    @return var(--color-#{$key});
}

@import 'mixins/function.scss';
.el-button--text{
    color: set-color(primary-light-3);
}
// function less
.doc_theme(@hea_icon_bg:#eaf9e3) {
    color: @hea_icon_bg;
}

.home {
    .doc_theme(red)
}
```

## @exend 继承

```scss
.layout-lock-screen-fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.layout-lock-screen-mask {// sass继承
    background: rgba(255, 255, 255, 1);
    @extend .layout-lock-screen-fixed;
    z-index: 9999990;
}
// less继承，如果这个类没有被组件用到，那么就不会生效，推荐使用函数
.layout-lock-screen-mask {
    background: rgba(255, 255, 255, 1);
    &:extend(.layout-lock-screen-fixed);
    z-index: 9999990;
}
// less可以直接继承？
.layout-lock-screen-mask {// less继承
    .layout-lock-screen-fixed
}
```

## &

```scss
<div class='layout-lock-screen' > <div class='layout-lock-screen-date' > ... </div > </div > .layout-lock-screen {
	@extend .layout-lock-screen-fixed;
	z-index: 9999992;
	&-date {
		position: absolute;
		left: 0;
		top: 0;
	}
}
```

## calc

```scss
.work-main-height {
	height: calc(100% - 108.1px);
}
@mixin calcheight($height: 0px) {
	height: calc(100%-#{$height});
}
```

## 样式穿透

https://vue-loader.vuejs.org/zh/guide/scoped-css.html#%E6%B7%B1%E5%BA%A6%E4%BD%9C%E7%94%A8%E9%80%89%E6%8B%A9%E5%99%A8

**问题**

> 用到很多 vue 常用的组件库（element, vant, vuetify），虽然配好了样式但是还是需要更改其他的样式

**解决**

- 三大样式穿透 >>> , ::v-deep , /deep/

- 在 style 经常用 scoped 属性实现组件的私有化,所以才需要样式穿透

- 当使用**v-html**时也需要使用样式穿透来改变里面的样式

需要注意：

1. ( >>> 只作用于 css
2. ::v-deep 只作用于 sass
3. /deep/ 只作用于 less

示例：

```html
<!-- 写法1 使用::v-deep -->
<style lang="scss" scoped>
	::v-deep .el-input__inner {
		padding: 0 10px;
	}
</style>
```

```html
<!-- 写法3 使用/deep/ -->
<style lang="less" scoped>
	/deep/ .el-input__inner {
		padding: 0 10px;
	}
</style>
```

```html
<!-- 写法2 使用>>> 操作符-->
<style>
	.num-input {
		width: 90px;
		margin-top: 15px;
		>>> .ivu-input {
			text-align: center !important;
		}
	}
</style>
```

```vue
<!-- 写法4 使用:deep(<inner-selector>) 也有可能是双冒号-->
<style lang="scss" scoped>
:deep(.ant-card-head-title) {
	background: yellowgreen;
}
</style>
```

写法 1 和写法 4，都支持 sass 预处理器。但是在新的 vue3.0 单文件规范中，如果你还是使用写法 1，会碰到如下警告:

> **[@vue/compiler-sfc] `::v-deep` usage as a combinator has been deprecated. Use `:deep(<inner-selector>)` instead.**

写法 1 在 vue3.0 中已经被弃用了，以后小伙伴们在开发 vue3.0 项目的时候，还是使用写法 4 吧～，有一说一，写法 4 在语义上也更有助于理解。

关于写法 1 和写法 3，主要是不支持 sass 预处理器的解析，且`>>>`操作符存在浏览器兼容性问题

## Element

选择框之 popper-class 用法 https://blog.csdn.net/tsy_612/article/details/103407592

修改 elementui 的 el-popover 弹框的样式https://www.jianshu.com/p/da1cb7cd9455

```javascript
<img src="https://source.unsplash.com/900x600/?nature,water,1">
```

随机图片

# CSS 语法

## :target 伪类

**`:target`** [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) [伪类](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) 代表一个唯一的页面元素(目标元素)，其[`id`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes#attr-id) 与当前 URL 片段匹配

```html
<h3>Table of Contents</h3>
<ol>
	<li><a href="#p1">Jump to the first paragraph!</a></li>
	<li><a href="#p2">Jump to the second paragraph!</a></li>
	<li><a href="#nowhere">This link goes nowhere, because the target doesn't exist.</a></li>
</ol>
<h3>My Fun Article</h3>
<p id="p1">You can target <i>this paragraph</i> using a URL fragment. Click on the link above to try out!</p>
<p id="p2">This is <i>another paragraph</i>, also accessible from the links above. Isn't that delightful?</p>
```

```css
p:target {
	background-color: gold;
}

/* 在目标元素中增加一个伪元素*/
p:target::before {
	font: 70% sans-serif;
	content: '►';
	color: limegreen;
	margin-right: 0.25em;
}

/*在目标元素中使用italic样式*/
p:target i {
	color: red;
}
```

## outline 和 border

outline 不占页面空间，不会影响元素尺寸和位置，不能像 border 一样只设置某一边。

## attr()

https://developer.mozilla.org/zh-CN/docs/Web/CSS/attr()

**注意:** `attr()` 理论上能用于所有的 CSS 属性但目前支持的仅有伪元素的 [`content`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/content) 属性，其他的属性和高级特性目前是实验性的

CSS 表达式 `attr()` 用来获取选择到的元素的某一 HTML 属性值，并用于其样式。它也可以用于伪元素，属性值采用伪元素所依附的元素。

## :nth-of-type

## inset

The **`inset`** [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) property is a shorthand that corresponds to the [`top`](https://developer.mozilla.org/en-US/docs/Web/CSS/top), [`right`](https://developer.mozilla.org/en-US/docs/Web/CSS/right), [`bottom`](https://developer.mozilla.org/en-US/docs/Web/CSS/bottom), and/or [`left`](https://developer.mozilla.org/en-US/docs/Web/CSS/left) properties. It has the same multi-value syntax of the [`margin`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin) shorthand.

```
/* <length> values */
inset: 10px; /* value applied to all edges */
inset: 4px 8px; /* top/bottom left/right */
inset: 5px 15px 10px; /* top left/right bottom */
inset: 2.4em 3em 3em 3em; /* top right bottom left */
```

## pointer-events

`pointer-events`是一个用于 HTML 指针事件的属性，属性有很多值，但是对于浏览器来说，只有`auto`和`none`两个值可用，其它的几个是针对 SVG 的。

- auto——效果和没有定义 pointer-events 属性相同，鼠标不会穿透当前层。
- none——可以禁用 HTML 元素的 hover/focus/active 等动态效果，鼠标的动作将不能被该元素及其子元素所捕获，但是能够被其父元素所捕获。但是，当其后代元素的`pointer-events`属性指定其他值时，鼠标事件可以指向后代元素，在这种情况下，鼠标事件将在捕获或冒泡阶段触发父元素的事件侦听器。实际上默认就可以穿透当前层，因为 pointer-events 默认为 auto

若 HTML 上两个元素之间没有包含关系，那么，鼠标事件就不会在这两个元素之间传递，通常情况上层的元素会覆盖下层的元素，导致下层元素捕获不到事件；此时将上层元素的 `pointer-events` 属性设置为 `none` ，则上层元素将不捕获事件，那么事件将被下层元素捕获到；

### 使用场景

- 禁用 a 标签事件效果

在做 tab 切换的时候，当选中当前项，禁用当前标签的事件，只有切换其他 tab 的时候，才重新请求新的数据。

```html
<!--CSS-->
<style>
	.active {
		pointer-events: none;
	}
</style>
<!--HTML-->
<ul>
	<li><a class="tab"></a></li>
	<li><a class="tab active"></a></li>
	<li><a class="tab"></a></li> </ul
>复制代码
```

- 切换开/关按钮状态

点击提交按钮的时候，为了防止用户一直点击按钮，发送请求，当请求未返回结果之前，给按钮增加 pointer-events: none，可以防止这种情况，这种情况在业务中也十分常见。

```html
 <!--CSS-->
.j-pro{ pointer-events: none; }
<!--HTML-->
<button r-model={this.submit()} r-class={{"j-pro": flag}}>提交</button>
<!--JS-->
submit: function(){
　　this.data.flag = true;
　　this.$request(url, {
　　　　// ... onload: function(json){
　　　　　　　　if(json.retCode == 200){
　　　　　　　　　　this.data.flag = false;
　　　　　　　　} }.bind(this)
　　　　// ...
　　});
}
```

- 防止透明元素和可点击元素重叠不能点击

一些内容的展示区域，为了实现一些好看的 css 效果，当元素上方有其他元素遮盖，为了不影响下方元素的事件，给被遮盖的元素增加 pointer-events: none; 可以解决。

## p 元素嵌套

p 标签虽然是块级元素，但不可包含其他块级元素。像 p 标签 <h1 ~ 6>标签 这几个块元素只可包含内联元素（行内元素）, 所以 p 标签无法嵌套 p div ul 标签

p 标签在遇到下一个块级元素时就闭合，在浏览器中会被渲染为两倍数量的 p 元素

## pre 标签

pre 标签可定义预格式化的文本。被包围在 <pre> 标签 元素中的文本通常会**保留空格和换行符**。而文本也会呈现为等宽字体。

**提示:** <pre> 标签的一个常见应用就是用来表示计算机的源代码。

```javascript
object-fit: cover;//对图片进行剪切，保留原始比例：
filter: blur(3px);//给图像设置高斯模糊
```

## 背景虚化

```css
/*普通虚化 这样写会使整个div的后代模糊并且还会出现白边，导致页面非常不美观，要想解决这个问题，我们可以使用伪元素，因为伪元素的模糊度不会被父元素的子代继承*/
background: url('./bg.jpg') no-repeat fixed;
background-size: cover;
box-sizing: border-box;
filter: blur(2px);
/*伪元素虚化*/
.first-bg {
	position: relative;
	background: url('http://www.haokanhaokan.com/asset/image/bg1.jpg') no-repeat fixed;
	background-size: cover;
	box-sizing: border-box;
	&::after {
		background: inherit;
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		filter: blur(2px);
		z-index: 1;
	}
}
/*局部元素模糊  哪个元素需要模糊就使用它的伪元素*/
.content {
	position: relative;
	width: 200px;
	height: 200px;
	background: inherit;
	z-index: 2;
}
.content:after {
	content: '';
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	top: 0;
	background: inherit;
	filter: blur(15px);
	/*为了模糊更明显，调高模糊度*/
	z-index: 3;
}
/*局部元素清晰，其他的虚化*/
```

## 图片图标更换颜色

https://juejin.cn/post/6844903682010513415

有的时候图片只是一个单色图标，不可以通过 color 或者背景改变颜色，可以使用以下方法

```css
.title_img {
	transform: translateX(9999px);
	filter: drop-shadow(-9999px 0 0 #4444dd);
}
```

# CSS 面试题

## 选择器优先级

| 选择器类别                         | 权重   |
| ---------------------------------- | ------ |
| 内联样式                           | 1000   |
| ID 选择器                          | 100    |
| 类、伪类选择器；属性选择器         | 10     |
| 元素选择器；子代选择器；相邻选择器 | 0      |
| 继承的样式                         | 无权值 |

```
权重计算规则：
1、第一等：代表内联样式，如: style=””，权值为1000。
2、第二等：代表ID选择器，如：#content，权值为0100。
3、第三等：代表类，伪类和属性选择器，如.content，权值为0010。
4、第四等：代表类型选择器和伪元素选择器，如div p，权值为0001。
5、通配符、子选择器、相邻选择器等的。如*、>、+,权值为0000。
6、继承的样式没有权值。
后代、子代选择器权值相加
权值相同时，以后定义的选择器为主
选择器权值计算不会超过自己的最大数量级
```

## line-height

```
normal
```

取决于用户端。桌面浏览器（包括 Firefox）使用默认值，约为`1.2`，这取决于元素的 `font-family`。

```
<数字>
```

该属性的应用值是这个无单位数字[`<数字>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/number)乘以该元素的字体大小。计算值与指定值相同。大多数情况下，这是设置`line-height`的**推荐方法**，不会在继承时产生不确定的结果。

```
<长度>
```

指定[`<长度>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/length)用于计算 line box 的高度。参考[`<长度>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/length)了解可使用的单位。以 **em** 为单位的值可能会产生不确定的结果。

```
<百分比>
```

与元素自身的字体大小有关。计算值是给定的百分比值乘以元素计算出的字体大小。**百分比**值可能会带来不确定的结果。

## 水平垂直居中

仅居中元素定宽高适用

- absolute + 负 margin
- absolute + margin auto
- absolute + calc

居中元素不定宽高

- absolute + transform
- lineheight
- css-table
- flex
- grid

1. absolute + 负 margin 宽高确定，父容器`position:relative`，子元素`position:absolute`

```html
<body>
	<div class="box">珠峰培训</div>
</body>

// 宽高确定
<style>
	html,
	body {
		height: 100%;
		overflow: hidden;
	}

	.box {
		box-sizing: border-box;
		width: 100px;
		height: 50px;
		line-height: 48px;
		text-align: center;
		font-size: 16px;
		border: 1px solid lightblue;
		background: lightcyan;
	}

	body {
		position: relative;
	}

	.box {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -25px;
		margin-left: -50px;
	}
</style>
```

2. absolute + margin auto 宽高必须有，子元素`top: 0;bottom: 0;left: 0;right: 0;margin: auto;`

```html
<body>
	<div class="box">珠峰培训</div>
</body>
<style>
	html,
	body {
		height: 100%;
		overflow: hidden;
	}

	.box {
		box-sizing: border-box;
		width: 100px;
		height: 50px;
		line-height: 48px;
		text-align: center;
		font-size: 16px;
		border: 1px solid lightblue;
		background: lightcyan;
	}

	body {
		position: relative;
	}

	.box {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
	}
</style>
```

3. absolute + calc

```html
<body>
	<div class="box">珠峰培训</div>
</body>
// 宽高确定
<style>
	html,
	body {
		height: 100%;
		overflow: hidden;
	}

	.box {
		box-sizing: border-box;
		width: 100px;
		height: 50px;
		line-height: 48px;
		text-align: center;
		font-size: 16px;
		border: 1px solid lightblue;
		background: lightcyan;
	}

	body {
		position: relative;
	}

	.box {
		position: absolute;
		top: calc(50% - 50px);
		left: calc(50% - 25px);
	}
</style>
```

4. absolute + transform 无视宽高

```html
<body>
	<div class="box">珠峰培训</div>
</body>
<style>
	html,
	body {
		height: 100%;
		overflow: hidden;
	}

	.box {
		box-sizing: border-box;
		/* width: 100px; */
		/* height: 50px; */
		line-height: 48px;
		text-align: center;
		font-size: 16px;
		border: 1px solid lightblue;
		background: lightcyan;
	}

	body {
		position: relative;
	}

	.box {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
```

5. lineheight

把 box 设置为行内元素，通过`text-align`就可以做到水平居中，通过`vertical-align`在垂直方向做到居中，代码如下

```html
<div class="wp">
	<div class="box">123123</div>
</div>
<style>
	.wp {
		line-height: 300px;
		text-align: center;
		font-size: 0px;
	}
	.box {
		font-size: 16px;
		display: inline-block;
		vertical-align: middle;
		line-height: initial;
		text-align: left; /* 修正文字 */
	}
</style>
```

6. css-table

```html
<style>
	.wp {
		line-height: 300px;
		text-align: center;
		font-size: 0px;
	}
	.box {
		font-size: 16px;
		display: inline-block;
		vertical-align: middle;
		line-height: initial;
		text-align: left; /* 修正文字 */
	}</style
><div class="wp">
	<div class="box">123123</div>
</div>
<style>
	.wp {
		display: table-cell;
		text-align: center;
		vertical-align: middle;
	}
	.box {
		display: inline-block;
	}
</style>
```

7. flex

```html
<div class="wp">
	<div class="box">123123</div>
</div>
<style>
	.wp {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
```

8. grid

## 容器宽高等比例

> 原理: padding 的百分比计算是根据父元素的宽度来计算。

内容写在`.child::after`伪类元素中

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<style>
			.parent {
				height: 100px;
				width: 100px;
				background-color: lightseagreen;
			}
			.child {
				height: 0;
				/* 高度为宽度的50% */
				padding-bottom: 50%;
				position: relative;
			}
			.child::before {
				display: block;
				content: '宽高2:1';
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				background-color: red;
			}
		</style>
	</head>
	<body>
		<div class="parent">
			<div class="child"></div>
		</div>
	</body>
</html>
```

## display、visibility、opacity 的区别

| **比较** | **display:none** | **opacity:0** | **visibility:hidden** |
| --- | --- | --- | --- |
| **占据空间** | **否** | **是** | **是** |
| **回流与渲染** | **是** | **否** | **否** |
| **子代继承性** | **不继承** | **继承，并且子元素 不能通过 opacity: 1; 来取消隐藏** | **继承子元素可以通过设置 visibility: visible;来取消隐藏** |
| **子代反继承** | **否** | **否** | **能** |
| **transition 效果** | **无效** | **有效** | **hidden 有效，visible 立即显示** |
| **绑定的事件** | **不响应** | **能响应** | **不响应** |

**继承性和反继承性**

所谓继承，都是指子代继承父代的东西。反继承就是子代设置自己的属性变得和父代不一样。

很多时候，我们要让一个元素保留位置的同时不触发绑定在这个元素上的事件，此时要结合 visibility、opacity、transition 一起用才能实现这样的效果。（不得不说 opacity 和 visibility 结合了使用，使得同一个元素产生淡进淡出的效果很好用）。如下：

```css
div {
	visibility: hidden;
	opacity: 0;
	transition: all 0.5s;
}
div:hover {
	visibility: visible;
	opacity: 1;
}
```

## BFC

当 CSS 的 **position** 属性为 **static** 或 **relative**，并且 **float** 为 **none** 时，其布局方式为普通流。

独立渲染区域

创建 BFC 的方式：

1. float 不为 none（float 默认为 none）
2. position 值为 absoluted、fixed（没有 relative、static）
3. display 值为 inline-block、table-cell、flex、flow-root
4. overflow 值为 hidden、auto、scroll（除了 visible？）

能解决什么问题：

1. 边距重叠
2. 边距溢出、盒子塌陷
3. 清除浮动
4. 浮动环绕文字（现象的原因是文本信息不会被浮动元素所覆盖）

# js 语法

```javascript
rectObject = object.getBoundingClientRect() //返回元素的大小及其相对于视口的位置
Math.abs(x) //函数返回指定数字 “x“ 的绝对值
let prev = item.previousElementSibling || null //返回当前节点的前一个兄弟节点,没有则返回null.
let next = item.nextElementSibling || null //返回当前节点的后一个兄弟节点,没有则返回null.

//设定一个阈值，用这个阈值监听元素是否超过这个阈值
const observer = new IntersectionObserver(
	([e]) => {
		isPinned = e.intersectionRatio < 1
		e.target.classList.toggle('pinned', e.intersectionRatio < 1)
	},
	{ threshold: [1] }
) //规定了一个监听目标与边界盒交叉区域的比例值
observer.observe(h2) //监听sticky被触发
```

## 当滚轮不在顶部时

```vue
<!-- v-scroll是自定义指令 -->
<div id="app" v-scroll="handleScroll"></div>
<script>
// methods
handleScroll() {
    if (scrollTimer) { // data -> scrollTimer: null
        clearTimeout(scrollTimer)
    }

    scrollTimer = setTimeout(() => {
        if (window.scrollY <= 1) {
            this.fixClass = '';
        } else {
            this.fixClass = 'fix-header';
        }
    }, 80)
}
</script>
```

## js 配合媒体查询控制元素

**没有交互只是当宽度变化显隐**的元素可以直接使用**css 媒体查询**

```vue
<template>
	<nav class="site-nav">
		<el-button icon="el-icon-menu" @touchend.native="handleOpen" @click="handleOpen"> </el-button>

		<ul v-show="showNav" aria-expanded="false" class="nav-menu">
			<li
				class="page_item"
				v-for="(item, index) in navList"
				:key="index"
				:class="{ current_page_item: isLoacalPath(item.url) }"
				@click.stop="handleClick"
			></li>
		</ul>
	</nav>
</template>

<script>
export default {
    data() {
        showEl: false,
        clientWidth: 600
    },
    mounted() {
        this.init()
        window.addEventListener('resize', () => {
            this.init()
        }, false)
    },
    computed: {
        bodyWidth() { // 实时获取最新的屏幕宽度
            return this.clientWidth
        }
    },
    methods: {
        init() {
            this.showEl = document.body.clientWidth > 600 // 元素大于600px才显示
            this.clientWidth = document.body.clientWidth // 可以使用vueUse库获取
        },
        handleOpen(evt) { // 移动端打开下拉菜单
          window.event? window.event.cancelBubble = true : evt.stopPropagation();

          if (this.timer) {
            clearTimeout(this.timer)
          }

          this.timer = setTimeout(() => { // 简单的防抖，防止用户疯狂点击
            this.showNav = !this.showNav;
          }, 300)
        },
        handleClose () {
          if (this.bodyWidth > 600) return
          this.showNav = false;
        },
        handleClick () {
          if (this.bodyWidth <= 600) {
            this.showNav = false;
          }
        }
    }
}
</script>

<style></style>
```

# Canvas

## 概述

```html
<canvas width="400" height="500" id="mycanvas"> 当前浏览器版本不支持，请升级浏览器 </canvas>
```

> canvas 的标签属性只有两个，width 和 height.。表示的是 canvas 画布的宽度和高度。注意 canvas 的 width 和 height 不要用 css 的样式来设置，如果使用 css 的样式来设置，画布会失真，会变形 标签对儿里面的文字是用来提示低版本浏览器 (IE6/7/8)

```html
<canvas width="500" height="400" id="mycanvas"> 当前浏览器版本不支持,请升级浏览器 </canvas>
<script>
	// 得到canvas的画布
	var canvas = document.getElementById('mycanvas')
	// 得到画布的上下文, 2D的上下文和3D的上下文
	// 所有图像绘制都通过ctx属性或方法绘制,与标签无关
	var ctx = canvas.getContext('2d')
	// 设置颜色
	ctx.fillStyle = 'green'
	// 绘制矩形
	ctx.fillRect(100, 100, 200, 50)
	console.log(ctx)
	console.log(canvas)
</script>
```

### canvas 的像素化

> 使用 canvas 绘制了一个图形，一旦绘制成功了，canvas 就像素化了他们。 canvas 没有能力，从画布上再次得到这个图形，也就是说我们没有能力去修改已经在画布上的内容。这个就是 canvas 比较轻量的原因，Flash 重的原因之一就有它可以通过对应的 api 得到已经上 “画布” 的内容然后再次绘制，如果我们想要让这个 canvas 图形移动，必须按照清屏 - 更新 - 渲染的逻辑进行编程，总之就是重新再画一次

```JavaScript
var canvas=document.getElementById("mycanvas");
var ctx=canvas.getContext("2d")
ctx.fillStyle="blue"
// 设置信号量
var left=10;
setInterval(()=>{
    //清除画布
    ctx.clearRect(0,0,700,600)
    // 更新信号量
    left++;
    ctx.fillRect(left,left,100,100)
    if(left==700){
        left=10
    }
},4)
```

### 面向对象

因为 canvas 不能得到已经上屏的对象，所以我们要维持对象的状态。在 canvas 动画中，我们都使用面向对象来进行编程，因为我们可以使用面向对象的方式来维持 canvas 需要的属性和状态

```js
// 获取画布
var can = document.getElementById('can')
var ctx = can.getContext('2d')
// 绘制方法
function Rect(x, y, w, h, color) {
	this.x = x
	this.y = y
	this.w = w
	this.h = h
	this.color = color
}
// 更新方法
Rect.prototype.update = function () {
	this.x++
}
// 渲染
Rect.prototype.render = function () {
	// 设置颜色
	ctx.fillStyle = this.color
	// 渲染
	ctx.fillRect(this.x, this.y, this.w, this.h)
}
// 实例化
var r1 = new Rect(100, 100, 50, 50, '#91d5ff')
// 动画过程
setInterval(() => {
	//清屏
	ctx.clearRect(0, 0, can.width, can.height)
	//更新
	r1.update()
	// 渲染
	r1.render()
}, 5)
```

## 绘制功能

| 方法 / 属性                  | 描述                                             |
| ---------------------------- | ------------------------------------------------ |
| fillStyle                    | 设置填充颜色                                     |
| fillRect(x,y,width,height)   | 方法绘制 “已填色” 的矩形。默认的填充颜色是黑色。 |
| strokeStyle                  | 设置边框颜色                                     |
| strokeRect(x,y,width,height) | 方法绘制矩形边框。默认的填充颜色是黑色。         |
| clearRect(x,y,width,height)  | 清除画布内容                                     |
| globalAlpha                  | 设置透明度 0-1                                   |

### 绘制路径

```js
// 创建路径
ctx.beginPath()
// 移动绘制点
ctx.moveTo(100, 100)
// 描述行进路径
ctx.lineTo(200, 300)
ctx.lineTo(300, 230)
ctx.lineTo(440, 290)
ctx.lineTo(380, 50)
// 封闭路径
ctx.closePath()
// 设置颜色
ctx.strokeStyle = '#91d5ff'
// 绘制不规则图形
ctx.stroke()
// 填充不规则图形
ctx.fill()
```
