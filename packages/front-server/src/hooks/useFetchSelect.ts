import { onMounted, ref } from 'vue' // 定义下拉框接收的数据格式

export interface SelectOption {
	value: string
	label: string
	disabled?: boolean
	key?: string
}
// 定义入参格式
interface FetchSelectProps {
	valueKey: string
	labelKey: string
	apiFun: Promise<any>
}

export const useFetchSelect = (props: FetchSelectProps) => {
	const { apiFun, valueKey, labelKey } = props

	const options = ref<SelectOption[]>([])
	const loading = ref(false)
	const number = ref(0)

	const loadData = async () => {
		loading.value = true
		options.value = []
		try {
			const { count, dataList } = await apiFun
			loading.value = false
			options.value = dataList.map((item: any) => ({ value: item[valueKey], label: item[labelKey] }))
			console.log('🚀 ~ file: useFetchSelect.ts:31 ~ loadData ~ options.value', options.value)
			number.value = count
		} catch (error: any) {
			// 未知错误，可能是代码抛出的错误，或是网络错误
			loading.value = false
			options.value = [
				{
					value: '-1',
					label: error.message,
					disabled: true
				}
			]
			// 接着抛出错误
			return Promise.reject(error)
		}
	}

	onMounted(() => {
		loadData()
	})

	return {
		options,
		loading,
		number
	}
}
