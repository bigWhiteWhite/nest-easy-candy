<template>
	<el-container class="layout-container flex-center">
		<Header />
		<el-container class="layout-mian-height-50">
			<Aside />
			<div class="flex-center layout-backtop">
				<TagsView v-if="themeConfig.isTagsview" />
				<Main />
			</div>
		</el-container>
		<el-backtop target=".layout-backtop .el-main .el-scrollbar__wrap"></el-backtop>
	</el-container>
</template>

<script lang="ts" setup name="layoutClassic">
import Aside from '../components/aside.vue'
import Header from '../components/header.vue'
import Main from '../components/main.vue'
import TagsView from '@/layout/navBars/tagsView/index.vue'
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '@/store/modules/theme.config'
const { themeConfig } = storeToRefs(useThemeConfig())
</script>

<style scoped lang="less"></style>
