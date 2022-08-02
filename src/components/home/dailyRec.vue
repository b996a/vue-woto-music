<template>
  <div>
    <van-nav-bar title="每日推荐" left-arrow @click-left="$router.back()" fixed border />
    <div class="warp" :class="playingList.length>0?'main':''">
      <song-item :list='this.RecList'></song-item>
    </div>
  </div>
</template>

<script>
import { getRecommendSong } from '@/api/Home.js'
import { mapGetters } from 'vuex'
export default {
  name: 'dailyRec',
  created() {
    this.dialyRecSong()
  },
  data() {
    return {
      RecList: [], // 推荐歌曲
      limit: 10
    }
  },
  computed: { ...mapGetters(['playingList']) },
  methods: {
    dialyRecSong() {
      getRecommendSong().then(res => {
        this.RecList = res.data.data.dailySongs
        // console.log(this.RecList)
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
