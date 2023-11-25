## 对象方法

### Object.keys()

`**Object.keys()**` 方法会返回一个由一个给定对象的自身可枚举属性组成的数组，数组中属性名的排列顺序和正常循环遍历该对象时返回的顺序一致 。

```js
var arr = ['a', 'b', 'c']
console.log(Object.keys(arr)) // console: ['0', '1', '2'] 数组

// array like object
var obj = { 0: 'a', 1: 'b', 2: 'c' }
console.log(Object.keys(obj)) // console: ['0', '1', '2']
```

### Object.values()

`**Object.values()**`方法返回一个给定对象自身的所有可枚举属性值的数组，值的顺序与使用[`for...in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in)循环的顺序相同 ( 区别在于 for-in 循环枚举原型链中的属性 )。

```js
var obj = { 0: 'a', 1: 'b', 2: 'c' }
console.log(Object.values(obj)) // console: ['a', 'b', 'c']
```

### Object.entries()

`**Object.entries()**`方法返回一个给定对象自身可枚举属性的键值对数组，其排列与使用 [`for...in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in) 循环遍历该对象时返回的顺序一致（区别在于 for-in 循环还会枚举原型链中的属性）。

```js
const obj = { foo: 'bar', baz: 42 }
console.log(Object.entries(obj)) // [ ['foo', 'bar'], ['baz', 42] ]

// 会进行排序
const anObj = { 100: 'a', 2: 'b', 7: 'c' }
console.log(Object.entries(anObj)) // [ ['2', 'b'], ['7', 'c'], ['100', 'a'] ]

// iterate through key-value gracefully
const obj = { a: 5, b: 7, c: 9 }
for (const [key, value] of Object.entries(obj)) {
	console.log(`${key} ${value}`) // "a 5", "b 7", "c 9"
}

// Or, using array extras
Object.entries(obj).forEach(([key, value]) => {
	console.log(`${key} ${value}`) // "a 5", "b 7", "c 9"
})
```

### Object.entries()

- **Object.fromEntries()** 方法把键值对列表转换为一个对象。

```js
const entries = new Map([
	['foo', 'bar'],
	['baz', 42]
])

const obj = Object.fromEntries(entries)

console.log(obj) // { foo: "bar", baz: 42 }

// 应用场景：将路由query参数换为对象
export const getParamsLocation = () => Object.fromEntries(new URLSearchParams(window.location.search))
```

### 去除对象中不需要的属性

- 用哪一个取决于哪个方便

```js
let student = {
	age: 20,
	name: '官人',
	sex: '男'
}
// 匿名函数，保留需要的属性
const param = (({ name, sex }) => ({ name, sex }))(student)
console.log(param) // {name: "官人"，sex: "男"}

// 利用对象去除不需要的属性
let { age, ...abc } = student
console.log(abc) // {name: "官人"，sex: "男"}
```

## 数组方法

### 数组的交集|并集|差集

**差集**

filter+includes

```js
const a = [1, 3]
const b = [4, 5]
let difference = a.concat(b).filter((v) => !a.includes(v))
console.log(difference) //[4,5]
```

Set+Array.from

向 Set 加入值的时候，不会发生类型转换，所以**3 和'3'是不同的值**。

```js
let aSet = new Set(a)
let bSet = new Set(b)
let difference = Array.from(new Set(a.concat(b).filter((v) => !aSet.has(v))))
console.log(difference) //[4,5]
```

### find()

该方法主要应用于查找第一个符合条件的数组元素。它的参数是一个回调函数。在回调函数中可以写你要查找元素的条件，当条件成立为 true 时，返回该元素。如果没有符合条件的元素，返回值为 undefined。

**以下代码在 myArr 数组中查找元素值大于 4 的元素，找到后立即返回。返回的结果为查找到的元素：**

```jsx
const myArr = [1, 2, 3, 4, 5, 6]
var v = myArr.find((value) => value > 4)
console.log(v) // 5
```

**没有符合元素，返回 undefined:**

```jsx
const myArr = [1, 2, 3, 4, 5, 6]
var v = myArr.find((value) => value > 40)
console.log(v) // undefined
```

回调函数有三个参数。value：当前的数组元素。index：当前索引值。arr：被查找的数组。

查找索引值为 4 的元素：

```jsx
const myArr = [1, 2, 3, 4, 5, 6]
var v = myArr.find((value, index, arr) => {
	return index == 4
})
console.log(v) // 5
```

### findIndex()

findIndex()与 find()的使用方法相同，只是当条件为 true 时 findIndex()返回的是索引值，而 find()返回的是元素。如果没有符合条件元素时 findIndex()返回的是-1，而 find()返回的是 undefined。findIndex()当中的回调函数也是接收三个参数，与 find()相同。

```jsx
const bookArr = [
	{
		id: 1,
		bookName: '三国演义'
	},
	{
		id: 2,
		bookName: '水浒传'
	},
	{
		id: 3,
		bookName: '红楼梦'
	},
	{
		id: 4,
		bookName: '西游记'
	}
]
var i = bookArr.findIndex((value) => value.id == 4)
console.log(i) // 3
var i2 = bookArr.findIndex((value) => value.id == 100)
console.log(i2) // -1
```

### filter()

filter()与 find()使用方法也相同。同样都接收三个参数。不同的地方在于返回值。filter()返回的是**数组**，数组内是所有满足条件的元素，而 find()只返回第一个满足条件的**元素**。如果条件不满足，filter()返回的是一个空数组，而 find()返回的是 undefined

```jsx
var userArr = [
	{ id: 1, userName: 'laozhang' },
	{ id: 2, userName: 'laowang' },
	{ id: 3, userName: 'laoliu' }
]
console.log(userArr.filter((item) => item.id > 1))
//[ { id: 2, userName: 'laowang' },{ id: 3, userName: 'laoliu' } ]
```

数组去重：

```jsx
var myArr = [1, 3, 4, 5, 6, 3, 7, 4]
console.log(myArr.filter((value, index, arr) => arr.indexOf(value) === index))
//[ 1, 3, 4, 5, 6, 7 ]
```

### includes

includes() 方法用于判断**字符串或者数组**是否包含指定的子字符串---返回的是布尔值

```js
const str = 'a,b,c,d,e,g'
console.log(str.includes('e')) // true

const arr = ['张三', '李四', '王五']
console.log(arr.includes('潇洒哥')) // false
```

## 基本类型方法

### Number

#### toFixed()

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed

```js
numObj.toFixed(digits)

var numObj = 12345.6789

numObj.toFixed() // 返回 "12346"：进行四舍六入五看情况，不包括小数部分
numObj.toFixed(1) // 返回 "12345.7"：进行四舍六入五看情况
```

`toFixed()` 方法使用定点表示法来格式化一个数值。**digits**小数点后数字的个数；介于 0 到 20 （包括）之间

### String

#### startsWith()

用来判断当前字符串是否以另外一个给定的子字符串开头，并根据判断结果返回 `true` 或 `false`。

```js
const str1 = 'Saturday night plans'

console.log(str1.startsWith('Sat'))
// expected output: true

console.log(str1.startsWith('Sat', 3))
// expected output: false
```

#### endsWith()

用来判断当前字符串是否是以另外一个给定的子字符串“结尾”的，根据判断结果返回 `true` 或 `false`。

```js
const str1 = 'Cats are the best!'

console.log(str1.endsWith('best', 17))
// expected output: true

const str2 = 'Is this a question'

console.log(str2.endsWith('?'))
// expected output: false
```

## 函数

### 剩余参数

- 函数的形参的**最后一个参数**如果是**...为前缀**的，那么它会将剩余参数放到该参数中，并且**作为一个数组**
- ES6 引用了 rest parameter，可以将不定数量的参数放进到一个数组中
- 剩余参数和 arguments 的区别是
  - 剩余参数只包含那些没有对应形参的实参，而 arguments 对象包含了传给函数的所有实参
  - arguments 对象不是一个真正的数组，而**rest 参数是一个真正的数组**，可以进行数组的所有操作
  - arguments 是早期的 ECMAScript 中为了方便去获取所有的参数提供的数据结构，而 rest 是 ES6 中提供并且希望以此来替代 arguments

```js
function(a, b, ...args) {
  console.log(args)
}
```

### 展开语法

- 展开语法其实是浅拷贝
- 后面的数值会覆盖前面的数值

```js
const names = ['abc' ,'123']
const info = {name: 'why', age: 18 }
const name = 'why'
//1. 函数调用时
function foo (x, y) {
    consoel.log(x, y) // 'abc'  '123'
}
foo(...names)

//2. 构造数组时
const newNames = [...names, name]

//3. 构造对象字面量时ES2018, 数组会将索引作为对象的key
const obj = { ...info address: '广州市', ...names }

//4.浅拷贝
const info = {
    name: 'why',
    friend: {name: 'coder'}
}
const obj = { ...info }
obj.friend.name = 'abc'
// 拷贝过去了对象中的地址引用,所以也会改变原对象的值
console.log(info.friend.name) // 'abc'
```

## 拷贝

### 浅拷贝

- `Object.assign(target, source)`
- `展开运算符...`

## 深拷贝

```js
function deepClone(newObj, oldObj) {
	for (var k in oldObj) {
		var item = oldObj[k]
		if (item instanceof Array) {
			newObj[k] = []
			deepClone(newObj[k], item)
		} else if (item instanceof Object) {
			newObj[k] = {}
			deepClone(newObj[k], item)
		} else {
			newObj[k] = item
		}
	}
}
```

- `JSON.parse(JSON.stringify())`

  不能处理函数和正则

```js
// 定义一个深拷贝函数  接收目标target参数
function deepClone(target) {
	// 定义一个变量
	let result
	// 如果当前需要深拷贝的是一个对象的话
	if (typeof target === 'object') {
		// 如果是一个数组的话
		if (Array.isArray(target)) {
			result = [] // 将result赋值为一个数组，并且执行遍历
			for (let i in target) {
				// 递归克隆数组中的每一项
				result.push(deepClone(target[i]))
			}
			// 判断如果当前的值是null的话；直接赋值为null
		} else if (target === null) {
			result = null
			// 判断如果当前的值是一个RegExp对象的话，直接赋值
		} else if (target.constructor === RegExp) {
			result = target
		} else {
			// 否则是普通对象，直接for in循环，递归赋值对象的所有值
			result = {}
			for (let i in target) {
				result[i] = deepClone(target[i])
			}
		}
		// 如果不是对象的话，就是基本数据类型，那么直接赋值
	} else {
		result = target
	}
	// 返回最终结果
	return result
}
```

# ES6-12

## try

```js
try {
	try_statements
} catch (err) {
} finally {
}
```

## Promise

- 例子

  - 调用函数，这个函数中发送网络请求

    - 如果发送网络请求成功了，那么告知调用者发送成功，并且将相关数据返回过去
    - 如果发送网络请求失败了，那么告知调用者发送失败，并且告知错误信息

  - **没有 Promise**的时候利用**回调函数**获取结果，弊端：

    - 在封装时必须要自己设计好 callback 名称，并且正确使用

    - 如果是使用别人封装好的 requestData 或者第三方库，那么我们必须去看别人的源码，才知道它这个函数需要怎么去获取结果

    - ```js
      const requestData = (url, successCallback, failCallback) => {
      	setTimeout(() => {
      		// 模拟网络请求成功和失败结果
      		if (url === 'coder') {
      			let name = ['abc', 'cba']
      			successCallback(name) // 利用回调函数获取结果
      		} else {
      			let errMsg = '请求失败'
      			failCallback(errMsg)
      		}
      	})
      }

      requestData(
      	'coder',
      	(res) => {
      		console.log(res)
      	},
      	(err) => {
      		console.log(err)
      	}
      )
      ```

### **Promise 基本使用**

- **Promise 承诺**，一定会返回一个承诺给你，不管是成功了还是失败了都会把结果告知给你的承诺，里面已经**规范好了**所有的代码，无需知道如何实现，也就是看到 Promise 对象你就知道如何使用

- Promise 是一个类，当我们需要给与调用者一个承诺：**待会我会给你回调函数，就可以创建一个 Promise 的对象**

- 在通过**new 创建 Promise 对象**时，我们需要传入一个回调函数，我们称之为 executor

  - executor 这个回调函数会被立刻执行，并且给传入另外两个回调函数**resolve 和 reject**

  - 在我们调用**resolve 回调函数**时，会执行 Promise 对象的**then 方法**传入的回调函数

  - 当我们调用**reject 回调函数**时，会执行 Promise 对象的**catch 方法**传入的回调函数

  - ```js
    // Promise传入一个回调函数executor，会被立刻执行
    const promise = new Promise((resolve, reject) => {
    	// 回调函数，在成功时，回调resolve函数
    	resolve()
    	// 回调函数，在失败时，回调reject函数,状态一旦被确定不可更改，这个函数没有作用意义
    	reject()
    })

    // 1. 链式调用,return的都是Promise对象
    promise
    	.then(() => {
    		// promise对象的then方法,当resolve回调被执行时，就会调用then方法，那么外界就知道回调成功了
    	})
    	.catch(() => {
    		// promise对象的catch方法,当reject回调被执行时，就会调用catch方法，那么外界就知道回调失败了
    	})
    // 2. then中可以有两个回调函数
    promise.then(
    	() => {
    		// 第一个回调函数，会在Promise执行resolve函数时，被回调
    	},
    	() => {
    		// 第二个回调函数，会在Promise执行reject函数时，被回调
    	}
    )

    // 有了Promise以后
    const requestData = (url) => {
    	return new Promise((resolve, reject) => {
    		// 异步请求的代码都放在executor中
    		setTimeout(() => {
    			if (url === 'coder') {
    				let name = ['abc', 'cba']
    				resolve(name)
    			} else {
    				let errMsg = '请求失败'
    				reject(errMsg)
    			}
    		})
    	})
    }
    requestData()
    	.then((res) => {
    		console.log(res)
    	})
    	.catch((err) => {
    		console.log(err)
    	})

    requestData().then(
    	(res) => {
    		console.log(res)
    	},
    	(err) => {
    		console.log(err)
    	}
    )
    ```

### Promise 的状态

- 状态一旦确定下来，就绝对不可以更改的(锁定)

- ```js
  new Promise((resolve, reject) => {
  	// pending状态: Promise正在执行executor函数，处于悬而未决的状态
  	resolve()
  	reject() // 状态一旦被确定不可更改，这个函数没有作用意义
  }).then(
  	(res) => {
  		// fulfilled, resolve状态: 已敲定,已解决状态
  		console.log(res)
  	},
  	(err) => {
  		// reject状态: 已拒绝状态
  		console.log(err)
  	}
  )
  ```

### Promise 的 resolve 参数

- 如果 promise 的 resolve 的参数也是一个 promise，那么**当前 promise 的状态会由传入的 Promise 来决定**，相当于状态进行了移交
- 如果传入的对象里面有 then 方法，那么**当前 promise 的状态会由 then 方法决定**

```js
const newPromise = new Promise((resolve, reject) => {
    reject('err错误了')
})

new Promise((resolve, reject) => {
    resolve(newPromise) // 变成传入的promise的reject状态
}).then(res => {
    cosole.log('res:' res)
}, err => {
    cosole.log('err:' err)
})

new Promise((resolve, reject) => {
    const obj = {
        then: (resolve, reject) =>{
            resolve('123213')
        }
    }
    resolve(obj) // 当前promise的状态会由then方法决定
}).then(res => {
    cosole.log('res:' res) // 123213
}, err => {
    cosole.log('err:' err)
})
```

### Promise 的对象方法

promise 的对象方法是放在 Promise 原型上的 Promise.prototype 上的

```js
class Promise {
	constructor(executor) {
		const resolve = () => {
			this.thenBack()
		}
		const reject = () => {
			this.catchBack()
		}

		executor(resolve, reject)
	}

	then(callback) {
		this.thenBack = thenBack
	}
	catch(callback) {
		this.catchBack = catchBack
	}
}

new Promise((resolve, reject) => {
	resolve()
})
```

#### **then**

- 同一个 promise 方法被调用的时候，所有的 then 方法传入的回调函数都会被调用

- ```js
  const promise = new Promise((resolve, reject) => {
  	resolve()
  })

  promise.then(() => {
  	console.log('jasdja')
  })
  promise.then(() => {
  	console.log('ooooo')
  })
  ```

- then 方法是有返回值的，**并且返回的是 promise 对象**，即时返回的是普通值，也会用 promise 包裹起来返回 promise

- ```js
  // 如果then返回的是promise对象,后面then的状态会由return的Promise来决定，相当于状态进行了移交
  promise
  	.then(() => {
  		return new Promise((resolve, reject) => {
  			resolve('asdasd')
  		})
  	})
  	.then((res) => {
  		console.log(res)
  	})
  // 如果return的对象里面有then方法，后面then的状态会由then方法决定
  promise
  	.then(() => {
  		return {
  			then: (resolve, reject) => {
  				resolve(22222)
  			}
  		}
  	})
  	.then((res) => {
  		console.log(res)
  	})
  ```

#### catch

- ```js
  const promise = new Promise((resolve, reject) => {
  	throw new Error('reject status')
  })
  promise.catch((err) => {
  	console.log(err)
  })
  // 接口成功，但是,不是想要的结果，也可以返回reject使用catch捕获
  this.instance.interceptors.response.use((res) => {
  	if (res.status === 200) {
  		if (data) {
  			return data
  		} else {
  			return Promise.reject(data)
  		}
  	}
  })
  ```

- **catch 针对的 promise**

  ```js
  const promise = new Promise((resolve, reject) => {
  	throw new Error('reject status')
  })

  promise
  	.then((resolve, reject) => {
  		throw new Error('hhh')
  	})
  	.catch((err) => {
  		// 首先针对的是第一个promise,如果第一个promise没有异常，那么留个第二个promise,以此类推
  		console.log(err)
  		return 1 // 返回的也是promise
  	})
  	.then((resolve, reject) => {
  		// 上面一个catch触发的是then，因为返回的是promise，而不是异常
  		throw new Error('hhh')
  	})
  ```

#### **finally**

- 无论 promise 对象变成了什么状态，最后都会执行的代码

- finally 是不接受参数的，因为都会执行

- ```js
  promise
  	.then((resolve, reject) => {
  		throw new Error('hhh')
  	})
  	.catch((err) => {
  		console.log(err)
  	})
  	.finally(() => {
  		console.log('finally')
  	})
  ```

### Promise 的类方法

#### **Promise.resolve()**

```js
// 如果有一个对象想要转成promise
const promise = Promise.resolve({ name: 'nasd' })
// 相当于
const promise = new Promise((resolve) => {
	resolve({ name: 'nasd' })
})
```

#### **Promise.reject()**

```js
const promise = Promise.reject('reject message')
// 相当于
const promise = new Promise((resolve, reject) => {
	reject('reject message')
})

promise.catch((err) => {
	console.log(err)
})
```

#### **Promise.all()**

- 希望所有的 promise 都变成 fulfilled 时,再拿到结果
- 有一个 promise 变成了 rejucted，那么整个 promise 都是 rejected

```js
const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(111)
    }, 1000)
})

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(222)
    }, 2000)
})

const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(333)
    }, 3000)
})

// 希望所有的promise都变成fulfilled时,再拿到结果
Promise.all([p1, p2, p3, 'aaa']).then(res => {
    console.log(res) // [111, 222, 333, 'aaa']
}).catch(err = { // 有一个promise变成了rejucted，那么整个promise都是rejected
    console.log(err)
})
```

#### **Promise.allSettled()**

- all 方法有一个缺点，当其中一个 Promise 变成 rejucted 状态以后，新 Promise 就会变成对应的 reject 状态
  - 那么对于 resolved 的，以及依然处于 pending 状态的 Promise，我们是获取不到结果的
- 而 allSettled 不一样，该方法会在所有的 Promise 都有结果，无论是 fulfilled，还是 reject 时，才会有最终的状态
- 并且这个 Promise 的结果一定是 fulfilled 的

```js
const p1 = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve(111)
	}, 1000)
})

const p2 = new Promise((resolve, reject) => {
	setTimeout(() => {
		reject(222)
	}, 2000)
})

const p3 = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve(333)
	}, 3000)
})

Promise.allSettled([p1, p2, p3, 'aaa']).then((res) => {
	console.log(res)
	/*[
        { status: 'fulfilled', value: 1111 },
        { status: 'rejected', reason: 222 },
        { status: 'fulfilled', value: 333 }
    ]*/
})
```

#### **Promise.race()**

- 竞赛一样，多个 promise，只要**有一个变成了 fulfilled**状态，那么就结束

```js
const p1 = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve(111)
	}, 1000)
})

const p2 = new Promise((resolve, reject) => {
	setTimeout(() => {
		reject(222)
	}, 2000)
})

const p3 = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve(333)
	}, 3000)
})

Promise.race([p1, p2, p3]).then((res) => {
	console.log(res) // 111
})
```

#### **Promise.any()**

- any 方法是 ES12 中新增的方法，和 race 方法是类似的

  - any 方法会等到一个 fullfilled 状态，也就是一定要一个 fullfilled 状态，所有的 Promise 都试一遍，都要等到一个 fullfilled 状态

  - 如果所有的 Promise 都是 reject 的，那么也会等到所有的 Promise 都变成 reject 状态

  - ```js
    const p1 = new Promise((resolve, reject) => {
    	setTimeout(() => {
    		reject(111)
    	}, 1000)
    })

    const p2 = new Promise((resolve, reject) => {
    	setTimeout(() => {
    		reject(222)
    	}, 2000)
    })

    const p3 = new Promise((resolve, reject) => {
    	setTimeout(() => {
    		resolve(333)
    	}, 3000)
    })

    Promise.any([p1, p2, p3])
    	.then((res) => {
    		console.log(res) // 333
    	})
    	.catch((err) => {
    		// 全部Promise都是rejected状态才会执行catch
    		console.log(err)
    	})
    ```

## iterator 迭代器

**iterator 迭代器**

- iterator 迭代器是帮助我们对某一个数据结构**进行遍历**的对象，在 js 中，迭代器对象需要**符合迭代器协议**

- 迭代器协议定义了产生一系列值(无论是有限还是无限的标准方式)，这个标准就是一个**特定的 next 方法**

- next 方法有以下的要求

  - 一个函数，返回一个应当拥有以下两个属性的对象
  - **done**
    - 如果迭代器可以产生序列中的下一个值，则为 false(这等价于没有 done 这个值)
    - 如果迭代器已将序列迭代完毕，则为 true。这种情况下，value 是可选的，如果它依然存在，即为迭代结束之后的默认返回值
  - **value**
    - 迭代器返回的任何 JavaScript 值。done 为 true 时可以省略

- ```js
  const names = ['abc', 'asd', 'nba']
  // 创建迭代器访问数组

  const namesIterator = () => {
  	let index = 0
  	return {
  		// 返回一个迭代器对象
  		next: () => {
  			if (index < names.length) {
  				return { done: false, value: name[index++] }
  			} else {
  				return { done: true, value: undefine }
  			}
  		}
  	}
  }

  console.log(namesIterator(names).next()) // return { done: false,value: abc }
  console.log(namesIterator(names).next()) // return { done: false,value: asd }
  console.log(namesIterator(names).next()) // return { done: false,value: nba }
  console.log(namesIterator(names).next()) // return { done: true,value: undefine }
  ```

**可迭代对象**

- 迭代器和迭代对象是**不同的概念**，当一个对象实现了 iterable protocol 协议时，它就是一个可迭代对象

- 这个对象的要求是必须实现@@iterator 方法，在代码中我们使用 Symbol.iterator 访问该属性

- ```js
  const iterableObj = {
  	names: ['abc', 'cba', 'nba'],
  	[Symbol.iterator]: () => {
  		let index = 0
  		return {
  			next: () => {
  				if (index < this.names.length) {
  					return { done: false, value: this.names[index++] }
  				}
  			}
  		}
  	}
  }
  // iterableObj对象就是一个可迭代对象
  console.log(iterableObj[Symbol.iterator])

  const iterator = iterableObj[Symbol.iterator]
  console.log(iterator.next())
  console.log(iterator.next())
  console.log(iterator.next())

  // 可以生成多个迭代器
  const iterator02 = iterableObj[Symbol.iterator]

  // for...of可以遍历的东西必须是一个可迭代对象
  for (item of iterableObj) {
  	console.log(item)
  }

  // 展开运算符也是利用了迭代器
  const arr = [...iterableObj]
  // 注意：对象不是可迭代对象，之所以可以使用展开运算符不是因为迭代器
  const obj = { ...iterableObj }

  // 解构赋值
  // 注意：对象不是可迭代对象，之所以可以使用解构赋值不是因为迭代器
  const { name } = info
  ```

## generator 生成器

生成器是 ES6 新增的**一种函数控制**，使用的方案，它可以让我们更加灵活的控制函数什么时候**继续执行，暂停执行**等

- 生成器函数也是一个函数，但是和普通的函数有一些区别,**生成器函数返回生成器**

  - 生成器函数需要在 function 的后面加一个符号：\*
  - 生成器函数可以通过 yield 关键字来控制函数的执行流程
  - 生成器函数的返回值是一个 Generator(生成器)
    - 生成器事实上是一种特殊的迭代器

- ```js
  function* gen() {
  	console.log('函数开始~')

  	const a = 1
  	console.log('开始执行第一段代码')
  	yield 100 // yield可以返回值

  	// return 当生成器函数里面有return的时候，那么就会将以下的done都变为true

  	const b = 2
  	console.log('开始执行第二段代码')
  	yield 200

  	const c = 3
  	console.log('开始执行第二段代码')
  	yield 300

  	console.log('函数结束~')
  }

  gen() // 直接调用生成器函数不会执行

  const generator = gen() // 返回一个生成器，生成器也是可迭代对象

  // 开始执行第一段代码
  generator.next() // 函数开始~ 开始执行第一段代码
  // 开始执行第二段代码
  generator.next() // 开始执行第二段代码

  // 返回值
  console.log(generator.next()) // { value: 100, done: false}
  console.log(generator.next()) // { value: 200, done: false}
  console.log(generator.return()) // { value: 300, done: false} 提前终止终端生成器函数代码继续执行
  console.log(generator.next()) // { value: undefined, done: true}
  console.log(generator.next()) // { value: undefined, done: true}
  ```

- **生成器函数传递参数**

  - ```js
    // 生成器函数传递参数,用上一个yield的返回值作为下一段函数的参数
    function* gen() {
    	console.log('函数开始~')

    	const a = 1
    	const n = yield 100

    	const b = n
    	console.log(b) // abc
    	yield 200

    	console.log('函数结束~')
    }

    const generator = gen() // 如果第一段函数需要参数，可以在这里传入

    // 传递参数
    console.log(generator.next())
    console.log(generator.next('abc'))
    ```

- **生成器函数抛出异常**

  - ```js
    function* gen() {
    	console.log('函数开始~')

    	const a = 1
    	try {
    		yield a
    	} catch (err) {
    		console.log('捕获到异常' + err)
    	}

    	const b = n
    	console.log(b) // abc
    	yield 200

    	console.log('函数结束~')
    }
    const generator = gen()

    console.log(generator.next())
    console.log(generator.throw('abc')) // 抛出异常，执行结束
    ```

## async 异步函数的使用

- async 异步函数如果没有**特殊的**await，那么就和**普通函数**的执行顺序一样
- async 异步函数的返回值一定是一个 Promise
- async 异步函数中的异常，会被作为异步函数返回的 Promise 的 reject 值的
- async 异步函数可以使用 await 函数，普通函数不可以

```js
const fun = async () => {
	// 没有写返回值，默认返回undefined，那么res就为undefined
	// return 123
	/* return { 返回thenable
         then: (resolve, reject) => {
             resolve('hahaha')
         }
     }*/
	/*return new Promise((resolve, reject) => { 返回Promise
        resolve('4556')
    })*/
	throw new Error('error message')
}
console.log(fun) // Promise
fun
	.then((res) => {
		// console.log(res) // 123
		// console.log(res) // hahaha
		// console.log(res) // 4556
	})
	.catch((err) => {
		console.log(err)
	})
```

## await

- await 关键字是有 Promise 返回值的，返回的是**Promise 的 resolve 值**
- 如果**await 接收到 reject 关键字,那么 reject 会作为整一个函数的 reject**，await 后面的代码都不会再执行

```js
const fun = async () => {
	return new Promise((resolve, reject) => {
		setTimeOut(() => {
			resolve('123')
		}, 1000000)
	})
}

const useFun = async () => {
	const res = await fun()
	console.log('----------') // 一定会等到await的resolve状态才会执行
}
```

```js
const useFun = async () => {
	const res = await new Promise(() => {
		// 可以直接使用Promise
		resolve('123')
	})
}
```

## 监听对象的操作方式

**响应式的理解：有一个值或者对象，有一段代码使用了这个值，那么在这个值被改变的时候，可以自动重新执行这段代码**

### defineProperty 响应式原理

有一个对象，希望可以监听到这个对象中的属性被设置和获取的过程，vue2 通过 defineProperty 的存储属性描述符进行监听

- 缺点
  - Object.defineProperty 设计的初衷不是为了监听截止一个对象中的所有的属性的
  - 我们在定义某些属性的时候，初衷其实是定义普通的属性，但是后面我们强行将它变成了数据属性描述符
  - 如果我们想要监听更加丰富的操作，比如新增属性，删除属性，那么 Object.defineProperty 是无能为力的

```js
const obj = {
	name: 'why',
	age: 18
}
// 只监听name属性
Object.defineProperty(obj, 'name', {
	get: function () {
		console.log('监听到obj的对象的name属性被访问了') // 默认return undefined,会改变原对象，访问obj.name会为undefine
	},
	set: function () {
		console.log('监听到obj的对象的name属性被设置了')
	}
})
// 监听所有属性
Object.keys(obj).forEach(() => {
	let value = obj[key]
	Object.defineProperty(obj, 'name', {
		// 只监听name属性
		get: function () {
			console.log('监听到obj的对象被访问了')
			return value
		},
		set: function (newValue) {
			console.log('监听到obj的对象被设置了')
			value = newVlaue // 更新最新的值
		}
	})
})
```

### Proxy-Reflect 响应式原理

#### proxy

- 在 ES6 中，新增了一个**Proxy 类**，用于创建一个**代理**
  - 也就是说，如果我们希望**监听一个对象的相关操作**，那么我们**先创建一个代理对象(Proxy 对象)**
  - 之后对**该对象的所有操作**，都通过**代理对象来完成**，代理对象**可以监听我们想要对原对象进行那些操作**
- 使用 Proxy 类需要 new Proxy 对象，并且传入需要侦听的对象以及一个处理对象，可以称之为 handler
- 之后所有的操作都是直接对 Proxy 的操作，而不是原有的对象，因为我们需要在 handler 里面进行侦听

```js
const obj = {
	name: 'why',
	age: 18
}

const objProxy = new Proxy(obj, {}) // 侦听对象， 捕获器对象

console.log(objProxy.name) // why
console.log(objProxy.age) // 18

objProxy.name = 'kobe'
objPrxy.age = 30

// 没有使用Reflect,还是改变了原对象
console.log(obj.name) // 'kobe'
console.log(obj.age) // 30
```

**捕获器**

- [`handler.apply()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/apply)
- [`handler.construct()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/construct)
- [`handler.defineProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/defineProperty)
- [`handler.deleteProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/deleteProperty)
- [`handler.get()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/get)
- [`handler.getOwnPropertyDescriptor()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/getOwnPropertyDescriptor)
- [`handler.getPrototypeOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/getPrototypeOf)
- [`handler.has()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/has)
- [`handler.isExtensible()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/isExtensible)
- [`handler.ownKeys()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/ownKeys)
- [`handler.preventExtensions()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/preventExtensions)
- [`handler.set()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/set)
- [`handler.setPrototypeOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/setPrototypeOf)

```js
const objProxy = new Proxy(obj, {  // 侦听对象， 捕获器对象
    get: (target, key, receiver) => { // receiver改变对象中的this为代理对象
        return target[key] // 返回最新的值
    },
    set: (target, key, newValue, receiver) => {
    	target[key] = newValue // 设置最新的值
	},

    has(target, key), // 监听in的捕获器

    deleteProperty: (target, key) => { // 监听delete删除对象中的属性的捕获器
        delete target[key]
    }
})

objProxy.name = 'kobe'
objPrxy.age = 30

// 没有使用Reflect,还是改变了原对象
console.log(obj.name) // 'kobe'
console.log(obj.age) // 30

// 使用in判断对象中是否有这一个值
console.log('name' in objProxy) // 直接使用代理对象，使用代理对象中的has捕获器
```

#### Reflect

比较 Reflect 和 Object 方法：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/Comparing_Reflect_and_Object_methods

- ES6 新增的一个 API，它是**一个对象**，字面的意思是**反射**
- Reflect 主要提供了很多**操作 javaScript 对象**的方法，有点像 Object 中操作对象的方法
  - 比如 Reflect.getPropertypeOf(target)类似于 Object.getPropertypeOf() ,返回原型
  - 比如 Reflect.definePropertypeOf(target， propery， attributes)类似于 Object.definePropertype() ,设置原型
- 为什么需要 Reflect
  - 早期的 ECMA 规范中，没有考虑到这种**对对象本身的操作如何设计会更加规范**，所以将这些**API 放在了 Object 上面**
  - 但是**Object 作为一个构造函数**，这些操作实际上**放在它身上并不合适**
  - 另外还包含一些**类似于 in, delete 操作符**，让 js 看起来有一些奇怪
  - 所以**新增了 Reflect**，让我们这些操作都集中在 Reflect 对象上

```js
const obj = {
    name: 'why',
    age: 18
}

const objProxy = new Proxy(obj, {  // 侦听对象， 捕获器对象
    get: (target, key) => {
        return Reflect.get(target, key) // 使用Reflect返回最新的值
    },
    set: (target, key, newValue) => {
    	const result = Reflect.set(target, key, newValue) // 使用Reflect设置最新的值
		console.log(result) // true, Reflect返回一个布尔值
	},

    has(target, key), // 监听in的捕获器

    deleteProperty: (target, key) => { // 监听delete删除对象中的属性的捕获器
        delete target[key]
    }
})

objProxy.name = 'kobe'

// 使用Reflect,没有改变了原对象
console.log(obj.name) // 'why'
console.log(objProxy.name) // 'kobe'
```

### 响应式原理的实现

```js
let activeReactiveFn = null
class Depend {
    constructor() {
        this.reactiveFns = new Set() // 唯一值
    }

    addDepend(reactiveFn) { // 依赖收集
        this.reactiveFns.push(reactiveFn)
    }

    depend() {
        if(activeReactiveFn) {
            this.reactiveFns.push(activeReactiveFn)
        }
    }

    notify() { // 通知调用
        this.reactiveFns.forEach(fn => {
            fn()
        })
    }
}

const watchFn => (fn) { // 哪些函数要响应式
    activeReactiveFn = Fn
    fn()
    activeReactiveFn = null
}

// 获取对应对象中的对应属性的depend
const targetMap = new WeakMap()
const getDepend(targetm key) {
    // 根据target对象获取map的过程
    let map = targetMap.get(target) // 获取对应对象
    if(!map) {
        map = new Map()
        targetMap.set(target, map)
    }

    // 根据key获取depend对象
    let depend = map.get(kay) // 获取对应对象属性的depend
    if(!depend) {
        depend = new Depend()
        map.set(key, depend)
    }
    return depend
}

const reactive = (obj) => {
    // ES6之前使用到的监听对象的方式
    Object.keys(obj).forEach(key = {
        let value = obj[key]
        Object.defineProperty(obj, key, {
            get: () => {
                console.log(`监听到obj对象的${key}属性被访问了`)
                const depend = getDepend(obj, key)
                depend.depend()
                return value
            },
            set: (newValue) => {
                console.log(`监听到obj对象的${key}属性被设置了`)
                value = newValue
                const depend = getDepend(obj, key)
                depend.notify()
            }
        })
    })
}

const obj = {
    name: 'why', // 每一个属性都有对应的depend对象
    age: 18
}

const objProxy = reactive(obj) // 变成响应式对象
const infoProxy = reactive({
    address: 'asd',
    name: 'coder'
})

watchFn(() => { // 需要执行的响应式函数
    const newName = obj.name // 因为obj被代理了,所以会执行Proxy里面的get捕获器
    console.log('这段代码用到了obj的name，响应式时需要重新执行')
})

// 对象值被改变
obj.name = 'kobe' // 因为obj被代理了,所以会执行Proxy里面的set捕获器
obj.name = 'lobe'
```

**Proxy 依赖收集**

```js
let activeReactiveFn = null
class Depend {
    constructor() {
        this.reactiveFns = new Set() // 唯一值
    }

    addDepend(reactiveFn) { // 依赖收集
        this.reactiveFns.push(reactiveFn)
    }

    depend() {
        if(activeReactiveFn) {
            this.reactiveFns.push(activeReactiveFn)
        }
    }

    notify() { // 通知调用
        this.reactiveFns.forEach(fn => {
            fn()
        })
    }
}

const watchFn => (fn) { // 哪些函数要响应式
    activeReactiveFn = Fn
    fn()
    activeReactiveFn = null
}

// 获取对应对象中的对应属性的depend
const targetMap = new WeakMap()
const getDepend(targetm key) {
    // 根据target对象获取map的过程
    let map = targetMap.get(target) // 获取对应对象
    if(!map) {
        map = new Map()
        targetMap.set(target, map)
    }

    // 根据key获取depend对象
    let depend = map.get(kay) // 获取对应对象属性的depend
    if(!depend) {
        depend = new Depend()
        map.set(key, depend)
    }
    return depend
}

const reactive = (obj) => {
    return new Proxy(obj, { // 给obj添加代理
    get: (target, key) => {
        // 根据target，key获取对应的depend
        const depend = getDepend(target, key)
        // 给depend对象中添加响应函数
        depend.depend()
        return Reflect.get(target, key)
    },
    set: (target, key, newValue) => {
    	Reflect.set(target, key, newValue)
        const depend = getDepend(targetm key)
        depend.notify() // 每次改变值都调用notify
	}
})
}

const obj = {
    name: 'why', // 每一个属性都有对应的depend对象
    age: 18
}

const objProxy = reactive(obj) // 变成响应式对象
const infoProxy = reactive({
    address: 'asd',
    name: 'coder'
})

watchFn(() => { // 需要执行的响应式函数
    const newName = obj.name // 因为obj被代理了,所以会执行Proxy里面的get捕获器
    console.log('这段代码用到了obj的name，响应式时需要重新执行')
})

// 对象值被改变
obj.name = 'kobe' // 因为obj被代理了,所以会执行Proxy里面的set捕获器
obj.name = 'lobe'
```

**多个对象的多个属性需要被监听**

```js
const obj = { name: 'obj', age： 18 }
const info = { name: 'abc' }

const objMap = new Map()
objMap.set('name', 'nameDepend')
objMap.set('age', 'ageDepend')

const infoMap = new Map()
infoMap.set('name', 'nameDepend')

const targetMap = new WeakMap()
targetMap.set(obj, objMap)
targetMap.set(info, infoMap)

const depend = targetMap.get(obj).get('name') // 获取到obj对象中的name的依赖
depend.notify()
```

## Symbol 类型

- Symbol 的意义

  - 在 ES6 之前，对象的属性都是字符串，那么很容易造成属性名的冲突
  - 比如有一个对象，我们希望在其中添加一个属性，但是我们不知道它内部有什么内容的情况下很容易造成冲突，从而**覆盖掉**它内部的某个属性
  - 在开发中使用混入，那么混入中出现了同名的属性，必然有一个会被覆盖掉

- Symbol 的作用
  - Symbol 值是通过 Symbol 函数来生成的，生成以后可以作为属性名
  - 也就是在 ES6 中，对象的属性名可以使用字符串，也可以使用 Symbol 值

```js
const s1 = Symbol()
const s2 = Symbol('aaa') // 添加描述 console.log(s2.description) --> 'aaa'
const s3 = Symbol('aaa')

const obj = {
	[s1]: 'hhh',
	[s2]: 'ppp'
}
obj[s3] = 'asdads'

// 获取, 不可以使用.来获取对象值，那只作用于字符串
console.log(obj[s1], obj[s2], obj[s3])

// 使用Symbol作为key的属性名，在遍历Object.keys等中是获取不到这些Symbol值的
Object.getOwnPropertySymbols(obj) // 可以获取得到

// 遍历
const keys = getOwnPropertySymbols(obj)
for (const key of keys) {
	console.log(obj[key])
}

// 如果在某些情况下想要Symbol值一样
const s2 = Symbol.for('aaa')
const s3 = Symbol.for('aaa')

const key = Symbol.keyFor(s2) // 获取Symbol值
const s4 = Symbol.for(key)
console.log(s4 === s2) // true
```

## Set 对象的基本使用

- 在 ES6 之前，存储结构主要是对象和数组，**ES6 新增了两个数据结构，Set 和 Map，以及它们的另外形式 WeakSet，WeakMap**
- Set 类似于数组，但是和数组的区别是元素不可以重复
  - **`Set`** 对象允许你存储任何类型的唯一值，无论是**原始值或者是对象引用**
  - 创建 Set 需要使用 Set 构造函数(暂时没有字面量创建的方式)

```js
let mySet = new Set()
mySet.add(42)
mySet.add(42)
mySet.add(13)
console.log(mySet) // { 42, 13 } 去除重复的

const arr = [1, 2, 3, 4, 4, 2]
const obj = new Set(arr) // 可传入可迭代值 { 1, 2, 3, 4 }
const newArr = Array.from(obj) // 转换为数组 [ 1, 2, 3, 4 ]
const newArr = [...new Set(arr)] // 直接转化为数组
```

- Set 的 api
  - Set.prototype.add()
  - Set.prototype.clear()
  - Set.prototype.delete()
  - Set.prototype.entries()
  - Set.prototype.forEach()
  - Set.prototype.has()
  - Set.prototype.values()

## 弱引用

- 弱引用意味着 GC 回收机制在判断这个东西有没有对这个对象进行引用是不当回事的

```js
const obj = { name: 'abc' } // 如果没有其他强引用，会被回收掉

let info = new WeakRef(obj)
console.log(info.deref()) //  {name: 'abc' }

let inFo = obj // 强引用
```

## WeakSet

- WeakSet 中只能存放对象类型，不能存放基本数据类型
- WeakSet 对元素的引用是**弱引用**，如果没有其他引用对某个对象进行引用，那么 GC 可以对该对象进行回收
- 如果传入一个[可迭代对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of)作为参数, 则该对象的所有迭代值都会被自动添加进生成的 `WeakSet` 对象中。**null 被认为是 undefined**。
- 与`Set`相比，`WeakSet` 只能是**对象的集合**，而不能是任何类型的任意值。
- `WeakSet`持弱引用：集合中对象的引用为弱引用。 如果没有其他的对`WeakSet`中对象的引用，那么这些对象会被当成垃圾回收掉。 这也意味着 WeakSet 中没有存储当前对象的列表。 正因为这样，`WeakSet` 是不可枚举的。

## Map

- **`Map`** 对象保存键值对，并且能够记住键的原始插入顺序。任何值（对象或者[原始值](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive)）都可以作为一个键或一个值。

- 一个 `Map` 对象在迭代时会根据对象中元素的插入顺序来进行——一个 [`for...of`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of) 循环在每次迭代后会返回一个形式为 `[key，value]` 的**数组**。

- Map 和对象的区别

  - 对象只能使用字符串或者 Symbol 来作为对象的 key,如果使用对象作为 key，那么会转化为字符串

  - ```js
    const obj1 = { name: 'why' }
    const obj2 = { name: 'coder' }
    const info = {
    	[obj1]: 'aaa',
    	[obj2]: 'bbb'
    }
    console.log(info) // {"[object object]" : 'bbb'} 字符串相同,只有一个,覆盖掉了obj1
    ```

  - **Map 可以使用其他数据类型作为 key**

- Map 的方法

  - [`Map.prototype.clear()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/clear)
  - [`Map.prototype.delete()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/delete)
  - [`Map.prototype.entries()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/entries)
  - [`Map.prototype.forEach()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach)
  - [`Map.prototype.get()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/get)
  - [`Map.prototype.has()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/has)
  - [`Map.prototype.keys()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/keys)
  - [`Map.prototype.set()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/set)
  - [`Map.prototype.values()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/values)

**基本使用**

```js
// key => obj,string,fun,arr
const myMap = new Map([
	['key', 'value'],
	['key', 'value'],
	['key', 'value']
])

const myMap = new Map()

const keyString = 'a string'
const keyObj = {}
const keyFunc = function () {}

// 添加键 --> new Map([ ['a string', "和键'a string'关联的值"], ...])
myMap.set(keyString, "和键'a string'关联的值")
myMap.set(keyObj, '和键keyObj关联的值')
myMap.set(keyFunc, '和键keyFunc关联的值')

myMap.size // 3

// 读取值
myMap.get(keyString) // "和键'a string'关联的值"
myMap.get(keyObj) // "和键keyObj关联的值"
myMap.get(keyFunc) // "和键keyFunc关联的值"

myMap.get('a string') // "和键'a string'关联的值"，因为keyString === 'a string'
myMap.get({}) // undefined, 因为keyObj !== {}
myMap.get(function () {}) // undefined, 因为keyFunc !== function () {}
```

**使用 for..of 方法迭代 Map**

```js
onst myMap = new Map()
myMap.set(0, 'zero')
myMap.set(1, 'one')

for (const [key, value] of myMap) {
  console.log(key + ' = ' + value)
}
// 0 = zero
// 1 = one

for (const key of myMap.keys()) {
  console.log(key)
}
// 0
// 1

for (const value of myMap.values()) {
  console.log(value)
}
// zero
// one

for (const [key, value] of myMap.entries()) {
  console.log(key + ' = ' + value)
}
// 0 = zero
// 1 = one
```

**使用 forEach() 方法迭代 Map**

```js
const myMap = new Map([
	['0', ['a', 'b', 'c']],
	['1', ['d', 'f', 'g']]
])
myMap.forEach(function (value, key) {
	console.log(key + ' = ' + value)
})
// 0 = ['a', 'b', 'c']
// 1 = ['d', 'f', 'g']
```

**Map 与数组的关系**

```js
const kvArray = [
	['key1', 'value1'],
	['key2', 'value2']
]

// 使用常规的 Map 构造函数可以将一个二维键值对数组转换成一个 Map 对象
const myMap = new Map(kvArray)

myMap.get('key1') // 返回值为 "value1"

// 使用 Array.from 函数可以将一个 Map 对象转换成一个二维键值对数组
console.log(Array.from(myMap)) // 输出和 kvArray 相同的数组

// 更简洁的方法来做如上同样的事情，使用展开运算符
console.log([...myMap])

// 或者在键或者值的迭代器上使用 Array.from，进而得到只含有键或者值的数组
console.log(Array.from(myMap.keys())) // 输出 ["key1", "key2"]
```

**复制或合并 Maps**

```js
// 复制
const original = new Map([
  [1, 'one']
]);
const clone = new Map(original);
console.log(clone.get(1)); // one
console.log(original === clone); // false. 浅比较 不为同一个对象的引用

// 合并
cosnt first = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);
const second = new Map([
  [1, 'uno'],
  [2, 'dos']
]);
const merged = new Map([...first, ...second]); // 展开运算符本质上是将 Map 对象转换成数组。
console.log(merged.get(1)); // uno 合并两个 Map 对象时，如果有重复的键值，则后面的会覆盖前面的。
console.log(merged.get(2)); // dos
console.log(merged.get(3)); // three

// 与数组合并
const first = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);
const second = new Map([
  [1, 'uno'],
  [2, 'dos']
]);
const merged = new Map([...first, ...second, [1, 'eins']]);
console.log(merged.get(1)); // eins Map 对象同数组进行合并时，如果有重复的键值，则后面的会覆盖前面的。
console.log(merged.get(2)); // dos
console.log(merged.get(3)); // three
```

## WeakMap

- **`WeakMap`** 对象是一组键/值对的集合，其中的键是弱引用的。其键必须是对象，而值可以是任意的。
- map API _可以_ 通过使其四个 API 方法共用两个数组(一个存放键,一个存放值)来实现。给这种 map 设置值时会同时将键和值添加到这两个数组的末尾。从而使得键和值的索引在两个数组中相对应。当从该 map 取值的时候，需要遍历所有的键，然后使用索引从存储值的数组中检索出相应的值。
  - 首先赋值和搜索操作都是 _O(\*n_)* 的时间复杂度（*n\* 是键值对的个数），因为这两个操作都需要遍历全部整个数组来进行匹配。
  - 另外一个缺点是可能会导致内存泄漏，因为数组会一直引用着每个键和值。这种引用使得垃圾回收算法不能回收处理他们，即使没有其他任何引用存在了。
- 相比之下，原生的 `WeakMap` 持有的是每个键对象的“弱引用”，这意味着在没有其他引用存在时垃圾回收能正确进行。原生 `WeakMap` 的结构是特殊且有效的，其用于映射的 key *只有*在其没有被回收时才是有效的。
- **正由于这样的弱引用，`WeakMap` 的 key 是不可枚举的**（没有方法能给出所有的 key）。如果 key 是可枚举的话，其列表将会受垃圾回收机制的影响，从而得到不确定的结果。因此，如果你想要这种类型对象的 key 值的列表，你应该使用 [`Map`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)。

## 指数的运算方法

```js
const res = 3 ** 3 // 27
```

## padStart 和 padEnd

- **`padStart()`** 方法用另一个字符串填充当前字符串(如果需要的话，会重复多次)，以便产生的字符串达到**给定的长度**。从当前字符串的左侧开始填充。
- **`padEnd()`** 方法会用一个字符串填充当前字符串（如果需要的话则重复填充），返回填充后达到指定长度的字符串。从当前字符串的末尾（右侧）开始填充。

```js
'abc'.padStart(10) // "       abc"
'abc'.padStart(10, 'foo') // "foofoofabc"
'abc'.padStart(6, '123465') // "123abc"
'abc'.padStart(8, '0') // "00000abc"
'abc'.padStart(1) // "abc"

'abc'.padEnd(10) // "abc       "
'abc'.padEnd(10, 'foo') // "abcfoofoof"
'abc'.padEnd(6, '123456') // "abc123"
'abc'.padEnd(1) // "abc"

'abc'.padStart(9, 'foo').padEnd(15, '123') // foofooabc123123
```

## flat 降维

- **flat()** 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素**合并为一个新数组返回**。

```js
const arr1 = [0, 1, 2, [3, 4]]

// 默认降维是1: [0, 1, 2, 3, 4]
console.log(arr1.flat())

const arr2 = [0, 1, 2, [[[3, 4]]]]

// expected output: [0, 1, 2, [3, 4]]
console.log(arr2.flat(2))
```

## flatMap

- flatMap() 方法首先使用映射函数映射每个元素，然后将结果压缩成一个新数组。它与 [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 连着深度值为 1 的 flat 几乎相同，但 flatMap 通常在合并成一种方法的效率稍微高一些。

```js
let arr1 = ["it's Sunny in", '', 'California']

arr1.map((x) => x.split(' '))
// [["it's","Sunny","in"],[""],["California"]]

arr1.flatMap((x) => x.split(' '))
// ["it's","Sunny","in", "", "California"]
```

## trimStart 和 trimEnd 去除空格

- **trimStart()** 方法从字符串的开头删除空格。`trimLeft()` 是此方法的别名。
- **trimEnd()** 方法从一个字符串的末端移除空白字符。trimRight() 是这个方法的别名。

```js
const greeting = '   Hello world!   '

console.log(greeting.trimStart()) // "Hello world!   ";

console.log(greeting.trimEnd()) // "   Hello world!";

console.log(greeting.trim()) // "Hello world!";
```

## 大数字 bigInt 的使用

```js
const maxInt = Number.MAX_SAFE_INTEGER // 最大的安全值，再大旧不保证可以正确的表示

const previousMaxSafe = BigInt(Number.MAX_SAFE_INTEGER)
// ↪ 9007199254740991n

const maxPlusOne = previousMaxSafe + 1n
// ↪ 9007199254740992n

const theFuture = previousMaxSafe + 2n
// ↪ 9007199254740993n, this works now!
```

## 空值合并运行符??

```js
const foo = undefined null '' 0

const bar = foo || 'abc' // 'abc' 'abc' 'abc' 'abc'

const bar = foo ?? 'abc' // 'abc' 'abc' '' 0
```

## 监听对象什么时候被销毁

- **`FinalizationRegistry` 对象可以让你在对象被垃圾回收时请求一个回调。**

```js
const registry = new FinalizationRegistry((heldValue) => {
	console.log(heldValue + '对象被销毁了') // 哈哈哈对象被销毁了
})
const obj = {
	name: 'why'
}
const info = new WeakRef(obj) // 弱引用
console.log(info.deref()) //  {name: 'why' }

registry.register(obj, '哈哈哈')
```

## 逻辑运算符

node 版本限制，比较新的版本才支持

- ||= 逻辑或赋值运算符

```js
let message = undefined
// message = message || 'default value'
message ||= 'default value'
```

- &&= 逻辑与赋值运算

```js
let info = {
	// 很少用
	name: 'why'
}
info &&= info.name
console.log(info) // why
```

- ??= 逻辑空赋值运算
  - 0 和空字符串判定为 true

```js
let message = undefined
// message = message ?? 'default value'
message ??= 'default value'
```
