# Git 版本控制工具

## 基本命令

```javascript
git init .					//创建一个git库
git remote add origin +ssh //关联远程仓库
git remote -v     		   //查看有无关联成功
git clone + ssh地址   	  //克隆远程仓库的文件
git add .   			   //将当前目录提交到暂存区
git status  			   //查看文件状态
git commit -m "备注"   	  //提交并备注提交信息
git push origin master 	   //将本地目录提交到远程仓库
git push origin master -f  //强制将本地目录提交到远程仓库，相当于覆盖
git pull origin master 	   //更新合并远程目录到本地，master是分支名称
git branch +分支名			 //创建分支
```

## 基本流程

1.创建一个 git 库 2.下载脚手架 3.git remote add origin git 关联到远程仓库 4.执行 add commit push 这样就把本地添加到远程仓库

## 分支

```javascript
//master就是分支，生成环境的分支(可以发布在线上)  git  merge(合并)/git fetch(更新)
//develop或dev，开发环境总的分支
git checkout -b //分支名   切换分支，如果没有这个分支就要加-b
git add .
git commit -m "备注"
git push origin //分支名  更新分支的操作
git checkout master //切换到主干
git  merge origin/分支名  //下载线上分支代码合并到本地主干
git push //把本地主干代码上传
//git上创建分支后，再 git pull
//进入新创建的分支  git checkout index-ajax
//可以用git status 来检查是否改动，若没有改动即可 npm run dev 运行项目。
```

## 本地项目

不受 git 管理的项目同步远程项目仓库

```javascript
	git init . //可以使用git命令
    git add .
    git commit -m "备注"
    git remote add origin +ssh //关联远程仓库
    git push origin master  //出现错误...git pull...
    git pull origin master //出现错误fatal：refusing to merge unrelated histories 	不允许合并没有关联的历史记录
    git pull origin master --allow-unrelated-histories //	强制关联更新代码
    git push origin login
```

## git 批量删除文件夹和文件

本地删除文件后，执行 $ git status

然后接着 $ git rm <文件>

此时如果是要删除大批量文件，这么一个一个命令下去不得累死人啊

其实可以这样（不管之前有没有已经本地物理删除）

执行 $ git rm _ -r（记得，cd 到你要删除的目录下。当然 _ 可以换成指定目录）

这时删除文件已经进入本地缓存区，

接下来就是正常的提交操作了

```js
$ git add .
$ git commit -m "clear"
$ git push origin master
```

## git commit -m 与 git commit -am 的区别

字面解释的话，git commit -m 用于提交暂存区的文件；git commit -am 用于提交跟踪过的文件

要理解它们的区别，首先要明白 git 的文件状态变化周期，如下图所示

![git文件状态变化周期](https://segmentfault.com/img/bVLFkG?w=500&h=317)

工作目录下面的所有文件都不外乎这两种状态：已跟踪或未跟踪。已跟踪的文件是指本来就被纳入版本控制管理的文件，在上次快照中有它们的记录，工作一段时间后，它们的状态可能是未更新，已修改或者已放入暂存区

下面以一个实例说明

在项目文件夹中新增一个文件如'a.txt'时，该文件处于 untracked 未跟踪状态。未跟踪状态的文件是无法提交的 ![图片描述](https://segmentfault.com/img/bVLFlT?w=542&h=131)

接下来，使用 git add a.txt，使其变成已跟踪状态

![图片描述](https://segmentfault.com/img/bVLFlY?w=455&h=206)

这时，如果使用 git commit -m 'add a.txt'就可以顺利提交了

![图片描述](https://segmentfault.com/img/bVLFl4?w=546&h=196)

但是，git commit -m 和 git commit -am 的区别在哪里？在于 a.txt 文件修改之后的处理

下面，向 a.txt 添加内容'a'

![图片描述](https://segmentfault.com/img/bVLFml?w=537&h=197)

文件 a.txt 处于已跟踪，但未暂存状态。这时，如果使用 git commit -m 是无法提交最新版本的 a.txt 的，提交的只是最开始空内容的旧版本 a.txt

![图片描述](https://segmentfault.com/img/bVLFnA?w=534&h=330)

要提交新版本 a.txt，即内容为'a'的 a.txt，则需要使用 git add a.txt，将新版本的 a.txt 放到 staged 暂存区，然后才能使用 git commit -m 进行提交

而如果使用 git commit -am，则可以省略 git add a.txt 这一步，因为 git commit -am 可以提交跟踪过的文件，而 a.txt 一开始已经被跟踪过了

![图片描述](https://segmentfault.com/img/bVLFnF?w=548&h=180)

总结，使用这两个命令区别的关键就是 git add 命令

git add 命令是个多功能命令，根据目标文件的状态不同，此命令的效果也不同：可以用它开始跟踪新文件，或者把已跟踪的文件放到暂存区，还能用于合并时把有冲突的文件标记为已解决状态等

我们需要用 git add 命令来跟踪新文件，但如果使用 git commit -am 可以省略使用 git add 命令将已跟踪文件放到暂存区的功能

# 错误提示

```js
//这是git没有把提交的文件加载进来，但是把需要提交的文件都列出来了，只需要用git add XXX(文件名) 把需要提交的文件加上 ，然后git commit -m "xx",再 git   push  - u   origin   master重新提交就可以了

或者git commit -a 快一点
然后:wq退出

```

## 太久没有提交

`git上传远程库错误“fatal: sha1 file '<stdout>' write error: Broken pipe”`

- 删除.git 文件夹
- git init .
- git remote add origin +ssh
- git add .
- git commit -m '重新连接'
- git push origin push -f 强制提交

## 分支指向错误

不确定“参考损坏”的根本原因。要修复它，请删除此文件`.git/refs/remotes/origin/master`，然后`git fetch`将其取回。

`error: cannot lock ref 'refs/remotes/origin/master': unable to resolve reference 'refs/remotes/origin/master': reference broken`

- ```bash
  rm .git/refs/remotes/origin/master
  ```

- ```bash
  git fetch
  ```

- ```bash
  git pull
  ```

# Git

## 工作机制

![image-20220312223454968](git.assets\image-20220312223454968.png)32

## 常用命令

| 命令                    | 作用                                                 |
| ----------------------- | ---------------------------------------------------- |
| git init                | 初始化本地库                                         |
| git status              | 查看本地库状态                                       |
| git add .               | 将所有工作区文件添加到暂存区                         |
| git commit -m 'xxx'     | 将暂存区提交到本地库                                 |
| git reflog              | 查看历史记录，所有分支，包括被删除的 commit 和 reset |
| git log                 | 显示从最近到最远的详细提交日志                       |
| git reset --hard 版本号 | 版本穿梭                                             |
| git rm --cached file    | 删除仓库 暂存区中的文件，保留本地的文件              |

Git 切换版本，底层其实是移动的 HEAD 指针，具体原理如下图所示。

![image-20220312231507461](git.assets\image-20220312231507461.png)

## 用户签名

```bash
git config --global user.name 用户名
git config --global user.email 邮箱

// 保存在 C:/users/xxx/.gitconfig
```

## 分支操作

![image-20220312231812843](git.assets\image-20220312231812843.png)

![image-20220312231928653](git.assets\image-20220312231928653.png)

### 分支命令

| 命令                               | 作用                             |
| ---------------------------------- | -------------------------------- |
| git branch 分支名                  | 创建分支                         |
| git branch                         | 列出当前分支清单                 |
| git branch -v                      | 查看各个分支最后一个提交信息     |
| git branch --delete 分支名         | 删除本地分支                     |
| git checkout 分支名                | 切换分支                         |
| git checkout --orphan 分支名       | 创建空白分支                     |
| git merge 分支名                   | 把指定的分支合并到**当前分支**上 |
| git push --set-upstream origin XXX | 将本地新的 XXX 分支推送到远端    |

### 合并冲突

冲突产生的表现 后面状态为 MERGING

![image-20220312233450633](git.assets\image-20220312233450633.png)

1. 查看状态（检测到有文件 有两处修改）

![image-20220312233721538](git.assets\image-20220312233721538.png)

2. 编辑有冲突的文件，删除特殊符号，决定要使用的内容

特殊符号：<<<<<<< HEAD 当前分支的代码 ======= 合并过来的代码 >>>>>>> hot-fix

![image-20220312233905588](git.assets\image-20220312233905588.png)

3. 添加到暂存区
4. 执行提交

master、hot-fix 其实都是指向具体版本记录的指针。当前所在的分支，其实是由 HEAD 决定的。所以创建分支的本质就是多创建一个指针。 HEAD 如果指向 master，那么我们现在就在 master 分支上。 HEAD 如果指向 hotfix，那么我们现在就在 hotfix 分支上。

## 团队协作

团队内协作

![image-20220312234357639](git.assets\image-20220312234357639.png)

## 远程仓库

| 命令                           | 作用                                       |
| ------------------------------ | ------------------------------------------ |
| git remote -v                  | 查看                                       |
| git remote add 别名 远程地址   | 起别名                                     |
| git push 别名 分支             | 将本地分支内容推送到远程仓库               |
| git clone 远程仓库             | 拉取远程仓库内容到本地                     |
| git pull 远程仓库别名 远程分支 | 将远程仓库指定分支拉取并与当前本地分支合并 |

本地有仓库，远程仓库无内容

```git
git add *
git commit -m '提交的信息'
git remote add origin https://github.com/JUST-Limbo/Note.git
git push origin 分支名(默认只有一个master分支)
```

注意：push 是将本地库代码推送到远程库，如果本地库代码跟远程库代码版本不一致，push 的操作是会被拒绝的。也就是说， 要想 push 成功，一定要保证本地库的版本要比远程库的版本高！ 因此一个成熟的程序员在动手改本地代码之前，一定会先检查下远程库跟本地代码的区别！如果本地的代码版本已经落后，切记要先 pull 拉取一下远程库的代码，将本地代码更新到最新以后，然后再修改，提交，推送

## 跨团队协作

![image-20220312234418753](git.assets\image-20220312234418753.png)

## eslint

## rebase

git pull = git fetch + git merge

git pull --rebase = git fetch + git rebase

merge 会产生新节点，之前的提交分开显示

rebase 不会产生新节点，是将两个分支融合成一个线性提交

## 撤销 commit
