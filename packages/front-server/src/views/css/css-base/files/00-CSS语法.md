```javascript
<img src="https://source.unsplash.com/900x600/?nature,water,1">
```

随机图片

### CSS语法

```javascript
object-fit: cover;//对图片进行剪切，保留原始比例：
filter: blur(3px);//给图像设置高斯模糊
```

### js语法

```javascript
rectObject = object.getBoundingClientRect()//返回元素的大小及其相对于视口的位置
Math.abs(x)								//函数返回指定数字 “x“ 的绝对值
let prev = item.previousElementSibling || null//返回当前节点的前一个兄弟节点,没有则返回null.
let next = item.nextElementSibling || null//返回当前节点的后一个兄弟节点,没有则返回null.

//设定一个阈值，用这个阈值监听元素是否超过这个阈值
const observer = new IntersectionObserver(([e])=>{
    isPinned = (e.intersectionRatio<1)
    e.target.classList.toggle('pinned',(e.intersectionRatio<1))
},{threshold:[1]})//规定了一个监听目标与边界盒交叉区域的比例值
observer.observe(h2)//监听sticky被触发
```

### Vue

#### 获取元素信息

```javascript
//<div ref="element"></div>
let height= this.$refs.element.offsetHeight;
let height = parseInt(getComputedStyle(this.$refs.element).height)//只读，不可更改
let height = this.$refs.element.style.height;		//（非内联样式无法获取）
var fontSize=window.getComputedStyle(this.$refs.element,'::before').getPropertyValue('font-size');
//获取before伪元素的字号大小


textContent.replace(/\S/g,"<span>$&</span>")//替换标题里面的文字的标签
void h1.offsetWidth//当界面不重新计算的时候，强制界面重新计算
```

#### 获取window的scroll

```javascript
let top = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset
```

#### 获取元素offsetTop

```javascript
this.$refs.card.offsetTop
```



### js添加增删类

```javascript
element.classList.add("类名")；					//添加新的类名，如已经存在，取消添加

element.classList.remove("类名")；					//移除已经存在的类名
element.className = "类名"；					   //直接设定节点的类，覆盖其他的类
classList.toggle( className )；				 	//如果classList中存在给定的值，删除它，否则，添加它；
classList.replace( oldClassName，newClassName )；//类名替换
classList.contains( oldClassName );				 //确定元素中是否包含指定的类名，返回值为true 、false；
```

### 获取事件触发当前标签

```javascript
//Event 接口的只读属性 currentTarget 表示的，标识是当事件沿着 DOM 触发时事件的当前目标。它总是指向事件绑定的元素，而 Event.target 则是事件触发的元素。
li.addEventListener('click',e=>{//当将相同的事件处理程序附加到多个元素时 event.currentTarget 就很有用。
    e.currentTarget.classList.add('loading')
})

//触发事件的对象 (某个DOM元素) 的引用。当事件处理程序在事件的冒泡或捕获阶段被调用时，它与event.currentTarget不同。
li.addEventListener('mousemove',e=>{
    let item = e.target
})
```

### 为css属性添加一个新的值

style.setProperty(propertyName, value可选, priority);propertyName 是一个 DOMString ，代表被更改的CSS属性。
value可选 是一个 DOMString ，含有新的属性值。如果没有指定, 则当作空字符串。注意: value 不能包含 "!important" --那个应该使用 priority 参数.priority可选 是一个 DOMString 允许设置 "important" CSS 优先级。如果没有指定, 则当作空字

```javascript
next.style.setProperty('--scale', 1 + scale * offset)

font-size: calc(6rem * var(--scale));//css计算属性

e.target.classList.toggle('pinned',(e.intersectionRatio<1))//给class中的pinned添加属性
```

### 动态修改伪元素属性

```javascript
//第一种
//html
<span :style="spanStyle" class="span1">hello world</span>
<span :style="{'--width': widthVar}" class="span2">hello earth</span>
//vue
data() {
    return {
        spanStyle: {
            "--color": "red"
        },
        widthVar: "100px"
    };
}
//css
.span1 {
    color: var(--color);
}
.span2 {
    text-align: center;
    position: relative;
    width: var(--width);
}
.span2::after {
    width: var(--width);
    height: var(--width);
}


//第二种2
this.imageUrl = `url(...)`
this.$refs.lsc.style.setProperty("--imageUrl",this.imageUrl)


//sass中！！！！！！！！可以生效
 <button ref="button" :data-star="title">{{title}}</button>
 button{
        &::after{
            content: attr(data-star);
        }
 }
```

