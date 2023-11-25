<template>
	<div style="display: flex; justify-content: center; align-items: center; flex-direction: column">
		<div id="home" style="min-height: 24rem; height: 24rem"></div>
	</div>
</template>

<script lang="ts" setup name="home">
import lottie from 'lottie-web'
// import HomeBackground from '@/assets/json/home-background.json'
import HomeBackground02 from '@/assets/json/hong-bg-02.json'
import { onMounted } from 'vue'
onMounted(() => {
	const jsonAnimation = lottie.loadAnimation({
		container: document.querySelector('#home') as Element, //进行播放的元素
		renderer: 'svg',
		loop: true, //循环播放
		autoplay: true, //自动播放
		animationData: HomeBackground02 //要播放的文件
	})
	jsonAnimation.play()
})
</script>
