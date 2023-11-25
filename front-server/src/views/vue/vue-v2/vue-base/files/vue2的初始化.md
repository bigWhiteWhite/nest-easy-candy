##  vue的初始化

### 	vue-cli脚手架(2.9.6版本)

```javascript
cnpm i webpack webpack-cli -g
cnpm install -g vue-cli
vue init webpack +  你的项目名称
npm install --save vuex
npm i element-ui -S
npm i node-sass@4.14.1  style-loader -D 
npm install sass-loader@7.3.1 --save-dev
npm install axios -S				//下载依赖
npm install dayjs -S				//下载依赖
npm i blueimp-md5		//加密依赖	

npm i  vuex node-sass@4.14.1  style-loader  sass-loader@7.3.1
npm i  axios 
```

### 使用vuetify

vutify的样式有部分失效，要用v-app包裹着所有的vuetify代码

<v-app>

​    <router-view/>

  </v-app>

```javascript
npm install vuetify
npm install sass@~1.32  deepmerge -D
```

```javascript
// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

const opts = {}

export default new Vuetify(opts)
```

```javascript
// src/main.js

import Vue from 'vue'
import vuetify from '@/plugins/vuetify' // path to vuetify export

new Vue({
  vuetify,
}).$mount('#app')
```

```javascript
//index.html
<link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Material+Icons" rel="stylesheet">
<link href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/font-awesome@4.x/css/font-awesome.min.css" rel="stylesheet">
```



### 使用md5

```javascript
import md5 from 'blueimp-md5'
Vue.prototype.$md5 = md5
import $md5 from 'blueimp-md5'  //action中使用
let psw = $md5($md5(this.state.message.password))//加密
```



### 配置sass

1. 以前需要引入，现在不需要配置webpack.base.conf，在build中的webpack.base.conf中的module中的rules加入

```javascript
{//新版不支持缩写
    test: /\.scss$/,
    loader: ['style-loader', 'css-loader?url=false', 'sass-loader']
},
{//旧版
    test: /\.scss$/,
    loaders:['style','css','sass']
},
```

2. 在style中加入

   ```javascript
   lang="scss" scoped//scoped是局部作用域的意思，不要再App.vue中使用
   ```

### 常用命令

```
cnpm i
cnpm run dev
cnpm run build
```

###  如何快速配置

​	直接将原生vue文件中的src文件替换脚手架的src文件

​	直接将原生vue文件中的static文件替换脚手架的static文件

### 配置网页标题

​	在index.html文件中修改title标签，标题图片在title标签下方加上一下代码，图片一定要放在static的下面

```
	<link rel="icon" href="./static/logo.png" sizes="32x32">
```



## vue生命周期

初始化显示 

```
beforeCreate()
created()
beforeMount()
 mounted()
```

更新显示：this.xxx=value

```
beforeUpdate()
updated()
```

销毁vue实例：vm.$destroy()

```
beforeDestroy()
destroyed()
```

### 常用的生命周期方法

created()/mounted():发送ajax请求，启动定时器等异步任务  mounted.挂载:先在内存加载好，再一次性发送到页面去
        beforeDestory():做收尾工作，如：清除定时器

```js
created()/mounted()	 //发送ajax请求，启动定时器等异步任务 
mounted()			 //挂载:先在内存加载好，再一次性发送到页面去
beforeDestory()		 //做收尾工作，如：清除定时器
```

### axios提交表单方式

#### 普通请求

```javascript
var params = new URLSearchParams()
params.append("username",this.username)
this.$axios.post('/userregister',{params})
.then(res=>{
    if(res.status===200){
    	console.log(res.data)
    	return res.data
    }else{
   	 return 'error'
    }
})  
.catch(err=>{
	console.log(err)
})
```

#### 对象请求

```javascript
//传递对象
this.$axios.post('/shop/agritainment/add',
   {"address": this.ruleForm.address,
    "imageList": [this.imgsrc],
    "phone": this.ruleForm.phone})
.then(res=>{
    console.log(res)
    this.$message({
       type: 'success',
       message: '商品上传成功'
	})
})
```

#### 数组请求

```javascript
//传递数组
import qs from 'qs'
let ldidList = []
for (var i = 0; i < this.$route.query.data.length; i++) {
    ldidList.push(this.$route.query.data[i])//将push的item导入
}
 //ldidList这里就是我要传的数组参数["340124400498002122", "340121401000542666"]
qs.stringify({ ldidList: ldidList }, { arrayFormat: 'repeat' })
this.$axios.post('/order/qrcode',ldidList)
.then(res=>{
    console.log(res.data)
    this.src = res.data.data
})
.catch(err=>{
    console.log(err)
})
```

#### 上传图片

```javascript
let formData = new FormData();
formData.append('file', item.file);//若查看可使用 formData.get('file')
this.$axios.post('/shop/upload/file',formData)
.then(res => {
   console.log(res)
}
```

## 使用阿里巴巴图标库

！！！注意图标大小，太大会失真

### 使用单色图标

选择Font class，打开网址复制代码创建css文件，在main.js中引入css文件,使用：

```html
<i class="iconfont icon-rizhi"></i>   <i class="iconfont">&#xe60c;</i>
```

### 使用多色图标

选择Font class，打开网址复制代码创建css文件，在main.js中引入css文件
选择Font Symbol，打开网址复制代码创建js文件，在main.js中引入js文件

在App.vue的css里面写

```css
.icon {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
```

使用方式

```html
<svg class="icon" aria-hidden="true">
    <use xlink:href="#icon-rizhi"></use>
</svg>
```

 注意：图标的大小是通过父元素的大小调整的，所有改变父元素的大小就可以改变图标的大小

```css
svg{
    width:100%;
    height:100%
}
```

### 本地引入

​	下载zip包，引入所有iconfont开头的文件，demo文件是使用说明
​	main.js里面引入iconfont.js和iconfont.css文件
​	然后就是使用单色图标和多色图标的方法
​	如果是微信小程序内使用，则要后缀名要wxss，不要为css。

## vuex的配置

```node
cnpm install --save vuex
```

### vuex分开配置

store中的index，引入其他配置文件，然后向外暴露

```javascript
export default new Vuex.store({
	state,mutations,actions,getters
})
```

通过mutation-type来控制数据流通

```javascript
export const ADD_TODO = 'add_todo'//添加todo
```

mutation中,从mutation-type传过来的是小写的变量且是字符串，传导mutation的时候，为了将字符串换为变量，要使用[ ]的方式调用

```javascript
import {ADD_TODO} from "./mutation-type";
export default {
    [ADD_TODO](state,{todo}){ 
        state.todos.unshift(todo)
    } 
}

import * as type  from './mutations-type' //更简单的方法
export default {
	[type.MY_AUDIO](state){
		console.log(123)
	}
}
```

actions中

```javascript
import {ADD_TODO} from './mutation-type'
export default {
    addTodo({commit},todo){//传参的方式
        //提交对mutation的请求
        commit(ADD_TODO,{todo})//将形参传给mutation，使用对象，这样无论传的是什么
    }
    //异步获取todos并更新状态，调用在mouned里面，this.$store.dispatch(reqTodos)
    reqTodos({commit}){
        setTimeout(()=>{
            //提取数据
            const todos=storageUtil.readToos()
            //提交mutation
            commit(RECEIVE_TODOS,todos)
        },1000)
    }	
        
}

import * as type  from './mutations-type' //更简单的方法
export default {
	myaudio({commit}){
		commit(type.MY_AUDIO)
	}
	
}
```

### 传递多个参数

```javascript
//如果是多个参数，在外面的传进来一个对象
this.$store.dispatch("selectOne", { id: id,index:index });
@click="selectOne({id:item.id,index:index})"//...mapAciton
//如果只传一个值的话，不要加{}
this.$store.dispatch('changeitemindex',index)
```

action

```javascript
selectOne({commit},data){
		console.log(data.id)
		console.log(data.index)
    	commit(SELECT_ONE,data)
},
```

mutation

```javascript
//然后mutation也是这样接受，
[SELECT_ONE](state,data){
    console.log(data.index)
    console.log(data.id)
}
```





### 优化vuex

```htmljavascript
import {mapState,mapGetters,mapActions} from 'vuex'
```

computed 中写

```javascript
...mapState(['count']),
...mapGetters(['evenOrOdd']),
...mapGetters({evenOrOdd:'evenOrOdd02'})
```

methods中写

```javascript
...mapActions(['increment'])
```

通过dispatch来触发action

```javascript
this.$store.dispatch('')
```

通过getters来触发getter

```javascript
evenOrOdd(){
	return this.$store.getters.evenOrOdd
}
```



## router的使用

路由原理：
	（1）传统开发方式 url改变后，立刻发生请求响应整个页面，有可能资源过多，传统开发会让页面出现白屏

​	（2） SPA  Single Page Application 单页面应用

​	（3）锚点值的改变后 不会立刻发送请求，而是在某个合适的时机，发起ajax请求，局部改变页面的数据 

​	（4）优点：页面不立刻跳转 用户体验好

​	（5）router-link默认会被渲染成a标签，to默认会被渲染成href属性

```html
	<router-link tag="div" to="/xxx"></router-link>
	<router-view :key="$route.path"></router-view>
```
### router的实例化对象和属性

$router:将VueRouter的实例化对象绑定在Vue上面去比如push(),replace(),go()

```javascript
this.$router.push()			//相当于点击路由链接(可以返回到当前路由界面)
this.$router.replace()   	//用新路由替换当前路由(不可以返回到当前路由界面)
this.$router.go()
this.$router.back(path)		//请求（返回）上一个记录路由
```

$route:路由信息属性，可以查看params动态路由参数和query查询等路由属性

### 地址栏和路由范式

```html
<router-link :to = "{name:'userP',params:{id:1}}">用户1</router-link> xxxxx.html#/user/1    params 动态路由参数
<router-link :to = "{name:'userQ',query:{userId:2}}">用户2</router-link> ooooo.html#/user?userId = 1  query
this.$router.push({name:'shop',query:{'pid':pid}})
```

### 默认路由和嵌套路由

```javascript
{
    path: '/',
    name:'寸题金库',
    component: () => import('@/views/layout.vue'),
    meta: {
    	requireAuth: false,
    },
    redirect: '/home',
    children:[
        {
            path:'/home',
            name:'首页',
            component:()=>import('@/views/index.vue'),
            meta: {
            	requireAuth: false,
            },
        },
    ]
},
```

### 监听路由变化

```javascript
watch:{
    '$route' (to, from) { //监听路由是否变化
        if(to.path == "/register"){ //跳转到哪个页面
            location.reload()//变化则刷新界面
        }
    }
},
reload(){//methods
    this.refresh = false;
    this.$nextTick( ()=>{
        this.refresh = true
    });
},
```



### 常见小问题

#### 多次点击同一个路由链接引起错误

```javascript
this.$route.path !== '/login' && this.$route.path !== '/personspace'
console.log(this.$route.path)//保存的是上一个路由，所以可以防止多次点击引起错误
```

#### query跳转，重新写入query参数时报错

```javascript
'/xxx/:yyy/:zzz'
//props:true
@click="this.$router.push(`/xxx/${yyy}/${zzz}`)"//点击直接跳转
this.$router.push({name:'Supply',query:{'name':''}})//先将参数重置为0
this.$router.push({name:'Supply',query:{'name':this.keyword}})
```

#### 监听路由属性route,当参数发生变化时，要重新调用事件

```javascript
watch:{
	'$route':function(){//当搜索关键字(传递过来的this.route.query)发生改变,那么重新搜索
		this.search()
	}
},
```



## 动态生成img

注意！！！要使用require！！！

图片不多，用data存储，v-for使用 (item,index) in List，<img :src="item.path">

```
List:[{"path":require('./../../resource/backimg/火影忍者00.jpg')}]
```

只用一种图片

```html
<img :src="require('./../../resource/backimg/火影忍者00.jpg')"></div>
```

使用函数动态生成img，注意因为是v-for生成，所以要传递index

```html
<div class="list" v-for="(item,index) in List" :key="index">
    <div class="backface" ><img :src="allBackimg(index)"></div><!--allBackimg(home)-->
    <div class="face"></div>
</div>
allBackimg(index){
    return  require("./../../resource/backimg/火影忍者00.jpg");
}html
```

## 点击首页商品跳转详情页

首先通过传递query参数跳转到我需要的页面，使用state的话一刷新就会失去数据，不可以使用state

```javascript
goDetail(pid){
	this.$router.push({name:'shop',query:{'pid':pid}})//pid为商品唯一标识
}
params.append("pid",this.$route.query.pid)			//不是$ruter
this.$axios.post('/product/detail/',params)
```

## 商品放大镜失灵，重新刷新页面

```javascript
<router-view v-if="isRouterAlive" /> //isRouterAlive默认为true，当需要刷新的时候，换为false再换为true
this.isRouterAlive = false;
this.isRouterAlive = true;
```



## vue中session的使用

使用vuex保存session的信息

### state：

```javascript
currentUser:{},	//返回的信息
isLogin:false,	//是否登录
token:""		//保存用户登录后持有的token
```

getter:

```javascript
export const currentUser = state=>state.currentUser
export const isLogin = state=>state.isLogin
```

action:

```javascript
setUser({commit},user){   		//不要忘记在mutation里面加变量，和import里面加USER_STATUS
	commit(USER_STATUS,{user})
}
```

### mutation:

```javascript
[USER_STATUS](state,user){
    //当我注销的时候，传进来的是user={user:undefined},所以if(user)还是会执行，因为user是存在的
    console.log(user)
    if(user.user){
        state.currentUser = user.user //登陆成功要将数据存入到vuex
        state.isLogin = true
    }else if(user.user === null){
        console.log(123)
        //登出的时候，清空sessionStorage里的东西
        localStorage.setItem("currentUser",null)
        //sessionStorage.setItem("userToken","")
        state.currentUser = null
        state.isLogin = false
        state.token = ""
    }
},
```

axios里面调用：

```javascript
this.$store.dispatch('setUser',res.data.data)
//调用mutation就好
```

##  刷新保存登陆状态

在APP.js中

```javascript
created() {
    //在页面加载时读取localStorage里的状态信息
    localStorage.getItem("currentUser") && 			      this.$store.replaceState(Object.assign(this.$store.state,JSON.parse(localStorage.getItem("currentUser"))));
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload",()=>{
        localStorage.setItem("currentUser",JSON.stringify(this.$store.state))
    });
    // 兼容iphone手机
    window.addEventListener("pagehide",()=>{
        localStorage.setItem("currentUser",JSON.stringify(this.$store.state))
    });
    //如果页面加载的时候sessionstorage没有的话 就从vuex中取
    localStorage.setItem("isLogin",this.$store.state.isLogin)
},
```

### 组件中使用

```javascript
console.log(this.$store.state.currentUser)
var user = this.$store.state.currentUser
    if(this.$store.state.isLogin === true){
    if(this.$store.state.currentUser.role === 1){
    	this.User = this.$store.state.currentUser
    	document.getElementById('login-div-text').style.display = 'none'
    	document.getElementById('user_is_login').style.display = ''
    }
}
//注销
cancel(){
    localStorage.setItem("currentUser",null)//登出的时候，清空sessionStorage里的东西
    this.$store.dispatch('setUser',null)     //store清空
    this.User = {}
    console.log("注销以后"+ this.$store.state.currentUser)
    document.getElementById('userimg').style.display = 'none'
    document.getElementById('login-div-text').style.display = ''
}
```

# 自定义组件

定义

组件里面可以调用其他的自定义组件

```html
<template>
  <div class="wrapper border-bottom-d4d9de">
      <slot name="header"></slot>
      <div class="card-body pb-d2 border-top-d4d9de">
          //轮播图
        <swiper ref="slide" :options="{autoHeight: true}" 
                @slide-change="active = $refs.slide.swiper.realIndex" >
          <swiper-slide v-for="(category, index) in categories" :key="index">
              //插槽，name是插槽的名字，:category表示绑定category，可以在外面使用
            <slot name="items" :category="category"></slot>
          </swiper-slide>
        </swiper>
      </div>
  </div>
</template>


data(){
    return:{
		props:{
            icon:{type:String,required:true},
            title:{type:String,required:true},
            categories:{type:Array,required:true},
        }
    }
}

```



### 使用

#items='{category}代表着关联items插槽,获取插槽给的category,没有后面就代表只关联这个插槽，slot写了name后面的template就一定要写#+名字

```vue
<list-card icon="icon1" title="新闻资讯" :categories="newCats">
    <template #items='{category}'>
    	<div v-for=(item,index) in category ...>
            ...
        </div>
    </template>
</list-card>


data(){
    return:{
		newCats:[
			name:'热门'，
			newList:new Array(5).fill({}).map(v =>{
				categoryName:'公告'，
				title:'更新公告',
				date:'06/01'
			})
        ]
    }
}
```

### 传递方法

```javascript
<Page @getList='getList'></Page>//parent
getList(){
    ...
}
//page
changePage(afterPage) {
    this.page = afterPage;
    this.$emit('getList',this.page);//还可以传递参数
},


```





​		

​	











​		













​		



