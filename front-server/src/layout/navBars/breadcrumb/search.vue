<template>
	<div class="layout-search-dialog">
		<el-dialog v-model="state.isShowSearch" width="300px" destroy-on-close :modal="false" fullscreen :show-close="false">
			<template #header>
				<el-row justify="end">
					<el-icon style="cursor: pointer" :size="30" color="#fff" @click="state.isShowSearch = false"><ele-CircleCloseFilled /></el-icon>
				</el-row>
			</template>
			<el-autocomplete
				ref="layoutMenuAutocompleteRef"
				v-model="state.menuQuery"
				:fetch-suggestions="menuSearch"
				:placeholder="$t('user.searchPlaceholder')"
				@select="onHandleSelect"
				@blur="onSearchBlur"
			>
				<template #prefix>
					<el-icon class="el-input__icon">
						<ele-Search />
					</el-icon>
				</template>
				<template #default="{ item }">
					<div>
						<svg-icon :icon-name="item.meta.icon" class-name="mr5" />
						{{ $t(item.meta.title) }}
					</div>
				</template>
			</el-autocomplete>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup name="layoutBreadcrumbSearch">
import { reactive, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useTagsViewRoutes } from '@/store/modules/tagsViewRoutes'
const { tagsViewRoutes } = storeToRefs(useTagsViewRoutes())
const layoutMenuAutocompleteRef = ref()
const { t } = useI18n()
const router = useRouter()
// 定义接口来定义对象的类型
interface SearchState {
	isShowSearch: boolean
	menuQuery: string
	tagsViewList: object[]
}
interface Restaurant {
	path: string
	meta: {
		title: string
	}
}

const state = reactive<SearchState>({
	isShowSearch: false,
	menuQuery: '',
	tagsViewList: []
})

// 搜索弹窗打开
const openSearch = () => {
	state.menuQuery = ''
	state.isShowSearch = true
	initTageView()
	nextTick(() => {
		setTimeout(() => {
			layoutMenuAutocompleteRef.value.focus()
		})
	})
}
defineExpose({ openSearch })
// 搜索弹窗关闭
const closeSearch = () => {
	state.isShowSearch = false
}
// 菜单搜索数据过滤
const menuSearch = (queryString: string, cb: Function) => {
	const results = queryString ? state.tagsViewList.filter(createFilter(queryString)) : state.tagsViewList
	cb(results)
}
// 菜单搜索过滤
const createFilter: any = (queryString: string) => {
	return (restaurant: Restaurant) => {
		return (
			restaurant.path.toLowerCase().indexOf(queryString.toLowerCase()) > -1 ||
			restaurant.meta.title.toLowerCase().indexOf(queryString.toLowerCase()) > -1 ||
			t(restaurant.meta.title).indexOf(queryString.toLowerCase()) > -1
		)
	}
}
// 初始化菜单数据
const initTageView = () => {
	if (state.tagsViewList.length > 0) return false
	tagsViewRoutes.value.map((v: any) => {
		if (!v.meta.isHide) state.tagsViewList.push({ ...v })
	})
}
// 当前菜单选中时
const onHandleSelect = (item: any) => {
	const { path, redirect } = item
	if (item.meta.isLink && !item.meta.isIframe) window.open(item.meta.isLink)
	else if (redirect) router.push(redirect)
	else router.push(path)
	closeSearch()
}
// input 失去焦点时
const onSearchBlur = () => {
	closeSearch()
}
</script>

<style scoped lang="less">
.layout-search-dialog {
	:deep(.el-dialog) {
		box-shadow: unset !important;
		border-radius: 0 !important;
		background: rgba(0, 0, 0, 0.5);
	}
	:deep(.el-autocomplete) {
		width: 560px;
		position: absolute;
		top: 100px;
		left: 50%;
		transform: translateX(-50%);
	}
}
</style>
