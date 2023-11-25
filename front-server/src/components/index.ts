import { App } from 'vue'
import SvgIcon from './SvgIcon/index.vue' // svg组件

const components = [SvgIcon]

export default function (app: App) {
	components.forEach((item) => app.component(item.name, item))
}
