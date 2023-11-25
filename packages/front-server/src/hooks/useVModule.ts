/**
 * @description 只是一个思路，还有其他方法:
 * @description vueuse - https://vueuse.org/core/useVModel/
 * @description vue3.3 - defineModel
 * @param props
 * @param propName props中代理的名字
 * @param emit
 */
export default function useVModule(props, propName, emit) {
	return computed({
		get() {
			return new Proxy(props[propName], {
				get(target, key) {
					return Reflect.get(target, key)
				},
				set(target, key, newValue) {
					emit('update:' + propName, {
						...target,
						[key]: newValue
					})
					return true
				}
			})
		},
		set(value) {
			emit('update:' + propName, value)
		}
	})
}
