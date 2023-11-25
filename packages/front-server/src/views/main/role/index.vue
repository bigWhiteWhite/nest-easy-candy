<template>
	<div>
		<zy-form v-model="form" query-name="role" :form-main="formMain"></zy-form>
		<el-row style="margin: 20px 0" flex justify="space-between">
			<el-col :span="6"><el-button type="primary" size="default" :loading="state.loading" @click="actionRole('add')">添加角色</el-button></el-col>
			<el-col :span="6"><el-button type="primary" size="default" @click="search">搜索</el-button></el-col>
		</el-row>
		<content-table :api-query="apiQuery" query-name="role" :init-table="initTable">
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
					<el-col :span="10"
						><el-button type="primary" size="default" :loading="state.loading" @click="actionRole('edit', row)">编辑角色</el-button></el-col
					>
					<el-divider direction="vertical" />
					<el-col :span="10">
						<el-popconfirm :title="`确定删除${row.roleName}角色吗?`" @confirm="removeRole(row._id)">
							<template #reference>
								<el-button type="danger" size="default">删除角色</el-button>
							</template>
						</el-popconfirm>
					</el-col>
				</el-row>
			</template>
		</content-table>
		<el-dialog v-model="state.visible" v-bind="dialogOption" width="40%" center destroy-on-close :before-close="reset">
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
				<template #systemMenusIds>
					<div style="display: flex; flex-direction: column">
						<el-form-item
							v-for="(item, index) in dialogForm.systems"
							:key="item.system"
							style="flex-direction: column"
							:label="'system-' + index"
							label-width="250px"
							:prop="'systems.' + index + '.system'"
							:rules="{
								required: true,
								message: 'system can not be null',
								trigger: 'change'
							}"
						>
							<template #label="{ label }">
								<el-row flex justify="start" style="width: 100%">
									<el-col :span="6">{{ label }}</el-col>
									<el-col v-show="dialogForm.systems.length > 1" :span="8">
										<el-divider direction="vertical" />
										<el-button size="small" type="danger" @click="deleteSystem(item, index)">Delete</el-button>
									</el-col>
								</el-row>
							</template>
							<el-row style="width: 100%">
								<el-select v-model="item.system" placeholder="选择系统" value-key="_id" @change="changeSystem(item.system, index)">
									<el-option v-for="sys in systemIds" :key="sys._id" :label="sys.systemName" :value="sys" />
								</el-select>
							</el-row>
							<el-row v-show="item.system._id" style="width: 100%" flex>
								<el-col>
									<div>{{ item.system.systemName }}拥有的菜单</div>
								</el-col>
								<el-col>
									<el-tree-select
										v-model="item.menuIds"
										:data="item.menus"
										default-expand-all
										show-checkbox
										multiple
										node-key="_id"
										:props="{
											children: 'children',
											label: 'name'
										}"
									/>
								</el-col>
							</el-row>
							<el-divider style="margin: 10px 0" />
						</el-form-item>
						<el-row style="margin: 25px 0 15px 0">
							<el-button size="small" type="primary" @click="addSystem">Add</el-button>
						</el-row>
					</div>
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
import { addRole, deleteRole, editRole, getAllRole, getRoleInfo, getSystemIds, getSystemInfo } from '@/service/apis/admin'
import { BaseTableType, FormMainType } from '@/types/ElementPlus'
import { ElMessage, ElTree } from 'element-plus'
import { FixedDir } from 'element-plus/es/components/table-v2/src/constants'
import { cloneDeep, uniqWith } from 'lodash'
type System = {
	_id: string
	systemName: string
}
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
const form = ref({})
const systemIds = ref<Array<System>>([])
const systemDialog = ref()
const initForm = {
	roleName: '',
	remark: '',
	systems: [
		{
			system: {} as Partial<System>,
			menuIds: [], // 角色拥有的系统菜单
			menus: [] // 该系统下的所有菜单
		}
	]
}
const dialogForm = ref(cloneDeep(initForm))
const reset = () => {
	systemDialog.value.reset()
	dialogForm.value = cloneDeep(initForm)
	state.editActiveId = ''
	state.visible = false
	state.action = ''
}
const actionRole = async (action: 'add' | 'edit', row?: any) => {
	try {
		state.action = action
		state.loading = true
		systemIds.value = await getSystemIds()
		if (row) {
			state.editActiveId = row._id
			const { roleName, remark, systems } = await getRoleInfo(row._id)
			dialogForm.value = {
				roleName,
				remark,
				systems
			}
		}
		state.visible = true
		dialogOption.title = action === 'add' ? '添加角色' : '编辑角色'
	} catch (error) {
		return Promise.reject(error)
	} finally {
		state.loading = false
	}
}
const apiQuery = (data) => {
	return getAllRole(data)
}
const addSystem = () => {
	dialogForm.value.systems.push({ system: {}, menus: [], menuIds: [] })
}
const deleteSystem = ({ system }, index) => {
	dialogForm.value.systems.splice(index, 1)
}
const changeSystem = async (system, index: number) => {
	try {
		const { menus } = await getSystemInfo(system._id)
		dialogForm.value.systems[index].menus = menus
		dialogForm.value.systems[index].menuIds = []
	} catch (error) {
		return Promise.reject(error)
	}
}
const search = () => {
	proxy.$mittBus.emit('refresh_role')
}
const removeRole = async (id) => {
	try {
		await deleteRole(id)
	} catch (error) {
		return Promise.reject(error)
	} finally {
		search()
	}
}
const formMain: ComputedRef<Array<FormMainType>> = computed(() => {
	return [
		{
			label: '角色name',
			value: 'roleName',
			type: 'input'
		}
	]
})
const dialogFormMain = computed(() => {
	const content: Array<FormMainType> = [
		{
			label: '角色name',
			value: 'roleName',
			type: 'input',
			formItemOptions: {
				rules: [{ required: true, message: 'Please input roleName', trigger: 'change' }]
			}
		},
		{
			label: '备注',
			value: 'remark',
			type: 'input'
		},
		{
			label: '系统选择',
			value: 'systemMenusIds',
			type: 'slot'
		}
	]
	return content
})
const initTable = computed(() => {
	const options: BaseTableType = {
		propList: [
			{
				label: '角色name',
				prop: 'roleName'
			},
			{
				label: '备注',
				prop: 'remark'
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
		await systemDialog.value.eleFormRef.validate()
		const { systems, ..._ } = dialogForm.value
		// 判断是否有重复的系统id
		const ids = systems.map((item) => item.system)
		const duplicates = [] as Array<Partial<System>>
		uniqWith(ids, (num1, num2) => {
			if (num1._id === num2._id) {
				num1 && duplicates.push(num1)
				return false
			}
			return true
		})
		if (duplicates.length > 0) {
			throw `重复的系统值:${duplicates.map((item) => item.systemName).join(', ')}`
		}
		const systemMenusIds = systems.map((_) => {
			const { menus, menuIds, system } = _
			if (menuIds.length == 0) throw `系统${system.systemName}菜单不能为空`
			return {
				systemId: system._id,
				systemName: system.systemName,
				menuIds
			}
		})

		if (state.action === 'add') {
			await addRole({
				..._,
				systemMenusIds
			})
		} else if (state.action === 'edit') {
			await editRole(state.editActiveId, {
				..._,
				systemMenusIds
			})
		}
		reset()
	} catch (error: any) {
		return ElMessage.error(error)
	} finally {
		state.loading = false
		search()
	}
}
onMounted(async () => {
	systemIds.value = await getSystemIds()
})
</script>

<style scoped lang="less"></style>
