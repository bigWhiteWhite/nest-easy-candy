# Mixins

## 基本使用

```scss
@import './mixins';
.textOverflow {
	@include textOverflow;
}
```

## 第三方图标设置

```scss
.generalIcon {
	font-size: 14px !important;
	display: inline-block;
	vertical-align: middle;
	margin-right: 5px;
	width: 24px;
	text-align: center;
}
```

## [白色按钮](https://juejin.cn/post/7129788202335862791)

```less
<div id='btnWrapper' > <div class='btn active' > 开灯</div > <div class='btn' > 关灯</div > </div > * {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
body {
	background-color: #edf1f4;
	perspective: 500px;
	--c-wrap-shadow1: #f5f9fd;
	--c-wrap-shadow2: #d8dbe5;
	--c-wrap-bg: #e2e6eb;
	--c-btn-shadow1: #d9dbe6;
	--c-btn-shadow2: #f5f9fd;
	--c-txt1: #aaa;
	--c-txt2: #111;
	transition: background-color 0.4s linear;
}
.dark {
	background-color: #333;
	--c-wrap-shadow1: #292929;
	--c-wrap-shadow2: #202020;
	--c-wrap-bg: #505050;
	--c-btn-shadow1: #323232;
	--c-btn-shadow2: #444;
	--c-txt1: #888;
	--c-txt2: #fff;
}
#btnWrapper {
	position: relative;
	width: 380px;
	height: 80px;
	padding: 12px 16px;
	margin: 300px auto 0;
	border-radius: 12px;
	overflow: hidden;
	background-color: var(--c-wrap-bg);
	box-shadow: -10px -10px 15px var(--c-wrap-shadow1), 10px 10px 15px var(--c-wrap-shadow2);
	transform-origin: var(--wraper-origin);
	transition: transform 0.4s cubic-bezier(0, 0, 0.48, 1), box-shadow 0.4s linear, background-color 0.4s linear;
}
.rotateWrap {
	transform: rotateY(var(--wraper-rotate));
}
#btnWrapper::before {
	content: '';
	position: absolute;
	left: var(--groove-left);
	top: 12px;
	width: calc(50% - 16px - 8px);
	height: calc(100% - 24px);
	border-radius: 12px;
	box-shadow: inset 8px 8px 6px var(--c-btn-shadow1), inset -5px -5px 15px var(--c-btn-shadow2), inset -5px -5px 15px var(--c-btn-shadow2), inset 7px
			7px 6px var(--c-btn-shadow1);
	transition: left 1s cubic-bezier(0.82, 0.12, 0.18, 0.88), box-shadow 0.4s linear;
}
.btn {
	float: left;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 50%;
	height: 100%;
	padding: inherit;
	color: var(--c-txt1);
	transition: color 0.4s linear;
	animation: txtOutScale 0.6s linear;
	cursor: pointer;
}
.active {
	color: var(--c-txt2);
	transform: scale(1.1);
	animation: txtEnterScale 0.4s linear;
}
@keyframes txtEnterScale {
	0% {
		transform: scale(1);
	}

	80% {
		transform: scale(1.15);
	}

	100% {
		transform: scale(1.1);
	}
}
@keyframes txtOutScale {
	0% {
		transform: scale(1.1);
	}

	80% {
		transform: scale(0.95);
	}

	100% {
		transform: scale(1);
	}
}
```

```js
let wrapper = document.getElementById('btnWrapper')
wrapper.style.setProperty('--groove-left', '12px')
let btns = document.getElementsByClassName('btn')
for (let i = 0; i < btns.length; i++) {
	btns[i].addEventListener('click', function (e) {
		ThemeChange(i === 1)
		resetBtn(btns)
		wrapper.style.setProperty('--groove-left', `calc(12px + ${i * 50}%)`)
		wrapper.style.setProperty('--wraper-origin', `${i === 0 ? '75% top' : '25% top'}`)
		wrapper.style.setProperty('--wraper-rotate', `${i === 0 ? -8 : 8}deg`)
		wrapper.className = 'rotateWrap'
		setTimeout(() => {
			btns[i].className = 'btn active'
		}, 500)
		setTimeout(() => {
			wrapper.className = ''
		}, 550)
	})
}
// 重置按钮类名
function resetBtn(btns) {
	for (let i = 0; i < btns.length; i++) {
		setTimeout(() => {
			btns[i].className = 'btn'
		}, 100)
	}
}
// 改变主题
function ThemeChange(bol) {
	let body = document.body
	body.className = bol ? 'dark' : ''
}
```

## 文本溢出处理

### 文本不换行

```scss
.text-no-wrap {
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
```

### 多行文本溢出

设定为多少行，就在最后一行显示省略号

```scss
@mixin text-ellipsis($line: 2) {
	overflow: hidden;
	word-break: break-all;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: $line;
	-webkit-box-orient: vertical;
}
```

### 文本显示省略号

```scss
@mixin textOverflow($width: 100%, $display: block) {
	width: $width;
	display: $display;
	white-space: nowrap;
	-ms-text-overflow: ellipsis;
	text-overflow: ellipsis;
	overflow: hidden;
}
```

## 清除浮动

```scss
@mixin clearfix {
	&:after {
		clear: both;
		content: '.';
		display: block;
		height: 0;
		line-height: 0;
		overflow: hidden;
	}
	*height: 1%;
}
```

## 弹性盒子

（传入 null 不设置该属性）

```scss
@mixin flexBox($direction: row, $justify: null, $align: null, $flex-wrap: null) {
	display: flex;
	@if ($direction!=null) {
		flex-direction: $direction;
	}
	@if ($justify!=null) {
		justify-content: $justify;
	}
	@if ($align!=null) {
		align-items: $align;
	}
	@if ($flex-wrap != null) {
		flex-wrap: $flex-wrap;
	}
}
```

## 绝对定位

参数顺序：上右下左

```scss
@mixin positionAbsolute($top: null, $right: null, $bottom: null, $left: null) {
	position: absolute;
	@if ($left!= '' & & $left!=null) {
		left: $left;
	}
	@if ($right!= '' & & $right!=null) {
		right: $right;
	}
	@if ($top!= '' & & $top!=null) {
		top: $top;
	}
	@if ($bottom!= '' & & $bottom!=null) {
		bottom: $bottom;
	}
}
```

## 浮动

### 左浮动

```scss
@mixin float-left($width: 19%, $margin-right: 1.2%) {
	width: $width;
	float: left;
	@if ($margin-right!=null) {
		margin-right: $margin-right;
	}
}
```

### 右浮动

```scss
@mixin float-Right($width: 19%, $margin-left: 1.2%) {
	width: $width;
	float: right;
	@if ($margin-left!=null) {
		margin-left: $margin-left;
	}
}
```

## 渐变

从上到下

```scss
@mixin linear-gradient($direction: bottom, $color1: transparent, $color2: #306eff, $color3: transparent) {
	//background: -webkit-linear-gradient($direction,$colorTop, $colorCenter, $colorBottom); /* Safari 5.1 - 6.0 */
	background: -o-linear-gradient($direction, $color1, $color2, $color3); /* Opera 11.1 - 12.0 */
	background: -moz-linear-gradient($direction, $color1, $color2, $color3); /* Firefox 3.6 - 15 */
	background: linear-gradient(to $direction, $color1, $color2, $color3); /* 标准的语法 */
}
```

## 行高

```scss
@mixin line-height($height: 30px, $line-height: 30px) {
	@if ($height != null) {
		height: $height;
	}
	@if ($line-height!=null) {
		line-height: $line-height;
	}
}
```

## 滑动高亮

```less
.q-loading-2-inner {
	font-weight: bold;
	/* 这里可以随意加样式 */

	background: #fff linear-gradient(-135deg, transparent 25%, transparent 40%, rgba(3, 194, 205, 0.3) 40%, /* 这两个值是滑动条的颜色 */ rgba(
					3,
					194,
					205,
					0.3
				) 60%, /* 默认是绿色 自己更改即可 */ transparent 60%, transparent);
	background-size: 60px 60px;
	background-repeat: no-repeat;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	animation: scratchy 3s linear infinite;
}

@keyframes scratchy {
	0% {
		background-position: -100% 0;
	}
	100% {
		background-position: 130% 0;
	}
}
```

## 画三角形

**实心三角形**

```scss
@mixin triangle($width: 10px, $direction: top, $color: $bgBlueLight) {
	border: $width solid transparent;
	@if ($direction == top) {
		// 上三角
		border-bottom-color: $color;
	}
	@if ($direction == bottom) {
		// 下三角
		border-top-color: $color;
	}
	@if ($direction == left) {
		// 左三角
		border-right-color: $color;
	}
	@if ($direction == right) {
		// 右三角
		border-left-color: $color;
	}
}
```

**空心三角形**

```less
.triangle-line {
	position: absolute;
	top: -11px;
	right: 24px;
	z-index: 999;
	height: 0px;
	width: 0px;
	border-left: 7px solid transparent;
	border-right: 7px solid transparent;
	border-bottom: 10px solid rgba(80, 80, 80, 0.1);
}
.triangle-line::after {
	content: '.';
	position: absolute;
	top: 3px;
	right: -5px;
	z-index: 999;
	height: 0px;
	width: 0px;
	border-left: 5px solid transparent;
	border-right: 5px solid transparent;
	border-bottom: 8px solid rgba(255, 255, 255, 1);
}
```

**有边框的三角形**

```less
<!--向上的三角形--
	> <div
	class='border-up'
	> <span
	> </span
	> </div
	> <!--向下的三角形--
	> <div
	class='border-down'
	> <span
	> </span
	> </div
	> <!--向左的三角形--
	> <div
	class='border-left'
	> <span
	> </span
	> </div
	> <!--向右的三角形--
	> <div
	class='border-right'
	> <span
	> </span
	> </div
	> .border-up {
	width: 0;
	height: 0;
	border-left: 30px solid transparent;
	border-right: 30px solid transparent;
	border-bottom: 30px solid #333;
	position: relative;
	margin: 50px auto;
}
.border-up span {
	display: block;
	width: 0;
	height: 0;
	border-left: 28px solid transparent;
	border-right: 28px solid transparent;
	border-bottom: 28px solid #f0981c;
	position: absolute;
	left: -28px;
	top: 1px;
}
.border-down {
	width: 0;
	height: 0;
	border-left: 30px solid transparent;
	border-right: 30px solid transparent;
	border-top: 30px solid #333;
	position: relative;
	margin: 50px auto;
}
.border-down span {
	display: block;
	width: 0;
	height: 0;
	border-left: 28px solid transparent;
	border-right: 28px solid transparent;
	border-top: 28px solid #f0981c;
	position: absolute;
	left: -28px;
	top: -29px;
}
.border-left {
	width: 0;
	height: 0;
	border-bottom: 30px solid transparent;
	border-right: 30px solid #333;
	border-top: 30px solid transparent;
	position: relative;
	margin: 50px auto;
}
.border-left span {
	display: block;
	width: 0;
	height: 0;
	border-bottom: 28px solid transparent;
	border-right: 28px solid #f0981c;
	border-top: 28px solid transparent;
	position: absolute;
	left: 1px;
	top: -28px;
}
```

## 文本阴影

```scss
@mixin text-show($h-shadow: 0px, $v-shadow: 0px, $blur: 10px, $color: rgba(0, 180, 255, 0.7)) {
	text-shadow: $h-shadow $v-shadow $blur $color;
}
```

## 链接样式

```scss
@mixin hoverStyle(
	$style: (
		color: #d9fdff
	),
	$hoverStyle: (
		color: #306eff
	)
) {
	text-decoration: none;
	@each $key, $value in $style {
		#{$key}: #{$value};
	}
	@if ($hoverStyle!=null & & $hoverStyle!= '') {
		&:hover {
			@each $key, $value in $hoverStyle {
				#{$key}: #{$value};
			}
		}
	}
}
```

## 滚动条样式

```scss
@mixin scrollBar($width: 10px, $height: 10px, $outColor: $bgColor, $innerColor: $bgGrey, $radius: 5px, $shadow: null) {
	/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
	&::-webkit-scrollbar {
		width: $width;
		height: $height;
		background-color: $outColor;
	}

	/*定义滚动条轨道 内阴影+圆角*/
	&::-webkit-scrollbar-track {
		@if ($shadow!=null) {
			-webkit-box-shadow: $shadow;
		}
		@if ($radius!=null) {
			border-radius: $radius;
		}
		background-color: $outColor;
	}

	/*定义滑块 内阴影+圆角*/
	&::-webkit-scrollbar-thumb {
		@if ($shadow!=null) {
			-webkit-box-shadow: $shadow;
		}
		@if ($radius!=null) {
			border-radius: $radius;
		}
		background-color: $innerColor;
		border: 1px solid $innerColor;
	}
}
```

## css3 动画

```scss
@mixin animation(
	$from: (
		width: 0px
	),
	$to: (
		width: 200px
	),
	$name: mymove,
	$animate: mymove 2s 1 linear infinite
) {
	-webkit-animation: $animate;
	-o-animation: $animate;
	animation: $animate;
	@keyframes #{$name} {
		from {
			@each $key, $value in $from {
				#{$key}: #{$value};
			}
		}
		to {
			@each $key, $value in $to {
				#{$key}: #{$value};
			}
		}
	}

	@-webkit-keyframes #{$name} {
		from {
			@each $key, $value in $from {
				$key: $value;
			}
		}
		to {
			@each $key, $value in $to {
				$key: $value;
			}
		}
	}
}
```

## 圆形盒子

```scss
@mixin circle($size: 11px, $bg: #fff) {
	border-radius: 50%;
	width: $size;
	height: $size;
	line-height: $size;
	text-align: center;
	background: $bg;
}
```

## placeholder

```scss
@mixin placeholder($color: #bbb) {
	// Firefox
	&::-moz-placeholder {
		color: $color;
		opacity: 1;
	}
	// Internet Explorer 10+
	&:-ms-input-placeholder {
		color: $color;
	}
	// Safari and Chrome
	&::-webkit-input-placeholder {
		color: $color;
	}

	&:placeholder-shown {
		text-overflow: ellipsis;
	}
}
```

## 背景透明度

```scss
@mixin bg-opcity($url: none, $opacity: 0.85, $z-index: 0) {
	position: relative;
	z-index: $z-index;
	&::before {
		content: ' ';
		opacity: $opacity;
		background-image: url($url);
		background-repeat: no-repeat;
		background-size: cover;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		position: absolute;
		z-index: -1;
	}
}
```

## 背景颜色透明度

```scss
@mixin bg-color-opcity($position: realtive, $color: black, $opacity: 0.85, $z-index: -1) {
	position: $position;
	z-index: $z-index;
	&::before {
		content: ' ';
		opacity: $opacity;
		background-color: $color;
		background-repeat: no-repeat;
		background-size: cover;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		position: absolute;
		z-index: -1;
	}
}
```

## 输入框从右至左变长

```css
input {
	width: 10px;
	transition: all .3s
	&:focus {
		width: 200px;
	}
}
/*
* 对input使用float:right
* 或者将input使用flex布局，jus： flex-end
*/
```

# 特定样式

## 全局变量 var

```scss
/* 定义初始颜色
------------------------------- */
$--color-primary: #409eff !default;
$--color-whites: #ffffff !default;
$--color-blacks: #000000 !default;
$--color-primary-light-1: mix($--color-whites, $--color-primary, 10%) !default;

$--color-success: #67c23a !default;
$--color-success-light-1: mix($--color-whites, $--color-success, 10%) !default;

$--color-info: #909399 !default;
$--color-info-light-1: mix($--color-whites, $--color-info, 10%) !default;

$--color-warning: #e6a23c !default;
$--color-warning-light-1: mix($--color-whites, $--color-warning, 10%) !default;

$--color-danger: #f56c6c !default;
$--color-danger-light-1: mix($--color-whites, $--color-danger, 10%) !default;

/* 赋值给:root
------------------------------- */
:root {
	--color-primary: #{$--color-primary};
	--color-whites: #{$--color-whites};
	--color-blacks: #{$--color-blacks};
	--color-primary-light-1: #{$--color-primary-light-1};

	--color-success: #{$--color-success};
	--color-success-light-1: #{$--color-success-light-1};

	--color-info: #{$--color-info};
	--color-info-light-1: #{$--color-info-light-1};

	--color-warning: #{$--color-warning};
	--color-warning-light-1: #{$--color-warning-light-1};

	--color-danger: #{$--color-danger};
	--color-danger-light-1: #{$--color-danger-light-1};
}
```

## 字体样式

js 先引用字体库

```scss
.font-01 {
	font-family: 'Liu Jian Mao Cao', cursive;
}
.font-02 {
	font-family: 'Ma Shan Zheng', cursive;
}
.font-03 {
	font-family: 'Anton', sans-serif;
}
.font-04 {
	font-family: 'Noto Serif SC', serif;
}
.font-05 {
	font-family: 'ZCOOL KuaiLe', cursive;
}
.font-06 {
	font-family: 'ZCOOL QingKe HuangYou', cursive;
}
.font-07 {
	font-family: 'Zhi Mang Xing', cursive;
}
```

# 常用布局

## 头部布局

```scss
.ant-row {
	//元素占据一行
	position: relative;
	height: auto;
	margin-right: 0;
	margin-left: 0;
	zoom: 1;
	display: block;
	box-sizing: border-box;
	&::before {
		display: table;
		content: '';
	}
	&::after {
		display: table;
		content: '';
	}
}
.z-layout {
	max-width: 1216px; //浏览器缩小不会改变布局
	width: 100%;
}
.z-container {
	width: 100%;
	height: 4.25rem;
	position: relative;
	display: flex;
	justify-content: center;
	box-shadow: 0 1px 1px 0 rgb(169 182 220 / 30%);
	.z-wrap {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		@extend .ant-row;
		.z-inner {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 80%;
			&::before {
				content: '';
				display: table;
			}
			.z-content {
				@extend .z-layout;
			}
		}
	}
}
```

## 吸顶布局

```js
.stiky {
	position: sticky !important;
	top: 0;
	z-index: 10;
}
```

# 特效样式

## 4 种字体标题特效

```scss
$titleSpacial: (
	'jump': jump,
	//标题跳动
	'pop': pop,
	//标题放大
	'flip': flip,
	//标题翻转
	'blink': blink //标题闪亮
);
@each $key, $value in $titleSpacial {
	.title-#{$key} {
		display: inline-block;
		animation: 0.4s $value ease-in-out var(--delay) infinite;
	}
}
@keyframes jump {
	//标题跳动
	0%,
	100% {
		transform: translateY(0px);
	}
	50% {
		transform: translateY(-10px);
	}
}
@keyframes pop {
	0%,
	100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.15);
	}
}

@keyframes flip {
	0%,
	100% {
		transform: rotateY(0deg);
	}
	50% {
		transform: rotateY(90deg);
	}
}

@keyframes blink {
	0%,
	100% {
		color: inherit;
	}
	50% {
		color: red;
	}
}
```

## 字体跳动

```scss
.title-tiao {
	display: inline-block;
	overflow: hidden;
	position: relative;
	top: 0.8rem;
	animation: 0.3s swift-up ease-in-out forwards;
}
.title-tiao-i {
	font-style: normal;
	position: relative;
	top: 2rem;
	animation: 0.5s swift-up ease-in-out forwards;
}
@keyframes swift-up {
	to {
		top: 0rem;
	}
}
```

## 下雪

```js
/******************************下雪特效*********************************/
@use 'sass:math' as math;
@function random_range($min, $max) {
	$rand: random();
	$random_range: $min + floor($rand * (($max - $min) + 1));
	@return $random_range;
}

.snow {
	$total: 200;
	position: absolute;
	width: 10px;
	height: 10px;
	background: white;
	border-radius: 50%;

	@for $i from 1 through $total {
		$random-x: random(1000000) * 0.0001vw;
		$random-offset: random_range(-100000, 100000) * 0.0001vw;
		$random-x-end: $random-x + $random-offset;
		$random-x-end-yoyo: $random-x + math.div($random-offset, 2);
		$random-yoyo-time: math.div(random_range(30000, 80000), 100000);
		$random-yoyo-y: $random-yoyo-time * 100vh;
		$random-scale: random(10000) * 0.0001;
		$fall-duration: random_range(10, 30) * 1s;
		$fall-delay: random(30) * -1s;

		&:nth-child(#{$i}) {
			opacity: random(10000) * 0.0001;
			transform: translate($random-x, -10px) scale($random-scale);
			animation: fall-#{$i} $fall-duration $fall-delay linear infinite;
		}

		@keyframes fall-#{$i} {
			#{percentage($random-yoyo-time)} {
				transform: translate($random-x-end, $random-yoyo-y) scale($random-scale);
			}

			to {
				transform: translate($random-x-end-yoyo, 100vh) scale($random-scale);
			}
		}
	}
}
```

# 集成样式

## hover 展开菜单

- **更换圆点和方向可以有更多效果**

```scss
.hover-height-show {
	&:hover {
		.height-hidden {
			transform: rotateX(0deg) !important;
		}
	}
}
.height-hidden {
	transition: all 0.3s ease;
	transform: rotateX(-90deg); //沿着X轴3d旋转，看不见
	transform-origin: center top; //变换原点
	//transition: transform 0.3s ease;
	will-change: max-height;
}

// 点击展开菜单
<ul :class="menuOpen ? 'hover-height-show' :'height-hidden' "></ul>
<img @click="menuOpen = !menuOpen" class="menu-logo"">

.hover-height-show {
    transform: rotateX(0deg) !important;
}
.height-hidden {
    transform: rotateX(-90deg); //沿着X轴3d旋转，看不见
}
ul {
    transform-origin: center top; //变换原点
    //transition: transform 0.3s ease;
    will-change: max-height;
    transition: all 0.3s ease;
}
```

## 文本显示和隐藏

```scss
div.maxShow {
	// 显示出文本
	max-height: 150px;
}
div.maxHidden {
	// 默认为30px的高度
	max-height: 30px;
}
div {
	overflow: hidden; // 超过不显示
	transition: 1s max-height ease; // 只有max-height才可以使用过渡
	h3 {
		height: 30px; // 默认为30px的高度，正好只显示出标题
		color: #0c3c5d;
		font-size: 20px;
		font-weight: bold;
	}
}
```

## tarbar 滑动导航

```scss
.z-tarbar {
	li {
		transition: all 0.5s;
	}
	&::before {
		transition: all 0.4s;
		transition-timing-function: ease-in-out;
		content: ' ';
		left: var(--left);
		position: absolute;
		width: var(--width);
		border-radius: 0.75rem;
		background: rgb(108, 221, 144);
		height: 100%;
	}
}
.col-tarbar {
	li {
		transition: all 0.5s;
	}
	&::before {
		transition: all 0.4s;
		transition-timing-function: ease-in-out;
		content: ' ';
		right: -2px;
		top: var(--Top);
		position: absolute;
		width: 3px;
		height: var(--Height);
		border-radius: 0.75rem;
		background: rgb(76, 228, 124);
	}
}
```

## hover 滑动导航

```scss
.col-tarbar-hover {
	transition: width ease-in-out 0.5s !important;
	&:hover {
		width: 150px;
		li {
			span {
				opacity: 1;
			}
		}
	}
	li {
		height: var(--LiHeight);
		span {
			opacity: 0;
			transition: opacity 0.5s ease-in-out;
		}
	}
}
```

## 去三角形

```scss
.trigon {
	position: relative;
	float: left;
	margin-right: 10px;
	width: 24px;
	box-sizing: border-box;
	height: 30px;
	margin-top: -8px;
	margin-left: 5px;
	background-image: linear-gradient(#8b5cf6, #60a5fa);
	&::after {
		content: ' ';
		width: 0px;
		height: 0px;
		border: solid;
		border-width: 0 12px 10px;
		border-color: transparent transparent #fff;
		position: absolute;
		bottom: 0;
		left: 0;
	}
}
```

背景虚化

```scss
.bg-filter {
	position: relative;
	background-repeat: no-repeat;
	background-attachment: fixed;
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
```

## 玻璃拟态卡片

```scss
.main-card-container {
	display: flex;
	justify-content: space-between;
	width: 50rem;
	height: 26rem;
	@media screen and (max-width: 768px) {
		flex-direction: column !important;
		height: 38rem;
		.card {
			width: 100% !important;
			.imgBx {
				display: none;
			}
		}
	}
	.card {
		position: relative;
		width: 21.875rem;
		height: 100%;
		background: rgba($color: #000000, $alpha: 0.1);
		box-shadow: 0 15px 25px rgba($color: #000000, $alpha: 0.1);
		border-radius: 0.625rem;
		border-top: 1px solid rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(0.1875rem);
		&:hover {
			.imgBx {
				transform: translateY(50px) scale(0.5);
				transform-origin: top;
			}
			.card-title {
				top: 100%;
			}
		}
		.imgBx {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			border-radius: 0.625rem;
			overflow: hidden;
			transition: all 0.7s ease-in-out;
			z-index: 1;
			img {
				object-fit: cover;
			}
		}
		.card-title {
			position: absolute;
			left: 50%;
			top: 50%;
			transition: all 0.7s ease-in-out;
			transform: translate(-50%, -50%);
		}
	}
}
```

## 3D 导航栏样式

```scss
.Td-nav {
	$hei: 44px;
	li {
		height: $hei;
		transform-style: preserve-3d;
		transition: all 1s;
		&:hover {
			transform: rotateX(90deg);
			div:first-child {
				background-color: #51938f;
				background-size: 5px 5px;
				background-position: 30px 30px;
				background-image: linear-gradient(45deg, #478480 25%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0) 75%, #478480 75%, #478480);
			}
		}
		div {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			line-height: $hei;
			text-align: center;
			font-size: 18px;
			font-weight: 700;
			color: #fff;
			&:first-child {
				background-color: #74adaa;
				transform: translateZ(21px); //改变高度，这里也要改
			}
			&:last-child {
				background-color: #51938f;
				background-size: 5px 5px;
				background-position: 30px 30px;
				background-image: linear-gradient(45deg, #478480 25%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0) 75%, #478480 75%, #478480);
				/* 让第二个面往下移动25px 沿着X轴旋转-90度 */
				transform: translateY(20px) rotateX(-90deg);
			}
		}
	}
}
```

## 旋转卡片

```scss
.rotate-card-container {
	/* 这里现在我们动画看起来硬生生的，没有任何的立体感 所以我们需要添加这个属性来增加卡片旋转的立体感 当然值越小 立体感就会越明显 立体感最明显的地方就是近小远大 这个是的意思就是设置视距 相当于你的眼睛离一个东西的距离 当这个东西离你的眼睛越近 那么这个东西就会越大 这期的很多知识点可能小伙伴看的不是特别明白 所以小伙伴们如果有什么不懂得就在评论区给我留言 我会一一为大家解答  录声音不太方便 就只能以文字的形式来为大家解答了  谢谢大家的支持 最后不要忘了三连*/
	perspective: 1000px;
	.rotate-card {
		/* 相对定位 */
		position: relative;
		width: 300px;
		height: 400px;
		/* 圆角属性 */
		border-radius: 30px;
		/* 鼠标放到元素上呈现小手的形状 */
		cursor: pointer;
		background-color: #fff;
		/* 盒子阴影 */
		box-shadow: 1px 1px 20px rgba(0, 0, 0, 0.1);
		/* 给父元素 加一个3D盒子属性 那么子元素就到背面了 这个属性是加到父元素上 但是影响的是子元素 */
		transform-style: preserve-3d;
		animation: rotate-reverse 1.2s cubic-bezier(0.66, -0.47, 0.33, 1.5) forwards;
		&:hover {
			/* 动画 名称 时长 第三个属性是贝塞尔曲线 我们可以自定义动画的运动轨迹 让动画的运动轨迹有了很多种可能 第四个属性是当我们的动画完成是的状态 一般动画完成之后就回到了0%的状态 默认值是backwards 当我们给属性值是forwards的时候那么当动画到100%的时候就会停下来 不会再回到0% */
			animation: rotate 1.2s cubic-bezier(0.66, -0.47, 0.33, 1.5) forwards;
		}
		.front,
		.back {
			display: flex;
			/* 弹性布局 让元素垂直陈列 */
			flex-direction: column;
			/* 现在子元素垂直陈列 那么就是让子元素 水平居中 */
			align-items: center;
			/* 平均分配高度给每一个子元素 */
			justify-content: space-around;
			/* 绝对定位  子元素是绝对定位 父元素需要相对定位 */
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			/* 1em = 16px */
			font-size: 1.3em;
			border-radius: 30px;
			//background-color: #fff;
		}
		.back {
			/* 因为背面卡片要到后面去所以我们给背面卡片加一个沿Y轴旋转180度的属性 这里面我们可以看到是旋转了但是没有到后面 原因就是父盒子现在不是3D盒子 而是一个2D盒子 所以我们必须让父元素变成3D盒子 */
			transform: rotateY(180deg);
		}
		/* 下面我们定义一下翻转动画 */
		@keyframes rotate {
			0% {
				transform: rotateY(0);
			}
			100% {
				transform: rotateY(180deg);
			}
		}

		@keyframes rotate-reverse {
			0% {
				transform: rotateY(180deg);
			}
			100% {
				transform: rotateY(0);
			}
		}
	}
}
```

## 折叠卡片

```scss
.fold-card {
	position: relative;
	&:hover {
		.face1 {
			transform: translateY(0px);
		}
	}
	.face {
		width: 18.75rem;
		height: 14.2857rem;
		transition: all 0.5s;
	}
	.face1 {
		transform: translateY(144px);
	}
	.face2 {
		box-shadow: 0 20px 50px rgba($color: #fff, $alpha: 0.8);
		box-sizing: border-box;
	}
}
```

```scss
.circle-bar {
	.card_percent {
		svg {
			width: 17rem;
			height: 17rem;
			transform: rotate(-90deg);
			z-index: 1;
			circle {
				background: white;
				transform: translate(2.9rem, 3rem);
				fill: none;
				stroke-linecap: round;
				stroke-dasharray: 565.2; //3.14*180
				stroke-dashoffset: 282.6; //上面的一半
				transition: all 1s ease;
				stroke-width: 30;
			}
		}
		.circle {
			position: absolute;
			width: 16rem;
			height: 16rem;
			border-radius: 50%;
			box-shadow: 6px 6px 8px var(--grayLight-2), 6px 6px 8px white;
			background: rgba($color: #c9f4f7, $alpha: 1);
		}
		.circle_medium {
			width: 13.5rem;
			height: 13.5rem;
			box-shadow: inset 8px 8px 10px var(--grayLight-2), inset -4px -4px 8px white;
		}
		.circle_small {
			width: 9.3rem;
			height: 9.3rem;
			box-shadow: 6px 6px 8px var(--grayLight-2), -2px -2px 8px white;
		}
		.card_number {
			position: absolute;
			color: black;
			font-size: 2.5rem;
		}
	}
}
```

## 滚动条样式

```scss
//全局

/*整个滚动条*/
::-webkit-scrollbar {
	margin-left: 2px;
	width: 5px;
	height: 5px;
	background-color: #fff;
	opacity: 0.5 !important;
}
/*定义滚动条轨道*/
::-webkit-scrollbar-track {
	background-color: #fff;
	border-radius: 4px;
}
/*定义滑块*/
::-webkit-scrollbar-thumb {
	background-color: #6ee7b7;
	border-radius: 4px;
}

//局部
.z-scrollbar::-webkit-scrollbar {
	margin-left: 2px;
	width: 5px;
	height: 2px;
	background-color: #fff;
	opacity: 0.5 !important;
}
/*定义滚动条轨道*/
.z-scrollbar::-webkit-scrollbar-track {
	background-color: #fff;
}
/*定义滑块*/
.z-scrollbar::-webkit-scrollbar-thumb {
	background-color: #d3d7e1;
	border-radius: 4px;
}
```
