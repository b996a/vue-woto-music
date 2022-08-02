<template>
  <div>
    <!-- 轮播图 -->
    <div class="banner">
      <banner></banner>
    </div>
    <!-- grid -->
    <div class="grid">
      <div class="grid-box">
        <div class="grid-item" v-for="item in gridlist" :key="item.id" @click="goTo(item.to,item.isLogin)">
          <div class="grid-icon-box">
            <i class="iconfont grid-icon" :class="item.icon"></i>
          </div>
          <p class="grid-p">{{item.text}}</p>
        </div>
      </div>
    </div>
    <div v-if="isLogin">
      <div class="title">每日推荐歌单</div>
      <div class="grid">
        <div class="grid-list-box" :style="{width:`${3.2*dailyRecList.length}rem`}">
          <div class="grid-list" v-for="item in dailyRecList" :key="item.id" @click="goSongListDetail(item.id,item.name,item.picUrl,item.playcount,false)">
            <div class="img-box">
              <img :src="item.picUrl" v-lazy='item.picUrl' class="img">
              <p class="playcount">
                <van-icon name="service-o" />
                {{item.playcount|formatNum}}
              </p>
            </div>
            <p class="song_name no">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="title">热门歌单
      <div class="toggle" @click="toggle=!toggle">
        <van-icon name="exchange" size="24px" />
      </div>
    </div>
    <div v-if="!toggle">
      <div v-for="(item,i) in recommendList" :key="i">
        <div class="recommend-list" @click="goSongListDetail(item.id,item.name,item.picUrl,item.playCount,item.highQuality) ">
          <div class="recommend">
            <div class="rec-pic">
              <img :src="item.picUrl" alt="" class="pic" v-lazy='item.picUrl'>
            </div>
            <div class="rec-p">
              <h3 class="hd">{{item.name}}</h3>
              <p class="pc">{{item.playCount|formatNum}}播放</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="body" v-if="toggle">
      <div class="row">
        <div v-for="(item,i) in recommendList" :key="i" @click="goSongListDetail(item.id,item.name,item.picUrl,item.playCount,item.highQuality)" class="col">
          <div class="img-box">
            <img :src="item.picUrl" v-lazy='item.picUrl' class="img">
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
  </div>
</template>

<script>
import { getRecommendMusics, getRecommendList } from '@/api/Home.js'
import banner from '@/components/home/H-banner.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'HomePage',
  created() {
    this.getRecommendMusicBy()
    this.getRecommendLists()
  },
  components: { banner },
  data() {
    return {
      // 热门歌单
      recommendList: [],
      // 每日推荐歌单
      dailyRecList: [],
      toggle: true,
      gridlist: [
        { id: 1, icon: 'icon-meirituijian-', text: '每日推荐', to: '/recSongs', isLogin: true },
        { id: 2, icon: 'icon-gedan', text: '精品歌单', to: '/boutiqueList', isLogin: true },
        { id: 3, icon: 'icon-xingebang', text: '最新音乐', to: '/newsongs', isLogin: false },
        { id: 4, icon: 'icon-remen', text: '热门音乐', to: '/rink', isLogin: false },
        { id: 5, icon: 'icon-zuijinbofang', text: '最近播放', to: '/like', isLogin: false }
      ]
    }
  },
  computed: { ...mapGetters(['isLogin']) },
  methods: {
    getRecommendMusicBy() {
      getRecommendMusics(21).then(res => {
        this.recommendList = res.data.result
        // console.log(this.recommendList)
      })
    },
    getRecommendLists() {
      if (!this.isLogin) return
      getRecommendList().then(res => {
        this.dailyRecList = res.data.recommend
        // console.log(this.dailyRecList)
      })
    },
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
    goTo(to, isLogin) {
      if (isLogin) {
        if (this.isLogin) {
          this.$router.push(to)
        } else {
          this.$toast('登录后可以查看')
        }
      } else {
        this.$router.push(to)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.banner {
  padding: 0 0.2667rem;
}
/* 标题 */
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
.no {
  margin-bottom: 0 !important;
}
// grid
.grid {
  width: 9.7333rem;
  overflow: scroll;
  padding-left: 0.2667rem;
  margin: 0.2667rem 0 0.08rem 0;
  .grid-box {
    width: 10.3rem;
    .grid-item {
      position: relative;
      display: inline-block;
      width: 1.6rem;
      height: 2.4rem;
      margin-right: 0.5333rem;
      .grid-icon-box {
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 100%;
        background-color: rgb(255, 241, 241);
        .grid-icon {
          position: absolute;
          top: 0.48rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.64rem;
          color: #d33a31;
        }
      }
      .grid-p {
        position: absolute;
        top: 1.7333rem;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.3733rem;
        width: 1.6rem;
        text-align: center;
        color: #666;
      }
      &:nth-last-child(1) {
        margin-right: 0.1333rem;
      }
    }
  }
  .grid-list-box {
    height: 4.1rem;
    .grid-list {
      display: inline-block;
      vertical-align: top;
      width: 2.9333rem;
      margin-right: 0.2667rem;
      .img-box {
        position: relative;
        width: 100%;
        height: 3rem;
        border-radius: 0.2667rem;
        overflow: hidden;
        .img {
          width: 100%;
          height: 3rem;
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
  }
} // 修改滚动条样式
&::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
// 滑块部分
&::-webkit-scrollbar-thumb {
  background-color: #eee;
}
// 轨道部分
&::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0.1);
}
.toggle {
  position: absolute;
  top: 0.1667rem;
  right: 0.3667rem;
  color: #d33a31;
}
// 热门歌单
.recommend-list {
  padding: 0.2667rem 0.4rem;
  height: 1.6rem;
  border-bottom: 1px solid #eee;
  .recommend {
    display: flex;
    .rec-pic {
      position: relative;
      width: 1.7067rem;
      height: 1.7067rem;
      border-radius: 0.2667rem;
      overflow: hidden;
      .pic {
        width: 100%;
        background-repeat: no-repeat;
      }
    }
    .rec-p {
      position: relative;
      width: 6.9333rem;
      height: 2rem;
      margin-left: 0.4rem;
      margin-right: 0.2667rem;
      .hd {
        font-size: 0.4267rem;
        color: #333;
        margin-right: 0.2667rem;
      }
      .pc {
        position: absolute;
        bottom: 0.4333rem;
        right: -0.38rem;
        font-size: 0.32rem;
        color: #666;
      }
    }
  }
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
</style>>
