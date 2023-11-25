<template>
	<el-tabs v-model="activeName" class="demo-tabs">
		<el-tab-pane v-for="(item, index) in notes" :key="item.label" :label="item.label" :name="index">
			<custom-vditor :content="item.content" />
			<!-- <custom-check :content="item.content" /> -->
		</el-tab-pane>
	</el-tabs>
</template>

<script lang="ts" setup>
const props = defineProps({
	mdModules: {
		type: Object,
		required: true
	}
})
const { mdModules } = toRefs(props)
const activeName = ref(0)
const notes = ref([]) as any
const init = () => {
	if (mdModules.value) {
		for (const name in mdModules.value) {
			const modules = mdModules.value[name]
			modules().then((module) => {
				const filePath = module.default
				fetch(filePath)
					.then((response) => response.text())
					.then((content) => {
						notes.value.push({
							label: (name.match(/([^/]+)\./) || [])[1],
							content
						})
					})
					.catch((error) => {
						console.error('Error fetching file:', error)
					})
			})
		}
	}
}
onBeforeMount(() => {
	init()
})
</script>

<style scoped lang="less"></style>
