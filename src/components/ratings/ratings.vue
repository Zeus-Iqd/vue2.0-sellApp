<template>
  <div class="ratings" ref="rating">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :select-type="selectType" :only-content="onlyContent" :rating="ratings" @select="changeSelect" @change="changeContent"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-show="needShow(rating.rateType, rating.text)" v-for="rating in ratings" class="rating-item border-1px">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h2 class="username">{{rating.username}}</h2>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <p class="text" v-show="rating.text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span v-for="recommend in rating.recommend" class="recommend-item">{{recommend}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  const ALL = 2
  const ERR_OK = 0
  import Star from '../star/star'
  import Split from '../split/split'
  import BScroll from 'better-scroll'
  import Ratingselect from '../ratingselect/ratingselect'
  import {formatDateCommen} from '../../commen/js/date'
  import axios from 'axios'
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: true
      }
    },
    components: {
      Star,
      Split,
      Ratingselect
    },
    created() {
      axios.get('/api/ratings').then((response) => {
        response = response.data
        if (response.errno === ERR_OK) {
          this.ratings = response.data
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.rating, {
                click: true
              })
            }
          })
        }
      })
    },
    filters: {
      formatDate(time) {
        let date = new Date(time)
        return formatDateCommen(date, 'yyyy-MM-dd hh:mm')
      }
    },
    methods: {
      changeSelect(type) {
        this.selectType = type
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      changeContent(contentFlag) {
        this.onlyContent = contentFlag
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
    }
  }
</script>

<style lang="scss">
  @import '../../commen/sass/mixin';
  .ratings {
    position: absolute;
    top: 174px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    .overview {
      display: flex;
      padding: 18px 0;
      .overview-left {
        // flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。
        flex: 0 0 137px;
        width: 137px;
        padding: 6px 0;
        border-right: 1px solid rgba(7,17,27,.1);
        text-align: center;
        @media only screen and (max-width: 320px) {
          flex: 0 0 120px;
          width: 120px;
        }
        .score {
          margin-bottom: 6px;
          line-height: 28px;
          font-size: 24px;
          color: rgb(255,153,0);
        }
        .title {
          margin-bottom: 8px;
          line-height: 12px;
          font-size: 12px;
          color: rgb(7,17,27);
        }
        .rank {
          line-height: 10px;
          font-size: 10px;
          color: rgb(147,153,159);
        }
      }
      .overview-right {
        flex: 1;
        padding: 6px 0 6px 24px;
        @media only screen and (max-width: 320px) {
          padding-left: 4px;
        }
        .score-wrapper {
          margin-bottom: 8px;
          font-size: 0;
          .title {
            display: inline-block;
            vertical-align: top;
            line-height: 18px;
            font-size: 12px;
            color: rgb(7,17,27);
          }
          .star {
            display: inline-block;
            vertical-align: top;
            margin: 0 12px;
            @media only screen and (max-width: 320px) {
              margin: 0 8px;
            }
          }
          .score {
            display: inline-block;
            line-height: 18px;
            vertical-align: top;
            font-size: 12px;
            color: rgb(255,153,0);
          }
        }
        .delivery-wrapper {
          font-size: 0;
          .title {
            margin-bottom: 8px;
            line-height: 12px;
            font-size: 12px;
            color: rgb(7,17,27);
          }
          .time {
            margin-left: 12px;
            line-height: 18px;
            font-size: 12px;
            color: rgb(255,153,0);
          }
        }
      }
    }
    .rating-wrapper {
      padding: 0 18px;
      .rating-item {
        display: flex;
        padding: 18px 0;
        @include border-1px(rgba(7,17,27,.1));
        .avatar {
          flex: 0 0 28px;
          width: 28px;
          margin-right: 12px;
          img {
            border-radius: 50%;
          }
        }
        .content {
          flex: 1;
          position: relative;
          .username {
            margin-bottom: 4px;
            line-height: 12px;
            font-size: 10px;
            color: rgb(7,17,27);
          }
          .star-wrapper {
            margin-bottom: 6px;
            font-size: 0;
            .star {
              display: inline-block;
              margin-right: 6px;
              vertical-align: top;
            }
            .delivery {
              display: inline-block;
              line-height: 12px;
              vertical-align: top;
              font-size: 10px;
              font-weight: 200;
              color: rgb(147,153,159);
            }
          }
          .text {
            margin-bottom: 8px;
            line-height: 18px;
            font-size: 12px;
            color: rgb(7,17,27);
          }
          .recommend {
            line-height: 16px;
            font-size: 0;
            .icon-thumb_up,.recommend-item{
              display: inline-block;
              margin: 0 8px 4px 0;
              font-size: 9px;
            }
            .icon-thumb_up {
              font-size: 12px;
              color: rgb(0,160,220);
            }
            .recommend-item {
              padding: 6px;
              border: 1px solid rgba(7,17,27,.1);
              color: rgb(147,153,159);
              background-color: #fff;
            }
          }
          .time {
            position: absolute;
            top: 0;
            right: 0;
            line-height: 18px;
            font-size: 10px;
            color: rgb(147,153,159);
          }
        }
      }
    }
  }
</style>
