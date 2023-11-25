/**
 * @method set
 * @method get
 * @method remove
 * @method clear
 */
type localType = 'local' | 'session'

class localCache {
	// 设置永久 | 临时缓存
	set(key: string, val: any, type: localType) {
		const actionStorage = {
			local: window.localStorage.setItem(key, JSON.stringify(val)),
			session: window.sessionStorage.setItem(key, JSON.stringify(val))
		}
		return actionStorage[type]
	}
	// 获取永久 | 临时缓存
	get(key: string, type: localType) {
		const actionStorage = {
			local: window.localStorage.getItem(key),
			session: window.sessionStorage.getItem(key)
		}
		return JSON.parse(actionStorage[type] as string)
	}
	// 移除永久 | 临时缓存
	remove(key: string, type: localType) {
		const actionStorage = {
			local: window.localStorage.removeItem(key),
			session: window.sessionStorage.removeItem(key)
		}
		return actionStorage[type]
	}
	// 移除全部永久 | 临时缓存
	clear(type: localType) {
		const actionStorage = {
			local: window.localStorage.clear(),
			session: window.sessionStorage.clear()
		}
		return actionStorage[type]
	}
}

// eslint-disable-next-line new-cap
export default new localCache()
