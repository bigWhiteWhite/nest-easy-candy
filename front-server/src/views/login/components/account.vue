<template>
	<el-form ref="loginFormRef" size="large" class="login-content-form" :rules="state.rules" :model="ruleForm" @keyup.enter.native="onSignIn">
		<el-form-item class="login-animation1" prop="account">
			<el-input v-model="ruleForm.account" type="text" :placeholder="$t('login.accountPlaceholder1')" clearable autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon"><ele-User /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2" prop="password">
			<el-input
				v-model="ruleForm.password"
				:type="state.isShowPassword ? 'text' : 'password'"
				:placeholder="$t('login.accountPlaceholder2')"
				autocomplete="off"
			>
				<template #prefix>
					<el-icon class="el-input__icon"><ele-Unlock /></el-icon>
				</template>
				<template #suffix>
					<i
						class="iconfont el-input__icon login-content-password"
						:class="state.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
						@click="state.isShowPassword = !state.isShowPassword"
					>
					</i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item v-if="validState.validCode" class="login-animation3" prop="validCode">
			<el-input v-model="ruleForm.validCode" autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon"><ele-Connection /></el-icon>
				</template>
				<template #suffix>
					<img :src="validState.validCode" alt="validCode" style="height: 50px; cursor: pointer" @click="getCaptcha" />
				</template>
			</el-input>
		</el-form-item>
		<el-row justify="space-between">
			<el-col :span="12">
				<el-dropdown :show-timeout="70" :hide-timeout="50" @command="onLanguageChange">
					<el-button type="primary" link>{{ $t('user.title1') }} | {{ disabledI18n }}</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item v-for="item in messages" :key="item.name" :command="item.name" :disabled="disabledI18n === item.name">
								{{ item.label }}
							</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</el-col>
			<el-col :span="12" style="text-align: right">
				<el-tooltip placement="right" :content="$t('login.forgetPWD-desc')">
					<el-button type="primary" link>{{ $t('login.forgetPWD') }}</el-button>
				</el-tooltip>
			</el-col>
		</el-row>
		<el-form-item class="login-animation4">
			<el-button type="primary" class="login-content-submit" round :loading="state.loading.signIn" @click="onSignIn">
				<span>{{ $t('login.submitLogin') }}</span>
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts" setup name="loginAccount">
import { reactive, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Cookies from 'js-cookie'
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '@/store/modules/theme.config'
import { useUserInfo } from '@/store/modules/userInfo'
import { initFrontEndControlRoutes } from '@/router/frontRouter'
import localCache from '@/utils/storage'
import { formatAxis } from '@/utils/formatTime'
import { NextLoading } from '@/utils/loading'
import { useSetI18n } from '@/hooks/useSetI18n'
import { messages } from '@/locales'
import { captcha, login } from '@/service/apis/login'
import { useCommon } from '@/hooks/useCommon'
const { themeConfig } = storeToRefs(useThemeConfig())
const { userInfos } = storeToRefs(useUserInfo())
const { disabledI18n, onLanguageChange } = useSetI18n()
const { getUserMenu } = useCommon()
const route = useRoute()
const router = useRouter()
const loginFormRef = ref()
const ruleForm = reactive({
	account: '15220769615',
	password: '123456',
	validCode: '1111'
})
const validState = ref({
	validCode: '',
	validId: ''
})
const state = reactive({
	isShowPassword: false,
	loading: {
		signIn: false
	},
	rules: {
		account: [{ required: true, message: 'Please input account', trigger: 'change' }],
		password: [{ required: true, message: 'Please input password', trigger: 'change' }],
		validCode: [{ required: true, message: 'Please input validCode', trigger: 'change' }]
	}
})
// 时间获取
const currentTime = computed(() => {
	return formatAxis(new Date())
})
// 登录
const onSignIn = async () => {
	try {
		if (!loginFormRef.value) return
		await loginFormRef.value.validate(async (valid: any) => {
			try {
				if (valid) {
					state.loading.signIn = true
					if (themeConfig.value.isRequestRoutes) {
						// 后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
						const token = await login({
							account: ruleForm.account,
							password: ruleForm.password,
							validId: validState.value.validId,
							validCode: ruleForm.validCode
						})
						Cookies.set('CmsSystemToken', token)
						await getUserMenu()
					} else {
						// 前端控制路由，2、请注意执行顺序
						localCache.set('userInfo', { account: ruleForm.account }, 'local')
						localCache.set('CmsSetting', {}, 'local')
						// 存储用户信息
						Cookies.set('CmsSystemToken', '123')
						await initFrontEndControlRoutes()
					}
					signInSuccess()
				}
			} catch (error: any) {
				if (error.statusCode == 10002) {
					getCaptcha()
					ruleForm.validCode = ''
				}
			}
		})
	} catch (error: any) {
		return Promise.reject(error)
	} finally {
		state.loading.signIn = false
	}
}
// 登录成功后的跳转
const signInSuccess = () => {
	// 初始化登录成功时间问候语
	const currentTimeInfo = currentTime.value
	// 登录成功，跳到转首页
	// 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
	if (route.query?.redirect) {
		router.push({
			path: <string>route.query?.redirect,
			query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : ''
		})
	} else {
		router.push('/')
	}
	// 登录成功提示
	// 关闭 loading
	state.loading.signIn = true
	ElMessage.success(`${currentTimeInfo},${userInfos.value.username}`)
	// 添加 loading，防止第一次进入界面时出现短暂空白
	NextLoading.start()
}
const getCaptcha = async () => {
	try {
		if (themeConfig.value.isRequestRoutes) {
			const res = await captcha()
			validState.value = res
		}
	} catch (error) {
		return Promise.reject(error)
	}
}
onMounted(() => {
	getCaptcha()
})
</script>

<style scoped lang="less">
.login-content-form {
	margin-top: 20px;
	opacity: 0;
	animation-name: error-num;
	animation-duration: 0.5s;
	animation-fill-mode: forwards;
	.loginFor(@i, @n) when (@i =< @n) {
		.login-animation@{i} {
			opacity: 0;
			animation-name: error-num;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
			animation-delay: calc(@i / 10) + s;
		}
		.loginFor((@i + 1), @n);
	}
	.loginFor(1, 4);
	.login-content-password {
		display: inline-block;
		width: 20px;
		cursor: pointer;
		&:hover {
			color: #909399;
		}
	}
	.login-content-code {
		width: 100%;
		padding: 0;
		font-weight: bold;
		letter-spacing: 5px;
	}
	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
		margin-top: 15px;
	}
}
</style>
