<template>
	<i v-if="isShowEle" :class="eleClass">
		<component :is="getIconName" />
	</i>
	<svg v-else :class="svgClass" aria-hidden="true" v-on="$attrs">
		<use :xlink:href="iconClass" />
	</svg>
</template>

<script setup lang="ts" name="svgIcon">
import { PropType, computed } from 'vue'

const props = defineProps({
	// svg文件名
	iconName: {
		type: String as PropType<string>,
		required: true
	},
	// 自定义类名
	className: {
		type: String as PropType<string>,
		default: ''
	}
})

const iconClass = computed(() => `#icon-${props.iconName}`)
const svgClass = computed(() => {
	if (props.className) {
		return `svg-icon ${props.className}`
	} else {
		return 'svg-icon'
	}
})

// 用于判断 element plus 自带 svg 图标的显示、隐藏
const isShowEle = computed(() => {
	return props?.iconName?.startsWith('ele-')
})
// 获取 icon 图标名称
const getIconName = computed(() => {
	return props?.iconName
})

const eleClass = computed(() => {
	if (props.className) {
		return `el-icon ${props.className}`
	} else {
		return 'el-icon'
	}
})
</script>

<style scoped>
.svg-icon {
	height: 1em;
	margin-right: 5px;
	width: var(--el-menu-icon-width);
	overflow: hidden;
	vertical-align: -0.15em;
	fill: currentColor;
	text-align: center;
	font-size: 18px;
	vertical-align: middle;
}
</style>
