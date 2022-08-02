<template>
  <div>
    <van-nav-bar title="云音乐热歌榜" left-arrow @click-left="$router.back()" fixed />
    <!-- 加载更多 -->
    <div class="warp">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <song-item :list='this.rinkList' :paixu='1'></song-item>
      </van-list>
    </div>
  </div>
</template>

<script>
import { getListSongs } from '@/api/Ranking.js'
export default {
  name: 'HotRankList',
  data() {
    return {
      // 热门排行榜
      rinkList: [],
      // 歌单id
      id: 3778678,
      // 获得的歌曲数
      limit: 20,
      // 起始歌曲
      offset: 1,
      // 加载更多的控制
      loading: true,
      // 所以数据是否加载完毕
      finished: false
    }
  },
  created() {
    this.getIdLists()
  },
  methods: {
    getIdLists() {
      getListSongs(this.id, this.limit, this.offset).then(res => {
        // this.rinkList = res.data.songs
        this.rinkList = [...this.rinkList, ...res.data.songs]
        this.loading = false
        if (res.data.songs.length === 0) {
          this.finished = true
        }
        // console.log(this.rinkList)
      })
    },
    onLoad() {
      this.offset++
      this.getIdLists()
    }
  }
}
</script>

<style lang="less" scoped>
.warp {
  margin-top: 46px;
}
</style>
