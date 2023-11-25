import { FormProps } from 'element-plus'
import { FormComponentGenerator, ComponentConfigurator } from '@/plugins/createComponents'
const props = {
	modelValue: {
		type: Object,
		required: true
	},
	formOptions: {
		type: Object as PropType<FormProps>,
		default: () => ({})
	},
	formList: {
		type: Array as PropType<Array<ComponentConfigurator>>,
		required: true
	}
}
export default defineComponent({
	props,
	setup(props) {
		return {
			...toRefs(props)
		}
	},
	render() {
		const { formList, modelValue, formOptions } = this
		return FormComponentGenerator.generate(modelValue, { formList, formOptions })
	}
})
