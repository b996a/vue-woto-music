<template>
  <div>
    <div class="back">
      <van-icon name="arrow-left" @click="back" />
    </div>
    <van-image width="100%" :src="Songer.cover" />
    <div class="card">
      <h3 class="card-h3">{{Songer.name}}</h3>
      <p class="card-p" v-if="identify.imageDesc">{{identify.imageDesc}}</p>
      <p class="card-p" v-else>暂无介绍</p>
    </div>
    <div class="bd" :class="playingList.length>0?'main':''">
      <van-tabs v-model="activeName" @change="saveAct">
        <van-tab title="主页" name="home">
          <div class="home">
            <h3>艺人百科</h3>
            <p class="home-p">艺人名：{{Songer.name}}</p>
            <p class="home-p" v-if="identify.imageDesc">身份：{{identify.imageDesc}}</p>
            <p class="home-p" v-else>身份：暂无介绍</p>
            <p class="home-p">歌手简介：{{Songer.briefDesc}}</p>
          </div>
        </van-tab>
        <van-tab title="歌曲" name="song">
          <p class="title">热门50首歌曲</p>
          <song-item :list='this.HotSong' :paixu='1'></song-item>
          <van-empty description="暂无歌曲" v-if="!HotSong.length>0" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { getSonger, getSongerHot } from '@/api/Songer.js'
import { mapGetters } from 'vuex'
export default {
  created() {
    this.getSongers()
    this.getSongerHots()
    this.activeName = sessionStorage.getItem('SongerDetails')
  },
  data() {
    return {
      // 歌手详情数据
      Songer: {},
      identify: {},
      // 歌手热门五十首歌曲
      HotSong: [],
      // 歌手id
      id: this.$route.query.id,
      show: this.$route.query.show,
      activeName: ''
    }
  },
  computed: { ...mapGetters(['playingList']) },
  methods: {
    back() {
      if (this.show) {
        this.$store.dispatch('showSongDetail')
      }
      this.$router.back()
    },
    getSongers() {
      getSonger(this.id).then(res => {
        this.Songer = res.data.data.artist
        this.identify = res.data.data.identify
        if (!this.identify) {
          this.identify = []
        }
        // console.log(this.Songer, this.identify)
      })
    },
    getSongerHots() {
      getSongerHot(this.id).then(res => {
        this.HotSong = res.data.songs
        // console.log(this.HotSong)
      })
    },
    saveAct() {
      // console.log(this.activeName)
      sessionStorage.setItem('SongerDetails', this.activeName)
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  padding-bottom: 1.7333rem;
}
.back {
  position: absolute;
  top: 0.48rem;
  left: 0.48rem;
  z-index: 50;
  color: rgb(102, 102, 102);
  font-weight: 700;
  font-size: 24px;
}
.card {
  position: absolute;
  top: 7.4667rem;
  left: 0.8rem;
  height: 2.6667rem;
  width: 8.5333rem;
  text-align: center;
  overflow: hidden;
  border-radius: 0.4rem;
  background-color: rgba(238, 238, 238, 0.545);
  opacity: 1;
  z-index: 10;
  .card-h3 {
    font-size: 0.48rem;
    margin: 0.2667rem 0 0.4rem 0;
  }
  .card-p {
    font-size: 0.3733rem;
  }
}
.bd {
  margin-top: 2.1333rem;
  width: 100%;
  .home {
    margin: 0 0.2667rem;
    background-color: #eee;
    border-radius: 0.4rem;
    border: 1px solid #eee;
    overflow: hidden;
    h3 {
      font-size: 0.48rem;
      font-weight: 700;
      margin: 0.2667rem 0 0.4rem 0.2667rem;
    }
    .home-p {
      padding: 0 0.2667rem 0.2667rem 0.2667rem;
      font-size: 0.3733rem;
    }
  }
}
.title {
  position: relative;
  padding: 0.266667rem 0.24rem;
  margin: 0 0 0.24rem 0;
  background-color: #eee;
  color: #333;
  font-size: 0.4rem;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -0.24rem;
    height: 0.4267rem;
    width: 0.0533rem;
    background-color: #d33a31;
  }
}
</style>
