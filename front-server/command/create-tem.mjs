import { CreateTemplate } from './create.main.mjs'
const main = () => {
	const createTemplate = new CreateTemplate('command/templates', 'src/layout/navBars/breadcrumb', {
		// 'src/views/main/online'
		key: '密码',
		pageName: "'psw'"
	})
	createTemplate.start()
}
main()
