import { useRoutesList } from '@/store/modules/routesList'
import { useCommon } from './useCommon'
import { ElMessage } from 'element-plus'

export const useSocket = (needConnect: boolean = false, listenName?: string, callback?: any) => {
	const { logOut, getUserMenu } = useCommon()
	const { systemList } = storeToRefs(useRoutesList())
	const { proxy } = <any>getCurrentInstance()

	onBeforeMount(() => {
		proxy.$socket?.on('update_menu', async () => {
			ElMessage.warning(`重新获取菜单`)
			// proxy.$disconnect()
			// connect()
			await getUserMenu()
			await useRoutesList().setActiveSystem(systemList.value[0])
			window.location.reload()
		})
		proxy.$socket?.on('online', ({ username }) => {
			ElMessage.success(`${username}上线啦~`)
		})
		// proxy.$socket?.on('offline', () => {
		// 	ElMessage.warning(`下线啦~`)
		// })
		proxy.$socket?.on('kick', (res) => {
			res?.operater && ElMessage.error(`强制下线: 执行者${res.operater}`)
			setTimeout(() => {
				logOut()
			}, 500)
		})
		if (listenName) {
			proxy.$socket.on(listenName, callback)
		}
	})
}

// export const useSocket = (listenName?: string, callback?: any) => {
// 	const { logOut, getUserMenu } = useCommon()
// 	const { systemList } = storeToRefs(useRoutesList())
// 	const { socket } = storeToRefs(useSocketIo())
// 	onBeforeMount(() => {
// 		useSocketIo().initSocket()
// 	})
// 	onMounted(() => {
// 		socket.value?.on('update_menu', async () => {
// 			ElMessage.warning(`重新获取菜单`)
// 			await getUserMenu()
// 			await useRoutesList().setActiveSystem(systemList.value[0])
// 			window.location.reload()
// 		})
// 		socket.value?.on('online', ({ username }) => {
// 			ElMessage.success(`${username}上线啦~`)
// 		})
// 		// socket.value?.on('offline', () => {
// 		// 	ElMessage.warning(`下线啦~`)
// 		// })
// 		socket.value?.on('kick', (res) => {
// 			res?.operater && ElMessage.error(`强制下线: 执行者${res.operater}`)
// 			setTimeout(() => {
// 				logOut()
// 			}, 500)
// 		})
// 		if (listenName) {
// 			socket.value?.on(listenName, callback)
// 		}
// 	})
// }
