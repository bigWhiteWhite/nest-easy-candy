<template>
    <div class="w-full" style="100vh">
        <div class="container center-translate">
            <!-- <h1 id="test">The best products start with Sketch</h1>
            <p>
                Create, prototype, collaborate, and bring your ideas to life with the design platform used by over one million people — from freelancers, to the world’s largest teams.
            </p> -->

        <h1 id="test">
            <span><i>The</i></span>
            <span><i>best</i></span>
            <span><i>products</i></span>
            <span><i>start</i></span>
            <span><i>with</i></span>
            <span><i>Sketch</i></span>
        </h1>
        <p>
            Create, prototype, collaborate, and bring your ideas to life with the design platform used by over one million people — from freelancers, to the world’s largest teams.
        </p>
            
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
        const h1 = document.querySelector('#test')
        //h1.innerHTML = h1.textContent.replace(/\S/g,"<span><i>$&</i></span>")
        let PDelay = null
        document.querySelectorAll('#test span').forEach((span, index) => {
            span.classList.add('title-tiao')//添加动画
            span.style.animationDelay = `${index * 0.1}s`
            const li = span.querySelector('i')
            span.classList.add('title-tiao-i')
            li.style.animationDelay = `${index * 0.1}s`
        })
        const num = document.querySelectorAll('#test span').length-1//获取最后一个span标签
        PDelay = document.querySelectorAll('#test span')[num].style.animationDelay//获取p字段应该出现的时间间隔
        const p =document.querySelector('p')
        p.style.animationDelay = PDelay
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
 .container{
     width: 1000px;
     h1{
        font-size: 4rem;
        letter-spacing: -2px;
     }
    p{
        font-size:2rem;
        color: #666;
        position: relative;
        top: .8rem;
        opacity: 0;
        animation: .5s swift-up ease-out forwards, .5s fade-in ease-out forwards;
        animation-delay: .8s;
    }

    @keyframes fade-in {
        to {
            opacity: 1;
        }
    }
    @keyframes swift-up {
        to {
            top: 0rem;
        }
    }

 }
</style>
