# 类型定义

https://bosens-china.github.io/Typescript-manual/download/zh/handbook/basic-types.html#%E4%BB%8B%E7%BB%8D

## 类型查找

- **.d.ts**文件，用来做类型的声明(declare)，会**自动扫描**，仅仅用来做类型检测，告知 ts 我们有哪些类型,外部类型声明

  - 通常使用第三方库的时候需要类型声明，有一些库，在自己的依赖中编写了.d.ts 文件

  - 通过社区的共有库 DefinitelyType 存放类型声明文件

    - https://github.com/DefinitelyTyped/DefinitelyTyped
    - https://www.typescriptlang.org/dt/search?search=

  - 自己编写声明文件，建立 module.d.ts 文件

    - ```typescript
      declare modeule 'lodash' {
          export function join(arr: any[]: void)
      }
      declare let name: string

      // 命名空间
      declare namespace $ {
          export function ajax(setting: any): any
      }
      ```

- **HTMLImagesELement** 内置类型声明

  - ts 自带的，帮助我们内置了 javascript 运行时的一些标准化 API 的声明文件
  - 包括 Math，Date 等内置类型，也包括 Dom API,比如 Window，Document 等

## 特殊字符?!

?: 属性或参数中使用 ？：表示该属性或参数为可选项

本质上就相当于**undefined 和当前类型的联合类型**

```ts
interface Person{
    name!: string; // 强调不为空值
    sayHello(): void;    // 函数
    content?: string;    //可选参数
    readonly x: number;    //只读
    [propName: string]: any;//多余属性不报错
}

(name: string, age ?: number) => {
    // 函数中使用
}
```

!:变量后使用 ！：表示类型推断排除 null、undefined,告诉编辑器，这里一定会有值的

```js
const show = (msg?: string) => {
    console.log(msg.length)
}
// 无法通过编译，警告，因为如果msg是可选的，如果是不传就是为undefined，是没有length
show('123')

// 需要告诉编译器，我确定是有传过去值的
console.log(msg!.length)
```

### 可选链 ?.

- 可选链操作符 ?.
- 之前编写代码一直有需要判断属性有没有存在的情况，经常会拿到 undefined.属性，然后报错
- **当对象的属性不存在的时候，会短路，后面的属性不在进行取值，直接返回 undefined，如果存在，那么才会继续执行**

```js
// Object is possibly 'null'. 函数返回对象中未必有appContext这个属性
getCurrentInstance()?.appContext

type obj {
    name: string,
    friend?: {
        name: string
    }
}

const symbal = {
    name: 'my'
}
// 取出symbal中的可选属性friend，有可能没有
console.log(symbal.friend?.name)
```

### ??和!!

- !!操作符

  - 将一个其他类型转换成 Boolean 类型，相当于调用 Boolean()方法
  - 原理是使用一个**!value**会将变量转换成布尔类型，但是取反了，所以要**再需要一个!**

- ??操作符

  - **空值合并操作符(??)是一个逻辑操作符，当操作符的左侧是 null 或者 undefined 时，返回其右侧操作符，否则返回左侧操作符**

  - 相当于为空的时候的默认值

  - ```js
    let message: string | null = null

    const content = message ?? 'world'

    console.log(content) // world

    // 之前写next的时候的那些颜色
    hasColor ? 'red' : ''
    hasColor ?? 'yellow'
    ```

## 联合类型

```js
type common = string | number

interface common {
	age: string | number;
}

const arr: Array<string | number> = [123, '123']

const arr: (string | number)[] = [123, '123']
```

## 交叉类型

- 单纯两个接口相加使用交叉类型

- 在相加的基础上想要加上自己的类型使用继承

```js
interface swim {
	name: 'string';
}
interface run {
	run: 'string';
}

type Action = swim & run // 相当于并集,两者相加

interface Action extends swim, run {
	// 继承
}
```

## 类型断言

有些情况下，变量的类型对于我们来说是很明确，但是 TS 编译器却并不清楚

ts 只允许类型断言转换为**更具体**或者**不太具体**的类型版本，此规则可防止不可能的强制转换

```ts
function fn1(a: string | number): void {
	console.log(a.toFixed(2)) // 报错，a 的值有可能是 string 类型，当为 string 时则没有 .toFixed() 方法
}

// 使用“尖括号”语法
function fn2(a: string | number): void {
	console.log((<number>a).toFixed(2)) // 使用断言告诉程序 a 就是 number 类型，则此时编辑器不会再报错
}
```

```ts
// 使用 as 语法
function fn(x: string | number): number {
	// return x // 报错，x 有可能为 string类型
	return x as number
}
// 一般或推断成HTMLElement，但是一般的html上面没有src这个属性，需要更加的具体，这个时候就可以使用断言来指定
onMounted(() => {
	// 先转成不具体，在转成HTMLImageElement
	// const el = (document.getElementsByTagName('img') as unknown) as HTMLImageElement
	const el = document.getElementById('#img') as HTMLImageElement
	el.src = '../'
})
// 是错误的，这样会将HTMLImageElement判定成是type类型别名
const el: HTMLImageElement = document.getElementById('img')
```

```js
class Person {

}
class stu extends Person{
    show() {

    }
}

function sayHello(p: Person) {
    (p as stu).show() // 断言是stu的类型，stu继承自Person，是有这个方法的
}

const s = new stu()
sayHello(s)
```

类型断言不是类型转换，断言成一个联合类型中不存在的类型是不允许的

## 类型推论

推断通常发生在初始化变量和成员，设置默认参数值、和决定函数返回值时

TS 拥有自动的类型判断机制,当对变量的声明和赋值是同时进行的，TS 编译器会自动判断变量的类型,所以如果你的变量的声明和赋值时同时进行的，可以省略掉类型声明

```typescript
let a = 5 // 变量 a 的类型被推断为 number
a = '5' // Type '"5"' is not assignable to type 'number'.

let b = [1, 2, '3', true, null, undefined]
// 被推断为 let a: (string | number | boolean | null | undefined)[]
```

### 基本类型

|  类型   |       例子        |              描述               |
| :-----: | :---------------: | :-----------------------------: |
| number  |    1, -33, 2.5    |            任意数字             |
| string  | 'hi', "hi", `hi`  |           任意字符串            |
| boolean |    true、false    |      布尔值 true 或 false       |
| 字面量  |      其本身       |  限制变量的值就是该字面量的值   |
|   any   |        \*         |            任意类型             |
| unknown |        \*         |         类型安全的 any          |
|  void   | 空值（undefined） |     没有值（或 undefined）      |
|  never  |      没有值       |          不能是任何值           |
| object  |  {name:'孙悟空'}  |         任意的 JS 对象          |
|  array  |      [1,2,3]      |          任意 JS 数组           |
|  tuple  |       [4,5]       | 元素，TS 新增类型，固定长度数组 |
|  enum   |    enum{A, B}     |       枚举，TS 中新增类型       |

**number**

```typescript
let decimal: number = 6
let hex: number = 0xf00d
let binary: number = 0b1010
let octal: number = 0o744
let big: bigint = 100n
```

**boolean**

```typescript
let isDone: boolean = false
```

**string**

```typescript
let color: string = 'blue'
color = 'red'

let fullName: string = `Bob Bobbington`
let age: number = 37
let sentence: string = `Hello, my name is ${fullName}.

I'll be ${age + 1} years old next month.`
```

**any**

```typescript
let d: any = 4
d = 'hello'
d = true
```

**unknown**

unknown 类型只能赋值给**unknown**和**any**，防止拿到一个不确定的值乱用

any 随意

```typescript
let notSure: unknown = 4
notSure = 'hello'
```

**void**

```typescript
let unusable: void = undefined
const foo = (message: string): void => {
	throw new Error(message)
}
```

**never**

- 表示永远不会发生值的类型，比如一个函数
  - 如果一个函数中是一个死循环或者抛出一个异常，那么这个函数会返回东西吗？
  - 不会，那么写 void 类型或者其他类型作为返回值类型都不合适，我们就可以使用 never 类型

```typescript
function error(message: string): never {
	throw new Error(message)
}
```

**object（没啥用）**

```typescript
let obj: object = {}
```

**symbol**

```typescript
const title1 = Symbol('title')
const title2 = Symbol('title')
const obj = {
	[title1]: 'name',
	[title2]: 'age'
}
console.log(obj)
```

## 类型缩小

- 我们可以通过类似于**typeof padding === 'number'** 的判断语句，来改变 Typescript 的执行路径
- 在给定的执行路径中，我们可以缩小比声明时更小的类型，这个过程称之为缩小
- 而我们编写的 typeof padding === 'number'可以称之为类型保护(type guards)
- 常见的类型保护
  - typeof
  - 平等缩小(===, !==)
  - instanceof (Date, Array) 判断是谁的实例
  - in

## 类型继承

```js
class Animal {
	move(distanceInMeters: number = 0) {
		console.log(`Animal moved ${distanceInMeters}m.`)
	}
}

class Dog extends Animal {
	bark() {
		console.log('Woof! Woof!')
	}
}

const dog = new Dog()
dog.bark()
dog.move(10)
dog.bark()
```

## **tuple 元组**

元组类型允许表示一个**已知元素数量和类型的数组**，各元素的类型不必相同，但是对**元素的位置有要求**，需要对应。

数组合并了相同类型的对象，而元组（Tuple）合并了不同类型的对象。

```typescript
// 指定数组中每一个元素的类型
let arr: [number, string] = [1, 'HelloWorld']
let arr: [number, (arg: string) => void] = [1, Fun]

// 报错：arr的第一个值为数字类型，无法调用字符串方法
console.log(arr[0].substr(1))

// 报错 数组第一个值为number，会报错
// Type 'string' is not assignable to type 'number'.
let arr2: [number, string] = ['1', 1]
```

当直接对元组类型的变量**进行初始化或者赋值**的时候，需要提供所有元组类型中指定的项：

```typescript
let arr: [number, string] = [1] // 报错
```

如果要对**某一个元素赋值**，需要使用下标方式而**不能对整个变量赋值**：

```typescript
let arr: [number, string]
arr[1] = 'string' // OK
```

当添加越界的元素时，它的类型会被限制为元组中每个类型的**联合类型**,也就是说数组本来设定了两个值，但是加入另外的值但是又没有对另外的值进行类型限制的时候，会将另外的值的类型设定为前面类型的**联合类型**：

```typescript
let arr: [number, string]

arr[3] = 'world' // OK, 字符串可以赋值给 string | number 类型

arr[5].toString() // OK, 'string' 和 'number' 都有 toString

arr[6] = true // 报错, true 不符合 string | number 类型
```

## **enum 枚举**

```typescript
enum Color {
	RED = 1,
	GREEN,
	BLUE
}
let c: Color = Color.GREEN

function getColor(color: Color) {
	console.log(color)
	switch (color) {
		case Color.RED:
			console.log(Color.RED)
			break
		case Color.RED:
			console.log(Color.GREEN)
			break
		case Color.RED:
			console.log(Color.BLUE)
			break
	}
}

getColor(Color.BLUE)
```

## **字面量**

也可以使用字面量去指定变量的类型，通过字面量可以确定变量的取值范围

```typescript
type colorType = 'red' | 'blue' | 'black'
let color: colorType
let num: 1 | 2 | 3 | 4 | 5
```

```typescript
type Method = 'POST' | 'GET'
function request(url: string, method: Method) {}

// 推论出url和methods都为string类型
const options = {
	url: 'www.baidu.com',
	methods: 'POST'
}

// 报警告，string不能赋值给Method = 'POST' | 'GET'
request(options.url, options.methods)
```

```typescript
// 1.指明类型
type Request = {
	url: string
	methods: Method
}

const options: Request = {
	url: 'www.baidu.com',
	methods: 'POST'
}
```

```js
// 2.类型断言
request(options.url, options.methods as Method)
```

```typescript
// 2.字面量推理,将比较宽泛的类型转换成具体的字面量
const options = {
    url: 'www.baidu.com',
    methods: 'POST'
} as const
=>
const options : {
    readonly url: 'www.baidu.com';
    readonly methods: 'POST'
} as const
```

## 数组

**定义**

```typescript
const arr: string[] = ['a', 'b']
const arr: (string | number)[] = ['a', 1]

// 泛型
const arr: Array<string> = ['a']
const arr: Array<string | number> = ['a', 1]

// 接口，类数组使用，其他不推荐
interface IArr {
	[index: number]: number
}

let arr1: IArr = [1, 1, 2, 3, 5]
```

**只读数组**

```typescript
let a: number[] = [1, 2, 3, 4] // 原数组可以修改
let ro: ReadonlyArray<number> = a // 所有修改只读数组的操作都会报错

// 报错 只读数组缺少了数组应有的方法，无法赋值给可变数组
a = ro

// 使用类型断言重写，跳过类型检查则不会报错
a = ro as number[]
```

### 对象数组

```typescript
interface Item {
    name: string
    age: number,
    sex: any[]
}
const a: Item[] = [{...}]
```

### 嵌套数组类型

以下类型可用于描述嵌套的数组类型。

```ts
interface DeepArray<T> extends Array<T | DeepArray<T>> {}

const array: DeepArray<string | boolean> = ['string', true, ['string'], [true, ['string']], [[['string', false, 'string']]]]

const bArray: DeepArray<string | boolean> = [1] // Error
```

> [数组 – 在 TypeScript 中描述一个深度嵌套的数组](https://codeday.me/bug/20190516/1114682.html)

### 深度可选类型

以下类型可将一个类型的所有属性、子属性转变为 `Partial`。

```ts
type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends Array<infer U>
		? Array<DeepPartial<U>>
		: T[P] extends ReadonlyArray<infer U>
		? ReadonlyArray<DeepPartial<U>>
		: DeepPartial<T[P]>
}

interface A {
	a: {
		a1: {
			a2: string
			b2: string
		}
		b1: {
			a2: number
			b2: Array<number | string>
		}
	}
	b: string
	c: number[]
}

let t1: DeepPartial<A>

t1.a.a1.a2 // (property) a2?: string
t1.a.a1.b2 // (property) b2?: string
t1.a.b1.b2 // (property) b2?: (string | number)[]
t1.b // (property) b?: string
t1.c // (property) c?: number[]
```

注：上述类型中的 `extends ... ? ...` 可看作类型中的三元表达式。

```ts
// 若泛型 T 继承于 string，则函数 a 返回的类型为 string，否则为 boolean
function a<T>(arg: T): T extends string ? string : boolean {
	// ...
}

interface MyString extends String {}

a('string') // function a<string>(arg: string): string
a(1) // function a<number>(arg: number): boolean
a('string' as MyString) // function a<MyString>(arg: MyString): boolean
```

## 函数

- 函数返回值类型通常可以不写，会推论
- 函数参数**可选**不可以放在**必选**的前面

```typescript
type addfNS = (x:number, y:number) => void
let myAdd: addfNS = () => {}

let myAdd: (x:number, y:number): void => {}
```

```typescript
type s = string | number
interface FnsType {
	name: string
	sayHello(): void // 函数
	content?: string //可选参数
	readonly x: number //只读
	[propName: string]: any //多余属性不报错
}

// 数组， 对象， 数组中的对象
const Fn = (arr: Array<string>, obj: FnsType, arrObj: Array<FnsType>): void => {
	console.log(arr)
}
```

### 函数的剩余参数

- 不确定会传入多少的参数,会将传入的参数放进数组中

```typescript
const fns = (...nums: number[]) => {
	console.log(nums) // [1, 2, 34, 4]
}

fns(1, 2, 34, 4)
```

### 函数的重载

- 函数名相同，函数参数数量或者类型不同

- 不同类型相加，使用联合类型十分麻烦

- ```typescript
  // 使用函数重载
  function add(num1: number, num2: number): number
  // eslint-disable-next-line no-redeclare
  function add(num1: string, num2: string): string
  // eslint-disable-next-line no-redeclare
  function add(num1: number, num2: string): string

  // eslint-disable-next-line no-redeclare
  function add(num1: any, num2: any): any {
  	console.log(num1 + num2)
  }

  add(1, 2)
  add(1, '2')
  add('1', '2')
  ```

## 对象

```typescript
// 使用接口
interface Person{
    name: string;
    sayHello(): void;    // 函数
    content?: string;    //可选参数
    readonly x: number;    //只读
    [propName: string]: any;//多余属性不报错
}
const obj: Person {

}

// 函数中的对象,指明对象中有什么属性和属性是什么类型
const objFns = (point: {x: number, y: number}) => {

}

// 使用type
type objType = {
    x: number,
    y: number,
    z?: string;    //可选参数
}
```

## 接口（Interface）

接口的作用类似于抽象类，不同点在于接口中的所有方法和属性都是没有实值的，换句话说接口中的所有方法都是抽象方法。接口主要负责定义一个类的结构，接口可以去限制一个对象的接口，对象只有包含接口中定义的所有属性和方法时才能匹配接口。同时，可以让一个类去实现接口，实现接口时类中要保护接口中的所有属性。

- 基本使用

  - ```typescript
    interface Person {
    	name: string
    	sayHello(): void // 对象中的函数
    	sayHello: () => void // 对象中的函数
    	content?: string //可选参数
    	readonly x: number //只读
    	[propName: string]: any //多余属性不报错,索引类型,propName是形参
    }
    interface onlyFns {
    	// 定义单个函数
    	(num: string): void
    }

    function fn(per: Person) {
    	per.sayHello()
    }

    fn({
    	name: '孙悟空',
    	sayHello() {
    		console.log(`Hello, 我是 ${this.name}`)
    	}
    })
    ```

- **接口的继承**

  - 接口的扩展就是给多添加了一些约束。一个接口可以扩展多个接口，用“，”隔开，当一个接口扩展另一个接口，也继承了该接口的约束。

  ```ts
  //shape接口
  interface Shape{
     //颜色
      color:string;
  }
  interface PenStroke {
      penWidth: number;
  }
  interface Triangle extends Shape, PenStroke{
      //边数
      sideNum:number;
  }
  let triangle： Triangle={};
  triangle.color="blue";
  triangle.sideNum=3;

  let square:Shape;
  square.penWidth = 5.0;// 报错
  square.color="red";
  ```

- **泛型接口**

```typescript
interface Person<T1 = string, T2 = number> {
	// 可以加默认值
	name: T1
	age: T2
}
const p: Person<string, number> = {
	name: 'why',
	age: 10
}
```

## 类型别名 type

type 会给一个类型起个新名字。 type 有时和 interface 很像，但是可以作用于原始值（基本类型），联合类型，元组以及其它任何你需要手写的类型。

```typescript
type Name = string // 基本类型
type NameResolver = () => string // 函数
type NameOrResolver = Name | NameResolver | number // 联合类型
type Data = [number, string] // 元组
type Name = {
	// 对象
	name: 'string'
	age: 123
}

let div = document.createElement('div') // dom
type B = typeof div
```

同接口一样，类型别名也可以是泛型

```ts
type Container<T> = { value: T }
```

也可以使用类型别名来在属性里引用自己：

```ts
type Tree<T> = {
	value: T
	left: Tree<T>
	right: Tree<T>
}
```

与交叉类型一起使用，我们可以创建出一些十分稀奇古怪的类型。

```ts
type LinkedList<T> = T & { next: LinkedList<T> }

interface Person {
	name: string
}

var people: LinkedList<Person>
var s = people.name
var s = people.next.name
var s = people.next.next.name
var s = people.next.next.next.name
```

然而，类型别名不能出现在声明右侧的任何地方。

```ts
type Yikes = Array<Yikes> // error
```

## 泛型（Generic）

定义一个函数或类时，有些情况下无法确定其中要使用的具体类型（返回值、参数、属性的类型不能确定），此时泛型便能够发挥作用。

- 泛型常用的名称

  - T：Type 的缩写
  - K，V：key 和 value 的缩写，键值对
  - E：Element 的缩写，元素
  - O：Object 的缩写，对象

- 基本使用

  - ```typescript
    function test<T>(arg: T): T {
    	// 普通函数
    	return arg
    }
    const foo = <T extends {}>(x: T) => {
    	// 箭头函数
    	console.log(x)
    }
    // 指明类型
    test<string>('123')
    test<number[]>([123])

    //    不指明类型会进行推导
    test(123) // number
    ```

- **泛型限制**

  - ```typescript
    interface MyInter {
    	length: number
    }

    function test<T extends MyInter>(str: T) {
    	console.log(str.length)
    }

    const foo = <T extends number>(x: T, y: T) => {
    	console.log(x + y)
    }
    foo(1, 2)
    ```

- **多个泛型**

  - ```typescript
    function test<T, K>(a: T, b: K): K {
    	return b
    }

    test<number, string>(10, 'hello')
    ```

### 使用泛型变量

泛型就相当于 ts 中的变量，有的时候使用联合类型很难穷举完所有的情况就可以使用泛型

```ts
function identity<T>(arg: T): T {
	return arg
}
```

如果我们想同时打印出`arg`的长度。 我们很可能会这样做：

```ts
function loggingIdentity<T>(arg: T): T {
	console.log(arg.length) // Error: T doesn't have .length
	return arg
}
```

无法确定是否有 length，要指明有，比如说数组类型

```typescript
function loggingIdentity<T>(arg: Array<T>): Array<T> {
	console.log(arg.length) // Array has a .length, so no more error
	return arg
}
// 使用接口
interface sam {
	length: number
}
function loggingIdentity<T extends sam>(arg: T): T {
	console.log(arg.length) // Array has a .length, so no more error
	return arg
}
```

## 实用程序类型

https://www.typescriptlang.org/docs/handbook/utility-types.html

### Record

构造一个对象类型，其属性键为`Keys`，其属性值为`Type`。此实用程序可用于将一种类型的属性映射到另一种类型。

**对象中的对象类型**

```typescript
interface CatInfo {
	age: number
	breed: string
}

type CatName = 'miffy' | 'boris' | 'mordred'

const cats: Record<CatName, CatInfo> = {
	miffy: { age: 10, breed: 'Persian' },
	boris: { age: 5, breed: 'Maine Coon' },
	mordred: { age: 16, breed: 'British Shorthair' }
}

const dogs: Record<string, string> // 键值对为string类型
```

# 面向对象

面向对象是程序中一个非常重要的思想，它被很多同学理解成了一个比较难，比较深奥的问题，其实不然。面向对象很简单，简而言之就是程序之中所有的操作都需要通过对象来完成。

- 举例来说：
  - 操作浏览器要使用 window 对象
  - 操作网页要使用 document 对象
  - 操作控制台要使用 console 对象

一切操作都要通过对象，也就是所谓的面向对象，那么对象到底是什么呢？这就要先说到程序是什么，计算机程序的本质就是对现实事物的抽象，抽象的反义词是具体，比如：照片是对一个具体的人的抽象，汽车模型是对具体汽车的抽象等等。程序也是对事物的抽象，在程序中我们可以表示一个人、一条狗、一把枪、一颗子弹等等所有的事物。一个事物到了程序中就变成了一个对象。

在程序中所有的对象都被分成了两个部分数据和功能，以人为例，人的姓名、性别、年龄、身高、体重等属于数据，人可以说话、走路、吃饭、睡觉这些属于人的功能。数据在对象中被成为属性，而功能就被称为方法。所以简而言之，在程序中一切皆是对象。

## 面向对象的特点

- 封装

  - 对象实质上就是属性和方法的容器，它的主要作用就是存储属性和方法，这就是所谓的封装

  - 默认情况下，对象的属性是可以任意的修改的，为了确保数据的安全性，在 TS 中可以对属性的权限进行设置

  - 只读属性（readonly）：

    - 如果在声明属性时添加一个 readonly，则属性便成了只读属性无法修改

  - TS 中属性具有三种修饰符：

    - public（默认值），可以在类、子类和对象中修改
    - protected ，可以在类、子类中修改
    - private ，可以在类中修改

  - 示例：

    - public

      - ```typescript
        class Person {
        	public name: string // 写或什么都不写都是public
        	public age: number

        	constructor(name: string, age: number) {
        		this.name = name // 可以在类中修改
        		this.age = age
        	}

        	sayHello() {
        		console.log(`大家好，我是${this.name}`)
        	}
        }

        class Employee extends Person {
        	constructor(name: string, age: number) {
        		super(name, age)
        		this.name = name //子类中可以修改
        	}
        }

        const p = new Person('孙悟空', 18)
        p.name = '猪八戒' // 可以通过对象修改
        ```

    - protected

      - ```typescript
        class Person {
        	protected name: string
        	protected age: number

        	constructor(name: string, age: number) {
        		this.name = name // 可以修改
        		this.age = age
        	}

        	sayHello() {
        		console.log(`大家好，我是${this.name}`)
        	}
        }

        class Employee extends Person {
        	constructor(name: string, age: number) {
        		super(name, age)
        		this.name = name //子类中可以修改
        	}
        }

        const p = new Person('孙悟空', 18)
        p.name = '猪八戒' // 不能修改
        ```

    - private

      - ```typescript
        class Person {
        	private name: string
        	private age: number

        	constructor(name: string, age: number) {
        		this.name = name // 可以修改
        		this.age = age
        	}

        	sayHello() {
        		console.log(`大家好，我是${this.name}`)
        	}
        }

        class Employee extends Person {
        	constructor(name: string, age: number) {
        		super(name, age)
        		this.name = name //子类中不能修改
        	}
        }

        const p = new Person('孙悟空', 18)
        p.name = '猪八戒' // 不能修改
        ```

  - 属性存取器

    - 对于一些不希望被任意修改的属性，可以将其设置为 private

    - 直接将其设置为 private 将导致无法再通过对象修改其中的属性

    - 我们可以在类中定义一组读取、设置属性的方法，这种对属性读取或设置的属性被称为属性的存取器

    - 读取属性的方法叫做 setter 方法，设置属性的方法叫做 getter 方法

    - 示例：

      - ```typescript
        class Person {
        	private _name: string

        	constructor(name: string) {
        		this._name = name
        	}

        	get name() {
        		return this._name
        	}

        	set name(name: string) {
        		this._name = name
        	}
        }

        const p1 = new Person('孙悟空')
        console.log(p1.name) // 通过getter读取name属性
        p1.name = '猪八戒' // 通过setter修改name属性
        ```

  - 静态属性

    - 静态属性（方法），也称为类属性。使用静态属性无需创建实例，通过类即可直接使用

    - 静态属性（方法）使用 static 开头

    - 示例：

      - ```typescript
        class Tools {
        	static PI = 3.1415926

        	static sum(num1: number, num2: number) {
        		return num1 + num2
        	}
        }

        console.log(Tools.PI)
        console.log(Tools.sum(123, 456))
        ```

  - this

    - 在类中，使用 this 表示当前对象

- 继承

  - 继承时面向对象中的又一个特性

  - 通过继承可以将其他类中的属性和方法引入到当前类中

    - 示例：

      - ```typescript
        class Animal {
        	name: string
        	age: number

        	constructor(name: string, age: number) {
        		this.name = name
        		this.age = age
        	}
        }

        class Dog extends Animal {
        	bark() {
        		console.log(`${this.name}在汪汪叫！`)
        	}
        }

        const dog = new Dog('旺财', 4)
        dog.bark()
        ```

  - 通过继承可以在不修改类的情况下完成对类的扩展

  - 重写

    - 发生继承时，如果子类中的方法会替换掉父类中的同名方法，这就称为方法的重写

    - 示例：

      - ```typescript
        class Animal {
        	name: string
        	age: number

        	constructor(name: string, age: number) {
        		this.name = name
        		this.age = age
        	}

        	run() {
        		console.log(`父类中的run方法！`)
        	}
        }

        class Dog extends Animal {
        	bark() {
        		console.log(`${this.name}在汪汪叫！`)
        	}

        	run() {
        		console.log(`子类中的run方法，会重写父类中的run方法！`)
        	}
        }

        const dog = new Dog('旺财', 4)
        dog.bark()
        ```

      - 在子类中可以使用 super 来完成对父类的引用

  - 抽象类（abstract class）

    - 抽象类是专门用来被其他类所继承的类，它只能被其他类所继承不能用来创建实例

    - ```typescript
      abstract class Animal {
      	abstract run(): void
      	bark() {
      		console.log('动物在叫~')
      	}
      }

      class Dog extends Animals {
      	run() {
      		console.log('狗在跑~')
      	}
      }
      ```

    - 使用 abstract 开头的方法叫做抽象方法，抽象方法没有方法体只能定义在抽象类中，继承抽象类时抽象方法必须要实现

### Extend

两者都可以扩展，但是语法又有所不同。此外，请注意接口和类型别名不是互斥的。接口可以扩展类型别名，反之亦然。

Interface extends interface

```ts
interface PartialPointX {
	x: number
}
interface Point extends PartialPointX {
	y: number
}
```

Type alias extends type alias

```ts
type PartialPointX = { x: number }
type Point = PartialPointX & { y: number }
```

Interface extends type alias

```ts
type PartialPointX = { x: number }
interface Point extends PartialPointX {
	y: number
}
```

Type alias extends interface

```ts
interface PartialPointX {
	x: number
}
type Point = PartialPointX & { y: number }
```

### class Implements

类可以以相同的方式实现接口或类型别名。但是请注意，类和接口被认为是静态的。因此，它们不能实现/扩展命名联合类型的类型别名。

```ts
interface Point {
	x: number
	y: number
}

class SomePoint implements Point {
	x: 1
	y: 2
}

type Point2 = {
	x: number
	y: number
}

class SomePoint2 implements Point2 {
	x: 1
	y: 2
}

type PartialPoint = { x: number } | { y: number }

// FIXME: can not implement a union type
class SomePartialPoint implements PartialPoint {
	x: 1
	y: 2
}
```

### extends class

类定义会创建两个东西：类的实例类型和一个构造函数。 因为类可以创建出类型，所以你能够在允许使用接口的地方使用类。

```ts
class Point {
	x: number
	y: number
}

interface Point3d extends Point {
	z: number
}
```

### Declaration merging

与类型别名不同，接口可以定义多次，并将被视为单个接口(合并所有声明的成员)。

```ts
// These two declarations become:
// interface Point { x: number; y: number; }
interface Point {
	x: number
}
interface Point {
	y: number
}

const point: Point = { x: 1, y: 2 }
```

### 计算属性，生成映射类型

type 能使用 in 关键字生成映射类型，但 interface 不行。

语法与索引签名的语法类型，内部使用了 for .. in。 具有三个部分：

- 类型变量 K，它会依次绑定到每个属性。
- 字符串字面量联合的 Keys，它包含了要迭代的属性名的集合。
- 属性的结果类型。

```ts
type Keys = 'firstname' | 'surname'

type DudeType = {
	[key in Keys]: string
}

const test: DudeType = {
	firstname: 'Pawel',
	surname: 'Grzybek'
}

// 报错
//interface DudeType2 {
//  [key in keys]: string
//}
```

### 其他细节

```ts
export default interface Config {
	name: string
}

// export default type Config1 = {
//   name: string
// }
// 会报错

type Config2 = {
	name: string
}
export default Config2
```
