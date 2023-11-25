<template>
	<div class="layout-navbars-breadcrumb-user-news">
		<div class="head-box">
			<div class="head-box-title">{{ $t('user.newTitle') }}</div>
			<div v-if="state.newsList.length > 0" class="head-box-btn" @click="onAllReadClick">{{ $t('user.newBtn') }}</div>
		</div>
		<div class="content-box">
			<template v-if="state.newsList.length > 0">
				<div v-for="(v, k) in state.newsList" :key="k" class="content-box-item">
					<div>{{ v.label }}</div>
					<div class="content-box-msg">
						{{ v.value }}
					</div>
					<div class="content-box-time">{{ v.time }}</div>
				</div>
			</template>
			<el-empty v-else :description="$t('user.newDesc')"></el-empty>
		</div>
		<div v-if="state.newsList.length > 0" class="foot-box" @click="onGoToWebClick">{{ $t('user.newGo') }}</div>
	</div>
</template>

<script lang="ts" setup name="layoutBreadcrumbUserNews">
import { dayjs } from 'element-plus'
import { reactive } from 'vue'

const state = reactive({
	newsList: [
		{
			label: '大白',
			value: '欢迎您',
			time: dayjs().format('YYYY-MM-DD HH:mm:ss')
		}
	]
})
// 全部已读点击
const onAllReadClick = () => {
	state.newsList = []
}
// 前往通知中心点击
const onGoToWebClick = () => {
	// window.open('www.baidu.com')
}
</script>

<style scoped lang="less">
.layout-navbars-breadcrumb-user-news {
	.head-box {
		display: flex;
		border-bottom: 1px solid var(--el-border-color-lighter);
		box-sizing: border-box;
		color: var(--el-text-color-primary);
		justify-content: space-between;
		height: 35px;
		align-items: center;
		.head-box-btn {
			color: var(--el-color-primary);
			font-size: 13px;
			cursor: pointer;
			opacity: 0.8;
			&:hover {
				opacity: 1;
			}
		}
	}
	.content-box {
		font-size: 13px;
		.content-box-item {
			padding-top: 12px;
			&:last-of-type {
				padding-bottom: 12px;
			}
			.content-box-msg {
				color: var(--el-text-color-secondary);
				margin-top: 5px;
				margin-bottom: 5px;
			}
			.content-box-time {
				color: var(--el-text-color-secondary);
			}
		}
	}
	.foot-box {
		height: 35px;
		color: var(--el-color-primary);
		font-size: 13px;
		cursor: pointer;
		opacity: 0.8;
		display: flex;
		align-items: center;
		justify-content: center;
		border-top: 1px solid var(--el-border-color-lighter);
		&:hover {
			opacity: 1;
		}
	}
	:deep(.el-empty__description p) {
		font-size: 13px;
	}
}
</style>
