<template>
  <div>
    <van-nav-bar title="精品歌单" left-arrow @click-left="$router.back()" fixed border />
    <div class="warp">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div class="body">
          <div class="row">
            <div v-for="(item,i) in boList" :key="i" @click="goSongListDetail(item.id,item.name,item.coverImgUrl,item.playCount,item.highQuality)" class="col">
              <div class="img-box">
                <img :src="item.coverImgUrl" v-lazy='item.coverImgUrl' class="img">
                <div class="icon-box">
                  <i class="iconfont icon-icon_xiaohuangguan-copy icon"></i>
                </div>
                <p class="playcount">
                  <van-icon name="service-o" />
                  {{item.playCount|formatNum}}
                </p>
              </div>
              <p class="song_name">{{ item.name }}</p>
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { getBoutiqueList } from '@/api/Home.js'
export default {
  name: 'boutiqueList',
  created() {
    this.getBoutiqueLists()
  },
  data() {
    return {
      // 歌单数组
      boList: [],
      limit: 21,
      // 最后一个歌单的updatetime
      before: '',
      // 加载更多的控制
      loading: true,
      // 所以数据是否加载完毕
      finished: false
    }
  },
  methods: {
    goSongListDetail(id, name, picUrl, playCount, highQuality) {
      this.$router.push({
        path: '/songlist',
        query: {
          id: id,
          name: name,
          picUrl: picUrl,
          playCount: playCount,
          highQuality: highQuality
        }
      })
    },
    getBoutiqueLists() {
      getBoutiqueList(this.limit, this.before).then(res => {
        this.boList = [...this.boList, ...res.data.playlists]
        this.before = this.boList[this.boList.length - 1].updateTime
        this.loading = false
        if (res.data.playlists.length === 0) {
          this.finished = true
        }
        // console.log(this.boList)
      })
    },
    onLoad() {
      this.offset++
      this.getBoutiqueLists()
    }
  }
}
</script>

<style lang="less" scoped>
.warp {
  padding-top: 1.2267rem;
}
/* 推荐歌单 - 歌名 */
.song_name {
  font-size: 0.346667rem;
  padding: 0 0.08rem;
  margin-bottom: 0.266667rem;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
  -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
  -webkit-line-clamp: 2; /** 显示的行数 **/
  overflow: hidden; /** 隐藏超出的内容 **/
}
.body {
  margin: 0 0.2667rem;
  box-sizing: border-box;
}
.row {
  display: flex;
  flex-wrap: wrap;
}
.col {
  flex: 30%;
  margin-right: 0.1333rem;
  box-sizing: border-box;
  &:nth-child(3n) {
    margin-right: 0;
  }
  .img-box {
    position: relative;
    width: 100%;
    height: 3rem;
    border-radius: 0.2667rem;
    overflow: hidden;
    .img {
      width: 100%;
      height: 100%;
    }
    .icon-box {
      position: absolute;
      top: -1.0667rem;
      left: -1.0667rem;
      width: 1.7067rem;
      height: 1.7067rem;
      border-radius: 80%;
      background-color: rgb(235, 203, 21);
      .icon {
        position: absolute;
        bottom: 0.16rem;
        right: 0.16rem;
        font-size: 0.5333rem;
        color: #fff;
      }
    }
  }
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
</style>
