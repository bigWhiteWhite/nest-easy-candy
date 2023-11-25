<template>
	<div v-if="isTagsViewCurrentFull" class="layout-navbars-close-full">
		<div class="layout-navbars-close-full-icon">
			<svg-icon icon-name="ele-Close" :title="$t('tagsView.closeFullscreen')" @click="onCloseFullscreen" />
		</div>
	</div>
</template>

<script lang="ts" setup name="layoutCloseFull">
import { storeToRefs } from 'pinia'
import { useTagsViewRoutes } from '@/store/modules/tagsViewRoutes'
const { isTagsViewCurrentFull } = storeToRefs(useTagsViewRoutes())
// 关闭当前全屏
const onCloseFullscreen = () => {
	useTagsViewRoutes().setCurrenFullscreen(false)
}
</script>

<style scoped lang="less">
.layout-navbars-close-full {
	position: fixed;
	z-index: 9999999999;
	right: -30px;
	top: -30px;
	.layout-navbars-close-full-icon {
		width: 60px;
		height: 60px;
		border-radius: 100%;
		cursor: pointer;
		background: rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		position: relative;
		:deep(i) {
			position: absolute;
			left: 10px;
			top: 35px;
			color: #333333;
			transition: all 0.3s ease;
		}
	}
	&:hover {
		transition: all 0.3s ease;
		:deep(i) {
			color: var(--el-color-primary);
			transition: all 0.3s ease;
		}
	}
}
</style>
