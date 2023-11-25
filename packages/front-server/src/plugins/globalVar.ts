/**
 * @全局变量
 */
import { App } from 'vue'
import mitt from 'mitt'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'

export default (app: App) => {
	app.config.globalProperties.$message = ElMessage
	app.config.globalProperties.$echarts = echarts
	app.config.globalProperties.$mittBus = mitt()
}
