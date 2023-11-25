# 代码分格 effective style

**使用 UpperCamelCase 风格来命名类型名称**

```dart
class SliderMenu { ... }

class HttpRequest { ... }

typedef bool Predicate<T>(T value);
```

**使用 lowercase_with_underscores 风格来命名库和文件名名字**

```dart
library peg_parser.source_scanner;

import 'file_system.dart';
import 'slider_menu.dart';
```

**使用 lowercase_with_underscores 风格命名导入的前缀**

```dart
import 'dart:json' as json;
import 'dart:math' as math;
import 'package:javascript_utils/javascript_utils.dart' as js_utils;
import 'package:js/js.dart' as js;
```

**使用 lowerCamelCase 风格来命名其他的标识符**

```dart
var item;

HttpRequest httpRequest;

align(clearItems) {
  // ...
}
```

**使用 lowerCamelCase 来命名常量**

```dart
const pi = 3.14;
const defaultTimeout = 1000;
final urlScheme = new RegExp('^([a-z]+):');

class Dice {
  static final numberGenerator = new Random();
}
```

**把 “dart:” 导入语句放到其他导入语句之前**

```dart
import 'dart:async';
import 'dart:html';

import 'package:bar/bar.dart';
import 'package:foo/foo.dart';
```

**把 “package:” 导入语句放到相对导入语句之前**

```dart
import 'package:bar/bar.dart';
import 'package:foo/foo.dart';

import 'a.dart';
```

**把”第三方” “package:” 导入语句放到其他语句之前。**

```dart
import 'package:bar/bar.dart';
import 'package:foo/foo.dart';

import 'package:myapp/io.dart';
import 'package:myapp/util.dart';
```

**把导出（export）语句放到所有导入语句之后的部分**

```dart
import 'src/error.dart';
import 'src/string_source.dart';

export 'src/error.dart';
```

**按照字母顺序来排序每个部分中的语句**

```dart
import 'package:bar/bar.dart';
import 'package:foo/bar.dart';

import 'a.dart';
import 'a/b.dart';
```

**在所有的控制结构上使用大括号**

```dart
if (true) {
  print('sanity');
} else {
  print('opposite day!');
}
```

**当只有 if 语句没有 else 语句并且 所有语句可以放到一行的时候，可以省略大括号**

```dart
if (arg == null) return defaultValue;
```

**通常用于当条件满足的时候就跳出 if 或者 返回的情况。 但是对于其他表达式，如果可以放到一行中， 也可以这样使用**

```dart
if (parameter == null) parameter = defaultValue;
```

**在每个语句或者声明后面添加一个空行**

```dart
main() {
  first(statement);
  second(statement);
}

anotherDeclaration() { ... }
```

**在关键字 operator 后面添加一个空格**

```dart
bool operator ==(other) => ...;
```

**在二元和三元操作符之间添加空格**

```dart
average = (a + b) / 2;
largest = a > b ? a : b;
if (obj is! SomeType) print('not SomeType');
optional([parameter = defaultValue]) { ... }
```

**不要在一元操作符前后添加空格**

```dart
!condition
index++
```

**把开始的大括号 ({) 放到同一行上**

```dart
class Foo {
  method() {
    if (true) {
      // ...
    } else {
      // ...
    }
  }
}
```

**在函数和方法体的 { 之前添加一个空格**

```dart
getEmptyFn(a) {
  return () {};
}
```

**把三元操作符放到多个表达式的下一行开始位置**

```dart
return someCondition
    ? whenTrue
    : whenFalse;
```

**把 . 放到下一行开头当表达式换行的时候**

```dart
someVeryLongVariable.withAVeryLongProperty
    .aMethodOnThatObject();
```

**把构造函数初始化列表中的每个参数和值都放到同一行**

```dart
MyClass()
    : firstField = 'some value',
      secondField = 'another',
      thirdField = 'last' {
  // ...
}
```

**当无法在一行写完集合的时候，把每个元素都用集合定义的方式来表达**

```dart
mapInsideList([
  {
    'a': 'b',
    'c': 'd'
  },
  {
    'a': 'b',
    'c': 'd'
  },
]);
```

**用两个空格来缩进代码块和集合体**

```dart
if (condition) {
  print('hi');

  [
    long,
    list,
    literal
  ];
}
```

**缩进 switch case 两个空格， case 体四个空格**

```dart
switch (fruit) {
  case 'apple':
    print('delish');
    break;

  case 'durian':
    print('stinky');
    break;
}
```

**只少使用两个空格来缩进多行函数级联调用**

```dart
buffer
  ..write('Hello, ')
  ..write(name)
  ..write('!');
```

**使用四个空格来缩进同一行的换行**

```dart
someLongObject.aReallyLongMethodName(longArg, anotherLongArg,
    wrappedToNextLine);

bobLikes() =>
    isDeepFried || (hasPieCrust && !vegan) || containsBacon;
```

**当表达式包含多行函数或者 集合声明定义的时候除外**

```dart
new Future.delayed(const Duration(seconds: 1), () {
  print('I am a callback');
});

args.addAll([
  '--mode',
  'release',
  '--checked'
]);
```

# 代码分格 最佳实践 effective-usage

**使用相邻的字符串字面量定义来链接字符串**

```dart
raiseAlarm(
    'ERROR: Parts of the spaceship are on fire. Other '
    'parts are overrun by martians. Unclear which are which.');
```

**使用插值的形式来组合字符串和值**

```dart
'Hello, $name! You are ${year - birth} years old.';
```

**避免在字符串插值中使用多余的大括号**

```dart
'Hi, $name!'
"Wear your wildest $decade's outfit."
'Wear your wildest ${decade}s outfit.'
```

**尽可能的使用集合字面量来定义集合**

```dart
var points = [];
var addresses = {};
```

**如果有必要还可以提供泛型类型**

```dart
var points = <Point>[];
var addresses = <String, Address>{};
```

**不要 使用 .length 来判断集合是否为空**

```dart
if (lunchBox.isEmpty) return 'so hungry...';
if (words.isNotEmpty) return words.join(' ');
```

**使用高阶（higher-order）函数来转换集合数据**

```dart
var aquaticNames = animals
    .where((animal) => animal.isAquatic)
    .map((animal) => animal.name);
```

**避免 在 Iterable.forEach() 中使用函数声明形式**

```dart
for (var person in people) {
  ...
}
```

forEach() 方法通常在 JavaScript 中使用，原因是系统内置的 for-in 循环并不能提供期望的结果。 相反，在 Dart 中如果需要遍历一个集合，通常使用循环语句

如果你只想在每个集合元素上调用一个已经定义好的函数，则可以使用 forEach() 函数

```dart
people.forEach(print);
```

**要 用方法声明的形式来给方法起个名字**

- 正确

```dart
void main() {
  localFunction() {
    ...
  }
}
```

- 错误示范

```dart
void main() {
  var localFunction = () {
    ...
  };
}
```

不要 显式的把变量初始化为 null

```dart
int _nextId;

class LazyId {
  int _id;

  int get id {
    if (_nextId == null) _nextId = 0;
    if (_id == null) _id = _nextId++;

    return _id;
  }
}
```

**在 Dart 中没有初始化的变量和域会自动的 初始化为 null。在语言基本就保证了该行为的可靠性。 在 Dart 中没有 “未初始化的内存”这个概念。所以添加 = null 是多余的。**

不要 创建没必要的 getter 和 setter

````dart
```

# 段落 1

- 正确

```dart
class Box {
  var contents;
}
````

- 错误

```dart
class Box {
  var _contents;
  get contents => _contents;
  set contents(value) {
    _contents = value;
  }
}
```

**推荐 使用 final 关键字来限定只读属性**

```dart
class Box {
  final contents = [];
}
```

**考虑 用 => 来实现只有一个单一返回语句的函数**

```dart
get width => right - left;
bool ready(num time) => minTime == null || minTime <= time;
containsValue(String value) => getValues().contains(value);
```

**要 尽可能的在定义变量的时候初始化其值**

```dart
class Folder {
  final String name;
  final List<Document> contents = [];

  Folder(this.name);
  Folder.temp() : name = 'temporary';
}
```

**要 尽可能的使用初始化形式**

```dart
class Point {
  num x, y;
  Point(this.x, this.y);
}
```

**要 把 super() 调用放到构造函数初始化列表之后调用**

```dart
View(Style style, List children)
    : _children = children,
      super(style) {
```

**要 使用 rethrow 来重新抛出捕获的异常**

```dart
try {
  somethingRisky();
} catch(e) {
  if (!canHandle(e)) rethrow;
  handle(e);
}
```

**推荐 使用 async/await 而不是直接使用底层的特性**

```dart
Future<bool> doAsyncComputation() async {
  try {
    var result = await longRunningCalculation();
    return verifyResult(result.summary);
  } catch(e) {
    log.error(e);
    return false;
  }
}
```

**不要 在没有有用效果的情况下使用 async**

```dart
Future afterTwoThings(Future first, second) {
  return Future.wait([first, second]);
}
```

**要 使用一致的术语**

```dart
pageCount         // 一个成员变量
updatePageCount() // 和 pageCount 名字一致。
toSomething()     // 和 Iterable 的 toList() 一致。
asSomething()     // 和 List 的 asMap() 一致。
Point             // 广为人知的概念。
```

**避免 缩写**

```dart
pageCount
buildRectangles
IOStream
HttpRequest
```

**推荐 把最具描述性的名词放到最后**

```dart
pageCount             // A count (of pages).
ConversionSink        // A sink for doing conversions.
ChunkedConversionSink // A ConversionSink that's chunked.
CssFontFaceRule       // A rule for font faces in CSS.
```

**考虑 尽量让代码看起来像普通的句子**

```dart
// "If errors is empty..."
if (errors.isEmpty) ...

// "Hey, _subscription, cancel!"
_subscription.cancel();

// "Get the monsters where the monster has claws."
monsters.where((monster) => monster.hasClaws);
```

**推荐 使用非命令式动词短语命名布尔类型的变量和属性**

```dart
isEmpty
hasElements
canClose
closesWindow
canShowPopup
hasShownPopup
```

**考虑 省略命名布尔参数的动词**

```dart
Isolate.spawn(entryPoint, message, paused: false)
new List.from(elements, growable: true)
new RegExp(pattern, caseSensitive: false)
```

**推荐 使用命令式动词短语来命名带有副作用的函数或者方法**

```dart
list.add()
queue.removeFirst()
window.refresh()
connection.downloadData()
```

**考虑 使用名词短语或者非命令式动词短语命名返回数据为主要功能的方法或者函数**

```dart
list.elementAt(3)
string.codeUnitAt(4)
```

**推荐 使用 to\_\_\_() 来命名把对象的状态转换到一个新的对象的函数**

```dart
list.toSet()
stackTrace.toString()
dateTime.toLocal()
```

**使用 as\_\_\_() 来命名把原来对象转换为另外一种表现形式的函数**

```dart
list.asMap()
bytes.asFloat32List()
subscription.asFuture()
```

**避免 在方法或者函数名称中描述参数**

```dart
list.add(element)
map.remove(key)
```

**避免 定义使用简单的方法可以替代的只有一个成员的抽象类**

和 Java 不同的是， Dart 支持一等方法（first-class functions）、闭包和优雅的语法来使用它们。 如果你需要的只是一个回调函数，使用方法即可。 如果你定义了一个类，里面只有一个名字无意义的函数， 例如 call 或者 invoke， 这种情况最好用方法替代

```dart
typedef bool Predicate(item);
```

**避免 定义只包含静态成员的类**

```dart
DateTime mostRecent(List<DateTime> dates) {
  return dates.reduce((a, b) => a.isAfter(b) ? a : b);
}

const _favoriteMammal = 'weasel';
```

然后，这条规则并不是强制的。对于一些常量或者枚举型的类型， 使用类来把相关的成员组织到一起可能也是合理的。当然， 使用库也是同样合理的。

```dart
class Color {
  static const red = '#f00';
  static const green = '#0f0';
  static const blue = '#00f';
  static const black = '#000';
  static const white = '#fff';
}
```

**推荐 使用构造函数而不是静态函数来创建对象**

```dart
class Point {
  num x, y;
  Point(this.x, this.y);
  Point.polar(num theta, num radius)
      : x = radius * math.cos(theta),
        y = radius * math.sin(theta);
}
```

**要 使用 getter 来定义访问属性的操作**

如果函数的名字带有 get 前缀，或者是一个像 length 或者 size 这样 的名称，这种情况通常最好定义该函数为一个 getter。 当全部满足下面的条件的时候，你应该使用一个 getter：

没有参数。返回一个值没有副作用 调用一个 getter 不应该改变对象外部可见的状态 (内部缓存和延时初始化的状态可以发生变化) 如果对象的状态在多次调用同一个 getter 之间没有发生变化，则 多次调用同一个 getter 应该返回同一个值

```dart
rectangle.width
collection.isEmpty
button.canShow
```

要 对于本质上为修改对象属性的函数要使用 setter

```dart
rectangle.width = 3;
button.visible = false;
```

不要 为 setter 指定返回类型

```dart
set foo(Foo value) {...}
```

**推荐 为私有成员提供类型**

在公开的 API 上使用类型可以帮助使用你的库的用户。同样， 是私有代码上使用类型，可以帮助你的你的同事或者代码维护者。 另外，在私有成员上使用类型，对于将来自己查看代码 也有帮助。

```dart
class CallChainVisitor {
  final SourceVisitor _visitor;
  final Expression _target;

  void _writeCall(Expression call) { ... }

  ...
}
```

**避免 在方法表达式上使用类型**

```dart
var names = people.map((person) => person.name);
```

**避免 在没必要的地方使用 dynamic 类型**

在大部分 Dart 代码中，类型可以忽略，这样该参数类型会自动设置为 dynamic。 所以没必要手动指定类型为 dynamic 的， 只需要省略类型即可。

```dart
lookUpOrDefault(String name, Map map, defaultValue) {
  var value = map[name];
  if (value != null) return value;
  return defaultValue;
}
```

**避免 使用 Function 类型**

- 正确

```dart
bool isValidString(String value, bool predicate(String string)) { ... }
```

- 错误

```dart
bool isValidString(String value, Function predicate) { ... }
```

要 使用 Object 来替代 dynamic 来表示可以接受任意对象

```dart
// Accepts any object.
void log(Object object) {
  print(object.toString());
}

// Only accepts bool or String, which can't be expressed in a type annotation.
bool convertToBool(arg) {
  if (arg is bool) return arg;
  if (arg is String) return arg == 'true';
  throw new ArgumentError('Cannot convert $arg to a bool.');
}
```

**考虑使用命名参数或者命名构造函数以及命名常量来清晰 的表明您的意图**：

```dart
new Task.oneShot();
new Task.repeating();
new ListBox(scroll: true, showScrollbars: true);
new Button(ButtonState.enabled);
```

对于 setter 则没有这个要求，应为 setter 的名字已经明确的 表明了值所代表的意义

```dart
listBox.canScroll = true;
button.isEnabled = false;
```

避免 把用户想要忽略的参数放到位置可选参数的前列

```dart
String.fromCharCodes(Iterable<int> charCodes, [int start = 0, int end])

DateTime(int year,
    [int month = 1,
    int day = 1,
    int hour = 0,
    int minute = 0,
    int second = 0,
    int millisecond = 0,
    int microsecond = 0])

Duration(
    {int days: 0,
    int hours: 0,
    int minutes: 0,
    int seconds: 0,
    int milliseconds: 0,
    int microseconds: 0})
```

**避免 使用强制无意义的参数**

```dart
string.substring(start)
```

**要 使用包含开始位置并且不包含结束位置的范围参数**

如果你定义一个函数或者方法让用户从基于位置排序的集合中 选择一些元素，需要一个开始位置索引和结束位置索引分别制定开始 元素的位置以及结束元素的位置。结束位置通常是指 大于最后一个元素的位置的值。

核心库就是这样定义的，所以最好和核心库保持一致

```dart
[0, 1, 2, 3].sublist(1, 3) // [1, 2].
'abcd'.substring(1, 3)     // "bc".
```

不要 在自定义 == 操作符中判断 null

语言规范表明了这种判断已经自动执行了，你的 == 自定义操作符只有当 右侧对象不为 null 的时候才会执行。

- 正确

```dart
class Person {
  final String name;

  operator ==(other) =>
      other is Person && name == other.name;
}
```

- 错误

```dart
class Person {
  final String name;

  operator ==(other) =>
      other != null &&
      other is Person &&
      name == other.name;
}
```
