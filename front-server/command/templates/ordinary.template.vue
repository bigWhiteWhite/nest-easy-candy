<template>
	<div>
		<zy-form v-model="form" :query-name="pageName" :form-main="formMain"></zy-form>
		<el-row style="margin: 20px 0" flex justify="space-between">
			<el-col :span="6"
				><el-button type="primary" size="default" :loading="state.loading" @click="action('add')">添加{{ key }}</el-button></el-col
			>
			<el-col :span="6"
				><el-button type="primary" size="default" @click="search">搜索{{ key }}</el-button></el-col
			>
		</el-row>
		<content-table :api-query="apiQuery" :query-name="pageName" :init-table="initTable">
			<template #handle="{ row }">
				<el-row flex justify="space-between" align="middle">
					<el-col :span="10"
						><el-button type="primary" size="default" :loading="state.loading" @click="action('edit', row)">编辑{{ key }}</el-button></el-col
					>
					<el-divider direction="vertical" />
					<el-col :span="10">
						<el-popconfirm :title="`确定删除吗?`" @confirm="remove(row._id)">
							<template #reference>
								<el-button type="danger" size="default">删除{{ key }}</el-button>
							</template>
						</el-popconfirm>
					</el-col>
				</el-row>
			</template>
		</content-table>
		<el-dialog v-model="state.visible" v-bind="dialogOption" width="50%" center destroy-on-close :before-close="reset">
			<zy-form
				:ref="`${pageName}ActionForm`"
				v-model="actionForm"
				:form-main="actionFormMain"
				:col-props="{ span: 24 }"
				:form-props="{
					labelWidth: '150px', // 表单项中标题所占的宽度
					labelPosition: 'left'
				}"
			>
			</zy-form>
			<template #footer>
				<el-row flex justify="end">
					<el-button size="default" @click="reset">取消</el-button>
					<el-divider direction="vertical" />
					<el-button size="default" :loading="state.loading" type="primary" @click="confirm">确定</el-button>
				</el-row>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { useCommon } from '@/hooks/useCommon'
import { BaseTableType, FormMainType } from '@/types/ElementPlus'
import { FixedDir } from 'element-plus/es/components/table-v2/src/constants'
import { cloneDeep } from 'lodash'
const pageName = {{{ pageName }}}
const { proxy } = useCommon()
const initState = {
	editActiveId: '',
	loading: false,
	visible: false, // 弹窗显隐
	action: '' // 添加还是编辑
}
const initForm = {}
const state = ref(cloneDeep(initState))
const actionForm = ref(cloneDeep(initForm))
const dialogOption = reactive({
	title: ''
})
const form = ref({})
// 重置函数
const reset = () => {
	proxy.$refs[`${pageName}ActionForm`].reset()
	actionForm.value = cloneDeep(initForm)
	state.value = cloneDeep(initState)
}
// 弹窗控制函数
const action = async (action: 'add' | 'edit', row?: any) => {
	try {
		state.value.action = action
		state.value.loading = true
		if (row) {
			state.value.editActiveId = row._id
		}
		state.value.visible = true
		dialogOption.title = action === 'add' ? '添加' : '编辑'
	} catch (error) {
		return Promise.reject(error)
	} finally {
		state.value.loading = false
	}
}
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
				label: 'sample',
				prop: 'sample'
			},
			{
				label: '操作',
				prop: 'handle',
				columnOptions: {
					width: 250,
					fixed: FixedDir.RIGHT
				}
			}
		]
	}
	return options
})
// 弹窗表单配置
const actionFormMain = computed(() => {
	const content: Array<FormMainType> = [
		{
			label: 'sample',
			value: 'sample',
			type: 'input',
			formItemOptions: {
				rules: [{ required: true, message: 'Please input sample', trigger: 'change' }]
			}
		}
	]
	return content
})
// 表格初始化函数
const apiQuery = (data) => {
	return Promise.resolve(() => [])
}
// 删除函数
const remove = async (id) => {
	try {
		console.log('remove', id)
	} catch (error) {
		return Promise.reject(error)
	} finally {
		search()
	}
}
// 弹窗确认添加/编辑函数
const confirm = async () => {
	try {
		state.value.loading = true
		proxy.$refs[`${pageName}ActionForm`].eleFormRef.validate()
		if (state.value.action === 'add') {
			console.log('add')
		} else if (state.value.action === 'edit') {
			console.log('edit')
		}
		reset()
	} catch (error) {
		return Promise.reject(error)
	} finally {
		state.value.loading = false
		search()
	}
}
</script>

<style scoped lang="less"></style>
