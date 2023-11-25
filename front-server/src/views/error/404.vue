<template>
	<div class="error layout-view-bg-white" :style="{ height: `calc(100vh - ${initTagViewHeight}` }">
		<div class="error-flex">
			<div class="left">
				<div class="left-item">
					<div class="left-item-animation left-item-num">404</div>
					<div class="left-item-animation left-item-title">{{ $t('notFound.foundTitle') }}</div>
					<div class="left-item-animation left-item-msg">{{ $t('notFound.foundMsg') }}</div>
					<div class="left-item-animation left-item-btn">
						<el-button type="primary" round @click="onGoHome">{{ $t('notFound.foundBtn') }}</el-button>
					</div>
				</div>
			</div>
			<div class="right"></div>
		</div>
	</div>
</template>

<script lang="ts" setup name="404">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '@/store/modules/theme.config'
import { useTagsViewRoutes } from '@/store/modules/tagsViewRoutes'
import lottie from 'lottie-web'
import HomeBackground from '@/assets/json/home-background.json'
import { onMounted } from 'vue'
const { themeConfig } = storeToRefs(useThemeConfig())
const { isTagsViewCurrentFull } = storeToRefs(useTagsViewRoutes())
const router = useRouter()
const onGoHome = () => {
	router.push('/')
}
// 设置主内容的高度
const initTagViewHeight = computed(() => {
	const { isTagsview } = themeConfig.value
	if (isTagsViewCurrentFull.value) {
		return `30px`
	} else {
		if (isTagsview) return `114px`
		else return `80px`
	}
})

onMounted(() => {
	const jsonAnimation = lottie.loadAnimation({
		container: document.querySelector('.error .right') as Element, //进行播放的元素
		renderer: 'svg',
		loop: true, //循环播放
		autoplay: true, //自动播放
		animationData: HomeBackground //要播放的文件
	})
	jsonAnimation.play()
})
</script>

<style scoped lang="less">
.error {
	height: 100%;
	background-color: var(--el-color-white);
	display: flex;
	.error-flex {
		margin: auto;
		display: flex;
		height: 350px;
		width: 900px;
		.left {
			flex: 1;
			height: 100%;
			align-items: center;
			display: flex;
			.left-item {
				.left-item-animation {
					// opacity: 0;
					animation-name: error-num;
					animation-duration: 0.5s;
					animation-fill-mode: forwards;
				}
				.left-item-num {
					color: var(--el-color-info);
					font-size: 55px;
				}
				.left-item-title {
					font-size: 20px;
					color: var(--el-text-color-primary);
					margin: 15px 0 5px 0;
					animation-delay: 0.1s;
				}
				.left-item-msg {
					color: var(--el-text-color-secondary);
					font-size: 12px;
					margin-bottom: 30px;
					animation-delay: 0.2s;
				}
				.left-item-btn {
					animation-delay: 0.2s;
				}
			}
		}
		.right {
			flex: 1;
			// opacity: 0;
			animation-name: error-img;
			animation-duration: 2s;
			animation-fill-mode: forwards;
			img {
				width: 100%;
				height: 100%;
			}
		}
	}
}
</style>
