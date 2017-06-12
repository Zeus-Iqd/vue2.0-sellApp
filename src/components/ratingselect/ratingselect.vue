<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span class="blod positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">47</span></span>
      <span class="blod positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">47</span></span>
      <span class="blod negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">47</span></span>
    </div>
    <div class="switch">
      <span class="icon-check_circle"></span>
      <span class="text">只看内容的评价</span>
    </div>
  </div>
</template>

<script>
  // const POSITIVE = 0
  // const NEGATIVE = 0
  const ALL = 1
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
  }
</style>
