<template>
    <div>
        <h2 class="H2title">
            标题轮播
            <div id="mask" class="mask relative overflow-hidden">
                <span class="block box-border absolute" v-for="(item,index) in text" :key="index">
                    {{item.name}}
                </span>
            </div>
        </h2>
        
    </div>
</template>

<script>
export default {
    props:{
        id:{type:String,required:true}
    },
    data () {
        return {
            text:[
                {name:'2we'},
                {name:'asd'},
                {name:'sda'}
            ]
        }
    },
    mounted () {
        this.TurnTitle()
    },
    methods: {
        TurnTitle(){
            const first = document.querySelectorAll('#mask > span')[0]
            first.className = 'span_show'
            setInterval(()=>{
                const show = document.querySelector('.span_show')
                const next = show.nextElementSibling || first
                const up = document.querySelector('.span_up')
                if(up){
                    up.classList.remove('span_up')
                }
                show.classList.remove('span_show')
                show.className='span_up'
                next.className='span_show'
            },2000)
        }
    }
}
</script>

<style lang="scss" scoped>
:root{
    --offset:.375rem;
}
.H2title{
    width:980px;
    font-size: 100px;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.06;
    letter-spacing: -0.02em;
    color: pink;
    .mask{
        height:106px;
        margin-top: var(--offset);
        span{
            display: block;
            position: absolute;
            box-sizing: border-box;
            padding-bottom: var(--offset);
            top:100px;
            background-size:100% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            //-webkit-text-fill-color: transparent;
            background-repeat: no-repeat;
        }
    }
}
.span_show{
    transform: translateY(-100%);
    transition: .5s transform;
}
.span_up{
    transform: translateY(-200%);
    transition: .5s transform;
}

</style>
