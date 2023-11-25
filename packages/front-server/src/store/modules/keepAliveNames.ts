import { defineStore } from 'pinia'
import { KeepAliveNamesState } from './interface'

export const useKeepALiveNames = defineStore(
	// 唯一ID
	'keepALiveNames',
	{
		state: (): KeepAliveNamesState => ({
			keepAliveNames: [],
			cachedViews: []
		}),
		actions: {
			async setCacheKeepAlive(data: Array<string>) {
				this.keepAliveNames = data
			},
			async addCachedView(view: any) {
				if (this.cachedViews.includes(view.name)) return
				if (view.meta.isKeepAlive) this.cachedViews.push(view.name)
			},
			async delCachedView(view: any) {
				const index = this.cachedViews.indexOf(view.name)
				index > -1 && this.cachedViews.splice(index, 1)
			},
			async delOthersCachedViews(view: any) {
				if (view.meta.isKeepAlive) this.cachedViews = [view.name]
				else this.cachedViews = []
			},
			async delAllCachedViews() {
				this.cachedViews = []
			}
		}
	}
)
