import Vue from 'vue'

Vue.filter('format', function (num) {
  return num ? '¥' + num : 0
})

Vue.filter('percent', function (text) {
  return text ? text + '%' : text
})

