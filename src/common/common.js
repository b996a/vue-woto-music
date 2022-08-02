import songItem from '@/components/songItem.vue'
import palyAll from '@/components/palyAll.vue'
export default {
  install(Vue) {
    Vue.component('songItem', songItem)
    Vue.component('palyAll', palyAll)
  }
}
