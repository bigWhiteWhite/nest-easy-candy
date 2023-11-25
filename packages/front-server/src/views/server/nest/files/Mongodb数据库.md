# MongoDB 数据库

## 创建数据库

**下载 MongoDB**

- ```js
  https://www.mongodb.com/try/download/community // 下载社区版， 安装时不要勾选MongoDB Compass
  https://developer.aliyun.com/article/721720 // 可视化工具
  http://www.qubiancheng1024.com/details/6245c718bcc87857d9280c13 // 启动数据库
  ```

- 开机启动数据库

  - 配置 bin 目录至**环境变量**

  - data 下创建**db 和 log 目录**，log 目录下创建**mongo.log 日志文件**

  - ```js
    mongod --dbpath "D:\Code\mongodb\data\db" --logpath "D:\Code\mongodb\data\log\mongo.log" -install -serviceName "MongoDB"

    mongod --dbpath "D:\Code\mongodb\data\db" --logpath "D:\Code\mongodb\data\log\mongo.log" -install -serviceName "MongoDB" --auth
    ```

  - ```js
    sc delete mongodb
    mongod --dbpath "D:\Code\mongodb\data\db" --logpath "D:\Code\mongodb\data\log\mongo.log" -install -serviceName "MongoDB"
    net start mongodb
    ```

  - ```js
    http://127.0.0.1:27017/   // 打开这个网址查看数据库有无启动成功
    ```

## 原生命令

### 权限机制

- 创建账户

  - ```typescript
    // 角色创建文章： https://www.cnblogs.com/dbabd/p/10811523.html
    db.createUser({
        "user":"账号",
        "pwd":"密码",
        "roles":[{
            role:"角色",
            db:"所属数据库"
        }]
    })
    use admin               //要先进入admin
    db.system.users.find().pretty()
    ```

- 退出卸载服务(应该不用每次都卸载,除非是一个新的数据库)

  - ```typescript
    // 退出卸载服务，不然后面的都不生效,管理员身份启动cmd
    mongod --remove         Dos窗口必须使用管理员身份运行
    Dos命令= "d:"-->进入d盘  cd mongodb-->进入mongodb目录 cd bin-->进入bin目录  mongod --remove
    ```

- 重新设置启动命令(auth)

  - ```typescript
    // log文件名不可以重复，这一步成功设置以后是没有任何的提示的
    mongod --install --dbpath  D:\Code\mongodb\data\db --logpath D:\Code\mongodb\data\mongodb.log --auth
    ```

- 重启服务

  - ```js
    net stop mongodb
    net start mongodb
    ```

```javascript
show dbs
use admin
// 添加用户(必须在对应数据库添加用户)
use shop         !!!必须在对应数据库添加用户
db.createUser({
    "user":"bigwhite",
    "pwd":"123456",
    "roles":[{
        role:"readWrite",
        db:"shop"
    }]
})

// 添加用户权限(必须在对应数据库添加用户权限)
use bigWhiteSystem
db.grantRolesToUser('bigWhite',[
        {role: 'readWrite',db: 'bigWhiteSystem'},
        {role: 'dbAdmin', db : 'bigWhiteSystem'}
    ]
)

// 修改(替换)用户权限
db.updateUser("admin",[{ role: "read", db: "test"}])

// 删除用户
use admin 因为所有的用户信息都在admin里面，所以要进入admin里面删除
db.system.users.remove({user:"bigwhite"})

// 删除权限
db.revokeRolesFromUser("admin",[{ role: "readWrite", db: "test"}])

// 修改用户密码
db.changeUserPassword('admin','66666');

// mongoose连接数据库权限
DB=mongodb://{userNmae}:{PWD}@localhost:27017/bigWhiteSystem?authMechanism=DEFAULT&authSource=bigWhiteSystem

// config
    Read：允许用户读取指定数据库
    readWrite：允许用户读写指定数据库
    dbAdmin：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile
    userAdmin：允许用户向system.users集合写入，可以找指定数据库里创建、删除和管理用户
    clusterAdmin：只在admin数据库中可用，赋予用户所有分片和复制集相关函数的管理权限。
    readAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读权限
    readWriteAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读写权限
    userAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限
    dbAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限。
    root：只在admin数据库中可用。超级账号，超级权限
// 具体角色：
    Read：允许用户读取指定数据库
    readWrite：允许用户读写指定数据库
    dbAdmin：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile
    userAdmin：允许用户向system.users集合写入，可以找指定数据库里创建、删除和管理用户
    clusterAdmin：只在admin数据库中可用，赋予用户所有分片和复制集相关函数的管理权限。
    readAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读权限
    readWriteAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读写权限
    userAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限
    dbAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限。
    root：只在admin数据库中可用。超级账号，超级权限。
```

### 启动文档

```java
U盘上：F:\编程软件\mongodb>mongod -dbpath F:\编程软件\mongodb\data\db
D盘上：D:\mongodb>mongod -dbpath D:\mongodb\data\db

1.如何启动：
在bin目录打开cmd，执行
U盘上：mongod -dbpath F:\编程软件\mongodb\data\db
D盘上：mongod -dbpath D:\mongodb\data\db
E盘上：mongod -dbpath E:\BtSoft\mongodb\data\db
设置你的mongodb的启动地址，下次无论在哪里直接打开命令行输入mongo就可以启动数据库
这条命令是开启服务，它会一直运行，只要你要使用Mongodb，这个窗口就不能关）
        ————————————————
然后打开mongo可视软件就可以
2:常用的命令
创建服务：bin/mongo.exe --install --dbpath 磁盘路径 --logpath 日志路径
删除服务：bin/mongod.exe --remove  卸载mongodb
启动服务：net start mongodb  注：service 服务名d restart/stop/start
关闭服务：net stop mongodb

mongod --dbpath "D:\Code\MoogoDB\data\db" --logpath "D:\Code\MoogoDB\log" -install -serviceName "MongoDB"
```

### 基本操作

```javascript
//数据库=>集合=>数据
//要进入bin目录输入mongo，然后在输入以下命令
1：show databases //查看数据库 如果使用可视化工具，则没必要，可以直接看到
2：use 数据库名 //选择数据库use admin (在mongodb中选择不存在的数据库不会报错，后期当该数据库有数据时，系统自动创建)
3：show collections//查看集合，进入数据库后再使用
4：db.createCollections('集合名')//创建集合
5：db.集合名.drop()//删除集合
6：use 数据库名
db.dropDatabase()//删除数据库
//exit为退出，cls为清屏
```

### 增加集合数据

```javascript
1：集合存在则直接插入数据，集合不存在则隐式创建
use test2     test2为数据库名
db.cl.insert({name:"张三",age:18})  db代表databases cl为集合名
意思就是进入数据库test2，db的cl插入数据

注意：
数据库和集合都不存在的话都隐式创建
对象的键统一不加引号方便查看，但是查看的集合数据时系统会自动加
mongodb会给每条数据增加一个id键，作为唯一标识

2：如何插入多条数据
db.cl.insert([
    {name:"张三",age:18},
    {name:"张三",age:18},
    {name:"张三",age:18}
])
test1.cl.insert([
    {name:"张三",age:18},
    {name:"李四",age:12},
    {name:"王五",age:13}
])
3：支持部分js代码
use 数据库名
for(var i = 1; i <= 10; i++){
    db.cl.insert({name:"李四"+ i,age:i})
}
```

### 查询集合数据

```javascript
1：查看集合中的数据，find里面书写条件
            use test2     已经进入则不用再次输入
            db.cl.find()/db.cl.find({})  查询所有数据
            db.cl.find({age:6,sex:'男'}) 查询age为6且sex为男的数据
            db.cl.find({},age:1)        查询所有数据中的age属性，其他属性不显示
            db.cl.find({},age:0)        查询所有数据中的除去age属性的所有数据的属性
            db.cl.find({                查询age大于5的数据
                age:{$gt:5}
            })
            db.cl.find({                查询age等于5,8,10的数据
                age:{$in:[5,8,10]}
            })
            db.cl.find().pretty()      查询格式化，比较好看
2：运算符
            $eq          ==
            $ne          !=
            $gt          >
            $gte      =>
            $lt          <
            $lte      <=
            $in          in
            $nin      !in

     2.1:$eq、$ne是表达式，必须在大括号内表示

            db.inventory.find({"tags":{$eq:"A"}})

            db.inventory.find({"tags":{$ne:"A"}})

     2.2:$gt、$gte是表达式，必须在大括号内表示

            db.inventory.find( { qty: { $gte: 25 } } )

            db.inventory.find( { qty: { $gt: 25 } } )

     2.3:$lt、$lte是表达式，必须在大括号内表示

            db.inventory.find( { qty: { $lt: 25 } } )

            db.inventory.find( { qty: { $lte: 25 } } )

     2.4:$in、$nin是表达式，必须在大括号内表示

            db.inventory.find( { qty: { $in: 25 } } )

            db.inventory.find( { qty: { $nin: 25 } } )
```

### 修改集合数据

```javascript
db.集合名.update(条件，新数据[是否新增，是否修改多条])
是否新增：指条件匹配不到数据插入(true是插入，false否不插入默认)
是否修改多条：指将匹配成功的数据都修改(true是，false否默认)

1：db.c3.updata(条件,新数据)  替换
    db.c3.updata({name:"张三"},{name:"李四"}) 将name为张三的数据的所有属性替换为name李四，不是修改，而是替换
2：db.c3.updata(条件,修改器{替换值}) 修改
    db.c3.updata({name:"张三"},{$set:{name:"李四"}}) 将name为张三的数据的name属性修改为name李四，默认修改一条
3：如何一次性写多个修改器
    db.c4.updata({name:"张三"},{
        $set:{name:"李四"},
        $inc:{age:111},
        $rename:{who:"sex"},
        $unset:{other:true}
    })



mongodb修改器：
$inc        用来增加或减少已有的键的键值(（只能为满足要求的数字）)，或者在键不存在的时候创建一个键。{"$inc":{"k1":±数字}}
$set        修改器用来指定一个键值。如果这个键不存在，则创建他，2.修改内嵌文档.例：{"$set":{"k1.k11":"v11"}}
$unset      用于将键删除.{"$unset":{"k1":1}}
$rename       修改键名 {who:"sex"}


$push       //数组修改器，如果指定的值已经存在，"$push"会想已有的数组末尾加入一个元素，要是没有就会创建一个新的数组。
            //例：{"$push":{"k1":{"k11":"v11","k12":"v12"}}

$ne         //如果一个值不在数组里面就把他加进去，如果在不添加。
            //例：update({"k1":"v1","k2":{$ne:"v2n"}},{$push:{"k2":"v2n"}})

$addToSet   //如果一个值不在数组里面就把他加进去，如果在不添加。可避免重复。
            //例：update({"k1":v1},{$addToSet{"k2":"v2n"}})

$each       //和$addToSet修改结合起来用，可以一次添加多个不同的值。
            //例：{"k1":v1},{$addToSet:{"k2":{$each:["v21","v22","v21"]}}}

$pop        //从数组中删除元素，他可以从数组中的任何一端删除元素。
            //例：{$pop:{key:1}} 从数组末尾删除一个元素.{$pop:{key:-1}} 从数组头部删除一个元素.

$pull       //基于特定条件来删除元素。例：{$pull:{"k2":"v2n"}}

$           //数组的定位修改器.
update({"k1":"v1"},{$set:{"k2.number.k2n":"newDate"}})//k2为数组，number为数组第几个,0为第一个，
update({"k2.k2n":"k2n"},{$set:{"k2.$.k2m":"v2m"}})

4：找不到就插入
     db.c3.updata({name:"王五"},{$set:{age:100}},true)
5：是否修改多条
    db.c3.updata({},{$set:{age:100}},false,true)
```

### 删除集合数据

```javascript
db.集合名.remove(条件[是否删除一条])//是否删除一条，true是，false否默认
db.remove({},false)  全部删除//默认删除多条
```

### 排序与分页

```javascript
1：排序
    db.集合.find().sort(Json数据)
    Json数据就是要排序的列/字段，值：1 升序 -1 降序
    db.cl.find().sort({age:-1})

2：Limit与Skip方法
    语法：db.集合名.find().sort().skip(数字).limit(数字)
    说明：skip跳过指定的数量（可选），limit限制查询的数量
        .count() 统计总数量
    db.cl.find().sort({age:-1}).skip(0).limit(3)

    数据库1-10数据，每页显示两条(5页)
    db.集合名.find().skip().limit(2)
    skip跳过数据的计算方式：(当前页 - 1) * 每页显示条数
    页数        skip数
    1页  1 2     0
    2页  3 4     2
    3页  5 6     4
    4页  7 8     6
    5页  9 10    8
```

### 聚合查询

https://docs.mongoing.com/aggregation/aggregation-reference/aggregation-pipeline-quick-reference#literals

```javascript
//如何统计数据，如何实现分组统计
    使用聚合查询，把数据聚合起来，然后统计
        语法：
        db.集合名称.aggregate([
            {管道:{表达式}}
            ...
        ])
//常用管道：
    $project修改输入文档的结构。可以用来重命名、增加或删除。也可以用于创建计算结果以及嵌套文档
    $match：用于过滤数据，只输出符合条件的文档。
    $limit：用来限制MongoDB聚合管道返回的文档数。
    $skip：在聚合管道中跳过指定数量的文档，并返回余下的文档。
    $unwind：将文档中的某一个数组类型字段拆分成多条，每条包含数组中的一个值。
    $group：将集合中的文档分组，可用于统计结果。

    db.book_info.aggregate
    ({"$project":{"title":1,"vote_num":1}},{"$group":{"_id":"$title","count":{"$sum":1}}})

    _id:null 为不分组 $sum:1 为总和 $avg:"$age" 为计算年龄的平均值，像age这样的属性要加$符
    $sort：将输入文档排序后输出。
    $geoNear：输出接近某一地理位置的有序文档。
    常用表达式：
    $sum:value 求和
    $avg:value 求平均值
    $max:expr 返回组内的最大值
    $min:expr 返回组内的最小值
    $first:expr 返回分组的第一个值
    $last:expr 返回分组的最后一个值
```

### 优化索引

```javascript
//索引是一种排序好的便于快速查询的的数据结构
优点：提高数据查询的效率，降低数据库的io成本，通过索引对数据进行排序，降低数据排序的成本，降低cpu的消耗
消耗：占用磁盘空间，大量适应影响SQL语句效率，因为每次插入和修改数据都需要更新索引

//创建索引：db.集合名.createIndex(待创建索引的列[额外选项])
    db.cl.createIndex({name:1},{name:"bigwhite"}) 给name创建索引，并且索引起名为bigwhite
    待创建索引的列：(键:1,...,键:-1)
    说明：1升序-1降序 列如{age:1}表示创建age索引并按照升序的方式存储
    额外选项：设置索引的名称或者唯一索引等

//删除索引语法：
    全部删除:db.集合名.dropIndexes() 不会删除系统索引
    删除指定:db.集合名.dropIndex(索引名)

//查看索引语法：
    全部查看 db.集合名.getIndexes()

//创建组合索引
    一次性给两个字段建立索引
    db.集合名.createIndex({键1：方式，键2：方式})
    db.cl.createIndex({name:1,age:1})

//创建唯一索引
    db.集合名.createIndex(待添加索引的列,{unique:列名})
    db.cl.createIndex({name:1},{unique:"name"})

//分析索引
    db.集合名.find()explain("executionStats")  主要看加了索引以后过滤多少条数据，时间，等信息
    COLLSCAN      全表扫描
    IXSCAN         索引扫描
    FETCH          根据索引去检索指定的document

    db.cl.createIndex({age:1})
    db.集合名.find()explain("executionStats")

//索引选择规则
    为常做条件，排序，分组的字段建立索引
    选择唯一性索引            (同值较少的如性别字段)
    选择较小的数据列，为较长的字符串使用前缀索引 (索引文件更小)
```

### 备份还原

```javascript
一：备份数据库
        导出数据语法：mongodump -h -port -u -p -d -o
        -h             host           服务器IP地址(一般不写 默认本机)
        -port                     端口(一般不写,默认27017)
        -u             user         账号
        -p             pwd         密码
        -d             database     数据库(留心：数据库不写则导出全局)
        -o             open         备份到指定目录下

        1：mongodb的全部数据备份，在bin目录执行dos命令
        mongodump -u bigwhite -p 123456  -o D:\mongodb\bak(新建的用来存储备份的文件夹)

        2：mongodb的指定数据备份，在bin目录执行dos命令
        mongodump -u bigwhite -p 123456 -d shop -o D:\mongodb\bak(新建的用来存储备份的文件夹) shop为数据库名
        逻辑上root管理员有所有权限，但是有时候不行，备份指定的数据库时，要用那个数据库的用户
        mongodump -u shop1 -p 123456 -d shop -o D:\mongodb\bak  shop1为shop的用户

 二：还原数据库
        还原数据语法：mongorestore -h -port -u -p --drop 备份数据目录
        还原全部数据：mongorestore -u bigwhite -p 123456 --drop D:\mongodb\bak
        还原指定数据：mongorestore -u shop2 -p 123456 -d shop --drop D:\mongodb\bak\shop
        还原指定的数据库时，要用那个数据库的用户

        还原数据说明
        -h             host           服务器IP地址(一般不写 默认本机)
        -port                     端口(一般不写,默认27017)
        -u             user         账号
        -p             pwd         密码
        -d             database     不写则还原全部数据
        --drop                     先删除数据库再导入，不写则覆盖
```

# mongoose

```javascript
var mongoose = require('mongoose')
var Schema = mongoose.Schema
//连接数据库
mongoose.connect('mongodb://localhost:27017/student', {
	useNewUrlParser: true
})

//监听数据库连接状态
mongoose.connection.once('open', () => {
	console.log('数据库连接成功……')
})
mongoose.connection.once('close', () => {
	console.log('数据库断开……')
})

//创建Schema对象（约束）
var stuSchema = new Schema({
	name: String,
	age: Number,
	gender: {
		type: String,
		default: 'male'
	},
	addr: String
})

//将stuSchema映射到一个MongoDB collection并定义这个文档的构成
var stuModle = mongoose.model('student', stuSchema)

//向student数据库中插入数据
stuModle.create(
	{
		name: '小明',
		age: '20',
		addr: '天津'
	},
	(err, docs) => {
		if (!err) {
			console.log('插入成功' + docs)
		}
	}
)
/*
 * 控制台结果：
 * 数据库连接成功……
 * 插入成功{
 *   gender: 'male',
 *   _id: 6017a189372ece49089d79c7,
 *   name: '小明',
 *   age: 20,
 *  addr: '天津',
 *   __v: 0
 * }
 */
/*
 * 数据库结果：
 * | _id                      | gender | name | age  | addr | __v  |
 * | ------------------------ | ------ | ---- | ---- | ---- | ---- |
 * | 6017a189372ece49089d79c7 | male   | 小明  | 20   |  天津 | 0    |
 */
```

## 查询

|   查询条件    |                             说明                             |
| :-----------: | :----------------------------------------------------------: |
|      $or      |                            或关系                            |
|     $nor      |                          或关系取反                          |
|      $gt      |                             大于                             |
|     $gte      |                           大于等于                           |
|      $lt      |                             小于                             |
|     $lte      |                           小于等于                           |
|      $ne      |                            不等于                            |
|      $in      |                        在多个值范围内                        |
|     $nin      |                       不在多个值范围内                       |
|     $all      |                       匹配数组中多个值                       |
|    $regex     |                      正则，用于模糊查询                      |
|     $size     |                         匹配数组大小                         |
| $maxDistance  |                  范围查询，距离（基于 LBS）                  |
|     $mod      |                           取模运算                           |
|     $near     |             邻域查询，查询附近的位置（基于 LBS）             |
|    $exists    |                         字段是否存在                         |
|  $elemMatch   |                      匹配内数组内的元素                      |
|    $within    |                     范围查询（基于 LBS）                     |
|     $box      |                      范围查询，矩形范围                      |
|    $center    |                      范围查询，圆形范围                      |
| $centerSphere |                      范围查询，球形范围                      |
|    $slice     | 查询字段集合中的元素（比如从第几个之后，第 N 到第 M 个元素） |

### 精准查询

```js
//Mongodb数据库表
const systemUser = require('../../models/user');
systemUser.find({name:'xiaoming'}).exec(function(err,rs){}
```

### 多条件模糊查询

```js
//Mongodb数据库表
const systemUser = require('../../models/user');
//前端传入的要查询的关键字
var name = req.query.name;
var page = req.query.page || 1; //当前页数
var limitNums = 10; //指定每一页查询的条数
page = parseInt(page);
var skipNums = (page - 1) * limitNums; //跳过指定数量
//正则匹配 i忽略大小写
var reg = new RegExp(name, "i");
var _filter = {
    //多字段匹配
    $or: [
        {name: {$regex: reg}},
        {description: {$regex: reg}},
        {owner: {$regex: reg}},
    ]
}
systemUser.find(_filter).
//跳过指定数量的数据
skip(skipNums).
//指定从MongoDB中读取的记录条数。
limit(limitNums).
sort({createTime:-1}).
.exec(function(err,rs){}
```
