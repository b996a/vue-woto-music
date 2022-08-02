<template>
  <div>
    <van-nav-bar :title="name" left-arrow @click-left="$router.back() " fixed />
    <div class="header">
      <div class="bgc" :style="`background-image: url(${
        picUrl
      }`"></div>
      <div class="details">
        <div class="left-detail">
          <van-image width="3.36rem" height="3.36rem" :src="picUrl" v-lazy='picUrl' />
          <p class="playcount">
            <van-icon name="service-o" />
            {{playCount|formatNum}}
          </p>
        </div>
        <div class="right-detail">
          <p class="van-multi-ellipsis--l3">{{description}}</p>
          <div class="palyall">
            <paly-all :List='this.List'></paly-all>
          </div>
        </div>
      </div>
    </div>
    <p class="title">歌曲列表</p>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <song-item :list='this.List' :paixu='1'></song-item>
    </van-list>
  </div>
</template>

<script>
import { getListSongs } from '@/api/Ranking.js'
export default {
  name: 'RinkDetails',
  created() {
    this.getIdLists()
  },
  data() {
    return {
      // 歌单id
      id: this.$route.query.id,
      // 歌单名字
      name: this.$route.query.name,
      // 图片
      picUrl: this.$route.query.picUrl,
      // 播放次数
      playCount: this.$route.query.playCount,
      // 简介
      description: this.$route.query.description,
      limit: 50,
      offset: 1,
      List: [],
      // 加载更多的控制
      loading: true,
      // 所以数据是否加载完毕
      finished: false
    }
  },
  methods: {
    // 拿到歌单里的歌曲
    getIdLists() {
      getListSongs(this.id, this.limit, this.offset).then(res => {
        // this.List = res.data.songs
        this.List = [...this.List, ...res.data.songs]
        this.loading = false
        if (res.data.songs.length === 0) {
          this.finished = true
        }
        // console.log(this.List)
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
.palyall {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
}
.bgc {
  background-color: #161824;
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  transform: scale(1.5);
  transform-origin: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  // height: 100%;
  height: 4.96rem;
  overflow: hidden;
  z-index: -1;
  opacity: 1;
  filter: blur(20px); /*模糊背景 */
  &::after {
    /*纯白色的图片做背景, 歌词白色看不到了, 在背景前加入一个黑色半透明蒙层解决 */
    content: ' ';
    background: rgba(0, 0, 0, 0.15);
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
}
.header {
  position: relative;
  overflow: hidden;
  margin-top: 1.2267rem;
  padding: 0.8rem 0.2667rem 0.8rem 0.4rem;
  &::after {
    position: absolute;
    content: '';
    background-color: rgba(59, 57, 57, 0.25);
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
  }
}
.details {
  width: 9.3333rem;
  height: 3.36rem;
  display: flex;
  .left-detail {
    position: relative;
    width: 3.36rem;
    .playcount {
      position: absolute;
      right: 2px;
      top: 0;
      z-index: 3;
      padding-left: 15px;
      color: #fff;
      font-size: 12px;
      background-position: 0;
      background-repeat: no-repeat;
      background-size: 11px 10px;
      text-shadow: 1px 0 0 rgb(0 0 0 / 15%);
    }
  }
  .right-detail {
    position: relative;
    color: rgb(222, 222, 222);
    font-size: 0.4533rem;
    width: 5.5467rem;
    margin-left: 0.4267rem;
  }
}
.title {
  padding: 0.266667rem 0.24rem;
  margin: 0 0 0.24rem 0;
  background-color: #eee;
  color: #333;
  font-size: 15px;
}
</style>
