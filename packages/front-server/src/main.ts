import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import MyComponents from '@/components/index'
import plugins from '@/plugins/index'
import { i18n } from '@/locales'
import { pinia } from './store'
import other from '@/utils/other'
import 'virtual:svg-icons-register'
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
const app = createApp(App)
// 注册pinia状态管理库
app.use(pinia)
other.elIcon(app)
app
	.use(router)
	.use(ElementPlus, { i18n: i18n.global.t } as any)
	.use(i18n)
	.use(VueViewer)
	.use(plugins)
	.use(MyComponents)
	.mount('#app')

export default app
