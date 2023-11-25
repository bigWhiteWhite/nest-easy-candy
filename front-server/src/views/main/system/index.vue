<template>
	<div>
		<zy-form v-model="form" query-name="system" :form-main="formMain"></zy-form>
		<el-row style="margin: 20px 0" flex justify="space-between">
			<el-col :span="6"><el-button type="primary" size="default" @click="actionSystem('add')">添加系统</el-button></el-col>
			<el-col :span="6"><el-button type="primary" size="default" @click="search">搜索</el-button></el-col>
		</el-row>
		<content-table :api-query="apiQuery" query-name="system" :init-table="initTable">
			<template #children="{ row }">
				<el-tree
					:data="[row]"
					:props="{
						children: 'children',
						label: 'name'
					}"
				/>
			</template>
			<template #handle="{ row }">
				<el-row flex justify="space-between" align="middle">
					<el-col :span="10"><el-button type="primary" size="default" @click="actionSystem('edit', row)">编辑系统</el-button></el-col>
					<el-divider direction="vertical" />
					<el-col :span="10">
						<el-popconfirm :title="`确定删除${row.systemName}系统吗?`" @confirm="removeSystem(row._id)">
							<template #reference>
								<el-button type="danger" size="default">删除系统</el-button>
							</template>
						</el-popconfirm>
					</el-col>
				</el-row>
			</template>
		</content-table>
		<el-dialog v-model="state.visible" v-bind="dialogOption" width="50%" center destroy-on-close :before-close="reset">
			<zy-form
				ref="systemDialog"
				v-model="dialogForm"
				:form-main="dialogFormMain"
				:col-props="{ span: 24 }"
				:form-props="{
					labelWidth: '150px', // 表单项中标题所占的宽度
					labelPosition: 'left'
				}"
			>
				<template #menuIds>
					<el-tree
						ref="treeRef"
						style="width: 100%"
						:data="activeSystem.menus"
						show-checkbox
						node-key="_id"
						:default-expanded-keys="dialogForm.menuIds"
						:default-checked-keys="dialogForm.menuIds"
						:props="{
							children: 'children',
							label: 'name'
						}"
					/>
				</template>
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
import { addSystem, deleteSystem, editSystem, getAllMenu, getAllSystem, getSystemInfo } from '@/service/apis/admin'
import { BaseTableType, FormMainType } from '@/types/ElementPlus'
import { ElTree } from 'element-plus'
import { FixedDir } from 'element-plus/es/components/table-v2/src/constants'
const state = reactive({
	editActiveId: '',
	loading: false,
	visible: false,
	action: '' // 添加还是编辑
})
const activeSystem = ref({
	menus: []
})
const dialogOption = reactive({
	title: ''
})
const { proxy } = useCommon()
const form = ref({
	systemName: '',
	systemValue: ''
})
const systemDialog = ref()
const treeRef = ref<InstanceType<typeof ElTree>>()
const initForm = {
	systemName: '',
	systemValue: '',
	menuIds: []
}
const dialogForm = ref({ ...initForm })
const reset = () => {
	systemDialog.value.reset()
	dialogForm.value = { ...initForm }
	state.editActiveId = ''
	state.visible = false
	state.action = ''
}
const actionSystem = async (action: 'add' | 'edit', row?: any) => {
	try {
		state.action = action
		const { list } = await getAllMenu({
			onlyParent: true,
			pagination: {
				current: 1,
				pageSize: 999
			}
		})
		if (row) {
			state.editActiveId = row._id
			const { menuIds, systemName, systemValue } = await getSystemInfo(row._id)
			dialogForm.value.menuIds = menuIds
			dialogForm.value.systemName = systemName
			dialogForm.value.systemValue = systemValue
		}
		activeSystem.value.menus = list
		state.visible = true
		dialogOption.title = action === 'add' ? '添加系统' : '编辑系统'
	} catch (error) {
		return Promise.reject(error)
	}
}
const apiQuery = (data) => {
	return getAllSystem(data)
}
const search = () => {
	proxy.$mittBus.emit('refresh_system')
}
const removeSystem = async (id) => {
	try {
		await deleteSystem(id)
	} catch (error) {
		return Promise.reject(error)
	} finally {
		search()
	}
}
const formMain: ComputedRef<Array<FormMainType>> = computed(() => {
	return [
		{
			label: '系统name',
			value: 'systemName',
			type: 'input'
		},
		{
			label: '系统value',
			value: 'systemValue',
			type: 'input'
		}
	]
})
const dialogFormMain = computed(() => {
	const content: Array<FormMainType> = [
		{
			label: '系统name',
			value: 'systemName',
			type: 'input',
			formItemOptions: {
				rules: [{ required: true, message: 'Please input systemName', trigger: 'change' }]
			}
		},
		{
			label: '系统value',
			value: 'systemValue',
			type: 'input',
			formItemOptions: {
				rules: [{ required: true, message: 'Please input systemValue', trigger: 'change' }]
			}
		},
		{
			label: '菜单',
			value: 'menuIds',
			type: 'slot',
			formItemOptions: {
				rules: [{ required: true, message: 'Please select menuIds', trigger: 'change' }]
			}
		}
	]
	return content
})
const initTable = computed(() => {
	const options: BaseTableType = {
		propList: [
			{
				label: '系统name',
				prop: 'systemName'
			},
			{
				label: '系统value',
				prop: 'systemValue'
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
const confirm = async () => {
	try {
		state.loading = true
		dialogForm.value.menuIds = treeRef.value!.getCheckedKeys(true) as any
		await systemDialog.value.eleFormRef.validate()
		if (state.action === 'add') {
			await addSystem(dialogForm.value)
		} else if (state.action === 'edit') {
			await editSystem(state.editActiveId, dialogForm.value)
		}
		reset()
	} catch (error) {
		return Promise.reject(error)
	} finally {
		state.loading = false
		search()
	}
}
</script>

<style scoped lang="less"></style>
