<template>
	<slot v-if="getUserAuthList" />
</template>

<script lang="ts" setup name="AuthSingle">
/**
 * @description 单个权限认证
 */
import { storeToRefs } from 'pinia'
import { useUserInfo } from '@/store/modules/userInfo'
import { computed } from 'vue'
const { userInfos } = storeToRefs(useUserInfo())

const props = defineProps({
	value: {
		type: String,
		default: () => ''
	}
})
// 获取 pinia 中的用户权限
const getUserAuthList = computed(() => {
	return userInfos.value.authComponentList.some((v: string) => v === props.value)
})
</script>

<style scoped lang="less"></style>
