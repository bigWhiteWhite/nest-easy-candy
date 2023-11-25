<template>
    <div class="body">
        <div class="card" ref='card' @click="card">
            <img src="https://source.unsplash.com/900x600/?nature,water,1">
            <h4>APP OF THE DAY</h4>
            <div class="content-wrapper">
                <div class="content">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi dolor veritatis neque cumque. Voluptatibus debitis quia unde corrupti laudantium fuga pariatur tenetur dolorum aspernatur laborum iste animi, consequatur porro sequi?</p>
                <p>Suscipit, culpa molestiae alias doloribus praesentium omnis tempore impedit deserunt consequatur tempora. Ad id eum non officia corrupti dolores earum architecto corporis commodi delectus excepturi, laudantium qui, harum aut libero!</p>
                <p>Veritatis nemo deleniti, deserunt iure odit ratione molestiae labore non ipsum obcaecati aperiam officiis repudiandae similique architecto quas nostrum quidem enim fugiat optio alias incidunt ipsam dicta. Minus, perspiciatis reiciendis!</p>
                <p>Consequuntur facilis cupiditate tempore eius esse! Aut quo iste praesentium recusandae commodi placeat est omnis soluta fuga dolore veniam provident culpa, deleniti ullam hic dignissimos fugiat illo nemo veritatis ex.</p>
                <p>Ratione eos illo incidunt illum inventore consequatur eligendi, aliquam ducimus voluptatem? Voluptate dignissimos quasi vel eum tempore, aperiam nemo, aliquam ratione amet aspernatur nam! Fugit quaerat nemo aspernatur. Quia, quis.</p>
                </div>
            </div>
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
        card(){
            console.log(this.$refs.card.offsetTop);
            let top = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset
            let card_offset_scrolltop = this.$refs.card.offsetTop - top
            console.log(card_offset_scrolltop);
            this.$refs.card.style.setProperty('--data-offset-top', card_offset_scrolltop * -1 + 'px')
            this.$refs.card.classList.toggle('active')
            let ratio = 414/380
            let height = document.documentElement.clientHeight
            height -= document.querySelector('.body .card img').style.height * ratio
            height -= document.querySelector('.body .card h4').style.height * ratio
            height /= ratio
            console.log(height);

            document.querySelector('.content').style.setProperty('height',height)
            document.querySelector('.content').style.height=height+'px'
            const hasActive = this.$refs.card.classList.contains('active')
            if(hasActive){
                document.querySelector('.body').classList.add('noscroll')
            }else{
                document.querySelector('.body').classList.remove('noscroll')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
 :root {
  font-family: Helvetica;
  --body-width: 414px;
  --card-width: 380px;
  --card-height: 280px;
  --img-height: 226px;
  --img-height-expanded: 320px;
  
  background-color: #333;
}
.body{
    --body-width: 414px;
    font-family: Helvetica;
    width: var(--body-width);
    background-color: #eee;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 1rem 0;

}
.noscroll {
    overflow: hidden;
}

.card {
    --card-width: 380px;
    --card-height: 280px;
    --img-height: 226px;
    --img-height-expanded: 320px;
    width: var(--card-width);
    height: var(--card-height);
    background-color: #fff;
    border-radius: 1rem;
    box-shadow: 0 .2rem 2rem rgba(0, 0, 0, .1);
    margin: 1rem 0;
    transition: .3s all cubic-bezier(0, 1, 0.95, 1.05);
    img {
        display: block;
        width: 100%;
        height: var(--img-height);
        object-fit: cover;

        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
    }
    h4 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: bold;
        padding: .8rem 1.2rem;
        background-color: #fff;
        line-height: 2rem;
        letter-spacing: -.5px;
        padding-bottom: 0;
    }
    .content-wrapper {
        height: 0;
        overflow: hidden;
        transition: .3s all ease-out;
        opacity: .8;
        .content {
            padding: 0 1.2rem;
            background-color: #fff;
            overflow: auto;
        }

    }
    p{
        font-size: 1.2rem;
        line-height: 1.5rem;
    }
}
.active {
    transform: translateY(var(--data-offset-top)) scale(calc(480/420));
    transform-origin: 50% 0;
    border-radius: 0;
    h4 {
        padding-bottom: .8rem;
    }
    img {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        height: var(--img-height-expanded);
    }
    .content-wrapper {
        height: 100vh;
        transition: .3s all ease-in;
        opacity: 1;
    }
}

</style>
