<template>
    <header class="relative overflow-hidden">
        <div class="view absolute trbl-0 flex justify-content-center align-items-center">
            <img src="https://assets.codepen.io/2002878/bilibili-winter-view-1.jpg" class="morning" alt="">
            <img src="https://assets.codepen.io/2002878/bilibili-winter-view-2.jpg" class="afternoon" alt="">
            <video autoplay loop muted class="evening">
            <source src="https://assets.codepen.io/2002878/bilibili-winter-view-3.webm" type="video/webm" />
            </video>
            <img src="https://assets.codepen.io/2002878/bilibili-winter-view-3-snow.png" class="window-cover" alt="">
        </div>
        
        <div class="tree absolute trbl-0 flex justify-content-center align-items-center">
            <img src="https://assets.codepen.io/2002878/bilibili-winter-tree-1.png" class="morning" alt="">
            <img src="https://assets.codepen.io/2002878/bilibili-winter-tree-2.png" class="afternoon" alt="">
            <img src="https://assets.codepen.io/2002878/bilibili-winter-tree-3.png" class="evening" alt="">
        </div>
        <Snow/>
    </header>
</template>

<script>
import Snow from './snow.vue'
export default {
    components:{
        Snow
    },
    mounted () {
        let startingPoint
        const header = document.querySelector('header')

        header.addEventListener('mouseenter', (e) => {
            startingPoint = e.clientX
            header.classList.add('moving')
        })

        header.addEventListener('mouseout', (e) => {
            header.classList.remove('moving')
            header.style.setProperty('--percentage', 0.5)
        })

        header.addEventListener('mousemove', (e) => {
            let percentage = (e.clientX - startingPoint) / window.outerWidth + 0.5
            
            header.style.setProperty('--percentage', percentage)
        })
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
header{
    height: 160px;
    --percentage:0.5;
    img{
        position: absolute;
        width: 120%;
        height: 120%;
        object-fit: cover;
    }
    video{
        position: absolute;
        width: 120%;
        height: 120%;
        object-fit: cover;
    }
    .morning {
        z-index: 20;
        opacity: calc(1 - (var(--percentage) - 0.25) / 0.25);
        transition: .2s all ease-in;
    }
    .afternoon {
        z-index: 10;
        opacity: calc(1 - (var(--percentage) - 0.5) / 0.5);
        transition: .2s all ease-in;
    }
    .view {
        transform: translatex(calc(var(--percentage) * 100px));
        transition: .2s all ease-in;
    }
    .tree {
        transform: translatex(calc(var(--percentage) * 50px));
        filter: blur(3px);
        transition: .2s all ease-in;
    }

    
    .window-cover {
        opacity: calc((var(--percentage) - 0.9) / 0.1);
    }
}
.moving{
    .view{
        transition: none;
    }
    .tree{
        transition: none;
    }
    .morning{
        transition: none;
    }
    .afternoon{
        transition: none;
    }
}
</style>
