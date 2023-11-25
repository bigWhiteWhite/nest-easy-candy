<template>
	<slot v-if="getUserAuthList" />
</template>

<script lang="ts" setup name="AuthList">
/**
 * @description 多个权限验证，全部满足则显示
 */
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserInfo } from '@/store/modules/userInfo'
import { judementSameArr } from '@/utils/arrayOperation'

const { userInfos } = storeToRefs(useUserInfo())

const props = defineProps({
	value: {
		type: Array,
		default: () => []
	}
})
// 获取 pinia 中的用户权限
const getUserAuthList = computed(() => {
	return judementSameArr(props.value, userInfos.value.authComponentList)
})
</script>

<style scoped lang="less"></style>
