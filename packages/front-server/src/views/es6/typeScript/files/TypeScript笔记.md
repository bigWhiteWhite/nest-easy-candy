## 常用的类型

```typescript
//事件回调参数event
;(event: Event) => {
	const value = (event.target as HTMLInputElement).value
}
// 多个属性中使用any
;(store.state as any).login.userMenus

//ref获取的元素，提示为有可能为null
const ripple_item = useRef(null)

const r_item = ripple_item.current as any //转换为any
```

## 封装接口

```ts
import { ErrorList, RuleItem } from 'async-validator'

const FormKey = 'formKey'
const FormItemKey = 'formItemKey'

type validateFunc = (callback: (valid: boolean) => void) => Promise<boolean | ErrorList>

interface FormContext {
	model: Record<string, any>
	rules: AntFormRules
	validate: validateFunc
	addItem(item: Partial<FormItemContext>): void
	removeItem(id: string): void
}

interface FormItemContext {
	id: string
	prop: string
	validate: (value: string) => Promise<boolean | ErrorList>
	handlerControlChange(value: string): void
	handlerControlBlur(value: string): void
}
type ValidTrigger = 'change' | 'blur'
interface AntRuleItem extends RuleItem {
	trigger?: ValidTrigger
}
interface AntFormRules {
	[key: string]: AntRuleItem | AntRuleItem[]
}

export { FormKey, FormItemKey, FormContext, FormItemContext, AntRuleItem, ValidTrigger, validateFunc, AntFormRules }
```

```ts
//使用
import { FormItemContext, FormItemKey } from '../Form/types'
const formItemCtx = inject<FormItemContext>(FormItemKey) //接口
```

```ts
// 礼品创建、编辑、列表中的每一项，都会是这个数据类型。
interface IGiftItem {
	id: string | number
	name: string
	desc: string
	[key: string]: any
}

// 全局相应的类型定义
// 而且一般来说，我们不确认，接口返回的类型到底是什么（可能是null、可能是对象、也可能是数组），所以使用范型来定义interface
interface IRes<T> {
	code: number
	msg: string
	data: T
}
// 接口返回数据类型定义

interface IGiftInfo {
	list: Array<IGiftItem>
	pageNum: number
	pageSize: number
	total: number
}
```

## ref 组件类型

```js
<instance ref="instance"></instance>

components: {
    instance
}
// setup
const instance = ref<InstanceType<typeof instance>>()
const deleted = () => {
    instance.value?.add()
    console.log(instance.value)
}
```

# @装饰器

装饰器让 TypeScript 的世界更好。 我们使用的许多库都基于这一强大特性构建, 例如[Angular](https://angular.io/)和[Nestjs](https://nestjs.com/)。 在这篇博客中我将介绍装饰器和它的许多细节。 我希望在读完这篇文章后，你可以理解何时和如何使用这一强的的特性。

## 概览

装饰器本质上是一种特殊的函数被应用在于：

1. 类
2. 类属性
3. 类方法
4. 类访问器
5. 类方法的参数

所以应用装饰器其实很像是组合一系列函数，类似于高阶函数和类。 通过装饰器我们可以轻松实现[代理模式](https://zh.wikipedia.org/zh-hans/代理模式)来使代码更简洁以及实现其它一些更有趣的能力。

装饰器的语法十分简单，只需要在想使用的装饰器前加上`@`符号，装饰器就会被应用到目标上：

```typescript
function simpleDecorator() {
	console.log('---hi I am a decorator---')
}

@simpleDecorator
class A {}
```

一共有 5 种装饰器可被我们使用：

1. 类装饰器
2. 属性装饰器
3. 方法装饰器
4. 访问器装饰器
5. 参数装饰器

让我们来快速认识一下这五种装饰器：

```typescript
// 类装饰器
@classDecorator
class Bird {
	// 属性装饰器
	@propertyDecorator
	name: string

	// 方法装饰器
	@methodDecorator
	fly(
		// 参数装饰器
		@parameterDecorator
		meters: number
	) {}

	// 访问器装饰器
	@accessorDecorator
	get egg() {}
}
```

## 执行

### 时机

装饰器只在解释执行时应用一次，例如：

```typescript
function f(C) {
	console.log('apply decorator')
	return C
}

@f
class A {}

// output: apply decorator
```

这里的代码会在终端中打印`apply decorator`，即便我们其实并没有使用类 A。

### 执行顺序

不同类型的装饰器的执行顺序是明确定义的：

1. 实例成员:参数装饰器 -> 方法 / 访问器 / 属性装饰器

2. 静态成员:参数装饰器 -> 方法 / 访问器 / 属性装饰器
3. 构造器:参数装饰器
4. 类装饰器

例如，考虑以下代码：

```typescript
function f(key: string): any {
	console.log('evaluate: ', key)
	return function () {
		console.log('call: ', key)
	}
}

@f('Class Decorator')
class C {
	@f('Static Property')
	static prop?: number

	@f('Static Method')
	static method(@f('Static Method Parameter') foo) {}

	constructor(@f('Constructor Parameter') foo) {}

	@f('Instance Method')
	method(@f('Instance Method Parameter') foo) {}

	@f('Instance Property')
	prop?: number
}
```

它将会打印出以下信息：

```bash
evaluate:  Instance Method
evaluate:  Instance Method Parameter
call:  Instance Method Parameter
call:  Instance Method
evaluate:  Instance Property
call:  Instance Property
evaluate:  Static Property
call:  Static Property
evaluate:  Static Method
evaluate:  Static Method Parameter
call:  Static Method Parameter
call:  Static Method
evaluate:  Class Decorator
evaluate:  Constructor Parameter
call:  Constructor Parameter
call:  Class Decorator
```

你也许会注意到执行实例属性`prop`晚于实例方法`method` 然而执行静态属性`static prop`早于静态方法`static method`。 这是因为对于属性/方法/访问器装饰器而言，执行顺序取决于声明它们的顺序。

然而，同一方法中不同参数的装饰器的执行顺序是相反的， 最后一个参数的装饰器会最先被执行：

```typescript
function f(key: string): any {
	console.log('evaluate: ', key)
	return function () {
		console.log('call: ', key)
	}
}

class C {
	method(@f('Parameter Foo') foo, @f('Parameter Bar') bar) {}
}
```

这里的代码打印出的结果为：

```bash
evaluate:  Parameter Foo
evaluate:  Parameter Bar
call:  Parameter Bar
call:  Parameter Foo
```

### 多个装饰器的组合

你可以对同一目标应用多个装饰器。它们的组合顺序为：

1. 求值外层装饰器
2. 求值内层装饰器
3. 调用内层装饰器
4. 调用外层装饰器

例如:

```typescript
function f(key: string) {
	console.log('evaluate: ', key)
	return function () {
		console.log('call: ', key)
	}
}

class C {
	@f('Outer Method')
	@f('Inner Method')
	method() {}
}
```

这里的代码打印出的结果为：

```bash
evaluate: Outer Method
evaluate: Inner Method
call: Inner Method
call: Outer Method
```

## 定义

### 类装饰器

类型声明：

```typescript
type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void
```

- @参数:
  1. `target`: 类的构造器。
- @返回: 如果类装饰器返回了一个值，她将会被用来代替原有的类构造器的声明。

因此，类装饰器适合用于继承一个现有类并添加一些属性和方法。

例如我们可以添加一个`toString`方法给所有的类来覆盖它原有的`toString`方法。

```typescript
type Consturctor = { new (...args: any[]): any }

function toString<T extends Consturctor>(BaseClass: T) {
	return class extends BaseClass {
		toString() {
			return JSON.stringify(this)
		}
	}
}

@toString
class C {
	public foo = 'foo'
	public num = 24
}

console.log(new C().toString())
// -> {"foo":"foo","num":24}
```

遗憾的是装饰器并没有类型保护，这意味着：

```typescript
declare function Blah<T>(target: T): T & { foo: number }

@Blah
class Foo {
	bar() {
		return this.foo // Property 'foo' does not exist on type 'Foo'
	}
}

new Foo().foo // Property 'foo' does not exist on type 'Foo'
```

这是[一个 TypeScript 的已知的缺陷](https://github.com/microsoft/TypeScript/issues/4881)。 目前我们能做的只有额外提供一个类用于提供类型信息：

```typescript
declare function Blah<T>(target: T): T & { foo: number }

class Base {
	foo: number
}

@Blah
class Foo extends Base {
	bar() {
		return this.foo
	}
}

new Foo().foo
```

### 属性装饰器

类型声明：

```typescript
type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void
```

- @参数:
  1. `target`: 对于静态成员来说是类的构造器，对于实例成员来说是类的原型链。
  2. `propertyKey`: 属性的名称。
- @返回: 返回的结果将被忽略。

除了用于收集信息外，属性装饰器也可以用来给类添加额外的方法和属性。 例如我们可以写一个装饰器来给某些属性添加监听器。

```typescript
function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

function observable(target: any, key: string): any {
	// prop -> onPropChange
	const targetKey = 'on' + capitalizeFirstLetter(key) + 'Change'

	target[targetKey] = function (fn: (prev: any, next: any) => void) {
		let prev = this[key]
		Reflect.defineProperty(this, key, {
			set(next) {
				fn(prev, next)
				prev = next
			}
		})
	}
}

class C {
	@observable
	foo = -1

	@observable
	bar = 'bar'
}

const c = new C()

c.onFooChange((prev, next) => console.log(`prev: ${prev}, next: ${next}`))
c.onBarChange((prev, next) => console.log(`prev: ${prev}, next: ${next}`))

c.foo = 100 // -> prev: -1, next: 100
c.foo = -3.14 // -> prev: 100, next: -3.14
c.bar = 'baz' // -> prev: bar, next: baz
c.bar = 'sing' // -> prev: baz, next: sing
```

### 方法装饰器

类型声明：

```typescript
type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void
```

- @参数：
  1. `target`: 对于静态成员来说是类的构造器，对于实例成员来说是类的原型链。
  2. `propertyKey`: 属性的名称。
  3. `descriptor`: 属性的[描述器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)。
- @返回： 如果返回了值，它会被用于替代属性的描述器。

方法装饰器不同于属性装饰器的地方在于`descriptor`参数。 通过这个参数我们可以修改方法原本的实现，添加一些共用逻辑。 例如我们可以给一些方法添加打印输入与输出的能力：

```typescript
function logger(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
	const original = descriptor.value

	descriptor.value = function (...args) {
		console.log('params: ', ...args)
		const result = original.call(this, ...args)
		console.log('result: ', result)
		return result
	}
}

class C {
	@logger
	add(x: number, y: number) {
		return x + y
	}
}

const c = new C()
c.add(1, 2)
// -> params: 1, 2
// -> result: 3
```

### 访问器装饰器

访问器装饰器总体上讲和方法装饰器很接近，唯一的区别在于描述器中有的 key 不同：

方法装饰器的描述器的 key 为：

- `value`
- `writable`
- `enumerable`
- `configurable`

访问器装饰器的描述器的 key 为：

- `get`
- `set`
- `enumerable`
- `configurable`

例如，我们可以将某个属性设为不可变值：

```typescript
function immutable(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
	const original = descriptor.set

	descriptor.set = function (value: any) {
		return original.call(this, { ...value })
	}
}

class C {
	private _point = { x: 0, y: 0 }

	@immutable
	set point(value: { x: number; y: number }) {
		this._point = value
	}

	get point() {
		return this._point
	}
}

const c = new C()
const point = { x: 1, y: 1 }
c.point = point

console.log(c.point === point)
// -> false
```

### 参数装饰器

类型声明：

```typescript
type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void
```

- @参数：
  1. `target`: 对于静态成员来说是类的构造器，对于实例成员来说是类的原型链。
  2. `propertyKey`: 属性的名称(注意是方法的名称，而不是参数的名称)。
  3. `parameterIndex`: 参数在方法中所处的位置的下标。
- @返回：返回的值将会被忽略。

单独的参数装饰器能做的事情很有限，它一般都被用于记录可被其它装饰器使用的信息。

# 结合

对于一些复杂场景， 我们可能需要结合使用不同的装饰器。 例如如果我们不仅想给我们的接口添加静态检查，还想加上运行时检查的能力。

我们可以用 3 个步骤来实现这个功能：

1. 标记需要检查的参数 (因为参数装饰器先于方法装饰器执行)。
2. 改变方法的`descriptor`的`value`的值，先运行参数检查器，如果失败就抛出异常。
3. 运行原有的接口实现。

以下是代码:

```typescript
type Validator = (x: any) => boolean

// save the marks
const validateMap: Record<string, Validator[]> = {}

// 1. 标记需要检查的参数
function typedDecoratorFactory(validator: Validator): ParameterDecorator {
	return (_, key, index) => {
		const target = validateMap[key as string] ?? []
		target[index] = validator
		validateMap[key as string] = target
	}
}

function validate(_: Object, key: string, descriptor: PropertyDescriptor) {
	const originalFn = descriptor.value
	descriptor.value = function (...args: any[]) {
		// 2. 运行检查器
		const validatorList = validateMap[key]
		if (validatorList) {
			args.forEach((arg, index) => {
				const validator = validatorList[index]

				if (!validator) return

				const result = validator(arg)

				if (!result) {
					throw new Error(`Failed for parameter: ${arg} of the index: ${index}`)
				}
			})
		}

		// 3. 运行原有的方法
		return originalFn.call(this, ...args)
	}
}

const isInt = typedDecoratorFactory((x) => Number.isInteger(x))
const isString = typedDecoratorFactory((x) => typeof x === 'string')

class C {
	@validate
	sayRepeat(@isString word: string, @isInt x: number) {
		return Array(x).fill(word).join('')
	}
}

const c = new C()
c.sayRepeat('hello', 2) // pass
c.sayRepeat('', 'lol' as any) // throw an error
```

正如例子中展示的， 对我们来说同时理解不同种类装饰器的执行顺序和职责都很重要。

# 元数据

严格地说，元数据和装饰器是 EcmaScript 中两个独立的部分。 然而，如果你想实现像是[反射](<https://zh.wikipedia.org/wiki/反射_(计算机科学)>)这样的能力，你总是同时需要它们。

如果我们回顾上一个例子，如果我们不想写各种不同的检查器呢？ 或者说，能否只写一个检查器能够通过我们编写的 TS 类型声明来自动运行类型检查？

有了[reflect-metadata](https://github.com/rbuckton/reflect-metadata)的帮助， 我们可以获取编译期的类型。

```typescript
import 'reflect-metadata'

function validate(target: Object, key: string, descriptor: PropertyDescriptor) {
	const originalFn = descriptor.value

	// 获取参数的编译期类型
	const designParamTypes = Reflect.getMetadata('design:paramtypes', target, key)

	descriptor.value = function (...args: any[]) {
		args.forEach((arg, index) => {
			const paramType = designParamTypes[index]

			const result = arg.constructor === paramType || arg instanceof paramType

			if (!result) {
				throw new Error(`Failed for validating parameter: ${arg} of the index: ${index}`)
			}
		})

		return originalFn.call(this, ...args)
	}
}

class C {
	@validate
	sayRepeat(word: string, x: number) {
		return Array(x).fill(word).join('')
	}
}

const c = new C()
c.sayRepeat('hello', 2) // pass
c.sayRepeat('', 'lol' as any) // throw an error
```

目前为止一共有三种编译期类型可以拿到：

- `design:type`: 属性的类型。
- `desin:paramtypes`: 方法的参数的类型。
- `design:returntype`: 方法的返回值的类型。

这三种方式拿到的结果都是构造函数（例如`String`和`Number`）。规则是：

- number -> `Number`
- string -> `String`
- boolean -> `Boolean`
- void/null/never -> `undefined`
- Array/Tuple -> `Array`
- Class -> 类的构造函数
- Enum -> 如果是纯数字枚举则为`Number`, 否则是 `Object`
- Function -> `Function`
- 其余都是`Object`

# 何时使用？

现在我们可以对于何时使用装饰器得出结论， 在阅读上面的代码中你可能也有所感觉。

我将例举一些常用的使用场景：

- Before/After 钩子。
- 监听属性改变或者方法调用。
- 对方法的参数做转换。
- 添加额外的方法和属性。
- 运行时类型检查。
- 自动编解码。
- 依赖注入。

# vue

## 用字符串做下标报错

```js
const person = {
	name: '张三',
	age: 10
}

function getValue(arg: string) {
	return person[arg]
}
```

**错误信息**

```js
Element implicitly has an ‘any’ type because expression of type ‘string’ can’t be used to index type ‘{ name: string; age: number; }’.
No index signature with a parameter of type ‘string’ was found on type ‘{ name: string; age: number; }’.ts(7053)
```

**解决方法 1：** 在 tsconfig.json 中配置 suppressImplicitAnyIndexErrors: true

```js
{
    "compilerOptions": {
        "suppressImplicitAnyIndexErrors": true,
        ...
    },
    ...
}
```

**解决方法 2：** 给 person 定义接口

```js
const person = {
    name: '张三',
    age: 10
};

function getValue(arg: string) {
	interface IPerson {
		[key: string]: any
	}
    return (<IPerson>person)[arg];
}
```

## 函数内使用 this 报错

```js
function test() {
	this.title = 'hello'
}
```

**错误信息**

```js
‘this’ implicitly has type ‘any’ because it does not have a type annotation.ts(2683)
```

**解决方法**

```js
// 在tsconfig.json中配置noImplicitThis: true
{
    "compilerOptions": {
        "noImplicitThis": true,
        ...
    },
    ...
}
```

## 找不到模块 XXX

模块声明文件搜索： https://microsoft.github.io/TypeSearch/

```js
import CryptoJS from 'crypto-js';
// 错误信息：Cannot find module ‘crypto-js’.ts(2307)

// 解决方法：
// 安装对应的声明文件: cnpm install --save-dev @types/crypto-js

// 引入模块提示找不到声明文件
// 在src目录下修改shims-vue.d.ts声明文件，在末尾增加一行 declare module 'xxx模块名';
declare module '*.vue' {
    import Vue from 'vue';
    export default Vue;
}

declare module 'crypto-js';
```

## JSON 直接解析 localStorage 值报错

```js
JSON.parse(window.localStorage.getItem('token'))
// 错误信息：Argument of type ‘string | null’ is not assignable to parameter of type ‘string’.Type ‘null’ is not assignable to type ‘string’.ts(2345)

// 解决方法
// 定义一个指定类型为string的变量接收localStorage值
let token: string | null = window.localStorage.getItem('token')
if (token) {
	JSON.parse(token)
}
```

## 初始加载的组件未命名，浏览器打开页面后控制台报错

```js
//index.vue
@Component
export default class extends Vue {}

//router.ts
import Index from '@/views/index.vue';
const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'index',
        component: Index,
    }
];
// 错误信息：Invalid component name: “_class2”. Component names should conform to valid custom element name in html5 specification.

// 解决方法：给初始加载的组件命名
//index.vue
@Component({
	name: 'Index'
})
export default class extends Vue {}

```

## 初始值未定义类型，后面赋值报错

```js
export default class extends Vue {
    private search = {
        name: '',
        types: [];
    };

    private typesChange(value: string[]) {
        this.search.types = value; //这里报错
    }
}
// 错误信息：Type ‘string[]’ is not assignable to type ‘never[]’. Type ‘string’ is not assignable to type ‘never’.

// 解决方法：给初始赋值类型断言
export default class extends Vue {
    private search = {
        name: '',
        types: [] as string[]; //这里加断言
    };

    private typesChange(value: string[]) {
        this.search.types = value;
    }
}
```

## 在 Vue 原型上添加属性使用时报错

```js
import Vue from 'vue';
import http from './http';
Vue.prototype.$http = http;

// 解决方法:在src目录下新建vue.d.ts声明文件
import Vue from 'vue';
declare module 'vue/types/vue' {
    interface Vue {
        $http: any;
    }
}
```

## element-ui 使用$message 报错

```js
// 解决方法： 在src目录下新建vue.d.ts声明文件
import Vue from 'vue';
import { ElMessage } from 'element-ui/types/message';


declare module 'vue/types/vue' {
    interface Vue {
        $message: ElMessage;
    }
}

```

## vue-cli 里使用 process 对象报错类型找不到

```js
// 错误信息：JSON schema for the typescript compiler's configuration file.cannot find type definition file for 'webpack-env'.

// 解决方法： 修改项目根目录下的tsconfig.json文件中的compilerOptions.types值，新增node
"compilerOptions": {
    "types": ["webpack-env", "node"],
}
```

# 作用类型

## 交叉类型&

- 唯一性： A&A = A

- 满足交换律：A&B = B&A

- 满足结合律：( A&B)&C = A&(B&C)

- 父类型收敛：如果 B 是 A 的父类型，则 A&B 将被收敛成 A 类型

  - ```ts
    type A0 = 1 & number // 1 父类型收敛了,
    type A1 = '1' & string // '1'

    type A2 = any & 1 // 'any'
    type A3 = any & 1 // 'never'
    ```

- ```ts
  interface X {
  	a: string
  	b: number
  }
  interface Y {
  	c: boolean
  }
  // X&Y
  interface XY {
  	a: string
  	b: number
  	c: boolean
  }
  ```

- ```ts
  interface X  {
      a: string
      b: number，
      c: '哈哈哈'
  }
  interface Y  {
      a: Boolean,
      c: '嘿嘿嘿'
  }
  // X&Y
  interface XY {
      a: never // 既不是string，也不是boolean，因为没有变量是既属于string又属于Boolean
      b: number
      c: never
  }
  ```

-

## Record

`Record` 译为 记录/记载, 作用是将一个类型的所有属性值都映射到另一个类型上并创造一个新的类型，**适用于循环等场景**

**ts 中的声明**

```ts
/**
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
	[P in K]: T
}
```

看类型的定义就可以看出来，将 K 中的每个属性([P in K]),都转为 T 类型, K 可以是联合类型、对象、枚举…

```ts
type petsGroup = 'dog' | 'cat' | 'fish'

type numOrStr = number | string

type IPets = Record<petsGroup, numOrStr>

// type IPets = {
//     dog: numOrStr;
//     cat: numOrStr;
//     fish: numOrStr;
// }
```

## Pick

`Pick`译为挑选/选择, 作用是从一个复合类型中，取出几个想要的类型的组合一个新的类型

**ts 中的声明**

```ts
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
	[P in K]: T[P]
}
```

`K extends keyof T`的作用是约束 K 的 key 在 T 的 key 中，不能超出这个范围，否则会报错的

## keyof

- keyof 用于获取某种类型的所有键，其返回类型是联合类型

```ts
// keyof 用于获取某种类型的所有键，其返回类型是联合类型
interface B {
	id: number
	name: string
	age: number
}

type B1 = keyof B
// type B1 = "id" | "name" | "age"
```

## extends

这里的 extends 并不是用来继承的， 而是用来限制类型

```ts
// 对象extends
type T = {
	id: number
	name: string
}

type K = {
	id: number
}
type IType = K extends T ? K : T
// type IType = {
//     id: number;
//     name: string;
// }
// 此处 K extends T 限制K中必须有T的所有属性, 通俗点说就是T必须是K的子集

// 联合类型extends
type T = 'id' | 'name'
type K = 'id'
type IType = K extends T ? K : T
// type IType = "id"
// 此处限制为K必须包含于T，通俗点说就是K是T的子集
```

使用`Pick`挑选属性组成新的类型

```ts
interface B {
	id: number
	name: string
	age: number
}

type PickB = Pick<B, 'id' | 'name'>

// type PickB = {
//     id: number;
//     name: string;
// }
```

## Exclude

`Exclude` 译为排除/不包括, `Exclude<T, U>` 表示从 T 中排除那些可分配给 U 的类型, 简单点说就是将 T 中某些属于 U 的类型移除掉。也可理解为取补集

ts 中的声明

```ts
/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T
```

例

```ts
// 例子1
type T = {
	name: string
	age: number
}

type U = {
	name: string
}

type IType = Exclude<keyof T, keyof U>
// type IType = "age"

type T0 = Exclude<'a' | 'b' | 'c', 'a' | 'b'>
// type T0 = "c"
type T1 = Exclude<'a' | 'b' | 'c', 'a' | 'b' | 's'>
// type T1 = "c"
```

## Extract

`Extract` 译为提取, `Extract<T, U>`从 T 中提取那些可分配给 U 的类型, 简单点说就是提取 T 中，U 也有的元素，也可理解为取交集

ts 中的定义

```ts
/**
 * Extract from T those types that are assignable to U
 */
type Extract<T, U> = T extends U ? T : never
```

例

```ts
type T0 = Extract<'a' | 'b' | 'c', 'a' | 'f'>
// type T0 = "a"

type T = {
	name: string
	age: number
}

type U = {
	name: string
}

type IType = Extract<keyof T, keyof U>
// type IType = "name"
```

## ConstructorParameters

`ConstructorParameters` 译为构造函数参数, 获取元组中构造函数类型的参数

ts 中的声明

```ts
/**
 * Obtain the parameters of a constructor function type in a tuple
 */
type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never
```

可以用来获取类的参数类型组成的元组类型

```ts
class People {
	name: string
	age: number

	constructor(name: string) {
		this.name = name
	}
}

type IType = ConstructorParameters<typeof People>
// type IType = [name: string]
// 注意这里typeof操作是取类型的作用
```

## infer

表示在 extends 条件语句中待推断的类型变量

```ts
// 例子1
// 若T是Array类型，则返回T的泛型，否则返回never类型
type Union<T> = T extends Array<infer U> ? U : never

type a = {
	name: string
}

type b = string[]

type c = Union<b>
// type c = string
type d = Union<a>
// type d = never

// 例子2
// 若T满足(param: infer P) => any，则返回函数入参的类型，否则直接返回T
type ParamType<T> = T extends (param: infer P) => any ? P : T

interface IDog {
	name: string
	age: number
}

type Func = (dog: IDog) => void

type Param = ParamType<Func> // IDog
type TypeString = ParamType<string> //string
```

理解了`infer` 我们在回来看 ts 中`ConstructorParameters` 的声明

```ts
type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never

// T extends new (...args: any) => any 首先给T加了个约束 必须满足new (...args: any) => any 也就是说T必须是构造函数类型

// T extends new (...args: infer P) => any ? P : never
// T若满足new (...args: any) => any 则返回所有入参的类型, 否则返回never
```

## InstanceType

`InstanceType` 译为实例类型， 用来获取构造函数的返回类型

ts 中的定义

```ts
/**
 * Obtain the return type of a constructor function type
 */
type InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any
```

例

```ts
class People {
	name: string
	age: number

	constructor(name: string) {
		this.name = name
	}
}

type IType = InstanceType<typeof People>
// type IType = People
// 因为constructor默认返回this
// constructor People(name: string): People
```

## NonNullable

`NonNullable` 译为不可为空， `NonNullable<T>`从 T 中排除 null 和 undefined

ts 中的定义

```ts
/**
 * Exclude null and undefined from T
 */
type NonNullable<T> = T extends null | undefined ? never : T
```

例

```ts
type example = NonNullable<string | number | undefined>
// type example = string | number
```

## Parameters & ReturnType

- `Parameters` 用来获取函数参数的类型
- `ReturnType` 用来获取函数返回值类型

ts 中的定义

```ts
/**
 * Obtain the parameters of a function type in a tuple
 */
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never

/**
 * Obtain the return type of a function type
 */
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any
```

定义时写的很明确，不过多赘述

例

```ts
type IFoo = (
	uname: string,
	uage: number
) => {
	name: string
	age: number
}
//参数类型
type Ibar = Parameters<IFoo>
// type Ibar = [uname: string, uage: number]
type T0 = ReturnType<IFoo>
// type T0 = {
//     name: string;
//     age: number;
// }
```

## readonly & ReadonlyArray

- `readonly` 只读 被`readonly` 标记的属性只能在声明时或类的构造函数中赋值，之后将不可改（即只读属性）。
- `ReadonlyArray` 同理, 只读数组

```ts
interface ReadonlyArray<T> {
	/** Iterator of values in the array. */
	[Symbol.iterator](): IterableIterator<T>

	/**
	 * Returns an iterable of key, value pairs for every entry in the array
	 */
	entries(): IterableIterator<[number, T]>

	/**
	 * Returns an iterable of keys in the array
	 */
	keys(): IterableIterator<number>

	/**
	 * Returns an iterable of values in the array
	 */
	values(): IterableIterator<T>
}
```

例

```ts
interface Person {
	readonly id: number
}
const data: Person = {
	id: 456
}

data.id = 789
// 无法分配到 "id" ，因为它是只读属性。ts(2540)

const arr: number[] = [1, 2, 3, 4]

let ro: ReadonlyArray<number> = arr

ro.push(444)
// 类型“readonly number[]”上不存在属性“push”。ts(2339)
```

# TypeScript

## 使用 ts-node 加速开发

https://blog.csdn.net/qq_39969226/article/details/105806754

## 安装

`npm i -g typescript`

`tsc -v `校验 typescript

tsc 作用：负责将 ts 代码转为浏览器和 nodejs 识别的 js 代码

## 自动编译 ts 文件

![image-20210324220122229](typescript.assets\image-20210324220122229.png)

终端中输入`tsc -w`

## type 和 interface 的区别

[TypeScript type 和 interface 的区别 - CodeSky 代码之空](https://www.codesky.me/archives/typescript-difference-type-interface.wind)

## function

### 可选参数

JavaScript 里，每个参数都是可选的，可传可不传。 没传参的时候，它的值就是 undefined。 在 TypeScript 里我们可以在参数名旁使用 `?`实现可选参数的功能。 比如，我们想让 last name 是可选的：

```ts
function buildName(firstName: string, lastName?: string) {
	if (lastName) return firstName + ' ' + lastName
	else return firstName
}

let result1 = buildName('Bob') // works correctly now
let result2 = buildName('Bob', 'Adams', 'Sr.') // error, too many parameters
let result3 = buildName('Bob', 'Adams') // ah, just right
```

**可选参数必须跟在必须参数后面**。 如果上例我们想让 first name 是可选的，那么就必须调整它们的位置，把 first name 放在后面。

### 默认参数

在 TypeScript 里，我们也可以为参数提供一个默认值当用户没有传递这个参数或传递的值是`undefined`时。 它们叫做有默认初始化值的参数。 让我们修改上例，把 last name 的默认值设置为`"Smith"`。

```ts
function buildName(firstName: string, lastName = 'Smith') {
	return firstName + ' ' + lastName
}

let result1 = buildName('Bob') // works correctly now, returns "Bob Smith"
let result2 = buildName('Bob', undefined) // still works, also returns "Bob Smith"
let result3 = buildName('Bob', 'Adams', 'Sr.') // error, too many parameters
let result4 = buildName('Bob', 'Adams') // ah, just right
```

**在所有必须参数后面的带默认初始化的参数都是可选的**，与可选参数一样，在调用函数的时候可以省略。 也就是说可选参数与末尾的默认参数共享参数类型。

**与普通可选参数不同的是，带默认值的参数不需要放在必须参数的后面。** 如果带默认值的参数出现在必须参数前面，用户必须明确的传入 `undefined`值来获得默认值。 例如，我们重写最后一个例子，让 `firstName`是带默认值的参数：

```ts
function buildName(firstName = 'Will', lastName: string) {
	return firstName + ' ' + lastName
}

let result1 = buildName('Bob') // error, too few parameters
let result2 = buildName('Bob', 'Adams', 'Sr.') // error, too many parameters
let result3 = buildName('Bob', 'Adams') // okay and returns "Bob Adams"
let result4 = buildName(undefined, 'Adams') // okay and returns "Will Adams"
```

## class

## 理解 `private`

当成员被标记成 `private`时，它就不能在声明它的类的外部访问。比如：

```ts
class Animal {
	private name: string
	constructor(theName: string) {
		this.name = theName
	}
}

new Animal('Cat').name // 错误: 'name' 是私有的.
```

## 抽象类

## 接口

## 问号?

data 入参可能为 null,undefined，通常我们的写法是直接上 if 判断啥的，然后再取 data 中的属性，但是有了问号点(?.)写法就简单很多了，看下面例子：

1.typescript 写法：

```typescript
//1.data可能为null,undefined , row也可能为null,undefined
//2.假设data完整结构 {row:{name:'aaa'}}
function getData(data: any) {
	let name = data?.row?.name
}
```

2.普通写法

```js
//1.data可能为null,undefined , row也可能为null,undefined
//2.假设data完整结构 {row:{name:'aaa'}}
function getData(data: any) {
	let name
	if (data && data.row) {
		name = data.row.name
	}
}
```

从上面写法可以看出来问号点(?.)的写法其实等价于例 2 的 if 判断、三元运算符（let a = b == null ? null : b.a）

## vue 中添加 ts

![image-20210325160231123](TypeScript.assets\image-20210325160231123.png)

![image-20210325160619229](TypeScript.assets\image-20210325160619229.png)

## vue-property-decorator

```vue
@Component({ name: "App", // 当前组件name属性 components: { // 注册子组件 HelloWorld, }, filters: {}, // 过滤器 directives: {}, // 自定义指令 })
```

### @Component

#### name

#### components

表示该组件引入了哪些子组件

```vue
<template>
	<div id="app">
		<HelloWorld />
	</div>
</template>

<script lang="ts">
@Component({
	components: {
		HelloWorld // 声明子组件的引用
	}
})
export default class App extends Vue {}
</script>
```

#### filters

过滤器

```vue
<template>
	<div>{{ msg | addWorld }}</div>
</template>

<script lang="ts">
@Component({
	filters: {
		addWorld: (value: string) => `${value} world`
	}
})
export default class App extends Vue {
	private msg = 'Hello' // filter 之后显示 hello world
}
</script>
```

### @Prop()

父子组件传递数据 props 的修饰符

`@Prop(options: (PropOptions | Constructor[] | Constructor) = {})`

装饰器接收一个参数，这个参数可以有三种写法：

- `Constructor`，例如`String，Number，Boolean`等原生构造函数，用于指定 `prop` 的类型；
- `Constructor[]`，指定 `prop` 的可选类型；
- `PropOptions`，可以使用以下选项：`type，default，required，validator`。

```typescript
  @Prop(String) public propA: string | undefined;
  @Prop([String, Number]) public propB!: string | number;
  @Prop({
    type: String,
    default: "abc",
  })
```

父组件:

```vue
<template>
	<div id="app">
		<PropComponent :count="count" />
	</div>
</template>
<script lang="ts">
@Component({
	components: { PropComponent }
})
class Parent extends Vue {
	private count = 101
}
</script>
```

子组件:

```vue
<template>
	<div>{{ count }}</div>
</template>

<script lang="ts">
@Component
export default class PropsComponent extends Vue {
	@Prop({
		type: Number,
		validator: (value) => {
			return value > 100
		},
		required: true
	})
	private count!: string // !表示有值, 否则 ts 会告警未初始化
}
</script>
```

### @PropSync()

与 Prop 的区别是子组件可以对 props 进行更改, 并同步给父组件

`@PropSync`装饰器与`@prop`用法类似，二者的区别在于：

- `@PropSync` 装饰器接收两个参数： `propName: string` 表示父组件传递过来的属性名；必填 `options: Constructor | Constructor[] | PropOptions` 与`@Prop`的第一个参数一致；
- `@PropSync` 会生成一个新的计算属性。

```typescript
import { Vue, Component, PropSync } from 'vue-property-decorator'

@Component
export default class MyComponent extends Vue {
	@PropSync('propA', { type: String, default: 'abc' }) public syncedPropA!: string
}
```

等同于下面的`js`写法

```js
export default {
	props: {
		propA: {
			type: String,
			default: 'abc'
		}
	},
	computed: {
		syncedPropA: {
			get() {
				return this.propA
			},
			set(value) {
				this.$emit('update:propA', value)
			}
		}
	}
}
```

子组件:

```vue
<template>
  <div>
    <p>{{count}}</p>
    <button @click="innerCount += 1">increment</button>
  </div>
</template>

<script lang="ts">
@Component
export default class PropSyncComponent extends Vue {
  @PropSync('count') private innerCount!: number // 注意@PropSync 里的参数不能与定义的实例属性同名, 因为还是那个原理, props 是只读的.
}
```

父组件: 注意父组件里绑定 props 时需要加修饰符 `.sync`

```vue
<template>
	<PropSyncComponent :count.sync="count" />
</template>
<script lang="ts">
@Component({
	components: { PropSyncComponent }
})
export default class PropSyncComponent extends Vue {
	@PropSync('count') private innerCount!: number // 注意@PropSync 里的参数不能与定义的实例属性同名, 因为还是那个原理, props 是只读的.
}
</script>
```

### @Model

`@Model`装饰器允许我们在一个组件上自定义`v-model`，接收两个参数：

- `event: string` 事件名。
- `options: Constructor | Constructor[] | PropOptions` 与`@Prop`的第一个参数一致。

```js
import { Vue, Component, Model } from 'vue-property-decorator'

@Component
export default class MyInput extends Vue {
  @Model('change', { type: String, default: '123' }) public value!: string
}
```

等同于下面的`js`写法

```js
export default {
	model: {
		prop: 'value',
		event: 'change'
	},
	props: {
		value: {
			type: String,
			default: '123'
		}
	}
}
```

上面例子中指定的是`change`事件，所以我们还需要在`template`中加上相应的事件：

```js
<template>
  <input
    type="text"
    :value="value"
    @change="$emit('change', $event.target.value)"
  />
</template>
```

### @Watch

装饰器接收两个参数：

- `path: string` 被侦听的属性名；

- `options?: WatchOptions={} options`

  可以包含两个属性 ：

  `immediate?:boolean` 侦听开始之后是否立即调用该回调函数； `deep?:boolean` 被侦听的对象的属性被改变时，是否调用该回调函数；

**侦听开始，发生在`beforeCreate`勾子之后，`created`勾子之前**

```js
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class MyInput extends Vue {
  @Watch('msg')
  public onMsgChanged(newValue: string, oldValue: string) {}

  @Watch('arr', { immediate: true, deep: true })
  public onArrChanged1(newValue: number[], oldValue: number[]) {}

  @Watch('arr')
  public onArrChanged2(newValue: number[], oldValue: number[]) {}
}
```

等同于下面的`js`写法

```js
export default {
	watch: {
		msg: [
			{
				handler: 'onMsgChanged',
				immediate: false,
				deep: false
			}
		],
		arr: [
			{
				handler: 'onArrChanged1',
				immediate: true,
				deep: true
			},
			{
				handler: 'onArrChanged2',
				immediate: false,
				deep: false
			}
		]
	},
	methods: {
		onMsgVhanged(newValue, oldValue) {},
		onArrChange1(newValue, oldValue) {},
		onArrChange2(newValue, oldValue) {}
	}
}
```

### @Emit

- `@Emit` 装饰器接收一个可选参数，该参数是`$Emit`的第一个参数，充当事件名。如果没有提供这个参数，`$Emit`会将回调函数名的`camelCase`转为`kebab-case`，并将其作为事件名；
- `@Emit`会将回调函数的返回值作为第二个参数，如果返回值是一个`Promise`对象，`$emit`会在`Promise`对象被标记为`resolved`之后触发；
- `@Emit`的回调函数的参数，会放在其返回值之后，一起被`$emit`当做参数使用。

```js
import { Vue, Component, Emit } from 'vue-property-decorator'

@Component
export default class MyComponent extends Vue {
  count = 0
  @Emit()
  public addToCount(n: number) {
    this.count += n
  }
  @Emit('reset')
  public resetCount() {
    this.count = 0
  }
  @Emit()
  public returnValue() {
    return 10
  }
  @Emit()
  public onInputChange(e) {
    return e.target.value
  }
  @Emit()
  public promise() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(20)
      }, 0)
    })
  }
}
```

等同于下面的`js`写法

```js
export default {
	data() {
		return {
			count: 0
		}
	},
	methods: {
		addToCount(n) {
			this.count += n
			this.$emit('add-to-count', n)
		},
		resetCount() {
			this.count = 0
			this.$emit('reset')
		},
		returnValue() {
			this.$emit('return-value', 10)
		},
		onInputChange(e) {
			this.$emit('on-input-change', e.target.value, e)
		},
		promise() {
			const promise = new Promise((resolve) => {
				setTimeout(() => {
					resolve(20)
				}, 0)
			})
			promise.then((value) => {
				this.$emit('promise', value)
			})
		}
	}
}
```

### @Ref

`@Ref` 装饰器接收一个可选参数，用来指向元素或子组件的引用信息。如果没有提供这个参数，会使用装饰器后面的属性名充当参数

```js
import { Vue, Component, Ref } from 'vue-property-decorator'
import { Form } from 'element-ui'

@Componentexport default class MyComponent extends Vue {
  @Ref() readonly loginForm!: Form
  @Ref('changePasswordForm') readonly passwordForm!: Form

  public handleLogin() {
    this.loginForm.validate(valide => {
      if (valide) {
        // login...
      } else {
        // error tips
      }
    })
  }
}
```

等同于下面的`js`写法

```js
export default {
	computed: {
		loginForm: {
			cache: false,
			get() {
				return this.$refs.loginForm
			}
		},
		passwordForm: {
			cache: false,
			get() {
				return this.$refs.changePasswordForm
			}
		}
	}
}
```

## 巧用查找类型

```ts
interface Person {
	addr: {
		city: string
		street: string
		num: number
	}
}
```

当需要使用 `addr` 的类型时，除了把类型提出来

```ts
interface Address {
	city: string
	street: string
	num: number
}
interface Person {
	addr: Address
}
```

还可以

```ts
Person['addr'] // This is Address.
```
