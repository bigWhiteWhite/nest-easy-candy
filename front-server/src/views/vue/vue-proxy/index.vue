<template>
	<el-tabs v-model="activeName">
		<el-tab-pane label="notes" name="notes"><custom-md-entry :md-modules="mdModules"></custom-md-entry></el-tab-pane>
		<el-tab-pane label="vueDefineProperty" name="vueDefineProperty"><vueDefineProperty></vueDefineProperty></el-tab-pane>
		<el-tab-pane label="vueProxy" name="sevueProxycond"><vueProxy></vueProxy></el-tab-pane>
	</el-tabs>
</template>

<script lang="ts" setup>
import vueDefineProperty from './pages/vue-defineProperty.vue'
import vueProxy from './pages/vue-proxy.vue'
const mdModules: any = import.meta.glob('./files/*.md')
const activeName = ref('vueDefineProperty')
</script>

<style scoped lang="less"></style>
