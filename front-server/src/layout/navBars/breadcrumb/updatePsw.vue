<template>
	<div>
		<el-dialog v-model="visible" v-bind="dialogOption" width="38%" center destroy-on-close :before-close="reset">
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
import { FormMainType } from '@/types/ElementPlus'
import { cloneDeep } from 'lodash'
import { useUserInfo } from '@/store/modules/userInfo'
import { setPassword } from '@/service/apis/login'
const { userInfos } = storeToRefs(useUserInfo())
defineProps({
	visible: {
		type: Boolean,
		required: true
	}
})
const emits = defineEmits(['update:visible'])
const pageName = 'psw'
const { proxy, logOut } = useCommon()
const initState = {
	editActiveId: '',
	loading: false
}
const initForm = {
	account: userInfos.value.username || '',
	originPassword: '',
	newPassword: ''
}
const state = ref(cloneDeep(initState))
const actionForm = ref(cloneDeep(initForm))
const dialogOption = reactive({
	title: '修改密码'
})
// 重置函数
const reset = () => {
	proxy.$refs[`${pageName}ActionForm`].reset()
	actionForm.value = cloneDeep(initForm)
	state.value = cloneDeep(initState)
	emits('update:visible', false)
}
// 弹窗表单配置
const actionFormMain = computed(() => {
	const content: Array<FormMainType> = [
		{
			label: 'form.accountName',
			disabled: true,
			value: 'account',
			type: 'input',
			formItemOptions: {
				rules: [{ required: true, message: 'The current user cannot be found, please log in again and try again', trigger: 'change' }]
			}
		},
		{
			label: 'operate.oldPassword',
			value: 'originPassword',
			type: 'password',
			itemOptions: {
				placeholder: 'Please input your old password'
			},
			formItemOptions: {
				rules: [{ required: true, message: 'Please input oldPassword', trigger: 'change' }]
			}
		},
		{
			label: 'operate.newPassword',
			value: 'newPassword',
			type: 'password',
			itemOptions: {
				placeholder: 'Please input your new password'
			},
			formItemOptions: {
				rules: [{ required: true, message: 'Please input newPassword', trigger: 'change' }]
			}
		}
	]
	return content
})
// 弹窗确认添加/编辑函数
const confirm = async () => {
	try {
		state.value.loading = true
		proxy.$refs[`${pageName}ActionForm`].eleFormRef.validate()
		await setPassword(actionForm.value)
		ElMessage.success('The modification is successful, please log in again')
		await logOut()
		reset()
	} catch (error) {
		return Promise.reject(error)
	} finally {
		state.value.loading = false
	}
}
</script>

<style scoped lang="less"></style>
