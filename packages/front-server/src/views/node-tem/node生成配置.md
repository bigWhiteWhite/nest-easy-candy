## 常用库

| 作用                                                         | 库名称   |
| ------------------------------------------------------------ | -------- |
| 用于创建命令行交互式界面，可以方便地与用户进行问答交互       | inquirer |
| 用于在 Node.js 中进行文件传输，支持通过 SSH 连接远程服务器并进行文件上传和下载 | scp2     |
| 用于在命令行界面显示加载动画和提示信息，可以提升用户体验     | ora      |
| 用于在命令行界面中添加颜色和样式，可以美化输出文本           | chalk    |
| 用于处理文件路径，提供了一些方法用于解析、拼接和转换文件路径 | path     |
| 是 Node.js 内置的 fs 模块的扩展，提供了更多的文件操作方法，如复制、删除、移动文件等 | fs-extra |

这些库在开发命令行工具、构建脚本或处理文件操作时非常有用。它们可以帮助你简化代码、提供更好的用户体验，并提供一些额外的功能来处理文件和路径。

### fs-extra

常用方法

| 方法               | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| `copy()`           | 复制文件或目录                                               |
| `copySync()`       | 同步复制文件或目录                                           |
| `emptyDir()`       | 清空目录，如果目录不存在则创建                               |
| `emptyDirSync()`   | 同步清空目录，如果目录不存在则创建                           |
| `ensureDir()`      | 确保目录存在，如果目录不存在则创建                           |
| `ensureDirSync()`  | 同步确保目录存在，如果目录不存在则创建                       |
| `mkdirs()`         | 创建多级目录                                                 |
| `mkdirsSync()`     | 同步创建多级目录                                             |
| `move()`           | 移动文件或目录                                               |
| `moveSync()`       | 同步移动文件或目录                                           |
| `readJson()`       | 读取 JSON 文件并解析为 JavaScript 对象                       |
| `readJsonSync()`   | 同步读取 JSON 文件并解析为 JavaScript 对象                   |
| `remove()`         | 删除文件或目录                                               |
| `removeSync()`     | 同步删除文件或目录                                           |
| `writeJson()`      | 将 JavaScript 对象写入 JSON 文件                             |
| `writeJsonSync()`  | 同步将 JavaScript 对象写入 JSON 文件                         |
| `appendFile()`     | 追加内容到文件                                               |
| `appendFileSync()` | 同步追加内容到文件                                           |
| `readFile()`       | 读取文件内容                                                 |
| `readFileSync()`   | 同步读取文件内容                                             |
| `writeFile()`      | 写入内容到文件                                               |
| `writeFileSync()`  | 同步写入内容到文件                                           |
| `ensureFile()`     | 确保文件存在，如果文件不存在则创建                           |
| `ensureFileSync()` | 同步确保文件存在，如果文件不存在则创建                       |
| `outputFile()`     | 将内容写入文件，如果文件不存在则创建                         |
| `outputFileSync()` | 同步将内容写入文件，如果文件不存在则创建                     |
| `pathExists()`     | 检查文件或目录是否存在                                       |
| `pathExistsSync()` | 同步检查文件或目录是否存在                                   |
| `readJSON()`       | 读取 JSON 文件并解析为 JavaScript 对象（与 `readJson()` 相同） |
| `readJSONSync()`   | 同步读取 JSON 文件并解析为 JavaScript 对象（与 `readJsonSync()` 相同） |
| `writeJSON()`      | 将 JavaScript 对象写入 JSON 文件（与 `writeJson()` 相同）    |
| `writeJSONSync()`  | 同步将 JavaScript 对象写入 JSON 文件（与 `writeJsonSync()` 相同） |
| `walk()`           | 遍历目录并返回文件和子目录的路径                             |
| `walkSync()`       | 同步遍历目录并返回文件和子目录的路径                         |

这些是 `fs-extra` 库中一些常用的方法，它提供了许多方便的文件系统操作功能，比原生的 `fs` 模块更加易用和强大。你可以根据需要选择适合的方法来处理文件和目录。

### [handlebarsjs](https://www.handlebarsjs.cn/guide/#%E8%AE%A1%E7%AE%97%E4%B8%8A%E4%B8%8B%E6%96%87)

下面是 Handlebars.js 中一些常用的方法和用法的表格展示：

| 方法                                     | 描述                                                   |
| ---------------------------------------- | ------------------------------------------------------ |
| `compile(template)`                      | 编译 Handlebars 模板字符串，返回一个函数               |
| `registerHelper(name, helperFunction)`   | 注册一个自定义的帮助函数                               |
| `registerPartial(name, partialTemplate)` | 注册一个局部模板                                       |
| `template(context)`                      | 使用编译后的模板函数和数据上下文生成最终的 HTML 字符串 |
| `escapeExpression(string)`               | 对字符串进行 HTML 转义                                 |
| `if`                                     | 条件语句，根据条件渲染不同的内容                       |
| `unless`                                 | 与 `if` 相反，根据条件不渲染内容                       |
| `each`                                   | 迭代数组或对象，渲染重复的内容                         |
| `with`                                   | 改变当前上下文，渲染特定的内容                         |
| `lookup`                                 | 查找嵌套上下文中的属性值                               |
| `blockHelperMissing`                     | 自定义块级帮助函数的默认行为                           |
| `log`                                    | 在控制台输出调试信息                                   |

这些是 Handlebars.js 中一些常用的方法和用法，用于编译和渲染模板、处理条件和循环、注册自定义帮助函数等。你可以根据具体的需求选择适合的方法来使用 Handlebars.js。

### chalk

下面是 Chalk 库中一些常用的方法和用法的表格展示：

| 方法                        | 描述                       |
| --------------------------- | -------------------------- |
| `chalk.bold(text)`          | 将文本设置为粗体           |
| `chalk.italic(text)`        | 将文本设置为斜体           |
| `chalk.underline(text)`     | 给文本添加下划线           |
| `chalk.strikethrough(text)` | 给文本添加删除线           |
| `chalk.red(text)`           | 将文本设置为红色           |
| `chalk.green(text)`         | 将文本设置为绿色           |
| `chalk.blue(text)`          | 将文本设置为蓝色           |
| `chalk.yellow(text)`        | 将文本设置为黄色           |
| `chalk.magenta(text)`       | 将文本设置为洋红色         |
| `chalk.cyan(text)`          | 将文本设置为青色           |
| `chalk.white(text)`         | 将文本设置为白色           |
| `chalk.gray(text)`          | 将文本设置为灰色           |
| `chalk.bgRed(text)`         | 将文本的背景色设置为红色   |
| `chalk.bgGreen(text)`       | 将文本的背景色设置为绿色   |
| `chalk.bgBlue(text)`        | 将文本的背景色设置为蓝色   |
| `chalk.bgYellow(text)`      | 将文本的背景色设置为黄色   |
| `chalk.bgMagenta(text)`     | 将文本的背景色设置为洋红色 |
| `chalk.bgCyan(text)`        | 将文本的背景色设置为青色   |
| `chalk.bgWhite(text)`       | 将文本的背景色设置为白色   |

这些是 Chalk 库中一些常用的方法，用于设置文本样式和颜色。你可以根据需要选择适合的方法来使用 Chalk。

### Ora

下面是 Ora 库中一些常用的方法和用法的表格展示：

| 方法                        | 描述                                  |
| --------------------------- | ------------------------------------- |
| `ora(text)`                 | 创建一个新的 Ora 实例，并设置加载文本 |
| `start()`                   | 启动加载动画                          |
| `stop()`                    | 停止加载动画                          |
| `succeed([text])`           | 显示加载成功的图标和可选的文本        |
| `fail([text])`              | 显示加载失败的图标和可选的文本        |
| `warn([text])`              | 显示警告图标和可选的文本              |
| `info([text])`              | 显示信息图标和可选的文本              |
| `stopAndPersist([options])` | 停止加载动画并保留最后一帧            |
| `clear()`                   | 清除控制台上的所有输出                |

这些是 Ora 库中一些常用的方法，用于创建加载动画、显示成功、失败、警告和信息等消息，并提供其他控制台输出的功能。

希望这个表格对你有帮助。如果还有其他问题，请随时提问。

下面是 Inquirer.js 库中一些常用的方法和用法的表格展示：

| 方法                           | 描述                                                 |
| ------------------------------ | ---------------------------------------------------- |
| `prompt(questions)`            | 启动一个交互式命令行提示，接受一个问题数组作为参数。 |
| `registerPrompt(name, prompt)` | 注册自定义的提示类型                                 |
| `Separator([line])`            | 创建一个分隔符，用于在问题列表中创建分隔线           |
| `Question`                     | 问题对象的构造函数，用于创建各种类型的问题           |
| `ListQuestion`                 | 列表类型的问题，提供多个选项供用户选择               |
| `CheckboxQuestion`             | 多选类型的问题，提供多个选项供用户选择               |
| `ConfirmQuestion`              | 确认类型的问题，要求用户回答是或否                   |
| `InputQuestion`                | 输入类型的问题，要求用户输入文本                     |
| `NumberQuestion`               | 数字类型的问题，要求用户输入数字                     |
| `PasswordQuestion`             | 密码类型的问题，要求用户输入密码                     |
| `EditorQuestion`               | 编辑器类型的问题，要求用户输入多行文本               |

在 Inquirer.js 中，`prompt` 方法接受一个问题数组作为参数，每个问题对象都包含了一系列的属性来定义问题的类型、提示文本、默认值等。下面是一些常用的问题属性：

- `type`：指定问题的类型，可以是 `input`、`confirm`、`list`、`rawlist`、`expand`、`checkbox`、`password`、`editor` 等。
- `name`：问题的名称，用于标识问题的答案。
- `message`：问题的提示文本，显示给用户的信息。
- `default`：问题的默认值，如果用户没有输入答案，则使用默认值。
- `choices`：问题的选项，用于选择类型的问题，可以是一个字符串数组或者一个包含 `name` 和 `value` 属性的对象数组。
- `validate`：一个函数，用于验证用户输入的答案是否合法。
- `filter`：一个函数，用于对用户输入的答案进行处理或转换。
- `when`：一个函数或布尔值，用于指定是否显示该问题，可以根据之前的答案来决定是否显示该问题。

通过定义不同类型的问题和设置相应的属性，可以创建各种交互式的命令行提示。

希望这个信息对你有帮助。如果还有其他问题，请随时提问。