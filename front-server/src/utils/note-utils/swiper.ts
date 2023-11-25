// import { App } from 'vue'
// /**
//  * @swiper使用时要引入组件和样式
//  */
// // swiper 额外组件配置
// import SwiperCore, { Autoplay, Pagination, Navigation, EffectFade, EffectCoverflow, EffectCube, EffectFlip } from 'swiper'
// // swiper 必备组件
// import { Swiper, SwiperSlide } from 'swiper/vue'
// // swiper 单独样式 （less / scss）
// import 'swiper/swiper.scss'
// import 'swiper/components/scrollbar/scrollbar.scss' //滚动滚动条样式
// import 'swiper/components/pagination/pagination.scss' //分页器样式
// import 'swiper/components/controller/controller.scss' // 控制器模块所需的样式

// import 'swiper/components/navigation/navigation.scss' //导航前后样式
// //切换效果样式
// import 'swiper/components/effect-fade/effect-fade.scss'
// import 'swiper/components/effect-cube/effect-cube.scss'
// import 'swiper/components/effect-flip/effect-flip.scss'
// import 'swiper/components/effect-coverflow/effect-coverflow.scss'
// // 使用额外组件
// SwiperCore.use([Autoplay, EffectFade, Pagination, EffectCoverflow, Navigation, EffectCube, EffectFlip])

// // 全局注册 swiper 必备组件
// const plugins = [Swiper, SwiperSlide]

// const swiper = {
// 	install: function (app: App<Element>) {
// 		plugins.forEach((item) => {
// 			app.component(item.name, item)
// 		})
// 	}
// }

// export default swiper
