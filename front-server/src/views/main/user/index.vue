<template>
	<div>
		<zy-form v-model="form" :query-name="pageName" :form-main="formMain"></zy-form>
		<el-row style="margin: 20px 0" flex justify="space-between">
			<el-col :span="6"><el-button type="primary" size="default" @click="action('add')">添加用户</el-button></el-col>
			<el-col :span="6"><el-button type="primary" size="default" @click="search">搜索</el-button></el-col>
		</el-row>
		<content-table :api-query="apiQuery" :query-name="pageName" :init-table="initTable">
			<template #status="{ row }">
				<el-tag v-if="row.status === 1" round effect="plain" type="success">正常</el-tag>
				<el-tag v-else round effect="plain" type="danger">禁用</el-tag>
			</template>
			<template #userAvatar="{ row }">
				<img v-viewer :src="row.userAvatar" alt="userAvatar" />
			</template>
			<template #handle="{ row }">
				<el-row flex justify="space-between" align="middle">
					<el-col :span="10"><el-button type="primary" size="default" @click="action('edit', row)">编辑用户</el-button></el-col>
					<el-divider direction="vertical" />
					<el-col :span="10">
						<el-popconfirm :title="`确定删除吗?`" @confirm="remove(row._id)">
							<template #reference>
								<el-button type="danger" size="default">删除</el-button>
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
import { editUser, getAllRole, getAllUser, getUserInfoId } from '@/service/apis/admin'
import { deleteUser, register } from '@/service/apis/login'
import { BaseTableType, FormMainType } from '@/types/ElementPlus'
import { FixedDir } from 'element-plus/es/components/table-v2/src/constants'
import { cloneDeep } from 'lodash'
const pageName = 'user'
const { proxy } = useCommon()
const initState = {
	editActiveId: '',
	loading: false,
	visible: false,
	action: '', // 添加还是编辑
	roleList: []
}
const initForm = {
	username: '',
	phone: '',
	userAvatar: '',
	remark: '',
	roles: []
}
const state = ref({
	...initState
})
const actionForm = ref(cloneDeep(initForm))
const dialogOption = reactive({
	title: ''
})
const form = ref({})
const reset = () => {
	proxy.$refs[`${pageName}ActionForm`].reset()
	actionForm.value = cloneDeep(initForm)
	state.value = {
		...initState
	}
}
const action = async (action: 'add' | 'edit', row?: any) => {
	try {
		state.value.action = action
		const { list: roleList } = await getAllRole({
			pagination: {
				current: 1,
				pageSize: 999
			}
		})
		state.value.roleList = roleList.map((role) => {
			return {
				label: role.roleName,
				value: role._id
			}
		})
		if (row) {
			state.value.editActiveId = row._id
			const res = await getUserInfoId(row._id)
			actionForm.value = res
		}
		state.value.visible = true
		dialogOption.title = action === 'add' ? '添加' : '编辑'
	} catch (error) {
		return Promise.reject(error)
	}
}
const apiQuery = (data) => {
	return getAllUser(data)
}
const search = () => {
	proxy.$mittBus.emit(`refresh_${pageName}`)
}
const formMain: ComputedRef<Array<FormMainType>> = computed(() => {
	return []
})
const actionFormMain = computed(() => {
	const content: Array<FormMainType> = [
		{
			label: 'account',
			value: 'account',
			type: 'input',
			formItemOptions: {
				rules: [{ required: true, message: 'Please input account', trigger: 'change' }]
			}
		},
		{
			label: 'username',
			value: 'username',
			type: 'input',
			formItemOptions: {
				rules: [{ required: true, message: 'Please input username', trigger: 'change' }]
			}
		},
		{
			label: 'phone',
			value: 'phone',
			type: 'input'
		},
		{
			label: 'userAvatar',
			value: 'userAvatar',
			type: 'input'
		},
		{
			label: 'remark',
			value: 'remark',
			type: 'input'
		},
		{
			label: 'roles',
			value: 'roles',
			type: 'virtually-select',
			options: state.value.roleList,
			itemOptions: {
				multiple: true,
				'collapse-tags': true,
				'collapse-tags-tooltip': true
			},
			formItemOptions: {
				rules: [{ required: true, message: 'Please select roles', trigger: 'change' }]
			}
		}
	]
	return content
})
const initTable = computed(() => {
	const options: BaseTableType = {
		propList: [
			{
				label: 'account',
				prop: 'account'
			},
			{
				label: 'username',
				prop: 'username'
			},
			{
				label: 'userAvatar',
				prop: 'userAvatar'
			},
			{
				label: 'phone',
				prop: 'phone'
			},
			{
				label: 'status',
				prop: 'status'
			},
			{
				label: 'updatedAt',
				prop: 'updatedAt'
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
const remove = async (id) => {
	try {
		await deleteUser(id)
	} catch (error) {
		return Promise.reject(error)
	} finally {
		search()
	}
}
const confirm = async () => {
	try {
		state.value.loading = true
		proxy.$refs[`${pageName}ActionForm`].eleFormRef.validate()
		if (state.value.action === 'add') {
			await register(actionForm.value)
		} else if (state.value.action === 'edit') {
			await editUser(state.value.editActiveId, actionForm.value)
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
