<template>
	<div class="layout-navbars-container">
		<breadcrumb-index />
		<TagsView v-if="setShowTagsView" />
	</div>
</template>

<script lang="ts" setup name="layoutNavBars">
import BreadcrumbIndex from './breadcrumb/index.vue'
import TagsView from './tagsView/index.vue'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '@/store/modules/theme.config'
const { themeConfig } = storeToRefs(useThemeConfig())
// 是否显示 tagsView
const setShowTagsView = computed(() => {
	const { layout, isTagsview } = themeConfig.value
	return layout !== 'classic' && isTagsview
})
</script>

<style scoped lang="less">
.layout-navbars-container {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}
</style>
