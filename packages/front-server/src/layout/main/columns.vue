<template>
	<el-container class="layout-container">
		<columns-aside />
		<div class="layout-columns-warp">
			<Aside />
			<el-container class="flex-center layout-backtop" :class="{ 'layout-backtop': !isFixedHeader }">
				<Header v-if="isFixedHeader" />
				<el-scrollbar :class="{ 'layout-backtop': isFixedHeader }">
					<Header v-if="!isFixedHeader" />
					<Main />
				</el-scrollbar>
			</el-container>
		</div>
		<el-backtop target=".layout-backtop .el-scrollbar__wrap"></el-backtop>
	</el-container>
</template>

<script lang="ts" setup name="layoutColumns">
import Aside from '../components/aside.vue'
import Header from '../components/header.vue'
import Main from '../components/main.vue'
import ColumnsAside from '@/layout/components/columnsAside.vue'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useThemeConfig } from '@/store/modules/theme.config'
const { themeConfig } = storeToRefs(useThemeConfig())

const isFixedHeader = computed(() => {
	return themeConfig.value.isFixedHeader
})
</script>

<style scoped lang="less"></style>
