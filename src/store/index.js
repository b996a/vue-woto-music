import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import mutations from './mutations'
import actions from './actions'
import * as getters from './getters'
Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  // 开发模式下开启严格模式，对state进行深度监视
  strict: debug,
  // 使用Logger插件打印当前vuex的状态
  plugins: debug ? [Vuex.createLogger()] : []
})
