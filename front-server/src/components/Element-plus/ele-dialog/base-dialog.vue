<template>
	<div class="base_dialog">
		<el-dialog v-model="state.visible" v-bind="props.dialogOptions" :title="title" center destroy-on-close :before-close="cancel">
			<!-- 树结构插槽 -->
			<slot name="header"></slot>
			<div v-for="item in props.formList" v-show="item.step === state.step" :key="item.name" :class="item.name">
				<!-- <base-form
					v-if="item.initForm"
					v-bind="item.initForm"
					:ref="`${item.name}Ref`"
					v-model="state.formData[item.name]"
					:step="item.step"
					:disabled-list="state.disabledList[item.name]"
					@cascader-update="cascaderUpdate"
					@input-change="inputChange"
					@select-update="selectUpdate"
				> -->
				<!-- 表单内插槽 -->
				<!-- <template v-for="formSlot in slotArray" #[formSlot.value]="scope">
						<slot :name="formSlot.value" :row="scope.row">{{ formSlot.value }}</slot>
					</template>
					<template v-for="slot in formItemSlots()" #[slot]="scope">
						<slot :name="slot" :row="scope.row">{{ slot }}</slot>
					</template>
				</base-form> -->
				<!-- 表单外插槽 -->
				<slot :name="item.name"></slot>
			</div>
			<!-- 确认取消插槽 -->
			<template #footer>
				<span class="dialog-footer">
					<el-button size="default" @click="stepControl('prev')">{{ prevBtn() }}</el-button>
					<slot name="footerCenter"></slot>
					<el-button size="default" :loading="nextLoading" type="primary" @click="handleConfirmClick">{{ nextBtn() }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup name="BaseDialog">
import { computed, getCurrentInstance, PropType, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { initData, initListData } from '@/utils/ele-fun'
import type { EchoFormListType, FormListType, FormMainType } from '@/types/ElementPlus'
const { t } = useI18n()
const { proxy } = <any>getCurrentInstance()
const props = defineProps({
	dialogOptions: {
		type: Object,
		default: () => {}
	},
	title: {
		type: String,
		default: ''
	},
	nextLoading: {
		type: Boolean,
		default: false
	},
	formList: {
		type: Array as PropType<FormListType[]>,
		required: true
	},
	// 回显表单数据
	echoFormList: {
		type: Array as PropType<EchoFormListType[]>,
		default: () => []
	}
})

type FormData = Record<string, any>
const state = reactive({
	action: 'add',
	step: 1,
	visible: false,
	formData: {} as FormData,
	disabledList: {} // 禁止输入列表,一般在编辑中使用，新增可以在配置文件中配置
})
state.formData = initListData(props.formList, props.echoFormList)

// 根据步数获取对应的表单item
const stepItem: any = computed(() => {
	return (stepKey = state.step) => {
		const item = props.formList?.find((item: any) => {
			return item.step === stepKey
		})
		return item
	}
})

const prevBtn = () => {
	let text = ''
	if (state.step === 1) {
		text = stepItem.value().cancelText ? t(stepItem().value().cancelText) : t('operate.cancel')
	} else {
		text = stepItem.value().prevText ? t(stepItem().value().prevText) : t('operate.prev')
	}
	return text
}

const nextBtn = () => {
	let text = ''
	if (state.step === props.formList.length) {
		text = stepItem.value().confirmText ? t(stepItem.value().confirmText) : t('operate.submit')
	} else {
		text = stepItem.value().nextText ? t(stepItem.value().nextText) : t('operate.nextStep')
	}
	return text
}

watch(
	() => props.formList,
	(_) => {
		// 在外部添加步骤以后，需要监听，并重新赋值formData
		const unLiveData = _.filter((item: any) => {
			return !state.formData[item.name]
		})
		unLiveData.forEach((item: any) => {
			// 保留已经发生变化的formData
			props.echoFormList.forEach((_: any) => {
				if (item.name === _.name) {
					state.formData[item.name] = initData(item.initForm.formMain, _.initForm)
				} else if (!_[item.name]) {
					state.formData[item.name] = initData(item.initForm.formMain, {})
				}
			})
		})
	}
)

const emits = defineEmits(['actionNextSubmit', 'cascaderUpdate', 'selectUpdate', 'switchVisible', 'inputChange', 'cancelAction'])

// 返回第几步的表单数据 @params: 第几步， 什么属性
const submitFormData = computed(() => {
	return (stepKey: string, name: string) => {
		return name ? state.formData[stepKey][name] : state.formData[stepKey]
	}
})
// 返回表单中所有的插槽,前面已经区分第几步的插槽,所以在使用的时候可以直接引入。就算是所有都使用到的插槽都无所谓
// 如果插槽名一样，那么最好功能一样，否则的话就要区分不同的名字
const slotArray: FormMainType = stepItem.value().initForm.formMain?.filter((item: FormMainType) => item.type === 'slot')

const formItemSlots = () => {
	const _ = stepItem.value().initForm || ''
	const formItemSlots = _.formMain
		.map((item: any) => {
			if (item.formItemSlots && item.formItemSlots.length !== 0) return item.formItemSlots
		})
		.filter((res: any) => res)
	return formItemSlots.flat() // 降维
}

// 改变步骤中的某一个值，在哪里改变很重要!
const setFormData = ({ stepName, key = '', value }: any) => {
	if (key && state.formData[stepName]) {
		state.formData[stepName][key] = value
	} else if (state.formData[stepName]) {
		const data = { ...state.formData[stepName], ...value }
		state.formData[stepName] = data
	}
}
interface DataType {
	value: any
	key: string
	step: string
}
const selectUpdate = (data: DataType) => {
	emits('selectUpdate', data)
}
const cascaderUpdate = (data: DataType) => {
	// 级联选择器改变数据的方式
	const form = state.formData
	const { value, key, step } = data
	form[`step${step}`][key] = value
	state.formData = form
	emits('cascaderUpdate', data)
}
const inputChange = (_: string) => {
	// 输入框发生变化
	return emits('inputChange', _)
}
const handleAction = ({ action = 'add', data = {}, disabledList = {} }) => {
	switchVisible() // 先初始化，不然会覆盖后面的回显数据
	state.action = action
	if (state.action === 'edit' || state.action === 'addDefault') {
		// 如果是编辑需要回显数据
		state.formData = { ...state.formData, ...data }
	}
	state.disabledList = { ...disabledList }
}
const cancel = () => {
	switchVisible()
	emits('cancelAction')
}
const switchVisible = () => {
	// 切换弹窗显隐，并且初始化数据
	state.step = 1
	state.formData = initListData(props.formList, props.echoFormList)
	state.visible = !state.visible
}
const stepControl = (type = 'next', step?: number) => {
	// 步数控制函数
	if (step && state.step < props.formList.length) {
		state.step = step
	} else {
		type === 'next' && state.step < props.formList?.length && (state.step += 1)
		type === 'prev' && state.step > 1 ? (state.step -= 1) : cancel()
	}
}
const handleConfirmClick = () => {
	// 可以选择将ref也传出去,也可以选择在这里校验
	const item = stepItem.value()
	const { eleFormRef = {} } = proxy.$refs[`${item.name}Ref`][0]
	eleFormRef.validate((valid: any) => {
		if (valid) {
			const data = {
				formList: { ...state.formData },
				formData: { ...state.formData[item.name] },
				step: state.step,
				stepName: item.name
			}
			emits('actionNextSubmit', {
				...data,
				action: state.action
			})
		} else {
			return false
		}
	})
}

defineExpose({ submitFormData, handleAction, setFormData, switchVisible })
</script>

<style scoped lang="less"></style>
