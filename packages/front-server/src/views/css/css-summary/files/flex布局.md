# flex布局-dispaly-flex

## 父元素

### 控制主轴和主轴的方向

####   flex-direction

```javascript
 row             //从左到右的x轴(正方向的x轴)
 row-reverse     //从右到左的x轴(反方向的x轴)
 column          //正方向的y轴
 column-reverse  //反方向的y轴
```

### 侧轴的方向-flex-wrap

```javascript
 nowrap			//不换行
 wrap			//侧轴方向由上而下   （flex-shrink失效）
 wrap-reverse	//侧轴方向由下而上   （flex-shrink失效）
```

#### flex-flow

```javascript
//flex-direction和flex-wrap的简写属性
flex-flow:row wrap
```

### 富裕空间的管理

####  主轴-justify-content



```javascript
flex-start     	//在主轴的正方向
flex-end       	//在主轴的反方向
center        	//在两边
space-between  	//在项目之间
space-around   	//在项目两边
```

#### 侧轴-align-items

```javascript
flex-start  	//在侧轴的正方向
flex-end       	//在侧轴的反方向
center         	//在两边
baseline：      //基线对齐
strecth：       //等高布局(项目没有高度)
```

#### 侧轴-align-content

处理单行的时候使用

```javascript
flex-start     	//在侧轴轴的正方向
flex-end       	//在侧轴的反方向
center        	//在两边
space-between  	//在项目之间
space-around   	//在项目两边
```

## 子元素



### 弹性空间管理-flex-grow

```javascript
flex-grow		//弹性因子（默认值为0）
```

### flex的简写属性

```javascript
//有扩大缩小，第三个参数就不重要了，都是填充
flex：1   	   //1 1 0% 扩大 缩小 基准 撑满剩余的空间
flex:auto		//1 1 auto		基准值为auto，其实允许扩大缩小，后面的基准值已经没用了
flex:none		//0 0 auto		不允许扩大缩小，基准值为auto，也就是元素原来的宽度生效
flex: 1 30px;	//flex-grow | flex-basis
flex: 2 2;		//flex-grow | flex-shrink
flex: 2 2 10%;	//扩大 缩小 基准 grow | shrink | basis 
```

#### flex-basis

控制flex上元素的大小，为0时，将元素本来的大小清0，重新分配 	默认值：auto 

```css
width:30px; /*会被flex-basis覆盖掉*/
flex-basis:50px;
flex-basis:30%;
```



#### flex-grow  

控制如何分配富裕空间，为1时，每一个元素分配到的富裕空间都一样	默认值为0

```javascript
//假设父级盒子400px的宽度，一个子盒子宽度为50，一个为100，那么富裕空间为250px，两个子盒子的flex-grow都为1，那么就代表着，他们都占富裕空间的1/2，也就是250/2=125px，50宽度的盒子加上125px为175px，100宽度的加上125px为225px，如果是4个子盒子，那么就是1/4。
```

#### flex-shrink  

设置弹性盒子的缩小比率

```javascript
//默认是auto，所以说弹性盒子的子盒子宽度大于父盒子的时候会自动缩小
flex-shrink:0		//不允许缩小
//假设父级盒子400px的宽度，一个子盒子宽度为200，一个为400，那么超出空间为200px，一个子盒子的flex-shrink为1，一个为3，那么就代表着，超出空间分为4份，一个占1份，一个占3份，再用原来的宽度减去这个超出的空间，200/4=50，第一个子盒子为200-50=150px，第二个子盒子为400-150=250px
```



### 案例

#### 指定几个div平均占据一行

```html
<div class="test flex bg-pink-500 w-full flex-wrap justify-content-around " style="color:#5292c6">
    <div class="w-1-3 bg-blue-500 border-solid border-1" v-for="item in 8" style="height:100px;">
    </div>
</div>
.test{
    &::after{
        content: " ";
        height: 0;
        width: 33.3%;
    }
}
```

# table布局-table

## 属性

```css
display: table				/*表格*/
display: table-row 			/*表格行*/
display: table-header-group /*表格标题组,html标签<thead>*/
display: table-row-group 	/*表格行组,html标签<tbody>*/
display: table-footer-group	/*表格脚注组,html标签<tfoot>*/
display: table-column 		/*表格列*/
display: table-column-group /*表格列组显示,html标签<colgroup>*/
display: table-cell 		/*表格单元格*/
display: table-caption 		/*表格标题,html标签<caption>*/
```

## 特性

```javascript
//CSS table布局的超强特性：缺少的表格元素会被浏览器以匿名方式创建,如果我们为元素使用“display:table-cell;”属性，而不将其父容器设置为“display:table-row;”属性，浏览器会默认创建出一个表格行，就好像文档中真的存在一个被声明的表格行一样。

//如果某个元素已经被设置为“display:table-cell;”，而它的父节点（包含它的容器）没有被设置为“display:table-row;”属性，那么浏览器将会创建一个被设置为“display:table-row;”的匿名盒对象来嵌套它。并且与之相邻的属性为“display: table-cell;”的兄弟节点也都会被这个匿名盒对象所包含，直到碰到一个没有被设置为“display: table-cell;”的元素而结束这一行。

//也就是可以不用设置行，而直接使用单元格，而使用单元行以后，单元行的高度会默认是表格的高度，又传递给单元格，所以单元格的高度就不管用了，而在下面一种情况中就可以看出来
```

```html
<div class="table bg-blue-300 w-full" style="color:#5292c6;height:200px">
    <!--隔开以后，table-cell就不会是table的高度-->
    <div><!--class="table-row"-->
        <div class="table-cell border-1 border-solid ver-middle bg-pink-200 w-1-4 h-1-2" v-for="item in 8" style="height:100px;">
            dfsdf
        </div>
    </div>
</div>
```



### 垂直居中方式

设置为table-cell以后，就像单元格一样自动撑满高度，所以说子元素设置高度是不生效的

单元格的宽度会自动撑满

再加上vertical-middle，子元素里面的内容也垂直居中

```html
<div class="table bg-blue-300 w-full" style="color:#5292c6;height:200px">
    <div class="table-cell border-1 border-solid ver-middle bg-pink-200 w-1-4" v-for="item in 4">
        我是高度
	</div>
</div>
```

