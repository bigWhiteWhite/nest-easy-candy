<template>
	<el-row v-bind="props.rowProps">
		<el-col v-bind="props.colProps">
			<el-table ref="elTableRef" class="elTable" v-bind="tableOptions" :data="data" :height="scrollHeight" @selection-change="selectionUpdate">
				<!-- :row-key="(record: any, index: any) => index" -->
				<el-table-column v-if="props.tableOptions.selection" type="selection" v-bind="props.selectionOptions" />
				<!-- 自己传递的数据 -->
				<el-table-column
					v-for="item in propList"
					:key="item.prop"
					:property="item.prop"
					:label="$t(`${item.label}`)"
					v-bind="{ ...props.columnOptions, ...item.columnOptions }"
				>
					<template #default="{ row }">
						<slot :name="item.prop" :row="row">
							{{ i18nFormat(item.formatter ? item.formatter(row, row[item.prop]) : row[item.prop]) }}
						</slot>
					</template>
				</el-table-column>
			</el-table>
		</el-col>
	</el-row>
</template>

<script lang="ts" setup name="BaseTable">
import { getCurrentInstance, PropType, ref, onMounted, onBeforeUnmount } from 'vue'
import type { ColumnsType, ColRowType } from '@/types/ElementPlus'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { proxy } = <any>getCurrentInstance()
const props = defineProps({
	queryName: {
		// 搜索表单的标识
		type: String,
		default: () => ''
	},
	tableOptions: {
		// 设置表格其他属性
		type: Object,
		default: () => ({
			border: true,
			showHeader: true,
			selection: false
		})
	},
	selectionOptions: {
		type: Object,
		default: () => ({
			width: '55'
		})
	},
	columnOptions: {
		type: Object,
		default: () => ({
			align: 'center',
			showOverflowTooltip: true
		})
	},
	rowProps: {
		type: Object as PropType<ColRowType>,
		default: () => ({
			gutter: 16
		})
	},
	colProps: {
		type: Object as PropType<ColRowType>,
		default: () => ({
			span: 24
		})
	},
	data: {
		// 表格数据
		type: Array,
		default: () => []
	},
	propList: {
		type: Array as PropType<ColumnsType[]>,
		default: () => []
	}
})
const scrollHeight = ref(258)

const elTableRef = () => {
	return proxy.$refs.elTableRef
}
const i18nFormat = (value: string) => {
	return value ? t(value) : value
}
const a = (b) => {
	console.log('🚀 ~ file: base-table.vue:83 ~ a ~ b:', b)
}
// const indexMethod = (index: string) => { 序号
// 	const { page, pageSize } = state.pageArg
// 	return page !== 1 ? (page - 1) * pageSize + index + 1 : index + 1
// }
const emits = defineEmits(['updateSelect'])
const selectionUpdate = (select: any) => {
	emits('updateSelect', select)
}
const handleScroll = () => {
	scrollHeight.value = document.body.clientHeight - 300 // 380
}
onMounted(() => {
	handleScroll()
	window.addEventListener('resize', handleScroll, true)
})
onBeforeUnmount(() => {
	window.removeEventListener('resize', handleScroll)
})
defineExpose({ elTableRef })
</script>

<!-- <style scoped lang="less">
.base_table_footer {
	padding: 20px 20px 0 20px;
	background-color: var(--el-fill-color-blank);
	.el-pagination {
		padding-top: 20px;
		justify-content: end;
	}
}
</style> -->
