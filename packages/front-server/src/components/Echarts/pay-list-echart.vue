<template>
	<div ref="divRef" v-bind="echartsOptions">123</div>
</template>

<script lang="ts" setup name="BaseEcharts">
import { ref, onMounted, watchEffect, PropType } from 'vue'
import { useEchart } from './hooks/use-echart'
import type { EChartsOption } from 'echarts'

const props = defineProps({
	echartsOptions: {
		type: Object,
		default: () => ({ style: { width: '100%', height: '500px' } })
	},
	options: {
		type: Object as PropType<EChartsOption>,
		required: true
	}
})

const divRef = ref<HTMLElement>()
// setup中拿不到html元素,onMounted中处理,数据变化重新设置
onMounted(() => {
	const { setOptions } = useEchart(divRef.value!)
	watchEffect(() => {
		setOptions(props.options)
	})
})
</script>

<style scoped lang="less"></style>
