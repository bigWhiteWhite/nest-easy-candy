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

### 父子组件传值

**子=>父**

```jsx
//父组件
const child = React.useRef() as any

<Tabbar array={lis} cRef={child}/>//绑定子组件

const getChildValue = ()=>{
    if(!child.current) return
	const res = child.current.fun()//调用子组件函数
}


//子组件
import React,{useImperativeHandle}from 'react'//使用useImperativeHandle


useImperativeHandle(cRef,() => ({
    fun:() => {
        return value//想要返回的值
    }
}))
//...


//如果有回调依赖的话
//子组件
const selQuestionListInTeacher = async () => {//根据书的Id取题
    const {data} = await all_textbook.selQuestionListInTeacher({page,limit,body:{
        bookId:id
    }})
    const {total} = data.data
    setTopicArray(data.data.data)
    return total
}

useImperativeHandle(cRef,() => ({
    fun:() => {
        return selQuestionListInTeacher().then((total) => {
            return total
        })
    }
}))
//父组件
const getChildValue = ()=>{
    if(!topic.current) return
    topic.current.fun().then((num) => {
        console.log(num);

    })//调用子组件函数
}
```

**父=>子**

```jsx
//父组件
const getActive = (active) => {
        console.log(active);
        setNative(active)
}
<Tabbar getActive={getActive}/> //直接传递
//子组件
const Tabbar = ({getActive}) => {//在props中接收
    ...getActive(index)}
}
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

### 解析 HTML

```jsx
<div dangerouslySetInnerHTML={{ __html: item.title }}></div>
```

### useState 中的对象和数组

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

### 判断数组中是否有某一个值

```jsx
const showAnswer = (id) => {
	//使用hasSet
	let temp = new Set(answer)
	const isShow = temp.has(id)
	return isShow
}

manu.forEach((item) => {
	//使用indexof
	if (aspath.indexOf(item.link) != -1) setLiActive(item.id)
})
```

### Array 对象生成数组

```jsx
{
	new Array(4).fill({}).map((item, index) => {
		return <span className="blob-btn__blob" key={index}></span>
	})
}
```

### window

```jsx
//使用引入的组件的时候，会报document不存在或者window不存在
//引入的时候不使用服务端渲染
const ReactQuill = dynamic(() => import('@/components/codeEdited/react-quill'), { ssr: false })
```

### children 多个 div 注入

```jsx
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

### 点赞

```jsx
//将点赞弄成组件
const LinkBtn = ({like,id,token}) => {
    const [status,setStatus] = useState(like)//默认
	//...
    <i className={['iconfont icon-dianzan1 cursor-pointer',status?'text-red-500':null].join(' ')} onClick={()=>linkChange()}></i>
}
```
