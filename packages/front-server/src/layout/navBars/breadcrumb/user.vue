<template>
	<div class="layout-navbars-breadcrumb-user pr15" :style="{ flex: layoutUserFlexNum }">
		<el-dropdown v-if="handleSystem.length > 0" :show-timeout="70" :hide-timeout="50" trigger="click" @command="onHandleSystem">
			<div class="layout-navbars-breadcrumb-user-icon">
				<el-icon><ele-Switch /></el-icon>
			</div>
			<template #dropdown>
				<el-dropdown-menu v-for="item in handleSystem" :key="item">
					<el-dropdown-item :command="item" :disabled="item === state.disabledSystem">{{ $t(`router.${item}`) }}</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
		<el-dropdown :show-timeout="70" :hide-timeout="50" trigger="click" @command="onComponentSizeChange">
			<div class="layout-navbars-breadcrumb-user-icon">
				<i class="iconfont icon-ziti" :title="$t('user.title0')"></i>
			</div>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="large" :disabled="state.disabledSize === 'large'">{{ $t('user.dropdownLarge') }}</el-dropdown-item>
					<el-dropdown-item command="default" :disabled="state.disabledSize === 'default'">{{ $t('user.dropdownDefault') }}</el-dropdown-item>
					<el-dropdown-item command="small" :disabled="state.disabledSize === 'small'">{{ $t('user.dropdownSmall') }}</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
		<el-dropdown :show-timeout="70" :hide-timeout="50" trigger="click" @command="onLanguageChange">
			<div class="layout-navbars-breadcrumb-user-icon">
				<i class="iconfont" :class="disabledI18n === 'en' ? 'icon-fuhao-yingwen' : 'icon-fuhao-zhongwen'" :title="$t('user.title1')"></i>
			</div>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item v-for="item in messages" :key="item.name" :command="item.name" :disabled="disabledI18n === item.name">
						{{ item.label }}
					</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
		<div class="layout-navbars-breadcrumb-user-icon" @click="onSearchClick">
			<el-icon :title="$t('user.title2')">
				<ele-Search />
			</el-icon>
		</div>
		<div class="layout-navbars-breadcrumb-user-icon" @click="onLayoutSettingClick">
			<i class="icon-skin iconfont" :title="$t('user.title3')"></i>
		</div>
		<div class="layout-navbars-breadcrumb-user-icon">
			<el-popover placement="bottom" trigger="click" transition="el-zoom-in-top" :width="300" :persistent="false">
				<template #reference>
					<el-badge :is-dot="true">
						<el-icon :title="$t('user.title4')">
							<ele-Bell />
						</el-icon>
					</el-badge>
				</template>
				<template #default>
					<user-news />
				</template>
			</el-popover>
		</div>
		<div class="layout-navbars-breadcrumb-user-icon mr10" @click="onScreenfullClick">
			<i
				class="iconfont"
				:title="state.isScreenfull ? $t('user.title6') : $t('user.title5')"
				:class="!state.isScreenfull ? 'icon-fullscreen' : 'icon-tuichuquanping'"
			></i>
		</div>
		<el-dropdown :show-timeout="70" :hide-timeout="50" @command="onHandleCommandClick">
			<span class="layout-navbars-breadcrumb-user-link">
				<svg-icon icon-name="ele-User" class="layout-navbars-breadcrumb-user-link-photo mr5"></svg-icon>
				<!-- <img :src="userInfos.photo" class="layout-navbars-breadcrumb-user-link-photo mr5" /> -->
				{{ userInfos.username || 'common' }}
				<el-icon class="el-icon--right">
					<ele-ArrowDown />
				</el-icon>
			</span>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="/home">{{ $t('user.goHome') }}</el-dropdown-item>
					<el-dropdown-item divided command="editPassword">{{ $t('operate.editPassword') }}</el-dropdown-item>
					<el-dropdown-item divided command="logOut">{{ $t('user.outLogin') }}</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
		<Search ref="searchRef" />
		<UpdatePsw v-model:visible="state.visible" />
	</div>
</template>

<script lang="ts" setup name="layoutBreadcrumbUser">
import { ref, getCurrentInstance, computed, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import UpdatePsw from './updatePsw.vue'
import UserNews from './userNews.vue'
import Search from './search.vue'
import screenfull from 'screenfull'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { messages } from '@/locales'
import localCache from '@/utils/storage'
import { useThemeConfig } from '@/store/modules/theme.config'
import { useUserInfo } from '@/store/modules/userInfo'
import { useRoutesList } from '@/store/modules/routesList'
import { resetRouter } from '@/router'
import { useSetI18n } from '@/hooks/useSetI18n'
import { useCommon } from '@/hooks/useCommon'
import { systemList as staticList } from '@/router/route'
const { t } = useI18n()
const { logOut } = useCommon()
const { proxy } = <any>getCurrentInstance()
const { themeConfig } = storeToRefs(useThemeConfig())
const { userInfos } = storeToRefs(useUserInfo())
const { systemList, activeSystem } = storeToRefs(useRoutesList())
const router = useRouter()
const searchRef = ref()
const state = reactive({
	visible: false,
	nextLoading: false,
	isScreenfull: false,
	disabledSize: 'large',
	disabledSystem: activeSystem.value
})
const { disabledI18n, initI18n, onLanguageChange } = useSetI18n()
// 设置当前的系统
const handleSystem = computed(() => {
	if (!themeConfig.value.isRequestRoutes) return Object.keys(staticList)
	return Object.keys(systemList.value)
})
const onHandleSystem = async (_: string) => {
	activeSystem.value = _
	state.disabledSystem = activeSystem.value
	await resetRouter(activeSystem.value)
	setTimeout(() => {
		proxy.$mittBus.emit('switchSystem')
	})
}
// 设置分割样式
const layoutUserFlexNum = computed(() => {
	let num: string | number = ''
	const { layout, isClassicSplitMenu } = themeConfig.value
	const layoutArr: string[] = ['defaults', 'columns']
	if (layoutArr.includes(layout) || (layout === 'classic' && !isClassicSplitMenu)) num = '1'
	else num = ''
	return num
})
// 全屏点击时
const onScreenfullClick = () => {
	if (!screenfull.isEnabled) {
		ElMessage.warning('暂不不支持全屏')
		return false
	}
	screenfull.toggle()
	screenfull.on('change', () => {
		if (screenfull.isFullscreen) state.isScreenfull = true
		else state.isScreenfull = false
	})
}
// 布局配置 icon 点击时
const onLayoutSettingClick = () => {
	proxy.$mittBus.emit('openSettingsDrawer')
}
// 下拉菜单点击时
const onHandleCommandClick = (path: string) => {
	if (path === 'logOut') {
		ElMessageBox({
			closeOnClickModal: false,
			closeOnPressEscape: false,
			title: t('user.logOutTitle'),
			message: t('user.logOutMessage'),
			showCancelButton: true,
			confirmButtonText: t('user.logOutConfirm'),
			cancelButtonText: t('user.logOutCancel'),
			buttonSize: 'default',
			beforeClose: (action, instance, done) => {
				if (action === 'confirm') {
					instance.confirmButtonLoading = true
					instance.confirmButtonText = t('user.logOutExit')
					setTimeout(() => {
						done()
						setTimeout(() => {
							instance.confirmButtonLoading = false
						}, 300)
					}, 700)
				} else {
					done()
				}
			}
		})
			.then(async () => {
				await logOut()
			})
			.catch(() => {})
	} else if (path === 'editPassword') {
		state.visible = true
	} else {
		router.push(path)
	}
}
// 菜单搜索点击
const onSearchClick = () => {
	searchRef.value.openSearch()
}
// 组件大小改变
const onComponentSizeChange = (size: string) => {
	localCache.remove('themeConfig', 'local')
	themeConfig.value.globalComponentSize = size
	localCache.set('themeConfig', themeConfig.value, 'local')
	initComponentSize()
	window.location.reload()
}
// 初始化全局组件大小
const initComponentSize = () => {
	switch (localCache.get('themeConfig', 'local').globalComponentSize) {
		case 'large':
			state.disabledSize = 'large'
			break
		case 'default':
			state.disabledSize = 'default'
			break
		case 'small':
			state.disabledSize = 'small'
			break
	}
}
// 页面加载时
onMounted(() => {
	if (localCache.get('themeConfig', 'local')) {
		initI18n()
		initComponentSize()
	}
})
onUnmounted(() => {
	proxy.$mittBus.off('switchSystem')
})
</script>

<style scoped lang="less">
.layout-navbars-breadcrumb-user {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	&-link {
		height: 100%;
		display: flex;
		align-items: center;
		white-space: nowrap;
		&-photo {
			width: 25px;
			height: 25px;
			border-radius: 100%;
		}
	}
	&-icon {
		padding: 0 10px;
		cursor: pointer;
		color: var(--next-bg-topBarColor);
		height: 50px;
		line-height: 50px;
		display: flex;
		align-items: center;
		&:hover {
			background: var(--el-color-primary-light-9);
			i {
				display: inline-block;
				animation: logoAnimation 0.3s ease-in-out;
			}
		}
	}
	:deep(.el-dropdown) {
		color: var(--next-bg-topBarColor);
	}
	:deep(.el-badge) {
		height: 40px;
		line-height: 40px;
		display: flex;
		align-items: center;
	}
	:deep(.el-badge__content.is-fixed) {
		top: 12px;
	}
}
</style>
