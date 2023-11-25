<template>
	<base-table
		ref="baseTableRef"
		v-bind="initTable"
		v-loading="state.loading"
		:data="listData.data"
		:query-name="queryName"
		@update-page="init"
		@update-select="updateSelect"
	>
		<!--  所有的表格组件都会用到的 <el-icon><Unlock /></el-icon> -->
		<template #createdAt="{ row }">
			{{ dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
		</template>
		<template #updatedAt="{ row }">
			{{ dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}
		</template>
		<!-- 编辑删除按钮列插槽 -->
		<template #handle="scope">
			<slot name="handle" :row="scope.row"></slot>
		</template>
		<!-- 动态插槽,需要使用的页面根据prop,插入 -->
		<template v-for="item in trendsSlots" #[item.prop]="scope">
			<slot :name="item.prop" :row="scope.row"></slot>
		</template>
	</base-table>
	<!-- 底部分页器 -->
	<el-row flex justify="end" style="margin-top: 10px">
		<slot name="pagination">
			<el-pagination
				v-if="paginationOptions"
				v-bind="paginationOptions"
				:current-page="pageArg.current"
				:page-size="pageArg.pageSize"
				:total="listData.total"
				@current-change="init"
				@size-change="init"
			>
			</el-pagination>
		</slot>
	</el-row>
</template>

<script lang="ts" setup name="ContentTable">
import { reactive, computed, getCurrentInstance, onUnmounted, nextTick, onMounted, PropType } from 'vue'
import type { ColumnsType, CurrentSize, PaginationOptions } from '@/types/ElementPlus'
import BaseTable from './base-table.vue'
import { cloneDeep } from 'lodash'
import dayjs from 'dayjs'
const { proxy } = <any>getCurrentInstance()
const props = defineProps({
	apiQuery: {
		type: Function,
		required: true
	},
	queryName: {
		// 搜索表单的标识
		type: String,
		default: () => ''
	},
	initTable: {
		type: Object,
		required: true
	},
	paginationOptions: {
		// 分页器显示的选项
		type: Object as PropType<PaginationOptions>,
		default: () => ({
			layout: 'total, sizes, prev, pager, next, jumper',
			pageSizes: [10, 20, 30, 50, 100, 150, 200, 250]
		})
	}
})
const listData = reactive({
	data: [],
	total: 0
})

const pageArg = reactive({
	// 当前页和一页条数
	current: 1,
	pageSize: 100
}) as CurrentSize

const state = reactive({
	loading: false,
	searchData: {}
})

const trendsSlots = computed(() => {
	// 返回组件插槽，过滤掉'操作'插槽
	const useLess = ['handle', 'createdAt', 'updatedAt']
	const slots = props.initTable.propList.filter((item: ColumnsType) => {
		return !useLess.includes(item.prop)
	})
	return slots
})
// const emits = defineEmits(['updatePage', 'updateSelect'])
const updateSelect = (_: any) => {
	console.log(_, '选择序号改变了')
}
// 初始化表格
const init = async () => {
	state.loading = true
	const data = {
		...state.searchData,
		pagination: pageArg
	}
	const res = await props.apiQuery(data)
	listData.data = res.list || res || []
	listData.total = res.pagination?.total || res.length || 0
	state.loading = false
}

onMounted(() => {
	proxy.$mittBus.on(props.queryName, (res: any) => {
		state.searchData = cloneDeep(res)
		nextTick(() => {
			pageArg.current = 1
			init()
		})
	})
})
// 页面卸载时
onUnmounted(() => {
	proxy.$mittBus.off(props.queryName, () => {})
})
</script>

<style scoped lang="less"></style>
