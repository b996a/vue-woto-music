import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/font/iconfont.css'
import '@/plugins/vant.js'
import 'amfe-flexible/index.js'
import '@/styles/reset.css'
import '@/assets/css/global.css'
import md5 from 'js-md5'
import formatNum from './common/formatNum'
import formatDuration from './common/formatDuration'

// 全局挂载songItem
import songItem from '@/common/common'
// 挂载md5加密
Vue.prototype.md5 = md5
Vue.config.productionTip = false

Vue.use(songItem)
Vue.use(formatNum)
Vue.use(formatDuration)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
