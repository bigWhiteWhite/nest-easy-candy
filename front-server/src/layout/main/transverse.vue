<template>
	<el-container class="layout-container flex-center layout-backtop">
		<Header />
		<Main />
		<el-backtop target=".layout-backtop .el-main .el-scrollbar__wrap"></el-backtop>
	</el-container>
</template>

<script lang="ts" setup name="layoutTransverse">
import Header from '../components/header.vue'
import Main from '../components/main.vue'
</script>
