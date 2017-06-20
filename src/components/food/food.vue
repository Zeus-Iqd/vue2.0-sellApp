<template>
  <transition name="float">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hidden">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <div class="title">{{food.name}}</div>
          <div class="detail">
            <div class="sell-count">月售{{food.sellCount}}</div>
            <div class="rating">好评率{{food.rating}}</div>
          </div>
          <div class="price">
            <span class="now">{{food.price | format}}</span><span v-show="food.oldPrice"class="old">{{food.oldPrice | format}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food" @cartarget="drop"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" @click.stop="addFirst" v-show="toggle">
              <span>加入购物车</span>
            </div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h2 class="title">商品信息</h2>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <div class="title">商品评价</div>
          <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :rating="food.ratings" @select="changeSelect" @change="changeContent"></ratingselect>
          <div class="rating-wrapper border-1px">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings" class="rating-item">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" class="avatar" width="12" height="12">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span><span>{{rating.text}}</span>
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">
              <span>暂无评价</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue'
import BScroll from 'better-scroll'
import {formatDateCommen} from '../../commen/js/date'
import Cartcontrol from '../cartControl/cartcontrol'
import Split from '../split/split'
import Ratingselect from '../ratingselect/ratingselect'
const ALL = 2
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    components: {
      Cartcontrol,
      Split,
      Ratingselect
    },
    methods: {
      changeShowFlag() {
        this.showFlag = true
        this.selectType = ALL
        this.onlyContent = true
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            })
          }
        })
      },
      hidden() {
        this.showFlag = false
      },
      addFirst(even) {
        if (!even._constructed) {
          return
        }
        this.$emit('cartarget', even.target)
        Vue.set(this.food, 'count', 1)
      },
      drop(target) {
        this.$emit('cartarget', target)
      },
      changeSelect(type) {
        this.selectType = type
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      changeContent(contentFlag) {
        this.onlyContent = !this.onlyContent
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else {
          return type === this.selectType
        }
      }
    },
    computed: {
      toggle() {
        return !this.food.count || this.food.count === 0
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time)
        return formatDateCommen(date, 'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>

<style lang="scss">
@import '../../commen/sass/mixin.scss';
  .food {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 48px;
    // 要小于shopcar层和其弹出层
    z-index: 30;
    width: 100%;
    background-color: #fff;
    &.float-enter,&.float-leave-active {
      transform: translate3d(100%,0,0);
    }
    &.float-enter-active,&.float-leave-active {
      transition: all .3s linear;
    }
    .image-header {
      position: relative;
      width: 100%;
      padding-top: 100%;
      height: 0;
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .back {
        position: absolute;
        top: 10px;
        left: 0;
        .icon-arrow_lift {
          display: block;
          padding: 18px;
          cursor: pointer;
          font-size: 20px;
          color: #fff;
        }
      }
    }
    .content {
      padding: 18px;
      position: relative;
      .title {
        line-height: 14px;
        font-size: 14px;
        font-weight: 700px;
        color: rgb(7,17,27);
        margin-bottom: 8px;
      }
      .detail {
        margin-bottom: 18px;
        font-size: 0;
        color: rgb(147,153,159);
        .sell-count {
          display: inline-block;
          font-size: 10px;
          margin-right: 12px;
        }
        .rating {
          display: inline-block;
          font-size: 10px;
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
      .cartcontrol-wrapper {
        position: absolute;
        right: 12px;
        bottom: 12px;
      }
      .buy {
        position: absolute;
        right: 18px;
        bottom: 18px;
        z-index: 10;
        width: 148px;
        height: 24px;
        border-radius: 24px;
        line-height: 24px;
        text-align: center;
        color: #fff;
        background-color: rgb(0,160,220);
        &.fade-enter,&.fade-leave-active {
          opacity: 0;
        }
        &.fade-enter-active,&.fade-leave-active {
          transition: all 1s;
        }
      }
    }
    .info {
      padding: 18px;
      .title {
        line-height: 14px;
        margin-bottom: 6px;
        font-size: 14px;
        font-weight: 400;
        color: rgb(7,17,27);
      }
      .text {
        line-height: 24px;
        padding: 0 8px;
        font-size: 12px;
        color: rgb(77,85,93);
      }
    }
    .rating {
      padding-top: 18px;
      .title {
        line-height: 14px;
        margin-left: 18px;
        font-size: 14px;
        font-weight: 400;
        color: rgb(7,17,27);
      }
      .rating-wrapper {
        padding: 0 18px;
        .rating-item {
          position: relative;
          padding: 16px 18px;
          @include border-1px(rgba(7,17,27,.1));
          .user {
            position: absolute;
            right: 0;
            top: 16px;
            line-height: 12px;
            font-size: 0;
            .name {
              display: inline-block;
              margin-right: 6px;
              vertical-align: top;
              font-size: 10px;
              color: rgb(147,153,159);
            }
            .avatar {
              border-radius: 50%;
            }
          }
          .time {
            margin-bottom: 6px;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147,153,159);
          }
          .text {
            line-height: 16px;
            font-size: 12px;
            color: rgb(7,17,27);
            .icon-thumb_up, .icon-thumb_down {
              line-height: 16px;
              margin-right: 4px;
              font-size: 12px;
            }
            .icon-thumb_up {
              color: rgb(0,160,220)
            }
            .icon-thumb_down {
              color: rgb(147,153,159)
            }
          }
        }
        .no-rating {
          padding: 16px 0;
          font-size: 12px;
          color: rgb(147,153,159);
        }
      }
    }
  }
</style>
