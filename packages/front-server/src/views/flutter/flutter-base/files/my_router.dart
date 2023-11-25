import 'package:flutter/material.dart';

// return MaterialApp(
//   title: 'My App',
//   onGenerateRoute: MyRouter.generateRoute,
//   initialRoute: HomePage.routeName,
//   routes: MyRouter.routes,
// );
class MyRouter {
  static final Map<String, WidgetBuilder> routes = {
    // HomePage.routeName: (_) => HomePage(),
    ProfilePage.routeName: (_) => _requireAuth(const ProfilePage()),
    // SettingsPage.routeName: (_) => _requireAuth(SettingsPage()),
    LoginPage.routeName: (_) => const LoginPage(),
  };

  static Route<dynamic> generateRoute(RouteSettings settings) {
    final builder = routes[settings.name] ??
        (_) => Scaffold(
              body: Center(
                child: Text('No route defined for ${settings.name}'),
              ),
            );

    return MaterialPageRoute<dynamic>(builder: builder);
  }

  static Widget _requireAuth(Widget page) {
    return Builder(
      builder: (context) {
        if (_isAuthenticated()) {
          return page;
        } else {
          return const LoginPage();
        }
      },
    );
  }

  static bool _isAuthenticated() {
    return true;
  }
}

class LoginPage extends StatelessWidget {
  static const String routeName = '/login';

  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login'),
      ),
      body: Center(
        child: ElevatedButton(
          child: const Text('Log In'),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
      ),
    );
  }
}

class ProfilePage extends StatelessWidget {
  static const String routeName = '/profile';

  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
      ),
      body: const Center(
        child: Text('Welcome to your profile!'),
      ),
    );
  }
}
