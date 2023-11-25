<template>
    <div class="absolute z-100 overflow-hidden">
        <canvas id="canvas"></canvas>
    </div>
</template>

<script>
export default {
    data () {
        return {
            flakes:[],
            canvas:null,
            ctx:null,
            flakeCount:400,
            mX:-100,
            mY:-100,
            requestAnimationFrame:null
        }
    },
    mounted () {
        this.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||function(callback) {window.setTimeout(callback, 1000 / 60);console.log(234);}

        console.log(this.requestAnimationFrame);

        window.requestAnimationFrame = this.requestAnimationFrame;

        this.canvas = document.getElementById("canvas")
        this.ctx = this.canvas.getContext("2d")

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.canvas.addEventListener("mousemove", e=>{
            this.mX = e.clientX
            this.mY = e.clientY
            this.snow
        });
        window.onresize=()=>{
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        this.init();
    },
    methods: {
        init() {
            for (var i = 0; i < this.flakeCount; i++) {
                var x = Math.floor(Math.random() * this.canvas.width),
                    y = Math.floor(Math.random() * this.canvas.height),
                    size = (Math.random() * 3) + 2,
                    speed = (Math.random() * 1) + 0.5,
                    opacity = (Math.random() * 0.5) + 0.3;

                this.flakes.push({
                    speed: speed,
                    velY: speed,
                    velX: 0,
                    x: x,
                    y: y,
                    size: size,
                    stepSize: (Math.random()) / 30,
                    step: 0,
                    opacity: opacity
                });
            }
            this.snow();
        },
        snow(){
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (var i = 0; i < this.flakeCount; i++) {
                var flake = this.flakes[i],
                    x = this.mX,
                    y = this.mY,
                    minDist = 150,
                    x2 = flake.x,
                    y2 = flake.y;

                var dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
                    dx = x2 - x,
                    dy = y2 - y;

                if (dist < minDist) {
                    var force = minDist / (dist * dist),
                        xcomp = (x - x2) / dist,
                        ycomp = (y - y2) / dist,
                        deltaV = force / 2;

                    flake.velX -= deltaV * xcomp;
                    flake.velY -= deltaV * ycomp;

                } else {
                    flake.velX *= .98;
                    if (flake.velY <= flake.speed) {
                        flake.velY = flake.speed
                    }
                    flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
                }

                this.ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
                flake.y += flake.velY;
                flake.x += flake.velX;
                    
                if (flake.y >= this.canvas.height || flake.y <= 0) {
                    this.reset(flake);
                }


                if (flake.x >= this.canvas.width || flake.x <= 0) {
                    this.reset(flake);
                }

                this.ctx.beginPath();
                this.ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
            window.requestAnimationFrame(this.snow);
        },
        reset(flake) {
            flake.x = Math.floor(Math.random() * this.canvas.width);
            flake.y = 0;
            flake.size = (Math.random() * 3) + 2;
            flake.speed = (Math.random() * 1) + 0.5;
            flake.velY = flake.speed;
            flake.velX = 0;
            flake.opacity = (Math.random() * 0.5) + 0.3;
        },
    }
}
</script>

<style lang="scss" scoped>
 #canves{
    position:absolute;top:0;left:0;right: 0;bottom: 0;
    overflow: hidden;
 }
</style>
