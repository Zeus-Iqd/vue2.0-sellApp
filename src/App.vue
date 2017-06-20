<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <router-link class="tab-item" to="/goods" tag="div">商品</router-link>
      <router-link class="tab-item" to="/ratings" tag="div">评论</router-link>
      <router-link class="tab-item" to="/seller" tag="div">商家</router-link>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import myHeader from './components/header/header'
  // 如何全局使用axios
  import axios from 'axios'
  import {urlParse} from './commen/js/util'
  const ERR_OK = 0

  export default {
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse()
            return queryParam.id
          })()
        }
      }
    },
    components: {
      vHeader: myHeader
    },
    created() {
      axios.get('/api/seller?id=' + this.seller.id).then((response) => {
        if (response.data.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, response.data.data)
        }
      })
    }
  }
</script>

<style lang="scss">
  @import './commen/sass/mixin.scss';
  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    @include border-1px(rgba(7,17,27,.1));
    .tab-item {
      flex: 1;
      text-align: center;
      font-size: 14px;
      color: rgb(77,85,93);
      &.router-link-active {
        color: rgb(240,20,20)
      }
    }
  }
</style>
