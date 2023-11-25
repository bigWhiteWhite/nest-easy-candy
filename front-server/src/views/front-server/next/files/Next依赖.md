```js
npx create-next-app --typescript my_first_next  //下载

npm i sass   //引入sass,然后在next.config.js中配置，官网有

```

## 引入 ant-design

```js
npm install --save antd babel-plugin-import @babel/plugin-proposal-decorators @zeit/next-css
```

**创立 babel.config.js 文件**

在根目录下咱们新建一个 babel.config.js 文件用来配置 babel 配置

```js
//babel.config.js
module.exports = {
	presets: ['next/babel'],
	plugins: [
		[
			//css的按需引入重点
			'import',
			{
				libraryName: 'antd',
				libraryDirectory: 'lib',
				style: function (name) {
					// console.log(name);
					return `${name}/style/index.css`
				}
			}
		],
		[
			'import',
			{
				libraryName: '@ant-design/icons',
				libraryDirectory: 'lib/icons',
				camel2DashComponentName: false
			},
			'@ant-design/icons'
		]
	]
}
//presets是应用next.js自带的babel配置,plugins则是咱们新增的babel配置
//别离是给antd的款式引入与其icon引入应用的；
```

## 引入代码编辑器

https://www.npmjs.com/package/react-ace

https://www.iiter.cn/blogs/5

https://github.com/securingsincity/react-ace/blob/master/docs/Ace.md

```jsx
//npm install react-ace ace-builds
//服务端渲染编辑器,编辑器如果正常倒入是可以被渲染的，但是当进行页面刷新的时候，服务端会获取不到navigator变量，所以合理的办法是异步引入编辑器
const CodeEdited = dynamic(import('@/components/codeEdited'), { ssr: false })

//代码
```
