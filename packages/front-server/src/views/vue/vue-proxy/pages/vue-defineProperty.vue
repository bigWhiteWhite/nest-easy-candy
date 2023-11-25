<template>
	<div>
		<h1>defineProperty的问题</h1>
		<ul>
			<li>一次只能对一个属性进行监听，需要遍历来对所有属性监听。</li>
			<li>在遇到一个对象的属性还是一个对象的情况下，需要递归监听。</li>
			<li>对于对象的新增属性，需要手动监听</li>
			<li>对于数组通过push、unshift方法增加的元素,也无法监听</li>
		</ul>
		<el-divider />
		<el-button type="primary" size="small" @click="test1">对象添加响应式属性</el-button>
		<el-divider direction="vertical" />
		<el-button type="primary" size="small" @click="test2">监听对象多个属性</el-button>
		<el-divider direction="vertical" />
		<el-button type="primary" size="small" @click="test3">监听对象属性也是对象</el-button>
		<el-divider direction="vertical" />
		<el-button type="primary" size="small" @click="test4">新增对象属性和数组操作</el-button>
	</div>
</template>

<script lang="ts" setup>
/**
 * @description Object.defineProperty() - 在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回这个对象。
 *
 */

const test1 = () => {
	const person = {} as any
	let name = '张三'
	/**
	 * @param 要添加属性的对象
	 * @param 要定义或修改的属性的名称或 [Symbol]
	 * @param 要定义或修改的属性描述符 看一个简单的例子
	 */
	Object.defineProperty(person, 'name', {
		get: () => {
			console.warn('🚀 ~ get方法触发,返回值:', name)
			return name
		},
		set: (val) => {
			console.warn('🚀 ~ set方法触发,设置值:', val)
			name = val
		}
	})
	console.log('person -->', person)
	console.log('person.name -->', person.name)
	person.name = '哈哈哈'
	name = '李四'
}

const test2 = () => {
	let person = {
		name: '张三',
		age: 18,
		address: '宇宙'
	}

	const defineProperty = (obj, key, val) => {
		Object.defineProperty(obj, key, {
			get: () => {
				console.warn('🚀 ~ get方法触发,返回值:', val)
				return val
			},
			set: (newVal) => {
				console.warn('🚀 ~ set方法触发,设置值:', newVal)
				val = newVal
			}
		})
	}
	const observe = (obj) => {
		Object.keys(obj).forEach((key) => {
			defineProperty(obj, key, obj[key])
		})
	}
	observe(person)
	console.log('person -->', person) // 最新的值 		name: '李四', age: 18, address: '宇宙'
	// 触发get方法，返回val -  '张三'
	console.log('person.name -->', person.name)
	// 触发get方法，返回val -  '18'
	console.log('person.age -->', person.age)
	// 触发set方式
	person.name = '李四'
	// 失去响应式
	person = {
		name: '唐五',
		age: 28,
		address: '大西洋'
	}
	person.age = 8
}

const test3 = () => {
	const defineProperty = (obj, key, val) => {
		Object.defineProperty(obj, key, {
			get: () => {
				//如果某对象的属性也是一个对象，递归进入该对象，进行监听
				if (typeof val === 'object') {
					observe(val)
				}
				console.warn('🚀 ~ get方法触发,返回值:', val)
				return val
			},
			set: (newVal) => {
				if (typeof newVal === 'object') {
					observe(newVal)
				}
				console.warn('🚀 ~ set方法触发,设置值:', newVal)
				val = newVal
			}
		})
	}
	const observe = (obj) => {
		//如果传入的不是一个对象，return
		if (typeof obj !== 'object' || obj === null) {
			return
		}
		Object.keys(obj).forEach((key) => {
			defineProperty(obj, key, obj[key])
		})
	}
	const person = {
		name: '张三',
		age: 18,
		address: '宇宙',
		wife: {
			name: '李丽',
			age: 20,
			address: '黑洞'
		},
		children: ['a', 'b']
	} as any
	observe(person)

	console.log('person -->', person)
	console.log('重新赋值wife person.wife -->', person.wife)
	console.log('person.wife.name -->', person.wife.name) // 李丽 ??? 赋值的值也为对象的函数没有写好
	console.log('person.sex -->', person.sex) // undefined
	console.log('person.children -->', person.children[2]) // undefined
	person.wife.name = '唐丽'
	// 因为一开始就监听了wife，所以重新赋值wife，wife不会失去响应式
	person.wife = {
		name: 'xx',
		age: 20,
		address: 'xxx'
	}
	console.log('person.wife.name -->', person.wife.name)
	person.wife.name = '李四'
	person.sex = '男'
	/**
	 * @description 通过push方法给数组增加的元素，set方法是监听不到的。
	 * @description 通过push、unshift增加的元素，会增加一个索引，这种情况需要手动初始化，新增加的元素才能被监听到。
	 * @description 通过 pop 或 shift 删除元素，会删除并更新索引，也会触发 setter 和 getter 方法。
	 * @description 在Vue2.x中，通过重写Array原型上的方法解决了这个问题。
	 */
	person.children.push('c')
}

const test4 = () => {
	const person = {
		name: '张三',
		age: 18,
		address: '宇宙',
		children: ['a', 'b']
	} as any

	const defineProperty = (obj, key, val) => {
		Object.defineProperty(obj, key, {
			get: () => {
				//如果某对象的属性也是一个对象，递归进入该对象，进行监听
				if (typeof val === 'object') {
					observe(val)
				}
				console.warn('🚀 ~ get方法触发,返回值:', val)
				return val
			},
			set: (newVal) => {
				if (typeof newVal === 'object') {
					observe(newVal)
				}
				console.warn('🚀 ~ set方法触发,设置值:', newVal)
				val = newVal
			}
		})
	}
	const observe = (obj) => {
		//如果传入的不是一个对象，return
		if (typeof obj !== 'object' || obj === null) {
			return
		}
		Object.keys(obj).forEach((key) => {
			defineProperty(obj, key, obj[key])
		})
	}
	observe(person)
	console.log('person -->', person) // 全部都能打印，但是没有触发set方法的都没有响应式，只是触发了get方法返回引用对象的数据，真正拿的时候是为undefined的
	console.log('person.wife -->', person.wife) // undefined
	console.log('person.wife.name -->', person.wife?.name) // undefined
	console.log('person.children -->', person.children[2]) // undefined
	/**
	 * @description 由于一开始wife没有声明person里面，所以wife是没有响应式的.
	 * @description 而且有响应式的log打印时候被...隐藏，点击...的时候才会调用监听的get方法显示出来.
	 */
	person.wife = {
		name: 'xx',
		age: 20,
		address: 'xxx'
	}
	// 这里就更加没有响应式了
	person.wife.name = '李四'
	/**
	 * @description 通过push方法给数组增加的元素，set方法是监听不到的。
	 * @description 通过push、unshift增加的元素，会增加一个索引，这种情况需要手动初始化，新增加的元素才能被监听到。
	 * @description 通过 pop 或 shift 删除元素，会删除并更新索引，也会触发 setter 和 getter 方法。
	 * @description 在Vue2.x中，通过重写Array原型上的方法解决了这个问题。
	 */
	person.children.push('c') as any
}
</script>

<style scoped lang="less"></style>
