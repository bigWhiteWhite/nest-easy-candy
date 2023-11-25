<template>
	<slot v-if="getUserAuthList" />
</template>

<script lang="ts" setup name="AuthList">
/**
 * @description 多个权限验证，满足一个即可
 */
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserInfo } from '@/store/modules/userInfo'
const { userInfos } = storeToRefs(useUserInfo())

const props = defineProps({
	value: {
		type: Array,
		default: () => []
	}
})
// 获取 pinia 中的用户权限
const getUserAuthList = computed(() => {
	let flag = false
	userInfos.value.authComponentList.forEach((val: string) => {
		props.value.forEach((v) => {
			if (val === v) flag = true
		})
	})
	return flag
})
</script>

<style scoped lang="less"></style>
