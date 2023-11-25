import { defineStore } from 'pinia'
import { TagsViewRoutesState } from './interface'
import localCache from '@/utils/storage'
export const useTagsViewRoutes = defineStore(
	// 唯一ID
	'tagsViewRoutes',
	{
		state: (): TagsViewRoutesState => ({
			tagsViewRoutes: [],
			isTagsViewCurrentFull: false
		}),
		actions: {
			async setTagsViewRoutes(data: Array<string>) {
				this.tagsViewRoutes = data
			},
			setCurrenFullscreen(bool: Boolean) {
				localCache.set('isTagsViewCurrenFull', bool, 'session')
				this.isTagsViewCurrentFull = bool
			}
		}
	}
)
