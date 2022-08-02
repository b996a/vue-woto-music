<template>
  <div v-if="MiniPlayState">
    <transition>
      <div name="mini" v-if="!isShowSongDetail" @click="showNormalPlayer">
        <div class="mini-player" v-if="showMiniPlay">
          <van-swipe style="height: 45px;" duration=300 :show-indicators="false" ref="swipeRef" :initial-swipe="initindex" @change="toggle">
            <van-swipe-item v-for="(item,index) in playingList" :key="index">
              <div class="mini-body">
                <div class="cd-wrapper">
                  <div ref="cdRef" class="cd">
                    <img v-if="item.al" ref="cdImgRef" width="40" height="40" :src="item.al.picUrl" :class='cdCls' v-lazy='item.al.picUrl'>
                    <img v-if="item.picUrl" ref="cdImgRef" width="40" height="40" :src="item.picUrl" :class='cdCls' v-lazy='item.picUrl'>
                  </div>
                </div>
                <div ref="sliderWrapperRef" class="slider-wrapper">
                  <div class="slider-group">
                    <div class="slider-page">
                      <h2 class="name">{{item.name}}</h2>
                      <p class="desc">{{getAuthor[index]}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </van-swipe-item>
          </van-swipe>
          <div class="play">
            <van-circle v-model="currentRate" :stroke-width="50" :rate="100" size="32px" layer-color="#ddd" color="#dd001b" />
            <i v-if="isPlaying" class="icon-pause iconfont icon-zanting_huaban-copy" @click.stop="togglePlay" />
            <i v-if="!isPlaying" class="icon-play iconfont icon-xiaosanjiao" @click.stop="togglePlay" />
          </div>
          <div class="playlist" @click.stop="showPlaylist">
            <i class="iconfont icon-24gl-playlistMusic2 icon-playlist"></i>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { checkMusic, getSongUrl } from '@/api/paly.js'
import { author } from '@/common/author.js'
export default {
  data() {
    return {}
  },
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  // 多个组件监听同一个值，会发生报错，解决办法，只让一个组件监听
  // watch: {
  //   isPlaying(newPlaying) {
  //     if (!newPlaying) {
  //       this.syncTransform(this.$refs.cdRef, this.$refs.cdImgRef)
  //     }
  //     console.log(newPlaying)
  //   }
  // },
  computed: {
    ...mapGetters(['nowSongDetail', 'isShowSongDetail', 'isPlaying', 'playingList', 'MiniPlayState']),
    showMiniPlay() {
      return this.playingList.length > 0
    },
    // 判断图片的旋转
    cdCls() {
      return this.isPlaying ? 'playing' : ''
    },
    currentRate: {
      get() {
        return this.progress * 100
      },
      set(v) {}
    },
    initindex() {
      return this.playingList.findIndex(item => {
        return item.id === this.nowSongDetail.id
      })
    },
    getAuthor() {
      return author(this.playingList)
    }
  },
  methods: {
    showNormalPlayer() {
      // 打开歌曲详情页
      this.$store.dispatch('showSongDetail')
    },
    togglePlay() {
      this.$store.dispatch('changePlayState', !this.isPlaying)
    },
    showPlaylist() {
      this.$store.dispatch('showPlaylist')
    },
    // 拖动切歌
    toggle(index) {
      if (index !== this.initindex) {
        this.getSongUrlBy(this.playingList[index])
      }
    },
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
          this.$toast('该歌曲暂时无法播放，已为你播放下一首')
          this.getSongUrlBy(this.playingList[this.initindex + 1])
        })
    }
    // 同步内外层的角度
    // syncTransform(wrapper, inner) {
    //   // 通过getComputedStyle动态计算外层的旋转角度
    //   const wrappertranform = getComputedStyle(wrapper).transform
    //   // 通过getComputedStyle动态计算内层的旋转角度
    //   const innerTransform = getComputedStyle(inner).transform
    //   // 将内层和外层的角度一起赋值给外层，因为，当内层旋转后，是相对外层的角度进行旋转，当外层有初始角度，此时就要把二者都赋值给外层
    //   wrapper.style.transform = wrappertranform === 'none' ? innerTransform : innerTransform.concat('', wrappertranform)
    // }
  }
}
</script>

<style lang="less" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: -0.0267rem;
  z-index: 180;
  width: 100%;
  height: 1.6rem;
  background: #eee;
  .mini-body {
    display: flex;
    width: 8.3467rem;
  }
  .cd-wrapper {
    flex: 0 0 1.0667rem;
    width: 1.0667rem;
    height: 1.0667rem;
    padding: 0 0.2667rem 0 0.5333rem;
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
      }
      .playing {
        animation: rotate 20s linear infinite;
      }
      @keyframes rotate {
        0% {
          transform: rotate(0);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 0.5333rem;
    overflow: hidden;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .name {
          width: 5.3333rem;
          margin-bottom: 0.0533rem;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 0.4rem;
          color: #333;
        }
        .desc {
          width: 5.3333rem;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 0.32rem;
          color: #888;
        }
      }
    }
  }
  .play {
    position: relative;
    width: 0.8533rem;
    margin: 0 0.2667rem;
    padding-top: 0.08rem;
    .icon-play {
      position: absolute;
      // top: 0.1733rem;
      // left: 0.1467rem;
      top: 20%;
      left: 20%;
      color: #dd001b;
      font-size: 0.6133rem;
    }
    .icon-pause {
      position: absolute;
      // top: 0.1733rem;
      // left: 0.1467rem;
      transform: translateX(-0.0133rem);
      top: 20%;
      left: 19%;
      color: #dd001b;
      font-size: 0.5867rem;
    }
  }
  .playlist {
    width: 30px;
    margin: 0 0.2667rem;
    line-height: 1.3333rem;
    .icon-playlist {
      font-size: 0.7467rem;
      color: #666;
    }
  }
}
.v-enter-active,
.v-leave-active {
  transition: all 0.4s cubic-bezier(0.45, 0, 0.55, 1);
}
.v-enter,
.v-leave-to {
  opacity: 0;
  transform: translate3d(0, 1.6rem, 0);
}
</style>
