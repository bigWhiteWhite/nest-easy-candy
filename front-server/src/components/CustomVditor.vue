<template>
	<div v-if="props.preview" ref="previewRef" class="preview"></div>
	<div v-else ref="editorRef"></div>
</template>
<script setup lang="ts" name="VditorEdit">
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import Vditor from 'vditor'
// import VditorPreview from 'vditor/dist/method.min'
import 'vditor/dist/index.css'
const props = defineProps({
	preview: {
		type: Boolean,
		default: false
	},
	content: {
		type: String,
		required: true
	}
})
const previewRef = ref()
const editorRef = ref()
let instance = null as any
const init = () => {
	instance = new Vditor(editorRef.value, {
		height: 720,
		mode: 'ir',
		toolbarConfig: {
			pin: true
		},
		cache: {
			enable: false
		},
		after: () => {
			instance.setValue(props.content)
		},
		preview: {
			hljs: {
				langs: [
					'npm',
					'mermaid',
					'echarts',
					'mindmap',
					'plantuml',
					'repl',
					'abc',
					'graphviz',
					'flowchart',
					'apache',
					'js',
					'ts',
					'html',
					'markmap',
					'common',
					'properties',
					'apache',
					'bash',
					'c',
					'csharp',
					'cpp',
					'css',
					'coffeescript',
					'diff',
					'go',
					'xml',
					'http',
					'vue',
					'json',
					'java',
					'javascript',
					'kotlin',
					'less',
					'lua',
					'makefile',
					'markdown',
					'nginx',
					'objectivec',
					'php',
					'php-template',
					'perl',
					'plaintext',
					'python',
					'python-repl',
					'r',
					'ruby',
					'rust',
					'scss',
					'sql',
					'shell',
					'swift',
					'ini',
					'typescript',
					'vbnet',
					'yaml',
					'ada',
					'clojure',
					'dart',
					'erb',
					'fortran',
					'gradle',
					'haskell',
					'julia',
					'julia-repl',
					'lisp',
					'matlab',
					'pgsql',
					'powershell',
					'sql_more',
					'stata',
					'cmake',
					'mathematica',
					// ext
					'solidity',
					'yul'
				],
				style: 'dracula'
			},
			markdown: {
				fixTermTypo: true
			}
		},
		outline: {
			position: 'left',
			enable: true
		},
		// 这里写上传
		upload: {
			accept: 'image/jpg, image/jpeg, image/png', // 规定上传的图片格式
			url: '/dfs/upload', // 请求的接口
			multiple: false,
			fieldName: 'file',
			max: 2 * 1024 * 1024, // 上传图片的大小
			extraData: { auth_tonken: '123456789' }, // 为 FormData 添加额外的参数
			linkToImgUrl: '/dfs/upload',
			filename(name) {
				return name
			},
			// validate(msg) {
			// 	console.log(msg + '格式')
			// },
			// 粘贴图片回显处理，如果有图片加了防盗链，则让后台代理替换成自己的图片
			// linkToImgFormat(files) {
			// 	const resData = JSON.parse(files)
			// 	const code = resData.code
			// 	const msg = resData.msg
			// 	const data = resData.data
			// 	// 上传图片请求状态
			// 	if (code === '0') {
			// 		const succ = {}
			// 		succ[data.fileName] = data.url
			// 		// 图片回显
			// 		return JSON.stringify({
			// 			msg,
			// 			code,
			// 			data: {
			// 				errFiles: [],
			// 				succMap: succ
			// 			}
			// 		})
			// 	} else {
			// 		console.log(msg + '上传失败了')
			// 	}
			// },
			// 上传图片回显处理
			// format(files, responseText) {
			// 	const resData = JSON.parse(responseText)
			// 	const code = resData.code
			// 	const msg = resData.msg
			// 	const data = resData.data
			// 	// 上传图片请求状态
			// 	if (code === '0') {
			// 		const succ = {}
			// 		succ[data.fileName] = data.url
			// 		// 图片回显
			// 		return JSON.stringify({
			// 			msg,
			// 			code,
			// 			data: {
			// 				errFiles: [],
			// 				succMap: succ
			// 			}
			// 		})
			// 	} else {
			// 		console.log(msg + '上传失败了')
			// 	}
			// },
			error(msg) {
				console.log(msg + '上传失败了')
			}
		}
	})
}
// 监听content
watch(
	() => props.content,
	(content) => {
		if (instance && !props.preview) {
			instance.setValue(content)
		}
	},
	{
		immediate: true
	}
)
// 获取内容
// const getEditValue = () => {
// 	return instance.getValue()
// }
// 初始化
onMounted(() => {
	if (!props.preview) {
		nextTick(() => {
			init()
		})
	} else {
		// // 调用 Vditor 的预览渲染方法
		// const iPreviewOptions: IPreviewOptions = {
		// 	mode: 'light',
		// 	anchor: 1,
		// 	speech: {
		// 		// 对选中后的内容进行阅读
		// 		enable: true
		// 	}
		// }
		// VditorPreview.preview(previewRef.value, props.content, iPreviewOptions)
	}
})
// 销毁
onBeforeUnmount(() => {
	instance?.destroy()
	instance = null
})
</script>
<style scoped></style>
