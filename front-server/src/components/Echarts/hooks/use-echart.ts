import * as echarts from 'echarts'

// echarts.registerMap('china', chinaMapData)

export function useEchart(el: HTMLElement) {
	const myChart = echarts.init(el)
	const setOptions = (options: echarts.EChartsOption) => {
		myChart.setOption(options)
	}
	// 这个函数为了点击折叠按钮,调用
	const updateResize = () => {
		myChart.resize()
	}
	window.addEventListener('resize', () => {
		myChart.resize()
	})

	return { myChart, updateResize, setOptions }
}
