<template>
    <div class="relative" style="height:100vh">
        <div id="test" class="test">{{title}}</div>
    </div>
</template>

<script>
export default {
    props:{
        title:{type:String,required:true}
    },
    data () {
        return {

        }
    },
    mounted () {
        const h1 = document.querySelector('#test')
        h1.innerHTML = h1.textContent.replace(/\S/g,"<span>$&</span>")
        document.querySelectorAll('#test span').forEach((span, index) => {
            span.classList.add('title-blink')//innertest设置在reset.scss中
            span.style.setProperty('--delay', `${index * 0.1}s`)
        })
        document.querySelector('#test').addEventListener('click',e=>{
            document.querySelectorAll('#test span').forEach((span, index) => {
                    span.classList.remove('title-blink')
                    void h1.offsetWidth
                    span.classList.add('title-blink')
            })
        })
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
#test{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    font-size: 6rem;
}


</style>
