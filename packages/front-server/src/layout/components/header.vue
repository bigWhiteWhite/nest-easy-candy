<template>
	<el-header v-show="!isTagsViewCurrentFull" class="layout-header" :height="setHeaderHeight">
		<NavBarsIndex />
	</el-header>
</template>

<script lang="ts" setup name="layoutHeader">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import NavBarsIndex from '../navBars/index.vue'
import { useThemeConfig } from '@/store/modules/theme.config'
import { useTagsViewRoutes } from '@/store/modules/tagsViewRoutes'
const { themeConfig } = storeToRefs(useThemeConfig())
const { isTagsViewCurrentFull } = storeToRefs(useTagsViewRoutes())

// 设置 header 的高度
const setHeaderHeight = computed(() => {
	const { isTagsview, layout } = themeConfig.value
	if (isTagsview && layout !== 'classic') return '84px'
	else return '50px'
})
</script>

<style scoped lang="less"></style>
