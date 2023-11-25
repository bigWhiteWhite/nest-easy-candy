<template>
	<el-form ref="eleFormRef" :model="modelValue" :rules="props.rules" v-bind="props.formProps">
		<el-row v-bind="props.rowProps">
			<el-col
				v-for="formItem in props.formMain"
				v-show="!formItem.dynamicHide"
				v-bind="{ ...props.colProps, ...formItem.colProps }"
				:key="formItem.value"
			>
				<el-form-item
					v-if="!formItem.dynamicHide"
					:class="['form_item', formItem.class]"
					:prop="formItem.value"
					:label="$t(formItem.label)"
					v-bind="{ ...props.formItemOptions, ...formItem.formItemOptions }"
				>
					<!-- ?输入框-->
					<template v-if="formItem.type === 'input' || formItem.type === 'password'">
						<el-input
							v-bind="{ ...props.itemOptions, ...formItem.itemOptions }"
							:disabled="formItem.disabled"
							:show-password="formItem.type === 'password'"
							:model-value="modelValue[formItem.value]"
							@update:model-value="handleValueChange($event, formItem.value)"
							@change="handleInputChange($event, formItem.value)"
							@focus="inputFocus(formItem.value)"
						>
							<template v-if="formItem.prepend" #prepend>
								<slot :name="`prepend_${formItem.value}`"></slot>
							</template>
							<template v-if="formItem.append" #append>
								<slot :name="`append_${formItem.value}`"></slot>
							</template>
						</el-input>
					</template>
					<!-- ?数字选择输入框 -->
					<template v-else-if="formItem.type === 'inputNumber'">
						<el-input-number
							v-bind="{ ...props.itemOptions, ...formItem.itemOptions }"
							:disabled="formItem.disabled"
							:model-value="modelValue[formItem.value]"
							@update:model-value="handleValueChange($event, formItem.value)"
						>
						</el-input-number>
					</template>
					<!-- ?选择框 -->
					<template v-else-if="formItem.type === 'select'">
						<el-select
							v-bind="{ ...props.itemOptions, ...formItem.itemOptions }"
							:loading="formItem.loading"
							:disabled="formItem.disabled"
							:model-value="modelValue[formItem.value]"
							@update:model-value="handleValueChange($event, formItem.value)"
							@change="handleSelectChange($event, formItem.value)"
						>
							<el-option v-for="option in formItem.options" :key="option.value" :value="option.value" :label="option.label && $t(option.label)" />
						</el-select>
					</template>
					<!-- ?虚拟选择器 -->
					<template v-else-if="formItem.type === 'virtually-select'">
						<el-select-v2
							:model-value="modelValue[formItem.value]"
							:options="formItem.options"
							v-bind="{ ...props.itemOptions, ...formItem.itemOptions }"
							@update:model-value="handleValueChange($event, formItem.value)"
							@change="handleSelectChange($event, formItem.value)"
						/>
					</template>
					<!-- ?级联选择框 -->
					<template v-else-if="formItem.type === 'cascader'">
						<el-cascader
							v-bind="{ ...props.itemOptions, ...formItem.itemOptions }"
							:options="formItem.options"
							:disabled="formItem.disabled"
							:model-value="modelValue[formItem.value]"
							@update:model-value="handleValueChange($event, formItem.value)"
						/>
						<!-- @change="handleSelectChange($event, formItem.value)" -->
					</template>
					<!-- ?单选框 -->
					<template v-else-if="formItem.type === 'radio'">
						<el-radio-group
							v-bind="{ ...props.itemOptions, ...formItem.itemOptions }"
							name="radioGroup"
							:disabled="formItem.disabled"
							:model-value="modelValue[formItem.value]"
							@update:model-value="handleValueChange($event, formItem.value)"
						>
							<el-radio v-for="radio in formItem.radios" :key="radio.value" :label="radio.value">
								{{ radio.label && $t(radio.label) }}
							</el-radio>
						</el-radio-group>
					</template>
					<!-- ?多选框 -->
					<template v-else-if="formItem.type === 'checkbox'">
						<el-checkbox-group
							v-bind="{ ...props.itemOptions, ...formItem.itemOptions }"
							:model-value="modelValue[formItem.value]"
							:disabled="formItem.disabled"
							@update:model-value="handleValueChange($event, formItem.value)"
						>
							<el-checkbox v-for="checkbox in formItem.checkboxs" :key="checkbox.value" :label="checkbox.value">
								{{ checkbox.label && $t(checkbox.label) }}
							</el-checkbox>
						</el-checkbox-group>
					</template>
					<!-- ?时间选择框 -->
					<template v-else-if="formItem.type === 'datePicker'">
						<el-time-picker
							v-bind="{ ...props.itemOptions, ...formItem.itemOptions }"
							:disabled="formItem.disabled"
							:model-value="modelValue[formItem.value]"
							@update:model-value="handleValueChange($event, formItem.value)"
							@change="handleSelectChange($event, formItem.value)"
						/>
					</template>
					<!-- ?时间范围选择框 -->
					<template v-else-if="formItem.type === 'timePicker'">
						<el-time-select
							v-bind="{ ...props.itemOptions, ...formItem.itemOptions }"
							:disabled="formItem.disabled"
							:model-value="modelValue[formItem.value]"
							@update:model-value="handleValueChange($event, formItem.value)"
							@change="handleSelectChange($event, formItem.value)"
						/>
					</template>
					<!-- ?日期范围选择框 -->
					<template v-else-if="formItem.type === 'rangePicker'">
						<el-date-picker
							type="datetimerange"
							:shortcuts="formItem.shortcuts || shortcuts"
							v-bind="{ ...props.itemOptions, ...formItem.itemOptions }"
							:disabled="formItem.disabled"
							:model-value="modelValue[formItem.value]"
							@update:model-value="handleValueChange($event, formItem.value)"
							@change="handleSelectChange($event, formItem.value)"
						/>
					</template>
					<!-- ?表单插槽 -->
					<template v-else-if="formItem.type === 'slot'">
						<slot :name="formItem.value"></slot>
					</template>
					<!-- ?二次组合框使用插槽 -->
				</el-form-item>
			</el-col>
		</el-row>
		<el-row>
			<slot name="footer" :search="search"></slot>
		</el-row>
	</el-form>
</template>

<script lang="ts" setup name="BaseForm">
import { PropType, computed, ref, getCurrentInstance, onMounted, nextTick, onUnmounted } from 'vue'
import type { FormMainType, RulesType, ItemOptionsType, FormItemOptions } from '@/types/ElementPlus'
import type { FormContext, FormInstance } from 'element-plus'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { ColRowType } from '@/types/ElementPlus/common'
const { proxy } = <any>getCurrentInstance()
const { t } = useI18n()
const props = defineProps({
	queryName: {
		type: String,
		required: false,
		default: ''
	},
	modelValue: {
		type: Object,
		required: true
	},
	formProps: {
		type: Object as PropType<FormContext>,
		default: () => ({
			labelWidth: '100px', // 表单项中标题所占的宽度
			labelPosition: 'left'
		})
	},
	formMain: {
		type: Array as PropType<FormMainType[]>,
		required: true
	},
	formItemOptions: {
		type: Object as PropType<FormItemOptions>,
		default: () => ({
			style: { padding: '10px 0' }
		})
	},
	itemOptions: {
		type: Object as PropType<ItemOptionsType>,
		default: () => ({
			clearable: true,
			size: 'default',
			style: { width: '100%' }
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
			xl: 6,
			lg: 6,
			md: 8,
			sm: 12,
			xs: 24,
			class: 'zy_col'
		})
	},
	rules: {
		type: Object as PropType<RulesType>,
		default: () => ({})
	}
})
const eleFormRef = ref<FormInstance>()

const emits = defineEmits(['update:modelValue', 'selectUpdate', 'cascaderUpdate', 'inputChange', 'inputFocus', 'search'])

// https://dayjs.fenxianglu.cn/category/manipulate.html#%E5%A2%9E%E5%8A%A0
const shortcuts = computed(() => {
	return [
		{
			text: t('operate.last10Minute'),
			value: () => [dayjs().subtract(10, 'minute'), dayjs()]
		},
		{
			text: t('operate.last30Minutes'),
			value: () => [dayjs().subtract(30, 'minute'), dayjs()]
		},
		{
			text: t('operate.last60Minutes'),
			value: () => [dayjs().subtract(1, 'hour'), dayjs()]
		},
		{
			text: t('operate.lastWeek'),
			value: () => [dayjs().subtract(1, 'week'), dayjs()]
		},
		{
			text: t('operate.lastMonth'),
			value: () => [dayjs().subtract(1, 'month'), dayjs()]
		},
		{
			text: t('operate.lastSixMonths'),
			value: () => [dayjs().subtract(6, 'month'), dayjs()]
		},
		{
			text: t('operate.last1year'),
			value: () => [dayjs().subtract(1, 'year'), dayjs()]
		},
		{
			text: t('operate.today'),
			value: [dayjs().startOf('day'), dayjs().endOf('day')]
		},
		{
			text: t('operate.thisMonth'),
			value: [dayjs().startOf('month'), dayjs().endOf('month')]
		},
		{
			text: t('operate.thisYear'),
			value: [dayjs().startOf('year'), dayjs().endOf('year')]
		}
	]
})
const handleValueChange = (value: any, key: string) => {
	return emits('update:modelValue', { ...props.modelValue, [key]: value })
}
const handleSelectChange = (value: any, key: string) => {
	// 选择器和时间选择器
	return emits('selectUpdate', { value, key })
}
const inputFocus = (name: string) => {
	return emits('inputFocus', name)
}
const handleInputChange = (_: string | number, name: string) => {
	// 仅在输入框失去焦点或用户按下回车时触发
	return emits('inputChange', { value: _, name })
}
const reset = () => {
	if (!eleFormRef.value) return
	eleFormRef.value.resetFields()
}
/**
 * @description 搜索事件
 */
const search = async () => {
	try {
		props.queryName &&
			eleFormRef.value?.validate((valid) => {
				if (valid) {
					// 点击触发事件总线发送事件
					proxy.$mittBus.emit(props.queryName, props.modelValue)
					emits('search')
				}
			})
		console.log('搜索')
	} catch (error) {
		return Promise.reject(error)
	}
}
onMounted(() => {
	// 挂载事件总线,使用数据总线传递数据, 解决第一次监听不到的原因
	props.queryName &&
		nextTick(() => {
			proxy.$mittBus.emit(props.queryName, props.modelValue)
		})
	props.queryName &&
		proxy.$mittBus.on(`refresh_${props.queryName}`, () => {
			console.log(`refresh_${props.queryName} --> 刷新列表`)
			search()
		})
})
// 页面卸载时
onUnmounted(() => {
	props.queryName && proxy.$mittBus.off(props.queryName, () => {})
})
defineExpose({ eleFormRef, reset })
</script>

<style scoped lang="less"></style>
