<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span class="blod positive" @click="select(2,$event)" :class="{'active':selectTypeInstead===2}">{{desc.all}}<span class="count">{{rating.length}}</span></span>
      <span class="blod positive" @click="select(0,$event)" :class="{'active':selectTypeInstead===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span class="blod negative" @click="select(1,$event)" :class="{'active':selectTypeInstead===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看内容的评价</span>
    </div>
  </div>
</template>

<script>
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2
  export default {
    props: {
      rating: {
        type: Array,
        default() {
          return []
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    data() {
      return {
        selectTypeInstead: this.selectType,
        onlyContentIntstead: this.onlyContent
      }
    },
    methods: {
      select(type, event) {
        if (!event._constructed) {
          return
        }
        this.selectTypeInstead = type
        this.$emit('select', type)
      },
      toggleContent(even) {
        if (!event._constructed) {
          return
        }
        this.onlyContentIntstead = !this.onlyContentIntstead
        this.$emit('change', this.onlyContentIntstead)
      }
    },
    computed: {
      positives() {
       return this.rating.filter((rating) => {
         return rating.rateType === POSITIVE
       })
      },
      negatives() {
        return this.rating.filter((rating) => {
          return rating.rateType === NEGATIVE
        })
      }
    }
  }
</script>

<style lang="scss">
@import '../../commen/sass/mixin';
  .ratingselect {
    .rating-type {
      padding: 18px 0;
      margin: 0 18px;
      font-size: 0;
      @include border-1px(rgba(7,17,27,.1));
      .blod {
        display: inline-block;
        padding: 8px 12px;
        margin-right: 8px;
        border-radius: 1px;
        font-size: 12px;
        color: rgb(77,85,93);
        &.active {
          color: #fff;
        }
        .count {
          font-size: 8px;
          margin-left: 2px;
        }
        &.positive {
          background-color: rgba(0,160,220,.2);
          &.active {
            background-color: rgb(0,160,220);
          }
        }
        &.negative {
          background-color: rgba(77,85,93,.2);
          &.active {
            background-color: rgb(77,85,93);
          }
        }
      }
    }
    .switch {
      padding: 12px 18px;
      line-height: 24px;
      border-bottom: 1px solid rgba(7,17,27,.1);
      color: rgb(147,153,159);
      font-size: 0;
      &.on {
        .icon-check_circle {
          color: #00c580;
        }
      }
      .icon-check_circle {
        display: inline-block;
        vertical-align: top;
        margin-right: 4px;
        font-size: 24px;
      }
      .text {
        display: inline-block;
        vertical-align: top;
        font-size: 12px;
      }
    }
  }
</style>
