<template>
<!-- 外层的是固定高度的 -->
 <div class="seller" ref="seller">
   <div class="seller-content">
     <div class="overview">
       <h1 class="title">{{seller.name}}</h1>
       <div class="desc">
         <star :size="36" :score="seller.score"></star>
         <span class="ratingCount">({{seller.ratingCount}})</span>
         <span class="sellCount">月售{{seller.sellCount}}单</span>
       </div>
       <ul class="remark">
         <li class="block">
           <h2 class="title">起送价</h2>
           <div class="content">
             <span class="stress">{{seller.minPrice}}</span>元
           </div>
         </li>
         <li class="block">
           <h2 class="title">商家配送</h2>
           <div class="content">
             <span class="stress">{{seller.deliveryPrice}}</span>元
           </div>
         </li>
         <li class="block">
           <h2 class="title">评价配送时间</h2>
           <div class="content">
             <span class="stress">{{seller.deliveryTime}}</span>分钟
           </div>
         </li>
       </ul>
       <div class="favourite"  @click="toogleFavourtie">
         <span class="icon-favorite" :class="{'active':favorite}"></span>
         <span class="text">{{favoriteText}}</span>
       </div>
     </div>
     <split></split>
     <div class="bulletin">
       <h1 class="title">公告与活动</h1>
       <div class="content-wrapper border-1px">
         <p class="content">{{seller.bulletin}}</p>
       </div>
       <ul v-if="seller.supports" class="supports">
         <li class="supports-item" v-for="(item,index) in seller.supports">
           <span class="icon" :class="classMap[seller.supports[index].type]"></span>
           <span class="text">{{item.description}}</span>
         </li>
       </ul>
     </div>
     <split></split>
     <div class="pics">
       <h2 class="title">商家实景</h2>
       <div class="pic-wrapper" ref="picWrapper">
         <ul class="pic-list" ref="picList">
           <li class="pic-item" v-for="pic in seller.pics">
             <img :src="pic" width="120" height="90">
           </li>
         </ul>
       </div>
     </div>
     <split></split>
     <div class="info">
       <h2 class="title border-1px">商家信息</h2>
       <ul>
         <li class="info-item" v-for="info in seller.infos">{{info}}</li>
       </ul>
     </div>
   </div>
 </div>
</template>

<script>
  import Star from '../star/star'
  import Split from '../split/split'
  import BScroll from 'better-scroll'
  import {saveToLocalStorage, loadFromLocalStorage} from '../../commen/js/store'
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        favorite: (() => {
          return loadFromLocalStorage(this.seller.id, 'favorite', false)
        })()
      }
    },
    computed: {
      favoriteText() {
        if (this.favorite) {
          return '已收藏'
        } else {
          return '未收藏'
        }
      }
    },
    components: {
      Star,
      Split
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    watch: {
      'seller'() {
        this.$nextTick(() => {
          this._initScroll()
          this._initPicScroll()
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        this._initScroll()
        this._initPicScroll()
      })
    },
    methods: {
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      },
      _initPicScroll() {
        if (this.seller.pics) {
          let picWidth = 120
          let picMargin = 6
          let ulWidth = (picWidth + picMargin) * this.seller.pics.length - picMargin
          this.$refs.picList.style.width = ulWidth + 'px'
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.picWrapper, {
                scrollX: true,
                eventPassthrough: 'vertical'
              })
            } else {
              this.picScroll.refresh()
            }
          })
        }
      },
      toogleFavourtie(event) {
        if (!event._constructed) {
          return
        }
        this.favorite = !this.favorite
        saveToLocalStorage(this.seller.id, 'favorite', this.favorite)
      }
    }
  }
</script>

<style lang="scss">
  @import '../../commen/sass/mixin';
  .seller {
    position: absolute;
    top: 174px;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .overview {
      padding: 18px;
      .title {
        margin-bottom: 8px;
        line-height: 14px;
        font-size: 14px;
        color: rgb(7,17,27);
      }
      .desc {
        padding-bottom: 18px;
        font-size: 0;
        @include border-1px(rgba(7,17,27,.1));
        .star {
          display: inline-block;
          margin-right: 8px;
          vertical-align: top;
        }
        .ratingCount,.sellCount {
          display: inline-block;
          margin-right: 12px;
          line-height: 18px;
          vertical-align: top;
          font-size: 10px;
          color: rgb(77,85,93)
        }
      }
      .remark {
        display: flex;
        padding: 18px 0;
        .block {
          flex: 1;
          text-align: center;
          border-right: 1px solid rgba(7,17,27,.1);
          &:last-child {
            border: none;
          }
          .title {
            margin-bottom: 4px;
            line-height: 10px;
            font-size: 10px;
            color: rgb(147,153,159);
          }
          .content {
            line-height: 24px;
            font-size: 10px;
            color: rgb(7,17,27);
            .stress {
              font-size: 24px;
            }
          }
        }
      }
      .favourite {
        position: absolute;
        top: 18px;
        right: 18px;
        text-align: center;
        .icon-favorite {
          display: block;
          margin-bottom: 4px;
          line-height: 24px;
          font-size: 24px;
          color: #d4d9d6;
          &.active {
            color: rgb(240,20,20);
          }
        }
      }
    }
    .bulletin {
      padding: 18px 18px 0 18px;
      .title {
        margin-bottom: 8px;
        line-height: 14px;
        font-size: 14px;
        color: rgb(7,17,27);
      }
      .content-wrapper {
        padding: 0 12px 16px 12px;
        @include border-1px(rgba(7,17,27,.1));
        .content {
          line-height: 24px;
          font-size: 12px;
          color: rgb(240,20,20)
        }
      }
      .supports {
        .supports-item {
          padding: 16px 12px;
          font-size: 0;
          @include border-1px(rgba(7,17,27,.1));
          .icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 6px;
            background-size: 16px 16px;
            background-repeat: no-repeat;
            &.decrease {
              @include bg-image('./decrease_4');
            }
            &.discount {
              @include bg-image('./discount_4');
            }
            &.guarantee {
              @include bg-image('./guarantee_4');
            }
            &.invoice {
              @include bg-image('./invoice_4');
            }
            &.special {
              @include bg-image('./special_4')
            }
          }
          .text {
            line-height: 16px;
            font-size: 12px;
            color: rgb(7,17,27);
          }
          &:last-child {
            @include border-none;
          }
        }
      }
    }
    .pics {
      padding: 18px;
      .title {
        margin-bottom: 12px;
        line-height: 14px;
        font-size: 14px;
        color: rgb(7,17,27);
      }
      .pic-wrapper {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        .pic-list {
          font-size: 0;
          .pic-item {
            display: inline-block;
            margin-right: 6px;
            width: 120px;
            height: 90px;
            &:last-child {
              margin: 0;
            }
          }
        }
      }
    }
    .info {
      padding: 18px 18px 0 18px;
      color: rgb(7,17,27);
      .title {
        padding-bottom: 12px;
        line-height: 14px;
        @include border-1px(rgba(7,17,27,.1));
        font-size: 14px;
      }
      .info-item {
        padding: 16px 12px;
        line-height: 16px;
        @include border-1px(rgba(7,17,27,.1));
        font-size: 12px;
        &:last-child {
          @include border-none;
        }
      }
    }
  }
</style>
