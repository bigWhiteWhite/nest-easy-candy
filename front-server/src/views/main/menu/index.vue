<template>
	<div>
		<zy-form v-model="form" query-name="menu" :form-main="formMain"></zy-form>
		<el-row style="margin: 20px 0" flex justify="space-between">
			<el-col :span="6"><el-button type="primary" size="default" :loading="state.loading" @click="actionMenu('add')">添加菜单</el-button></el-col>
			<el-col :span="6"><el-button type="primary" size="default" @click="search">搜索</el-button></el-col>
		</el-row>
		<content-table :api-query="apiQuery" query-name="menu" :init-table="initTable">
			<template #name="{ row }">
				<el-tag type="success">{{ row.name }}</el-tag>
			</template>
			<template #type="{ row }">
				<el-tag v-if="row.type === 2" round effect="plain" type="success">按钮</el-tag>
				<el-tag v-else round effect="plain">菜单</el-tag>
			</template>
			<template #meta="{ row }">
				<el-descriptions :column="1" border>
					<el-descriptions-item v-for="(value, key) in row.meta" :key="key" :label="key">{{ value }}</el-descriptions-item>
				</el-descriptions>
			</template>
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
					<el-col :span="10">
						<el-button type="primary" size="default" :loading="state.loading" @click="actionMenu('edit', row)">编辑菜单</el-button>
					</el-col>
					<el-divider direction="vertical" />
					<el-col :span="10">
						<el-popconfirm :title="`确定删除${row.name}菜单吗?同时也会删除${row.name}下的子菜单`" @confirm="removeMenu(row._id)">
							<template #reference>
								<el-button type="danger" size="default">删除菜单</el-button>
							</template>
						</el-popconfirm>
					</el-col>
				</el-row>
			</template>
		</content-table>
		<el-dialog v-model="state.visible" v-bind="dialogOption" width="50%" center destroy-on-close :before-close="reset">
			<zy-form
				ref="menuDialog"
				v-model="dialogForm"
				:form-main="dialogFormMain"
				:col-props="{ span: 24 }"
				:form-props="{
					labelWidth: '150px', // 表单项中标题所占的宽度
					labelPosition: 'left'
				}"
			></zy-form>
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
import { addMenu, deleteMenu, editMenu, getAllMenu, getMenuInfo } from '@/service/apis/admin'
import { BaseTableType, FormMainType } from '@/types/ElementPlus'
import { FixedDir } from 'element-plus/es/components/table-v2/src/constants'
import { cloneDeep } from 'lodash'
const state = reactive({
	editActiveId: '',
	loading: false,
	visible: false,
	action: '' // 添加还是编辑
})
const dialogOption = reactive({
	title: ''
})
const { proxy } = useCommon()
const form = ref({
	name: ''
})
const menuDialog = ref()
const initForm = {
	parentId: '',
	path: '',
	type: 1,
	name: '',
	pIndex: 0,
	cIndex: 0,
	redirect: '',
	title: '',
	icon: '',
	isLink: false,
	isKeepAlive: true,
	isHide: false,
	isAffix: false,
	isIframe: false
}
const dialogForm = ref(cloneDeep(initForm))
const reset = () => {
	menuDialog.value.reset()
	dialogForm.value = cloneDeep(initForm)
	state.editActiveId = ''
	state.visible = false
	state.action = ''
}
const actionMenu = async (action: 'add' | 'edit', row?: any) => {
	try {
		state.action = action
		state.loading = true
		if (row) {
			state.editActiveId = row._id
			const res = await getMenuInfo(row._id)
			dialogForm.value = { ...res, ...res.meta }
		}
		state.visible = true
		dialogOption.title = action === 'add' ? '添加菜单' : '编辑菜单'
	} catch (error) {
		return Promise.reject(error)
	} finally {
		state.loading = false
	}
}
const apiQuery = (data) => {
	return getAllMenu(data)
}
const search = () => {
	proxy.$mittBus.emit('refresh_menu')
}
const removeMenu = async (id) => {
	try {
		await deleteMenu(id)
	} catch (error) {
		return Promise.reject(error)
	} finally {
		search()
	}
}
const formMain: ComputedRef<Array<FormMainType>> = computed(() => {
	return [
		{
			label: '菜单name',
			value: 'name',
			type: 'input'
		}
	]
})
const dialogFormMain = computed(() => {
	const content: Array<FormMainType> = [
		{
			label: '父级菜单ID',
			value: 'parentId',
			type: 'input'
		},
		{
			label: '一级菜单排序',
			value: 'pIndex',
			type: 'inputNumber'
		},
		{
			label: '同级排序',
			value: 'cIndex',
			type: 'inputNumber'
		},
		{
			label: '重定向路径',
			value: 'redirect',
			type: 'input'
		},
		{
			label: '菜单路径',
			value: 'path',
			type: 'input',
			formItemOptions: {
				rules: [{ required: true, message: 'Please input path', trigger: 'change' }]
			}
		},
		{
			label: '菜单类型',
			value: 'type',
			type: 'select',
			formItemOptions: {
				rules: [{ required: true, message: 'Please select type', trigger: 'change' }]
			},
			options: [
				{
					value: 1,
					label: '菜单'
				},
				{
					value: 2,
					label: '按钮'
				}
			]
		},
		{
			label: '菜单name',
			value: 'name',
			type: 'input',
			formItemOptions: {
				rules: [{ required: true, message: 'Please input name', trigger: 'change' }]
			}
		},
		{
			label: '菜单标题',
			value: 'title',
			type: 'input',
			formItemOptions: {
				rules: [{ required: true, message: 'Please input title', trigger: 'change' }]
			}
		},
		{
			label: '菜单图标',
			value: 'icon',
			type: 'input',
			formItemOptions: {
				rules: [{ required: true, message: 'Please input icon', trigger: 'change' }]
			}
		},
		{
			label: '是否为链接',
			value: 'isLink',
			type: 'select',
			formItemOptions: {
				rules: [{ required: true, message: 'Please select', trigger: 'change' }]
			},
			options: [
				{
					value: false,
					label: '否'
				},
				{
					value: true,
					label: '是'
				}
			]
		},
		{
			label: '菜单是否缓存',
			value: 'isKeepAlive',
			type: 'select',
			formItemOptions: {
				rules: [{ required: true, message: 'Please select', trigger: 'change' }]
			},
			options: [
				{
					value: false,
					label: '否'
				},
				{
					value: true,
					label: '是'
				}
			]
		},
		{
			label: '菜单是否在前端隐藏',
			value: 'isHide',
			type: 'select',
			formItemOptions: {
				rules: [{ required: true, message: 'Please select', trigger: 'change' }]
			},
			options: [
				{
					value: false,
					label: '否'
				},
				{
					value: true,
					label: '是'
				}
			]
		},
		{
			label: '菜单是否固定',
			value: 'isAffix',
			type: 'select',
			formItemOptions: {
				rules: [{ required: true, message: 'Please select', trigger: 'change' }]
			},
			options: [
				{
					value: false,
					label: '否'
				},
				{
					value: true,
					label: '是'
				}
			]
		},
		{
			label: '是否内嵌',
			value: 'isIframe',
			type: 'select',
			formItemOptions: {
				rules: [{ required: true, message: 'Please select', trigger: 'change' }]
			},
			options: [
				{
					value: false,
					label: '否'
				},
				{
					value: true,
					label: '是'
				}
			]
		}
	]
	return content
})
const initTable = computed(() => {
	const options: BaseTableType = {
		propList: [
			{
				label: '父级菜单Id',
				prop: 'parentId'
			},
			{
				label: '菜单ID',
				prop: '_id',
				columnOptions: {
					width: 250
				}
			},
			{
				label: '菜单名称',
				prop: 'name'
			},
			{
				label: '菜单路径',
				prop: 'path'
			},
			{
				label: '菜单type',
				prop: 'type',
				columnOptions: {
					width: 100
				}
			},
			{
				label: '菜单pIndex排序',
				prop: 'pIndex'
			},
			{
				label: '菜单cIndex排序',
				prop: 'cIndex'
			},
			// {
			// 	label: '菜单其他配置',
			// 	prop: 'meta',
			// 	columnOptions: {
			// 		width: 200
			// 	}
			// },
			{
				label: '更新时间',
				prop: 'updatedAt'
			},
			{
				label: '子节点',
				prop: 'children',
				columnOptions: {
					width: 200
				}
			},
			{
				label: '操作',
				prop: 'handle',
				columnOptions: {
					width: 270,
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
		await menuDialog.value.eleFormRef.validate()
		const body = {
			...dialogForm.value,
			meta: {
				title: dialogForm.value.title,
				icon: dialogForm.value.icon,
				isLink: dialogForm.value.isLink,
				isKeepAlive: dialogForm.value.isKeepAlive,
				isHide: dialogForm.value.isHide,
				isAffix: dialogForm.value.isAffix,
				isIframe: dialogForm.value.isIframe
			}
		}
		if (state.action === 'add') {
			await addMenu(body)
		} else if (state.action === 'edit') {
			await editMenu(state.editActiveId, body)
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
