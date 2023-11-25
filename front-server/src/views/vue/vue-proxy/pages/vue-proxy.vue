<template>
	<div>
		<el-button type="primary" size="small" @click="test1">对象添加响应式属性</el-button>
		<el-button type="primary" size="small" @click="loop1">事件循环1</el-button>
		<el-button type="primary" size="small" @click="loop2">事件循环2</el-button>
		<el-button type="primary" size="small" @click="loop3">事件循环3</el-button>
	</div>
</template>

<script lang="ts" setup>
const test1 = () => {
	const obj = {
		a: 'lll'
	} as any
	const newObj = new Proxy(obj, {
		get: function (target, key: any, receiver) {
			console.warn(`🚀 ~ get ${key}触发,返回值: ${target}`)
			return Reflect.get(target, key, receiver)
		},
		set: function (target, key, value, receiver) {
			console.warn('🚀 ~ set方法触发,设置值:', target, key, value, receiver)
			return Reflect.set(target, key, value, receiver)
		}
	})
}

/**
 * 一个宏任务就代表一个循环的开始，要看看执行宏任务时有无需要加入的微任务队列，需要就执行完这个循环再执行下一个循环(下一个宏任务)
 */
/**
 * 1. 最开始微任务列表为 [], 宏任务列表为: [主线程(整个代码块)]
 * 2. 基于事件循环(不断从任务列表中获取任务), 先执行执宏任务(整块代码)，遇到微任务加先加入微任务队列，等第一个宏任务执行完，立刻执行微任务:
 * 3. 从上往下执行，首先执行同步代码, 遇到微任务加先加入微任务队列
 * 4. 也就是第一个循环(宏任务-微任务) - 执行宏任务1,3,4,7然后执行微任务5。
 * 5. 此时任务列表会不停的获取任务，10s以后，开始新的循环，加入了两个宏任务[第一个定时器，第二个定时器]
 * 6. 执行第二个循环，第二个循环宏任务开始 - promise in setTimeout1， then加入微任务.第二个循环微任务开始-then in setTimeout1
 * 7. 执行第三个循环，第三个循环宏任务开始 - setTimeout2。第三个循环微任务开始-无
 */

const loop1 = () => {
	/*
	 * 1. 最开始微任务列表为 [], 宏任务列表为: [主线程(整个代码块)]
	 * 2. 基于事件循环(不断从任务列表中获取任务), 先执行执宏任务(整块代码):
	 * - 执行 setTimeout 将回调函数 `() => console.log('timeout')` 添加到宏任务列表
	 * - 分别执行 promise 将两个回调函数 `() => console.log('promise1')`  `() => console.log('promise2')` 加入微任务列表
	 * - 最后打印出 code
	 * 3. 基于事件循环(不断从任务列表中获取任务), 先执行所有微任务, 打印出 `promise1` `promise2`, 再执行下一个宏任务, 打印出 `timeout`
	 * 4. 继续事件循环, 不断查询任务列表、只要有任务则继续执行
	 */
	setTimeout(() => console.log('timeout1'))
	Promise.resolve().then(() => console.log('promise1'))
	Promise.resolve().then(() => console.log('promise2'))
	console.log('code')
	setTimeout(() => console.log('timeout2'))
	Promise.resolve().then(() => console.log('promise3'))
}
const loop2 = () => {
	// 同步代码
	console.log(1)

	// 第一个定时器10秒以后加入宏任务队列
	setTimeout(function () {
		new Promise(function (resolve: any) {
			console.log('promise in setTimeout1')
			resolve()
		}).then(function () {
			console.log('then in setTimeout1')
		})
	}, 10)
	// Promise: 主体部分, 也就是 Promise(fun) 中的函数参数也是宏任务，同步执行
	new Promise(function (resolve: any) {
		console.log(3)
		for (var i = 100000; i > 0; i--) {
			i == 1 && resolve()
		}
		console.log(4)
	}).then(function () {
		// 加入第一个循环的微任务队列
		console.log(5)
	})

	// 第二个定时器10秒以后加入宏任务队列,排在第一个宏任务的后面
	setTimeout(function () {
		console.log('setTimeout2')
	}, 10)

	// 同步代码
	console.log(7)
}
const loop3 = () => {
	/*
1. 最开始微任务列表为 [], 宏任务列表为: [主线程(整个代码块)]
2. 基于事件循环(不断从任务列表中获取任务), 先执行宏任务(整块代码):
    - 打印 script start
    - 执行 async1, async1 本质上是一个 Promise, 先执行 await 后的函数, 打印出 async2 end, 后将 await 后的代码等同于 Promise.then 的回调函数, 添加到微任务中
    - 执行 setTimeout, 将回调函数加到宏任务
    - 执行 Promise, 先执行参数函数打印 Promise, 后将 .then 部分加入微任务, 注意这里有两个 .then 都需要加入任务
    - 打印 script end
3. 基于事件循环(不断从任务列表中获取任务), 先执行所有微任务: 打印 async1 end、promise1、promise2, 执行下一个宏任务: 打印 setTimeout
5. 继续事件循环, 不断查询任务列表、只要有任务则继续执行
*/

	console.log('script start')

	async function async1() {
		await async2()
		console.log('async1 end')
	}

	async function async2() {
		console.log('async2 end')
	}

	async1()

	setTimeout(function () {
		console.log('setTimeout')
	}, 0)

	new Promise((resolve: any) => {
		console.log('Promise')
		resolve()
	})
		.then(function () {
			console.log('promise1')
		})
		.then(function () {
			console.log('promise2')
		})

	console.log('script end')
}
</script>

<style scoped lang="less"></style>
