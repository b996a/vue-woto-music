<template>
  <div :class="playingList.length>0?'main':''">
    <van-nav-bar left-arrow @click-left="$router.back()" title="播放记录" fixed>
    </van-nav-bar>
    <div class="main-top">
      <p class="title">最近听的音乐
        <van-icon name="delete-o" class="detele-icon" @click="clearAll" />
      </p>
      <song-item :list="historyPlay" :clearBtn="true"></song-item>
      <van-empty description="暂无喜欢的播放记录" v-if="!historyPlay.length>0" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['historyPlay', 'playingList'])
  },
  methods: {
    clearAll() {
      this.$dialog
        .confirm({
          title: '清除全部',
          message: '确定清空播放记录'
        })
        .then(() => {
          this.$store.dispatch('deleteAll')
        })
        .catch(() => {
          this.$toast('已取消清除')
        })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.van-tab {
  width: 2.6667rem;
}
.paly-all {
  margin-top: 1.2267rem;
  height: 1.6rem;
  line-height: 1.6rem;
  text-align: center;
}
.title {
  padding: 0.266667rem 0.24rem;
  margin: 0 0 0.24rem 0;
  background-color: #eee;
  color: #333;
  font-size: 15px;
  position: relative;
  .detele-icon {
    position: absolute;
    top: 0.16rem;
    right: 0.2667rem;
    font-size: 0.7467rem;
    color: #333;
  }
}
.main-top {
  padding-top: 1.2267rem;
}
.main {
  padding-bottom: 1.7333rem;
}
</style>
