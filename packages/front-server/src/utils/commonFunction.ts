import useClipboard from 'vue-clipboard3'
import { ElMessage } from 'element-plus'
import { i18n } from '@/locales'

// 点击复制文本
export const copyText = (text: string) => {
	const { toClipboard } = useClipboard()
	return new Promise((resolve, reject) => {
		try {
			//复制
			toClipboard(text)
			//下面可以设置复制成功的提示框等操作
			ElMessage.success(i18n.global.t(<any>'layout.copyTextSuccess'))
			resolve(text)
		} catch (e) {
			//复制失败
			ElMessage.error(i18n.global.t(<any>'layout.copyTextError'))
			reject(e)
		}
	})
}

export default {
	copyText
}
