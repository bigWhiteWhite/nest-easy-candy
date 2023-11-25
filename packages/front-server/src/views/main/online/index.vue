<template>
	<div>
		<zy-form v-model="form" :query-name="pageName" :form-main="formMain"></zy-form>
		<el-row style="margin: 20px 0" flex justify="start">
			<el-col :span="6"><el-button type="primary" size="default" @click="search">刷新</el-button></el-col>
		</el-row>
		<content-table :api-query="apiQuery" :query-name="pageName" :init-table="initTable">
			<template #handle="{ row }">
				<el-row flex justify="space-between" align="middle">
					<el-popconfirm :title="`确定下线${row.username}吗?`" @confirm="kickUser(row.userId)">
						<template #reference>
							<el-button type="danger" size="default">下线</el-button>
						</template>
					</el-popconfirm>
				</el-row>
			</template>
		</content-table>
	</div>
</template>

<script lang="ts" setup>
import { useCommon } from '@/hooks/useCommon'
import { getOnlineList, onlineKick } from '@/service/apis/admin'
import { BaseTableType, FormMainType } from '@/types/ElementPlus'
import { FixedDir } from 'element-plus/es/components/table-v2/src/constants'
import { cloneDeep } from 'lodash'
const pageName = 'online'
const { proxy } = useCommon()
const initState = {
	editActiveId: '',
	loading: false,
	action: '' // 添加还是编辑
}
const initForm = {}
const state = ref(cloneDeep(initState))
const actionForm = ref(cloneDeep(initForm))
const dialogOption = reactive({
	title: ''
})
const form = ref({})
// 表单搜索函数
const search = () => {
	proxy.$mittBus.emit(`refresh_${pageName}`)
}
// 搜索表单配置
const formMain: ComputedRef<Array<FormMainType>> = computed(() => {
	return []
})
// 表格配置
const initTable = computed(() => {
	const options: BaseTableType = {
		propList: [
			{
				label: 'id',
				prop: 'id'
			},
			{
				label: 'username',
				prop: 'username'
			},
			{
				label: 'phone',
				prop: 'phone'
			},
			{
				label: 'IP',
				prop: 'ip'
			},
			{
				label: '系统',
				prop: 'os'
			},
			{
				label: '浏览器',
				prop: 'browser'
			},
			{
				label: '操作',
				prop: 'handle',
				columnOptions: {
					width: 100,
					fixed: FixedDir.RIGHT
				}
			}
		]
	}
	return options
})
// 表格初始化函数
const apiQuery = (data) => {
	return getOnlineList()
}
// 删除函数
const kickUser = async (id) => {
	try {
		await onlineKick(id)
	} catch (error) {
		return Promise.reject(error)
	} finally {
		search()
	}
}
</script>

<style scoped lang="less"></style>
