import Vue from 'vue'
import Router from 'vue-router'
import Seller from '../components/seller/seller'
import Goods from '../components/goods/goods'
import Ratings from '../components/ratings/ratings'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/seller'
    },
    {
      path: '/seller',
      component: Seller
    },
    {
      path: '/goods',
      component: Goods
    },
    {
      path: '/ratings',
      component: Ratings
    }
  ]
})
