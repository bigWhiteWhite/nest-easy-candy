- ```js
  npm i react-redux redux redux-devtools-extension redux-thunk
  ```

- 复制 redux 文件夹

- 更改\_app.tsx

- ```js
  import '@/styles/globals.css'
  import '@/styles/sass/index.scss'
  import '@/styles/swiper.scss'
  import React from 'react'
  import { Provider } from 'react-redux'
  import store from '../redux/store'
  import { setCssCdn, setJsCdn } from '@/utils/setIntroduction'
  import rem from '@/utils/rem'

  const App = ({ Component, pageProps }) => (
  	React.useEffect(() => {
  		// 设置批量加载第三方 icon 图标
  		setCssCdn()
  		// 设置批量加载第三方 js库
  		setJsCdn()
  		//重新设置rem
  		rem(document, window)
  	}, []),
  	(
  		<Provider store={store}>
  			<Component {...pageProps} />
  		</Provider>
  	)
  )

  export default App
  ```

- 使用:那个组件要使用就引入 connect，值会传给 props

- ```js
  import { connect } from 'react-redux'
  import { increment } from '@/redux/actions/count'
  export default connect(
  	//mainReducer是reducer所有的函数暴露出来的返回值，serisLogin要使用就在组件的props中引入
  	//console.log检查会有延迟，加个定时器，不要相信console.log！
  	(state: any) => ({
  		//初始化状态
  		serisLogin: state.mainReducer
  	}),
  	{
  		//操作状态,从actions中引入
  		increment
  	}
  )(Home)
  ```
-
