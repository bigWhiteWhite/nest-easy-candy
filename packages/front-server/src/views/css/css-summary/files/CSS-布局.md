# Grid 布局

阮一峰https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html

https://www.jianshu.com/p/3762f214cd6f

## 网格布局教程

https://www.ruanyifeng.com/blog/2019/03/)

### 一、概述

网格布局（Grid）是最强大的 CSS 布局方案。

它将网页划分成一个个网格，可以任意组合不同的网格，做出各种各样的布局。以前，只能通过复杂的 CSS 框架达到的效果，现在浏览器内置了。

![img](https://www.wangbase.com/blogimg/asset/201903/1_bg2019032501.png)

上图这样的布局，就是 Grid 布局的拿手好戏。

Grid 布局与 [Flex 布局](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)有一定的相似性，都可以指定容器内部多个项目的位置。但是，它们也存在重大区别。

Flex 布局是轴线布局，只能指定"项目"针对轴线的位置，可以看作是**一维布局**。Grid 布局则是将容器划分成"行"和"列"，产生单元格，然后指定"项目所在"的单元格，可以看作是**二维布局**。Grid 布局远比 Flex 布局强大。

### 二、基本概念

学习 Grid 布局之前，需要了解一些基本概念。

#### 2.1 容器和项目

采用网格布局的区域，称为"容器"（container）。容器内部采用网格定位的子元素，称为"项目"（item）。

> ```html
> <div>
> 	<div><p>1</p></div>
> 	<div><p>2</p></div>
> 	<div><p>3</p></div>
> </div>
> ```

上面代码中，最外层的`<div>`元素就是容器，内层的三个`<div>`元素就是项目。

注意：项目只能是容器的顶层子元素，不包含项目的子元素，比如上面代码的`<p>`元素就不是项目。Grid 布局只对项目生效。

#### 2.2 行和列

容器里面的水平区域称为"行"（row），垂直区域称为"列"（column）。

![img](https://www.wangbase.com/blogimg/asset/201903/1_bg2019032502.png)

上图中，水平的深色区域就是"行"，垂直的深色区域就是"列"。

#### 2.3 单元格

行和列的交叉区域，称为"单元格"（cell）。

正常情况下，`n`行和`m`列会产生`n x m`个单元格。比如，3 行 3 列会产生 9 个单元格。

#### 2.4 网格线

划分网格的线，称为"网格线"（grid line）。水平网格线划分出行，垂直网格线划分出列。

正常情况下，`n`行有`n + 1`根水平网格线，`m`列有`m + 1`根垂直网格线，比如三行就有四根水平网格线。

![img](https://www.wangbase.com/blogimg/asset/201903/1_bg2019032503.png)

上图是一个 4 x 4 的网格，共有 5 根水平网格线和 5 根垂直网格线。

### 三、容器属性

Grid 布局的属性分成两类。一类定义在容器上面，称为容器属性；另一类定义在项目上面，称为项目属性。这部分先介绍容器属性。

#### 3.1 display 属性

`display: grid`指定一个容器采用网格布局。

> ```css
> div {
> 	display: grid;
> }
> ```

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032504.png)

上图是`display: grid`的[效果](https://jsbin.com/guvivum/edit?html,css,output)。

默认情况下，容器元素都是块级元素，但也可以设成行内元素。

> ```css
> div {
> 	display: inline-grid;
> }
> ```

上面代码指定`div`是一个行内元素，该元素内部采用网格布局。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032505.png)

上图是`display: inline-grid`的[效果](https://jsbin.com/qatitav/edit?html,css,output)。

> 注意，设为网格布局以后，容器子元素（项目）的`float`、`display: inline-block`、`display: table-cell`、`vertical-align`和`column-*`等设置都将失效。

#### 3.2 列宽行高

**grid-template-columns** 属性， **grid-template-rows** 属性

容器指定了网格布局以后，接着就要划分行和列。`grid-template-columns`属性定义每一列的列宽，`grid-template-rows`属性定义每一行的行高。

> ```css
> .container {
> 	display: grid;
> 	grid-template-columns: 100px 100px 100px;
> 	grid-template-rows: 100px 100px 100px;
> }
> ```

[上面代码](https://jsbin.com/qiginur/edit?css,output)指定了一个三行三列的网格，列宽和行高都是`100px`。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032506.png)

除了使用绝对单位，也可以使用百分比。

> ```css
> .container {
> 	display: grid;
> 	grid-template-columns: 33.33% 33.33% 33.33%;
> 	grid-template-rows: 33.33% 33.33% 33.33%;
> }
> ```

##### **repeat()**

有时候，重复写同样的值非常麻烦，尤其网格很多时。这时，可以使用`repeat()`函数，简化重复的值。上面的代码用`repeat()`改写如下。

> ```css
> .container {
> 	display: grid;
> 	grid-template-columns: repeat(3, 33.33%);
> 	grid-template-rows: repeat(3, 33.33%);
> }
> ```

`repeat()`接受两个参数，第一个参数是重复的次数（上例是 3），第二个参数是所要重复的值。

`repeat()`重复某种模式也是可以的。

> ```css
> grid-template-columns: repeat(2, 100px 20px 80px);
> ```

[上面代码](https://jsbin.com/cokohu/edit?css,output)定义了 6 列，第一列和第四列的宽度为`100px`，第二列和第五列为`20px`，第三列和第六列为`80px`。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032507.png)

##### **auto-fill 关键字**

有时，单元格的大小是固定的，但是容器的大小不确定。如果希望每一行（或每一列）容纳尽可能多的单元格，这时可以使用`auto-fill`关键字表示自动填充。

> ```css
> .container {
> 	display: grid;
> 	grid-template-columns: repeat(auto-fill, 100px);
> }
> ```

[上面代码](https://jsbin.com/himoku/edit?css,output)表示每列宽度`100px`，然后自动填充，直到容器不能放置更多的列。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032508.png)

##### **fr 关键字**

为了方便表示比例关系，网格布局提供了`fr`关键字（fraction 的缩写，意为"片段"）。如果两列的宽度分别为`1fr`和`2fr`，就表示后者是前者的两倍。

> ```css
> .container {
> 	display: grid;
> 	grid-template-columns: 1fr 1fr;
> }
> ```

[上面代码](https://jsbin.com/hadexek/edit?html,css,output)表示两个相同宽度的列。

![img](https://www.wangbase.com/blogimg/asset/201903/1_bg2019032509.png)

`fr`可以与绝对长度的单位结合使用，这时会非常方便。

> ```css
> .container {
> 	display: grid;
> 	grid-template-columns: 150px 1fr 2fr;
> }
> ```

[上面代码](https://jsbin.com/remowec/edit?html,css,output)表示，第一列的宽度为 150 像素，第二列的宽度是第三列的一半。

#### ![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032510.png)

##### **minmax()**

`minmax()`函数产生一个长度范围，表示长度就在这个范围之中。它接受两个参数，分别为最小值和最大值。

> ```css
> grid-template-columns: 1fr 1fr minmax(100px, 1fr);
> ```

上面代码中，`minmax(100px, 1fr)`表示列宽不小于`100px`，不大于`1fr`。

##### **auto 关键字**

`auto`关键字表示由浏览器自己决定长度。

> ```css
> grid-template-columns: 100px auto 100px;
> ```

上面代码中，第二列的宽度，基本上等于该列单元格的最大宽度，除非单元格内容设置了`min-width`，且这个值大于最大宽度。

##### **网格线的名称**

`grid-template-columns`属性和`grid-template-rows`属性里面，还可以使用方括号，指定每一根网格线的名字，方便以后的引用。

> ```css
> .container {
> 	display: grid;
> 	grid-template-columns: [c1] 100px [c2] 100px [c3] auto [c4];
> 	grid-template-rows: [r1] 100px [r2] 100px [r3] auto [r4];
> }
> ```

上面代码指定网格布局为 3 行 x 3 列，因此有 4 根垂直网格线和 4 根水平网格线。方括号里面依次是这八根线的名字。

网格布局允许同一根线有多个名字，比如`[fifth-line row-5]`。

##### **布局实例**

`grid-template-columns`属性对于网页布局非常有用。两栏式布局只需要一行代码。

> ```css
> .wrapper {
> 	display: grid;
> 	grid-template-columns: 70% 30%;
> }
> ```

上面代码将左边栏设为 70%，右边栏设为 30%。

传统的十二网格布局，写起来也很容易。

> ```css
> grid-template-columns: repeat(12, 1fr);
> ```

#### 3.3 行(列)与行(列)的间隔

row-gap 属性， column-gap 属性， gap 属性

`row-gap`属性设置行与行的间隔（行间距），`column-gap`属性设置列与列的间隔（列间距）。

> ```css
> .container {
> 	row-gap: 20px;
> 	column-gap: 20px;
> }
> ```

[上面代码](https://jsbin.com/mezufab/edit?css,output)中，`row-gap`用于设置行间距，`column-gap`用于设置列间距。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032511.png)

`gap`属性是`column-gap`和`row-gap`的合并简写形式，语法如下。

> ```css
> gap: <row-gap> <column-gap>;
> ```

因此，上面一段 CSS 代码等同于下面的代码。

> ```css
> .container {
> 	gap: 20px 20px;
> }
> ```

如果`gap`省略了第二个值，浏览器认为第二个值等于第一个值。

> 根据最新标准，上面三个属性名的`grid-`前缀已经删除，`grid-column-gap`和`grid-row-gap`写成`column-gap`和`row-gap`，`grid-gap`写成`gap`。

#### 3.4 grid-template-areas 属性

网格布局允许指定"区域"（area），一个区域由单个或多个单元格组成。`grid-template-areas`属性用于定义区域。

> ```css
> .container {
> 	display: grid;
> 	grid-template-columns: 100px 100px 100px;
> 	grid-template-rows: 100px 100px 100px;
> 	grid-template-areas:
> 		'a b c'
> 		'd e f'
> 		'g h i';
> }
> ```

上面代码先划分出 9 个单元格，然后将其定名为`a`到`i`的九个区域，分别对应这九个单元格。

多个单元格合并成一个区域的写法如下。

> ```css
> grid-template-areas:
> 	'a a a'
> 	'b b b'
> 	'c c c';
> ```

上面代码将 9 个单元格分成`a`、`b`、`c`三个区域。

下面是一个布局实例。

> ```css
> grid-template-areas:
> 	'header header header'
> 	'main main sidebar'
> 	'footer footer footer';
> ```

上面代码中，顶部是页眉区域`header`，底部是页脚区域`footer`，中间部分则为`main`和`sidebar`。

如果某些区域不需要利用，则使用"点"（`.`）表示。

> ```css
> grid-template-areas:
> 	'a . c'
> 	'd . f'
> 	'g . i';
> ```

上面代码中，中间一列为点，表示没有用到该单元格，或者该单元格不属于任何区域。

> 注意，区域的命名会影响到网格线。每个区域的起始网格线，会自动命名为`区域名-start`，终止网格线自动命名为`区域名-end`。
>
> 比如，区域名为`header`，则起始位置的水平网格线和垂直网格线叫做`header-start`，终止位置的水平网格线和垂直网格线叫做`header-end`。

#### 3.5 grid-auto-flow 属性

划分网格以后，容器的子元素会按照顺序，自动放置在每一个网格。默认的放置顺序是"先行后列"，即先填满第一行，再开始放入第二行，即下图数字的顺序。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032506.png)

这个顺序由`grid-auto-flow`属性决定，默认值是`row`，即"先行后列"。也可以将它设成`column`，变成"先列后行"。

> ```css
> grid-auto-flow: column;
> ```

[上面代码](https://jsbin.com/xutokec/edit?css,output)设置了`column`以后，放置顺序就变成了下图。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032512.png)

`grid-auto-flow`属性除了设置成`row`和`column`，还可以设成`row dense`和`column dense`。这两个值主要用于，某些项目指定位置以后，剩下的项目怎么自动放置。

[下面的例子](https://jsbin.com/wapejok/edit?css,output)让 1 号项目和 2 号项目各占据两个单元格，然后在默认的`grid-auto-flow: row`情况下，会产生下面这样的布局。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032513.png)

上图中，1 号项目后面的位置是空的，这是因为 3 号项目默认跟着 2 号项目，所以会排在 2 号项目后面。

现在修改设置，设为`row dense`，表示"先行后列"，并且尽可能紧密填满，尽量不出现空格。

> ```css
> grid-auto-flow: row dense;
> ```

[上面代码](https://jsbin.com/helewuy/edit?css,output)的效果如下。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032514.png)

上图会先填满第一行，再填满第二行，所以 3 号项目就会紧跟在 1 号项目的后面。8 号项目和 9 号项目就会排到第四行。

如果将设置改为`column dense`，表示"先列后行"，并且尽量填满空格。

> ```css
> grid-auto-flow: column dense;
> ```

[上面代码](https://jsbin.com/pupoduc/1/edit?html,css,output)的效果如下。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032515.png)

上图会先填满第一列，再填满第 2 列，所以 3 号项目在第一列，4 号项目在第二列。8 号项目和 9 号项目被挤到了第四列。

#### 3.6 单元格位置

justify-items 属性

align-items 属性

place-items 属性

`justify-items`属性设置单元格内容的水平位置（左中右），`align-items`属性设置单元格内容的垂直位置（上中下）。

> ```css
> .container {
> 	justify-items: start | end | center | stretch;
> 	align-items: start | end | center | stretch;
> }
> ```

这两个属性的写法完全相同，都可以取下面这些值。

> - start：对齐单元格的起始边缘。
> - end：对齐单元格的结束边缘。
> - center：单元格内部居中。
> - stretch：拉伸，占满单元格的整个宽度（默认值）。

> ```css
> .container {
> 	justify-items: start;
> }
> ```

[上面代码](https://jsbin.com/gijeqej/edit?css,output)表示，单元格的内容左对齐，效果如下图。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032516.png)

> ```css
> .container {
> 	align-items: start;
> }
> ```

[上面代码](https://jsbin.com/tecawur/edit?css,output)表示，单元格的内容头部对齐，效果如下图。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032517.png)

`place-items`属性是`align-items`属性和`justify-items`属性的合并简写形式。

> ```css
> place-items: <align-items> <justify-items>;
> ```

下面是一个例子。

> ```css
> place-items: start end;
> ```

如果省略第二个值，则浏览器认为与第一个值相等。

#### 3.7 整个内容区域在容器里面的水平位置

justify-content 属性， align-content 属性， place-content 属性

`justify-content`属性是整个内容区域在容器里面的水平位置（左中右），`align-content`属性是整个内容区域的垂直位置（上中下）。

> ```css
> .container {
> 	justify-content: start | end | center | stretch | space-around | space-between | space-evenly;
> 	align-content: start | end | center | stretch | space-around | space-between | space-evenly;
> }
> ```

这两个属性的写法完全相同，都可以取下面这些值。（下面的图都以`justify-content`属性为例，`align-content`属性的图完全一样，只是将水平方向改成垂直方向。）

> - start - 对齐容器的起始边框。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032519.png)

> - end - 对齐容器的结束边框。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032518.png)

> - center - 容器内部居中。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032520.png)

> - stretch - 项目大小没有指定时，拉伸占据整个网格容器。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032521.png)

> - space-around - 每个项目两侧的间隔相等。所以，项目之间的间隔比项目与容器边框的间隔大一倍。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032522.png)

> - space-between - 项目与项目的间隔相等，项目与容器边框之间没有间隔。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032523.png)

> - space-evenly - 项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032524.png)

`place-content`属性是`align-content`属性和`justify-content`属性的合并简写形式。

> ```css
> place-content: <align-content> <justify-content>;
> ```

下面是一个例子。

> ```css
> place-content: space-around space-evenly;
> ```

如果省略第二个值，浏览器就会假定第二个值等于第一个值。

#### 3.8 grid-auto-columns 属性， grid-auto-rows 属性

有时候，一些项目的指定位置，在现有网格的外部。比如网格只有 3 列，但是某一个项目指定在第 5 行。这时，浏览器会自动生成多余的网格，以便放置项目。

`grid-auto-columns`属性和`grid-auto-rows`属性用来设置，浏览器自动创建的多余网格的列宽和行高。它们的写法与`grid-template-columns`和`grid-template-rows`完全相同。如果不指定这两个属性，浏览器完全根据单元格内容的大小，决定新增网格的列宽和行高。

[下面的例子](https://jsbin.com/sayuric/edit?css,output)里面，划分好的网格是 3 行 x 3 列，但是，8 号项目指定在第 4 行，9 号项目指定在第 5 行。

> ```css
> .container {
> 	display: grid;
> 	grid-template-columns: 100px 100px 100px;
> 	grid-template-rows: 100px 100px 100px;
> 	grid-auto-rows: 50px;
> }
> ```

上面代码指定新增的行高统一为 50px（原始的行高为 100px）。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032525.png)

#### 3.9 grid-template 属性， grid 属性

`grid-template`属性是`grid-template-columns`、`grid-template-rows`和`grid-template-areas`这三个属性的合并简写形式。

`grid`属性是`grid-template-rows`、`grid-template-columns`、`grid-template-areas`、 `grid-auto-rows`、`grid-auto-columns`、`grid-auto-flow`这六个属性的合并简写形式。

从易读易写的角度考虑，还是建议不要合并属性，所以这里就不详细介绍这两个属性了。

### 四、项目属性

下面这些属性定义在项目上面。

#### 4.1 指定项目的四个边框

grid-column-start 属性， grid-column-end 属性， grid-row-start 属性， grid-row-end 属性

项目的位置是可以指定的，具体方法就是指定项目的四个边框，分别定位在哪根网格线。

> - `grid-column-start`属性：左边框所在的垂直网格线
> - `grid-column-end`属性：右边框所在的垂直网格线
> - `grid-row-start`属性：上边框所在的水平网格线
> - `grid-row-end`属性：下边框所在的水平网格线

> ```css
> .item-1 {
> 	grid-column-start: 2;
> 	grid-column-end: 4;
> }
> ```

[上面代码](https://jsbin.com/yukobuf/edit?css,output)指定，1 号项目的左边框是第二根垂直网格线，右边框是第四根垂直网格线。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032526.png)

上图中，只指定了 1 号项目的左右边框，没有指定上下边框，所以会采用默认位置，即上边框是第一根水平网格线，下边框是第二根水平网格线。

除了 1 号项目以外，其他项目都没有指定位置，由浏览器自动布局，这时它们的位置由容器的`grid-auto-flow`属性决定，这个属性的默认值是`row`，因此会"先行后列"进行排列。读者可以把这个属性的值分别改成`column`、`row dense`和`column dense`，看看其他项目的位置发生了怎样的变化。

[下面的例子](https://jsbin.com/nagobey/edit?html,css,output)是指定四个边框位置的效果。

> ```css
> .item-1 {
> 	grid-column-start: 1;
> 	grid-column-end: 3;
> 	grid-row-start: 2;
> 	grid-row-end: 4;
> }
> ```

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032527.png)

这四个属性的值，除了指定为第几个网格线，还可以指定为网格线的名字。

> ```css
> .item-1 {
> 	grid-column-start: header-start;
> 	grid-column-end: header-end;
> }
> ```

上面代码中，左边框和右边框的位置，都指定为网格线的名字。

这四个属性的值还可以使用`span`关键字，表示"跨越"，即左右边框（上下边框）之间跨越多少个网格。

> ```css
> .item-1 {
> 	grid-column-start: span 2;
> }
> ```

[上面代码](https://jsbin.com/hehumay/edit?html,css,output)表示，1 号项目的左边框距离右边框跨越 2 个网格。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032528.png)

这与[下面的代码](https://jsbin.com/mujihib/edit?html,css,output)效果完全一样。

> ```css
> .item-1 {
> 	grid-column-end: span 2;
> }
> ```

使用这四个属性，如果产生了项目的重叠，则使用`z-index`属性指定项目的重叠顺序。

#### 4.2 grid-column 属性， grid-row 属性

`grid-column`属性是`grid-column-start`和`grid-column-end`的合并简写形式，`grid-row`属性是`grid-row-start`属性和`grid-row-end`的合并简写形式。

> ```css
> .item {
> 	grid-column: <start-line> / <end-line>;
> 	grid-row: <start-line> / <end-line>;
> }
> ```

下面是一个例子。

> ```css
> .item-1 {
> 	grid-column: 1 / 3;
> 	grid-row: 1 / 2;
> }
> /* 等同于 */
> .item-1 {
> 	grid-column-start: 1;
> 	grid-column-end: 3;
> 	grid-row-start: 1;
> 	grid-row-end: 2;
> }
> ```

上面代码中，项目`item-1`占据第一行，从第一根列线到第三根列线。

这两个属性之中，也可以使用`span`关键字，表示跨越多少个网格。

> ```css
> .item-1 {
> 	background: #b03532;
> 	grid-column: 1 / 3;
> 	grid-row: 1 / 3;
> }
> /* 等同于 */
> .item-1 {
> 	background: #b03532;
> 	grid-column: 1 / span 2;
> 	grid-row: 1 / span 2;
> }
> ```

[上面代码](https://jsbin.com/volugow/edit?html,css,output)中，项目`item-1`占据的区域，包括第一行 + 第二行、第一列 + 第二列。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032529.png)

斜杠以及后面的部分可以省略，默认跨越一个网格。

> ```css
> .item-1 {
> 	grid-column: 1;
> 	grid-row: 1;
> }
> ```

上面代码中，项目`item-1`占据左上角第一个网格。

#### 4.3 grid-area 属性

`grid-area`属性指定项目放在哪一个区域。

> ```css
> .item-1 {
> 	grid-area: e;
> }
> ```

[上面代码](https://jsbin.com/qokexob/edit?css,output)中，1 号项目位于`e`区域，效果如下图。

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032530.png)

`grid-area`属性还可用作`grid-row-start`、`grid-column-start`、`grid-row-end`、`grid-column-end`的合并简写形式，直接指定项目的位置。

> ```css
> .item {
> 	grid-area: <row-start> / <column-start> / <row-end> / <column-end>;
> }
> ```

下面是一个[例子](https://jsbin.com/duyafez/edit?css,output)。

> ```css
> .item-1 {
> 	grid-area: 1 / 1 / 3 / 3;
> }
> ```

#### 4.4 justify-self 属性， align-self 属性， place-self 属性

`justify-self`属性设置单元格内容的水平位置（左中右），跟`justify-items`属性的用法完全一致，但只作用于单个项目。

`align-self`属性设置单元格内容的垂直位置（上中下），跟`align-items`属性的用法完全一致，也是只作用于单个项目。

> ```css
> .item {
> 	justify-self: start | end | center | stretch;
> 	align-self: start | end | center | stretch;
> }
> ```

这两个属性都可以取下面四个值。

> - start：对齐单元格的起始边缘。
> - end：对齐单元格的结束边缘。
> - center：单元格内部居中。
> - stretch：拉伸，占满单元格的整个宽度（默认值）。

下面是`justify-self: start`的例子。

> ```css
> .item-1 {
> 	justify-self: start;
> }
> ```

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032532.png)

`place-self`属性是`align-self`属性和`justify-self`属性的合并简写形式。

> ```css
> place-self: <align-self> <justify-self>;
> ```

下面是一个例子。

> ```css
> place-self: center center;
> ```

如果省略第二个值，`place-self`属性会认为这两个值相等。

# Flex 布局

## 父元素

### 控制主轴和主轴的方向

#### flex-direction

```
 row             //从左到右的x轴(正方向的x轴)
 row-reverse     //从右到左的x轴(反方向的x轴)
 column          //正方向的y轴
 column-reverse  //反方向的y轴
```

### 侧轴的方向-flex-wrap

```
 nowrap			//不换行
 wrap			//侧轴方向由上而下   （flex-shrink失效）
 wrap-reverse	//侧轴方向由下而上   （flex-shrink失效）
```

#### flex-flow

```
//flex-direction和flex-wrap的简写属性
flex-flow:row wrap
```

### 富裕空间的管理

#### 主轴-justify-content

```
flex-start     	//在主轴的正方向
flex-end       	//在主轴的反方向
center        	//在两边
space-between  	//在项目之间
space-around   	//在项目两边
```

#### 侧轴-align-items

```
flex-start  	//在侧轴的正方向
flex-end       	//在侧轴的反方向
center         	//在两边
baseline：      //基线对齐
strecth：       //等高布局(项目没有高度)
```

#### 侧轴-align-content

处理单行的时候使用

```
flex-start     	//在侧轴轴的正方向
flex-end       	//在侧轴的反方向
center        	//在两边
space-between  	//在项目之间
space-around   	//在项目两边
```

## 子元素

### 弹性空间管理-flex-grow

```
flex-grow		//弹性因子（默认值为0）
```

### flex 的简写属性

```
//有扩大缩小，第三个参数就不重要了，都是填充
flex：1   	   //1 1 0% 扩大 缩小 基准 撑满剩余的空间
flex:auto		//1 1 auto		基准值为auto，其实允许扩大缩小，后面的基准值已经没用了
flex:none		//0 0 auto		不允许扩大缩小，基准值为auto，也就是元素原来的宽度生效
flex: 1 30px;	//flex-grow | flex-basis
flex: 2 2;		//flex-grow | flex-shrink
flex: 2 2 10%;	//扩大 缩小 基准 grow | shrink | basis
```

#### flex-basis

控制 flex 上元素的大小，为 0 时，将元素本来的大小清 0，重新分配 默认值：auto

```
width:30px; /*会被flex-basis覆盖掉*/
flex-basis:50px;
flex-basis:30%;
```

#### flex-grow

控制如何分配富裕空间，为 1 时，每一个元素分配到的富裕空间都一样 默认值为 0

```
//假设父级盒子400px的宽度，一个子盒子宽度为50，一个为100，那么富裕空间为250px，两个子盒子的flex-grow都为1，那么就代表着，他们都占富裕空间的1/2，也就是250/2=125px，50宽度的盒子加上125px为175px，100宽度的加上125px为225px，如果是4个子盒子，那么就是1/4。
```

#### flex-shrink

设置弹性盒子的缩小比率

```
//默认是auto，所以说弹性盒子的子盒子宽度大于父盒子的时候会自动缩小
flex-shrink:0		//不允许缩小
//假设父级盒子400px的宽度，一个子盒子宽度为200，一个为400，那么超出空间为200px，一个子盒子的flex-shrink为1，一个为3，那么就代表着，超出空间分为4份，一个占1份，一个占3份，再用原来的宽度减去这个超出的空间，200/4=50，第一个子盒子为200-50=150px，第二个子盒子为400-150=250px
```

### 案例

#### 指定几个 div 平均占据一行

```
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

# table 布局

## 属性

```
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

```js
//CSS table布局的超强特性：缺少的表格元素会被浏览器以匿名方式创建,如果我们为元素使用“display:table-cell;”属性，而不将其父容器设置为“display:table-row;”属性，浏览器会默认创建出一个表格行，就好像文档中真的存在一个被声明的表格行一样。

//如果某个元素已经被设置为“display:table-cell;”，而它的父节点（包含它的容器）没有被设置为“display:table-row;”属性，那么浏览器将会创建一个被设置为“display:table-row;”的匿名盒对象来嵌套它。并且与之相邻的属性为“display: table-cell;”的兄弟节点也都会被这个匿名盒对象所包含，直到碰到一个没有被设置为“display: table-cell;”的元素而结束这一行。

//也就是可以不用设置行，而直接使用单元格，而使用单元行以后，单元行的高度会默认是表格的高度，又传递给单元格，所以单元格的高度就不管用了，而在下面一种情况中就可以看出来
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

设置为 table-cell 以后，就像单元格一样自动撑满高度，所以说子元素设置高度是不生效的

单元格的宽度会自动撑满

再加上 vertical-middle，子元素里面的内容也垂直居中

- 子元素不要设置浮动,设置以后会像表格一样排列
- 父元素可以不设置高度

```html
<div class="table bg-blue-300 w-full" style="color:#5292c6;height:200px">
	<div class="table-cell border-1 border-solid ver-middle bg-pink-200 w-1-4" v-for="item in 4"> 我是高度 </div>
</div>
```

# BootStrap 布局

## 1.主要内容

### BootStrap 模板

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<!--设置当前HTML文件的字符编码-->

		<!--compatible兼容的，设置浏览器的兼容模式版本（让IE使用最新的渲染引擎工作）-->

		<!--声明当前网页在移动端浏览器展示的相关设置-->
		<!-- 
			viewport表示用户是否可以缩放页面
			width指定视区的逻辑宽度
			device-width指定视区宽度应为设备的屏幕宽度
			initial-scale指令用于设置Web页面的初始化缩放比例
			initial-scale-1则将显示未经缩放的Web文档
		 -->

		<!-- 上述3个meta标签*必须*放在最前面，任何其他内容都*必须*跟随其后！ -->
		<title>Bootstrap基本的HTML模板</title>
		<!--引入Bootstrap核心样式表(CSS)文件-->
		<link rel="stylesheet" href="bootstrap/css/bootstrap.min.css" />
		<!--引入html5shiv.min.js让浏览器可以识别HTML5的新标签-->
		<!--引入respond.min.js让低版本浏览器可以使用CSS3的媒体查询-->
		<!--[if It IE 9]>
			<script src="html5shiv/html5shiv.min.js"></script>
			<script src="Respond/respond.min.js"></script>
		<![endif]-->
		<!--自己写的CSS样式文件放head最下面-->
	</head>
	<body>
		<div><h1>Hello,world!</h1></div>
		<!-- Bootstrap的所有JS组件都是依赖jQuery的，所以必须放在前边-->
		<script src="js/jquery.js"></script>
		<!-- 加载 Bootstrap 的所有 JavaScript 插件。你也可以根据需要只加载单个插件。-->
		<script src="bootstrap/js/bootstrap.min.js"></script>
		<!--自己写的js文件放在body最下面-->
	</body>
</html>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Bootstrap基本的HTML模板</title>

		<link rel="stylesheet" href="bootstrap/css/bootstrap.min.css" />
	</head>
	<body>
		<div><h1>Hello,world!</h1></div>
		<script src="js/jquery.js"></script>
		<script src="bootstrap/js/bootstrap.min.js"></script>
	</body>
</html>
```

## 2.安装和使用

参考 API：http://v3.bootcss.com/css/

## 3.布局容器和栅格网格系统

// 做一个页面最先要做一个布局

### 3.1.布局容器

1、.container 类用于固定宽度并支持响应式布局的容器

// 固定宽度，会有留白

```html
<div class="container"> ... </div>
```

2、.container-fluid 类用于 100% 宽度，占据全部视口（viewport）的容器

```html
<div class="container-fluid"> ... </div>
```

### 3.2.栅格网格系统

BootStrap 提供了一套响应式、移动设备优先的流式栅格系统，随着屏幕或视口（viewport）尺寸的增加，系统会自动分为最多 12 列。栅格系统用于通过一系列的行（row）或列（column）的组合来创建页面布局，你的内容就可以放入这些创建好的布局中。

网格系统的实现原理非常简单，仅仅是通过定义容器大小，平分 12 份（也有平分成 24 份或 32 份，但 12 份是最常见的），再调整内外边距，最后结合媒体查询，就制作出来强大的响应式网格系统。BootStrapu 框架中的网格系统就是将容器平分成 12 份。

![image-20210714095201634](https://img2020.cnblogs.com/blog/2493574/202108/2493574-20210810221748265-1980092487.png)

注意：网格系统必须使用到 CSS

container、row、xs（xsmall phones），sm（small tablets），md（middle desktops），lg（laege desktops），即

超小屏（自动），小屏（750px），中屏（970px）和大屏（1170px）

数据行（.row）必须包含在容器（.container）中，以便为其赋予合适的对齐方式和内距（padding）。

在行（.row）中可以添加列（.column），只有列（column）才可以作为行容器（.row）的直接子元素，但列数之和不能超过平分的总列数，比如 12。如果大于 12，则自动换到下一行。

具体内容应当放置在列容器之内。

```html
<div class="container">
	<div class="row">
		<div class="col-md-4">4列</div>
		<div class="col-md-8">8列</div>
	</div>
</div>
```

#### 3.2.1.列组合

列总数不能超过 12，大于 12 则自动换刀下一行

#### 3.2.2.列偏移

#### 3.2.3.列排序

改变列的方向，就是改变左右浮动

## 4.常用样式

### 4.1.排版

#### 4.1.1.标题

对 h1~h6 的标题效果进行覆盖，提供劳务对应的类名，为非标题元素设置样式

副标题 small 标签 或 .small 类名

#### 4.1.2.段落

#### 4.1.3.强调类名

强调定义了一套类名，强调类都是通过颜色来表示强调

.text-muted：提示，使用浅灰色

.text-primary：主要，使用蓝色

.text-success：成功，使用浅绿色

.text-info：通知信息，使用浅蓝色

.text-warning：警告，使用黄色

.text-danger：危险，使用褐色

#### 4.1.4.对齐

对齐通过定义四个类名来控制文本的对齐风格

.text-left：左对齐

.text-center：居中对齐

.text-right：右对齐

.text-justify：两端对齐

### 4.2.代码

### 4.3.表格

### 4.4.表单

表单控件什么是表单？表单的主要功能是用来与用户做交流的一个网页控件，包括：文本输入框、下拉选择框、复选按钮、文本域和按钮等

4.4.1.文本框、下拉框与文本域文本框

```html
原生 <input type="text" />
```

BootStrapform-control 表单元素的样式

.input-lg .input.sm 表单控件的大小

```html
<input type="text" class="form-control" /><!--但是会占一整行-->
<!--可行的是，-->
<div class="row">
	<div class="col-md-3">
		<input type="text" class="form-control" />
	</div>
</div>
```

```html
下拉框原生
<select>
	<option>请选择城市</option>
	<option>上海</option>
	<option>北京</option>
</select>
```

```html\
BootStrap 文本域原生<textarea></textarea>
```

BootStrap

4.1.2.单选框与复选框

4.1.3.按钮

4.5.表单布局

4.5.1.水平表单和...

4.6.缩略图和面板 5.BootStrap 组件 5.1.导航 5.2.分页导航 5.3.下拉菜单 5.4.模态框
