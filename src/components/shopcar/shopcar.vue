<template>
  <div>
    <div class="shopcar">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highLight':totalCount>0}">
              <span class="icon-shopping_cart" :class="{'highLight':totalCount>0}"></span>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price borderR-1px" :class="{'highLight':totalPrice>0}">
            <span>{{totalPrice | format}}</span>
          </div>
          <div class="desc">
            <span>另需配送费{{deliveryPrice | format}}元</span>
          </div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass" @click.stop="pay">{{payDesc}}</div>
        </div>
      </div>
      <div class="ball-wrapper">
        <div class="balls" v-for="ball in balls">
          <transition name="drop" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
            <div class="ball" v-show="ball.show">
               <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <div class="empty" @click="empty">清空</div>
        </div>
        <div class="list-content" ref="list">
          <ul>
            <li class="food border-1px" v-for="food in selectFoods">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>{{food.price*food.count | format}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
        </div>
      </transition>
    </div>
    <div class="list-mask" @click="hiddenMask" v-show="listShow">
    </div>
  </div> 
</template>

<script>
import Cartcontrol from '../cartControl/cartcontrol.vue'
import BScroll from 'better-scroll'
  export default {
    props: {
      selectFoods: {
        type: Array,
        // type类型为array,boject则default为函数
        default() {
          return [
            {
              price: 18,
              count: 10
            }

          ]
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 10
      }
    },
    components: {
      Cartcontrol
    },
    data() {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true
      }
    },
    computed: {
      totalPrice() {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      totalCount() {
        let count = 0
        this.selectFoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `¥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          return `还差${diff}元起送`
        } else {
          return '去结算'
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true
          return false
        }
        let show = !this.fold
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              let el = this.$refs.list
              this.scroll = new BScroll(el, {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
        return show
      }
    },
    methods: {
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
      beforeEnter(el) {
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top - 22)
            el.style.WebkitTransform = `translate3d(0,${y}px,0)`
            el.style.transform = `translate3d(0,${y}px,0)`
            el.style.display = 'block'
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`
            inner.style.transform = `translate3d(${x}px,0,0)`
          }
        }
      },
      enter(el) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight
        this.$nextTick(() => {
          el.style.WebkitTransform = 'translate3d(0,0,0)'
          el.style.transform = 'translate3d(0,0,0)'
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(0,0,0)'
          inner.style.transform = 'translate3d(0,0,0)'
        })
      },
      afterEnter(el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      },
      toggleList() {
        if (!this.totalCount) {
          return
        }
        this.fold = !this.fold
      },
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0
        })
      },
      hiddenMask() {
        this.fold = true
      },
      pay() {
        if (this.totalPrice >= this.minPrice) {
          alert('去结算付账')
        }
      }
    }
  }
</script>

<style lang="scss">
@import "../../commen/sass/mixin.scss";
  .shopcar {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 50;
    width: 100%;
    height: 48px;
    .content {
      display: flex;
      background-color: #141d27;
      font-size: 0;
      .content-left {
        flex: 1;
        .logo-wrapper {
          display: inline-block;
          position: relative;
          top: -10px;
          margin: 0 12px;
          padding: 6px;
          width: 56px;
          height: 56px;
          box-sizing: border-box;
          border-radius: 50%;
          vertical-align: top;
          background-color: #141d27;
          .logo {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            text-align: center;
            background-color: #2b343c;
            &.highLight {
              background-color: rgb(0,160,220);
            }
            .icon-shopping_cart {
              font-size: 24px;
              color: #80858a;
              line-height: 44px;
              &.highLight {
                color: #fff;
              }
            }
          }
          .num {
            position: absolute;
            top: 0;
            right: 0;
            width: 24px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            border-radius: 16px;
            font-size: 9px;
            font-weight: 700;
            color: #fff;
            background: rgb(240,20,20);
            box-shadow: 0 4px 8px 0 rgba(0,0,0,.4);
          }
        }
        .price {
          display: inline-block;
          vertical-align: top;
          margin-top: 12px;
          line-height: 24px;
          box-sizing: border-box;
          padding-right: 12px;
          @include borderRight-1px(rgba(255,255,255,.5))
          font-size: 16px;
          font-weight: 700;
          color: rgba(255,255,255,.5);
          &.highLight {
            color: #fff;
          }
        }
        .desc {
          display: inline-block;
          vertical-align: top;
          margin: 12px 0 0 12px;
          line-height: 24px;
          font-size: 10px;
          font-weight: 200;
          color: rgba(255,255,255,.5);
        }
      }
      .content-right {
        flex: 0 0 105px;
        width: 105px;
        .pay {
          height: 48px;
          line-height: 48px;
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,.5);
          &.not-enough {
            background-color: #2b333b;
          }
          &.enough {
            background-color: #00b43c;
            color: #fff;
          }
        }
      }
    }
    .ball-wrapper {
      .ball {
        position: fixed;
        left: 32px;
        bottom: 22px;
        z-index: 200;
        transition: transform 1s cubic-bezier(0.49,-0.29,0.75,0.41);
        .inner {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgb(0, 160, 220);
          transition: transform 1s linear;
        }
      }
    }
    .shopcart-list {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      transform: translate3d(0,-100%,0);
      &.fold-enter-active, &.fold-leave-active {
        transition: all .5s linear;
      }
      &.fold-enter, &.fold-leave-active {
        transform: translate3d(0,0,0);
      }
      .list-header {
        line-height: 40px;
        height: 40px;
        padding: 0 18px;
        background-color: #f3f5f7;
        border-bottom: 1px solid rgba(7,17,27,.2);
        .title {
          float: left;
          font-size: 14px;
          color: rgb(7,17,27);
        }
        .empty {
          float: right;
          font-size: 12px;
          color: rgb(0,160,220);
        }
      }
      .list-content {
        padding: 0 18px;
        max-height: 217px;
        overflow: hidden;
        background-color: #fff;
        .food {
          position: relative;
          padding: 12px 0;
          box-sizing: border-box;
          @include border-1px(rgba(7,17,27,.2));
          .name {
            line-height: 24px;
            font-size: 14px;
            color: rgb(7,17,27);
          }
          .price {
            position: absolute;
            right: 100px;
            bottom: 12px;
            line-height: 24px;
            font-size: 14px;
            font-weight: 700;
            color: rgb(240,20,20);
          }
          .cartcontrol-wrapper {
            position: absolute;
            right: 0;
            bottom: 6px;
          }
        }
      }
    }
  }
  .list-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index:40;
    background-color: rgba(7,17,27,.6);
  }
</style>
