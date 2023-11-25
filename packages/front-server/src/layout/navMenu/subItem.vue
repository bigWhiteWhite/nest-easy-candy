<template>
	<template v-for="val in parents">
		<el-sub-menu v-if="val.children && val.children.length > 0" :key="val.path" :index="val.path">
			<template #title>
				<svg-icon :icon-name="val.meta.icon"></svg-icon>
				<span>{{ $t(val.meta.title) }}</span>
			</template>
			<sub-item :parent="val.children" />
		</el-sub-menu>
		<template v-else>
			<el-menu-item :key="val.path" :index="val.path">
				<template v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)">
					<svg-icon :icon-name="val.meta.icon"></svg-icon>
					<span>{{ $t(val.meta.title) }}</span>
				</template>
				<template v-else>
					<a :href="val.meta.isLink" target="_blank" rel="opener" class="w100">
						<svg-icon :icon-name="val.meta.icon"></svg-icon>
						{{ $t(val.meta.title) }}
					</a>
				</template>
			</el-menu-item>
		</template>
	</template>
</template>

<script lang="ts" setup name="navMenuSubItem">
import { computed } from 'vue'
const props = defineProps({
	parent: {
		type: Array,
		default: () => []
	}
})

// 获取父级菜单数据
const parents = computed(() => {
	return <any>props.parent
})
</script>

<style scoped lang="less"></style>
