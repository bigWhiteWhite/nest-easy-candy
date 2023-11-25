<template>
	<el-container class="layout-container">
		<Aside />
		<el-container class="flex-center" :class="{ 'layout-backtop': !isFixedHeader }">
			<Header v-if="isFixedHeader" />
			<el-scrollbar ref="layoutDefaultsScrollbarRef" :class="{ 'layout-backtop': isFixedHeader }">
				<Header v-if="!isFixedHeader" />
				<Main />
			</el-scrollbar>
		</el-container>
		<el-backtop target=".layout-backtop .el-scrollbar__wrap"></el-backtop>
	</el-container>
</template>

<script lang="ts" setup name="layoutDefaults">
import Aside from '../components/aside.vue'
import Header from '../components/header.vue'
import Main from '../components/main.vue'
import { computed, getCurrentInstance, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeConfig } from '@/store/modules/theme.config'
import { storeToRefs } from 'pinia'

const { proxy } = <any>getCurrentInstance()
const route = useRoute()
const { themeConfig } = storeToRefs(useThemeConfig())
const isFixedHeader = computed(() => {
	return themeConfig.value.isFixedHeader
})
// 监听路由的变化
watch(
	() => route.path,
	() => {
		nextTick(() => {
			const scrollRef = proxy.$refs['layoutDefaultsScrollbarRef'].wrap$ || proxy.$refs['layoutDefaultsScrollbarRef'].wrapRef
			scrollRef.scrollTop = 0
		})
	}
)
</script>

<style scoped lang="less"></style>
