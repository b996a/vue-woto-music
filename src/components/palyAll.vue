<template>
  <div class="palyall">
    <van-tag round plain size="large" color="#444" type="primary" @click="playall">
      <van-icon name="play-circle-o" size="18px" />
      <span class="text">播放全部歌曲</span>
    </van-tag>
  </div>
</template>

<script>
import { checkMusic, getSongUrl } from '@/api/paly.js'
export default {
  props: {
    List: Array
  },
  methods: {
    // 播放全部
    playall() {
      checkMusic(this.List[0].id)
        .then(res => {
          getSongUrl(this.List[0].id).then(res => {
            this.$store.dispatch('saveSongUrl', res.data.data[0].url)
          })
          // 更新播放状态
          this.$store.dispatch('changePlayState', true)
          // console.log(Song)
          // 提交vuex保存当前歌曲详情
          this.$store.dispatch('saveSongDetail', this.List[0])
          // console.log(Song)
          this.$store.dispatch('addAllSong', this.List)
        })
        .catch(() => {
          this.$toast('暂时无法播放，换首试试')
          this.$store.dispatch('deleteSong', this.List[0].id)
        })
      // 打开歌曲详情页
      this.$store.dispatch('showSongDetail')
    }
  }
}
</script>

<style lang="less" scoped>
.text {
  margin-left: 0.1333rem;
}
</style>
