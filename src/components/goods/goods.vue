<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menu">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :class="{'active':currentIndex===index}" @click="selectMenu(index,$event)">
          <span class="text">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foods">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h2 class="title">{{item.name}}</h2>
          <ul>
            <li v-for="food in item.foods" class="food-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating | percent}}</span>
                </div>
                <div class="price">
                  <span class="now">{{food.price | format}}</span><span v-show="food.oldPrice"class="old">{{food.oldPrice | format}}</span>
                </div>
                <div class="carcontrol-wrapper">
                  <cartcontrol :food="food" @cartarget="drop"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcar :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" ref="shopcar"></shopcar>
  </div>
</template>

<script>
  import axios from 'axios'
  import BScroll from 'better-scroll'
  import Shopcar from '../shopcar/shopcar'
  import Cartcontrol from '../cartControl/cartcontrol'
  const ERR_OK = 0
  export default {
    components: {
      Shopcar,
      Cartcontrol
    },
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        target: null
      }
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (!height2 || this.scrollY >= height1 && this.scrollY < height2) {
            return i
          }
        }
        return 0
      },
      selectFoods() {
        let foods = []
        this.goods.forEach((data) => {
          data.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      axios.get('/api/goods').then((response) => {
        response = response.data
        if (response.errno === ERR_OK) {
          this.goods = response.data
          this.$nextTick(() => {
            this._initScroll()
            this._calcHeight()
          })
        }
      })
    },
    methods: {
      selectMenu(index, event) {
        if (!event._constructed) {
          return
        }
        let foodList = this.$refs.foods.getElementsByClassName('food-list-hook')
        this.foodsScroll.scrollToElement(foodList[index], 400)
      },
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menu, {
          'click': true
        })
        this.foodsScroll = new BScroll(this.$refs.foods, {
          probeType: 3,
          'click': true
        })
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      _calcHeight() {
        let foodList = this.$refs.foods.getElementsByClassName('food-list-hook')
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < foodList.length; i++) {
          height += foodList[i].offsetHeight
          this.listHeight.push(height)
        }
      },
      drop(target) {
        // 为了优化，异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopcar.drop(target)
        })
      }
    }
  }
</script>

<style lang="scss">
@import "../../commen/sass/mixin.scss";
  .goods {
    position: absolute;
    top: 174px;
    bottom: 48px;
    display: flex;
    overflow: hidden;
    width: 100%;
    .menu-wrapper {
      /*  flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。 */
      flex: 0 0 80px;
      // 以下设置为了使安卓手机兼容
      width: 80px;
      background-color: #f3f5f7;
      .menu-item {
        // display : table;垂直居中
        display: table;
        height: 54px;
        width: 56px;
        padding: 0 12px;
        line-height: 14px;
        &.active {
          position: relative;
          margin-top: -1px;
          z-index: 10;
          background-color: #fff;
          font-weight: 700;
          .text {
            @include border-none;
          }
        }
        .icon {
          display: inline-block;
          width: 12px;
          height: 12px;
          margin-right: 4px;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          &.decrease {
            @include bg-image('decrease_3');
          }
          &.discount {
            @include bg-image('discount_3');
          }
          &.guarantee {
            @include bg-image('guarantee_3');
          }
          &.invoice {
            @include bg-image('invoice_3');
          }
          &.special {
            @include bg-image('special_3')
          }
        }
        .text {
          display: table-cell;
          width: 56px;
          vertical-align: middle;
          @include border-1px(rgba(7,17,27,.1));
          font-size: 12px;
        }
      }
    }
    .foods-wrapper {
      flex: 1;
      .title {
        padding-left: 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        color: rgb(147,153,159);
        background-color: #f3f5f7;
      }
      .food-item {
        display: flex;
        margin: 28px;
        padding-bottom: 18px;
        @include border-1px(rgba(7,17,27,.1));
        &:last-child {
          @include border-none();
          margin-bottom: 0;
        }
        .icon {
          width: 57px;
          flex: 0 0 57;
          margin-right: 10px;
        }
        .content {
          flex: 1;
          .name {
            margin: 2px 0 8px 0;
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            color: rgb(7,17,27);
          }
          .desc,.extra {
            line-height: 10px;
            font-size: 12px;
            color: rgb(147,153,159); 
          }
          .desc {
            line-height: 12px;
            margin-bottom: 8px;
          }
          .extra {
            .count {
              margin-right: 12px;
            }
          }
          .price {
            font-weight: 700px;
            line-height: 24px;
            .now {
              margin-right: 8px;
              font-size: 14px;
              color: rgb(240,20,20)
            }
            .old {
              text-decoration: line-through;
              color: rgb(147,153,159);
            }
          }
          .carcontrol-wrapper {
            position: absolute;
            bottom: 12px;
            right: 0;
          }
        }
      }
    }
  }
</style>
