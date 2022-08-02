<template>
  <transition>
    <div class="playlist" v-if="isShowPlaylist">
      <div class="bgc" @click="closePlaylist"></div>
      <div class="main">
        <div class="bd">
          <header>
            <div class="line">
              <div class="header-left" @click="changePlayModel">
                <i v-if="this.playModel===1" class="iconfont header-icon icon-suijisenlin"></i>
                <i v-if="this.playModel===2" class="iconfont header-icon icon-refresh"></i>
                <i v-if="this.playModel===0" class="iconfont header-icon icon-dianshunxu fz"></i>
                <p class="header-p">{{playModelText}}</p>
              </div>
              <div class="header-right">
                <van-icon name="delete-o" @click="clearAll" />
              </div>
            </div>
          </header>
          <div class="body">
            <ul v-if="playingList.length>0" ref="listRef" :style='`height:${uiHeight}px;`'>
              <li class="list" v-for="(item,index) in playingList" :key="item.id" @click="getSongUrlBy(item)">
                <div class="list-p" :class="item.id===nowSongDetail.id?'color':''">
                  <div class="play-icon" v-if="item.id===nowSongDetail.id">
                    <van-icon name="play-circle-o" size=".5333rem" class="list-icon" />
                  </div>
                  <p class="list-p-detail">
                    <span>{{item.name}}</span>
                    <span class="author">&nbsp;-&nbsp;{{getAuthor[index]}}</span>
                  </p>
                </div>
                <div class="cross-icon">
                  <van-icon name="cross" size=".6933rem" @click.stop="clearItem(item.id) " />
                </div>
              </li>
            </ul>
            <van-empty description="请添加歌曲到播放列表" v-if="!playingList.length>0" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { checkMusic, getSongUrl } from '@/api/paly.js'
import { mapGetters } from 'vuex'
import { author } from '@/common/author.js'
export default {
  data() {
    return {
      uiHeight: 0,
      itemHeight: 0
    }
  },
  mounted() {
    // 拿到整个屏幕的高度
    const scrHeight = document.documentElement.clientHeight
    // 算出ui的高度
    this.uiHeight = scrHeight * 0.592 - 50
  },
  watch: {
    // 监听播放列表的打开
    isShowPlaylist(newshow) {
      // 如果播放列表处于打开的状态，改变位置
      if (newshow) {
        document.body.style.overflow = 'hidden'
        this.goTo()
        // console.log(this.playModel)
        // console.log(this.index)
      } else {
        document.body.style.overflow = 'auto'
      }
    }
  },
  computed: {
    ...mapGetters(['playingList', 'nowSongDetail', 'isPlaying', 'playModel', 'isShowPlaylist', 'isShowSongDetail']),
    playModelText() {
      return this.playModel === 2 ? '循环播放' : this.playModel === 1 ? '随机播放' : '顺序播放'
    },
    getAuthor() {
      return author(this.playingList)
    }
  },
  methods: {
    closePlaylist() {
      this.$store.dispatch('showPlaylist')
    },
    goTo() {
      const index = this.playingList.findIndex(item => {
        return item.id === this.nowSongDetail.id
      })
      // console.log(index)
      this.$nextTick(() => {
        const itemHeight = this.$refs.listRef.firstChild.offsetHeight
        // console.log(this.$refs)
        // console.log(this.itemHeight)
        this.$refs.listRef.scrollTop = itemHeight * index
      })
    },
    // 切换听歌模式
    changePlayModel() {
      const model = (this.playModel + 1) % 3
      this.$store.dispatch('saveIsLoop', false)
      this.$store.dispatch('savePlayModel', model)
    },
    clearAll() {
      this.$dialog
        .confirm({
          title: '清除全部',
          message: '确定清空播放列表'
        })
        .then(() => {
          this.$store.dispatch('changePlayState', false)
          this.$store.dispatch('deleteAll')
          this.$store.dispatch('showPlaylist')
          if (this.isShowSongDetail === true) {
            this.$store.dispatch('showSongDetail')
            this.$store.dispatch('saveSongUrl', null)
          }
          // console.log(this.playingList)
        })
        .catch(() => {
          this.$toast('已取消清空')
        })
    },
    clearItem(id) {
      if (id === this.nowSongDetail.id) {
        this.$toast('该歌曲正在播放，不能删除')
        return
      }
      this.$store.dispatch('deleteSong', id)
    },
    // 获取歌曲url
    getSongUrlBy(song) {
      // 先检查歌曲是否可用
      checkMusic(song.id)
        .then(res => {
          getSongUrl(song.id).then(res => {
            this.$store.dispatch('saveSongUrl', res.data.data[0].url)
            // 提交vuex保存当前歌曲详情
            this.$store.dispatch('saveSongDetail', song)
            if (!this.isPlaying) {
              this.$store.dispatch('changePlayState', true)
            }
          })
        })
        .catch(() => {
          // 删除播放列表不能播放的当前歌曲
          this.$store.dispatch('deleteSong', song.id)
          this.orderPlay(1)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.playlist {
  .bgc {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2001;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
  }
  .main {
    position: fixed;
    bottom: 3%;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    height: 59.2%;
    z-index: 2002;
    border-radius: 0.4rem;
    overflow: hidden;
    background-color: #fff;
    .bd {
      padding: 0 0.2667rem;
      header {
        position: fixed;
        padding: 0.4rem 0 0.1333rem 0;
        width: 8.4667rem;
        height: 0.8rem;
        z-index: 100;
        background-color: #fff;
        color: #333;
        .header-left {
          display: flex;
          width: 3.4667rem;
          height: 0.8rem;
          line-height: 0.8rem;
          .header-icon {
            font-size: 0.6933rem;
          }
          .header-p {
            font-size: 0.48rem;
          }
        }
        .header-right {
          position: absolute;
          top: 0.4rem;
          right: 0;
          font-size: 0.6933rem;
        }
      }
      .body {
        ul {
          padding-top: 1.3333rem;
          width: 100%;
          // 滚动条
          overflow: auto;
          text-align: center;
          .list {
            display: flex;
            position: relative;
            padding: 0.32rem 0;
            height: 0.64rem;
            line-height: 0.64rem;
            border-top: 1px solid #eee;
            .list-p {
              text-align: left;
              margin-left: 0.1333rem;
              padding-left: 0.5333rem;
              font-size: 0.4267rem;
              color: #333;
              .list-p-detail {
                width: 6.7667rem;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                .author {
                  font-size: 0.32rem;
                  color: #666;
                }
              }
              .play-icon {
                position: absolute;
                top: 0.32rem;
                left: 0;
                color: #dd001b;
                width: 0.64rem;
                height: 0.64rem;
                .list-icon {
                  position: absolute;
                  top: 0.0533rem;
                  left: 0;
                }
              }
            }
            .color {
              color: #dd001b;
            }
            .cross-icon {
              position: absolute;
              top: 0.2667rem;
              right: 0;
              color: #ccc;
              font-size: 0.6667rem;
            }
          }
          &:last-child {
            border-bottom: 1px solid #eee;
          }
          // 修改滚动条样式
          &::-webkit-scrollbar {
            width: 0px;
            height: 0px;
          }
          // 滑块部分
          // &::-webkit-scrollbar-thumb {
          //   background-color: #eee;
          // }
          // 轨道部分
          // &::-webkit-scrollbar-track {
          //   background-color: rgba(255, 255, 255, 0.1);
          // }
        }
      }
    }
  }
}
.v-enter,
.v-leave-to {
  .main {
    opacity: 0;
    transform: translate3d(-50%, 100%, 0);
  }
}
/* v-enter-active 【入场动画的时间段】 */
/* v-leave-active 【离场动画的时间段】 */
.v-enter-active,
.v-leave-active {
  transition: all 0.4s;
  .main {
    transition: all 0.4s cubic-bezier(0.45, 0, 0.55, 1);
  }
}
</style>
