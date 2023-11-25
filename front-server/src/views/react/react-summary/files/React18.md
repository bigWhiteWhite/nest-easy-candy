[React 新文档](https://zh-hans.react.dev/learn)

## 创建 strapi 模拟 api

[文档](https://strapi.io/)

```js
pnpm create strapi-app 文件名 --quickstart
```

## 初始化

```ts
pnpm create vite 项目名 --template 选择react就可以
```

## next 记录

### 获取数据

```jsx
//page里面可以使用getStaticProps或者getServerSideProps
export const getStaticProps = async () => {
	const res = await all_textbook.list({ page: 1, limit: 12 })
	return {
		props: { ...res.data } //不可以随意更改，不然会有500错误
	}
}
const AllTextBook = ({ data }) => {
	//组件内接收
	const [bookitem, setBookTtem] = React.useState(data)

	const test = async () => {
		//动态更改
		const { data } = await all_textbook.list({ page: 2, limit: 10 })
		setBookTtem(data.data)
		console.log(bookitem)
	}
}
```

```jsx
const Home = (props) => {
	console.log(props)
  return (
		//...
  )
}

Home.getInitialProps = async ({req}) => {
  const headers = req.headers
  let {qus_bank_user} = cookie.parse(req ? headers.cookie || "" : document.cookie)
  return { ...headers }//一定要返回解构的一个对象
}

```

```jsx
//组件无法使用getStaticProps或者getServerSideProps
const TeachDetailContent = ({id}) => {
    const [bookchaptertitle,setBookChapterTitle] = React.useState(null)
    const [bookchapter,setBookChapter] = React.useState(null)

    const getChapterByBook = async () => {//异步函数获取数据
        const {data} = await all_textbook.getChapterByBookId({id})
        return data.data//返回promise
    }
    React.useEffect(() => {
        if(id){
            getChapterByBook().then((data) => {//解析promise
                setBookChapter(data)//将值赋给useState托管
                const titles = data.map((item) => {
                    return item.title
                })
                setBookChapterTitle(titles)//将值赋给useState托管
            })
        }
    },[])
}

//没有参数的情况,有别的组件依赖于这个数据，就使用then(待验证)
const [allcourse,setAllCourse] = React.useState(Array) as any
const getCourseList = async () => {//获取所有教师课程
    const {data} = await all_course.list()
    return data.data
}
React.useEffect(() => {
    getCourseList().then(res =>{
        setAllCourse(res)
    })
},[])
//没有参数的情况
const [allcourse,setAllCourse] = React.useState(Array) as any
const getCourseList = async () => {//获取所有教师课程
    const {data} = await all_course.list()
   	setAllCourse(data.data)
}
```

`有的时候，刷新usestate里面的数据不会保存，在useEffect里面监测一个数据，保证每次都会触发，更新usestate里面的数据`

```jsx
const [coursetitle,setCourseTitle] = React.useState('')

const {tab,course_id} = router.query as any

React.useEffect(() => {
        if(!course_id) return
    getCurriculumTitle().then(res =>{
        if(res.status === 10000) setCourseTitle(res.data)
        console.log(coursetitle);
    })
},[course_id])//监测路由变化，路由变化就触发
```

### router-view

```jsx
const swich_page = () =>{
    switch (native){
        case 0 :
        	return <Published/>
        case 1 :
        	return <NoSubscribed/>
        case 2 :
        	return <Subscribed/>
        default:
        	return <Published/>
    }
}
...
return (
	//...
    <div>
        {swich_page()}
    </div>
)
```

## API

### div 实例

- React 是使用单括号的， 有一些双括号其实是指传进去了对象，如 style

```tsx
const tip = () => {
	alert('123')
}
<div id='button', type='button', className: 'name', style={{ background: 'red' }}, onClick={ tip }></div>
<div onClick={()=> alert(123)}></div>

// 解析HTML
<div dangerouslySetInnerHTML={{__html:item.title}}></div>
// Array对象生成数组
{
	new Array(4).fill({ name: 1 }).map((item, index) => <span key={index}>{item.name}</span>)

	const aaa = new Array(4).fill({name: 1}).map((item, index) =>
		<Child key={index} :name={item.name}></Child>
	)

    return <Fragment>
        {aaa}
    </Fragment>
}
```

### createRoot

```tsx
// 用来创建React元素,参数(元素的名称，必须小写; 元素的属性，如id; 元素的内容:子元素)
// React元素最终会通过虚拟DOM转换为真实的DOM元素,React元素一旦创建就无法修改,只能通过新创建的元素进行替换
// 设置事件时，属性名需要修改为驼峰命名法
const button = React.createElement(
    'button',
    { id: 'button', type: 'button', className: 'name', onClick:{ ()=> { alert(123) } },
    '我是按钮'
)
// createRoot用来创建React的根容器，容器用来放置React元素， render函数首次调用的时候，容器节点里所有的DOM元素都会被替换，后续的调用则会使用React的DOM差分算法进行高效的替换,不会修改容器节点(只会修改容器的子节点)。可以在不覆盖现有子节点的情况下，将组件插入已有的DOM节点中
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
// 将React元素在根元素中渲染
root.render(button)
```

### children 多个 div 注入

```tsx
const RotateCard = ({ children }) => {
	return (
		<Fragment>
			<div className="card">
				{children[0]}
				{children[1]}
			</div>
		</Fragment>
	)
}
```

### 组件

```tsx
// 函数式组件 -- 组件的首字母必须是大写
const Component = () => {
	return <div>函数式组件</div>
}
export default Component

// 类组件 -- 必须添加一个render()方法，且方法的返回值一定是jsx
class App extends React.Component {
	render() {
		return <div>类组件</div>
	}
}
export default component
```

### 绑定事件

- 在 React 中事件需要通过元素的属性来设置
  - 和 Vue 使用@绑定事件不同，在 React 中事件的属性需要使用驼峰命名法: @click --> onClick
  - 属性值不能直接执行代码，如果需要在属性值里面直接写简单的逻辑，需要一个回调函数，复杂逻辑的话直接传递函数就可以了
- 在 React 中，无法通过 return false 取消默认行为 -- return false
  - 如果想要向函数里面传递**参数**，需要使用到**箭头函数**
  - 事件对象
    - React 事件中同样会传递事件对象，可以在响应函数中定义参数来接收事件对象
    - React 中的事件对象同样不是原生的事件对象，是经过 React 包装后的事件对象
    - 由于对象进行过包装，无需考虑兼容性问题
  - 可以通过调用**event 对象来阻止默认行为或者冒泡**([event](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.event.html)有很多类型)
    - 如果想要向函数里面传递**event**，也需要使用到**箭头函数**

```tsx
const tip = (event: React.FormEvent<EventTarget>, params) => {
	console.log(event, params)
    event.preventDefault() // 取消默认行为
    event.stopPropagation() // 取消冒泡
}
<button onClick={ ()=> { alert(123) }}>click me</button>
<button onClick={ tip }>click me</button>
<button onClick={ () => tip('asjdkajsd') }>click me</button>
<button onClick={(event) => tip(event, '123')}>click me</button>
```

### 双向绑定

```tsx
const [state, setState] = useState({
    time: '',
    count: 0
})
<input type="text" value={state.count} onChange={(e) => setState({ ...state, count: e.target.value })} />
```

### Portals

[官方文档](https://zh-hans.reactjs.org/docs/portals.html#gatsby-focus-wrapper)

- Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。

  - 第一个参数（`child`）是任何[可渲染的 React 子元素](https://zh-hans.reactjs.org/docs/react-component.html#render)，例如一个元素，字符串或 fragment。第二个参数（`container`）是一个 DOM 元素。

  - ```tsx
    ReactDOM.createPortal(child, container)

    // 实例
    const container = document.getElementById('container')
    const Back = ({ name }) => {
    	return ReactDOM.createPortal(<div>{name}</div>, container)
    }
    ```

### 父子组件传值

**父=>子**

- **子组件改变父组件的值**,传递函数,子组件调用父组件的函数改变父组件的值

```jsx
// 父组件
const [count, setCount] = useState(0)
const getActive = (active) => {
	setNative(active)
}
;<Child getActive={getActive} count={count} /> //直接传递
// 子组件
const Child = ({ getActive, count }) => {
	//在props中接收
	console(getActive(index))
	return (
		<Fragment>
			<div className="Child">{count}</div>
		</Fragment>
	)
}
```

**子=>父**

[博客](https://jiangweishan.com/article/react20220824.html)

- 使用**useImperativeHandle**和**forwardRef**

  - 子组件返回方法和变量，父组件调用

  - **默认情况下，不能在函数组上使用 ref 属性, 因为他们没有实例。**但**结合 forwardRef 方法**我们就可以在函数组件上使用 ref

  - ```tsx
    // 父组件
    const child = useRef()
    <Child array={list} ref={child} /> // 绑定子组件

    // 子组件
    import React,{ forwardRef, useImperativeHandle } from 'react'// 使用useImperativeHandle
    const Child = forwardRef((props, ref) => {
        useImperativeHandle(ref,() => ({
            fun:() => {
                return value//想要返回的值
            }
        }))
    });

    // 返回异步函数
    const getData = async () => {...} // 子组件
    const Child = forwardRef((props, ref) => {
        useImperativeHandle(ref,() => ({
            getData
        }))
    });

    const getChildValue = ()=>{ // 父组件
        if(!child.current) return
        child.current.getData().then((num) => {
            console.log(num);
        })
    }
    ```

- **子组件调用父组件方法**改变父组件的 state

  - 立刻改变 state 的值

  - ```tsx
    //	parent
    const [state, setState] = useState({ num: '1'})
    <Child setAbc={(num: string) => setState((_) => ({ ..._, num }))}></Child>

    // child
    <button onClick={() => setAbc('88888')}>1111111111111</button>
    ```

  -

  - ```tsx
    // 函数式组件不支持,类组件不知道
    // 父组件
    ;<NavBarX
    	item={item}
    	current={current}
    	getBatchDetails={(id) => this.getBatchDetails(0, id)}
    	setId={(id, callback) => this.setState({ id }, callback)}
    	onRef={this.onNavBarXRef}
    />
    // 子组件
    this.props.setId(prePageId, () => {
    	getBatchDetails(prePageId)
    })
    ```

### memo

如果你的组件在相同 props 的情况下渲染相同的结果，那么你可以通过将其包装在 `React.memo` 中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。

`React.memo` 仅检查 props 变更。如果函数组件被 `React.memo` 包裹，且其实现中拥有 [`useState`](https://zh-hans.reactjs.org/docs/hooks-state.html)，[`useReducer`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer) 或 [`useContext`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecontext) 的 Hook，当 state 或 context 发生变化时，它仍会重新渲染。

- React.memo()是一个高阶组件，它接收另外一个组件作为参数，并且返回一个包装过的新组件

- react 组件在 state 或者父组件发生变化的时候都会重新渲染，哪怕子组件完全静态，没有 props。

- 使用 memo，那么就只有**在依赖父组件的 props 或者自身 state 发生变化时重新渲染**

- 此方法仅作为性能优化的方式而存在。但请不要依赖它来“阻止”渲染，因为这会产生 bug。

  - ```tsx
    // 函数式组件 -- 组件的首字母必须是大写
    const Component = () => {
    	return <div>memo</div>
    }
    export default React.memo(Component)
    ```

### Context

[文档](https://zh-hans.reactjs.org/docs/context.html)

- Context **提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。**

- 在一个典型的 React 应用中，数据是通过 props 属性自上而下（由父及子）进行传递的，但此种用法对于某些类型的属性而言是极其繁琐的（例如：地区偏好，UI 主题），这些属性是应用程序中许多组件都需要的。Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props。

  - ```tsx
    // 函数式组件使用context
    import { createContext } from 'react'
    export const Context = createContext({ theme: '123', toggleTheme: () => {} })
    // 传递组件
    const Parent = () => {
    	const [theme, setTheme] = useState('dark')
    	const toggleTheme = () => {
    		setTheme(() => 'light')
    	}

    	return (
    		<Fragment>
    			<Context.Provider value={{ theme, toggleTheme }}>
    				<Child />
    			</Context.Provider>
    		</Fragment>
    	)
    }
    // 接受组件
    import { Context } from './parent'
    const Child = () => {
    	// 使用use的形式
    	const ctx = useContext(Context)
    	return (
    		<Fragment>
    			{/* 使用use的形式 */}
    			<div>
    				{ctx.theme}
    				<button onClick={ctx.toggleTheme}>toggleTheme</button>
    			</div>
    			{/* 使用consumer的形式 */}
    			<Context.Consumer>
    				{
    					// 函数接受
    					({ theme, toggleTheme }) => (
    						<div>
    							{theme}
    							<button onClick={toggleTheme}>toggleTheme</button>
    						</div>
    					)
    				}
    			</Context.Consumer>
    		</Fragment>
    	)
    }
    ```

- 注意！**如果只是想避免层层传递，而中间传递层并不需要这些数据，那么有更好的方法，而不是使用 context**。(如果你只是想避免层层传递一些属性，组件组合（component composition）有时候是一个比 context 更好的解决方案)

```tsx
// 现在，我们有这样的组件：
<Page user={user} avatarSize={avatarSize} />
// ... 渲染出 ...
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}
// ...
<PageLayout userLink={...} />
// ... 渲染出 ...
<NavigationBar userLink={...} />
// ... 渲染出 ...
{props.userLink}
```

### Use

[文档](https://zh-hans.reactjs.org/docs/hooks-reference.html#usestate)

#### useState-useEffect-useRef

##### **useState**

- **`调用 useState` 方法的时候做了什么?** 它定义一个 “state 变量”。这是一种在函数调用时保存变量的方式 —— `useState` 是一种新方法，它与 class 里面的 `this.state` 提供的功能完全相同。一般来说，在函数退出后变量就会”消失”，而 state 中的变量会被 React 保留。

- **`useState` 需要哪些参数？** `useState()` 方法里面唯一的参数就是初始 state。不同于 class 的是，我们可以按照需要使用数字或字符串对其进行赋值，而不一定是对象。在示例中，只需使用数字来记录用户点击次数，所以我们传了 `0` 作为变量的初始 state。（如果我们想要在 state 中存储两个不同的变量，只需调用 `useState()` 两次即可。）

- `useState` 方法的返回值是什么？数组解构， **useState 返回一个数组，数组第一个值为当前 state ，第二个值为以及更新 state 的函数**。

```tsx
import React, { useState } from 'react'
const Example = () => {
	// 声明一个叫 “count” 的 state 变量
	const [count, setCount] = useState(0)
	return (
		<div>
			{/* 读取State */}
			<p>You clicked {count} times</p>
			{/* 更新State */}
			<button onClick={() => setCount(count + 1)}>Click me</button>
		</div>
	)
}

// 声明多个 state 变量
const [age, setAge] = useState(42)
const [fruit, setFruit] = useState({ name: 'banana' })
const [todos, setTodos] = useState([{ text: '学习 Hook' }])
```

- setState 方法是异步执行的，如果说一个函数中多次调用 setState，那么不会每一次都渲染，只会调用最后一次。异步执行就会有一个问题，当调用 setState 需要用到旧的 state 的时候， 有可能出现计算错误的情况，如果把 setState 方法放在定时器里面，问题就会很明显

- 可以通过 setState 调用回调函数的情况来修改 state，函数就会立刻执行, 回调函数的返回值会成为新的 state 值

  - ```tsx
    const Example = () => {
    	// 声明一个叫 “count” 的 state 变量
    	const [count, setCount] = useState(0)
    	const test = () => {
    		setTimeout(() => {
    			// 快速点击两下，结果是1,而不是2，因为两次获取到的旧count都是0
    			setCount(count + 1)
    		}, 1000)
    		// setCount((newCount) => newCount + 1)
    	}
    	return (
    		<div>
    			<p>You clicked {count} times</p>
    			<button onClick={test}>Click me</button>
    		</div>
    	)
    }
    ```

- setState 函数相当于 componentDidUpdate 函数，和生命周期的函数类似

  - setState 是异步的！不保证数据的同步。

  - setState 更新状态时可能会导致页面不必要的重新渲染，影响加载。

  - setState 管理大量组件状态也许会导致不必要的生命周期函数钩子调用。

  - ```tsx
    // 不是最新数据
    const [state, setState] = useState({foo: 1})
    setState({foo: 2});
    console.log(state.foo) // 2

    this.setState({foo: 123}, ()=> {
     console.log(state.foo) // 123
    });
    // 函数式组件
    setState((value) => {...value, foo: 4})
    ```

**useState 中的对象和数组**

```jsx
const [workobject,setWorkObject] = React.useState({//对象
    type:'单选'
})
setWorkObject({...workobject,type: "多选",});
setWorkObject(item => ({...item,type: "多选",}));

//数组尾部添加一项
this.setState([...array, item]);
setAnswer([...answer,{id,show:true}])//添加对象
//数组头部添加一项
this.setState([item, ...array]);
//修改对象中某项
this.setState({
  object: {...object, key: value}
});
//删除数组首位
array.splice(manu.length - 1);
setZManu([...manu])
//删除数组尾部
array.splice(array.length - 1);
this.setState({
  array
});
//删除数组任意一项
array.splice(index, 1);
this.setState({
  array
});
//对象中数组尾部添加一项
this.setState({
  array: [...array, item]
});
//对象中数组头部添加一项
this.setState({
  array: [item, ...array]
});
//数组任意位置添加一项
array.splice(index, 0, item);
this.setState({
  array
});
//修改对象中数组任意一项中值
function updateArrayItem(index, key, value) {
  this.setState({
    array: array.map((item, _index) => _index == index ? {...item, [key]: value} : item)
  });
}
//复杂类型修改
this.setState(prevState => return newState);
//使用其索引更新useState中的数组
const onClickHandler = (n) => {//1
    const arr = [...myCustomArray];
    arr[n]='something';
    setMyCustomArray(arr);
}
const arr = [...manu]//2
arr[0].link= `/homework_system/workbench?identity=${2}`
setZManu([...arr])

//
const [answer,setAnswer] = React.useState([]) as any
setAnswer((answer)=>{//要使用函数的方式，如果直接赋值要点击两次，赋值不及时
    const arr = [...answer]
    if(answer[index]){
        arr[index]=!answer[index]
    }else{
        arr[index] = true
    }
    return arr
})
//对象改变多个值，要使用函数的方式，useEffect才会及时监听到，除了useEffect其他的函数都不能及时监听，
const new_pagelimit = {...pagelimit} //1
new_pagelimit.page = pagination.current
new_pagelimit.limit = pagination.pageSize
setPageLimit(new_pagelimit)

setStuChoose((item)=>{//2
    let newStuChoose = {...item}
    newStuChoose.title = value
    return newStuChoose
})
useEffect(() => {//要使用函数的方式，useEffect才会及时监听到
    getChapterByBookId()
    selQuestionListInStudent()
},[pagelimit,stuchoose])
```

##### **useEffect**

[文档](https://zh-hans.reactjs.org/docs/hooks-effect.html)

- **useEffect 内部变量发生改变时调用**

  - 可以把 **useEffect** Hook 看做 `componentDidMount`，`componentDidUpdate` 和 `componentWillUnmount` 这三个函数的组合。

  - **useEffect 做了什么？** 告诉 **React 组件需要在渲染后执行某些操作**。React 会保存你传递的函数（称之为 “effect”），并且在执行 DOM 更新之后调用它。

  - **为什么在组件内部调用 `useEffect`？** 将 `useEffect` 放在组件内部可以在 effect 中直接访问 `count` state 变量（或其他 props）。我们不需要特殊的 API 来读取它 —— 它已经保存在函数作用域中。Hook 使用了 JavaScript 的闭包机制，而不用在 JavaScript 已经提供了解决方案的情况下，还引入特定的 React API。

  - **useEffect**会在每次渲染后都执行吗？是的，默认情况下，它在第一次渲染之后*和*每次更新之后都会执行。你可能会更容易接受 effect 发生在“渲染之后”这种概念，不用再去考虑“挂载”还是“更新”。React 保证了每次运行 effect 的同时，DOM 都已经更新完毕。

  - ```tsx
    function Example() {
    	const [count, setCount] = useState(0)
    	// 每次count发生改变都是调用useEffect
    	useEffect(() => {
    		document.title = `You clicked ${count} times`
    	})
    }
    ```

- 需要清除的 effect

  - effect 返回一个函数，React 将会在执行清除操作时调用它

  - 这是 effect 可选的清除机制。每个 effect 都可以返回一个清除函数。如此可以将添加和移除订阅的逻辑放在一起。它们都属于 effect 的一部分。

  - **何时清除, React 会在组件卸载的时候执行清除操作**。effect 在每次渲染的时候都会执行。这就是为什么 React *会*在执行当前 effect 之前对上一个 effect 进行清除

  - **仅在数组里面的参数发生变化才会出现执行，如果数组中有多个元素，即使只有一个元素发生变化，React 也会执行 effect。**

  - ```tsx
    const [count, setCount] = useState(1)
    useEffect(() => {
    	function handleStatusChange(status) {
    		setIsOnline(status.isOnline)
    	}
    	ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange)
    	// Specify how to clean up after this effect:
    	return function cleanup() {
    		ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange)
    	}
    }, [count])
    ```

##### **useRef**

- `useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数（`initialValue`）。返回的 ref 对象在组件的整个生命周期内持续存在。

```tsx
function TextInputWithFocusButton() {
	const inputEl = useRef(null)
	const onButtonClick = () => {
		// `current` 指向已挂载到 DOM 上的文本输入元素
		inputEl.current.focus()
	}
	return (
		<>
			{/* ref是固定的名称，不可以随便写 */}
			<input ref={inputEl} type="text" />
			<button onClick={onButtonClick}>Focus the input</button>
		</>
	)
}
```

#### useReducer

- [`useState`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usestate) 的替代方案。当 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等。并且，使用 `useReducer` 还能给那些会触发深更新的组件做性能优化，因为[你可以向子组件传递 `dispatch` 而不是回调函数](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down) 。

  - ```tsx
    // action接受从dispatch传进来的参数,dispatch只能使用一个形参，如果有多个需要传递，可以传递对象
    const reducer = (state, action) => {
    	switch (action.type) {
    		case 'increment':
    			return { count: state.count + 1 }
    		case 'decrement':
    			return { count: state.count - 1 }
    		default:
    			throw new Error()
    	}
    }

    const [state, dispatch] = useReducer(reducer, { count: initialCount })
    ```

- 惰性初始化

  - 你可以选择惰性地创建初始 state。为此，需要将 `init` 函数作为 `useReducer` 的第三个参数传入，这样初始 state 将被设置为 `init(initialArg)`。

  - ```tsx
    function init(initialCount) {
    	return { count: initialCount }
    }

    function reducer(state, action) {
    	switch (action.type) {
    		case 'increment':
    			return { count: state.count + 1 }
    		default:
    			throw new Error()
    	}
    }

    function Counter({ initialCount }) {
    	const [state, dispatch] = useReducer(reducer, initialCount, init)
    	return (
    		<>
    			Count: {state.count}
    			<button onClick={() => dispatch({ type: 'reset', payload: initialCount })}>Reset</button>
    		</>
    	)
    }
    ```

  -

[文档](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer)

#### useCallback-useMemo

##### useCallback

- useCallback 是一个钩子函数，用来创建 React 中的回调函数，用此方式创建的回调函数不会总在组件重新渲染的时候重新创建

- useCallback 接收两个参数，第一个为回调函数，第二个为依赖数组，当不传入依赖数组的时候，和普通的回调函数一样，会在组件重新渲染的时候重新创建,当传入空数组时，只会在组件中渲染完成后加载一次

- ```tsx
  const memoizedCallback = useCallback(() => {
  	doSomething(a, b)
  }, [a, b])
  ```

#### useImperativeHandle-useLayoutEffect

**useImperativeHandle**

**子=>父**

```tsx
// 父组件
const child = useRef()
<Child array={list} ref={child} /> // 绑定子组件

// 子组件
import React,{ forwardRef, useImperativeHandle }from 'react'// 使用useImperativeHandle
const Child = forwardRef((props, ref) => {
    useImperativeHandle(ref,() => ({
        fun:() => {
            return value//想要返回的值
        }
    }))
});


// 如果有回调依赖的话
// 子组件
const getData = async () => {...}
const Child = forwardRef((props, ref) => {
    useImperativeHandle(ref,() => ({
        getData
    }))
});
// 父组件
const getChildValue = ()=>{
    if(!child.current) return
    child.current.getData().then((num) => {
        console.log(num);
    })
}
```

#### useDebugValue-useDeferredValue

#### useTransition-useId

#### useSyncExternalStore-useInsertionEffect

## react 路由

[文档](https://reactrouter.com/en/main/router-components/browser-router)

**基本使用**

```tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.less'

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/parent" element={<Parent />}>
					{/* 嵌套子路由,index为默认挂载子路由 */}
					<Route index element={<Index />}></Route>
					<Route path="child" element={<Child />}></Route>
					<Route path="child" element={<Child />}></Route>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
```

## redux-toolkit

**安装**

```js
pnpm add react-redux @reduxjs/toolkit
```

**模块**

```tsx
import { createSlice } from '@reduxjs/toolkit'
const main = createSlice({
	name: 'main', // 用来自动生成action中的type
	initialState: {
		name: 'bigWhite'
	},
	reducers: {
		// 指定state的各种操作，直接在对象中添加方法
		setName(state, { payload }) {
			state.username = payload
		}
	}
})
// 切片对象会自动的帮助我们生成action，actions中存储的是slice自动生成action创建器(函数)，调用函数后会自动创建actions对象
export const { setName } = main.actions // setName() --> { type: name/函数名, payload: 函数的参数 }

export default main.reducer
```

**出口文件**

```tsx
import { configureStore } from '@reduxjs/toolkit'
import mainSlice from './slices/main'

const store = configureStore({
	reducer: {
		main: mainSlice // main为组件引入state的切片名
	}
})

export default store
```

**引入 Provider**

```tsx
import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.less'
import store from './store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
)
```

**组件中使用**

```tsx
import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { setName } from '@/store/slices/main'
const Parent = () => {
	// useSelector用来加载store中的state
	const main = useSelector((state: any) => state.main)
	// const { main } = useSelector((state: any) => state)
	const dispatch = useDispatch()

	return (
		<Fragment>
			<div>
				{JSON.stringify(main)}
				{main.username}
				<button onClick={() => dispatch(setName('bigWhite02'))}>dispatch改变值</button>
			</div>
		</Fragment>
	)
}

export default Parent
```

### 持久化

安装

```tsx
pnpm add redux-persist
```

**store/index.ts**

```tsx
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import mainSlice from './slices/main'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistedReducer = persistReducer(
	{
		key: 'root', // 存储名称
		storage,
		// 指定哪些reducer数据持久化
		whitelist: ['main']
	},
	combineReducers({
		main: mainSlice
	})
)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
			}
		})
})

export const persistor = persistStore(store)
```

**引入 Provider**

```tsx
import React from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.less'
import { store, persistor } from './store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<App />
			</PersistGate>
		</Provider>
	</React.StrictMode>
)
```

```tsx
console.log(localStorage.getItem('persist:root'))
```
