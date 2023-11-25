# 初始化 init

[导航](https://ducafecat.tech/categories/Flutter%E9%9B%B6%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E4%B8%AD%E6%96%87%E6%95%99%E5%AD%A6/)

[教学文档](https://ducafecat.tech/categories/Flutter%E9%9B%B6%E5%9F%BA%E7%A1%80%E5%85%A5%E9%97%A8%E4%B8%AD%E6%96%87%E6%95%99%E5%AD%A6/page/2/)

[文章合集](https://ducafecat.tech/page/3/)

[GetX Quick Start 代码](https://github.com/ducafecat/getx_quick_start)

[新闻客户端代码](https://github.com/ducafecat/flutter_learn_news)

[strapi 手册译文](https://getstrapi.cn)

- 安装 dart 的 sdk(可以跳过)

  - https://dart.cn/get-dart#release-channels
  - https://dart.dev/get-dart/archive

- 安装 java1.8，[链接](https://www.oracle.com/java/technologies/downloads/#jdk20-windows)，直接安装就行，会自动配置环境变量

- 安装 flutter 默认安装 dart 了

  - https://flutter.cn/docs/get-started/install/windows

  - https://docs.flutter.dev/development/tools/sdk/releases?tab=windows#windows

  - ```bash
    # Path 配置flutter的sdk
    D:\sdk\flutter\bin

    #增加两个环境变量
    FLUTTER_STORAGE_BASE_URL
    https://storage.flutter-io.cn

    PUB_HOSTED_URL
    https://pub.flutter-io.cn
    ```

  - **flutter doctor**检查配置

**android studio 注意项**

- 官网下载 https://developer.android.com/studio

- [模拟器](https://developer.android.com/studio/run/managing-avds?hl=zh-cn)

- 更改默认的 SDK 路径，Android studio 的 SDK 默认下载位置在`C:\Users\用户名\AppData\Local\Android\Sdk`文件夹下（找不到就在查看那里取消隐藏项目），**剪切**这个文件夹放到其他盘，然后在 FIle -> Settings -> Project Struture 修改 sdk 路径

- 配置环境变量

  - 新建系统变量 ANDROID_HOME(值为 SDK 文件夹位置),**Path**环境变量中添加`%ANDROID_HOME%\platform-tools`和`%ANDROID_HOME%\tools`, cmd 输入 adb --version 有反应就是设置成功了

  - ```bash
    # ANDROID_HOME
    D:\Android\Sdk

    # Path
    %ANDROID_HOME%\platform-tools
    %ANDROID_HOME%\tools
    ```

- SDK Tools 下载 Android SDK Command-line Tools

- **安装 Android 证书**，cmd 执行命令**flutter doctor --android-licenses**,全部 yes

- **plugins 下载 dart 和 flutter**,先下载 dart，然后下载 flutter，创建 flutter 项目,第一次创建项目的时候需要关联 flutter 的 sdk 文件夹路径

vscode 安装插件

- bloc
- flutter
- Awesome Flutter Snippets
- Paste JSON as Code
- 如果在 vscode 创建新的 flutter 项目时出现([VSCode Can't Find the PATH To the Flutter SDK](https://stackoverflow.com/questions/56845375/vscode-cant-find-the-path-to-the-flutter-sdk))，是因为你没有创建过 flutter 项目，所以 vscode 找不到 flutter 的 sdk，可以点击 local 指定 sdk 位置(不需要指到 bin 目录)
- 如果 vscode 运行 cmd 时遇到 flutter 命令无法识别的问题，可以重启 vscode，然后把所有的终端都删除，再打开一个终端尝试
- 连接 android studio 需要下载一个安卓模拟器，然后打开 vscode 下方点击 device,选择刚才下载的安卓模拟器(记得不要在 android studio 里面开机，不然会链接超时)
- 执行命令 flutter run 先下载依赖，然后在启动调试

**真机调试**

- Flutter 应用在真机上运行时，通常是通过连接到计算机上的开发者工具来进行调试的。当您在设备上切换到另一个应用程序时，您的 Flutter 应用会暂停并进入后台模式。这可能会导致开发者工具与 Flutter 应用之间的连接丢失，因为 Flutter 应用不再处于前台并且无法响应来自开发者工具的命令。为了避免这种情况，您可以在开发者工具中使用"**flutter attach**"命令来重新连接到 Flutter 应用程序。或者，您可以在设备上打开"开发者选项"并启用"保持活动"选项，这将使您的 Flutter 应用程序保持活动状态并继续运行，即使在后台运行时也能够响应开发者工具的命令。

  - flutter attach
  - 选择设备，然后再点击进入调试的 app

- 安卓
  - 链接数据线，选择文件传输，打开手机开发者选项(小米连续点击 miui 版本开启)，进入开发者选项打开 USB 调试
  - 命令行 flutter devices 查看手机 deviceId
  - flutter run -d <deviceId>

# Flutter 命令行

**flutter attach 和 flutter run 有什么区别**

`flutter run`和`flutter attach`都是用于在 Flutter 应用程序开发过程中启动和连接到运行中的应用程序的命令。

- `flutter run`命令用于启动 Flutter 应用程序，并在终端中输出应用程序的日志信息。在运行 Flutter 应用程序时，你可以在终端中看到 Flutter 框架的输出信息，包括构建过程、热重载、错误信息等。`flutter run`会将应用程序的日志信息输出到控制台，以便你可以实时查看和调试应用程序。

- `flutter attach`命令则用于连接到正在运行的 Flutter 应用程序，并在终端中输出应用程序的日志信息。当你在使用`flutter run`命令启动应用程序后，你可以使用`flutter attach`命令连接到正在运行的应用程序，以便在终端中查看和调试应用程序。`flutter attach`会将应用程序的日志信息输出到控制台，以便你可以实时查看和调试应用程序。

总的来说，`flutter run`和`flutter attach`都是用于启动和连接 Flutter 应用程序的命令，它们的区别在于：

- `flutter run`用于启动应用程序并输出日志信息；
- `flutter attach`用于连接到已经启动的应用程序并输出日志信息。
- **也就是真机里面如果没有安装过调试 app，那么运行 flutter run 可以重新安装运行应用，如果已经安装过了，那么直接运行 flutter attach 就可以了，无需重新安装，启动很快。如果改变涉及到静态资源，那么也需要重新安装应用 flutter run**

因此，如果你想启动 Flutter 应用程序并查看日志信息，应该使用`flutter run`命令；如果你想连接到正在运行的 Flutter 应用程序并查看日志信息，应该使用`flutter attach`命令。

```bash
#检查flutter状态，很重要能知道自己环境配置的问题。
flutter doctor
#获取模拟器列表（iOS、Android模拟器）
flutter emulators
#获取所有真机设备列表包括iOS模拟器
flutter devices
#将程序安装到连接中的设备上
flutter install
#升级flutter
flutter upgrade
#和flutter run类似,但是遇到静态资源（图片）加载的时候需要执行run命令重新加载资源
flutter attach
#运行指定模拟器或者真机
flutter run -d <deviceId>
    --hot 热重载方式启动 方便调试
        1) r 热重载(重载，程序中发生改变的state无法重置)
        2) R (shift+r)热重启(重新启动APP，程序中的state等全部重置)
            R和r的区别演示：默认程序计数器，点击数字变大，使用r热重载，数字不会重置
                          使用R热重启 则数字重置
        3) h 查看更多帮助
        4) d 结束终端，但不结束程序
        5) c 清空屏幕，但其实只是跳到底部 让你看不到上面的内容而已
        6) q 退出程序以及终端
#运行所有模拟器
flutter run -d all
#打包apk
flutter build apk
#打包ipa
flutter build ios
#查看命令的帮助信息
flutter help
#创建项目
flutter create -h
#获取(更新)当前Flutter项目中所依赖的所有包(即Flutter插件或Dart库)
flutter pub get
#命令清除Flutter项目的缓存，然后重新下载依赖
flutter clean
```

```bash
#安装全局依赖
flutter pub global activate [全局依赖]
#使用全局依赖
flutter pub global run [全局依赖]
#查看全局依赖
flutter pub global list
#下载开发环境依赖
flutter pub add --dev [依赖]
#删除依赖
flutter pub remove icon_font_generator
```

# Flutter 的开始

|      文件夹名称       |                      作用                      |
| :-------------------: | :--------------------------------------------: |
|        android        |              android 平台相关代码              |
|          ios          |                ios 平台相关代码                |
|          lib          |  flutter 相关代码，主要编写的代码放入该文件夹  |
|         test          |                用于存放测试代码                |
|     pubspec.yaml      | 配置文件，项目相关信息，一般存放第三方库的依赖 |
| analysis_options.yaml |              分析 dart 语法的文件              |

**入口文件/入口方法**

入口文件：flutter 项目的 lib 目录里面都有一个 main.dart 这个文件就是 flutter 的入口文件

入口方法：main.dart 文件中的

```cpp
void main() {
  runApp(MyApp());
}
//也可也简写一下
void main()=>runApp(MyApp());
```

**其中 main 方法是 dart 的入口方法。runApp 方法是 flutter 的入口方法。MyApp 是自定义的一个组件。**

**flutter 基本**

从最根本的开始

```java
import 'package:flutter/material.dart';

void main() {
  runApp(Center(
    child: Text(
      'CDX',
      textDirection: TextDirection.ltr,
    )
  ));
}
```

# Flutter 学习

## 常用组件

常用的 Flutter 组件及其简介，以表格形式呈现：

| 组件                  | 说明                         |
| --------------------- | ---------------------------- |
| AlertDialog           | 弹出对话框                   |
| SnackBar              | 底部提示信息                 |
| Image                 | 显示图片                     |
| Text                  | 显示文本                     |
| TextField             | 单行文本输入框               |
| TextFormField         | 带有表单验证的单行文本输入框 |
| RaisedButton          | 凸起的按钮                   |
| FlatButton            | 扁平的按钮                   |
| OutlineButton         | 带有边框的按钮               |
| IconButton            | 带有图标的按钮               |
| DropdownButton        | 带有下拉菜单的按钮           |
| PopupMenuButton       | 带有弹出菜单的按钮           |
| Card                  | 卡片                         |
| ListTile              | 列表项                       |
| Divider               | 分割线                       |
| Checkbox              | 复选框                       |
| Radio                 | 单选框                       |
| Switch                | 开关                         |
| Slider                | 滑动条                       |
| RangeSlider           | 区间滑动条                   |
| Stepper               | 步骤条                       |
| TabBar                | 标签栏                       |
| BottomNavigationBar   | 底部导航栏                   |
| Drawer                | 抽屉菜单                     |
| AppBar                | 应用栏                       |
| Scaffold              | 基本的页面结构               |
| SingleChildScrollView | 滚动视图                     |
| ListView              | 列表视图                     |
| GridView              | 网格视图                     |
| Wrap                  | 自动换行布局                 |
| Row                   | 水平布局                     |
| Column                | 垂直布局                     |
| Expanded              | 扩展布局                     |
| SizedBox              | 空白占位组件                 |
| Container             | 容器                         |
| Align                 | 对齐布局                     |
| Padding               | 填充                         |
| BoxDecoration         | 盒子装饰器                   |
| ClipOval              | 圆形裁剪                     |
| ClipRRect             | 矩形裁剪                     |
| Hero                  | 页面间动画效果               |
| FadeTransition        | 透明度动画                   |
| ScaleTransition       | 缩放动画                     |
| RotationTransition    | 旋转动画                     |
| AnimatedContainer     | 动态容器                     |
| AnimatedOpacity       | 动态透明度                   |
| AnimatedCrossFade     | 动态交叉淡入淡出             |
| TweenAnimationBuilder | 动画过渡组件                 |
| CustomPaint           | 自定义绘制                   |
| CustomScrollView      | 自定义滚动视图               |
| NotificationListener  | 监听通知                     |
| WillPopScope          | 返回键监听                   |
| InheritedWidget       | 共享数据                     |
| StreamBuilder         | 流式数据监听                 |
| FutureBuilder         | 异步数据监听                 |

| 组件                  | 描述         |
| --------------------- | ------------ |
| Text                  | 显示文本     |
| Image                 | 显示图片     |
| Icon                  | 显示图标     |
| RaisedButton          | 凸起按钮     |
| FlatButton            | 扁平按钮     |
| OutlineButton         | 带边框按钮   |
| IconButton            | 图标按钮     |
| TextField             | 文本输入框   |
| Checkbox              | 复选框       |
| Radio                 | 单选框       |
| Switch                | 开关         |
| Slider                | 滑块         |
| DropdownButton        | 下拉菜单     |
| PopupMenuButton       | 弹出菜单     |
| Stepper               | 步骤条       |
| Card                  | 卡片         |
| ListTile              | 列表瓦片     |
| Divider               | 分割线       |
| Spacer                | 空白间隔     |
| Expanded              | 扩展布局     |
| SizedBox              | 固定尺寸盒子 |
| Positioned            | 定位布局     |
| Stack                 | 层叠布局     |
| Wrap                  | 流式布局     |
| GridView              | 网格布局     |
| DataTable             | 数据表格     |
| SingleChildScrollView | 滚动布局     |
| SingleChildScrollView | 滚动布局     |
| PageView              | 页面滑动视图 |

## 启动页

为了提高 Flutter 应用的启动速度，你可以添加一个启动页（也称为“闪屏页”），它可以在应用加载和准备好之前显示一个占位符界面。

以下是一个简单的例子，演示如何创建一个启动页。这个启动页会显示一个应用 Logo，并在加载完成后自动跳转到主页。

```dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() {
  SystemChrome.setSystemUIOverlayStyle(
    SystemUiOverlayStyle(statusBarColor: Colors.transparent),
  );
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MyApp',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: SplashScreen(),
      routes: {
        '/home': (context) => MyHomePage(),
      },
    );
  }
}

class SplashScreen extends StatefulWidget {
  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(Duration(seconds: 3)).then((_) {
      Navigator.of(context).pushReplacementNamed('/home');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Image.asset('assets/images/logo.png'),
      ),
    );
  }
}

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('MyApp'),
      ),
      body: Center(
        child: Text('Welcome to MyApp!'),
      ),
    );
  }
}
```

在这个例子中，我们在 `MyApp` 的构造函数中设置了启动页 `SplashScreen` 为应用的首页。在 `SplashScreen` 的构造函数中，我们使用 `Future.delayed` 方法来模拟一个异步加载任务，并在任务完成后自动跳转到主页。在 `MyHomePage` 中，我们简单地显示了一个欢迎消息。

你可以根据实际需求和喜好来自定义你的启动页。比如，你可以在启动页中添加动画效果、引导用户完成设置等等。

## 自定义组件

在 flutter 中自定义组件其实就是一个类，这个类需要继承**StatelessWidget/StatefulWidget**。

StatelessWidget：是**无状态组件**，状态不可变的 widget。

StatefulWidget：是**有状态组件**，持有的状态可能在 widget 生命周期改变。

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

//自定义组件
class MyApp extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
        return Center(
            child: Text(
                'CDX111',
                textDirection: TextDirection.ltr,
                style: TextStyle(
                    fontSize: 40.0,
                    color: Colors.yellow,
                ),
            )
        );
    }
}
```

实现效果：

![img](https://upload-images.jianshu.io/upload_images/19663564-561916b0217ec876?imageMogr2/auto-orient/strip|imageView2/2/w/403/format/webp)

## MaterialApp

`MaterialApp` 是一个基础的 Material Design 应用程序的根组件，它包含了应用程序的一些基本属性和配置，例如主题、语言、路由和导航等。

在使用 `MaterialApp` 时，你可以为其指定一个 `home` 属性，用于指定默认的首页组件。例如：

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(
    MaterialApp(
      title: 'My App',
      home: MyHomePage(),
    ),
  );
}

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('My App'),
      ),
      body: Center(
        child: Text('Hello, World!'),
      ),
    );
  }
}
```

在这个例子中，我们使用 `MaterialApp` 创建了一个名为 `My App` 的应用程序，并将 `MyHomePage` 组件指定为默认的首页组件。在 `MyHomePage` 组件中，我们使用 `Scaffold` 和 `AppBar` 组件来创建一个包含标题栏的基础页面，并在页面中心显示了一段简单的文本。

除了 `home` 属性之外，`MaterialApp` 还包含许多其他的属性，例如 `theme`、`routes` 和 `locale` 等，它们可以用于配置应用程序的外观、行为和语言等属性。例如：

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(
    MaterialApp(
      title: 'My App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        accentColor: Colors.amber,
      ),
      routes: {
        '/': (context) => MyHomePage(),
        '/about': (context) => AboutPage(),
      },
      initialRoute: '/',
      onUnknownRoute: (settings) => MaterialPageRoute(builder: (context) => NotFoundPage()),
    ),
  );
}

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('My App'),
      ),
      body: Center(
        child: Text('Hello, World!'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.pushNamed(context, '/about'),
        child: Icon(Icons.info),
      ),
    );
  }
}

class AboutPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('About'),
      ),
      body: Center(
        child: Text('This is the about page.'),
      ),
    );
  }
}

class NotFoundPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Not Found'),
      ),
      body: Center(
        child: Text('404 Not Found'),
      ),
    );
  }
}
```

在这个例子中，我们指定了一个蓝色主题和一个琥珀色强调色，配置了两个路由 `/` 和 `/about`，并将默认路由设置为 `/`。我们还定义了一个 `FloatingActionButton`，用于导航到 `/about` 路由。如果用户输入一个未知的路由，我们将显示一个 `NotFoundPage` 页面。

## Scaffold

`Scaffold` 是一个基础的 Material Design 布局组件，它提供了应用程序中常见的基本布局元素，例如顶部应用栏、抽屉菜单、底部导航栏和浮动操作按钮等。

在使用 `Scaffold` 时，你可以通过指定不同的属性来配置它的外观和行为。下面是一个使用 `Scaffold` 组件的例子：

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(
    const MaterialApp(
      home: MyHomePage(),
    ),
  );
}

class MyHomePage extends StatelessWidget {
  const MyHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // 顶部应用栏
      appBar: AppBar(
        title: const Text('My App'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.more_vert),
            onPressed: () {},
          ),
        ],
      ),
      // 主要内容
      body: const Center(
        child: Text('Hello, World!'),
      ),
      // 左侧抽屉
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(
                color: Colors.blue,
              ),
              child: Text(
                'Drawer Header',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                ),
              ),
            ),
            ListTile(
              leading: Icon(Icons.favorite),
              title: Text('Favorites'),
              onTap: () {},
            ),
            ListTile(
              leading: Icon(Icons.settings),
              title: Text('Settings'),
              onTap: () {},
            ),
          ],
        ),
      ),
      // 浮动右下角按钮
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: Icon(Icons.add),
      ),
      // 底部导航栏
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite),
            label: 'Favorites',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
        onTap: (index) {},
      ),
    );
  }
}
```

在这个例子中，我们使用 `Scaffold` 创建了一个包含顶部应用栏、侧边抽屉菜单、底部导航栏和浮动操作按钮的基础页面。在顶部应用栏中，我们添加了一个搜索按钮和一个更多菜单按钮。在侧边抽屉菜单中，我们添加了两个列表项。在底部导航栏中，我们添加了三个条目，并使用 `currentIndex` 属性指定了当前选中的条目。在浮动操作按钮中，我们添加了一个加号图标，并在点击时执行了一个空操作。

除了上述示例中使用的属性之外，`Scaffold` 还提供了许多其他的属性和方法，例如 `backgroundColor`、`body`、`resizeToAvoidBottomInset` 和 `showSnackBar` 等，它们可以用于配置 `Scaffold` 组件的外观和行为。

## Container/Text

**Container**组件

该组件可以被用来看作是我们之前的一个 div

**Container**组件属性描述

| 属性名 | 类型 | 说明 |
| :-: | :-: | :-- |
| key | Key | Container 一标识符，用于查找更新 |
| alignment | AlignmentGeometry | 控制 child 的对齐方式，如果 Container 或者 Container 父节点尺寸大于 child 的尺寸，这个属性设置会起作用，有很多种对齐方式 |
| padding | EdgelnsetsGeometry | `EdgeInsets`：指定四个方向的偏移量，即左、上、右、下四个方向的边距值。 `EdgeInsets.only`：只指定某些方向的偏移量，其余方向偏移量为 0。 `EdgeInsets.symmetric`：指定水平和垂直方向的偏移量。 `EdgeInsets.all`：所有方向的偏移量均相等。 |
| color | Color | 用来设置 Contain 背景色，如果 foregroundDecoration 设置的话，可能会遮盖 color 效果 |
| decoration | Decoration | 绘制在 child 后面的装饰，设置了 Decoration 话，就不能设置 color 属性，否则会报错，此时应该在 Decoration 中进行颜色的设置 |
| foregroundDecoration | Decoration | 绘制在 child 前面的装饰 |
| width | double | Container 的宽度，设置为**double.infinity**可以强制在宽度上撑满，不设置，则根据 child 和父节点两者一起布局 |
| height | double | Container 的高度，设置为 double.infinity 可以强制在高度上撑满 |
| constraints | BoxConstraints | 添加到 child 上额外的约束条件 |
| margin | EdgelnsetsGeometry | 围绕在 Decoration 和 child 之外的空白区域，不属于内容区域 |
| transform | Matrix4 | 设置 Container 的变换矩阵，类型为 Matrix4 |
| child | Widget | Container 中的内容 Widget |

**Text**组件

Text 组件属性描述

|     属性名      |     类型      |      默认值       |                                     说明                                      |
| :-------------: | :-----------: | :---------------: | :---------------------------------------------------------------------------: |
|      data       |    String     |                   |                              数据为要显示的文本                               |
|    maxLines     |      int      |         0         |                              文本显示的最大行数                               |
|      style      |   TextStyle   |       null        |                 文本样式，可定义文本的字体大小、颜色、粗细等                  |
|    textAlign    |   TextAlign   | TextAlign.center  | 文本水平方向对齐方式，取值有 center、end、justify、left、right、start、values |
|  textDirection  | TextDirection | TextDirection.ltr |                   文本书写方向。ltr 从左到右，rtl 从右到左                    |
| textScaleFactor |    double     |        1.0        |                                 字体缩放系数                                  |
|    textSpan     |   TextSpan    |       null        |                                    文本块                                     |

**示例**

```dart
//自定义组件
class MyApp extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
        return MaterialApp(
            home: Scaffold(
                appBar: AppBar(
                    title: Text('flutter cdx'),
                ),
                body: HomeContent(),
            ),
            theme: ThemeData(
                primarySwatch: Colors.green,
            ),
        );
    }
}

class HomeContent extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
        return Center(
            child: Container(
                height: 200,
                width: 200,
                alignment: Alignment.center,
                transform: Matrix4.rotationZ(0.3),
                decoration: BoxDecoration(
                    color: Colors.green,
                    border: Border.all(color: Colors.blue, width: 2.0),
                    borderRadius: const BorderRadius.all(Radius.circular(150)),
                    boxShadow: const [BoxShadow(color: Colors.green, blurRadius: 20)]),
                child: const Text(
                    'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                    textAlign: TextAlign.center,
                    overflow: TextOverflow.fade,
                    style: TextStyle(
                        fontSize: 16.0,
                        color: Colors.red,
                        fontWeight: FontWeight.w700,
                        fontStyle: FontStyle.italic,
                        decoration: TextDecoration.lineThrough,
                        decorationColor: Colors.white,
                        decorationStyle: TextDecorationStyle.dashed),
                ),
            ));
    }
}
```

## 图片组件

**Image**组件属性描述

|       属性名       |     类型      |                                              说明                                              |
| :----------------: | :-----------: | :--------------------------------------------------------------------------------------------: |
|       image        | ImageProvider |                             抽象类，需要自己实现获取图片数据的操作                             |
|    width/height    |    double     |                                 Image 显示区域的宽度和高度设置                                 |
|        fit         |    Boxfit     |                                          图片填充模式                                          |
|       color        |     Color     |                                            图片颜色                                            |
|   colorBlendMode   |   BlendMode   | 在对图片进行手动处理的时候，可能会用到图片混合如改变图片的颜色。此属性可以对颜色进行混合处理。 |
|     alignment      |   Alignment   |                                       控制图片的摆放位置                                       |
|       repeat       |  ImageRepeat  |                                        设置图片重复模式                                        |
|    centerSlice     |     Rect      |                                     当图片需要被拉伸时使用                                     |
| matchTextDirection |     booI      |                                该属性与 Directionlity 配合使用                                 |
|  gaplessPlayback   |     bool      |             当 ImageProvide 发生变化后，重新加载图片的过程中，原图片的展示是否保留             |

**BoxFit**取值描述

|       取值       |                                      描述                                      |
| :--------------: | :----------------------------------------------------------------------------: |
|   Boxfit.fill    |                          全图显示，显示可能拉伸，充满                          |
|  Boxfit.contain  |                         全图显示，显示原比例，不需充满                         |
|  Boxfit. cover   |                          显示可能拉伸，可能裁剪，充满                          |
| BoxFit.fitWidth  |                        显示可能拉伸，可能裁剪，宽度充满                        |
| BoxFit.fitHeight |                        显示可能拉伸，可能裁剪，高度充满                        |
|   Boxfit.none    |                                    原始大小                                    |
| BoxFit.scaleDown | 效果和 BoxFit.contain 差不多，但是此属性不允许显示超过源图片大小，即可小不可大 |

在 Dart 中，Flutter 提供了一系列的图像组件用于加载和显示图片。以下是其中几个常用的图片组件及其用法：

- `Image.asset`是 Flutter 提供的一个 Widget，用于在应用程序中加载本地图片资源。它可以根据指定的图片路径，加载本地图片资源，并将其显示在界面上。

  使用`Image.asset`时，你需要提供一个字符串类型的图片路径，这个路径是相对于 Flutter 项目的根目录的。这个路径需要与在`pubspec.yaml`文件中声明的路径相匹配，以便 Flutter 应用程序可以正确地加载图片资源。

  下面是一个使用`Image.asset`加载本地图片资源的例子：

  - ```dart
    // 在pubspec.yaml文件中，添加以下代码来声明图片文件
    flutter:
      assets:
        - assets/images/

    // 使用
    Image.asset('assets/images/your_image_name.png',  width: 100,  height: 100,)
    ```

  - 除了上面提到的参数之外，`Image.asset`还提供了许多其他的参数，可以帮助你控制图片的显示效果，例如：

    - `alignment`: 用于控制图片在容器中的对齐方式。

    - `fit`: 用于控制图片如何适应容器大小，包括填充、缩放、拉伸等方式。

    - `repeat`: 用于控制图片在容器中的重复方式。

- `Image.network`: 用于从网络上加载图片。它需要一个字符串类型的参数来指定图片的 URL。例如：

```dart
class HomeContent extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
        return Center(
            child: Container(
                child: Image.network(
                    "https://picsum.photos/300/300",
                    colorBlendMode: BlendMode.screen,
                    fit: BoxFit.cover,
                ),
                width: 300,
                height: 300,
                decoration: BoxDecoration(
                    color: Colors.green,
                ),
            ),
        );
    }
}
```

- `Image.file`: 用于从文件系统中加载图片。它需要一个文件对象作为参数。例如：

```dart
Image.file(File('/path/to/my_image.png'))
```

这些组件都可以接受一些可选参数，以控制图片的大小、缩放方式、重复方式等。例如，可以使用 `fit` 参数来指定图片的缩放方式，它接受的值包括 `BoxFit.contain`、`BoxFit.cover`、`BoxFit.fill`、`BoxFit.fitHeight`、`BoxFit.fitWidth` 等。例如：

```dart
Image.asset(
  'assets/images/my_image.png',
  width: 200,
  height: 200,
  fit: BoxFit.cover,
)
```

- `Image.memory`: 用于从内存中加载图片，例如从网络上下载图片并缓存在内存中。它需要一个字节数组作为参数，表示图片数据。例如：

```dart
Image.memory(bytes)
```

- `ImageProvider`: 是一个抽象类，用于自定义图片的加载方式。它有许多子类，如 `AssetImage`、`NetworkImage`、`FileImage` 等，分别对应了从资源文件、网络、文件系统中加载图片的方式。你也可以继承 `ImageProvider` 类，自定义图片的加载方式。例如：

```dart
class MyImageProvider extends ImageProvider<MyImageProvider> {
  @override
  Future<MyImageProvider> obtainKey(ImageConfiguration configuration) {
    return SynchronousFuture<MyImageProvider>(this);
  }

  @override
  ImageStreamCompleter load(MyImageProvider key) {
    // 自定义图片加载逻辑
    return null;
  }
}

// 使用自定义的图片加载方式
Image(image: MyImageProvider())
```

1. `FadeInImage`: 用于显示渐变加载效果的图片。它需要一个占位符图片和一个目标图片的加载方式作为参数，会先显示占位符图片，然后渐变地将其替换为目标图片。例如：

```dart
FadeInImage(
  placeholder: AssetImage('assets/images/placeholder.png'),
  image: NetworkImage('https://example.com/my_image.png'),
)
```

以上是几个常用的图片组件及其用法，你可以根据实际需求选择使用。注意，由于图片资源可能比较大，因此在加载图片时要注意优化性能，避免出现卡顿和崩溃等问题。

### **实现圆角以及圆形图片**

- 使用`ClipRRect` Widget 来实现圆角图片。`ClipRRect`可以将子元素剪裁为一个圆角矩形，从而实现圆角效果。例如：

```dart
ClipRRect(
    borderRadius: BorderRadius.circular(10.0),
    child: Image.asset('assets/images/avatar.png'),
)
```

- 使用`BoxDecoration`来实现圆角或圆形图片。`BoxDecoration`是用于装饰`Container`的一个类，可以用来实现边框、背景色、阴影等效果。通过设置`BoxDecoration`的`borderRadius`属性，可以实现圆角效果。例如：

```dart
Container(
    margin: const EdgeInsets.fromLTRB(0, 200, 0, 0),
    height: 200,
    width: 200,
    decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10.0),
        image: DecorationImage(
            image: AssetImage('assets/images/avatar.png'),
            fit: BoxFit.cover,
        ),
  ),
)
```

- 使用`CircleAvatar` Widget 来实现圆形图片。`CircleAvatar`是一个预定义的 Widget，用于显示用户头像，可以轻松地实现圆形图片效果。例如：

```dart
CircleAvatar(
  radius: 50.0,
  backgroundImage: AssetImage('assets/images/avatar.png'),
)
```

- 直接使用`ClipOval` Widget 来实现圆形图片。`ClipOval`可以将子元素剪裁为一个圆形，从而实现圆形效果。例如：

```dart
class HomeContent extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
        return Center(
            child: Container(
                child: ClipOval(
                    height: 300,
                    width: 300,
                    fit: BoxFit.cover,
                    child: Image.network("https://picsum.photos/300/300",),
                ),
            ));
    }
}
```

总的来说，以上这几种方法都可以用来实现圆角或圆形图片效果，具体使用哪种方法取决于实际情况和个人喜好。

## Icon 图标

图标可以使用两种方式来显示：字体图标和图片图标

**字体图标**

字体图标是使用字体文件来显示图标的一种方式，它具有矢量性、高清晰度、可缩放性等优点。在 Flutter 中，可以使用内置的 Material Design 图标字体或自定义字体来显示图标。例如，使用内置的[Material Design](https://fonts.google.com/icons?icon.style=Filled)图标字体显示一个删除图标：

https://fluttericon.com/

```dart
Icon(
  Icons.delete,
  color: Colors.red,
  size: 24.0,
)
```

**图片图标**

图片图标是使用图像文件来显示图标的一种方式，它可以显示非矢量图像，例如 PNG、JPEG 等格式的图像。在 Flutter 中，可以使用`Image.asset()`、`Image.network()`等方式来加载图像文件，然后使用`Icon()` Widget 将其转换为图标显示。例如，使用一个 PNG 图片作为删除图标：

```dart
Icon(
  ImageIcon(
    AssetImage('assets/images/delete.png'),
    color: Colors.red,
    size: 24.0,
  )
)
```

总的来说，在 Flutter 中可以使用字体图标和图片图标两种方式来显示图标。字体图标具有矢量性、高清晰度、可缩放性等优点，而图片图标可以显示非矢量图像。

**自定义 icon**

- 阿里云下载 unicode 文件，解压缩，引入 iconfont.ttf 文件

- pubspec.yaml

  - ```dart
      fonts:
        - family: ZyIcon
          fonts:
            - asset: assets/fonts/al-iconfont.ttf
            - asset: assets/fonts/p-iconfont.ttf
    ```

- 创建 dart 类引入字体文件编码

  - ```dart
    import 'package:flutter/material.dart';

    @immutable
    class _OweIconsData extends IconData {
      const _OweIconsData(int codePoint)
          : super(
              codePoint,
              fontFamily: 'ZyIcon',
            );
    }

    class OweIcons {
        //0xe65c后4位可以查看iconfont.json文件或者直接在网址看，前面的0x是不变得
        static const IconData g = _OweIconsData(0xe65c);
    }
    ```

**svg 转换为 icon**

```dart
// pubspec.yaml
dev_dependencies:
  icon_font_generator:
    git:
      url: https://github.com/Gaurav192/icon_font_generator.git
      ref: file_path_fix
```

- 路径和目录一定要先创建对应的文件夹，如 assets/fonts/iconfont.ttf，可以没有 iconfont.ttf，但是要有 assets/fonts
- **--from** svg 图片存放路径
- **--class-name** 生成的 dart 的 class 类名字 、
- **--out-font** 输出字体文件的名字
- **--out-flutter** dart 文件生成路径

```dart
flutter pub run icon_font_generator --from=assets/images/svgs --class-name=UiIcons --out-font=assets/fonts/iconfont.ttf --out-flutter=lib/widgets/icons.dart
```

- **最后要在 pubspec.yaml 引入字体文件**, 重新启动命令**flutter run**

```dart
fonts:
    - family: Schyler
        fonts:
			- asset: assets/fonts/iconfont.ttf
```

**使用 icon**

```dart
import './widgets/icons.dart'; // svg转tff
import './widgets/oweIcons.dart'; // 自定义icon
class MyIcon extends StatelessWidget {
  const MyIcon({super.key});
  @override
  Widget build(BuildContext context) {
    print(UiIcons.g);
    return Column(
      children: const [
        Icon(UiIcons.aaa),
        Icon(
          OweIcons.g,
          color: Colors.amber,
        )
      ],
    );
  }
}
```

## generate 批量生成元素

```dart
return Scaffold(
    body: Center(
        child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 65, 20, 20),
            children: [
                Text(
                    'Features',
                    textAlign: TextAlign.center,
                    style: AppFonts.dancingScript.copyWith(fontSize: 32),
                ),
                const SizedBox(
                    height: 20,
                ),
                SizedBox(
                    width: setWidth(250),
                    child: const Text(
                        '好好学习因何而发生？',
                    ),
                ),
                ...List.generate(
                    3,
                    (index) => Column(children: [
                        const SizedBox(
                            height: 20,
                        ),
                        Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                                Container(
                                    width: setWidth(100),
                                    height: setWidth(100),
                                    decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(
                                            setWidth(10),
                                        ),
                                        image: const DecorationImage(
                                            image: NetworkImage(
                                                'https://picsum.photos/300/300',
                                            ),
                                            fit: BoxFit.cover,
                                        ),
                                    ),
                                ),
                                SizedBox(
                                    width: setWidth(20),
                                ),
                                const Expanded(
                                    flex: 1,
                                    child: Text(
                                        '就我个人来说，',
                                    ),
                                )
                            ],
                        ),
                    ]),
                ),
                SizedBox(
                    height: setHeight(20),
                ),
                FractionallySizedBox(
                    widthFactor: 0.5,
                    child: SizedBox(
                        height: setHeight(30),
                        child: ElevatedButton(
                            onPressed: () {},
                            child: const Text('Get started'),
                        ),
                    )),
            ],
        ),
    ),
);
```

## **列表组件**

Flutter 中有多种方式来实现列表，以下是其中一些常用的方式：

1. **ListView：ListView**是 Flutter 中最基本的列表控件，可以用来展示一个竖直方向的列表，支持滚动和分页，非常常用。ListView 可以通过构造函数来创建，也可以通过 ListView.builder 等工厂方法来创建。
2. **GridView：GridView**是 Flutter 中用来展示网格列表的控件，可以用来展示水平和竖直方向的网格列表，支持滚动和分页。GridView 也可以通过构造函数来创建，也可以通过 GridView.builder 等工厂方法来创建。
3. **CustomScrollView：CustomScrollView**是一个强大的滚动控件，它支持同时嵌套多种滚动控件，比如 ListView、GridView、SliverAppBar 等，可以实现复杂的滚动效果。
4. **ExpansionPanelList：ExpansionPanelList**是 Flutter 中用来展示可折叠列表的控件，可以用来展示一个竖直方向的列表，支持滚动和分页，点击某个列表项时可以展开或收起对应的子项。
5. **Table：Table**是 Flutter 中用来展示表格的控件，可以用来展示二维列表。Table 的构造函数需要传入一个 TableColumn 数组和一个 TableRow 数组，每个 TableColumn 对应一列，每个 TableRow 对应一行。

### **ListView 组件**

**ListView**是 Flutter 中非常常用的一个用于展示列表的组件，它可以根据数据动态生成一组滚动的列表元素，支持**横向和纵向**两种方向滚动，并且可以**设置子元素之间的间隔和列表元素的缓存**等。

在 Flutter 中，ListView 可以通过**ListView、ListView.builder、ListView.separated、ListView.custom**等几种方式进行创建。

|     属性名      |        类型        |    默认值     |                                     说明                                     |
| :-------------: | :----------------: | :-----------: | :--------------------------------------------------------------------------: |
| scrollDirection |        Axis        | Axis.vertical | 列表的排列方向，Axis.vertical 为垂直方法式默认值，Axis.horizontal 为水平方法 |
|     padding     | EdgelnsetsGeometry |               |        列表内部的空白区域，如果有 child 的话，child 位于 padding 内部        |
|     reverse     |        bool        |     false     |                                 组件排列反向                                 |
|    children     |        List        |               |                    列表元素，注意 List 元素全部为 Widget                     |

ListView 最简单的用法就是直接将所有的列表元素一次性创建出来，然后将它们放在 ListView 中进行展示，这种方式适用于列表元素数量不是很大的情况下。

```dart
ListView(
  children: <Widget>[
    ListTile(title: Text('item 1')),
    ListTile(title: Text('item 2')),
    ListTile(title: Text('item 3')),
    // ...
    ListTile(title: Text('item n')),
  ],
)
```

**ListView 排列方向为垂直(水平)的时候，设置 listView 里面的 container 的宽度(高度)是没有用的，会自适应**。

当`ListView`的排序方向为垂直时，列表项的宽度通常是自适应的，并且无法手动指定。这是因为`ListView`的垂直排序方向在宽度上是无限制的，每个列表项都需要自适应其所占用的宽度，以确保不会出现内容截断或溢出。

如果您希望在`ListView`的垂直排序方向上指定固定的宽度，可以尝试使用`Container`或`SizedBox`组件作为列表项的父组件，并在其中设置宽度属性。例如：

```dart
ListView.builder(
  itemCount: myList.length,
  itemBuilder: (context, index) {
    return SizedBox(
      width: 200, // 设置固定宽度
      child: ListTile(
        title: Text(myList[index]),
      ),
    );
  },
);
```

请注意，这种方法仅在您确定每个列表项需要的固定宽度时才适用。如果您的列表项需要根据内容动态调整宽度，请使用自适应的方式布局。

**ListView 横向滚动**

要实现横向滚动，可以在 ListView 外部包裹一个 SingleChildScrollView，然后将 ListView 作为 SingleChildScrollView 的子元素，设置水平方向的滚动即可。

```dart
SingleChildScrollView(
  scrollDirection: Axis.horizontal,
  child: ListView.builder(
    scrollDirection: Axis.horizontal,
    itemCount: 20,
    itemBuilder: (BuildContext context, int index) {
      return Container(
        width: 100.0,
        height: 100.0,
        color: Colors.blue,
        margin: EdgeInsets.all(10.0),
        child: Center(
          child: Text(
            'Item $index',
            style: TextStyle(color: Colors.white),
          ),
        ),
      );
    },
  ),
);
```

**ListView.builder 动态列表和缓存**

如果列表元素的数量非常大，我们可以使用 ListView.builder 动态生成子元素，它会在子元素需要显示时动态创建，从而避免创建过多的子元素，减少内存的消耗。

实现缓存，可以使用 ListView.builder 并设置 itemCount 属性，这样 Flutter 会根据 itemCount 的值预先创建一定数量的 widget，当滑动到新的区域时，Flutter 会回收之前的 widget 并重新创建新的 widget，从而达到缓存的效果。在 ListView.builder 中，我们还可以通过设置 itemExtent 属性来固定每个子元素的高度（或宽度），这样可以优化性能，避免 Flutter 不断计算每个子元素的高度（或宽度）。

```dart
ListView.builder(
    itemCount: 100,
    itemExtent: 100.0,
    itemBuilder: (BuildContext context, int index) {
        return ListTile(title: Text('item $index'));
    },
)
```

**ListView.separated**

ListView.separated 在 ListView.builder 的基础上提供了分隔符，即在列表元素之间添加指定的分隔符。我们可以通过 separatorBuilder 参数来设置分隔符。

```dart
ListView.separated(
  itemCount: 100,
  separatorBuilder: (BuildContext context, int index) => Divider(),
  itemBuilder: (BuildContext context, int index) {
    return ListTile(title: Text('item $index'));
  },
)
```

**ListView.custom**

如果以上方式还无法满足我们的需求，我们可以使用 ListView.custom 自定义列表元素的生成方式，这样我们可以根据具体的需求来生成子元素，包括懒加载等等。

```dart
ListView.custom(
  childrenDelegate: SliverChildBuilderDelegate(
    (BuildContext context, int index) {
      return ListTile(title: Text('item $index'));
    },
    childCount: 100,
  ),
)
```

**ListView 还有其他一些常用的属性和方法：**

1. scrollDirection：设置滚动方向，默认为垂直方向，可以设置为水平方向。
2. controller：设置一个 ScrollController，可以用于监听列表滚动事件、控制列表滚动位置等。
3. physics：设置列表的滚动物理属性，比如滚动到边缘时的反弹效果等。
4. padding：设置列表的内边距。
5. separatorBuilder：设置列表中每个元素之间的分隔符。
6. itemCount：设置列表的总项数，如果是动态列表可以用 builder 属性来构建。
7. itemBuilder：用于构建每个列表项的函数，可以通过该函数将数据转化为对应的 widget。

下面是一个 ListView 的示例代码：

```dart
ListView(
  scrollDirection: Axis.vertical,
  controller: _scrollController,
  physics: BouncingScrollPhysics(),
  padding: EdgeInsets.all(16.0),
  separatorBuilder: (context, index) => Divider(),
  itemCount: items.length,
  itemBuilder: (BuildContext context, int index) {
    return ListTile(
      leading: CircleAvatar(
        backgroundImage: NetworkImage(items[index].avatarUrl),
      ),
      title: Text(items[index].name),
      subtitle: Text(items[index].description),
      trailing: Icon(Icons.arrow_forward),
      onTap: () {
        // 处理列表项点击事件
      },
    );
  },
)
```

在该代码中，我们设置了垂直方向滚动、使用一个 ScrollController 来监听滚动事件、使用 BouncingScrollPhysics 来控制滚动物理效果、设置了一个内边距为 16.0、设置了一个分隔符为 Divider、设置了总项数为 items.length、使用 itemBuilder 函数构建了每个列表项，并在列表项中使用了 CircleAvatar、Text、Icon 等 widget。

**矩阵式的列表**

通过`ListView`来实现。假设我们要实现一个 $3\times3$ 的矩阵列表，可以按照以下步骤进行：

1. 构造一个包含所有列表项的`List`，这里我们假设要构造一个包含 $9$ 个元素的列表：

   ```dart
   List<String> items = [
     "Item 1",
     "Item 2",
     "Item 3",
     "Item 4",
     "Item 5",
     "Item 6",
     "Item 7",
     "Item 8",
     "Item 9",
   ];
   ```

2. 在`ListView.builder`中，设置`itemCount`为列表项总数（这里是 $9$）。

3. 在`ListView.builder`的`itemBuilder`中，使用`GridView.count`来构建一个 $3\times3$ 的矩阵，并将每个列表项放置到对应的位置上：

   ```dart
   lessCopy codeListView.builder(
     itemCount: items.length,
     itemBuilder: (context, index) {
       return GridView.count(
         shrinkWrap: true,
         crossAxisCount: 3,
         children: List.generate(
           3,
           (i) => Card(
             child: Center(
               child: Text(items[index + i * 3]),
             ),
           ),
         ),
       );
     },
   )
   ```

   这里使用了`List.generate`来生成每行的子项。注意，由于在每行中放置了 $3$ 个元素，因此需要在计算索引时，将`index`乘以 $3$，再加上当前行中的偏移量$i$。

完整代码示例如下：

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  final List<String> items = [    "Item 1",    "Item 2",    "Item 3",    "Item 4",    "Item 5",    "Item 6",    "Item 7",    "Item 8",    "Item 9",  ];

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      home: Scaffold(
        appBar: AppBar(title: Text('Matrix List')),
        body: ListView.builder(
          itemCount: items.length,
          itemBuilder: (context, index) {
            return GridView.count(
              shrinkWrap: true,
              crossAxisCount: 3,
              children: List.generate(
                3,
                (i) => Card(
                  child: Center(
                    child: Text(items[index + i * 3]),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
```

**后端返回数据量非常大的列表，而不确定数量**

为了优化性能，不能直接把所有数据一次性加载到内存中并显示出来。这时候，可以采用分页的方式来显示数据，即每次只加载一页数据，滑动到底部时再加载下一页的数据。

在 Flutter 中，可以使用 ListView 和 ListView.builder 来实现分页加载数据。下面是一个简单的示例代码：

```dart
class LargeListPage extends StatefulWidget {
  @override
  _LargeListPageState createState() => _LargeListPageState();
}

class _LargeListPageState extends State<LargeListPage> {
  final _scrollController = ScrollController();
  List<String> _data = [];
  int _pageIndex = 1;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _loadData();
    _scrollController.addListener(() {
      if (_scrollController.position.pixels ==
          _scrollController.position.maxScrollExtent) {
        _loadData();
      }
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Large List'),
      ),
      body: _loading
          ? Center(
              child: CircularProgressIndicator(),
            )
          : ListView.builder(
              controller: _scrollController,
              itemCount: _data.length,
              itemBuilder: (BuildContext context, int index) {
                return ListTile(
                  title: Text('Item ${_data[index]}'),
                );
              },
            ),
    );
  }

  Future<void> _loadData() async {
    if (_loading) {
      return;
    }
    setState(() {
      _loading = true;
    });
    try {
      final result = await fetchData(pageIndex: _pageIndex);
      _data.addAll(result);
      _pageIndex++;
    } catch (e) {
      // handle error
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  Future<List<String>> fetchData({int pageIndex}) async {
    // fetch data from backend API
    // you can use http package or other networking libraries
    // the data should be in the form of List<String>
  }
}
```

在这个例子中，我们首先定义了一个 ListView.builder，它会根据\_data 中元素的数量来动态创建列表项。我们使用一个 ScrollController 来监听 ListView 的滚动事件，当滑动到底部时，我们会调用\_loadData()方法来加载下一页的数据。在\_loadData()方法中，我们首先设置\_loading 标志为 true，然后调用 fetchData()方法来获取数据，并将结果添加到\_data 列表中。最后，我们设置\_loading 标志为 false，告诉 Flutter 框架我们已经完成了数据的加载。

注意，为了避免频繁的网络请求和渲染，我们可以使用一个 loading 标志来防止重复的加载。另外，如果后端返回的数据量非常大，我们也可以在 fetchData()方法中限制返回的数据量，以避免内存占用过高。

### GridView 组件

Flutter 提供了许多用于创建网格布局的组件和属性，以下是其中几种：

1. GridView.count - 创建具有等宽等高的网格布局，其行和列的数量是固定的。
2. GridView.builder - 用于在构建大型网格列表时创建网格布局，它可以根据需要动态地创建和回收网格。
3. GridView.extent - 与 GridView.count 类似，但是可以指定每个网格项目的最大宽度，而不是固定的宽度。

**组件属性及描述**

| 属性 | 描述 |
| --- | --- |
| `scrollDirection` | 指定网格的滚动方向，可以是 `Axis.horizontal` 或 `Axis.vertical`。 |
| crossAxisCount | 指定每行或每列的项目数。(适用于 GridView.count) |
| maxCrossAxisCount | 横轴子元素的最大长度。(适用于 GridView.extent) |
| mainAxisSpacing | 垂直子 Widget 之间间距(指定主轴方向上网格项目的间距) |
| crossAxisSpacing | 水平子 Widget 之间间距(指定交叉轴方向上网格项目的间距) |
| childAspectRatio | 指定每个网格项目的宽高比。 |
| `reverse` | 如果为 `true`，则网格将按相反顺序排列。 |
| `controller` | 控制网格滚动的对象。 |
| `primary` | 如果为 `true`，则在嵌套 `ScrollView` 中使用网格时，网格将优先于父滚动视图响应垂直手势。 |
| `physics` | 指定网格的滚动行为。可以是 `ScrollPhysics` 类的任何子类，如 `BouncingScrollPhysics`、`ClampingScrollPhysics` 等。 |
| `shrinkWrap` | 如果为 `true`，则网格将根据内容缩小，否则它将尽可能地扩展以填充可用空间。 |
| `cacheExtent` | 指定滚动视图在滚动时缓存区域的范围。 |
| `padding` | 指定网格布局的内边距。 |
| `gridDelegate` | 用于确定网格布局的大小和位置的委托对象，必须是 `SliverGridDelegateWithXXX` 类的子类。 |
| `clipBehavior` | 定义如何剪切网格视图的内容。 |
| `restorationId` | 用于恢复滚动位置的标识符。 |
| `keyboardDismissBehavior` | 定义当用户滚动网格时键盘应如何关闭。可以是 `ScrollViewKeyboardDismissBehavior.manual`、`ScrollViewKeyboardDismissBehavior.onDrag` 或 `ScrollViewKeyboardDismissBehavior.onScroll`。 |
| `children` | 包含在网格布局中的子项列表。 |

**通过封装的网格组件实现网格布局**

```dart
class MyIcon extends StatelessWidget {
  MyIcon({super.key});
  final List<Widget> icons =
      List.generate(15, (index) => const Icon(UiIcons.avatar));

  Widget getData(BuildContext context, int index) {
    return Container(
      decoration: const BoxDecoration(color: Colors.cyanAccent),
      child: icons[index],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        height: 600,
        width: 500,
        decoration: const BoxDecoration(color: Colors.pink),
        child: Center(
          child: MyGridView.extent(
              itemCount: icons.length,
              itemBuilder: getData,
              maxCrossAxisExtent: 50,
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              padding: const EdgeInsets.all(10)),
        ));
  }
}
```

## 页面布局

### **Padding**组件

在 html 中常见的布局标签都有 padding 属性，但是 Fliuuter 中很多 widget 是没有 padding 属性的。这时候我们可以用 Padding 组件处理容器与子元素之间的间距

|  属性   |                 说明                 |
| :-----: | :----------------------------------: |
| padding | padding 值，EdgeInsetss 设置填充的值 |
|  child  |                子组件                |

代码：

```dart
class Demo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GridView.count(
      padding: EdgeInsets.fromLTRB(0, 0, 10, 0),
      crossAxisCount: 3, //控制一行有多少个Widget
      childAspectRatio: 1.7,//宽度和高度的比例
      children: <Widget>[
        Padding(
          padding: EdgeInsets.fromLTRB(10, 10, 0, 0),
          child: Image.asset("images/1.jpg",fit: BoxFit.cover,),
        ),
      ],
    );
  }
}
```

### **Row**水平和 Column 垂直组件

属性介绍：

|        属性        |      说明      |
| :----------------: | :------------: |
| mainAxisAlignment  | 主轴的排序方式 |
| crossAxisAlignment | 次轴的排序方式 |
|      children      |   组件子元素   |

- `MainAxisAlignment.start`：主轴上子组件靠近起始边缘排列。
- `MainAxisAlignment.end`：主轴上子组件靠近结束边缘排列。
- `MainAxisAlignment.center`：主轴上子组件居中排列。
- `MainAxisAlignment.spaceBetween`：主轴上子组件均匀分布，相邻子组件间距相等。
- `MainAxisAlignment.spaceAround`：主轴上子组件均匀分布，子组件两侧间距相等。
- `MainAxisAlignment.spaceEvenly`：主轴上子组件均匀分布，包括子组件两侧和子组件之间的间距都相等。

```dart
class Demo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 600.0,
      width: 600.0,
      child:Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[Icons.home],
    )
    );
  }
}
```

### Flex 布局

Flutter 中的`Flex`组件是一种灵活的容器，可以在水平和垂直方向上按比例分配子组件的空间。它类似于 Web 开发中的 Flex 布局。

`Flex`组件有两种模式：水平模式和垂直模式。在水平模式下，`Flex`容器中的子组件按照水平方向排列，可以通过设置`mainAxisAlignment`属性来控制子组件在水平方向上的对齐方式；在垂直模式下，`Flex`容器中的子组件按照垂直方向排列，可以通过设置`crossAxisAlignment`属性来控制子组件在垂直方向上的对齐方式。

`Flex`组件中的子组件可以使用`Expanded`组件来占据剩余空间，`Expanded`组件类似于 Web 开发中的 Flex 布局中的`flex-grow`属性。在水平模式下，`Expanded`组件可以控制子组件在水平方向上占据的空间比例；在垂直模式下，`Expanded`组件可以控制子组件在垂直方向上占据的空间比例。

除了`Expanded`组件，`Flexible`组件也可以用来控制子组件的空间分配。不同的是，`Expanded`组件会占据所有的剩余空间，而`Flexible`组件只会占据所需的空间。

`Flex`组件的常用属性如下：

- direction：控制子组件的排列方向，取值为`Axis.horizontal`或`Axis.vertical`；
- mainAxisAlignment：控制子组件在主轴方向上的对齐方式；
- crossAxisAlignment：控制子组件在交叉轴方向上的对齐方式；
- mainAxisSize：控制`Flex`容器在主轴方向上的尺寸，取值为`MainAxisSize.min`或`MainAxisSize.max`；
- textDirection：控制文本的排列方向；
- verticalDirection：控制子组件在垂直方向上的排列顺序。

```dart
Flex(
  direction: Axis.horizontal,
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
  children: <Widget>[
    Expanded(
      child: Container(
        color: Colors.blue,
        height: 50,
      ),
      flex: 1,
    ),
    Expanded(
      child: Container(
        color: Colors.green,
        height: 50,
      ),
      flex: 2,
    ),
  ]
)
```

### Warp 组件

Flutter 中的 Wrap 组件是一个可以自动换行的容器，它可以将其子组件按照一定规则自动排列，并可以根据需要自动换行。当一行排列不下组件时，Wrap 会自动换行到下一行继续排列。Wrap 的布局规则与 Flex 类似，但是它会自动换行。

|        属性        |                                            说明                                            |
| :----------------: | :----------------------------------------------------------------------------------------: |
|     direction      |                                    主轴的方法，默认水平                                    |
|     alignment      |                                       主轴的对齐方式                                       |
|      spacing       |                                      主轴方向上的间距                                      |
| crossAxisAlignment |                                 子组件在交叉轴上的对齐方式                                 |
|   textDirection    |                                          文本方向                                          |
| verticalDirection  |                定义了 children 摆放顺序，默认是 down，见 flex 相关属性介绍                 |
|    runAlignment    | run 的对齐方式。run 可以理解为新的行或者列，如果是水平方向布局的话，run 可以理解为新的一行 |
|     runSpacing     |                                         run 的间距                                         |

wrap 组件可以实现流布局，单行的 Wrap 跟 Column 表现几乎一致，单列的 Wrap 则跟 Row 表现几乎一致。但 Row 与 Column 都是单行单列，Wrap 则突破了这个限制，mainAxis 上空间不足时，则向 crossAxis 上去扩展显示

```dart
Wrap(
  spacing: 8.0,
  runSpacing: 4.0,
  children: <Widget>[
    Chip(
      label: Text('Apple'),
      backgroundColor: Colors.orangeAccent,
    ),
    Chip(
      label: Text('Banana'),
      backgroundColor: Colors.yellowAccent,
    ),
    Chip(
      label: Text('Cherry'),
      backgroundColor: Colors.pinkAccent,
    ),
    Chip(
      label: Text('Durian'),
      backgroundColor: Colors.greenAccent,
    ),
    Chip(
      label: Text('Eggplant'),
      backgroundColor: Colors.purpleAccent,
    ),
    Chip(
      label: Text('Fig'),
      backgroundColor: Colors.brown,
    ),
  ],
)
```

### Expanded 组件

- Expanded 可以用在**Row 和 Column 布局**中。
- Flutter 中 Expanded 组件类似 Web 中的 Flex 布局，用于给子组件分配可用空间的比例。在 Flex 布局中，可以通过`flex-grow`属性来设置弹性伸缩，而在 Flutter 中，可以使用`Expanded`组件来实现相似的效果。`Expanded`组件可以将父组件中剩余的空间分配给它包含的子组件，从而实现子组件的弹性伸缩。使用`Expanded`组件需要注意的是，它必须包含在一个可伸缩的父组件中，比如`Row`、`Column`或`Flex`等。
- 当父组件在水平或垂直方向上有剩余空间时，`Expanded` 组件会占用其中一部分空间，并根据指定的比例分配给子组件。如果多个 `Expanded` 组件共存，它们会按照指定的比例分配剩余空间。如果没有剩余空间，`Expanded` 组件会将其子组件的大小拉伸以填满可用空间。

| 属性  |              说明              |
| :---: | :----------------------------: |
| flex  | 元素占整个父 Row/Column 的比例 |
| child |             子元素             |

代码：（未包含上述 IconDemo 组件的代码）

```dart
Row(
  children: [
    Container(
      color: Colors.red,
      height: 50,
      width: 50,
    ),
    Expanded(
      child: Container(
        color: Colors.green,
        height: 50,
      ),
      flex: 2,
    ),
    Container(
      color: Colors.blue,
      height: 50,
      width: 50,
    ),
  ],
)
```

在这个示例中，`Row` 组件包含三个子组件：一个红色的 `Container` 组件，一个绿色的 `Expanded` 组件和一个蓝色的 `Container` 组件。在红色和蓝色 `Container` 组件之间，绿色 `Expanded` 组件占用了所有剩余空间，并将其子组件的大小调整为剩余空间的 2/3。这个例子中的 `flex` 参数为 2，这意味着 `Expanded` 组件将会占用剩余空间的 2/3，而其他两个 `Container` 组件将会占用剩余空间的 1/3。如果没有指定 `flex` 参数，`Expanded` 组件将默认分配相同的比例。

需要注意的是，`Expanded` 组件只能在可以分配额外空间的容器中使用，例如 `Row`，`Column`，`Flex` 等。如果父容器已经达到其最大尺寸，`Expanded` 组件将不会起作用。

### Position 布局

#### **Stack 层叠**组件

在 Flutter 中，`Stack`是一种层叠的布局组件，可以让子组件进行层叠显示，类似于 Web 中的绝对定位。`Stack`布局中的子组件可以通过指定相对位置来进行排列，并且可以设置子组件的大小、对齐方式等属性。**后面的子元素会覆盖前面的子元素**。常用的属性有：

- `alignment`：子组件的对齐方式，可选值为`Alignment`。如果子组件也设置了这个属性，优先子组件。
- `fit`：子组件的布局方式，可选值为`StackFit`，默认值为`loose`。 未定位 widget 占满 Stack 整个空间(StackFit.expand,)
- `overflow`：当子组件大小超过`Stack`大小时的处理方式，可选值为`Overflow`，默认值为`visible`。

`Stack`中的子组件可以使用`Positioned`来指定其相对位置。`Positioned`有以下属性：

- `top`：距离父组件顶部的距离。
- `right`：距离父组件右边的距离。
- `bottom`：距离父组件底部的距离。
- `left`：距离父组件左边的距离。
- `width`：子组件的宽度。
- `height`：子组件的高度。

stack 效果：有点像元素重叠一样，下面展示文字和容器效果

#### Pitioned 组件

```dart
class MyStack extends StatelessWidget {
  const MyStack({super.key});
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 600,
      color: Colors.amber,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // 没有绝对定位，但是可以层叠到上面
          Container(
            width: 200,
            height: 200,
            color: Colors.blue,
          ),
          const Align(
              alignment: Alignment.bottomLeft,
              child: Text(
                'Hello, worldsss!',
              )),
          const Positioned(
            top: 100,
            child: Text(
              'Hello, world!',
              style: TextStyle(fontSize: 24, color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }
}

```

## 按钮组件

### 常用属性

| 属性 | 作用与用法 | Raised Button | Flat Button | Outline Button | IconButton | TextButton |
| --- | --- | --- | --- | --- | --- | --- |
| onPressed | 点击事件回调 | 是 | 是 | 是 | 是 | 是 |
| child | 按钮内部的 Widget | 是 | 是 | 是 | 是 | 是 |
| color | 按钮背景颜色 | 是 |  |  |  | 是 |
| disabledColor | 按钮禁用时背景颜色 | 是 |  |  |  | 是 |
| textColor | 按钮文本颜色 | 是 | 是 | 是 | 是 | 是 |
| disabledTextColor | 按钮禁用时文本颜色 | 是 | 是 | 是 | 是 | 是 |
| padding | 按钮内部的填充 | 是 | 是 | 是 | 是 | 是 |
| shape | 按钮的形状 | 是 | 是 | 是 | 是 | 是 |
| elevation | 按钮的海拔高度，影响按钮的阴影效果，值越大，阴影越浅，因为很高 | 是 |  |  |  |  |
| highlightElevation | 按钮被按下时的海拔高度，影响按钮被按下时的阴影效果 | 是 |  |  |  |  |

- 基本上按钮都可以带图标，例如**ElevatedButton.icon**，换个构造函数就好了
- 按钮组件本身没有设置宽高的属性，可以在外面套一下 container 和 sizebox 组件设置宽高

Flutter 中有多种不同类型的按钮组件，可以根据需要选择适合的组件。以下是一些常用的 Flutter 按钮组件：

1. `ElevatedButton`：凸起的按钮，通常用于主要操作。
2. `TextButton`：只包含文本的按钮，通常用于次要操作。
3. `OutlinedButton`：带边框的按钮，通常用于不那么重要的操作。
4. `IconButton`：带图标的按钮，通常用于小型操作或菜单按钮。
5. `DropdownButton`：下拉菜单按钮，可以选择一个选项。
6. `PopupMenuButton`：弹出菜单按钮，可以显示多个选项。
7. `ToggleButton`：切换按钮，可以切换选项的状态。

每种按钮组件都有不同的属性和用途。例如，可以使用`onPressed`属性来指定按下按钮时调用的函数，使用`style`属性来设置按钮的样式，使用`icon`属性来设置按钮中显示的图标等。

需要根据具体的需求选择最合适的按钮组件。例如，如果需要一个常规的按钮，可以使用`ElevatedButton`或`TextButton`，如果需要一个带图标的按钮，可以使用`IconButton`，如果需要一个下拉菜单按钮，可以使用`DropdownButton`等。

### ElevatedButton

`ElevatedButton`是一种凸起的按钮，通常用于主要操作。该组件的外观通常是一个矩形，带有阴影和填充颜色，可以设置按钮的文字、样式和功能等属性。以下是一些常用的属性：

- `onPressed`：按下按钮时调用的函数。
- `child`：按钮中显示的文本或图标。
- `style`：按钮的样式，包括背景颜色、文本样式、阴影和形状等。

例如，以下代码创建了一个`ElevatedButton`，当用户按下按钮时，会打印一条消息：

```dart
ElevatedButton(
	style: const ButtonStyle(
        padding: MaterialStatePropertyAll(EdgeInsets.all(50)),
        // 按钮背景颜色
        backgroundColor: MaterialStatePropertyAll(Colors.red),
        // 文字颜色
        foregroundColor: MaterialStatePropertyAll(Colors.blueAccent)，
        elevation: const MaterialStatePropertyAll(100),
        shape: MaterialStatePropertyAll(
            // 圆角按钮
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(20))
            // side设置边框
            CircleBorder(side: BorderSide(color: Colors.blue, width: 10))
        )
    ),
    onPressed: () {
        print('Button pressed!');
    },
    child: Text('Press me'),
)
// 加入图标
ElevatedButton.icon(
    icon: Icon(Icons.home)
    onPressed: () {
        print('Button pressed!');
    },
    child: Text('Press me'),
)
```

### TextButton

`TextButton`是一种只包含文本的按钮，通常用于次要操作。该组件的外观通常是一个矩形，没有阴影，可以设置按钮的文字、样式和功能等属性。以下是一些常用的属性：

- `onPressed`：按下按钮时调用的函数。
- `child`：按钮中显示的文本。
- `style`：按钮的样式，包括文本样式和形状等。

例如，以下代码创建了一个`TextButton`，当用户按下按钮时，会打印一条消息：

```dart
TextButton(
  onPressed: () {
    print('Button pressed!');
  },
  child: Text('Press me'),
)
```

### OutlinedButton

`OutlinedButton`是一种带边框的按钮，通常用于不那么重要的操作。该组件的外观通常是一个矩形，带有边框和填充颜色，可以设置按钮的文字、样式和功能等属性。以下是一些常用的属性：

- `onPressed`：按下按钮时调用的函数。
- `child`：按钮中显示的文本。
- `style`：按钮的样式，包括边框颜色、文本样式和形状等。

例如，以下代码创建了一个`OutlinedButton`，当用户按下按钮时，会打印一条消息：

```dart
OutlinedButton(
    onPressed: () {
        print('Button pressed!');
    },
    // 方式1
    style: OutlinedButton.styleFrom(
        side: const BorderSide(
            width: 2,
            color: Colors.blue,
            style: BorderStyle.solid,
        ),
    ),
    // 方式2
    style: const ButtonStyle(
        side: MaterialStatePropertyAll(
            BorderSide(width: 2, color: Colors.yellow)
        )
    ),
    child: Text('Press me'),
)
```

### IconButton

`IconButton`是一种带图标的按钮，通常用于小型操作或菜单按钮。该组件的外观通常是一个圆形，带有填充颜色，可以设置按钮的图标、样式和功能等属性。以下是一些常用的属性：

- `onPressed`：按下按钮时调用的函数。
- `icon`：按钮中显示的图标。
- `color`：图标的颜色。
- `tooltip`：当用户长按按钮时显示的提示信息

以下代码创建了一个`IconButton`，当用户按下

按钮时，会打印一条消息：

```dart
IconButton(
  onPressed: () {
    print('Button pressed!');
  },
  icon: Icon(Icons.favorite),
  color: Colors.red,
)
```

### DropdownButton

`DropdownButton`是一种下拉菜单按钮，可以选择一个选项。该组件的外观通常是一个矩形，带有填充颜色，可以设置按钮的选项、样式和功能等属性。以下是一些常用的属性：

- `items`：下拉菜单中显示的选项列表。
- `value`：下拉菜单的当前选项。
- `onChanged`：选项变化时调用的函数。

例如，以下代码创建了一个`DropdownButton`，用户可以选择一种水果，选择的水果会打印出来：

```dart
String selectedFruit = 'Apple';

DropdownButton(
  value: selectedFruit,
  items: [
    DropdownMenuItem(value: 'Apple', child: Text('Apple')),
    DropdownMenuItem(value: 'Banana', child: Text('Banana')),
    DropdownMenuItem(value: 'Orange', child: Text('Orange')),
  ],
  onChanged: (value) {
    setState(() {
      selectedFruit = value;
      print('Selected fruit: $selectedFruit');
    });
  },
)
```

### PopupMenuButton

`PopupMenuButton`是一种弹出菜单按钮，可以显示多个选项。该组件的外观通常是一个三个点的图标，可以设置菜单的选项、样式和功能等属性。以下是一些常用的属性：

- `itemBuilder`：菜单中显示的选项列表。
- `onSelected`：选项被选中时调用的函数。

例如，以下代码创建了一个`PopupMenuButton`，当用户选择一种颜色时，会打印出来：

```dart
String selectedColor = 'Red';

PopupMenuButton(
  itemBuilder: (context) => [
    PopupMenuItem(value: 'Red', child: Text('Red')),
    PopupMenuItem(value: 'Green', child: Text('Green')),
    PopupMenuItem(value: 'Blue', child: Text('Blue')),
  ],
  onSelected: (value) {
    setState(() {
      selectedColor = value;
      print('Selected color: $selectedColor');
    });
  },
  child: Icon(Icons.color_lens),
)
```

### ToggleButtons

`ToggleButtons`是一种切换按钮，可以切换选项的状态。该组件的外观通常是一个矩形，带有填充颜色和一个圆形的按钮，可以设置按钮的选项、样式和功能等属性。

以下是`ToggleButtons`的一些常用属性：

- `children`：按钮的列表，每个按钮都可以是一个`Icon`、`Text`、`Image`等。
- `isSelected`：按钮的选中状态列表，如果该列表中的值为`true`，则表示该按钮被选中；如果为`false`，则表示该按钮未选中。
- `onPressed`：每个按钮被点击时的回调函数。
- `selectedColor`：选中的按钮的填充颜色。
- `color`：未选中的按钮的填充颜色。
- `selectedBorderColor`：选中的按钮的边框颜色。
- `borderColor`：未选中的按钮的边框颜色。
- `borderRadius`：按钮的圆角半径。
- `constraints`：按钮的尺寸约束。

例如，以下代码创建了一个`ToggleButton`，用户可以切换选项的状态，当选项状态变化时，会打印出来：

```dart
List<bool> _isSelected = [false, false, false];

ToggleButtons(
  children: [
    Icon(Icons.format_size),
    Icon(Icons.format_bold),
    Icon(Icons.format_italic),
  ],
  isSelected: _isSelected,
  onPressed: (index) {
    setState(() {
      _isSelected[index] = !_isSelected[index];
    });
  },
  selectedColor: Colors.blue,
  color: Colors.grey,
  selectedBorderColor: Colors.blue,
  borderColor: Colors.grey,
  borderRadius: BorderRadius.circular(8),
  constraints: BoxConstraints.expand(height: 48),
)
```

在上面的代码中，`_isSelected`表示每个按钮的选中状态，初始值为`[false, false, false]`，表示所有按钮都未选中。当用户点击一个按钮时，会调用`onPressed`回调函数，并切换对应按钮的选中状态。在`ToggleButtons`的其他属性中，`children`表示按钮的列表，`selectedColor`和`color`分别表示选中和未选中的按钮的填充颜色，`selectedBorderColor`和`borderColor`分别表示选中和未选中的按钮的边框颜色，`borderRadius`表示按钮的圆角半径，`constraints`表示按钮的尺寸约束。

### CupertinoButton

`CupertinoButton`是一个 iOS 风格的按钮，可以设置按钮的样式和功能等属性。该组件的外观通常是一个圆角矩形，带有填充颜色和文本标签。以下是一些常用的属性：

- `onPressed`：按钮被点击时调用的函数。
- `color`：按钮的填充颜色。
- `borderRadius`：按钮的圆角半径。
- `padding`：按钮的内边距。

例如，以下代码创建了一个`CupertinoButton`，用户可以点击按钮，当按钮被点击时，会打印出来：

```dart
CupertinoButton(
  onPressed: () {
    print('Button pressed!');
  },
  color: Colors.blue,
  borderRadius: BorderRadius.circular(8),
  padding: EdgeInsets.all(16),
  child: Text('Press me'),
)
```

## AspectRatio 组件/Card 组件

AspectRatio 的作用是根据设置调整子元素 child 的宽高比。

AspectRatio 首先会在布局限制条件允许的范围内尽可能的扩展，widget 的宽度是由宽度和比率决定的，类似于 BoxFit 中的 contain，按照固定比率去尽量占满区域。

如果在满足所有限制条件过后无法找到一个可行的尺寸，AspectRatio 最终将会去优先适应布局限制条件，而忽略所设置的比率

|    属性     |                                                    说明                                                    |
| :---------: | :--------------------------------------------------------------------------------------------------------: |
| aspectRatio | 宽高比，最终可能不会根据这个值去布局，具体要看综合因素，外层是否允许按照这种比例进行布局，这只是一个参考值 |
|    child    |                                                   子组件                                                   |

代码：（长是高的 2 倍例子）

```dart
class Demo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 200,
      child: AspectRatio(
        aspectRatio: 2.0/1.0,//外层的200，会是里面的container长200高100
        child: Container(
          color: Colors.red,
        ),
      ),
    );
  }
}
```

**Card**

Card 是卡片组件块，内容可以由大多数类型的 Widget 构成，Card 具有圆角和阴影，这让它看起来有立体感。

|  属性  |                       说明                        |
| :----: | :-----------------------------------------------: |
| margin |                      外边距                       |
| child  |                      子组件                       |
| Shape  | Card 的阴影效果，默认的阴影效果为圆角的长方形边。 |

代码：

```dart
class Demo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ListView(
      children: <Widget>[
        Card(
          margin:EdgeInsets.all(10),
          child: Column(
            children: <Widget>[
              ListTile(
                title:Text('chidaoxian'),
                subtitle: Text('前端开发工程师'),
              ),
               ListTile(
                title:Text('电话：12323432141234123'),

              ),
               ListTile(
                title:Text('地址：xxxxxx'),

              ),
            ],
          ),
        ),
        Card(
          margin:EdgeInsets.all(10),
          child: Column(
            children: <Widget>[
              ListTile(
                title:Text('chidaoxian'),
                subtitle: Text('前端开发工程师'),
              ),
               ListTile(
                title:Text('电话：12323432141234123'),

              ),
               ListTile(
                title:Text('地址：xxxxxx'),

              ),
            ],
          ),
        ),
      ],
    );
  }
}
```

## StatefulWidget 状态组件

StatefulWidget 是有状态组件，持有的状态可能在 Widget 生命周期改变。通俗的讲：如果我们想改变页面中的数据的话这个时候就需要用到 StatefulWidget。

在 Flutter 中，`StatefulWidget`和`StatelessWidget`是两种常用的组件类型，它们分别对应有状态组件和无状态组件。其中，`StatefulWidget`表示有状态组件，它可以根据内部状态的改变而重新渲染自己，而`StatelessWidget`则表示无状态组件，它的渲染是静态的，不会因为内部状态的改变而发生变化。

具体来说，`StatefulWidget`由两部分组成：一个是状态对象（`State`），另一个是不可变的配置信息（`Widget`）。当我们创建一个`StatefulWidget`时，实际上是在创建一个不可变的配置对象，它包含了组件的属性和样式等信息。而`State`对象则用于维护组件的状态，它包含了一些变量和方法，用于描述当前组件的状态和行为。每当状态发生变化时，`State`对象都会通知 Flutter 框架重新渲染对应的`Widget`，使其更新视图。

在使用`StatefulWidget`时，我们需要注意以下几点：

- `StatefulWidget`的`build`方法应该返回一个`Widget`对象，它描述了组件的视图；
- `StatefulWidget`的状态应该是不可变的，也就是说，`State`对象中的变量应该都被声明为`final`或者`const`；
- 如果需要修改`State`对象中的变量，应该通过`setState`方法来触发重新渲染；
- 通常情况下，我们可以将`StatefulWidget`和它对应的`State`对象放在同一个 Dart 文件中，这样可以方便管理和维护。

总的来说，`StatefulWidget`提供了一种灵活的方式来管理组件的状态，可以方便地实现动态更新和交互等功能，是 Flutter 中常用的一种组件类型。

**有状态组件/数据绑定**

```dart
import 'package:flutter/material.dart';

class CounterWidget extends StatefulWidget {
  final int initialValue;

  CounterWidget({Key key, this.initialValue = 0}) : super(key: key);

  @override
  _CounterWidgetState createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  int _counter;

  @override
  void initState() {
    super.initState();
    _counter = widget.initialValue;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Counter: $_counter'),
        RaisedButton(
          onPressed: () {
            setState(() {
              _counter++;
            });
          },
          child: Text('Increment'),
        ),
      ],
    );
  }
}

```

每个`StatefulWidget`只能对应一个`State`对象，因此只能绑定一个状态。但是，你可以在`State`对象中定义多个变量来保存不同的状态，并在`build`方法中根据这些变量的值来渲染不同的 UI。例如，你可以在上面的示例代码中再定义一个名为`_isEven`的布尔型变量来判断当前计数器的值是否为偶数，然后在`build`方法中根据`_isEven`的值来显示不同的文本颜色：

```dart
class _CounterWidgetState extends State<CounterWidget> {
  int _counter;
  bool _isEven;

  @override
  void initState() {
    super.initState();
    _counter = widget.initialValue;
    _isEven = _counter % 2 == 0;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          'Counter: $_counter',
          style: TextStyle(
            color: _isEven ? Colors.blue : Colors.red,
          ),
        ),
        RaisedButton(
          onPressed: () {
            setState(() {
              _counter++;
              _isEven = _counter % 2 == 0;
            });
          },
          child: Text('Increment'),
        ),
      ],
    );
  }
}
```

在上面的示例代码中，我们在`_CounterWidgetState`中新增了一个名为`_isEven`的布尔型变量。在`initState`方法中，我们将`_isEven`初始化为当前计数器的值是否为偶数。在`build`方法中，我们在`Text`组件中根据`_isEven`的值设置文本颜色。当用户点击`RaisedButton`时，我们除了将`_counter`的值增加 1，还会重新计算`_isEven`的值，使其与`_counter`的值同步更新。

## ButtonNavigationBar 组件

**介绍**

ButtonNavigationBar 是底部导航条，可以让我们定义底部 Tab 切换，buttonNavigationBar 是 Scaffold 组件参数。

|    属性名    |     类型     |                                         说明                                          |
| :----------: | :----------: | :-----------------------------------------------------------------------------------: |
| currentlndex |     int      |                              当前索引，用来切换按钮控制                               |
|  fixedColor  |    Color     |                    选中按钮的颜色。如果没有指定值，则用系统主题色                     |
|   iconSize   |    double    |                                     按钮图标大小                                      |
|    items     |     List     | 底部导航调按钮集。每一项是一个 BottomNavigationBarItem，有 icon 图标及 title 文本属性 |
|    onTap     | ValueChanged |              按下其中某一个按钮回调事件。需要根据返回的索引设置当前索引               |

**实例**

**main.dart 的代码**

```dart
import 'package:flutter/material.dart';
import 'package:flutter_app01/pages/tabs/Home.dart';
import 'pages/tabs/Tabs.dart';
import 'pages/tabs/ddd.dart';
import 'pages/tabs/Setting.dart';

void main() {
  runApp(MyApp());
}

//自定义组件
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Tabs(),
      theme: ThemeData(
        primarySwatch: Colors.green,
      ),
    );
  }
}

class Tabs extends StatefulWidget {
  Tabs({Key key}) : super(key: key);

  @override
  _TabsState createState() => _TabsState();
}

class _TabsState extends State<Tabs> {
  int currentIndex = 0;

  List pageList = [
    HomePage(),
    SettingPage(),
    DDDPage(),
  ];
  @override
  Widget build(BuildContext context) {
    return Container(
       child: Scaffold(
        appBar: AppBar(
          title: Text('flutter cdx'),
        ),
        body: this.pageList[this.currentIndex],
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: this.currentIndex,
          onTap: (int index) {
            setState(() {
              this.currentIndex = index;
            });
          },
          items: [
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: '首页',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.my_library_books),
              label: '我的',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.settings_applications),
              label: '设置',
            ),
          ],
        ),
      ),
    );
  }
}
```

**2、Tabs.dart 的代码**

```dart
import 'package:flutter/material.dart';

class Tabs extends StatefulWidget {
  Tabs({Key key}) : super(key: key);

  @override
  _TabsState createState() => _TabsState();
}

class _TabsState extends State<Tabs> {
  int currentIndex = 0;
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Scaffold(
        appBar: AppBar(
          title: Text('flutter cdx'),
        ),
        body: Text('xxx'),
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: this.currentIndex,
          onTap: (int index) {
            setState(() {
              this.currentIndex = index;
            });
          },
          items: [
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: '首页',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.my_library_books),
              label: '我的',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.settings_applications),
              label: '设置',
            ),
          ],
        ),
      ),
    );
  }
}
```

**3、Home.dart 的代码（Home.dart/Setting.dart 代码类似）**

```dart
import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  HomePage({Key key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return Container(
       child: Text('HomePage'),
    );
  }
}
```

# Flutter 路由

在 Flutter 中，路由是指应用程序的不同屏幕或页面之间的导航。Flutter 提供了多种导航和路由管理方式，包括基于页面的导航和基于命名路由的导航。

## 基于页面的导航

在基于页面的导航中，每个屏幕都是一个 Widget，我们可以通过**Navigator**来管理这些 Widget 之间的切换。Navigator 可以跟踪一个 Widget 栈，每次我们打开一个新的屏幕时，它会将新的 Widget 推入栈中。而当我们返回上一个屏幕时，它会将最后一个 Widget 从栈中弹出。

以下是基于页面的导航的一些关键类和方法：

- MaterialApp：一个 Material 风格的应用程序，它提供了顶级 Navigator 和路由管理。
- Navigator：用于管理一个 Widget 栈，提供了打开和关闭路由的方法。
- MaterialPageRoute：用于创建基于页面的路由，每个路由对应一个屏幕或页面。

下面是一个简单的示例，它演示了如何使用基于页面的导航：

```dart
dartCopy codeimport 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home Page'),
      ),
      body: Center(
        child: ElevatedButton(
          child: Text('Open Second Page'),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => SecondPage()),
            );
          },
        ),
      ),
    );
  }
}

class SecondPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Second Page'),
      ),
      body: Center(
        child: ElevatedButton(
          child: Text('Go Back'),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
    );
  }
}
```

在这个例子中，我们创建了一个简单的 Material 应用程序，并在其中定义了两个页面：`HomePage`和`SecondPage`。`HomePage`中包含一个按钮，当我们点击该按钮时，它会打开`SecondPage`。而在`SecondPage`中，我们也包含了一个按钮，当我们点击该按钮时，它会返回到上一个页面。

## 基于命名路由的导航

在基于命名路由的导航中，每个路由都有一个唯一的字符串标识符，我们可以通过该标识符来打开和关闭路由。当我们打开一个新的路由时，Flutter 会自动创建对应的 Widget，并将其推入路由栈中。而当我们返回到上一个路由时，Flutter 会自动将最后一个路由从栈中弹出。

以下是基于命名路由的导航的一些关键类和方法：

- MaterialApp：同样用于创建一个 Material 应用程序，但需要添加路由管理。

- onGenerateRoute：一个回调函数，用于生成路由对象。
- Navigator：用于管理一个路由栈，提供了打开和关闭路由的方法。
- MaterialPageRoute：同样用于创建基于页面的路由，但需要传入一个路由名作为参数。

下面是一个简单的示例，它演示了如何使用基于命名路由的导航：

```dart
dartCopy codeimport 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      initialRoute: '/',
      onGenerateRoute: (settings) {
        switch (settings.name) {
          case '/':
            return MaterialPageRoute(builder: (context) => HomePage());
          case '/second':
            return MaterialPageRoute(builder: (context) => SecondPage());
          default:
            return null;
        }
      },
    );
  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home Page'),
      ),
      body: Center(
        child: ElevatedButton(
          child: Text('Open Second Page'),
          onPressed: () {
            Navigator.pushNamed(context, '/second');
          },
        ),
      ),
    );
  }
}

class SecondPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Second Page'),
      ),
      body: Center(
        child: ElevatedButton(
          child: Text('Go Back'),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
    );
  }
}
```

在这个例子中，我们首先将`initialRoute`设置为`'/'`，这表示我们应用程序的初始路由为`HomePage`。然后，我们定义了一个`onGenerateRoute`回调函数，它根据路由名生成对应的路由对象。在`HomePage`中，我们使用`Navigator.pushNamed`方法打开`'/second'`路由。在`SecondPage`中，我们使用`Navigator.pop`方法返回到上一个路由。

除了基于页面的导航和基于命名路由的导航之外，Flutter 还提供了其他导航和路由管理方式，如：

- TabBar：一个选项卡控件，用于在不同的选项卡之间切换。
- Drawer：一个抽屉式菜单控件，用于显示应用程序的主菜单。
- BottomNavigationBar：一个底部导航栏控件，用于在应用程序的不同页面之间进行切换。

总之，路由是 Flutter 应用程序中非常重要的一部分，它决定了应用程序的导航和页面切换方式。熟练掌握 Flutter 的路由和导航管理方式可以使我们更好地构建出复杂和灵活的应用程序。

### 携带参数/不携带参数

当我们使用命名路由跳转到新页面时，可以通过在路由表中定义的路由名称以及可选的参数来实现。

以下是一个示例代码，演示如何在命名路由中传递参数：

1. 定义路由表：

```dart
dartCopy code// 定义路由表
final Map<String, WidgetBuilder> routes = {
  '/': (context) => HomePage(),
  '/detail': (context) => DetailPage(),
};
```

1. 在定义路由表时，指定路由名称和参数：

```dart
dartCopy code// 定义路由表
final Map<String, WidgetBuilder> routes = {
  '/': (context) => HomePage(),
  '/detail': (context) => DetailPage(),
};
```

1. 在调用 Navigator.pushNamed 方法时，指定路由名称和参数：

```dart
dartCopy code
Navigator.pushNamed(context, '/detail', arguments: {'id': 1, 'name': 'John'});
```

1. 在新页面中获取传递的参数：

```dart
dartCopy codeclass DetailPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final Map<String, dynamic> args = ModalRoute.of(context).settings.arguments;
    final int id = args['id'];
    final String name = args['name'];

    return Scaffold(
      appBar: AppBar(
        title: Text('Detail Page'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('ID: $id'),
            Text('Name: $name'),
          ],
        ),
      ),
    );
  }
}
```

在上述代码中，我们在调用 Navigator.pushNamed 方法时，通过 arguments 参数传递了一个 Map 类型的参数。在新页面中，我们通过 ModalRoute.of(context).settings.arguments 来获取传递过来的参数，并分别获取其中的 id 和 name 字段，并将它们显示在屏幕上。

如果不需要传递参数，我们可以直接在调用 Navigator.pushNamed 方法时指定路由名称即可，如下所示：

```dart
dartCopy code
Navigator.pushNamed(context, '/detail');
```

### 传递复杂对象参数

在命名路由中传递复杂的对象参数可以通过在路由参数中使用 `Uri.encodeFull()` 方法将对象序列化为字符串，然后在路由参数中传递该字符串，最后在目标页面中将该字符串反序列化为对象。

例如，假设有一个复杂的对象 `MyComplexObject`：

```dart
dartCopy codeclass MyComplexObject {
  final String name;
  final int age;
  final List<String> hobbies;

  MyComplexObject({required this.name, required this.age, required this.hobbies});
}
```

可以使用 `jsonEncode()` 方法将该对象序列化为 JSON 字符串：

```dart
dartCopy codevar myComplexObject = MyComplexObject(
  name: 'John',
  age: 30,
  hobbies: ['reading', 'running', 'swimming'],
);

var myComplexObjectString = jsonEncode(myComplexObject);
```

然后将该字符串作为路由参数传递给目标页面：

```dart
dartCopy codeNavigator.pushNamed(
  context,
  '/targetPage',
  arguments: Uri.encodeFull(myComplexObjectString),
);
```

在目标页面中，可以通过 `ModalRoute.of(context)?.settings.arguments` 获取传递的路由参数，然后使用 `jsonDecode()` 方法将该字符串反序列化为对象：

```dart
dartCopy codevar myComplexObjectString = ModalRoute.of(context)?.settings.arguments as String;
var myComplexObject = MyComplexObject.fromJson(jsonDecode(Uri.decodeFull(myComplexObjectString)));
```

需要注意的是，在序列化和反序列化对象时，需要自定义 `toJson()` 和 `fromJson()` 方法。

## Navigator

`Navigator`是 Flutter 框架中用于管理路由栈的类，它提供了一组方法，可以用来打开、关闭和替换路由等操作。通常情况下，我们可以在应用程序的顶层 Widget 中使用`Navigator`来管理整个应用程序的路由。

在 Flutter 中，每一个路由都是一个`Widget`，我们可以使用`Navigator`的方法将这些`Widget`按照一定的顺序组织成路由栈。当我们打开一个新的路由时，它会被压入路由栈的顶部，而当前路由则会被暂停（Paused）并隐藏在路由栈的底部。当我们从当前路由返回时，它会被弹出路由栈，而下一个路由则会重新被激活并显示在屏幕上。

下面是一些常用的`Navigator`方法：

- `Navigator.push`：将一个新的路由压入路由栈。
- `Navigator.pushReplacement`：将一个新的路由替换掉当前路由。
- `Navigator.pushNamed`：使用路由名称打开一个新的路由。
- `Navigator.pushNamedAndRemoveUntil`：使用路由名称打开一个新的路由，并弹出路由栈中所有的路由，直到指定的路由被激活为止。
- `Navigator.pop`：将当前路由从路由栈中弹出。

除了这些方法之外，`Navigator`还提供了一些属性，用于获取当前路由栈的状态信息，如：

- `Navigator.canPop`：判断是否可以从当前路由返回。
- `Navigator.currentRoute`：获取当前活动的路由。
- `Navigator.widget`：获取当前`Navigator`所对应的`Widget`。

总之，`Navigator`是 Flutter 应用程序中非常重要的一部分，它决定了应用程序的导航和页面切换方式。熟练掌握`Navigator`的用法可以使我们更好地构建出复杂和灵活的应用程序

## 跳转传值

在 Flutter 中，可以通过`Navigator.push`方法和`Navigator.pushNamed`方法来实现路由的跳转，并且可以通过`arguments`参数将数据传递给下一个路由。

具体来说，我们可以在`Navigator.push`或`Navigator.pushNamed`方法中传递一个`arguments`参数，该参数可以是任何类型的数据，如字符串、数字、对象等。下一个路由可以通过`ModalRoute.of(context).settings.arguments`来获取传递过来的数据。

以下是一个示例代码：

```dart
dartCopy codeclass FirstScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('First Screen'),
      ),
      body: Center(
        child: ElevatedButton(
          child: Text('Go to Second Screen'),
          onPressed: () {
            // Navigate to the second screen when tapped.
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => SecondScreen(),
                settings: RouteSettings(
                  arguments: 'Hello from First Screen!',
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

class SecondScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final String args = ModalRoute.of(context).settings.arguments as String;
    return Scaffold(
      appBar: AppBar(
        title: Text('Second Screen'),
      ),
      body: Center(
        child: Text(args),
      ),
    );
  }
}
```

在上述代码中，当用户点击第一个屏幕中的按钮时，会通过`Navigator.push`方法跳转到第二个屏幕，并将字符串`'Hello from First Screen!'`传递给第二个屏幕。第二个屏幕可以通过`ModalRoute.of(context).settings.arguments`获取传递过来的数据，并将其显示在屏幕上。

## 路由替换/返回根路由

在 Flutter 中，除了可以通过 Navigator.push 和 Navigator.pushNamed 方法实现路由的跳转之外，还可以使用 Navigator.pushReplacement 和 Navigator.pushNamedAndRemoveUntil 方法来进行路由的替换和返回根路由。

Navigator.pushReplacement 方法可以将当前路由替换为一个新的路由，同时从路由栈中移除原先的路由。以下是一个示例代码：

```dart
Navigator.pushReplacement(
  context,
  MaterialPageRoute(builder: (context) => NewScreen()),
);
```

在上述代码中，当用户跳转到 NewScreen 时，原先的路由将被替换为 NewScreen。

而 Navigator.pushNamedAndRemoveUntil 方法可以将当前路由替换为一个新的路由，并且移除所有在新路由之前的路由。以下是一个示例代码：

```dart
Navigator.pushNamedAndRemoveUntil(
  context,
  '/newScreen',
  ModalRoute.withName('/'),
);
```

在上述代码中，当用户跳转到/newScreen 路由时，所有在'/'路由之前的路由将被移除，并且将新路由作为当前路由。

需要注意的是，使用这些方法进行路由跳转和替换时，可能会出现一些页面动画上的问题。可以通过修改 PageRoute 的参数来调整页面动画效果。例如，可以将 PageRoute 的 transitionDuration 参数设置为 Duration.zero 来禁用页面切换动画。

## 待入的组件表格属性介绍

**Form 组件**

|    属性名    |     类型     |              说明               |
| :----------: | :----------: | :-----------------------------: |
|     key      |     Key      | 组件在整个 Widget 树中的 key 值 |
| autovalidate |     bool     |        是否自动提交表单         |
|    child     |    Widget    |   组件 child 只能有一个子组件   |
|  onChanged   | VoidCallback | 当 FormFiled 值改变时的回调函数 |

**TextFromField 组件**

|    属性名    |        类型        |                   说明                   |
| :----------: | :----------------: | :--------------------------------------: |
| autovalidate |        bool        |                自动验证值                |
| initialValue |         T          |              表单字段初始值              |
|   onSaved    |  FormFieldSetter   | 当 Form 表单调用保存方法 Save 时回调函数 |
|  validator   | FormFieldValidator |             Form 表单验证器              |

**Material Design 风格组件**

|       组件名称       |       中文名称       |                       简单说明                        |
| :------------------: | :------------------: | :---------------------------------------------------: |
|        AppBar        |     应用按钮组件     |                    应用的工具按钮                     |
|     AlertDialog      |      对话框组件      |                  有操作按钮的对话框                   |
| BottomNavigationBar  |    底部导航条组件    | 底部导航条，可以很容易地在 tap 之间切换和浏览顶级视图 |
|         Card         |       卡片组件       |                带有边框阴影的卡片组件                 |
|        Drawer        |       抽屉组件       |     Drawer 抽屉组件可以实现类似抽屉拉开关闭的效果     |
| FloatingActionButton |     浮动按钮组件     |                应用的主要功能操作按钮                 |
|      FlatButton      |     扁平按钮组件     |                   扁平化风格的按钮                    |
|     MaterialApp      |  Material 应用组件   |        Material App 代表使用纸墨设计风格的应用        |
|   PopupMenuButton    |     弹出菜单组件     |                     弹出菜单按钮                      |
|       Scaffold       |      脚手架组件      |           实现了基本的 Material Design 布局           |
|       SnackBar       |     轻量提示组件     |       一个轻量级消息提示组件，在屏幕的底部显示        |
|     SimpleDialog     |    简单对话框组件    |        简单对话框组件，只起提示作用，没有交互         |
|        TabBar        | 水平选项卡及视图组件 |       一个显示水平选项卡的 Material Design 组件       |
|      TextField       |      文本框组件      |               可接受应用输入文本的组件                |

**MaterialApp**

| 属性名 | 类型 | 说明 |
| :-: | :-: | :-: |
| title | String | 应用程序的标题。该标题出现在如下位置：Android：任务管理器的程序快照之上 IOS：程序切换管理器 |
| theme | ThemeData | 定义应用所使用的主题颜色。可以指定一个主题中每个控件的颜色 |
| color | Color | 应用的主要颜色值，即 primary color |
| home | Widget | 这个是一个 Widget 对象，用来定义当前应用打开时，所显示的界面 |
| routes | Map<String,WidgetBuider> | 定义应用中页面跳转规则 |
| initialRoute | String | 初始化路由 |
| onGenerateRoute | RouteFactory | 路由回调函数。当通过 Navigator.of(context).pushNamed 跳转路由时，在 routes 查找不到时，会调用该方法 |
| onLocaleChanged |  | 当系统修改语言的时候，会触发这个回调 |
| navigatorObservers | List | 导航观察器 |
| debugShowMaterialGrid | bool | 是否显示纸墨设计基础布局网格，用来调试 UI 的工具 |
| showPerformanceOverlay | bool | 显示性能标签 |

**Scaffold**

|           属性名           |  类型  |                                                    说明                                                     |
| :------------------------: | :----: | :---------------------------------------------------------------------------------------------------------: |
|           appBar           | AppBar |                                         显示在界面顶部的一个 AppBar                                         |
|            body            | Widget |                                          当前界面所显示的主要内容                                           |
|    floatingActionButton    | Widget |                                   在 Material Design 中定义的一个功能按钮                                   |
|  persistentFooterButtons   |  List  |                                           在固定在下方显示的按钮                                            |
|           drawer           | Widget |                                                 侧边栏组件                                                  |
|    bottomNavigationBar     | Widget |                                          显示在底部的导航栏按钮栏                                           |
|      backgroundColor       | Color  |                                                  背景颜色                                                   |
| resizeToAvoidBottomPadding |  bool  | 控制界面内容 body 是否重新布局来避免底部被覆盖，比如当键盘显示时，重新布局避免被键盘盖住内容。默认值为 true |

**AppBar 及 SliverAppBar 组件**

|     属性名      |         类型         |              默认值              |
| :-------------: | :------------------: | :------------------------------: |
|     leading     |        Widget        |               null               |
|      title      |        Widget        |               null               |
|     actions     |         List         |               null               |
|     bottom      | PreferredSize Widget |               null               |
|    elevation    |        double        |                4                 |
|  flexibleSpace  |        Widget        |               null               |
| backgroundColor |        Color         |      ThemeData.primaryColor      |
|   brightness    |      Brightness      | ThemeData.primaryColorBrightness |
|    iconTheme    |    IconThemeData     |    ThemeData.primaryIconTheme    |
|    textTheme    |      TextTheme       |    ThemeData.primaryTextTheme    |
|   centerTitle   |         bool         |               true               |

**介绍：**

| 属性名 | 说明 |
| :-: | :-: |
| leading | 在标题前面显示的一个组件，在首页通常显示应用的 logo；在其他界面通常显示 |
| title | Toolbar 中主要内容，通常显示为当前界面的标题文字 |
| actions | 一个 Widget 列表，代表 Toolbar 中所显示的菜单，对于通常的菜单，通常使用 IconButton 来表示，对于不太常用的菜单通常使用 PopupMenuButton 来显示为三点，点击后弹出二级菜单 |
| bottom | 通常是 TabBar。用来在 Toolbar 标题下面显示一个 Tab 导航栏 |
| elevation | 纸墨设计中组件的 z 坐标顺序，对于可滚动的 SliverAppBar，当 SliverAppBar 和内容同级的时候，该值为 0，当内容咕哝的那个 SliverAppBar 变为 ToolBar 的时候，修改 elevation |
| flexibleSpace | 一个显示在 AppBar 下方的组件，高度和 AppBar 高度一样，可以实现一些特殊的效果，该属性通常在 SliverAppBar 中使用 |
| backgroundColor | 背景色 |
| brightness | AppBar 的亮度，有白色和黑色两种主题 |
| iconTheme | AppBar 上图标的颜色、透明度和尺寸信息。默认值为 ThemeData. primaryIcon Theme |
| textTheme | AppBar 上的文字样式 |
| centerTitle | 标题是否居中显示，默认值根据不同的操作系统，显示方式不一样 |
