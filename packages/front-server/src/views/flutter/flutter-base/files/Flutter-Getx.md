# Flutter Getx

根据后端返回的接口数据生成对应的路由表，可以使用 GetX 的动态路由生成功能

```dart
import 'package:flutter/material.dart';
import 'package:get/get.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'Dynamic Routing Example',
      initialRoute: '/home',
      getPages: generateRoutes, // 使用动态生成的路由表
    );
  }

  List<GetPage> get generateRoutes {
    // 模拟从后端获取的路由数据
    List<Map<String, dynamic>> backendRoutes = [
      {'routeName': '/home', 'page': () => HomePage()},
      {'routeName': '/details', 'page': () => DetailsPage()},
      // 添加其他路由数据
    ];

    // 根据后端返回的数据生成路由表
    List<GetPage> routes = backendRoutes.map<GetPage>((routeData) {
      String routeName = routeData['routeName'];
      Widget Function() pageBuilder = routeData['page'];

      return GetPage(name: routeName, page: pageBuilder);
    }).toList();

    return routes;
  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Home')),
      body: Center(child: Text('Home Page')),
    );
  }
}

class DetailsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Details')),
      body: Center(child: Text('Details Page')),
    );
  }
}
```

## 路由、中间件、鉴权、传值、跳转

### 编写 GetPage 定义

- lib/pages/list/index.dart

```dart
class ListView extends StatelessWidget {
  const ListView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("列表页"),
      ),
    );
  }
}
```

- lib/pages/list_detail/index.dart

```dart
class DetailView extends StatelessWidget {
  const DetailView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("详情页"),
      ),
      body: ListView(
        children: [
          ListTile(
            title: Text("导航-返回"),
            subtitle: Text('Get.back()'),
            onTap: () => Get.back(),
          ),
        ],
      ),
    );
  }
}
```

- lib/common/routes/app_routes.dart

```dart
abstract class AppRoutes {
  static const Home = '/home';
  static const List = '/list';
  static const Detail = '/detail';
```

- lib/common/routes/app_pages.dart

```dart
GetPage(
  name: AppRoutes.Home,
  page: () => HomeView(),
  children: [
    GetPage(
      name: AppRoutes.List,
      page: () => ListView(),
      children: [
        GetPage(
          name: AppRoutes.Detail,
          page: () => DetailView(),
        ),
      ],
    ),
  ],
),
```

### 导航操作 命名、视图对象

- lib/pages/home/index.dart

```dart
ListTile(
  title: Text("导航-命名路由 home > list"),
  subtitle: Text('Get.toNamed("/home/list")'),
  onTap: () => Get.toNamed("/home/list"),
),
ListTile(
  title: Text("导航-命名路由 home > list > detail"),
  subtitle: Text('Get.toNamed("/home/list/detail")'),
  onTap: () => Get.toNamed("/home/list/detail"),
),
ListTile(
  title: Text("导航-类对象"),
  subtitle: Text("Get.to(DetailView())"),
  onTap: () => Get.to(DetailView()),
),
```

### 导航-清除上一个

- lib/pages/home/index.dart

```dart
ListTile(
  title: Text("导航-清除上一个"),
  subtitle: Text("Get.off(DetailView())"),
  onTap: () => Get.off(DetailView()),
),
```

### 导航-清除所有

- lib/pages/home/index.dart

```dart
ListTile(
  title: Text("导航-清除所有"),
  subtitle: Text("Get.offAll(DetailView())"),
  onTap: () => Get.offAll(DetailView()),
),
```

### 导航-arguments 传值+返回值

- lib/pages/home/index.dart

```dart
ListTile(
  title: Text("导航-arguments传值+返回值"),
  subtitle: Text(
      'Get.toNamed("/home/list/detail", arguments: {"id": 999})'),
  onTap: () async {
    var result = await Get.toNamed("/home/list/detail",
        arguments: {"id": 999});
    Get.snackbar("返回值", "success -> " + result["success"].toString());
  },
),
```

- lib/pages/list_detail/index.dart

```dart
_buildBackListTileRow(Map? val) {
  return val == null
      ? Container()
      : ListTile(
          title: Text("传值 id = " + val["id"].toString()),
          subtitle: Text('Get.back(result: {"success": true}'),
          onTap: () => Get.back(result: {"success": true}),
        );
}

@override
Widget build(BuildContext context) {
  final details = Get.arguments as Map;
  final parameters = Get.parameters;

  return Scaffold(
    appBar: AppBar(
      title: Text("详情页"),
    ),
    body: ListView(
      children: [
        ListTile(
          title: Text("导航-返回"),
          subtitle: Text('Get.back()'),
          onTap: () => Get.back(),
        ),
        _buildBackListTileRow(details),
        _buildBackListTileRow(parameters),
      ],
    ),
  );
}
```

### 导航-parameters 传值+返回值

- lib/pages/home/index.dart

```dart
ListTile(
  title: Text("导航-parameters传值+返回值"),
  subtitle: Text('Get.toNamed("/home/list/detail?id=666")'),
  onTap: () async {
    var result = await Get.toNamed("/home/list/detail?id=666");
    Get.snackbar("返回值", "success -> " + result["success"].toString());
  },
),
```

- lib/pages/list_detail/index.dart

```dart
@override
Widget build(BuildContext context) {
  final parameters = Get.parameters;
```

### 导航-参数传值+返回值

- lib/common/routes/app_routes.dart

```dart
static const Detail_ID = '/detail/:id';
```

- lib/common/routes/app_pages.dart

```dart
...
GetPage(
  name: AppRoutes.Detail_ID,
  page: () => DetailView(),
),
```

- lib/pages/home/index.dart

```dart
ListTile(
  title: Text("导航-参数传值+返回值"),
  subtitle: Text('Get.toNamed("/home/list/detail/777")'),
  onTap: () async {
    var result = await Get.toNamed("/home/list/detail/777");
    Get.snackbar("返回值", "success -> " + result["success"].toString());
  },
),
```

### 导航-not found

- lib/pages/notfound/index.dart

```dart
class NotfoundView extends StatelessWidget {
  const NotfoundView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("路由没有找到"),
      ),
      body: ListTile(
        title: Text("返回首页"),
        subtitle: Text('Get.offAllNamed(AppRoutes.Home)'),
        onTap: () => Get.offAllNamed(AppRoutes.Home),
      ),
    );
  }
}
```

- lib/common/routes/app_routes.dart

```dart
static const NotFound = '/notfound';
```

- lib/common/routes/app_pages.dart

```dart
static final unknownRoute = GetPage(
  name: AppRoutes.NotFound,
  page: () => NotfoundView(),
);
```

- lib/main.dart

```dart
@override
Widget build(BuildContext context) {
  return GetMaterialApp(
    ...
    unknownRoute: AppPages.unknownRoute,
  );
}
```

### 导航-中间件-认证 Auth

- lib/pages/login/index.dart

```dart
class LoginView extends StatelessWidget {
  const LoginView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("登录"),
      ),
      body: ListTile(
        title: Text("返回首页"),
        subtitle: Text('Get.offAllNamed(AppRoutes.Home)'),
        onTap: () => Get.offAllNamed(AppRoutes.Home),
      ),
    );
  }
}
```

- lib/pages/my/index.dart

```dart
class MyView extends StatelessWidget {
  const MyView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("我的"),
      ),
      body: ListTile(
        title: Text("返回首页"),
        subtitle: Text('Get.offAllNamed(AppRoutes.Home)'),
        onTap: () => Get.offAllNamed(AppRoutes.Home),
      ),
    );
  }
}
```

- lib/common/routes/app_routes.dart

```dart
static const Login = '/login';
static const My = '/my';
```

- lib/common/middleware/router_auth.dart

```dart
class RouteAuthMiddleware extends GetMiddleware {
  @override
  int priority = 0;

  RouteAuthMiddleware({required this.priority});

  @override
  RouteSettings? redirect(String route) {
    Future.delayed(Duration(seconds: 1), () => Get.snackbar("提示", "请先登录APP"));
    return RouteSettings(name: AppRoutes.Login);
  }
}
```

- lib/common/routes/app_pages.dart

```dart
// 白名单
GetPage(
  name: AppRoutes.Login,
  page: () => LoginView(),
),

GetPage(
  name: AppRoutes.My,
  page: () => MyView(),
  middlewares: [
    RouteAuthMiddleware(priority: 1),
  ],
),
```

- lib/pages/home/index.dart

```dart
ListTile(
  title: Text("导航-中间件-认证Auth"),
  subtitle: Text('Get.toNamed(AppRoutes.My)'),
  onTap: () => Get.toNamed(AppRoutes.My),
),
```

### Transition 转场动画

- lib/common/routes/app_pages.dart

```dart
GetPage(
  name: AppRoutes.Detail_ID,
  page: () => DetailView(),
  transition: Transition.downToUp,
),
```

## 空安全、更健全的代码

### 空安全意味着什么

- 默认不可空

```dart
String title = 'ducafecat';
```

- `type?` 操作符

```dart
String? title = null;
```

- `value!` 操作符

```dart
String? title = 'ducafecat';
String newTitle = title!;
```

- `value?` 操作符

```dart
String? title = 'ducafecat';
bool isEmpty = title?.isEmpty();
```

- `value??` 操作符

```dart
String? title = 'ducafecat';
String newTitle = title ?? 'cat';
```

- `late` 会在运行时检查。所以请您仅在确定它被使用前一定会被初始化的情况下使用

```dart
late String? title;
title = 'ducafecat';
```

- List、泛型

| 类型           | 集合是否可空 | 数据项是否可空 |
| -------------- | ------------ | -------------- |
| List           | no           | no             |
| List?          | yes          | no             |
| List<String?>  | no           | yes            |
| List<String?>? | yes          | yes            |

- Map

| 类型               | 集合是否可空 | 数据项是否可空 |
| ------------------ | ------------ | -------------- |
| Map<String, int>   | no           | no\*           |
| Map<String, int>?  | yes          | no\*           |
| Map<String, int?>  | no           | yes            |
| Map<String, int?>? | yes          | yes            |

> `*` 可能返回空

```dart
// 有可能返回 null
int value = <String, int>{'one': 1}['one']; // ERROR

// 需要加上 type?
int? value = <String, int>{'one': 1}['one']; // OK

// 或者 value!
int value = <String, int>{'one': 1}['one']!; // OK
```

### 带来的好处

- 代码更健康
- 用户体验好
- 运行更快
- 编译文件更小

### 开启和迁移

- pubspec.yaml

```dart
environment:
  sdk: ">=2.12.0 <3.0.0"
```

- 迁移顺序

我们强烈建议您按顺序迁移代码，先迁移依赖关系中的处于最末端的依赖。例如，如果 C 依赖了 B，B 依赖了 A，那么应该按照 A -> B -> C 的顺序进行迁移。

![img](https://ducafecat.tech/2021/04/09/flutter-getx/flutter-getx-02-null-safety/2021-04-09-11-16-14.png)

- 检查依赖项目

```dart
# Dart 版本是否为 2.12 或更高
> dart --version

# 依赖包的迁移状态
> dart pub outdated --mode=null-safety
```

- 升级依赖

```dart
# 该命令会更改您的 pubspec.yaml 文件
> dart pub upgrade --null-safety

# 升级包
> dart pub upgrade
```

- 迁移工具

```dart
> dart migrate
```

- 分析

```dart
> dart analyze
```

### 禁用空安全

- cli 命令

```dart
> dart --no-sound-null-safety run
> flutter run --no-sound-null-safety
```

- .vscode/launch.json

```dart
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "getx_quick_start",
      "request": "launch",
      "type": "dart",
      "program": "lib/main.dart",
      "args": ["--no-sound-null-safety"]
    }
  ]
}
```

### 范例、规范

https://dart.cn/null-safety/understanding-null-safety

- 明确处理空状态

```dart
makeCoffee(String coffee, [String? dairy]) {
  if (dairy != null) {
    print('$coffee with $dairy');
  } else {
    print('Black $coffee');
  }
}
```

- **顶层变量和静态字段必须包含一个初始化方法。**由于它们能在程序里的任何位置被访问到，编译器无法保证它们在被使用前已被赋值。唯一保险的选项是要求其本身包含初始化表达式，以确保产生匹配的类型的值。

```dart
int topLevel = 0;

class SomeClass {
  static int staticField = 0;
}
```

- **实例的字段也必须在声明时包含初始化方法，可以为常见初始化形式，也可以在实例的构造方法中进行初始化。**

```dart
class SomeClass {
  int atDeclaration = 0;
  int initializingFormal;
  int initializationList;

  SomeClass(this.initializingFormal)
      : initializationList = 0;
}
```

- 局部变量的灵活度最高。一个非空的变量 **不一定需要** 一个初始化方法。

```dart
int tracingFibonacci(int n) {
  int result;
  if (n < 2) {
    result = n;
  } else {
    result = tracingFibonacci(n - 2) + tracingFibonacci(n - 1);
  }

  print(result);
  return result;
}
```

- 流程分析，在这里 Dart 将 `object` 的类型从它声明的 `Object` 提升到了 `List`。在空安全引入以前，下面的程序无法运行。

```dart
// With (or without) null safety:
bool isEmptyList(Object object) {
  if (object is List) {
    return object.isEmpty; // <-- OK!
  } else {
    return false;
  }
}

->

// Without null safety:
bool isEmptyList(Object object) {
  if (object is! List) return false;
  return object.isEmpty;
}
```

- 绝对的赋值分析

```dart
int tracingFibonacci(int n) {
  final int result;
  if (n < 2) {
    result = n;
  } else {
    result = tracingFibonacci(n - 2) + tracingFibonacci(n - 1);
  }

  print(result);
  return result;
}
```

- 无用代码的警告

```dart
String checkList(List list) {
  if (list?.isEmpty) {
    return 'Got nothing';
  }
  return 'Got something';
}
```

- 懒加载的变量， `late` 修饰符是“在运行时而非编译时对变量进行约束”。这就让 `late` 这个词语约等于 **何时** 执行对变量的强制约束。

```dart
// Using null safety:
class Coffee {
  String? _temperature;

  void heat() { _temperature = 'hot'; }
  void chill() { _temperature = 'iced'; }

  String serve() => _temperature! + ' coffee';
}

->

// Using null safety:
class Coffee {
  late String _temperature;

  void heat() { _temperature = 'hot'; }
  void chill() { _temperature = 'iced'; }

  String serve() => _temperature + ' coffee';
}
```

- `late` 与 `final` 结合使用，与普通的 `final` 字段不同，您不需要在声明或构造时就将其初始化。您可以稍后在运行中的某个地方加载它。但是您只能对其进行 **一次** 赋值，并且它在运行时会进行校验。

```dart
// Using null safety:
class Coffee {
  late final String _temperature;

  void heat() { _temperature = 'hot'; }
  void chill() { _temperature = 'iced'; }

  String serve() => _temperature + ' coffee';
}
```

- 毕传参数，这里的所有参数都必须通过命名来传递。参数 `a` 和 `c` 是可选的，可以省略。参数 `b` 和 `d` 是必需的，调用时必须传递。在这里请注意，是否必需和是否可空无关。

```dart
// Using null safety:
function({int? a, required int? b, int? c, required int? d}) {}
```

- 抽象字段

```dart
abstract class Cup {
  Beverage get contents;
  set contents(Beverage);
}

->

abstract class Cup {
  abstract Beverage contents;
}
```

- 一些赋值计算可以移动到静态的初始化中。

```dart
// Initalized without values
ListQueue _context;
Float32List _buffer;
dynamic _readObject;

Vec2D(Map<String, dynamic> object) {
  _buffer = Float32List.fromList([0.0, 0.0]);
  _readObject = object['container'];
  _context = ListQueue<dynamic>();
}

->

// Initalized with values
final ListQueue _context = ListQueue<dynamic>();
final Float32List _buffer = Float32List.fromList([0.0, 0.0]);
final dynamic _readObject;

Vec2D(Map<String, dynamic> object) : _readObject = object['container'];
```

- 可能返回 `null` 的工厂方法

```dart
factory StreamReader(dynamic data) {
  StreamReader reader;
  if (data is ByteData) {
    reader = BlockReader(data);
  } else if (data is Map) {
    reader = JSONBlockReader(data);
  }
  return reader;
}

->

factory StreamReader(dynamic data) {
  if (data is ByteData) {
    // Move the readIndex forward for the binary reader.
    return BlockReader(data);
  } else if (data is Map) {
    return JSONBlockReader(data);
  } else {
    throw ArgumentError('Unexpected type for data');
  }
}
```

## 状态管理、依赖加载

### 生命周期

`GetxController`是 GetX 状态管理库中的控制器基类，它提供了一些生命周期方法，用于处理控制器的初始化、销毁和状态变化等操作。下面是`GetxController`的生命周期方法的说明：

1. `onInit()`: 当控制器被绑定到`Get`实例时调用，可以在这个方法中进行一些初始化操作，例如绑定依赖、初始化变量等。
2. `onReady()`: 当控制器准备完毕后调用，通常用于执行一些在控制器就绪后需要立即执行的操作，例如数据加载、订阅事件等。这个方法会在`Get.put()`或`Get.lazyPut()`方法调用之后被自动触发。
3. `onClose()`: 当控制器被永久移除时调用，可以在这个方法中释放资源、取消订阅等清理操作。你应该在控制器不再需要时手动调用`close()`方法，或者使用`Get.delete()`方法来移除控制器。
4. `onStart()`: 在控制器的生命周期开始时调用，包括初始化和路由转场时。这个方法会在`onInit()`之后被调用。
5. `onStop()`: 在控制器的生命周期结束时调用，包括路由转场时和控制器被移除时。这个方法会在`onClose()`之前被调用。

这些生命周期方法提供了灵活的控制器管理，可以让你在不同的阶段执行适当的操作。你可以根据需要重写这些方法，并在方法中执行自定义的逻辑。

除了这些生命周期方法外，`GetxController`还提供了一些其他的方法和属性，用于处理状态、更新 UI 和监听变化等。详细的文档可以参考 Get 官方文档：https://github.com/jonataslaw/getx/blob/master/README.zh-cn.md

**onReady**

在`GetxController`中，`super.onReady()`是一个方法调用，用于在控制器准备完毕时执行父类的相应操作。

`onReady`是`GetxController`的生命周期方法之一，它会在控制器准备完毕后被调用。在`onReady`方法中，你可以执行一些需要在控制器准备完毕后立即执行的操作。

当你在子类的控制器中重写`onReady`方法时，通过使用`super.onReady()`，你可以确保父类的`onReady`方法也得到调用。这对于需要执行一些通用的操作或初始化代码非常有用。

例如，父类的`onReady`方法可能会在控制器准备完毕后执行一些初始数据加载、订阅事件或其他需要在控制器就绪时执行的操作。通过调用`super.onReady()`，你可以确保这些操作得到执行，而不仅仅是子类中的自定义逻辑

#### Obx

- lib/pages/state_obx/index.dart

```dart
class StateObxView extends StatelessWidget {
  StateObxView({Key? key}) : super(key: key);

  final count = 0.obs;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Obx(...)"),
      ),
      body: Center(
        child: Column(
          children: [
            Obx(() => Text("count1 -> " + count.toString())),
            Obx(() => Text("count2 -> " + count.toString())),

            //
            Divider(),
            ElevatedButton(
              onPressed: () {
                count.value++;
              },
              child: Text('add'),
            ),
          ],
        ),
      ),
    );
  }
}
```

- obs、extension、RxInt、Rx

```dart
...

extension StringExtension on String {
  /// Returns a `RxString` with [this] `String` as initial value.
  RxString get obs => RxString(this);
}

extension IntExtension on int {
  /// Returns a `RxInt` with [this] `int` as initial value.
  RxInt get obs => RxInt(this);
}

extension DoubleExtension on double {
  /// Returns a `RxDouble` with [this] `double` as initial value.
  RxDouble get obs => RxDouble(this);
}

extension BoolExtension on bool {
  /// Returns a `RxBool` with [this] `bool` as initial value.
  RxBool get obs => RxBool(this);
}

extension RxT<T> on T {
  /// Returns a `Rx` instace with [this] `T` as initial value.
  Rx<T> get obs => Rx<T>(this);
}
```

- 小结

适合界面上 简单状态管理，写起来很快。

#### GetX

- 编写控制器 lib/pages/state_getx/controller.dart

```dart
class CountController extends GetxController {
  final _count = 0.obs;
  set count(value) => this._count.value = value;
  get count => this._count.value;

  final _count2 = 0.obs;
  set count2(value) => this._count2.value = value;
  get count2 => this._count2.value;

  add() => _count.value++;
  add2() => _count2.value++;
}
```

- 编写视图 lib/pages/state_getx/index.dart

```dart
class StateGetxView extends StatelessWidget {
  StateGetxView({Key? key}) : super(key: key);

  final controller = CountController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Getx"),
      ),
      body: Center(
        child: Column(
          children: [
            GetX<CountController>(
              init: controller,
              initState: (_) {},
              builder: (_) {
                print("GetX - 1");
                return Text('value 1 -> ${_.count}');
              },
            ),
            GetX<CountController>(
              init: controller,
              initState: (_) {},
              builder: (_) {
                print("GetX - 2");
                return Text('value 2 -> ${_.count}');
              },
            ),
            Divider(),

            //
            GetX<CountController>(
              init: controller,
              initState: (_) {},
              builder: (_) {
                print("GetX - 3");
                return Column(
                  children: [
                    Text('value 3 -> ${_.count}'),
                    ElevatedButton(
                      onPressed: () {
                        _.add();
                      },
                      child: Text('count1'),
                    )
                  ],
                );
              },
            ),
            Divider(),

            // count2
            GetX<CountController>(
              init: controller,
              initState: (_) {},
              builder: (_) {
                print("GetX - 4");
                return Text('value 4 -> ${_.count2}');
              },
            ),
            Divider(),

            // 按钮
            ElevatedButton(
              onPressed: () {
                controller.add();
              },
              child: Text('count1'),
            ),

            ElevatedButton(
              onPressed: () {
                controller.add2();
              },
              child: Text('count2'),
            ),
          ],
        ),
      ),
    );
  }
}
```

- 小结

适合控制多控制器、多状态更新，可精细控制初始、局部渲染。

#### GetBuilder

- 控制器 lib/pages/state_getBuilder/controller.dart 同上，不再重复
- 视图 lib/pages/state_getBuilder/index.dart
- 和 `GetX` 比起来，多了手动控制更新，有两点需要注意。
  - `controller.update();` 触发更新,一定要传入 id，不然不生效

```dart
// 视图view.dart
class IndexPage extends GetView<IndexController> {
    const IndexPage({Key? key}) : super(key: key);
    @override
    Widget build(BuildContext context) {
        return GetBuilder<IndexController>(
            init: IndexController(),
            id: "index",
            builder: (_) {
                return	SizedBox(
                    height: setHeight(30),
                    child: ElevatedButton(
                        onPressed: () {
                            _.countChange();
							_.update(['index']); // 一定要传入id，不然不生效
                        },
                        child: Text('${_.count}'),
                    ),
                ),
            },
        );
    }
}
// 控制器controller.dart
import 'package:get/get.dart';

class IndexController extends GetxController {
  IndexController();
  _initData() {
    update(["index"]);
  }

  final _count = 2.obs;
  set count(value) => _count.value = value;
  get count => _count.value;
  void countChange() {
    _count.value = _count.value * 2;
    update(["index"]); // 使用GetBuilder一定要手动更新
  }
}
```

#### ValueBuilder

- lib/pages/state_valueBuilder/index.dart

```dart
class StateValueBuilderView extends StatelessWidget {
  StateValueBuilderView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("ValueBuilder"),
      ),
      body: Column(
        children: [
          Center(
            child: ValueBuilder<int?>(
              initialValue: 10,
              builder: (value, updateFn) {
                return Column(
                  children: [
                    Text("count -> " + value.toString()),
                    ElevatedButton(
                      onPressed: () {
                        updateFn(value! + 1);
                      },
                      child: Text('ValueBuilder -> add'),
                    )
                  ],
                );
              },
              // builder: (value, updateFn) => Switch(
              //   value: value,
              //   onChanged:
              //       updateFn, // same signature! you could use ( newValue ) => updateFn( newValue )
              // ),
              // if you need to call something outside the builder method.
              onUpdate: (value) => print("Value updated: $value"),
              onDispose: () => print("Widget unmounted"),
            ),
          ),
        ],
      ),
    );
  }
}
```

- 小结

适合局部的状态管理，很灵活。

#### 防抖、限流

防抖的含义不在于延迟改变值，而在于值改变以后需要做什么动作，所以 debounce 只能放在 init 中

- 每次更改变量时都会调用 ever 'ever'。就是这样。
- ever 'once' 仅在第一次更改变量时调用。
- debounce 'debounce' 在搜索功能中非常有用，您只希望在用户完成输入时调用 API。如果用户键入“Jonny”，您将在 API 中通过字母 J、o、n、n 和 y 进行 5 次搜索。使用 Get 不会发生这种情况，因为您将拥有一个只会在键入结束时触发的“去抖动”Worker。
- interval 'interval' 与 debouce 不同。debouce 如果用户在 1 秒内对变量进行 1000 次更改，他将在规定的计时器（默认为 800 毫秒）后仅发送最后一次更改。Interval 将忽略规定时间内的所有用户操作。如果您发送事件 1 分钟，每秒 1000 次，当用户停止扫描事件时，debounce 只会向您发送最后一个事件。interval 会每秒下发事件，如果设置为 3 秒，则每分钟会下发 20 个事件。建议这样做是为了避免滥用，在用户可以快速点击某物并获得一些优势的功能中（想象一下，用户可以通过点击某物来赚取金币，如果他在同一分钟内点击 300 次，他将获得 300 金币，使用间隔，你可以设置一个时间范围为 3 秒，即使点击 300 或 1000 次，他在 1 分钟内获得的最大值也将是 20 个硬币，点击 300 或 100 万次）。debounce 适用于反 DDos，用于搜索等功能，其中对 onChange 的每次更改都会导致对您的 api 的查询。Debounce 将等待用户停止输入名称，以发出请求。如果在上面提到的硬币场景中使用它，用户只会赢得 1 个硬币，因为它只会在用户“暂停”规定的时间时执行。

- 控制器 lib/pages/state_workers/controller.dart

```dart
class CountController extends GetxController {
  final _count = 0.obs;
  set count(value) => this._count.value = value;
  get count => this._count.value;

  add() => _count.value++;

  @override
  void onInit() {
    super.onInit();

    // 每次
    ever(_count, (value) {
      print("ever -> " + value.toString());
    });

    // 第一次
    once(_count, (value) {
      print("once -> " + value.toString());
    });

    // 防抖 2 秒内
    debounce(
      _count,
      (value) {
        print("debounce -> " + value.toString());
      },
      time: Duration(seconds: 2),
    );

    // 定时器 1 秒
    interval(
      _count,
      (value) {
        print("interval -> " + value.toString());
      },
      time: Duration(seconds: 1),
    );
  }
}
```

- 视图 lib/pages/state_workers/index.dart

```dart
class StateWorkersView extends StatelessWidget {
  StateWorkersView({Key? key}) : super(key: key);

  final controller = CountController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("GetBuilder"),
      ),
      body: Center(
        child: Column(
          children: [
            // 显示
            GetX<CountController>(
              init: controller,
              initState: (_) {},
              builder: (_) {
                return Text('value -> ${_.count}');
              },
            ),

            // 按钮
            ElevatedButton(
              onPressed: () {
                controller.add();
              },
              child: Text('add'),
            ),
          ],
        ),
      ),
    );
  }
}
```

- 小结

`ever` 适合做监听、日志收集

`debounce` 适合做搜索输入框

## 依赖注入

#### Get.put

- 控制器 lib/pages/dependency_put_find/controller.dart

```dart
class CountController extends GetxController {
  final _count = 0.obs;
  set count(value) => this._count.value = value;
  get count => this._count.value;

  add() => _count.value++;

  @override
  void onInit() {
    super.onInit();
    print("onInit");
  }

  @override
  void onClose() {
    super.onClose();
    print("onClose");
  }
}
```

- 第一个视图 lib/pages/dependency_put_find/index.dart

```dart
class StateDependencyPutFindView extends StatelessWidget {
  StateDependencyPutFindView({Key? key}) : super(key: key);

  final controller = Get.put<CountController>(CountController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Dependency"),
      ),
      body: Center(
        child: Column(
          children: [
            GetX<CountController>(
              init: controller,
              initState: (_) {},
              builder: (_) {
                return Text('value -> ${_.count}');
              },
            ),
            Divider(),

            // 按钮
            ElevatedButton(
              onPressed: () {
                controller.add();
              },
              child: Text('add'),
            ),

            // 跳转
            ElevatedButton(
              onPressed: () {
                Get.to(NextPageView());
              },
              child: Text('next page'),
            ),
          ],
        ),
      ),
    );
  }
}
```

- 第二个视图 lib/pages/dependency_put_find/next_page.dart

```dart
class NextPageView extends StatelessWidget {
  NextPageView({Key? key}) : super(key: key);

  final controller = Get.find<CountController>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("NextPage"),
      ),
      body: Center(
        child: Column(
          children: [
            GetX<CountController>(
              init: controller,
              initState: (_) {},
              builder: (_) {
                return Text('value -> ${_.count}');
              },
            ),
            Divider(),
          ],
        ),
      ),
    );
  }
}
```

#### Get.lazyPut + GetView 懒加载

- 控制器 lib/pages/dependency_lazyPut/controller.dart

```dart
class CountController extends GetxController {
  final _count = 0.obs;
  set count(value) => this._count.value = value;
  get count => this._count.value;

  add() => _count.value++;

  @override
  void onInit() {
    super.onInit();
    print("onInit");
  }

  @override
  void onClose() {
    super.onClose();
    print("onClose");
  }
}
```

- 第一个视图 lib/pages/dependency_lazyPut/index.dart

```dart
class StateDependencyLazyPutView extends StatelessWidget {
  StateDependencyLazyPutView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Dependency - LazyPut"),
      ),
      body: Center(
        child: Column(
          children: [
            GetX<CountController>(
              init: Get.find<CountController>(),
              initState: (_) {},
              builder: (_) {
                return Text('value -> ${_.count}');
              },
            ),
            Divider(),

            // 按钮
            ElevatedButton(
              onPressed: () {
                Get.find<CountController>().add();
              },
              child: Text('add'),
            ),

            // 跳转
            ElevatedButton(
              onPressed: () {
                Get.to(NextPageView());
              },
              child: Text('Next GetView Page'),
            ),
          ],
        ),
      ),
    );
  }
}
```

- 第二个视图 lib/pages/dependency_lazyPut/next_getview_page.dart

```dart
class NextPageView extends GetView<CountController> {
  NextPageView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("GetView Page"),
      ),
      body: Center(
        child: Column(
          children: [
            Obx(() => Text('value -> ${controller.count}')),
            Divider(),

            // 按钮
            ElevatedButton(
              onPressed: () {
                controller.add();
              },
              child: Text('add'),
            ),
          ],
        ),
      ),
    );
  }
}
```

- 绑定 lib/pages/dependency_lazyPut/bindings.dart

```dart
class DependencyLazyPutBinding implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut<CountController>(() => CountController());
  }
}
```

- 路由 lib/common/routes/app_pages.dart

```dart
GetPage(
    name: AppRoutes.DependencyLazyPut,
    binding: DependencyLazyPutBinding(),
    page: () => StateDependencyLazyPutView(),
),
```

## GetConnect

![img](https://ducafecat.tech/2021/04/23/flutter-getx/flutter-getx-04-getconnect-statemixin-dio/GetContent.png)

- 瞎聊设计模式

`Provider` 提供者模式 位于高层 由他来决定从哪里、提供什么

相对应的有 `Consumer` 消费者模式

`Repository` 模式，这层有 `OO` 面向对象的意思，用来处理拉取数据细节，这样到 `Controller` 控制器 这一层只要处理业务就行，可方便测试

`DAO` 就是纯粹的数据访问层，没有 `00` 的概念

`Service` `Model` `Entity` …

前端其实对数据加工、面向服务、领域模型偏弱，更多的是组件拆分、样式、布局，这才是要关系的，就算是测试也是 `E2E` 侧重不同。

`E2E`（End To End）即端对端测试，属于黑盒测试，通过编写测试用例，自动化模拟用户操作，确保组件间通信正常，程序流数据传递如预期。

- 封装 GetConnect

lib/common/utils/base_provider.dart

```dart
class BaseProvider extends GetConnect {
  @override
  void onInit() {
    httpClient.baseUrl = SERVER_API_URL;

    // 请求拦截
    httpClient.addRequestModifier<void>((request) {
      request.headers['Authorization'] = '12345678';
      return request;
    });

    // 响应拦截
    httpClient.addResponseModifier((request, response) {
      return response;
    });
  }
}
```

- Provider

lib/pages/getConnect/provider.dart

```dart
abstract class INewsProvider {
  Future<Response<NewsPageListResponseEntity>> getNews();
}

class NewsProvider extends BaseProvider implements INewsProvider {
  // 新闻分页
  // @override
  // Future<Response<NewsPageListResponseEntity>> getNews() => get("/news");
  @override
  Future<Response<NewsPageListResponseEntity>> getNews() async {
    var response = await get("/news");
    var data = NewsPageListResponseEntity.fromJson(response.body);
    return Response(
      statusCode: response.statusCode,
      statusText: response.statusText,
      body: data,
    );
  }
}
```

- Repository

lib/pages/getConnect/repository.dart

```dart
abstract class INewsRepository {
  Future<NewsPageListResponseEntity> getNews();
}

class NewsRepository implements INewsRepository {
  NewsRepository({required this.provider});
  final INewsProvider provider;

  @override
  Future<NewsPageListResponseEntity> getNews() async {
    final response = await provider.getNews();
    if (response.status.hasError) {
      return Future.error(response.statusText!);
    } else {
      return response.body!;
    }
  }
}
```

- Controller

lib/pages/getConnect/controller.dart

```dart
class NewsController extends SuperController<NewsPageListResponseEntity> {
  NewsController({required this.repository});

  final INewsRepository repository;

  @override
  void onInit() {
    super.onInit();

    //Loading, Success, Error handle with 1 line of code
    // append(() => repository.getNews);
  }

  // 拉取新闻列表
  Future<void> getNewsPageList() async {
    append(() => repository.getNews);
  }

  @override
  void onReady() {
    print('The build method is done. '
        'Your controller is ready to call dialogs and snackbars');
    super.onReady();
  }

  @override
  void onClose() {
    print('onClose called');
    super.onClose();
  }

  @override
  void didChangeMetrics() {
    print('the window size did change');
    super.didChangeMetrics();
  }

  @override
  void didChangePlatformBrightness() {
    print('platform change ThemeMode');
    super.didChangePlatformBrightness();
  }

  @override
  Future<bool> didPushRoute(String route) {
    print('the route $route will be open');
    return super.didPushRoute(route);
  }

  @override
  Future<bool> didPopRoute() {
    print('the current route will be closed');
    return super.didPopRoute();
  }

  @override
  void onDetached() {
    print('onDetached called');
  }

  @override
  void onInactive() {
    print('onInative called');
  }

  @override
  void onPaused() {
    print('onPaused called');
  }

  @override
  void onResumed() {
    print('onResumed called');
  }
}
```

- GetView

lib/pages/getConnect/view.dart

```dart
class NewsView extends GetView<NewsController> {
  NewsView({Key? key}) : super(key: key);

  _buildListView(NewsPageListResponseEntity? state) {
    return ListView.separated(
      itemCount: state != null ? state.items!.length : 0,
      itemBuilder: (context, index) {
        final NewsItem item = state!.items![index];
        return ListTile(
          onTap: () => null,
          title: Text(item.title),
          trailing: Text("分类 ${item.category}"),
        );
      },
      separatorBuilder: (BuildContext context, int index) {
        return Divider();
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("GetConnect Page"),
      ),
      body: controller.obx(
        (state) => _buildListView(state),
        onEmpty: Text("onEmpty"),
        onLoading: Center(
          child: Column(
            children: [
              Text("没有数据"),
              ElevatedButton(
                onPressed: () {
                  controller.getNewsPageList();
                },
                child: Text('拉取数据'),
              ),
            ],
          ),
        ),
        onError: (err) => Text("onEmpty" + err.toString()),
      ),
    );
  }
}
```

- Bindings

lib/pages/getConnect/bindings.dart

```dart
class NewsBinding implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut<INewsProvider>(() => NewsProvider());
    Get.lazyPut<INewsRepository>(() => NewsRepository(provider: Get.find()));
    Get.lazyPut(() => NewsController(repository: Get.find()));
  }
}
```

- 路由

lib/common/routes/app_pages.dart

```dart
GetPage(
  name: AppRoutes.GetConnect,
  binding: NewsBinding(),
  page: () => NewsView(),
),
```

## StateMixin

![img](https://ducafecat.tech/2021/04/23/flutter-getx/flutter-getx-04-getconnect-statemixin-dio/GetContentStateMixin.png)

雷同代码不再重复

- 控制器 Mixin 如下

lib/pages/getConnect_stateMixin/controller.dart

```dart
class NewsStateMixinController extends GetxController
    with StateMixin<NewsPageListResponseEntity> {
  final NewsStateMixinProvider provider;
  NewsStateMixinController({required this.provider});

  // 拉取新闻列表
  Future<void> getNewsPageList() async {
    // 获取数据
    final Response response = await provider.getNews();

    // 判断，如果有错误
    if (response.hasError) {
      // 改变数据，传入错误状态，在ui中会处理这些错误
      change(null, status: RxStatus.error(response.statusText));
    } else {
      // 否则，存储数据，改变状态为成功
      var data = NewsPageListResponseEntity.fromJson(response.body);
      change(data, status: RxStatus.success());
    }
  }
}
```

> 这种方式确实简化了很多代码

## GetController + Dio

这种方式就是之前 [Flutter 新闻客户端](https://github.com/ducafecat/flutter_learn_news) 的写法，能复用原来的 dio 代码。

- dio 基础类

lib/common/utils/http.dart

```dart
/*
  * http 操作类
  *
  * 手册
  * https://github.com/flutterchina/dio/blob/master/README-ZH.md
  *
  * 从 3 升级到 4
  * https://github.com/flutterchina/dio/blob/master/migration_to_4.x.md
*/
class HttpUtil {
  static HttpUtil _instance = HttpUtil._internal();
  factory HttpUtil() => _instance;

  late Dio dio;

  HttpUtil._internal() {
    // BaseOptions、Options、RequestOptions 都可以配置参数，优先级别依次递增，且可以根据优先级别覆盖参数
    BaseOptions options = new BaseOptions(
      // 请求基地址,可以包含子路径
      baseUrl: SERVER_API_URL,

      // baseUrl: storage.read(key: STORAGE_KEY_APIURL) ?? SERVICE_API_BASEURL,
      //连接服务器超时时间，单位是毫秒.
      connectTimeout: 10000,

      // 响应流上前后两次接受到数据的间隔，单位为毫秒。
      receiveTimeout: 5000,

      // Http请求头.
      headers: {},

      /// 请求的Content-Type，默认值是"application/json; charset=utf-8".
      /// 如果您想以"application/x-www-form-urlencoded"格式编码请求数据,
      /// 可以设置此选项为 `Headers.formUrlEncodedContentType`,  这样[Dio]
      /// 就会自动编码请求体.
      contentType: 'application/json; charset=utf-8',

      /// [responseType] 表示期望以那种格式(方式)接受响应数据。
      /// 目前 [ResponseType] 接受三种类型 `JSON`, `STREAM`, `PLAIN`.
      ///
      /// 默认值是 `JSON`, 当响应头中content-type为"application/json"时，dio 会自动将响应内容转化为json对象。
      /// 如果想以二进制方式接受响应数据，如下载一个二进制文件，那么可以使用 `STREAM`.
      ///
      /// 如果想以文本(字符串)格式接收响应数据，请使用 `PLAIN`.
      responseType: ResponseType.json,
    );

    dio = new Dio(options);

    // Cookie管理
    CookieJar cookieJar = CookieJar();
    dio.interceptors.add(CookieManager(cookieJar));
  }

  /// restful get 操作
  Future get(
    String path, {
    dynamic? queryParameters,
    Options? options,
  }) async {
    var response = await dio.get(
      path,
      queryParameters: queryParameters,
      options: options,
    );
    return response.data;
  }
}
```

- api 定义

lib/common/apis/news.dart

```dart
/// 新闻
class NewsAPI {
  /// 翻页
  static Future<NewsPageListResponseEntity> newsPageList(
      {NewsRecommendRequestEntity? param}) async {
    var response = await HttpUtil().get(
      '/news',
      queryParameters: param?.toJson(),
    );
    return NewsPageListResponseEntity.fromJson(response);
  }
}
```

- 控制器

lib/pages/getController_dio/controller.dart

```dart
class NewsDioController extends GetxController {
  var newsPageList =
      Rx<NewsPageListResponseEntity>(NewsPageListResponseEntity());

  @override
  void onInit() {
    super.onInit();
    print("onInit");
  }

  @override
  void onClose() {
    super.onClose();
    print("onClose");
  }

  getPageList() async {
    newsPageList.value = await NewsAPI.newsPageList();
  }
}
```

## 嵌套导航

![img](https://ducafecat.tech/2021/05/09/flutter-getx/flutter-getx-05-nested-snack-dialog-bottom-lang-theme/2021-05-11-05-24-21.png)

几个 `Navigator` widget ，并排或者嵌套，他们是通过属性 `key` 来区分的，具体去哪里是通过 `onGenerateRoute` 实现的，在 getx 中 我们要把业务写到 `controller`中，状态切换用 `Obx` 控制 `BottomNavigationBar`，代码如下。

- lib/pages/nested_navigation/controller.dart

```dart
class NestedController extends GetxController {
  static NestedController get to => Get.find();

  var currentIndex = 0.obs;

  final pages = <String>['/list', '/detail', '/login'];

  void changePage(int index) {
    currentIndex.value = index;
    Get.toNamed(pages[index], id: 1);
  }

  Route? onGenerateRoute(RouteSettings settings) {
    if (settings.name == '/login')
      return GetPageRoute(
        settings: settings,
        page: () => LoginView(),
        transition: Transition.topLevel,
      );
    else if (settings.name == '/list')
      return GetPageRoute(
        settings: settings,
        page: () => ListIndexView(),
        transition: Transition.rightToLeftWithFade,
      );
    else if (settings.name == '/detail')
      return GetPageRoute(
        settings: settings,
        page: () => DetailView(),
        transition: Transition.fadeIn,
      );

    return null;
  }
}
```

- lib/pages/nested_navigation/binding.dart

```dart
class NestedBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => NestedController());
  }
}
```

- lib/pages/nested_navigation/index.dart

```dart
class NestedNavView extends GetView<NestedController> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("嵌套路由"),
      ),
      body: Container(
        color: Colors.amber,
        child: Column(
          children: [
            Container(
              child: Text("占位条"),
              height: 100,
            ),
            SizedBox(
              height: 300,
              child: Navigator(
                key: Get.nestedKey(1),
                initialRoute: '/list',
                onGenerateRoute: controller.onGenerateRoute,
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Obx(
        () => BottomNavigationBar(
          items: const <BottomNavigationBarItem>[
            BottomNavigationBarItem(
              icon: Icon(Icons.list),
              label: '列表',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.details),
              label: '详情',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.login),
              label: '登录',
            ),
          ],
          currentIndex: controller.currentIndex.value,
          selectedItemColor: Colors.pink,
          onTap: controller.changePage,
        ),
      ),
    );
  }
}
```

- lib/common/routes/app_pages.dart

```dart
GetPage(
  name: AppRoutes.NestedNavigator,
  page: () => NestedNavView(),
  binding: NestedBinding(),
),
```

## 多语言

![img](https://ducafecat.tech/2021/05/09/flutter-getx/flutter-getx-05-nested-snack-dialog-bottom-lang-theme/2021-05-11-05-30-52.png)

- 编写多语言字典

文件名格式 `[国家]_[语言].dart`

lib/common/lang/en_US.dart

```dart
const Map<String, String> en_US = {
  'title': 'This is Title!',
  'login': 'logged in as @name with email @email',
};
```

lib/common/lang/zh_Hans.dart

```dart
const Map<String, String> zh_Hans = {
  'title': '这是标题',
  'login': '登录用户 @name，邮箱账号 @email',
};
```

lib/common/lang/zh_HK.dart

```dart
const Map<String, String> zh_HK = {
  'title': '這是標題',
  'login': '登錄用戶 @name，郵箱賬號 @email',
};
```

- 继承 Translations

lib/common/lang/translation_service.dart

```dart
class TranslationService extends Translations {
  static Locale? get locale => Get.deviceLocale;
  static final fallbackLocale = Locale('en', 'US');
  @override
  Map<String, Map<String, String>> get keys => {
        'en_US': en_US,
        'zh_Hans': zh_Hans,
        'zh_HK': zh_HK,
      };
}
```

- 初始 GetMaterialApp

lib/main.dart

```dart
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      ...

      locale: TranslationService.locale,
      fallbackLocale: TranslationService.fallbackLocale,
      translations: TranslationService(),
    );
  }
}
```

`locale` 当前系统语言

`fallbackLocale` 如果找不到对应字典，默认值

`translations` 字典列表

- 切换 updateLocale

采用扩展操作符方式调用显示，点赞 `xxx.tr,`

切换语言 `Get.updateLocale`

```dart
"title -> " + 'title'.tr,

......

var locale = Locale('zh', 'HK');
Get.updateLocale(locale);
```

lib/pages/lang/index.dart

```dart
class LangView extends StatelessWidget {
  const LangView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("多语言"),
      ),
      body: Center(
        child: Column(
          children: [
            Text(
              "title -> " + 'title'.tr,
              style: TextStyle(fontSize: 24),
            ),
            Divider(),
            Text(
              "login -> " +
                  'login'.trParams(
                      {'name': 'ducafecat', 'email': 'ducafecat@gmail.com'})!,
              style: TextStyle(fontSize: 24),
            ),
            Divider(),
            ListTile(
              title: Text("切换语言"),
              subtitle: Text('zh-HK'),
              onTap: () {
                var locale = Locale('zh', 'HK');
                Get.updateLocale(locale);
              },
            ),
            ListTile(
              title: Text("切换语言"),
              subtitle: Text('zh-Hans'),
              onTap: () {
                var locale = Locale('zh', 'Hans');
                Get.updateLocale(locale);
              },
            ),
            ListTile(
              title: Text("切换语言"),
              subtitle: Text('en-US'),
              onTap: () {
                var locale = Locale('en', 'US');
                Get.updateLocale(locale);
              },
            ),
          ],
        ),
      ),
    );
  }
}
```

## 主题

![img](https://ducafecat.tech/2021/05/09/flutter-getx/flutter-getx-05-nested-snack-dialog-bottom-lang-theme/2021-05-11-05-45-18.png)

直接 `Get.changeTheme` 切换 `ThemeData` 数据。

```dart
onTap: () {
  Get.changeTheme(
      Get.isDarkMode ? ThemeData.light() : ThemeData.dark());
},
```

- lib/pages/theme/index.dart

```dart
class ThemeView extends StatelessWidget {
  const ThemeView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("主题"),
      ),
      body: Center(
        child: Column(
          children: [
            Container(
              height: 100,
              child: Align(
                  alignment: Alignment.center,
                  child: Text(
                    "是否黑色主题 -> " + Get.isDarkMode.toString(),
                    style: TextStyle(fontSize: 24),
                  )),
            ),
            Divider(),
            ListTile(
              title: Text("切换主题"),
              subtitle: Text('Get.changeTheme'),
              onTap: () {
                Get.changeTheme(
                    Get.isDarkMode ? ThemeData.light() : ThemeData.dark());
              },
            ),
          ],
        ),
      ),
    );
  }
}
```

## Snackbar

![img](https://ducafecat.tech/2021/05/09/flutter-getx/flutter-getx-05-nested-snack-dialog-bottom-lang-theme/2021-05-11-05-46-22.png)

- 调用

```dart
onTap: () => Get.snackbar(
  "标题",
  "消息",
),
```

- 参数

```dart
void snackbar<T>(
  String title,
  String message, {
  Color? colorText,
  Duration? duration,

  /// with instantInit = false you can put snackbar on initState
  bool instantInit = true,
  SnackPosition? snackPosition,
  Widget? titleText,
  Widget? messageText,
  Widget? icon,
  bool? shouldIconPulse,
  double? maxWidth,
  EdgeInsets? margin,
  EdgeInsets? padding,
  double? borderRadius,
  Color? borderColor,
  double? borderWidth,
  Color? backgroundColor,
  Color? leftBarIndicatorColor,
  List<BoxShadow>? boxShadows,
  Gradient? backgroundGradient,
  TextButton? mainButton,
  OnTap? onTap,
  bool? isDismissible,
  bool? showProgressIndicator,
  SnackDismissDirection? dismissDirection,
  AnimationController? progressIndicatorController,
  Color? progressIndicatorBackgroundColor,
  Animation<Color>? progressIndicatorValueColor,
  SnackStyle? snackStyle,
  Curve? forwardAnimationCurve,
  Curve? reverseAnimationCurve,
  Duration? animationDuration,
  double? barBlur,
  double? overlayBlur,
  SnackbarStatusCallback? snackbarStatus,
  Color? overlayColor,
  Form? userInputForm,
}) async {
```

## Dialog

![img](https://ducafecat.tech/2021/05/09/flutter-getx/flutter-getx-05-nested-snack-dialog-bottom-lang-theme/2021-05-11-05-48-41.png)

- 调用

```dart
onTap: () => Get.defaultDialog(
  title: "标题",
  content: Column(
    children: [
      Text("第1行"),
      Text("第2行"),
      Text("第3行"),
    ],
  ),
  textConfirm: "确认",
  textCancel: "取消",
  onConfirm: () => Get.back(),
),
```

- 参数

```dart
Future<T?> defaultDialog<T>({
  String title = "Alert",
  TextStyle? titleStyle,
  Widget? content,
  VoidCallback? onConfirm,
  VoidCallback? onCancel,
  VoidCallback? onCustom,
  Color? cancelTextColor,
  Color? confirmTextColor,
  String? textConfirm,
  String? textCancel,
  String? textCustom,
  Widget? confirm,
  Widget? cancel,
  Widget? custom,
  Color? backgroundColor,
  bool barrierDismissible = true,
  Color? buttonColor,
  String middleText = "Dialog made in 3 lines of code",
  TextStyle? middleTextStyle,
  double radius = 20.0,
  //   ThemeData themeData,
  List<Widget>? actions,

  // onWillPop Scope
  WillPopCallback? onWillPop,
}) {
```

## BottomSheet

![img](https://ducafecat.tech/2021/05/09/flutter-getx/flutter-getx-05-nested-snack-dialog-bottom-lang-theme/2021-05-11-05-49-55.png)

- 调用

```dart
  onTap: () => Get.bottomSheet(
    Container(
      height: 200,
      color: Colors.white,
      child: Column(
        children: [
          Text("第1行"),
          Text("第2行"),
          Text("第3行"),
        ],
      ),
    ),
  ),
),
```

- 参数

```dart
extension ExtensionBottomSheet on GetInterface {
  Future<T?> bottomSheet<T>(
    Widget bottomsheet, {
    Color? backgroundColor,
    double? elevation,
    bool persistent = true,
    ShapeBorder? shape,
    Clip? clipBehavior,
    Color? barrierColor,
    bool? ignoreSafeArea,
    bool isScrollControlled = false,
    bool useRootNavigator = false,
    bool isDismissible = true,
    bool enableDrag = true,
    RouteSettings? settings,
    Duration? enterBottomSheetDuration,
    Duration? exitBottomSheetDuration,
  }) {
```
