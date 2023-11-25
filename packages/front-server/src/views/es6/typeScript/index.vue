<template>
	<custom-md-entry :md-modules="mdModules"></custom-md-entry>
</template>

<script lang="ts" setup>
const mdModules: any = import.meta.glob('./files/*.md')
</script>

<style scoped lang="less"></style>
