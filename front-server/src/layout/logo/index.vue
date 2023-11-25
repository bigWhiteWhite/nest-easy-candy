<template>
	<div v-if="setShowLogo" class="layout-logo" @click="onThemeConfigChange">
		<!-- <img src="https://static-hk.obs.myhuaweicloud.com/web/xcredit/XGO.webp" class="layout-logo-medium-img" /> -->
		<!-- <span>{{ themeConfig.globalTitle }}</span> -->
	</div>
	<div v-else class="layout-logo-size" @click="onThemeConfigChange">
		<!-- <img src="https://static-hk.obs.myhuaweicloud.com/web/xcredit/XGO-logo-5.webp" class="layout-logo-size-img" /> -->
	</div>
</template>

<script lang="ts" setup name="layoutLogo">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
// import logoMini from '@/assets/icons/logo.svg'
import { useThemeConfig } from '@/store/modules/theme.config'
const { themeConfig } = storeToRefs(useThemeConfig())
// 设置 logo 的显示。classic 经典布局默认显示 logo
const setShowLogo = computed(() => {
	const { isCollapse, layout } = themeConfig.value
	return !isCollapse || layout === 'classic' || document.body.clientWidth < 1000
})
// logo 点击实现菜单展开/收起
const onThemeConfigChange = () => {
	if (themeConfig.value.layout === 'transverse') return false
	themeConfig.value.isCollapse = !themeConfig.value.isCollapse
}
</script>

<style scoped lang="less">
.layout-logo {
	width: 220px;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: rgb(0 21 41 / 2%) 0px 1px 4px;
	color: var(--el-color-primary);
	font-size: 16px;
	cursor: pointer;
	animation: logoAnimation 0.3s ease-in-out;
	span {
		white-space: nowrap;
		display: inline-block;
	}
	&:hover {
		span {
			color: var(--color-primary-light-2);
		}
	}
	&-medium-img {
		width: 30%;
		// width: 65px;
		// margin-right: 5px;
	}
}
.layout-logo-size {
	width: 100%;
	height: 50px;
	display: flex;
	cursor: pointer;
	animation: logoAnimation 0.3s ease-in-out;
	&-img {
		width: 90px;
		// width: 30px;
		margin: auto;
	}
	&:hover {
		img {
			animation: logoAnimation 0.3s ease-in-out;
		}
	}
}
</style>
