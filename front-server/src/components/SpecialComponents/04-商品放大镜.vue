<template>
    <!-- 商品详情 -->
    <div class="detail" style="width: 1190px !important;margin: 20px auto;">
        <div class="detail-meta min-h-parent relative z-90 " style="width:990px;min-height:600px">
            <div class="tm-clear p-0 m-0">
                <div class="box-left float-left relative" style="width:418px;">
                    <!-- 商品图片 -->
                    <div class="magnifier relative rounded" style="width:418px;height:418px;">
                        <div class="small-box relative m-0-auto" @mouseover="handOver" @mousemove="handMove" @mouseout="handOut">
						
                            <img class="smallPic" :src="ImgUrl" style="width: 418px;height: 418px;border-radius: 8px;"/><!-- :src='imglist[0].url' -->
                            <!-- 遮罩层-->
                            <div class="magnifier-zoom absolute t-0 l-0" v-show="showMask" :style="{background: configs.maskColor,height: configs.maskWidth + 'px',
                                width: configs.maskHeight + 'px', 
                                opacity: configs.maskOpacity, 
                                transform: transformMask}">
                            </div>
                        </div>
                    </div>
                    <!-- 小图转换大图 -->
                    <div class="little_img text-center font-nowrap relative " style="transition: left .2s cubic-bezier(0, 0, .25, 1);font-size: 0;">
                        <ul><!-- 修改这里图片 -->
                            <li v-for="img in imglist" @click='getIndex(img.url)' @mouseenter="getIndex(img.url)">
                                <img :src="img.url" style="width: 50px; height: 50px">
                            </li>
                        </ul>
                    </div>
                    <!-- 放大区域 -->
                    <div class="magnifier-layer absolute t-0 r-0 z-100 overflow-hidden bg-gray-600" v-show="showMagnifier" :style="{ width: configs.width + 'px', 
                                        height: configs.height + 'px', left: configs.width + 20 + 'px' }">
                        <div class="big-box absolute" :style="{ width: bigWidth + 'px',height: bigHeight + 'px',left: moveLeft,top: moveTop}">
                            <div class="big-box-img" :style="{ 
                                width: bigWidth - 2  + 'px', 
                                height: bigHeight - 2 + 'px' 
                            }">
                                <img :src="ImgUrl" :style="{ 
                                minWith: bigWidth - 2 + 'px', 
                                minHeight: bigHeight -2 + 'px' ,
                                }" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            data:{},
            imglist:[
                {url:'https://img10.360buyimg.com/n1/s450x450_jfs/t1/167260/19/21606/84862/6087e99bE5d046b1f/e0dd064dd82f4033.jpg'},
                {url:'https://img10.360buyimg.com/n1/s450x450_jfs/t1/186632/1/302/105518/6087e98bE9cf157c2/8db1ae577ce5f0d9.jpg'},
                {url:'https://img10.360buyimg.com/n1/s450x450_jfs/t1/173162/13/6724/106263/6087e98bEe2c25dc7/aaf68f38d6289582.jpg'},
                {url:'https://img10.360buyimg.com/n1/s450x450_jfs/t1/35862/27/15424/133416/6087e98bE52f24ce4/85dfe75b3a1e3f9a.jpg'},
                {url:'https://img10.360buyimg.com/n1/s450x450_jfs/t1/179807/7/1182/94182/6087e98bE7e6b8b0e/b153e6a2c42028ba.jpg'},
            ],
            imgObj:{},
            ImgUrl: '', //大图片默认显示第一张
            configs: {
                width: 418, //放大区域
                height: 418, //放大区域
                maskWidth: 210, //遮罩宽度
                maskHeight: 210, //遮罩高度
                maskColor: 'rgba(25,122,255,0.5)', //遮罩样式
                maskOpacity: 0.6,
                scale: 2, //放大比例
            },
            moveLeft: 0,
            moveTop: 0,
            transformMask: `translate(0px, 0px)`,
            showMagnifier: false,
            showMask: false,
        }
    },
    computed: {
        bigWidth() {
            return this.configs.scale * this.configs.width;
        },
        bigHeight() {
            return this.configs.scale * this.configs.height;
        }
    },
    methods: {
        getIndex(imgUrl) {//点击小图片时将图片路径赋值给大图
            //console.log(imgUrl);
            this.ImgUrl = imgUrl;
        },
        async getBigImg(){//获取大图的对象
            await this.$nextTick(()=>{
                this.imgObj = this.$refs.abc.getBoundingClientRect()
            })
        },
        // getBigImg(){//获取大图的对象
        //     this.imgObj = document.getElementsByClassName('small-box')[0].getBoundingClientRect();
        // },
        $init() {
            this.getIndex(this.imglist[0].url)
            this.getBigImg()
            window.onresize = () => {//当屏幕宽度改变，重新计算
                this.getBigImg()
            }
        },
        changeshop(e) {
            this.showMagnifier = false;
            this.showMask = false;
            this.transformMask = `translate(0px, 0px)`
            this.moveLeft = 0
            this.moveTop = 0
        },
        handMove(e) {
            // 动态获取小图的位置（或者监听 scroll ）
            let imgRectNow = this.imgObj;//这里出现过问题，跳转其他路由时无法及时的获取imgObj对象，因为$init函数的定时器延迟500ms
            //console.log(imgRectNow)
            let objX = e.clientX - imgRectNow.left;
            let objY = e.clientY - imgRectNow.top;

            // 计算初始的遮罩左上角的坐标
            let maskX = objX - this.configs.maskWidth / 2;
            let maskY = objY - this.configs.maskHeight / 2;

            // 判断是否超出界限,并纠正
            maskY = maskY < 0 ? 0 : maskY;
            maskX = maskX < 0 ? 0 : maskX;
            if (maskY + this.configs.maskHeight >= imgRectNow.height) {
                maskY = imgRectNow.height - this.configs.maskHeight;
            }
            if (maskX + this.configs.maskWidth >= imgRectNow.width) {
                maskX = imgRectNow.width - this.configs.maskWidth;
            }

            // 遮罩移动
            this.transformMask = `translate(${maskX}px, ${maskY}px)`;

            // 背景图移动
            this.moveLeft = -maskX * this.configs.scale + "px";
            this.moveTop = -maskY * this.configs.scale + "px";
        },
        handOut() {
            this.showMagnifier = false;
            this.showMask = false;
        },
        handOver() {
            this.showMagnifier = true;
            this.showMask = true;
        }
    },
    created() {
        //this.$init()
    },
}
</script>

<style lang="scss" scoped>
	.detail {
		

		.detail-meta {
			

			.tm-clear {
				

				.box-left {
					
					/* 放大图片开始 */
					.small-box {
						
					}

					.magnifier-zoom {
						
					}

					.magnifier-layer {
						
					}

					.big-box {
					}

					.magnifier {
						
					}
					/* 放大图片结束 */
					.smallPic {
						
					}
					//小图转换大图开始
					.little_img {
						

						li {
							display: inline-block;
							margin: 0 0 0 16px;
							padding-top: 22px;

							img {
								&:hover {
									border: 2px solid #39bf3e;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
