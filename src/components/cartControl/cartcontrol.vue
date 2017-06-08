<template>
  <div class="cartcontrol">
    <transition name="rotate">
      <div class="decrease icon-remove_circle_outline" v-show="food.count" @click="decreaseCount($event)">
      </div>
    </transition>
    <div class="count" v-show="food.count">
      {{food.count}}
    </div>
    <div class="add icon-add_circle" @click="addCount($event)"></div>
  </div>
</template>

<script>
import Vue from 'vue'
  export default {
    props: {
      food: {
        type: Object
      }
    },
    created() {
    },
    methods: {
      addCount(even) {
        if (!even._constructed) {
          return
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count++
        }
        this.$emit('cartarget', even.target)
      },
      decreaseCount(even) {
        if (!even._constructed) {
          return
        }
        if (this.food.count) {
          this.food.count--
        }
      }
    }
  }
</script>

<style lang="scss">
  .cartcontrol {
    font-size: 0;
    
    .decrease,.add {
      display: inline-block;
      padding: 6px;
      line-height: 24px;
      font-size: 24px;
      color: rgb(0,160,220)
    }
    .decrease {
      // 定义动画
      &.rotate-enter, &.rotate-leave-active {
        opacity: 0;
        transform: translateX(24px) rotateZ(180deg);
      }
      &.rotate-enter-active, &.rotate-leave-active {
        transition: all .5s linear;
      }
    }
    .count {
      display: inline-block;
      width: 24px;
      vertical-align: top;
      padding-top: 6px;
      line-height: 24px;
      text-align: center;
      font-size: 10px;
      color: #000;
    }
    .add {
    }
  }
  
</style>
