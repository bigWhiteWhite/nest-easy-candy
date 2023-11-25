

## 初始化

```javascript
cnpm init -y		//初始化
cnpm install nodemon --save  //下载文件监测模块
//"serve":"nodemon index.js", 修改packag.json文件在"scripts"
npm run serve 	//启动命令
```



## 下载依赖

```
cnpm i express --save
cnpm i mongoose --save
cnpm i cors --save
cnpm i art-template express-art-template  	//模板
cnpm i body-parser --save;					//解析port请求
cnpm i blueimp-md5							//下载mp5密码解析
cnpm i express-session						//缓存数据至session
```



## 入口文件app.js的配置

```javascript
var express = require('express')
var router = require('./router')
var path = require('path')
var models = require('./models')
var bodyParser = require('body-parser')
var app = express()

app.use('/public/',express.static(path.join(__dirname,'./public')))

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/')) //静态资源默认就是 ./views 目录，可以改

//req请求对象上会多出来一个属性：body,可以直接通过req.body来获取表单post请求数据
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(router)

app.listen(3000,function(){
	console.log('3000端口running...')
})
```

## router的配置

```javascript
var express = require('express')
var router = express.Router()
var User = require('./models')
var md5 = require('blueimp-md5')

router.get('/',function(req,res){
	res.send("已接收到请求")
})
router.get('/add',function(req,res){
	
})

module.exports = router
```

## models的配置

```javascript
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/27017', { useMongoClient: true })

var Schema = mongoose.Schema//建立模型

//监听数据库连接状态
mongoose.connection.once('open',()=>{
    console.log('数据库连接成功……')
})
mongoose.connection.once('close',()=>{
    console.log('数据库断开……')
})
	
var userSchema = new Schema({
	name:String,
	age:Number,
	sex:String,
	phone:{
		type:Number
		
	},
	hotalId:{
		type:Number
	}
})

module.exports = mongoose.model('User',userSchema)


```

## mongodb

### 配置启动路径

~~~
mongod -dbpath E:\BtSoft\mongodb\data\db
~~~

启动路径配置完毕后，无论在哪里都可以直接输入mongo启动数据库

 ### 关闭服务

```
net stop mongodb
```

### 权限机制

添加超级管理员，最好不要轻易添加超级管理员，错误麻烦的很

~~~
use admin
db.createUser({
    "user":"adminUser",
    "pwd":"1234",
    "roles":[{
        role:"userAdminAnyDatabase",
        db:"admin"
    }]
})
~~~

有一个猜想，报504的错误是链接超时，node提示的错误是没有权限，应该是mongoose的链接申请上出现错误

```
mongoose.connect('mongodb://localhost:27017/client', {useNewUrlParser: true ,useUnifiedTopology: true })
```

```
mongoose.connect('mongodb://username:password@host:port/database?options...');
mongoose.connect('mongodb://username:password@localhost:27017/client;//client为数据库名称
mongoose.connect('mongodb://adminUser:1234@localhost:27017/admin;//应该要指定数据库的名称才可以获取权限登录
```



查看用户有无添加成功

~~~
use admin               //要先进入admin
db.system.users.find().pretty()
~~~

退出卸载服务，!!! cd bin

bin>mongod  --remove  进入bin目录卸载服务，如果已经在bin目录则不用写bin,Dos窗口必须使用管理员身份运行

```
cd E:\BtSoft\mongodb\bin
```

```
mongod --remove
```

重新安装需要输入账号密码的服务(注：在原安装命令基础上加上--auth即可)（应该不用每次都安装）,bin目录中

```
bin>
mongod --install --dbpath E:\BtSoft\mongodb\data --logpath E:\BtSoft\mongodb\logs\mongodb01.log  --auth 
```

日志文件(mongodb2.log)不可以重复

```
net start mongodb
```

### 启动服务-->登录测试

a-先登录，b-选择数据库，c-输入db.path(用户名，密码)

```
mongo
use admin
db.auth('adminUser','1234')
show dbs
```



### 添加其他数据库用户

```
use shop 		!!!必须在对应数据库添加用户
db.createUser({
    "user":"bigwhite",
    "pwd":"123456",
    "roles":[{
        role:"readWrite",
        db:"shop"
        }]
})
```

### 删除用户

```
use admin 因为所有的用户信息都在admin里面，所以要进入admin里面删除
db.system.users.remove({user:"bigwhite"})
```

### 可视化工具密码登陆

```
mongodb://用户名:密码@localhost
mongodb://adminUser:1234@localhost
```

## session的使用

cookie和session都是用来跟踪浏览器用户身份的会话方式。cookie保存不太敏感的数据，session保存敏感的数据

### 引用

```javascript
var session = require("express-session");
```

### 配置

```javascript
//该插件会为req请求对象添加一个成员:req.session默认是一个对象
//这是最简单的配置方式
//Session是基于Cookie实现的
app.use(session({
  //配置加密字符串，他会在原有的基础上和字符串拼接起来去加密
  //目的是为了增加安全性，防止客户端恶意伪造
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,//无论是否适用Session，都默认直接分配一把钥匙
  cookie: { secure: true }
}))
```

### 使用

```javascript
// 读
//添加Session数据
//session就是一个对象
req.session.foo = 'bar';

//写
//获取session数据
req.session.foo

//删
req.session.foo = null;
delete req.session.foo
```

提示：

默认Session数据时内存储数据，服务器一旦重启，真正的生产环境会把Session进行持久化存储。