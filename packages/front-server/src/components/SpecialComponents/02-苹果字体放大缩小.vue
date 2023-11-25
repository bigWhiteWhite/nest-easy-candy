<template>
    <div class="imac">
        <h2 ref="h2" style="--scale:1">Only 11.5mm. Now that's thin.</h2>
        <div class="image relative overflow-hidden">
            <img class="block relative" src="https://www.apple.com/105/media/us/imac-24/2021/5e004d75-3ad6-4bb9-ab59-41f891fc52f0/anim/design-hero/large/flow/flow_startframe.jpg" alt="">
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    mounted () {
        let isPinned = false
        const h2 = document.querySelector('h2')
        const observer = new IntersectionObserver(([e])=>{
            isPinned = (e.intersectionRatio<1)
            e.target.classList.toggle('pinned',(e.intersectionRatio<1))
        },{threshold:[1]})//规定了一个监听目标与边界盒交叉区域的比例值

        observer.observe(h2)//监听sticky被触发
        document.addEventListener('scroll',(e)=>{
            if(isPinned){
                let html = document.documentElement
                let height = parseInt(getComputedStyle(this.$refs.h2).height)+ 
                parseInt(getComputedStyle(this.$refs.h2).marginBottom)
                
                let marginTop = 
                parseInt(getComputedStyle(this.$refs.h2).marginTop)

                let scrolled = 
                (html.scrollTop - marginTop) / height
    
                h2.style.setProperty('--scale', (1 - scrolled))
            }
        })
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
 .imac{
     .pinned{
        //  color:red;
     }
     h2{
        font-size: 72px;
        font-family: Helvetica;
        letter-spacing: -.012em;
        width: 290px;
        font-weight: normal;
        position: relative;
        left: 50%;
        position: sticky;
        top: -1px;
        margin: 100px 0;
        padding: 0;
        transform: scale(clamp(0.15, var(--scale), 1));
        transform-origin: 0% 0%;
     }
     img{
        top:auto;
        left: 50%;
        transform: translate(calc(-50% - 30px), 0);
     }
 }
</style>
