<template>
    <div class="glass">
        <ul class="dock">
            <li>😃</li>
            <li>😊</li>
            <li>😜</li>
            <li>😍</li>
            <li>🤩</li>
            <li>🥳</li>
            <li>🥶</li>
        </ul>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    mounted () {
        this.init()
    },
    methods: {
        init(){
            document.querySelectorAll('.dock li').forEach(li=>{
                li.addEventListener('click',e=>{//添加点击动效
                    e.currentTarget.classList.add('loading')
                })
                li.addEventListener('mousemove',e=>{
                    let item = e.target
                    //获取图标所在的li容器的宽度
                    let itemRect = item.getBoundingClientRect()
                    let offset = Math.abs(e.clientX-itemRect.left) / itemRect.width
                    let prev = item.previousElementSibling || null //获取当前游标所在图标的前一个图标
                    let next = item.nextElementSibling || null
                    
                    let scale = 0.6//假如想要放大的倍数是1.6，这里就是0.6
                    
                    this.resetScale()
                    
                    if (prev) {//计算放大倍率
                        prev.style.setProperty('--scale', 1 + scale * Math.abs(offset - 1))
                    }
                    
                    item.style.setProperty('--scale', 1 + scale)
                    
                    if (next) {
                        next.style.setProperty('--scale', 1 + scale * offset)
                    }
                })
            })

            document.querySelector('.dock').addEventListener('mouseleave', e => {//重置放大倍数
                this.resetScale()
            })
        },
        resetScale(){
            document.querySelectorAll('.dock li').forEach(li => {
                li.style.setProperty('--scale', 1)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.glass {
    width: 100%;
    height: 8rem;
    background: rgba( 255, 255, 255, 0.25 );
    box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
    backdrop-filter: blur( 4px );
    -webkit-backdrop-filter: blur( 4px );
    border: 1px solid rgba( 255, 255, 255, 0.18 );
    display: flex;
    justify-content: center;
    .dock {
        --scale: 1;
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        li{
            font-size: calc(6rem * var(--scale));
            padding: 0 .5rem;
            cursor: default;
            position: relative;
            top: calc((6rem * var(--scale) - 6rem) / 2 * -1);
            transition: 300ms all ease-out;
        }
        .loading{
            animation: 1s loading ease-in infinite;
        }
        @keyframes loading {
            0%, 100% {
                transform: translateY(0px);
            }
            60% {
                transform: translateY(-40px);
            }
        }
    }
}


</style>
