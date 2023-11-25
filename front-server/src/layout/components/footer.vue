<template>
	<div v-show="state.isDelayFooter" class="layout-footer mt15">
		<div class="layout-footer-warp">
			<div class="mt5">Data Product Center</div>
		</div>
	</div>
</template>

<script lang="ts" setup name="layoutFooter">
import { reactive } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
const state = reactive({
	isDelayFooter: true
})
// 路由改变时，等主界面动画加载完毕再显示 footer
onBeforeRouteUpdate(() => {
	setTimeout(() => {
		state.isDelayFooter = false
		setTimeout(() => {
			state.isDelayFooter = true
		}, 800)
	}, 0)
})
</script>

<style scoped lang="less">
.layout-footer {
	width: 100%;
	display: flex;
	&-warp {
		margin: auto;
		color: var(--el-text-color-secondary);
		text-align: center;
		animation: error-num 1s ease-in-out;
	}
}
</style>
