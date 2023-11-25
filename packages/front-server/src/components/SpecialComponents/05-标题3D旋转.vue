<template>
    <div class="wrap w-full relative" style="height:100vh">
        <div class="center-translate">
            <h1 class="p-0 m-o relative text-gray-50">30000</h1>
            <h2 class="p-0 m-o relative text-gray-50">Thank You!</h2>
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

    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
.wrap{
  font-family: 'Concert One', cursive;
  perspective: 156.25rem;
}
h1{
    font-size: 10rem;
    animation: 5s rotate ease-in-out infinite;
}
@keyframes rotate {
  0%, 100% {
    transform: rotate3d(0, 1, 0, -20deg);
  }
  50% {
    transform: rotate3d(0, 1, 0, 20deg);
  }
}
h2 {
  font-size: 5rem;
  letter-spacing: -4px;
  animation: 2.5s thank-you ease-in-out infinite;
}

@keyframes thank-you {
  0%, 100% {
    transform: rotate3d(1, 0, 0, -10deg);
  }
  50% {
    transform: rotate3d(1, 0, 0, 10deg);
  }
}
h1::before,h1::after {
  content: '30000';
}

h2::before,h2::after {
  content: 'Thank You!';
}

h1::before,h1::after,h2::before,h2::after {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

/* Fix Chrome Issue */
h1::after,h2::after {
  z-index: -2;
}
/*  */

h1::before {
  color: #009CDE;
  animation: 5s h1-before ease-in-out infinite;
}

@keyframes h1-before {
  0%, 100% {
    transform: translate3d(15px, 5px, -10px);
  }
  50% {
    transform: translate3d(-15px, 5px, -10px);
  }
}

h1::after {
  color: #003C71;
  animation: 5s h1-after ease-in-out infinite;
}

@keyframes h1-after {
  0%, 100% {
    transform: translate3d(30px, 10px, -20px);
  }
  50% {
    transform: translate3d(-30px, 10px, -20px);
  }
}

h2::before {
  color: #009CDE;
  animation: 2.5s h2-before ease-in-out infinite;
}

@keyframes h2-before {
  0%, 100% {
    transform: translate3d(0px, 6px, -10px);
  }
  50% {
    transform: translate3d(0px, -3px, -10px);
  }
}

h2::after {
  color: #003C71;
  animation: 2.5s h2-after ease-in-out infinite;
}

@keyframes h2-after {
  0%, 100% {
    transform: translate3d(0px, 12px, -20px);
  }
  50% {
    transform: translate3d(0px, -6px, -20px);
  }
}
</style>
