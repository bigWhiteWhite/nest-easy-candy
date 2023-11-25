<template>
    <div class="">
        <div class="_1e22hjs whitespace-nowrap overflow-x-hidden">
            <div :class="[changeright?'_14h8plu':'change_14h8plu']">
                <slot name="content"></slot>
            </div>
            <!-- 遮罩 -->
            <div :class="[changeright?'_1vauaad':'change_1vauaad']" ref="_mask" class=" absolute" style="right:16px;height:68px;width:48px;"></div>
            <!-- 方向 -->
            <div :class="[changeright?'_1oczzqqn':'change_1oczzqqn']" ref='_dir' class="">
                <button @click="changeright=!changeright" type="button" class="_156x3wws font-parent inline-block cursor-pointer text-center line-1 relative border-solid" style="width:28px;height:28px;">
                    <span :class="[changeright?'icon-icon':'icon-xiangzuotubiao']" class="iconfont  _1c9ajsd1 inline-block absolute " style="top:50%;left:50%;"></span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            changeright:true
        }
    },
    mounted () {
        //this.change_margin_top(this.$refs._dir)
    },
    methods: {
        change_margin_top(doc,top){
           // console.log(doc);
        }
    }
}
</script>

<style lang="scss" scoped>
 ._1e22hjs{
    padding: 16px 8px !important;
    margin: -16px -8px !important;
    ._14h8plu {
        transform: translateX(0px);
        transition: -ms-transform 0.5s,-webkit-transform 0.5s,transform 0.5s !important;
    }
    .change_14h8plu{
        transform: translateX(-136px) !important;
        transition: -ms-transform 0.5s,-webkit-transform 0.5s,transform 0.5s !important;
    }
    ._1vauaad{
        margin-top: var(--mask_margin_top,-58px) !important;
        background: linear-gradient(270deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 17%, rgba(255, 255, 255, 0) 100%) !important;
    }
    .change_1vauaad{
        margin-top: var(--mask_margin_top,-58px) !important;
        background: linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 17%, rgba(255, 255, 255, 0) 100%) !important;
        left:16px !important;
    }

    .change_1oczzqqn{
        position: absolute !important;
        //margin-top: -48px !important;
        margin-top: var(--dir_margin_top,-48px) !important;
        height: 48px !important;
        padding-top: 10px !important;
        left: 12px;
    }
    ._1oczzqqn{
        position: absolute !important;
        //margin-top: -48px !important;
        margin-top: var(--dir_margin_top,-48px) !important;
        height: 48px !important;
        padding-top: 10px !important;
        right: 12px;
    }
    ._156x3wws{
            touch-action: manipulation !important;
            box-shadow: rgba(0,0,0,0.14) 0px 1px 1px 1px !important;
            border-radius: var(--border-button-round-border-radius, 50%) !important;
            border-width: var(--border-button-border-width, 2px) !important;
            border-color: var(--color-clear, transparent) !important;
            background: var(--color-buttons-inverse-color, #ffffff) !important;
            ._1c9ajsd1{
                transform: translate(-41%, -40%) !important;
            }
        }
}
</style>
