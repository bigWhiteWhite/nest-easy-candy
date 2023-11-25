<template>
    <div class="flex" style="margin-top:4px">
        <input type="checkbox" id="exp" :checked='ischecked' style="visibility: hidden;" class="w-0 h-0">
        <div :class="[line?`line-clamp-${line}`:'line-clamp-2']" class="text overflow-hidden  ver-middle text-1-25 font-800 "  ref="text">
            <label v-if="showBtn" class="btn rounded" for="exp" v-text="ischecked?'收起':'展开'" @click="ischecked=!ischecked"></label>
            <span class="float-right" v-if="showBtn" v-show="!ischecked" style="margin-top:-4px;padding-right:3px">...</span>
            <div ref="content_text" class="" style="width:295px">{{title}}</div><!--这里的宽度应该为下面copy的元素的宽度减去按钮和省略号的宽度-->
            <span ref="content_text_copy" class="inline-block visi-hidden">{{title}}</span>
            
        </div>
    </div>
</template>

<script>
export default {
    props:{
        title:{type:String,require:true},
        initstyle:{
            type:Object,require:false
        }
    },
    data () {
        return {
            ischecked:false,
            contentvar:'...',
            showBtn:true,
            line:''
        }
    },
    computed:{
        checked(){
            return this.ischecked
        }
    },
    watch:{
        checked(value){
            if(value){
                //this.$refs.text.style.maxHeight = 'none' + 'px'
                this.$refs.text.style.maxHeight = '200' + 'px'
            }else{
                this.$refs.text.style.maxHeight = ''
            }
        }
    },
    methods: {
        init(){//动态修改文字的宽度和文字的行数，如果不修改的话可能会得不到想要的效果
            if(this.initstyle){
                this.line = this.initstyle.line
                this.$refs.content_text.style.width = this.initstyle.width
            }
        }
    },
    mounted() {
        this.init()
        //将div克隆一份但不显示（visibility:hidden）,比较两者的宽度，如果副本的宽度大于元素本身的宽度，则表示溢出，否则未溢出
        const el = this.$refs.content_text
        const elCopy = this.$refs.content_text_copy
        this.showBtn = el.clientWidth < elCopy.clientWidth
        //console.log(el, elCopy)
        //console.log(el.clientWidth, elCopy.clientWidth)
        window.addEventListener('resize', () => {
            this.showBtn = el.clientWidth < elCopy.clientWidth
        })
        //console.log(this.showBtn);
    },
}
</script>

<style lang="scss" scoped>
.flex{
    $line-clamp:('1':1.7em,'2':3em,'3':4.5em);//规定行数
    @each $key,$value in $line-clamp{
        .line-clamp-#{$key}{
            max-height: $value;
        }
    }
    .text{
        line-height: 1.5 !important;
        overflow: hidden !important;
        transition: 0.7s max-height !important;
        &::before{
            content: '' !important;
            float: right !important;
            width: 0 !important;
            //height: calc(100% - 24px);//动态规定高度
            height: 100%;
            margin-bottom: -22.4px !important;//24为按钮的大小
        }
        .btn {
            float: right !important;
            clear: both !important;//清除浮动。被text的伪元素压在下面

            /*其他装饰样式*/
            padding: 2px;
            font-size: 6px  !important;
            color: white;
            text-align: center;
            align-content: center;
            font-weight: 600;
            background-color: #13aaaa;
        }
    }
}
</style>
