import { App } from 'vue'
import 'normalize.css'
import '@/theme/index.less'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import globalVar from './globalVar'
import SocketIo from './ws/main'
// import SocketIo from './socketIo'
import Cookies from 'js-cookie'
const plugins = [globalVar, mavonEditor]
export default {
	install(app: App) {
		plugins.forEach((_) => {
			app.use(_)
		})
		app.use(SocketIo, import.meta.env.VITE_WEBSOCKET_URL, {
			lib: 'socketIo',
			query: {
				token: Cookies.get('CmsSystemToken') || ''
			},
			// connectManually: true,
			transports: ['websocket'], // default ['polling','websocket', 'webtransport']
			reconnectionDelay: 3000, // 重连延迟时间（毫秒）
			reconnectionDelayMax: 5000, // 重连延迟的最大值（5 秒）
			randomizationFactor: 0.5 // 引入随机性
		})
		// app.use(SocketIo, import.meta.env.VITE_WEBSOCKET_URL, {
		// 	query: {
		// 		token: Cookies.get('CmsSystemToken') || ''
		// 	},
		// 	transports: ['websocket'], // default ['polling','websocket', 'webtransport']
		// 	reconnectionDelay: 3000, // 重连延迟时间（毫秒）
		// 	reconnectionDelayMax: 5000, // 重连延迟的最大值（5 秒）
		// 	randomizationFactor: 0.5 // 引入随机性
		// })
	}
}
