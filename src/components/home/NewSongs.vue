<template>
  <div>
    <van-nav-bar title="最新音乐" left-arrow @click-left="$router.back()" fixed border />
    <div class="warp" :class="playingList.length>0?'main':''">
      <song-item :list='this.NewList'></song-item>
    </div>
  </div>
</template>

<script>
import { getRecommendNewMusic } from '@/api/Home.js'
import { mapGetters } from 'vuex'
export default {
  name: 'NewSongs',
  created() {
    this.songRec()
  },
  data() {
    return {
      NewList: [], // 最新歌曲
      limit: 10
    }
  },
  computed: { ...mapGetters(['playingList']) },
  methods: {
    songRec() {
      getRecommendNewMusic(this.limit).then(res => {
        this.NewList = res.data.result
        // console.log(this.NewList)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.warp {
  margin-top: 46px;
}
.main {
  margin-bottom: 1.7333rem;
}
</style>
