建立admin(后台管理文件夹)，web(应用)，server(服务器)文件夹

## node

建立文件夹，结构如下，index.js为入口文件，routes为众多路由，plugins存放数据库的入口文件，models存放数据库不同的模块

<img src="C:\Users\89179\AppData\Roaming\Typora\typora-user-images\image-20210426214647479.png" alt="image-20210426214647479" style="zoom: 67%;" />

### 初始化

```javascript
cnpm init -y		//初始化
cnpm install nodemon --save  //下载文件监测模块
//"serve":"nodemon index.js", 修改packag.json文件在"scripts"
npm run serve 	//启动命令
node + xxx.js	//入口文件启动
```

### 下载依赖

```javascript
npm i express mongoose 
npm i cors express-session	//cors跨域
npm i bcryptjs   jsonwebtoken	//加密和token
npm i inflection multer cos-nodejs-sdk-v5
npm i http-assert	//错误提示
npm install vue2-editor//文本编辑器
//下载所有的依赖
```

### package.json

```javascript
"main": "index.js",//入口文件
"scripts": {
    "serve": "nodemon index.js",//nodemon启动监听的文件
    "test": "echo \"Error: no test specified\" && exit 1"
},
```

## 注意

```javascript
//如果是复用，那么axios里面的加请求头，让服务器校验登陆状态先先注释掉，权限中间件也先不要使用
```



## 入口文件index.js配置

```javascript
const express = require('express')
const app = express()

app.set('secret','sgrayhome')
app.use(require('cors')())
app.use(express.json())

//require要后引入，不然前面的app.use有问题，例如跨域
require('./routes/admin/index.js')(app)
require('./routes/web/index.js')(app)//
require('./plugins/db.js')(app)

app.use('/uploads',express.static(__dirname + '/uploads'))//托管静态图片地址
//下面两个想不要使用，有打包文件再使用
app.use('/gray',express.static(__dirname + '/gray'))//托管静态打包后项目地址
app.use('/',express.static(__dirname + '/web'))//托管静态打包后项目地址


app.listen(3000,()=>{

    console.log('已连接酒店服务器，端口3000')

})

```

## 路由设置

### admin/index.js复用接口

```javascript
module.exports = app =>{//传入express模块
    const express = require('express')
/**合并url参数。把父级app.use中的参数合并到router实例中，这样才能在接口中通过res.params.resource获取到 app.use父级中的resource动态参数*/
    const router = express.Router({//创建路由
        mergeParams:true
    })
    //需要用到的依赖
    const dayjs = require('dayjs')
    const jwt = require('jsonwebtoken')//token处理依赖
    //验证中间件和资源中间件
    const authMiddleware = require('../../middleware/auth')
    const resourceMiddleware = require('../../middleware/resource')
    //需要用到的数据库，不需要就不要引入
    const Subbranch = require('../../models/Subbranch')
    const Category = require('../../models/Category')
    const AdminUser = require('../../models/AdminUser')
    
    router.get('/',async (req,res)=>{//测试接口
        res.send("服务器请求成功！！！")
    })
    //把子路由挂载上去 (rest代表的是通用的接口；resource用来动态获取接口地址，如category),初始化先不要引用中间件
 	app.use('/admin/api/rest/:resource', resourceMiddleware(), router)
    //authMiddleware(), 
}
```

##### 后端注册登陆

```javascript
  //注册
  app.post('/admin/api/register', async (req, res) => {
    const {username} = req.body
    const user = await AdminUser.findOne({username})
    if(!user){
        //把客户端传递过来的数据存储在数据库中
        await AdminUser.create(req.body, (err) => {
            err && res.send({ code: 0, msg: '请求出错，请稍后再试' })
            res.send({ code: 1 })
        })
    }else{
        return res.status(423).send({
            message:'用户已存在'
        })
    }
  })

  //登录
  app.post('/admin/api/login', async (req, res) => {
    const { name, password } = req.body

    /**
     * 由于在Admin模型中设置了password字段默认不被查出来（select:false），如果想要查询
     * password这个字段，用select('+password')表示增加查询password这个字段
     */
    const user = await Admin.findOne({ name }).select('+password')
    //1.查询不到用户
    if(!user){
        return res.status(422).send({
            message:'用户不存在'
        })
    }

    //2.校验密码
    //用用户传进来的password和数据库中查到的用户password值进行对比 
    const isValid = require('bcryptjs').compareSync(password, user.password)

    //密码错误
    if(!isVaild){//return是为了在axios中全局捕获，返回错误信息
        return res.status(422).send({
            message:'密码错误'
        })
    }

    //3.返回token
    //生成token
    const token = jwt.sign({
      id: user._id
    }, app.get('secret'))

    res.send({
      code: 1,
      token
    })
  })
```



##### 增加

```javascript
 //增加 ,复用接口前，具体的接口为/admin/api/rest/adminUser adminUser就是:resource,代表着进去模块AdminUser里面，是对应的名字
    router.post('/', async (req, res) => {
        //增加一级分类，删除 parent 字段
        !req.body.parent && delete req.body.parent

        //针对有 name 字段的模型，所有那么不可以重复，如果不想有这个校验，可以取其他的字段名如：hotelName
        let { name } = req.body
        if (name) {
            let data = await req.Model.find({ name })
            if (data.length) {
                res.send({ code: 0, msg: '名称重复' })
                return
            }
        }

        //把客户端传递过来的数据存储在数据库中
        await req.Model.create(req.body, (err) => {
            err && res.send({ code: 0, msg: err.errmsg })
            res.send({ code: 1 })
        })
    })
```

##### 删除

```javascript
//删除
router.post('/delete/:id', async (req, res) => {
    console.log(req.params);
    //是否存在
    let { _id } = req.params
    if (_id) {
        let data = await req.Model.find({ _id })
        if (data.length) {
            res.send({ code: 0, msg: '不存在' })
            return
        }
    }
    await req.Model.findByIdAndDelete(req.params.id).exec((err, data) => {
        err && res.send({ code: 0, msg: err.errmsg })
        res.send({ code: 1 })
    })
})
```

##### 删除模块集合中的数组中的数据

```javascript
router.post('/delete/roomImg/:uid', async (req, res) => {
    await req.Model.updateMany({$pull:{'roomImage':{'uid':req.params.uid}}},function(err2,doc2){
        config.log(err2)
    })
})
```

##### 批量删除  

还没有使用过

```javascript
 /*** 批量删除* @param {array} ids 包含多个 id 字段的集合*/
  router.delete('/deleteMany', async (req, res) => {
    await req.Model.remove({ _id: { $in: [...req.body.ids] } }).exec((err, data) => {
      err && res.send({ code: 0, msg: err.errmsg })
      res.send({ code: 1 })
    })
  })
```

##### 搜索

还没有使用过

```javascript
/*** 搜索* @param {string} name 名称* @param {string} title 标题 */
router.get('/search', async (req, res) => {
    let query = {}
    let { title, name } = req.query

    if (title) {
        //适用文章模型用标题字段搜索文章
        query = { title: { $regex: title } }
    } else {
        //适用其他模型用名称字段搜索内容
        query = { name: { $regex: name } }
    }

    await req.Model
        .find(query)
        .exec((err, data) => {
        err && res.send({ code: 0, msg: err.errmsg })

        let total = data.length
        res.send({ code: 1, data, total })
    })
})
```

##### *以树形结构返回所有分类列表* 

还没有使用过

```javascript
/*** 以树形结构返回所有分类列表 * @param {number} page 当前页码* @param {number} pageSize 每页数据条数* @returns {arr} 树形结构分类集合*/
router.get('/category/treeList', async (req, res) => {
    // 总条数 & 总页数 & 查询参数
    let totalCount, pages, query
    let { page, pageSize } = req.query

    query = {
        parent: undefined
    }

    totalCount = await req.Model.countDocuments(query)
    pages = Math.ceil(totalCount / pageSize)
    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 10

    // 根据条件查询数据
    await req.Model
        .aggregate([
        {
            $match: query
        },
        {
            $skip: (page - 1) * pageSize
        },
        { $limit: pageSize },
        {
            //递归查询，并添加 children 字段
            $graphLookup: {
                from: "categories",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parent",
                as: "children"
            }
        }
    ]).exec((err, data) => {
        // 出错
        err && res.send({ code: 0, msg: err.errmsg })
        res.send({ code: 1, page, totalCount, pages, pageSize, data })
    })
})
```





##### 更新

```javascript
//更新
    router.put('/:id', async (req, res) => {
        await req.Model.findByIdAndUpdate(req.params.id, req.body).exec((err, data) => {
            err && res.send({ code: 0, msg: err.errmsg })
            res.send({ code: 2 })
        })
    })
```



##### 根据id获取详情

```javascript
//通过id获取详情
router.get('/:id', async (req, res) => {
    await req.Model.findById(req.params.id).exec((err, data) => {
        err && res.send({ code: 0, msg: err.errmsg })
        res.send({ code: 1, data })
    })
})
```

##### 获取列表

```javascript
 //获取列表
router.get('/',async (req,res) =>{
    const queryOptions = {}
    if(req.Model.modelName === 'Category'){//获取上级目录列表
        queryOptions.populate = 'parent'
    }
    const items =  await req.Model.find().setOptions(queryOptions).limit(10)
    // populate表示不仅仅是获取数据，还要关联字段，关联查询
    //这里是将关联的parent字段不仅仅是要id，而是要完整的数据对象
    res.send(items)
})
```

##### 根据父类寻找子类

```javascript

  /**
   * 根据父级分类名查询子分类集合
   * @param {string} parentName 父级分类名
   * @returns {arr} 子分类数组
   */
  router.get('/category/subList', async (req, res) => {
    // 父级分类id & 查询参数
    let parentId, query
    // 父级分类名
    let { parentName } = req.query

    // 通过名称查询父级分类 id
    await req.Model.find({ name: parentName }).then(data => {
      if (data.length) {
        parentId = data[0]._id
      }

      query = {
        parent: parentId
      }
    })

    await req.Model
      .find(query)
      .exec((err, data) => {
        err && res.send({ code: 0, msg: err.errmsg })
        res.send({ code: 1, data })
      })
  })


//使用
async getCategories(){
    let url = "rest/category/category/subList?parentName=酒店资讯";//根据父类寻找子类
    this.$axios.get(url).then(res => {
        let { code, data } = res.data;
        if (code === 1) {
            this.parentList = data;
        }
    });
},
```

##### 根据子类寻找父类

```javascript
var mongoose = require('mongoose')
const Category = require('./Category')//重点是要引入父类

var Schema = new mongoose.Schema({
	name:{type:String},
    body:{type:String},
	parent:{type:mongoose.SchemaTypes.ObjectId,ref:Category}
	//表示是数据库里面的id,ref表示关联哪个数据库
},{timestamps:true})

module.exports = mongoose.model('Subbranch',Schema)
```

##### 根据页码查询数据

```javascript
/** 查询数据
    * @param {number} page 当前页码
    * @param {number} pageSize 每页数据条数
    * @returns {arr} 数据列表*/
router.post('/page', async (req, res) => {//总条数 & 总页数 
    // console.log(req.query);
    let totalCount, pages
    let { page, pageSize } = req.query

    totalCount = await req.Model.countDocuments()
    pages = Math.ceil(totalCount / pageSize) || 1
    page = parseInt(page) || 1;
    if (pageSize === 'all') {
        pageSize = totalCount
    } else {
        pageSize = parseInt(pageSize) || 10
    }
    const queryOptions = {}//不仅要id，而是要关联的数据库的全部信息
    if(req.Model.modelName === 'Category' || req.Model.modelName === 'Subbranch'){//Article
        queryOptions.populate = 'parent'
    }
    //const items =  await req.Model.find().setOptions(queryOptions).limit(10)
    // const items =  await req.Model.find().setOptions(queryOptions)

    await req.Model.find().setOptions(queryOptions).skip((page - 1) *pageSize)
    .limit(pageSize).exec((err, data) => {
        // 出错
        if(err){return res.send({ code: 0, msg: err.errmsg})}
        // err && res.send({ code: 0, msg: err.errmsg })
        res.send({ code: 1, page, totalCount, pages, pageSize, data })})
})

```

#### 聚合查询

聚合查询是当你的一个model关联了另外一个model的时候

```javascript
//民宿下寻找   http://localhost:3000/gray/api/rest/subbranch/subbranch/list
//分类下寻找  http://localhost:3000/gray/api/rest/category/subbranch/list
//req.Model的值很重要，决定了去哪一个表中寻找子集
router.get('/subbranch/list/:name', async (req, res) => {
    //console.log(req.params)
    // 首先去分类哪里根据name找出parent的id，以便下面查找parent的子集，也就是佛山下面所有的民宿
    const parent = await Category.findOne({
        name: req.params.name//使用：传递的参数存放在params里面
    })
    //console.log(parent);
    // 聚合查询
    const categories = await req.Model.aggregate([//req.Model的值很重要，决定了去哪一个表中寻找子集
        // 查找 parent id 为城市分类的分类
        { $match: { parent: parent._id } },
        {
            // 类似于关系数据库里的 join 做外连接查另外一个集合
            $lookup: {
                // 关联哪个表/集合（集合的名字和模型名一一对应，默认情况下，是小写+复数形式，如 模型名：Article，集合名：articles）
                from: 'subbranches',
                localField: '_id',
                // 外键字段是 subbranchs 里的 parent 
                foreignField: 'parent',
                // 起名为
                as: 'subbranchList'
            }
        }
    ])
    categories.forEach((item)=>{//转换时间格式
        item.createdAt = dayjs(item.createdAt).format('YYYY/MM/DD-HH:mm:ss')
        item.updatedAt = dayjs(item.createdAt).format('YYYY/MM/DD-HH:mm:ss')
    })
	//插入随机推荐的商品
    // const subCategories = categories.map(item => item._id)
    // categories.unshift({
    //         name: '推荐',
    //         subbranchList: await Subbranch.find()
    // })

    res.send(categories)
})
```

##### 有条件的筛选

```javascript
//查询高性价比
router.get('/subbranch/cost/:name', async (req, res) => {
    const parent = await Category.findOne({
        name: req.params.name//使用：传递的参数存放在params里面
    })
    const categories = await req.Model.aggregate([//req.Model的值很重要，决定了去哪一个表中寻找子集
        { $match: { parent: parent._id,cost_effective:'true'} },//筛选出符合条件的数据
        {
            $lookup: {
                from: 'subbranches',
                localField: '_id',
                foreignField: 'parent',
                as: 'subbranchcost'
            }
        },
    ])
    categories.forEach((item)=>{
        item.createdAt = dayjs(item.createdAt).format('YYYY/MM/DD-HH:mm:ss')
        item.updatedAt = dayjs(item.createdAt).format('YYYY/MM/DD-HH:mm:ss')
    })
    res.send(categories)
})
```





#### 上传图片

本地服务器

```javascript
//写在app.use动态参数的后面，特殊不可以参与动态路由匹配
const multer = require('multer') //npm i multer文件解析
const upload = multer({dest:__dirname + '/../../uploads'})//绝对路径
app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res) => {
    //之所以可以用req.file获取到文件数据，是因为用multer库的upload.single('file')将file参数赋值到req上
    const file = req.file
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(flie)
})
```

### 中间件

#### 资源中间件

```javascript
//资源中间件
module.exports = () => {
     return async (req, res, next) => {
          /**获取resource字段是接口的名称，如category，由于接口名称和模型名称是一样的，除了模型名称
          * 的首字母需要大写。后面需要操作模型，因为需要获取接口地址把接口地址的首字母转成大写
         */
          //npm i inflection  将请求的参数categories转换为 req.Model
          //找到模块 req.Model的位置，所以说数据库的名字和请求的参数不能随便起名
      	const modelName = require('inflection').classify(req.params.resource)
      	model = require(`../models/${modelName}`)
      	req.Model = model
      	next()
    }
}
```

#### 权限中间件

```javascript
//验证中间件
module.exports = () => {
    return async (req, res, next) => {
      const jwt = require('jsonwebtoken')

      //引入Admin模型
      const Admin = require('../models/Admin')

      //获取token
      let token = ''
      if (req.headers.authorization) {
        token = String(req.headers.authorization).split(' ').pop()
      }

      //没有token告知用户先登录
      if (!token) {
        res.send({
          code: 110,
          msg: '请先登录'
        })
      }

      //通过从前端获取的token解密出是哪个id生成的
      const { id } = jwt.verify(token, req.app.get('secret'))

      //查询出这个user挂载到req中
      req.user = await Admin.findById(id)

      if (!req.user) {
        res.send({
          code: 110,
          msg: '请先登录'
        })
      }

      next()
    }
}
```



腾讯云

```javascript
//写在app.use动态参数的后面，特殊不可以参与动态路由匹配
let multer = require('multer') //npm i multer
let upload = multer({//文件存放地址,自己建立文件夹
    dest: './tmp/'     
})

// 腾讯云COS
  let COS = require('cos-nodejs-sdk-v5');

  let cos = new COS({
    SecretId: 'xxx',
    SecretKey: 'xxx'
  });

  app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res) => {
    //之所以可以用req.file获取到文件数据，是因为用multer库的upload.single('file')将file参数赋值到req上
    let file = req.file
    //文件路径
    let FilePath = file.path;
    //文件名
    let fileName = file.filename
    var time = new Date().getTime();

    //上传文件至腾讯云COS
    cos.sliceUploadFile({
      Bucket: 'xxx',
      Region: 'xxx',
      Key: `${fileName}${time}.jpg`,
      FilePath
    }, (err, data) => {
      err && res.status(403).send({ code: 0, msg: err.errmsg });
      res.send({ code: 1, data: `https://${data.Location}` });
    });
  })
```



## 数据库连接

### plugins下的db.js

```javascript
module.exports = app=> {
    var mongoose = require('mongoose')
    mongoose.connect('mongodb://localhost:27017/client', {useNewUrlParser: true ,useUnifiedTopology: true })
	//链接至client数据库
        //监听数据库连接状态
    mongoose.connection.once('open',()=>{
        console.log('酒店数据库连接成功……')
    })
    mongoose.connection.once('close',()=>{
        console.log('数据库断开……')
    })
}
```



## 数据库模块

### Category.js

```javascript
var mongoose = require('mongoose')

var Schema = new mongoose.Schema({
	name:{type:String},
	parent:{type:mongoose.SchemaTypes.ObjectId,ref:'Category'}
	//表示是数据库里面的id,ref表示关联哪个数据库
})

module.exports = mongoose.model('Category',Schema,'Categorys')

```

### AdminUser.js

```javascript
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  name: { type: String },
  password: {
        type: String,/
        select: false,/查询这个模型的时候不查询password这个字段
        //密码需要加密
        set(val) {
          var bcrypt = require('bcryptjs');
          //加密强度为10
          var salt = bcrypt.genSaltSync(10);
          //使用bcrypt库的散列（同步）方法对值进行加密后再存入数据库
          return bcrypt.hashSync(val, salt)
        }
  },
  remark: String
},
  {timestamps: true}// 自动添加 createdAt & updatedAt 字段
)
module.exports = mongoose.model('AdminUser', schema,'AdminUsers')
```

### 其他模块

```javascript
var mongoose = require('mongoose')
const Category = require('./Category')			//记得如果关联了这个数据库，就一定要引入它

var Schema = new mongoose.Schema({
	address:{type:String},						//普通字符串
	roomImage:[{								//数组中存储多个对象
		uid:{type:String},
		name:{type:String},
		url:{type:String}
	}],
	room:{										//对象中存储固定的字符串信息
		bedroom:{type:String},
		region:{type:String},
		people_num:{type:String},
		toilet:{type:String},
	},
	room_start:[{type:String}],					//数组中的对象
	room_end:[{type:String}],					//数组中的对象
    tags:[//房源标签							 //数组中存储多个对象
		{type:String}
	],
	cost_effective:{
		type:Boolean,							//存储布尔值，默认为false
		default:false
	},
	parent:{type:mongoose.SchemaTypes.ObjectId,ref:Category}
	//表示是数据库里面的id,ref表示关联哪个数据库
},{timestamps:true})

module.exports = mongoose.model('CostEffective',Schema)
```





# vue@2

## 引入axios

### 模块化axios

新建http.ts文件

```javascript
import { Message } from 'element-ui'
import router from './router'
import axios from 'axios'

const axios = axios.create({
  // 加了斜杠，前缀默认为域名地址  
  //baseURL: process.env.VUE_APP_BASE_URL || '/admin/api/'
  baseURL:"http://localhost:3000/admin/api"
})

axios.interceptors.request.use(function (config) {
  if (localStorage.token) {
    config.headers.Authorization = `Bearer ${localStorage.token}`
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});
//全局捕获，拦截器
axios.interceptors.response.use((res) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  const { code } = res.data

  if (code !== 1) {
    const { msg } = res.data

    if (msg) {
      Message.error(msg)
    }

    if (code === 110) {
      router.push('/login')
    }
  }

  return res;
}, (err) => {
   //任何超出200范围的状态码都会触发此函数
  	if(err.response.data.message){
        //console.log(err.response);//错误对象的响应数据
        Vue.prototype.$message.error(err.response.data.message)//使用element的提示功能
        return Promise.reject(err)
    }
});

export default axios
```

main.js中引入

```javascript
import axios from './http'

Vue.prototype.$axios = axios    //挂载到实例对象上，全局引入
```

## 登陆注册

```javascript
//登录
async login() {
    this.loading = true;
   // const res =await this.$axios.post('login',this.model)
    await this.$axios.post("login", this.info).then(res => {
        this.loading = false;
        const { code, token } = res.data;
        if (code === 1) {
            localStorage.token = token;
            this.$router.push("/");
        } else if (code === 101) {
            //账号不存在
            this.register();
        }
    });
},
//注册
register() {
    let { info } = this;

    this.$axios.post("register", info).then(res => {
        if (res.data.code === 1) {
            this.login();
        }
    });
}
```

