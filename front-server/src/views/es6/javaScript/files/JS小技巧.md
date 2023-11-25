## 判断多个status状态

从后端传过来的status有很多种的status链接状态，每一次都做if或者switch判断非常麻烦，将status的状态码放在对象中,通过

status[10000]来获取判断数据

```javascript
const status = {       //判断码会有很多个组件用到，放在$store.state中
	10000:"SUSSESS",
    10002:"error",
    10003:"error",
    10004:"error",
    10005:"error",
}
//获取
const level = 10000
console.log(status[level])//"SUSSESS"

const status = {
	10000:{
        type:"SUSSESS",
    },
    10001:{
        type:"error",
    },
}
//获取
const level = 10000
console.log(status[level].type)//"SUSSESS"

//item.value = item.ABC_NODE
//item.label = item.ABC_CODE
console.log(abc.toUpperCase())
const ABC = abc.toUpperCase()
item.value = item[`${ABC}`_NODE]
item.label = item[`${ABC}`_CODE]


```

## :class的使用

```html
<div :class='[show?"open":""]'><div/>//show为data中的show:false
<div :class="{open:show}"><div/>  //show为函数，返回true或者false
show(){
    const router = this.$route
    return router.name === "index" ? false:true
}
    
    
<div v-for="(category, index) in categories" :key="index"
     @click="$refs.slide.swiper.slideTo(index)"
      :class="{'active': active === index}">
</div>

<swiper ref="slide" :options="{autoHeight: true}"
        @slide-change="active = $refs.slide.$swiper.realIndex">
        <swiper-slide v-for="(category, index) in categories" :key="index">
            <slot name="items" :category="category"></slot>
        </swiper-slide>
</swiper>
   
    
```

## 不常用的标签

```css

```

## css的细节

### 不常用的css样式

```css
cursor:pointer   //hover上去变成手指
vertical-align: middle; //设置元素垂直居中的css
letter-spacing: 8px;//设置文字间距
```

### 引入scss文件

当有一些公有的sass样式时，可以创建一个scss文件写在里面，然后在需要的组件中的style中引入，全局就引入App.vue组件

```css
<style lang="scss" scoped>
	@import '../../../static/test.scss';
</style>
```

scss文件也可以引入其他的scss文件

### css3正則匹配、模糊匹配

```css
//所有class包含font-red的p标签
i[class^="icon"] {display:inline-block;border-radius:100px}//可以配置所有的icon

[abc^="def"] 选择 abc 属性值以 "def" 开头的所有元素
[abc$="def"] 选择 abc 属性值以 "def" 结尾的所有元素
[abc*="def"] 选择 abc 属性值中包含子串 "def" 的所有元素
```

### css3兼容浏览器

```scss
-webkit-box-shadow:0 0 18px 0 rgba(0,0,0,0.2);
-moz-box-shadow:0 0 18px 0 rgba(0,0,0,0.2);
-o-box-shadow:0 0 18px 0 rgba(0,0,0,0.2); 
-ms-box-shadow:0 0 18px 0 rgba(0,0,0,0.2);
box-shadow:0 0 18px 0 rgba(0,0,0,0.2);

@mixin webkit($type,$value){//将这些写到共同的scss文件中,常用的我已经写好，需要引用就好
    -webkit-#{$type}:	$value;
	-moz-#{$type}:		$value;
	-ms-#{$type}:		$value;
	-o-#{$type}:		$value; 
	#{$type}:			$value;
}
@include webkit(box-shadow,0 0 18px 0 rgba(0,0,0,0.2))
@include webkit(box-sizing,border-box) 
    
@import "./util/color.scss";
.bghover{
  &:hover{
    background-color: map-get($colors,'indigo-600');
  }
}
```

### sass的使用

#### 普通变量

```scss
$menuText: #8a979e;
$menuActiveText: #fff;
$subMenuActiveText: #f4f4f5;
```

#### 循环生成class

这样子就像tailwindcss，通过类名改变样式

```scss
$colors: (
  "primary": #db9e3f,
  "white": #fff,
  "light": #f9f9f9,
);
color:map-get($colors,'primary')//
//文字颜色 & 元素背景色
@each $colorKey, $color in $colors {
  .text-#{$colorKey} {
    color: $color;
  }

  .bg-#{$colorKey} {
    background: $color;
  }
}

```

### 吸顶布局

```css
.a{
    position:stiky;
    top:0;
    z-index:10;
}
```



## Vue的细节

```javascript
//vue2中的数据绑定有点问题
retuen{
    model:{}
}
methods:{
     xxx(){
        //this.model.icon = res.url//无法赋值，需要显示赋值 
         this.$set(this.model,'icon',res.url)
     }
}   
```

### 判断&&

```javascript
err && console.log(123)	//如果err存在则执行console.log
```

### 模拟数组的生成

```javascript
data(){
    //fill({})代表填充5个空对象，用map替换这些空对象
    return:{
		newCats:new Array(5).fill({}).map(v =>{
				categoryName:'公告'，
				title:'更新公告',
				date:'06/01'
        }
    }
}
```

### 更换时间戳

```javascript
npm i dayjs
import dayjs from 'dayjs'


{{Time | date}}

//export default
filters:{
    date(val){
        return dayjs(val).format('MM/DD')
    }
}

```

### 全局过滤器

```javascript
// main.js全局过滤器
//引入时间过滤器
import * as filters from './person/filters/day.js'
Object.keys(filters).forEach(key=>{//全局注册，声明是用于过滤器
    Vue.filter(key,filters[key])//插入过滤器名和对应方法
})

//day.js
import dayjs from 'dayjs'
/**
 * @return {String}
 */
 export  const switchTime = day=>{
    return dayjs(day).format('YYYY/MM/DD')
}
//使用{{msg.updatedAt | switchTime}}
```

### 时间过滤器

```javascript
<span>time | data</span>

npm i dayjs
import dayjs from 'dayjs'
filters:{
    data(val){
        return dayjs(val).format('MM/DD')
    }
},
    
//nodejs中使用时间过滤
npm i dayjs
const dayjs = require('dayjs')
categories.forEach((item)=>{
  item.createdAt = dayjs(item.createdAt).format('YYYY/MM/DD-HH:mm:ss')
  item.updatedAt = dayjs(item.createdAt).format('YYYY/MM/DD-HH:mm:ss')
})
//返回来的时间戳也可以在vue中再过滤

```

### 异步返回的数据不能及时传给子组件怎么办

v-if就是 数据来了渲染嘛， watch的话就是默认有数据或者内容要展示，然后定义一个hasDataFlag 默认是false，异步拿到数据以后改成true ，这时候字组件就知道拿到数据了 然后进行操作

```javascript
<div v-if="destination === ''?false:true">
        <myMap  :destination='destination' />
</div>

async getMsg(){
    const res = await this.$axios.get(`rest/Subbranch/${this.id}`)
    this.msg = res.data.data
    this.destination = this.msg.address
}

```

## 路由

### 动态控制keep-alive

#### APP.vue

```html
<template>
	<div>
		<transition name="router-fade" mode="out-in">
			<keep-alive>
                <!--当路由中的meta.keepAlive为true时才会显示-->
			    <router-view v-if="$route.meta.keepAlive"></router-view>
			</keep-alive>
    	</transition>
    	<transition name="router-fade" mode="out-in">
			<router-view v-if="!$route.meta.keepAlive"></router-view>
		</transition>
		<svg-icon></svg-icon>	
    </div>
</template>
```

#### router.js

```javascript
import App from '../App'
const routes = [
	path: '/',
    component: App, //顶层路由，对应index.html
    children: [ //二级路由。对应App.vue
        //地址为空时跳转home页面
    	{
            path: '',
            redirect: '/home'
        },
        {
            path: '/msite',
            component: msite,
            meta: { keepAlive: true },
        },
    ]
]
```

## localStorage存储对象，sessionStorage存储数组对象

**一、前言**

最近在用angular做商城购物车的功能模块，因为angular的watch监听，数据只要发生变化就能很方便的自动渲染页面。但随即出现的问题是，之前用户操作的样式都会被重置掉。

例如我勾选了几个商品准备结算，又修改了商品数量，这时候发起了请求，页面数据被渲染，打钩的商品全被恢复未选中。

想着将所有选中商品的独有Id存入数组，利用localStorage存储，每次刷新都取到存储的数组，将数组对应Id的商品再次勾上。结果出现了下面的问题：

```js
var a = [1,2,3];
window.localStorage.setItem('key',a);
var b = window.localStorage.getItem('key');
console.log(b,typeof b);//1,2,3   string
```

很明显，数组存进去直接被强转为了字符串类型，这明显不是我想要的，查了下，可以利用json.stringify与JSON.parse的转换达到目的。

**二、存储数组**

json.stringify可以将对象转换为 JSON 字符串

JSON.parse可以将 JSON 字符串转换为对象

那我们存的时候先将数组转成JSON字符串，取出来再转成数组就可以了，实现如下。

```js
function storageObj(obj) {
    var checkedIdStr = JSON.stringify(obj);
    sessionStorage.setItem("key", checkedIdStr);
};
var arrBefor = [1,2,3];
storageObj(arrBefor);
var arrAfter = JSON.parse(sessionStorage.getItem("key"));
console.log(arrAfter,typeof arrAfter);//[1, 2, 3]  "object"
```

**三、存储对象**

```js
function storageObj(obj) {
    var checkedIdStr = JSON.stringify(obj);
    sessionStorage.setItem("key", checkedIdStr);
};
var objBefor = {
    a:1,
    b:2
};
storageObj(objBefor);
var objAfter = JSON.parse(sessionStorage.getItem("key"));
console.log(objAfter,typeof objAfter);//{a: 1, b: 2} "object"
```

利用JSON转换值达到存储的的方式非常好用，除此之外JSON的方法还能用于深拷贝

#### 封装localstorage

https://www.bilibili.com/video/BV1zt411e7fp?p=9&spm_id_from=pageDriver

```javascript
export default const storage = {
    set(key,value){
        localStorage.setItem(key,JSON.stringify(value));
    },
    get(key){
        return localStorage.getItem(key);
    },
    remove(key){
        localStorage.removeItem(key)
    }
}
```

