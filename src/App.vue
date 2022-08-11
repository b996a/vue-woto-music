<template>
  <div id="app">
    <!-- 利用transition的钩子函数，在页面进入后执行添加需要缓存的页面名 -->
    <transition @enter-to="afterRouterChange">
      <!-- 通过v-if快速刷新页面且不保存当前需要刷新的页面，下次进入就会重新执行页面的函数 -->
      <keep-alive v-if="refreshControl" :include='keepAliveArr'>
        <router-view />
      </keep-alive>
    </transition>
    <play-music @progress="setProgress"></play-music>
    <mini-player :progress="getProgress"></mini-player>
    <play-list></play-list>
  </div>
</template>
<script>
import MiniPlayer from '@/views/Play/mini-player.vue'
import playMusic from './views/Play/playMusic.vue'
import PlayList from './views/Play/playList.vue'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      progress: 0,
      keepAliveArr: ['LayoutPage', 'userInfo', 'boutiqueList', 'dailyRec', 'H-banner', 'HotRankList', 'NewSongs', 'HomePage'],
      // 刷新控制
      refreshControl: true
    }
  },
  components: { playMusic, MiniPlayer, PlayList },
  watch: {
    isLogin(newLogin) {
      if (!newLogin) {
        this.refreshChild('userInfo')
        this.refreshChild('LayoutPage')
      }
    }
  },
  computed: {
    getProgress() {
      return this.progress
    },
    ...mapGetters(['isLogin'])
  },
  methods: {
    setProgress(msg) {
      this.progress = msg
    },
    refreshChild(name) {
      // 先移除，再加载，强制刷新子页面
      // const name = this.$refs.child.$options.name
      this.keepAliveArr.splice(this.keepAliveArr.indexOf(name), 1)
      this.refreshControl = false
      this.$nextTick(() => (this.refreshControl = true))
    },
    afterRouterChange() {
      // 记录子组件name，用于keepalive
      // const childName = this.$refs.child.$options.name
      const childNames = ['userInfo', 'LayoutPage']
      childNames.forEach(item => {
        this.pageTabList[this.pageTabIndex].name = item
        if (!this.keepAliveArr.includes(item)) {
          this.keepAliveArr.push(item)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
