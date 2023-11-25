<template>
	<el-tabs v-model="activeName">
		<el-tab-pane label="online" name="online"><Online /></el-tab-pane>
		<el-tab-pane label="user" name="user"><User /></el-tab-pane>
		<el-tab-pane label="role" name="role"><Role /></el-tab-pane>
		<el-tab-pane label="system" name="system"><System /></el-tab-pane>
		<el-tab-pane label="menu" name="menu"><Menu /></el-tab-pane>
	</el-tabs>
</template>

<script lang="ts" setup>
import Online from './online/index.vue'
import Role from './role/index.vue'
import System from './system/index.vue'
import Menu from './menu/index.vue'
import User from './user/index.vue'
const activeName = ref('online')
</script>

<style scoped lang="less"></style>
