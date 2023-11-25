# Dart 介绍：

[dart 语言学习](https://ducafecat.tech/categories/Dart%E8%AF%AD%E8%A8%80%E5%AD%A6%E4%B9%A0/)

Dart 是由谷歌开发的计算机编程语言,它可以被用于 web、服务器、移动应用 和物联网等领域的开发。Dart 诞生于 2011 年，号称要取代 JavaScript。但是过去的几年中一直不温不火。直到[Flutter](https://so.csdn.net/so/search?q=Flutter&spm=1001.2101.3001.7020)的出现现在被人们重新重视。要学 Flutter 的话我们必须首先得会 Dart。

```js
官网：https://dart.dev/
```

## 1 Dart 环境搭建：

要在我们本地开发 Dart 程序的话首先需要安装 Dart Sdk

```js
官方文档：https://dart.dev/get-dart
```

windows(推荐): `http://www.gekorm.com/dart-windows/` mac：如果 mac 电脑没有安装 brew 这个工具首先第一步需要安装它： `https://brew.sh/`

```terimnal
brew tap dart-lang/dart
brew install dart
```

## 2 Dart 开发工具：

Dart 的开发工具有很多： IntelliJ IDEA 、 WebStorm、 Atom、Vscode 等，这里我们主要给大家讲解的是如果在 Vscode 中配置 Dart。

- 1、找到 vscode 插件安装 dart
- 2、找到 vscode 插件安装 code runner Code Runner 可以运行我们的文件

## 3 示例：

```c
main(){//main是程序的唯一入口
  print('你好 dart');//输出语句
  print("你好 dart1");//可以是单引号也可以是双引号
}
```

- 入口方法的两种定义方式：

```c
main(){
    print('你好dart');
}
//表示main方法没有返回值
///也是注释
void main(){
	print('你好dart');
}
```

# dart 基本规则

## Dart 变量

dart 是一个强大的脚本类语言，**可以不预先定义变量类型** ，自动会类型推倒，dart 中定义变量可以**通过 var 关键字**可以通过类型来申明变量，如：

**var** 如果没有初始值，可以变成任何类型

```c
var a;
a = 'ducafecat';
a = 123;
a = true;
a = {'key': 'val123'};
a = ['abc'];
```

- **注意：** var 后就不要写类型，写了类型不要 var，两者都写`var a int = 5;`报错。示例：

```c
void main() {
  var str='你好dart';
  var myNum=1234;
  print(str);
  print(myNum);

  //字符串
  String str='你好dart';
  print(str);

  //数字类型
  int myNum=12354;
  print(myNum);

  //dart里面有类型校验
  var str='';
  str=1234;//报错
  print(str);

  String str = "2131242";
  print(str);
  int myNum = 1243214;
  print(myNum);
}
```

## Dart 常量 final 和 const 修饰符

- const 值不变 一开始就得赋值

- 初始后不能再赋值

- 不能和 var 同时使用

- final 可以开始不赋值 只能赋一次 ; 而 final 不仅有 const 的编译时常量的特性，最重要的它是运行时常量，并且 final 是惰性初始化，即在运行时第一次使用前才初始化。

  - ```dart
    // 需要确定的值
    final dt = DateTime.now();

    const dt = const DateTime.now();
    ```

- **注意：永远不改量的量，请使用 final 或 const 修饰它，而不是使用 var 或其他变量类型。**

```c
final name = 'Bob'; // Without a type annotation
final String nickname = 'Bobby';
const bar = 1000000; // Unit of pressure (dynes/cm2)
const double atm = 1.01325 * bar; // Standard atmosphere
*/
void main() {
    /*
      var str='this is a str';
      str='你好 str';
      print(str);

      int myNum=1234;
      myNum=4567;
      print(myNum);
     */

    //const常量
    const PI=3.14159;
    PI=123.1243; //错误的写法 常量不可以修改
    print(PI);

    // final 常量
    final PI=3.14159;
    PI=124214.214124;   //错误写法
    print(PI);
    final a = new DateTime.now(); //const不能这么写，因为a是在运行是被赋值的，刚定义时没被赋值
    print(a); //2019-05-10 15:59:02.966122
    const a=new DateTime.now();   //报错了

	// 内存中重复创建
    final a1 = [11 , 22];
    final a2 = [11 , 22];
    print(identical(a1, a2));

    const a1 = [11 , 22];
    const a2 = [11 , 22];
    print(identical(a1, a2));
}
```

## 常量折叠(const 创建相同对象)

如果使用`const`关键字创建相同的对象，Dart 编译器会尝试将它们合并为一个对象。这个过程称为常量折叠(constant folding)。常量折叠可以带来更好的性能和更小的内存占用，因为它减少了程序中的冗余对象。

例如，考虑下面的代码片段：

```dart
dartCopy codeconst obj1 = const MyClass();
const obj2 = const MyClass();
```

在这个代码片段中，我们使用`const`关键字创建了两个`MyClass`类的对象`obj1`和`obj2`。由于`obj1`和`obj2`都是用`const`关键字创建的，它们的值是不可变的，而且它们的内容是相同的，因此 Dart 编译器会将它们合并为一个对象。因此，如果我们比较`obj1`和`obj2`的引用，它们将会相等：

```dart
dartCopy code
print(identical(obj1, obj2)); // 输出 true
```

需要注意的是，常量折叠只适用于`const`关键字创建的对象，如果我们使用`new`关键字创建对象，则不会发生常量折叠。同时，只有当对象的内容是相同的时候，常量折叠才会发生。如果对象的内容不同，即使它们的类型相同，常量折叠也不会发生。

## 常量构造函数

在 Dart 中，常量构造函数(const constructor)是一种特殊的构造函数，它可以用来创建编译时常量。常量构造函数的特点是它们创建的对象是不可变的，并且它们只能访问静态变量或常量。常量构造函数必须用`const`关键字修饰，并且只能创建`const`对象或被`const`修饰的对象。

常量构造函数和普通构造函数的语法类似，但是常量构造函数必须满足以下条件：

- 所有的实例变量都必须是`final`类型，因为常量对象是不可变的。
- 常量构造函数的函数体必须为空，或者只能有一个`assert`语句。
- 常量构造函数不能使用`this`关键字引用当前对象，因为对象还没有被创建。

下面是一个使用常量构造函数的示例代码：

```dart
class Point {
  final int x;
  final int y;

  const Point(this.x, this.y);
}

void main() {
  const p1 = const Point(1, 2);
  const p2 = const Point(1, 2);

  print(identical(p1, p2)); // 输出 true
}
```

在这个例子中，`Point`类定义了一个常量构造函数，并且它的所有实例变量都是`final`类型。然后我们创建了两个相同的`Point`对象`p1`和`p2`，并且它们都是使用`const`关键字创建的。由于`Point`类的对象是不可变的，而且它们的内容是相同的，Dart 编译器会将它们合并为一个对象。因此，如果我们比较`p1`和`p2`的引用，它们将会相等。

## 变量的两种类型

### 弱类型

**var**

如果没有初始值，可以变成任何类型

```dart
var a;
a = 'ducafecat';
a = 123;
a = true;
a = {'key': 'val123'};
a = ['abc'];
```

**Object**

动态任意类型，编译阶段检查类型

```dart
Object a = 'doucafecat';
a = 123;
a = [2222];
a.p();
```

**dynamic**

动态任意类型，编译阶段不检查检查类型

```dart
dynamic a = 'doucafecat';
a = 123;
a = [1111];
a.p();
```

**比较 var 与 dynamic、Object**

唯一区别 var 如果有初始值，类型被锁定

```dart
var a = 'ducafecat';
dynamic a = 'doucafecat';
Object a = 'doucafecat';
a = 123;
```

### 强类型

**申明类型**

声明后，类型被锁定

```dart
String a;
a = 'ducafecat';
a = 123;
```

![img](https://ducafecat.tech/2018/10/10/dart/dart-04-variables/2018-10-10-11-24-04.png)

**常见类型**

| 名称         | 说明          |
| ------------ | ------------- |
| num          | 数字          |
| int          | 整型          |
| double       | 浮点          |
| bool         | 布尔          |
| String       | 字符串        |
| StringBuffer | 字符串 buffer |
| DateTime     | 时间日期      |
| Duration     | 时间区间      |
| List         | 列表          |
| Sets         | 无重复队列    |
| Maps         | kv 容器       |
| enum         | 枚举          |

```dart
String a = 'doucafecat';
int i = 123;
double d = 0.12;
bool b = true;
DateTime dt = new DateTime.now();
List l = [ a, i, d, b, dt];
```

**默认值**

一切都是 `Object` , 变量声明后默认都是 `null`

```dart
var a;
String a;
print(a);
assert(a == null);
```

> `assert` 检查点函数，如果不符合条件直接抛出错误并终止程序进程

**如何使用**

- 在写 API 接口的时候，请用 `强类型`，一旦不符合约定，接收数据时能方便排查故障
- 你在写个小工具时，可以用 `弱类型`，这样代码写起来很快，类型自动适应

## Dart 的命名规则

- 变量名称必须由数字、字母、下划线和美元符($)组成。
- 注意：标识符开头不能是数字
- 标识符不能是保留字和关键字。
- 变量的名字是区分大小写的如: age 和 Age 是不同的变量。在实际的运用中,也建议,不要用一个单词大小写区分两个变量。
- 标识符(变量名称)一定要见名思意 ：变量名称建议用名词，方法名称建议用动词。

```py
void main() {
  var $ = 'dd';
  print($);
  var str1 = '2134214';
  var 2str='xxx';   //错误
  var if='124214';  //错误

  //变量的名字是区分大小写的
  var age = 20;
  var Age = 30;
  print(age);
  print(Age);

  //变量的名字最好具有意义
  var price = 12;
  var name = 124;
}
```

## identical 比较两个对象是否完全相同

在 Dart 中，`identical()`是一个用于比较两个对象是否完全相同的函数。它的用法与`==`操作符不同，`==`操作符比较的是两个对象的内容是否相同，而`identical()`函数比较的是两个对象是否指向同一个内存地址。

`identical()`函数的定义如下：

```dart
bool identical(Object a, Object b)
```

它接受两个`Object`类型的参数`a`和`b`，并返回一个布尔值。如果`a`和`b`指向同一个内存地址，则返回`true`，否则返回`false`。

下面是一个使用`identical()`函数的示例：

```dart
void main() {
  var a = [1, 2, 3];
  var b = [1, 2, 3];
  var c = a;

  print(identical(a, b)); // 输出：false
  print(identical(a, c)); // 输出：true
}
```

在这个示例中，我们定义了三个列表变量`a`、`b`和`c`，其中`a`和`b`内容相同，但是它们指向不同的内存地址，而`c`指向`a`的内存地址。

在调用`identical()`函数时，我们分别传递了`a`和`b`，以及`a`和`c`两个参数。对于`a`和`b`，`identical()`函数返回`false`，因为它们指向不同的内存地址；对于`a`和`c`，`identical()`函数返回`true`，因为它们指向同一个内存地址。

需要注意的是，由于`identical()`函数比较的是两个对象是否指向同一个内存地址，因此它不适用于比较基本数据类型，如`int`、`double`和`bool`等。对于基本数据类型，应该使用`==`操作符来比较它们的值是否相同。

# dart 数据类型

Dart 中支持以下数据类型： 1、常用数据类型：

- Numbers（数值）:``int`、`double`
- Strings（字符串）: `String`
- Booleans(布尔): `bool`
- List（数组）: `List`,在 Dart 中，数组是列表对象，所以大多数人只是称它们为列表
- Maps（字典）: `Map`,通常来说，Map 是一个键值对相关的对象。 键和值可以是任何类型的对象。每个 键 只出现一次， 而一个值则可以出现多次。

2、项目中用不到的数据类型 （用不到）：

- Runes：Rune 是 UTF-32 编码的字符串。它可以通过文字转换成符号表情或者代表特定的文字。

```py
main() {
	var clapping = '\u{1f44f}';
	print(clapping);
	print(clapping.codeUnits);
	print(clapping.runes.toList())；
	Runes input = new Runes(
      '\u2665  \u{1f605}  \u{1f60e}  \u{1f47b}  \u{1f596}  \u{1f44d}')；
  	print(new String.fromCharCodes(input));
}
```

- Symbols：Symbol 对象表示在 Dart 程序中声明的运算符或标识符。您可能永远不需要使用符号，但它们对于按名称引用标识符的 API 非常有用，因为缩小会更改标识符名称而不会更改标识符符号。要获取标识符的符号，请使用符号文字，它只是＃后跟标识符：在 Dart 中符号用 # 开头来表示，入门阶段不需要了解这东西，可能永远也用不上。 `http://dart.goodev.org/guides/libraries/library-tour#dartmirrors---reflection`

## 字符串类型

- isEmpty：判断字符串是否为空

```python
void main(){
  //1、字符串定义的几种方式
  var str1='this is str1';
  var str2="this is str2";
  print(str1);
  print(str2);

  String str1='this is str1';
  String str2="this is str2";
  print(str1);
  print(str2);

  String str1= '''this is str1
  					this is str1
  					 this is str1''';
  print(str1);

  String str1="""this is str1
  					this is str1
  					this is str1""";
  print(str1);

  //2、字符串的拼接
  String str1='你好';
  String str2='Dart';
  print("$str1 $str2");//两个变量间隔的空格也会加进去。
  print(str1 + str2);
  print(str1 +" "+ str2);
}
```

## 数值型

```dart
void main() {
    //1、int   必须是整数值，其取值通常位于 -253 和 253 之间。
    int a = 123;
    a = 45;
    print(a);
    a = 45.0; //报错

    //2、double  既可以是整型 也可是浮点型
    double b = 23.5;
    b = 24;
    print(b);

    //3、int 和 double 都是 num 的子类。 科学计数法
    num a = 21.2e3;
    print([a]);

    // 运算符  + - * / %
    var c = a + b;
    print(c);

	// 数值转换
    // string -> int
    // string -> double
    int a = int.parse('123');
    double b = double.parse('1.223');

    // int -> string
    // double -> string
    String a = 123.toString();
    String b = 1.223.toString();
    print([a, b]);

    // double -> int
    double a = 1.8;
    int b = a.toInt();
    print(b);
}
```

## 布尔类型

```dart
void main(){
 	 //1、bool
    bool flag1=true;
    print(flag1);
    bool flag2=false;
    print(flag2);

  	//2、条件判断语句
    var flag=true;
    if(flag){
        print('真');
    }else{
        print('假');
    }

    // var a=123;
    // var b='123';
    // if(a==b){
    //   print('a=b');
    // }else{
    //    print('a!=b');
    // }

    var a=123;
    var b=123;
    if(a==b){
        print('a=b');
    }else{
        print('a!=b');
    }
}
```

## list 类型

```py
void main() {
  //1、第一种定义List的方式
  var l1 = ['aaa', 'bbbb', 'cccc'];
  print(l1);
  print(l1.length);
  print(l1[1]);

  //2、第二种定义List的方式
  var l2 = new List();
  l2.add('张三');
  l2.add('李四');
  l2.add('王五');
  print(l2);
  print(l2[2]);

  //3、定义List指定类型
  var l3 = new List<String>();
  l3.add('张三');
  //l3.add(123);//报错
  print(l3);
}
```

## maps 类型

```py
void main() {
  //第一种定义 Maps的方式
  var person = {
    "name": "张三",
    "age": 20,
    "work": ["程序员", "送外卖"]//可以嵌套
  };
  print(person);
  print(person["name"]);
  print(person["age"]);
  print(person["work"]);

  //第二种定义 Maps的方式
  var p = new Map();
  p["name"] = "李四";
  p["age"] = 22;
  p["work"] = ["程序员", "送外卖"];
  print(p);
  print(p["age"]);
}
```

## 判断数据类型:is 关键字

```py
void main() {
  var str = '1234';
  if (str is String) {
    print('是string类型');
  } else if (str is int) {
    print('int');
  } else {
    print('其他类型');
  }

  var str_1 = 123;
  if (str_1 is String) {
    print('是string类型');
  } else if (str_1 is int) {
    print('int');
  } else {
    print('其他类型');
  }
}
```

## 日期时间

**声明**

```dart
var now = new DateTime.now();
print(now);
var d = new DateTime(2018, 10, 10, 9, 30);
print(d);
```

**创建时间 UTC**

- [UTC 协调世界时](https://zh.wikipedia.org/wiki/协调世界时)
- [原子时](https://zh.wikipedia.org/wiki/原子时)
- [原子钟](https://zh.wikipedia.org/wiki/原子鐘)

```dart
var d = new DateTime.utc(2018, 10, 10, 9, 30);
print(d);
```

**解析时间 IOS 8601**

- [ISO 8601](https://zh.wikipedia.org/wiki/ISO_8601)
- [时区](https://zh.wikipedia.org/wiki/时区)
- [时区列表](https://zh.wikipedia.org/wiki/时区列表)

```dart
var d1 = DateTime.parse('2018-10-10 09:30:30Z');
print(d1);
var d2 = DateTime.parse('2018-10-10 09:30:30+0800');
print(d2);时间增减量
```

```dart
var d1 = DateTime.now();
print(d1);
print(d1.add(new Duration(minutes: 5)));
print(d1.add(new Duration(minutes: -5)));
```

**比较时间**

```dart
var d1 = new DateTime(2018, 10, 1);
var d2 = new DateTime(2018, 10, 10);
print(d1.isAfter(d2));
print(d1.isBefore(d2));
var d1 = DateTime.now();
var d2 = d1.add(new Duration(milliseconds: 30));
print(d1.isAtSameMomentAs(d2));
```

**时间差**

```dart
var d1 = new DateTime(2018, 10, 1);
var d2 = new DateTime(2018, 10, 10);
var difference = d1.difference(d2);
print([difference.inDays, difference.inHours]);
```

**时间戳**

- [公元](https://zh.wikipedia.org/wiki/公元)

```dart
var now = new DateTime.now();
print(now.millisecondsSinceEpoch);
print(now.microsecondsSinceEpoch);
```

## 可空类型&非空断言

```dart
String? username = "张三" // 表示username是一个可空类型
username = null

List<String>? li = ['1', '2']
li = null

// 非空断言使用！类似于ts
```

## late 延迟初始化

在 Dart 中，`late`关键字用于标记延迟初始化的变量，即在声明变量时不初始化，在后续代码中再初始化。

```dart
class Person {
  late String name;

  void printName() {
    print('My name is $name');
  }
}

void main() {
  var person = Person();
  person.name = 'John';
  person.printName(); // 输出：My name is John
}
```

在这个示例中，我们定义了一个`Person`类，其中有一个延迟初始化的字符串变量`name`。在`printName`方法中，我们使用了这个变量。在`main`函数中，我们创建了一个`Person`对象，并在后续代码中初始化了`name`变量，然后调用了`printName`方法。

使用`late`关键字可以让我们在声明变量时不必立即初始化，而是在后续代码中再进行初始化。这可以让我们更灵活地控制变量的初始化时机，并提高代码的可读性和可维护性。但是，需要注意的是，使用`late`关键字的变量必须在第一次使用之前被初始化，否则会抛出`LateInitializationError`异常。因此，我们需要在编写代码时仔细考虑变量的初始化时机，以避免出现异常。

## required 声明必填参数的作用

在 Dart 中，方法的参数默认情况下是可选的。但是，有时候我们需要确保某些参数在调用方法时必须被传递，这时就可以使用`required`关键字来声明这些必填参数。

使用`required`关键字声明的参数必须在方法调用时被显式传递，否则会在编译时报错。这可以帮助我们在编写代码时更容易地避免由于缺少必要参数而导致的运行时错误。

例如，下面是一个使用`required`关键字声明必填参数的方法示例：

```dart
void printName({required String firstName, required String lastName}) {
  print('$firstName $lastName');
}

void main() {
  printName(firstName: 'John', lastName: 'Doe');
}
```

在上面的示例中，我们定义了一个`printName`方法，它有两个必填参数`firstName`和`lastName`。这些参数在方法定义时使用了`required`关键字进行声明。在`main`函数中，我们调用了`printName`方法，并显式传递了这两个必填参数。

如果我们忘记传递必填参数，例如：

```dart
void main() {
  printName(firstName: 'John');
}
```

那么在编译时会抛出一个错误，提示我们缺少必填参数`lastName`。这可以帮助我们及时发现并修复错误，避免在运行时出现不必要的异常。

# 库运用

- 自定义库，也就是抽离出的 class 的 dart 文件
- 系统内置的库：import ‘dart：math’
- Pub 包管理系统中的库
  - https://pub.dev/
  - https://pub.flutter-io.cn/packages?q=
  - 需要在自己的项目根目录下新建一个 pubspec.yaml
  - 在 pubspec.yaml 文件中配置名称，描述，依赖等信息
  - 然后运行**pub get**获取包

**导入核心库**

```dart
import 'dart:io';

void main() {
  var f = new File('README.md');
  var content = f.readAsStringSync();
  print(content);
}
```

**导入第三方库**

- 编写 `pubspec.yaml`

```dart
name: ducafecat
dependencies:
  dio: 1.0.9
```

- 程序调用

```dart
import 'package:dio/dio.dart';

void main() async {
  Dio dio = new Dio();
  Response<String> response = await dio.get("https://www.baidu.com");
  print(response.data);
}
```

**导入文件**

```dart
import './phone.dart';

void main() {
  var xm = Phone('android');
  xm.startup();
  xm.shutdown();
}
```

**库的重命名**

```dart
import './phone.dart';
import './phone1.dart' as pp;

void main() {
  var xm = Phone('android');
  xm.startup();
  xm.shutdown();

  var xm1 = pp.Phone('android');
  xm1.startup();
  xm1.shutdown();
}
```

**库的部分导入**

```dart
// import './phone.dart' hide AndroidPhone;
import './phone.dart' show IOSPhone;

void main() {
  var xm = IOSPhone();
  xm.startup();
  xm.shutdown();
}
```

> `hide` 筛掉某几个包 `show` 只使用某几个包

**延迟载入**

```dart
import './phone.dart' deferred as pp;

void main() async {
  var run = true;
  if (run) {
    await pp.loadLibrary();
    var xm = pp.Phone('android');
    xm.startup();
    xm.shutdown();
  }
}
```

> `loadLibrary()` 方式在需要的时候载入包可提高程序启动速度用在不常使用的功能用在载入时间过长的包

# 操作符

**操作符表**

| 描述     | 操作符                                 |       |     |
| -------- | -------------------------------------- | ----- | --- |
| 后缀操作 | expr++ expr– () [] . ?.                |       |     |
| 前缀操作 | -expr !expr ~expr ++expr –expr         |       |     |
| 乘除     | \* / % ~/                              |       |     |
| 加减     | + -                                    |       |     |
| 位移     | << >>                                  |       |     |
| 按位与   | &                                      |       |     |
| 按位异或 | ^                                      |       |     |
| 按位或   | \                                      |       |     |
| 类型操作 | >= > <= < as is is!                    |       |     |
| 相等     | == !=                                  |       |     |
| 逻辑与   | &&                                     |       |     |
| 逻辑或   | \                                      | \     |     |
| 是为为空 | ??                                     |       |     |
| 三目运算 | expr1 ? expr2 : expr3                  |       |     |
| 级联     | ..                                     |       |     |
| 赋值     | = \*= /= ~/= %= += -= <<= >>= &= ^= \  | = ??= |     |

> 优先级顺序 `上面左边` 优先级高于 `右边下面`

```dart
if(x == 1 && y == 2){
  ...
}
```

## 算术操作符

| 操作符 | 解释                   |
| ------ | ---------------------- |
| +      | 加号                   |
| –      | 减号                   |
| -expr  | 负号                   |
| \*     | 乘号                   |
| /      | 除号                   |
| ~/     | 除号，但是返回值为整数 |
| %      | 取模                   |

```dart
print(5/2);
print(5~/2);
print(5 % 2);
```

赋值运算符 == ??= 从右向左

```dart
int b;

b ??= 23; //如果b为空 把23赋值给b

//+= -= *=  /=  ~/=
a += 3;  a = a+3;
```

自增自减 ++ -- 在赋值运算中，如果++在前边，先运算后赋值。如果++在后边，先赋值后运算。

```dart
a++;  //a=a+1;

a--; //a = a-1;

var a = 10;

var b = a++;

print(a); //11

print(b)://10
```

## 关系操作符

| 操作符 | 解释     |
| ------ | -------- |
| ==     | 相等     |
| !=     | 不等     |
| >      | 大于     |
| <      | 小于     |
| >=     | 大于等于 |
| <=     | 小于等于 |

## 类型判定操作符

| 操作符 | 解释                           |
| ------ | ------------------------------ |
| as     | 类型转换                       |
| is     | 如果对象是指定的类型返回 True  |
| is!    | 如果对象是指定的类型返回 False |

```dart
int a = 123;
String b = 'ducafecat';
String c = 'abc';
print(a as Object);
print(b is String);
print(c is! String);
```

## 条件表达式

| 操作符                    | 解释                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------- |
| condition ? expr1 : expr2 | 如果 condition 是 true，执行 expr1 (并返回执行的结果)； 否则执行 expr2 并返回其结果。 |
| expr1 ?? expr2            | 如果 expr1 是 non-null，返回其值； 否则执行 expr2 并返回其结果。                      |

```dart
bool isFinish = true;
String txtVal = isFinish ? 'yes' : 'no';

bool isFinish;
isFinish = isFinish ?? false;
or
isFinish ??= false;

var b = 1
const a = b ?? 2
```

## 位和移位操作符

| 操作符 | 解释     |
| ------ | -------- |
| &      | 逻辑与   |
|        | 逻辑或   |
| ^      | 逻辑异或 |
| ~expr  | 取反     |
| <<     | 左移     |
| >>     | 右移     |

## 级联操作符

| 操作符 | 解释                                                  |
| ------ | ----------------------------------------------------- |
| ..     | 可以在同一个对象上 连续调用多个函数以及访问成员变量。 |

```dart
StringBuffer sb = new StringBuffer();
sb
..write('hello')
..write('word')
..write('\n')
..writeln('doucafecat');
```

## 其他操作符

| 操作符 | 解释                                                                                                                 |
| ------ | -------------------------------------------------------------------------------------------------------------------- |
| ()     | 使用方法 代表调用一个方法                                                                                            |
| []     | 访问 List 访问 list 中特定位置的元素                                                                                 |
| .      | 访问 Member 访问元素，例如 foo.bar 代表访问 foo 的 bar 成员                                                          |
| ?.     | 条件成员访问 和 . 类似，但是左边的操作对象不能为 null，例如 foo?.bar 如果 foo 为 null 则返回 null，否则返回 bar 成员 |

```dart
String a;
print(a?.length);
```

## 类型转换

- 数值类型转换成 String toString()

- String 转换成 int int.parse()

# List Set Map

## 1 List

List 是一个有序列表 ，属性

- length
- isEmpty
- isNotEmpty
- reversed 对列表倒序排序

方法

- add('桃子') 增加元素
- addAll() 增加数组里的元素
- indexOf('苹果') 查找数据 查找不到返回-1 找到返回 index
- remove('西瓜')
- fillRange 修改
- insert 插入
- insertAll 插入多个
- myList.join('') //list 转换成字符串
- str.split('-') 字符串转换成 list

**自动**

```dart
List<int> l = new List();
l
..add(1)
..add(2)
..add(3);
print(l);
```

**定长**

```dart
List<int> l = new List(3);
// print(l[0]);
l[0] = 1;
l[1] = 2;
l[2] = 3;
print(l);
```

**创建一个固定长度的集合**

```dart
var _ = List.filled(2, '123');
print(_)
```

**属性**

| 名称       | 说明         |
| ---------- | ------------ |
| isEmpty    | 是否为空     |
| isNotEmpty | 是否不为空   |
| first      | 第一个对象   |
| last       | 最后一个对象 |
| length     | 个数         |
| reversed   | 反转         |

```dart
var l = [1, 2, 3];
print(l.first);
print(l.last);
print(l.length);
print(l.isEmpty);
print(l.isNotEmpty);
print(l.reversed);
```

**方法**

| 名称       | 说明         |
| ---------- | ------------ |
| add        | 添加         |
| addAll     | 添加多个     |
| insert     | 插入         |
| insertAll  | 插入多个     |
| indexOf    | 查询         |
| indexWhere | 按条件查询   |
| remove     | 删除         |
| removeAt   | 按位置删除   |
| fillRange  | 按区间填充   |
| getRange   | 按区间获取   |
| shuffle    | 随机变换顺序 |
| sort       | 排序         |
| sublist    | 创建子       |

**添加**

```dart
List<int> l = new List();

l
  ..add(1)
  ..addAll([2, 3, 4, 5])
  ..insert(0, 6)
  ..insertAll(6, [6, 6])
  ;
```

**查询**

```dart
print(l.indexOf(5));
print(l.indexWhere((it) => it == 4));
```

**删除**

```dart
l.remove(6);
print(l);
l.removeAt(5);
print(l);
```

**Range**

```dart
l.fillRange(0, 3, 9);
print(l.getRange(0, 5));
```

**洗牌**

```dart
l.shuffle();
print(l);
l.shuffle();
print(l);
```

**排序**

```dart
数字
l.sort();
print(l);
日期
List<DateTime> dtList = new List();
dtList.addAll([
  DateTime.now(),
  DateTime.now().add(new Duration(days: -12)),
  DateTime.now().add(new Duration(days: -2))
  ]);
print(dtList);
dtList.sort((a, b) => a.compareTo(b));
print(dtList);
```

**复制子列表**

```dart
print(l);
var l2 = l.sublist(1,4);
print(l2);
```

**操作符**

| 名称 | 说明 |
| ---- | ---- |
| +    | 连接 |
| []   | 取值 |
| []=  | 赋值 |

```dart
var l1 = [1, 2, 3];
var l2 = [4, 5, 6];
print(l1 + l2);
l1[2] = 9;
print(l1[2]);
```

## 2 Set

Set 集合 去重

`Set` 是一个元素唯一的有序队列

**松散**

```
// var a = new Set();
// a.add('java');
// a.add('php');
// a.add('python');
// a.add('java');
// a.add('sql');
// a.add('swift');
// a.add('dart');
```

**强类型**

```
// var b = new Set<String>();
// b.addAll(['dart', 'c#', 'j#', 'e#']);
```

**基本属性**

| 名称       | 说明       |
| ---------- | ---------- |
| isEmpty    | 是否为空   |
| isNotEmpty | 是否不为空 |
| first      | 第一个     |
| last       | 最后一个   |
| length     | 个数       |

**常用方法**

| 名称         | 说明                 |
| ------------ | -------------------- |
| addAll       | 添加                 |
| contains     | 查询单个             |
| containsAll  | 查询多个             |
| difference   | 集合不同             |
| intersection | 交集                 |
| union        | 联合                 |
| lookup       | 按对象查询到返回对象 |
| remove       | 删除单个             |
| removeAll    | 删除多个             |
| clear        | 清空                 |
| firstWhere   | 按条件正向查询       |
| lastWhere    | 按条件反向查询       |
| removeWhere  | 按条件删除           |
| retainAll    | 只保留几个           |
| retainWhere  | 按条件只保留几个     |

```dart
// b.addAll(['dart', 'c#', 'j#', 'e#']);
// print(b.contains('dart'));
// print(b.containsAll(['dart', 'swift']));
// print('b => $b');
// print(a.difference(b));
// print(a.intersection(b));
// print(b.lookup('dart'));
// print(b.union(a));
// b.remove('dart');
// b.removeAll(['dart','c#']);
// b.clear();
// print(b.firstWhere((it) => it == 'c#'));
// print(b.lastWhere((it) => it == 'c#'));
// b.removeWhere((it) => it == 'c#');
// b.retainAll(['e#']);
// b.retainWhere((it) => it == 'e#');
// b.retainWhere((it) {
//   bool ret = it == 'e#';
//   return ret;
// });
```

## 3 Map

常用属性

- keys
- values
- isEmpty
- isNotEmpty

常用方法

- addAll
- remove
- containsValue

**key value 形式的集合**

```
var a = {'name': 'ducafecat', 'web': 'www.ducafecat.tech'};
```

**声明**

**松散**

```dart
var a = new Map();
a['name'] = 'ducafecat';
a['web'] = 'www.ducafecat.tech';
a[0] = 'abc';
```

**强类型**

```dart
var b = new Map<int, String>();
b[0] = 'java';
b[1] = 'python';
```

**基本属性**

| 名称       | 说明         |
| ---------- | ------------ |
| isEmpty    | 是否为空     |
| isNotEmpty | 是否不为空   |
| keys       | key 集合     |
| values     | values 集合  |
| length     | 个数         |
| entries    | 加工数据入口 |

```dart
print(a.isEmpty);
print(a.isNotEmpty);
print(a.keys);
print(a.values);
print(a.length);
print(a.entries);
```

**常用方法**

| 名称          | 说明          |
| ------------- | ------------- |
| addAll        | 添加          |
| addEntries    | 从入口添加    |
| containsKey   | 按 key 查询   |
| containsValue | 按 value 查询 |
| clear         | 清空          |
| remove        | 删除某个      |
| removeWhere   | 按条件删除    |
| update        | 更新某个      |
| updateAll     | 按条件更新    |

**addAll**

```
b.addAll({'first': 'java', 'second': 'python'});
```

**addEntries**

```
b.addEntries(a.entries);
```

**containsKey**

```
print(a.containsKey('name'));
```

**containsValue**

```
print(a.containsValue('www.ducafecat.tech'));
```

**clear**

```
b.clear();
```

**remove**

```
a.remove('name');
```

**removeWhere**

```
a.removeWhere((key,val) => key == 'name');
```

**update**

```
a.update('name', (val) => 'abc');
```

**updateAll**

```
a.updateAll((key, val) => "---$val---");
```

**操作符**

| 名称 | 说明 |
| ---- | ---- |
| []   | 取值 |
| []=  | 赋值 |

```
print(a['name']);
a['name'] = 'abc';
```

## 4 forEach map where any every

```dart
myList.forEach((value) {
    print("%value");
});
```

map

```dart
List myList = [1,3,4];
var newList = myList.map((value){
  return value*2;
});
print(newList.toList());//[2,6,8]
```

where

```dart
List myList = [1,3,4,5,7,8,9];
var newList = myList.where((value){
  return value>5;
});
print(newList.toList());//[7,8,9]
```

any

```dart
List myList = [1,3,4,5,7,8,9];
var f = myList.any((value){ //只要集合里面有满足条件的就返回true
  return value>5;
});
print(f);//true
```

every

```dart
List myList = [1,3,4,5,7,8,9];
var f = myList.every((value){ //每一个都满足条件返回true，否则返回false
  return value>5;
});
print(f);//false
```

## 5 Runes

Runes 对象是一个 32 位 字符对象，用来表示一个字。这样设计也是考虑兼容 UTF-16 四个字节的情况。

**`length` 和 `runes.length` 比较**

```dart
String a = '👺';
print(a.length);
print(a.runes.length);

>> 输出
2 // 标识占 2 个 16 位字符
1 // 表示占 1 个 32 位字符
```

> runes 是一个 32 位字符对象

**操作 32-bit Unicode 字符**

```dart
Runes b = new Runes('\u{1f596} \u6211');
var c = String.fromCharCodes(b);

或者

String c = '\u{1f596} \u6211'
```

> 如果非 4 个数值，需要用 {…}

**返回 16-bit code units 的 `codeUnitAt` `codeUnits**`

```dart
var a = '👺';
print(a.codeUnitAt(0));
print(a.codeUnits);

>> 输出
55357           // 第 1 位的 10 进制数值
[55357, 56442]  // 显示 2 位的 10 进制数值
```

**返回 32-bit Unicode 的 `runes`**

```dart
var a = '👺';
print(a.runes);

>> 输出

(128122) // 显示 32 位的 10 进制数值
```

**String 操作整理**

| 名称          | 说明                     |
| ------------- | ------------------------ |
| codeUnitAt    | 某个字符的码 10 进制     |
| fromCharCodes | Runes 转 String 工厂函数 |
| runes         | 返回字对象               |

## 6 符号 Symbol

Dart 语言的标识符，在反射中用的很普及，特别是很多发布包都是混淆后的。

```dart
import 'dart:mirrors';

Symbol libraryName = new Symbol('dart.core');
MirrorSystem mirrorSystem = currentMirrorSystem();
LibraryMirror libMirror = mirrorSystem.findLibrary(libraryName);
libMirror.declarations.forEach((s, d) => print('$s - $d'));
```

## 7 枚举 Enum

适合用在常量定义，类型比较很方便。

```dart
enum Status { none, running, stopped, paused }

Status.values.forEach((it) => print('$it - index: ${it.index}'));
```

## 8 注释 Comments

单行注释

```dart
// Symbol libraryName = new Symbol('dart.core');
```

多行注释

```dart
/*
 * Symbol
 *
Symbol libraryName = new Symbol('dart.core');
MirrorSystem mirrorSystem = currentMirrorSystem();
LibraryMirror libMirror = mirrorSystem.findLibrary(libraryName);
libMirror.declarations.forEach((s, d) => print('$s - $d'));
*/
```

文档注释

```dart
/// `main` 函数
///
/// 符号
/// 枚举
///
void main() {
  ...
}
```

# 函数

## 方法定义

```dart
/* 返回类型 方法名称（参数1，参数2，...） {
 方法体
 return 返回值；
*/}
void printInfo(){
    print('我是一个自定义方法');
}

int getNum() {
    var myNum = 123;
    return myNum;
}

void main() {
    print('');
}

var n = getNum();
print(n);

List getList() {
  return ['111','222','333'];
}
```

## 可选参数，默认参数

```dart
//可选参数
String printUserInfo(String username,[String sex = '男',int age]) {//[可选参数]
  if (age != null) {
    return "姓名：$username---年龄：$age";
  }
  return "姓名：$username---年龄保密";
}
print(printUserInfo("张三",20));
```

## 函数内定义

```
void main(){
  int add(int x){
    return x + x;
  }
  print(add(1));
}
```

## 命名参数

在 Dart 中，命名参数是一种在函数调用中通过名称指定参数的方法。与位置参数不同，命名参数的顺序并不重要，只需要指定参数名和对应的值即可。

要声明一个命名参数，可以在函数的参数列表中使用`{}`括起来的参数名。例如：

```dart
void printName({String firstName, String lastName}) {
  print('$firstName $lastName');
}
```

在上面的示例中，我们声明了两个命名参数`firstName`和`lastName`，它们都是可选的。在函数体内，我们使用`$`符号和参数名来引用这些参数。

在调用函数时，我们可以通过指定参数名和对应的值来传递命名参数，例如：

```dart
printName(firstName: 'John', lastName: 'Doe');
```

在这个示例中，我们通过指定参数名`firstName`和`lastName`来传递命名参数。这个调用等价于使用位置参数的方式调用函数：

```dart
printName('John', 'Doe');
```

但是，使用命名参数的方式更加灵活，可以在不考虑参数的位置的情况下指定参数的值，更容易读懂代码。另外，命名参数还支持设置默认值，这可以帮助我们在某些情况下省略参数，例如：

```dart
void printName({String firstName = 'John', String lastName = 'Doe'}) {
  print('$firstName $lastName');
}

printName(); // 输出：John Doe
```

在这个示例中，我们设置了两个命名参数的默认值，当我们在调用函数时没有指定这些参数的值时，将会使用默认值。

## Funcation 返回函数对象

```dart
Function makeAdd(int x) {
  return (int y) => x + y;
}

调用
var add = makeAdd(1);
print(add(5));
```

## 方法当做参数

```dart
var fn = (){
  print('我是一个匿名方法');
}
fn();

fn1() {
  print('fn1');
}
fn2(fn) {
  fn();
}
fn2(fn1);
```

## 箭头函数(只能写一行)

```dart
List list = ['苹果','香蕉','西瓜'];
//常规写法
list.forEach((value){
    print(value);
});
//箭头函数
list.for((value)=>print(value));
```

```dart
List list = [4,1,2,3,4];
//常规写法
var newList = list.map((value){
  if (value > 2) {
    return value*2;
  }
  return value;
});
//箭头函数
var newList = list.map((value)=>value>2?value*2:value);
print(newList.toList());
```

## 匿名方法

```dart
var printNum = (){
  print(123);
};
printNum();
```

## 自执行方法

```dart
((int n){
    print(n);
    print('我是自执行方法');
})();
```

## 方法的递归

```dart
var sum = 1;
fn(n) {
  sum *= n;
  if (n==1) {
    return;
  }
  fn(n-1);
}
fn(5);
print(sum);
```

## 闭包

常驻内存，不污染全局

1.全局变量特点：全局变量常驻内存、全局变量污染全局

2.局部变量特点：不常住内存会被垃圾机制回收、不会污染全局

```dart
fn() {
  var a = 123; /*不会污染全局 常驻内存*/
  return() {
    a++;
    print(a);
  };
}
var b = fn();
b(); //124
b(); //125
b(); //126
```

# 类

## 构造函数

**默认构造函数**

默认构造函数只能定义一个

```dart
class Person{
    String name;
    int age;
    //默认构造函数, 简写 Person(this.name,this.age)意味着接收外部的name和age的值赋值给内部的name，age
    Person(String name,int age) {
        this.name = name;
        this.age = age;
        print('这是构造函数里面的内容，这个方法在实例化的时候触发');
    }
    // 命名构造函数
    Person.now(){
        print('我是命名构造函数');
    }
    void getInfo() {
        print("$name---$age");
        print("${this.name}---${this.age}");
    }
    void setInfo(int age) {
        this.age = age;
    }
}
void main() {
  var p1 = new person('张三',20);
  print(p1.name);
  p1.setInfo(28);
}
```

**命名构造函数**

命名构造函数可以定义多个

定义

```dart
class Point {
  num x;
  num y;
  Point.fromJson(Map json) {
    x = json['x'];
    y = json['y'];
  }
}
```

使用

```dart
var p = new Point.fromJson({"x": 1, "y": 2});
print([p.x, p.y]);
```

**重定向构造函数**

定义

```dart
class Point {
  num x;
  num y;
  Point(this.x, this.y);
  Point.fromJson(Map json) : this(json['x'], json['y']);
}
```

使用

```dart
var p = new Point.fromJson({"x": 1, "y": 2});
print([p.x, p.y]);
```

## 私有属性、私有方法

- 使用`_`把一个属性或者方法定义成私有。需要把类抽离成一个文件
- 私有方法和私有属性只能在类里面使用，如果需要改变或者获取私有属性(方法)，可以通过共有方法，或者 set 和 get

```dart
// 单独的文件中
class Rect {
    num _height; // 定义私有属性
    num _width;
    Rect(this._height,this._width);
	_printInfo() { // 定义私有方法
        print(${this._height}---${this._width})
    }
    get area{
        return this._height * this._width;
    }
    set areaHeight(value) {
        this._height = value;
    }
}
// 调用Rect的文件中的入口函数
void main(){
    Rect r = new Rect(10,4);
    print(r._height) // 无法打印，_height私有属性\
	r._printInfo // 无法调用，_printInfo私有方法
    r.areaHeight = 6;
    print("面积:${r.area}");
}
```

## getter setter

getter 和 setter 的好处是，你可以开始使用实例变量，后来 你可以把实例变量用函数包裹起来，而调用你代码的地方不需要修改。

```dart
class Rect {
  num height;
  num width;
  Rect(this.height,this.width);
  get area{
    return this.height*this.width;
  }
  set areaHeight(value) {
    this.height = value;
  }
}
void main(){
  Rect r = new Rect(10,4);
  r.areaHeight = 6;
  print("面积:${r.area}"); // get可以和调用属性一样去调用，不需要加括号
}
```

**简化 get set**

```dart
class People {
  String _name;

  set pName(String value) => _name = value;

  String get pName => 'people is ${_name}';
}
```

## 类的初始化列表

```dart
class Rect {
  int height;
  int width;
  Rect():height=2,width=10 {
    // 可以在构造函数执行(类实例化)之前初始化属性,这样就不需要在实例化的时候传入参数
    print("${this.height}---${this.width}");
  };
  get area {
    return this.height*this.width;
  }
  set areaHeight(value) {
    this.height = value;
  }
}
void main(){
  Rect r = new Rect(); // 无需传入参数
  print("面积:${r.area}");
}

// 示例2
class Point {
  num x;
  num y;
  var origin;
  Point(this.x, this.y): origin = {x:x, y:y};
}
var p = new Point(1, 2);
print([p.x, p.y, p.origin]);
```

## 类中的静态成员

- 使用`static`关键字来实现类级别的变量和函数
- 实例化后将无法通过外部直接调用 static 成员
- 静态成员与实例成员是分开的, 静态成员处于类的定义体中, 实例成员处于类的实例中
- 静态方法不能访问非静态成员，非静态方法可以访问静态成员
- 静态变量可以通过外部直接访问,不需要将类实例化

- ```dart
  class Person {
    static String name = '张三';
    int age = 20;
    static void show() {
      print(name);
    }
    void printInfo() { /*非静态方法可以访问静态成员以及非静态成员*/
      print(name); //访问静态属性
      print(this.age); //访问非静态属性
      show();//调用静态方法
    }
    static void printUserInfo() {//静态方法
      print(name);//静态属性
      show();//静态方法

    }
  }
  main() {
    print(Person.name);
    Person.show();
  }
  ```

- 函数内部访问

  - 实例化后的类也可以访问该静态变量

  - ```dart
    // 声明
    class People {
      static String name = 'ducafecat';
      void show() {
        print(name);
      }
    }
    // 调用
    var p = new People();
    p.show();
    ```

- 不能用 this

  - ```dart
    // 因为静态变量实际上存在于类中,而不是实例本身
    class People {
      static String name = 'ducafecat';
      void show() {
        print(this.name);
      }
    }
    ```

- 静态方法

  - ```dart
    // 静态方法可以通过外部直接访问
    // 声明
    class People {
      static String name = 'ducafecat';
      static void printName() {
        print(name);
      }
    }
    // 调用
    People.printName();
    ```

## 对象操作符

? 条件运算符

as 类型转换

is 类型判断

.. 级联操作（连缀）

## ? 条件运算符

```dart
class Person {
  String name;
  num age;
  Person(this.name,this.age);
  void printInfo() {
    print("${this.name}---${this.age}");
  }
}
main() {
  Person p;
  p?.printInfo();
}
```

### as 类型转换

```dart
var p1;
p1 = '';
p1 = new Person('张三',20);
(p1 as Person).printInfo();
```

### .. 级联操作

```dart
Person p1 = new pERSON('张三',20);
p1.printInfo();
p1..name = "李四"
  ..age = 30
  ..printInfo();
```

### 继承 extends

```dart
class Web extends Person {
  	String sex;
    // super给父类的构造函数里面传参，初始化父类，可以给命名构造函数传参，super.xxx(name, age)
    Web(String name,num age,String sex) : super(name, age) {
    this.sex = sex;
  }
  //覆写父类的方法
  @override
  void printInfo() {
    print("姓名:${this.name}---年龄:${this.age}");
  }

  // 子类调用父类的方法
  void log() {
      print("log")
      super.work()
  }
}
```

## abstract 抽象类

**抽象类**：主要用于定义标准，子类可以继承抽象类，也可以实现抽象类接口。

- 子类必须实现
- 抽象类不能被实例化
- 抽象类定义：普通类前加 abstract

**抽象方法**：没有方法体的方法

- Dart 中的抽象方法不能用 abstract 声明，Dart 中没有方法体的方法我们称之为抽象方法
- 如果子类继承抽象类必须实现里面的抽象方法
- 如果把抽象类当做接口实现的话必须实现抽象类里面定义的所有属性和方法
- 抽象类不能被实例化，只有继承它的子类可以

```dart
//抽象类
abstract class Animal {
  eat(); //抽象方法
}
class Dog extends Animal {
  @override
  eat() {
    return null;
  }
}
```

**不能直接 new 实例化**

```dart
var p = Person();
p.printName();
```

> `Dart 2` 开始 `new` 可以不写，提高阅读体验

**继承方式使用**

定义

```dart
class Teacher extends Person {
}
```

实例

```dart
var user = Teacher();
user.printName();
```

**接口方式使用**

定义

```dart
abstract class Person {
  static const String name = '';
  void printName();
}

class Student implements Person {
  String name = 'this is student';
  void printName() {
    print(name);
  }
}
```

实例

```dart
var user = Student();
user.printName();
```

## 多态

允许将子类类型的指针赋值给父类类型的指针，同一个函数调用会有不同的执行结果。

子类的实例赋值给父类的引用。

多态就是父类定义一个方法不去实现，让继承他的子类去实现，每个子类有不同的表现。

```dart
Animal d = new Dog();
d.eat();
Animal c = new Cat();
c.eat();
```

## 接口

- 使用抽象类定义接口

- Dart 中没有 interface 关键字

```dart
abstract class Db { //当做接口 接口：就是约定、规范
  String uri;
  add();
  save();
  delete();
}
class Mysql implements Db {
  @override
  String uri;
  @override
  add() {

  }
  @override
  delete() {

  }
  @override
  save() {

  }
}
```

- 接口用途的抽象类 请用字母 `I` 开头 , 如 `IPhone`

```dart
// 实现接口
void main() {
  var p = AndroidPhone();
  p.startup();
  p.shutdown();
}

abstract class IPhone {
  void startup();
  void shutdown();
}

class AndroidPhone implements IPhone {
  void startup() {
    print('AndroidPhone 开机');
  }
  void shutdown() {
    print('AndroidPhone 关机');
  }
}
// 从一个普通类履行接口, Dart 可以从一个普通的类履行接口
void main() {
  var p = AndroidPhone();
  p.startup();
  p.shutdown();
}

class Phone {
  void startup() {
    print('开机');
  }
  void shutdown() {
    print('关机');
  }
}

class AndroidPhone implements Phone {
  void startup() {
    print('AndroidPhone 开机');
  }
  void shutdown() {
    print('AndroidPhone 关机');
  }
}

// 履行多接口
void main() {
  var p = AndroidPhone();
  p.startup();
  p.shutdown();
}

class Phone {
  void startup() {
    print('开机');
  }
  void shutdown() {
    print('关机');
  }
}

class Mobile {
  int signal;
}

class AndroidPhone implements Phone, Mobile {
  int signal;
  void startup() {
    print('AndroidPhone 开机');
  }
  void shutdown() {
    print('AndroidPhone 关机');
  }
}
```

## extends 抽象类和 implements 的区别：

1.如果要复用抽象类里面的方法，并且要用抽象方法约束子类的话就用 extends 继承抽象类。

2.如果只是把抽象类当做标准的话就用 implements 实现抽象类。

## 一个类实现多个接口

```dart
abstract class A {
  String name;
  printA();
}
abstract class B {
  printB();
}
class C implements A,B {
  @override
  String name;
  @override
  printA() {

  }
  @override
  printB() {

  }
}
```

## 多继承类 mixin

mixins 的中文意思是混入，就是在类中混入其他功能

在 Dart 中可以使用 mixins 实现类似多继承的功能

因为 mixins 使用的条件，随着 Dart 版本一直在变，这里讲的是 Dart2.x 使用 mixins 的条件

- 作为 mixins 的类只能继承自 Object，不能继承其他类
- 作为 mixins 的类不能有构造函数
- 一个类可以 mixins 多个 mixins 类
- mixins 绝不是继承，也不是接口，而是一种全新的特性

```dart
class A {
    void printA() {
    	String info = "this is A";
        print("A");
    }
}
class B {
    void printB() {
        print("B");
    }
}
class C extends Person with A,B {
  // A和B不可以再继承其他类, 不能有构造函数
  // Person可以有构造函数
}

void main() {
  var c = new C();
  c.printA();
  C.printB();
  print(c.info);
}
```

**类多继承**

```dart
void main() {
  var xm = Xiaomi();
  xm.startup();
  xm.shutdown();
  xm.call();
  xm.sms();
}

class Phone {
  void startup() {
    print('开机');
  }
  void shutdown() {
    print('关机');
  }
}

class AndroidPhone extends Phone {
  void startup() {
    super.startup();
    print('AndroidPhone 开机');
  }
}

class AndroidSystem {
  void call() {
    print('android call');
  }
}

class Weixin {
  void sms() {
    print('weixin sms');
  }
}

class Xiaomi extends AndroidPhone with AndroidSystem, Weixin {
  void startup() {
    super.startup();
    print('AndroidPhone 开机');
  }
}
```

> 采用 `with ... , .... , ...` 方式 mixin 入多个类功能

**函数重名冲突**

```dart
void main() {
  var xm = Xiaomi();
  xm.startup();
  xm.shutdown();
  xm.sms();
}

class Phone {
  void startup() {
    print('开机');
  }
  void shutdown() {
    print('关机');
  }
}

class AndroidPhone extends Phone {
  void startup() {
    super.startup();
    print('AndroidPhone 开机');
  }
}

class AndroidSystem {
  void call() {
    print('android call');
  }
}

class Weixin {
  void sms() {
    print('weixin sms');
  }
}

class QQ {
  void sms() {
    print('qq sms');
  }
}

class Xiaomi extends AndroidPhone with AndroidSystem, Weixin, QQ {
  void startup() {
    super.startup();
    print('AndroidPhone 开机');
  }
}
```

> 遇到相同功能的函数，最后载入的会覆盖之前的函数定义

## 可调用类 callable

callable

```dart
main(List<String> args) {
  var phone = IOSPhone();
  phone('911');

  // IOSPhone()('911');
}

class IOSPhone {
  call(String num) {
    print('phone number is $num');
  }
}
```

## extends 继承

- 实现继承
- 继承抽象类的问题
- 不可多继承
- 父类调用
- 调用父类构造
- 重写超类函数

**实现继承**

```dart
void main() {
  var p = AndroidPhone();
  p.startup();
  p.shutdown();
}

class Phone {
  void startup() {
    print('开机');
  }
  void shutdown() {
    print('关机');
  }
}

class AndroidPhone extends Phone {
}
```

**继承抽象类的问题**

```dart
void main() {
  var p = AndroidPhone();
  p.startup();
  p.shutdown();
}

abstract class Phone {
  void startup();
  void shutdown();
}

class AndroidPhone extends Phone {
}
```

> 抽象类中只定义抽象函数，实例化访问会报错

**父类调用**

```dart
void main() {
  var p = AndroidPhone();
  p.startup();
}

class Phone {
  void startup() {
    print('开机');
  }
  void shutdown() {
    print('关机');
  }
}

class AndroidPhone extends Phone {
  void startup() {
    super.startup();
    print('AndroidPhone 开机');
  }
}
```

> super 对象可以访问父类

**调用父类构造**

```dart
void main() {
  var p = AndroidPhone(12345678);
  p.showNumber();
}

class Mobile {
  int number;
  int signal;
  Mobile(this.number);
  void showNumber() {
    print('010-${number}');
  }
}

class AndroidPhone extends Mobile {
  AndroidPhone(int number) : super(number);
}
```

> 可调用父类的 构造函数

**重写超类函数**

```dart
void main() {
  dynamic p = AndroidPhone(12345678);
  p.showNumber111();
}

class Mobile {
  int number;
  int signal;
  Mobile(this.number);
  void showNumber() {
    print('010-${number}');
  }
}

class AndroidPhone extends Mobile {
  AndroidPhone(int number) : super(number);

  @override
  void noSuchMethod(Invocation mirror) {
    print('被重写 noSuchMethod');
  }
}
```

> 在重写的函数上加修饰符 `@override`

# 工厂函数

工厂函数

简化类型实例化

```dart
void main() {
  var xm = phoneFactory('ios');
  xm.startup();
  xm.shutdown();
}

class Phone {
  void startup() {
    print('开机');
  }
  void shutdown() {
    print('关机');
  }
}

Phone phoneFactory(String name) {
  switch (name) {
    case 'android':
      return new AndroidPhone();
      break;
    default:
      return new IOSPhone();
  }
}

class AndroidPhone extends Phone {
  void startup() {
    super.startup();
    print('Android Phone 开机');
  }
}

class IOSPhone extends Phone {
  void startup() {
    super.startup();
    print('IOS Phone 开机');
  }
}
```

**工厂构造函数**

```dart
void main() {
  var xm = Phone('android');
  xm.startup();
  xm.shutdown();
}

abstract class Phone {
  factory Phone(String name) {
    switch (name) {
      case 'android':
        return new AndroidPhone();
        break;
      default:
        return new IOSPhone();
    }
  }
  void startup();
  void shutdown();
}

class AndroidPhone implements Phone {
  void startup() {
    print('Android Phone 开机');
  }
  void shutdown() {
    print('Android 关机');
  }
}

class IOSPhone implements Phone {
  void startup() {
    print('IOS Phone 开机');
  }
  void shutdown() {
    print('IOS 关机');
  }
}
```

# 泛型

作用：**解决类 接口 方法的复用性、以及对不特定数据类型的支持（类型校验）**

```dart
//泛型方法
T getData<T>(T value) {
  return value;
}
void main() {
  getData<String>('你好');
  print(getData<int>(12));
}
//泛型类
List list = new List<String>();
```

**泛型使用**

```dart
main(List<String> args) {
  var l = List<String>();
  l.add('aaa');
  l.add('bbb');
  l.add('ccc');
  print(l);

  var m = Map<int, String>();
  m[1] = 'aaaa';
  m[2] = 'bbbb';
  m[3] = 'cccc';
  print(m);
}
```

> 很多的容器对象，在创建对象时都可以定义泛型类型。

**泛型函数**

```dart
main(List<String> args) {
  var key = addCache('a00001', 'val.....');
  print(key);
}

K addCache<K, V>(K key, V val) {
  print('${key} ${val}');
  return key;
}
```

> 泛型可以用在一个函数的定义

**构造函数泛型**

```dart
main(List<String> args) {
  var p = Phone<String>('abc00000011111');
  print(p.mobileNumber);
}

class Phone<T> {
  final T mobileNumber;
  Phone(this.mobileNumber);
}
```

> 这是大多数情况下使用泛型的场景，在一个类的构造函数中

**泛型限制**

```dart
main(List<String> args) {
  var ad = AndroidPhone();
  var p = Phone<AndroidPhone>(ad);
  p.mobile.startup();
}

class Phone<T extends AndroidPhone > {
  final T mobile;
  Phone(this.mobile);
}

class AndroidPhone {
  void startup() {
    print('Android Phone 开机');
  }
}
```

> 通过 extends 关键字 可以限定你可以泛型使用的类型

**泛型接口**

```dart
abstract class Cache<T> {
    getByKey(String key);
    void setByKey(String key, T value)
}

class FileCache<T> implements Cache<T> {
    @override
    getByKey(String key) {
        return ...
    }
    @override
    setByKey(String key, T value) {
        print('${key}, ${value}')
    }
}

void main() {
    FileCache a = new FileCache<String>()
    a.setByKey('name', 'cat')
}
```

# 流程控制语句

## if else

```dart
bool isPrint = true;
if (isPrint) {
  print('hello');
}
```

## for

```dart
for (var i = 0; i < 5; i++) {
  print(i);
}
```

## while

```dart
bool isDone = false;
while(!isDone) {
  print('is not done');
  isDone = true;
}
```

## do while

```dart
bool isRunning = true;
do {
  print('is running');
  isRunning = false;
} while (isRunning);
```

## switch case

```dart
String name = 'cat';
switch (name) {
  case 'cat':
    print('cat');
    break;
  default:
    print('not find');
}
```

## break

```dart
num i = 1;
while(true) {
  print('${i} - run');
  i++;
  if(i == 5) {
    break;
  }
}
```

## continue

```dart
for (var i = 0; i < 5; i++) {
  if (i < 3) {
    continue;
  }
  print(i);
}
```

## continue 指定位置

break 跳出当前循环，只能跳出一层循环

continue 跳过当次循环，循环还会继续执行

```dart
String command = "close";
switch(command) {
  case "open":
    print("open");
    break;
  case "close":
    print("close");
    continue doClose;

  doClose:
  case "doClose":
    print("DO_CLOSE");
    break;

  default:
    print("-----");
}
```

# 异常

## 错误的两种类型

### Exception 类

[Exception class](https://api.dartlang.org/stable/2.1.0/dart-core/Exception-class.html)

| 名称                           | 说明         |
| ------------------------------ | ------------ |
| DeferredLoadException          | 延迟加载错误 |
| FormatException                | 格式错误     |
| IntegerDivisionByZeroException | 整数除零错误 |
| IOException                    | IO 错误      |
| IsolateSpawnException          | 隔离产生错误 |
| TimeoutException               | 超时错误     |

### Error 类

[Error class](https://api.dartlang.org/stable/2.1.0/dart-core/Error-class.html)

| 名称                            | 说明              |
| ------------------------------- | ----------------- |
| AbstractClassInstantiationError | 抽象类实例化错误  |
| ArgumentError                   | 参数错误          |
| AssertionError                  | 断言错误          |
| AsyncError                      | 异步错误          |
| CastError                       | Cast 错误         |
| ConcurrentModificationError     | 并发修改错误      |
| CyclicInitializationError       | 周期初始错误      |
| FallThroughError                | Fall Through 错误 |
| JsonUnsupportedObjectError      | json 不支持错误   |
| NoSuchMethodError               | 没有这个方法错误  |
| NullThrownError                 | Null 错误错误     |
| OutOfMemoryError                | 内存溢出错误      |
| RemoteError                     | 远程错误          |
| StackOverflowError              | 堆栈溢出错误      |
| StateError                      | 状态错误          |
| UnimplementedError              | 未实现的错误      |
| UnsupportedError                | 不支持错误        |

## 抛出错误

```dart
// Exception 对象
// throw new FormatException('这是一个格式错误提示');

// Error 对象
// throw new OutOfMemoryError();

// 任意对象
// throw '这是一个异常';
```

## 捕获错误

```dart
// try {
//   // throw new FormatException('这是一个格式错误提示');
//   throw new OutOfMemoryError();
// } on OutOfMemoryError {
//   print('没有内存了');
// } catch (e) {
//   print(e);
// }
```

## 重新抛出错误

```dart
// try {
//   throw new OutOfMemoryError();
// } on OutOfMemoryError {
//   print('没有内存了');
//   rethrow;
// } catch (e) {
//   print(e);
// }
```

## Finally 执行

```dart
// try {
//   throw new OutOfMemoryError();
// } on OutOfMemoryError {
//   print('没有内存了');
//   rethrow;
// } catch (e) {
//   print(e);
// } finally {
//   print('end');
// }
```

# 生成器 Genertators

在 Dart 中，生成器(Generators)是一种特殊的函数，它可以用来创建迭代器(Iterators)。迭代器是一种可以依次访问集合元素的对象，它提供了`next()`方法用于获取下一个元素，并且在所有元素都被访问完毕之后，它会抛出一个`StopIteration`异常。

生成器可以使用`sync*`关键字定义，它的语法类似于普通函数，但是它可以使用`yield`关键字来产生一个值，并且在每次产生一个值之后，生成器会暂停执行并且保存当前状态。当下一次需要产生一个值的时候，生成器会恢复执行并且从上次暂停的位置继续执行。

同步、异步代码生成器

**同步生成器**

```dart
main(List<String> args) {
  var it = naturalsTo(5).iterator;
  while(it.moveNext()) {
    print(it.current);
  }
}

Iterable<int> naturalsTo(int n) sync* {
  print('start');
  int k = 0;
  while (k < n) {
    yield k++;
  }
  print('end');
}
```

> yield 会等待 `moveNext` 指令

**异步生成器**

```dart
import 'dart:async';

main(List<String> args) {
  // 流监听
  // asynchronousNaturalsTo(5).listen((onData) {
  //   print(onData);
  // });

  // 流监听 StreamSubscription 对象
  StreamSubscription subscription = asynchronousNaturalsTo(5).listen(null);
  subscription.onData((value) {
    print(value);
    // subscription.pause();
  });
}

Stream<int> asynchronousNaturalsTo(int n) async* {
  print('start');
  int k = 0;
  while (k < n) {
    yield k++;
  }
  print('end');
}
```

> 以流的方式一次性推送
>
> `StreamSubscription` 对象进行流监听控制

**递归生成器**

```dart
main(List<String> args) {
  var it = naturalsDownFrom(5).iterator;
  while(it.moveNext()) {
    print(it.current);
  }
}

Iterable<int> naturalsDownFrom(int n) sync* {
  if ( n > 0) {
    yield n;
    yield* naturalsDownFrom(n-1);
  }
}
```

> `yield*` 以指针的方式传递递归对象，而不是整个同步对象

# 异步 async

**调用异步 回调**

```dart
import 'package:dio/dio.dart';

void main() {
  Dio dio = new Dio();
  dio.get("https://www.baidu.com").then((response) {
    print(response.data);
  });
}
```

> `then` 的方式异步回调

**调用异步 等待**

```dart
import 'package:dio/dio.dart';

void main() async {
  Dio dio = new Dio();
  Response<String> response = await dio.get("https://www.baidu.com");
  print(response.data);
}
```

> `async` 写在函数定义 `await` 写在异步请求头

**异步返回值**

```dart
import 'package:dio/dio.dart';

void main() async {
  var content = await getUrl('https://www.baidu.com');
  print(content);
}

Future<String> getUrl(String url) async {
  Dio dio = new Dio();
  Response<String> response = await dio.get(url);
  return response.data;
}
```

> 定义 `Future<T>` 返回对象

# 线程隔离 isolate

**基础理解**

在 Dart 中，线程隔离(Isolation)是一种将代码分离到独立的计算环境中的技术。这些独立的计算环境被称为隔离(Isolate)，每个隔离都有自己的内存空间和执行线程。与传统的多线程模型不同，每个隔离之间是相互独立的，它们不能直接访问彼此的内存空间。这种隔离机制可以有效地提高代码的安全性和可靠性，并且可以充分利用多核处理器的性能。

在 Dart 中，每个隔离都由一个单独的 Isolate 对象来表示。我们可以使用`Isolate.spawn`方法来创建一个新的隔离，并且可以将一个函数作为参数传递给该方法。该函数将在新的隔离中执行，并且可以通过消息传递机制来与其他隔离进行通信。

下面是一个简单的示例，它创建了一个新的隔离，并且在该隔离中执行了一个函数：

```dart
dartCopy codeimport 'dart:isolate';

void main() async {
  final isolate = await Isolate.spawn(run, 'Hello, world!');
  print('isolate created with id: ${isolate.hashCode}');
}

void run(String message) {
  print('message: $message');
}
```

在这个例子中，我们使用`Isolate.spawn`方法创建了一个新的隔离，并且将`run`函数作为参数传递给该方法。该函数将在新的隔离中执行，并且在控制台中输出一条消息。在`main`函数中，我们打印了新隔离的哈希码，以便我们可以在控制台中查看它是否创建成功。

需要注意的是，由于隔离之间是相互独立的，因此它们之间不能直接共享内存或状态。如果我们需要在多个隔离之间共享数据，我们可以使用消息传递机制来实现。在 Dart 中，我们可以使用`SendPort`和`ReceivePort`来实现隔离之间的消息传递。通过`SendPort`，我们可以向其他隔离发送消息，而通过`ReceivePort`，我们可以接收来自其他隔离的消息。在消息传递时，Dart 会自动将消息序列化并传递给目标隔离。

**isolate**

在 Dart 中实现并发可以用 Isolate，它是类似于线程(thread)但不共享内存的独立运行的 worker，是一个独立的 Dart 程序执行环境。其实默认环境就是一个 main isolate。

在 Dart 语言中，所有的 Dart 代码都运行在某个 isolate 中，代码只能使用所属 isolate 的类和值。不同的 isolate 可以通过 port 发送 message 进行交流。

示意图

![img](https://ducafecat.tech/2019/01/20/dart/dart-32-isolates/2019-01-21-16-09-42.png)

- `ReceivePort` 创建入口点
- `Isolate.spawn` 连接进程
- `SendPort.send` 发送消息

**echo 例子**

```dart
import 'dart:async';
import 'dart:isolate';

// 第1步：定义主线程
main() async {
  // 第3步：编写回调Port
  var receivePort = new ReceivePort();
  await Isolate.spawn(echo, receivePort.sendPort);

  // 第6步：保存隔离线程回调Port
  var sendPort = await receivePort.first;

	// 第7步：发送消息
  var msg = await sendReceive(sendPort, "foo");
  print('received $msg');
  msg = await sendReceive(sendPort, "bar");
  print('received $msg');
}

// 第2步：定义隔离线程的入口点
echo(SendPort sendPort) async {
  // 第4步：编写回调Port
  var port = new ReceivePort();

  // 第5步：告诉主线程回调入口点
  sendPort.send(port.sendPort);

  // 第8步：循环接收消息
  await for (var msg in port) {
    // 数组 msg[0] 是数据
    var data = msg[0];
    // 数组 msg[1] 是发送方Port
    SendPort replyTo = msg[1];
    // 回传发送方 数据
    replyTo.send(data);
    // 如果数据时 bar 关闭当前回调
    if (data == "bar") port.close();
  }
}

/*
主线程 发送消息函数
数组 msg[0] 是数据
数组 msg[1] 是发送方Port
返回 隔离线程 Port
*/
Future sendReceive(SendPort port, msg) {
  ReceivePort response = new ReceivePort();
  port.send([msg, response.sendPort]);
  return response.first;
}
```

# 注解 Metadata

**作用**

官方称之为 `元数据` , 其实在 `java` 里就是注解

简化代码编写，方便阅读，和重用

**内置 `deprecated`**

用来注解 不建议使用、老旧的 成员对象

```dart
class Television {

  @deprecated
  void activate() {
    turnOn();
  }

  void turnOn() {
    print('on!');
  }
}

main(List<String> args) {
  var t = new Television();
  t.activate();
  t.turnOn();
}
```

**内置 `override`**

表明你的函数是想覆写超类的一个函数

超类就是被你集成的父类

下面的代码中父类是 `Object`

```
class A {
  @override
  noSuchMethod(Invocation mirror) {
    print('没有找到方法');
  }
}

main(List<String> args) {
  dynamic a = new A();
  a.message();
}
```

**内置 `proxy`**

注解来避免警告信息

在 Dart2 中已经被标记为过时老旧

```dart
@proxy
class A {
  noSuchMethod(Invocation mirror) {
    print('没有找到方法');
  }
}

main(List<String> args) {
  dynamic a = new A();
  a.say();
}
```

**自定义注解**

使用反射可以在运行时获取元数据信息

比如服务端的控制器开发

下面的代码 展示了如何在反射中读取 `metadata` 信息

```dart
import 'dart:mirrors';

@Todo('seth', 'make this do something')
void doSomething() {
  print('do something');
}

class Todo {
  final String who;
  final String what;

  const Todo(this.who, this.what);
}

main(List<String> args) {
  currentMirrorSystem().libraries.forEach((uri, lib) {
    // print('lib: ${uri}');
    lib.declarations.forEach((s, decl) {
      // print('decl: ${s}');
      decl.metadata.where((m) => m.reflectee is Todo).forEach((m) {
        var anno = m.reflectee as Todo;
        if (decl is MethodMirror) {
          print('Todo(${anno.who}, ${anno.what})');
          ((decl as MethodMirror).owner as LibraryMirror).invoke(s, []);
        }
        ;
      });
    });
  });
}
```

# 类型信息 typedef

**作用**

typedef 用来保存函数的信息，未来可能会保存类信息。

**示例代码**

- 采用 `typedef`

```dart
// 定义函数类型
typedef int Compare(Object a, Object b);

// 定义排序类
class SortedCollection {
  Compare compare;
  // 构造时传入函数
  SortedCollection(this.compare);
}

// 定义排序函数
int sort(Object a, Object b) => 0;

// 程序入口
main() {
  // 实例化传入
  SortedCollection coll = new SortedCollection(sort);
  // 类型检查
  assert(coll.compare is Function);
  assert(coll.compare is Compare);
}
```

- 未采用 `typedef`

```dart
class SortedCollection {
  // 函数对象
  Function compare;

  // 定义函数
  SortedCollection(int f(Object a, Object b)) {
    compare = f;
  }
}

// 生命函数
int sort(Object a, Object b) => 0;

main() {
  // 实例化
  SortedCollection coll = new SortedCollection(sort);

  // 我们只知道 compare 是一个 Function 类型，
  // 但是不知道具体是何种 Function 类型？
  assert(coll.compare is Function);
}
```

区别就是 `typedef` 编辑器会提示函数信息

```dart
class Person {
  final String name;

  operator ==(other) =>
      other != null &&
      other is Person &&
      name == other.name;
}
```
