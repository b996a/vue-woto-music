<template>
  <transition>
    <div class="player" v-show="isShowSongDetail">
      <div class="normal-player">
        <div class="background">
          <!-- nowSongDetail.al，当nowSongDetail为空数组时，nowSongDetail.al不会报错，当判断nowSongDetail.al.xxx时，此时是在undefind中取值，会报错，如果需要判断，控制对象的第一层就可以了 -->
          <img v-if="nowSongDetail.al" :src="nowSongDetail.al.picUrl">
          <img v-if="nowSongDetail.picUrl" :src="nowSongDetail.picUrl">
        </div>
        <div class="top">
          <div class="back" @click="closeSongDetail">
            <van-icon name="arrow-down" />
          </div>
          <h1 class="title">{{nowSongDetail.name}}</h1>
          <h2 class="subtitle" @click="nowSongDetail.song?isAuthorNum(nowSongDetail.song.artists[0].id):isAuthorNum(nowSongDetail.ar[0].id)">{{getAuthor[0]}}</h2>
        </div>
        <div class="middle" @click="openlyric">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapperRef" v-show="showLyricPage">
              <div class="cd" ref="cdRef">
                <img v-if="nowSongDetail.al" class="image" ref="cdImgRef" :class="cdCls" :src="nowSongDetail.al.picUrl">
                <img v-if="nowSongDetail.picUrl" class="image" ref="cdImgRef" :class="cdCls" :src="nowSongDetail.picUrl">
              </div>
            </div>
            <!-- <div class="playing-lyric-wrapper" v-show="showLyricPage">
              <div class="playing-lyric">{{ curLyric }}</div>
            </div> -->
            <!-- // lyricIndex为当前歌曲播放的进度在歌词中的位置，进而改变正在播放的歌词的样式 -->
            <ul class="lyric" @touchstart.prevent='onTouchStart' @touchmove.prevent='onTouchMove' @touchend.prevent='onTouchEnd' ref="lyricRef" :style='{height:`${ulHeight}px`,paddingTop:`${ptHeight}px`}' v-show="!showLyricPage">
              <li class="lyric-li" :style="{transform: `translateY(-${scroll}px)`}">
                <p ref="pRef" :class="{each:true, choose: (index===lyricIndex)}" v-for="(item, key, index) in lyric" :key="key">{{item}}</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="bottom">
          <div class="btn" v-show="showLyricPage">
            <van-icon name="like" class="btn-left" v-if="islike" @click="likeNowSongBy" />
            <van-icon name="like-o" class="btn-left1" v-if="!islike" @click="likeNowSongBy" />
            <van-icon name="down" class="btn-center" @click="$toast('该功能暂未开放') " />
            <van-icon name="comment-o" class="btn-right" @click="goComment" />
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{currentTime|formatDuration}}</span>
            <div class="progress-bar-wrapper">
              <progressBar ref="barRef" :progress="progress" @progress-changing="onProgressChanging" @progress-changed='onProgressChanged'></progressBar>
            </div>
            <span v-if="nowSongDetail.song" class="time time-r">{{nowSongDetail.song.duration|formatDuration}}</span>
            <span v-else class="time time-r">{{nowSongDetail.dt|formatDuration}}</span>
          </div>
          <div class="playlist">
            <i v-if="this.playModel===0" class="iconfont icon-dianshunxu" @click="changePlayModel "></i>
            <i v-if="this.playModel===1" class="iconfont icon-suijisenlin" @click="changePlayModel "></i>
            <i v-if="this.playModel===2" class="iconfont icon-refresh" @click="changePlayModel "></i>
            <i class="iconfont icon-shangyishoushangyige" :class="disableCls" @click="toggle(0) "></i>
            <van-icon :name="playIcon" size="40" :class="disableCls" @click="togglePlay" />
            <i class="iconfont icon-xiayigexiayishou" :class="disableCls" @click="toggle(1) "></i>
            <i class="iconfont icon-24gl-playlistMusic2" @click="showPlayList"></i>
          </div>
        </div>
        <!-- <mini-player></mini-player> -->
        <!-- 首次缓存加载好触发canplay事件 -->
        <audio ref="audio" @pause="pause" @canplay='ready' @error="error" @timeupdate="updateTime" @ended="playModel === 2 ? loopPlay() : toggle(1)"></audio>
      </div>
      <van-popup v-model="authorShow" round position="bottom">
        <div class="author-list">
          <h3 class="author-h3">该歌曲有多个歌手</h3>
          <div v-if="nowSongDetail.song">
            <p ref="authorRef" @click="goSongerDetail(item.id)" class="author-p" v-for="item in nowSongDetail.song.artists" :key="item.id">{{item.name}}</p>
          </div>
          <div v-else>
            <p ref="authorRef" @click="goSongerDetail(item.id)" class="author-p" v-for="item in nowSongDetail.ar" :key="item.id">{{item.name}}</p>
          </div>
        </div>
      </van-popup>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { checkMusic, getSongUrl, getLyricById } from '@/api/paly.js'
import { likeNowSong, getLikSongList } from '@/api/user.js'
import { getRandom } from '@/common/getRandom.js'
import progressBar from '@/views/Play/progress-bar.vue'
import { author } from '@/common/author.js'
// import animations from 'create-keyframe-animation'
// const lyricMap = {}
export default {
  name: 'playMusic',
  components: {
    progressBar
  },
  created() {
    if (this.isLogin && this.likeSongIds.length === 0) {
      this.getLikSongListBy()
    }
  },
  data() {
    return {
      songReady: false,
      // 播放时间初始值
      currentTime: 0,
      // 控制拖拽时进度条的增加
      progressChanging: false,
      // 请求返回的歌词对象
      lyric: {},
      // 当前显示哪句歌词
      // curLyric: '',
      // 记录当前播放歌词
      // lastLy: '',
      // 歌词界面显示控制
      showLyricPage: true,
      // 歌词显示索引
      lyricIndex: 0,
      // 当前播放歌曲的索引
      index: 0,
      islike: false,
      authorShow: false,
      // li位移的距离
      scroll: 0,
      ptHeight: 0,
      ulHeight: 0,
      pHeight: 0,
      flag: true,
      flag: true,
      state: {
        startY: 0,
        startScrool: 0
      },
      isScroll: true,
      time: null
    }
  },
  watch: {
    // 监听url的变化，控制音乐的播放
    songUrl(newUrl) {
      if (!newUrl) return
      // 切换歌曲时，将songReady置为false，防止操作过快，引发报错
      // console.log(this.nowSongDetail)
      this.songReady = false
      this.isLikeNowSong()
      this.getLyricByIds()
      this.currentTime = 0
      this.lyricIndex = 0
      // this.curLyric = ''
      this.$refs.audio.src = newUrl
      // this.$refs.lyricRef.scrollTop = 0
      this.$refs.audio.play()
    },
    // 通过isPlaying控制音乐播放
    isPlaying(newPlaying) {
      // 如果songReady为false 不去执行下列代码，防止dom报错
      if (!this.songReady) return
      // console.log(this.progress)
      // console.log(this.currentTime)
      // console.log(this.nowSongDetail.dt / 1000)
      // console.log(newPlaying)
      newPlaying ? this.$refs.audio.play() : this.$refs.audio.pause()
      if (!newPlaying) {
        this.syncTransform(this.$refs.cdRef, this.$refs.cdImgRef)
      }
    },
    showLyricPage(newShow) {
      if (!newShow) {
        this.syncTransform(this.$refs.cdRef, this.$refs.cdImgRef)
      }
    },
    // 监听页面的开关
    async isShowSongDetail(newIsShowSongDetail) {
      if (newIsShowSongDetail) {
        document.body.style.overflow = 'hidden'
        // console.log(this.playModel)
        // 使用nextTick等待dom元素加载完毕后执行后序代码，因为proress-bar计算页面宽度用的dom，如果在页面更新前进行执行，拿不到dom，无法更新进度条
        await this.$nextTick()
        // 通过barRef调用setOffset，将当前的进度传进去，保持进度条的进度
        this.$refs.barRef.setOffset(this.progress)
      } else {
        document.body.style.overflow = 'auto'
      }
    },
    progress(newProgress) {
      this.$emit('progress', newProgress)
    },
    isLoop(newIsLoop) {
      this.$refs.audio.loop = newIsLoop
    }
  },
  computed: {
    ...mapGetters(['nowSongDetail', 'songUrl', 'isShowSongDetail', 'isPlaying', 'playingList', 'likeSongIds', 'curtime', 'playModel', 'isLogin', 'userInfo', 'isLoop']),
    // 通过isPlaying控制图标的显示
    playIcon() {
      return this.isPlaying ? 'pause-circle-o' : 'play-circle-o'
    },
    // 是否禁用
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    // 求时间比，因为dt是毫秒，需要除以1000
    progress() {
      if (this.nowSongDetail.song) {
        return this.currentTime / (this.nowSongDetail.song.duration / 1000)
      } else return this.currentTime / (this.nowSongDetail.dt / 1000)
    },
    // 判断图片的旋转
    cdCls() {
      return this.isPlaying ? 'playing' : ''
    },
    getAuthor() {
      return author([this.nowSongDetail])
    }
  },
  methods: {
    // 发请求拿歌词数据
    getLyricByIds() {
      // if (this.nowSongDetail.lyric) {
      //   return Promise.resolve(this.nowSongDetail.lyric)
      // }
      // // 在当前页面保存歌词map对象，当页面并未销毁，歌词会缓存在页面中，下次重复请求时，不会调用接口
      // const lyric = lyricMap[this.nowSongDetail.id]
      // if (lyric) {
      //   return Promise.resolve(lyric)
      // }
      if (this.nowSongDetail.lyric) {
        this.lyric = this._formatLyr(this.nowSongDetail.lyric)
      } else {
        getLyricById(this.nowSongDetail.id).then(res => {
          this.lyric = res.data.lrc.lyric
          // 向歌曲详情中保存歌词，下次再次调用该歌曲时，不用发送请求，减少性能损耗
          // console.log(this.lyric)
          this.$store.commit('addSongLyric', {
            song: this.nowSongDetail,
            lyric: this.lyric
          })
          // lyricMap[this.nowSongDetail.id] = this.lyric
          // console.log(lyricMap)
          this.lyric = this._formatLyr(this.lyric)
          // 初始化完毕先显示零秒歌词
          // this.curLyric = this.lyric[0]
        })
      }
    },
    // 格式化歌词
    _formatLyr(lyricStr) {
      // 可以看network观察歌词数据是一个大字符串, 进行拆分.
      const reg = /\[.+?\]/g
      // 拿到时间数组
      const timeArr = lyricStr.match(reg) || [] // 匹配所有[]字符串以及里面的一切内容, 返回数组
      // console.log(timeArr)
      // ["[00:00.000]", "[00:01.000]", ......]
      // 拿到歌词数组
      const contentArr = lyricStr.split(/\[.+?\]/).slice(1) || [] // 按照[]拆分歌词字符串, 返回一个数组(下标为0位置元素不要,后面的留下所以截取)
      // const newContentArr = []
      // contentArr.forEach(item => {
      //   const item1 = item.slice(0, item.indexOf('\n'))
      //   newContentArr.push(item1)
      // })
      // console.log(newContentArr)
      let lyricObj = {} // 保存歌词的对象, key是秒, value是显示的歌词
      timeArr.forEach((item, index) => {
        // 拆分[00:00.000]这个格式字符串, 把分钟数字取出, 转换成秒
        // 先把[00分割出来，再通过''分割得到[ 0 0,选择第三个元素*60，得到ms
        const ms = item.split(':')[0].split('')[2] * 60
        // console.log(ms)
        // 拆分[00:00.000]这个格式字符串, 把十位的秒拿出来, 如果是0, 去拿下一位数字, 否则直接用2位的值
        const ss = item.split(':')[1].split('.')[0].split('')[0] === '0' ? item.split(':')[1].split('.')[0].split('')[1] : item.split(':')[1].split('.')[0]
        // console.log(ss)
        // 秒数作为key, 对应歌词作为value一一赋值给lyricObj
        lyricObj[ms + Number(ss)] = contentArr[index]
      })
      // 判断歌词对象长度，防止无歌词导致歌词混乱
      if (Object.keys(lyricObj).length === 0) {
        lyricObj = { 0: '该歌曲暂时没有歌词' }
      }
      // 返回得到的歌词对象(可以打印看看)
      // console.log(lyricObj)
      return lyricObj
    },
    playLyric() {
      let i = 0
      if (this.flag) {
        const pRef = this.$refs.pRef[0]
        // getComputedStyle拿到元素的精确高度px
        const height = window.getComputedStyle(pRef, null).height
        // height转换成浮点数
        const pHeight = parseFloat(height.substring(0, height.indexOf('px')))
        this.pHeight = pHeight
        // 只需要执行一次
        this.flag = false
      }
      // console.log(pHeight)
      // 循环歌词对象
      for (const key in this.lyric) {
        // key表示歌词对象中的时间，如果key等于歌曲进度value，改变当前歌词进度lyricIndex
        // console.log(key)
        if (+key <= this.currentTime) {
          // console.log(key, i)
          this.lyricIndex = i
          // console.log(this.lyricIndex)
          // 当歌词进度大于5，即播放到了第5句歌词，开始滚动
          // if (i > 5) {
          // this.$refs.lyricRef.scrollTop = pHeight * i
          this.scroll = this.pHeight * i
          // }
        }
        i++
      }
    },
    // 控制歌词的显示
    openlyric() {
      this.showLyricPage = !this.showLyricPage
    },
    onTouchStart(e) {
      this.isScroll = false
      this.state.startY = e.touches[0].clientY
      this.state.startScrool = this.scroll
    },
    onTouchMove(e) {
      const startY = this.state.startY
      const startScrool = this.state.startScrool
      const moveY = e.touches[0].clientY
      this.liHeight = Object.keys(this.lyric).length * this.pHeight
      if (this.scroll >= this.liHeight) {
        this.scroll = this.liHeight - 100
      } else if (this.scroll < 0) {
        this.scroll = 0
      } else {
        this.scroll = startScrool + startY - moveY
      }
    },
    onTouchEnd(e) {
      const startScrool = this.state.startScrool
      clearTimeout(this.time)
      this.time = setTimeout(() => {
        this.isScroll = true
      }, 4000)
      if (Math.abs(this.scroll - startScrool) <= 1) {
        clearTimeout(this.time)
        this.isScroll = true
        this.openlyric()
      }
      if (this.scroll >= this.liHeight) {
        this.scroll = this.liHeight - 100
      } else if (this.scroll < 0) {
        this.scroll = 0
      }
    },
    // 关闭音乐详情界面
    closeSongDetail() {
      this.showLyricPage = true
      this.$store.dispatch('showSongDetail')
    },
    // 切换听歌状态
    togglePlay() {
      if (!this.songReady) return
      this.$store.dispatch('changePlayState', !this.isPlaying)
    },
    // 非用户交互改变播放状态时，执行方法，防止数据混乱
    pause() {
      this.$store.dispatch('changePlayState', false)
      // this.$store.dispatch('saveCurTime', this.currentTime)
      // this.songReady = true
    },
    ready() {
      if (this.songReady) return
      this.songReady = true
      // this.playLyric()
    },
    // 当歌曲报错时，解锁disable
    error() {
      this.songReady = true
    },
    // 通过audio自带回调函数，拿到当前播放的秒数
    updateTime(e) {
      // 当拖动进度条时，禁止自动发生变化
      if (!this.progressChanging) {
        // 将curTime赋值出去
        // this.currentTime = e.target.currentTime
        this.currentTime = Math.floor(e.target.currentTime)
      }
      this.playLyric()
      // // 避免空白出现
      // if (this.lyric[this.currentTime]) {
      //   // 将对应时间的歌词赋值出去，实现歌词轮流显示效果
      //   this.curLyric = this.lyric[this.currentTime]
      //   // 保留当前歌词，防止空白出现
      //   this.lastLy = this.curLyric
      // } else {
      //   this.curLyric = this.lastLy
      // }
    },
    // 获取歌曲url
    getSongUrlBy(song) {
      // 先检查歌曲是否可用
      checkMusic(song.id)
        .then(res => {
          getSongUrl(song.id).then(res => {
            // 保存歌曲url
            // console.log(song)
            this.$store.dispatch('saveSongUrl', res.data.data[0].url)
            // 提交vuex保存当前歌曲详情
            this.$store.dispatch('saveSongDetail', song)
            // 播放前把播放状态置为true
            if (!this.isPlaying) {
              this.$store.dispatch('changePlayState', true)
            }
          })
        })
        .catch(() => {
          this.$store.dispatch('deleteSong', song.id)
          this.$toast('当前歌曲暂时无法播放')
          this.orderPlay(1)
        })
    },
    // 切换歌曲，0上一首，1下一首
    toggle(type) {
      if (!this.songReady) return
      // console.log(this.playModel)
      if (this.playingList.length === 0) {
        this.$toast('播放列表没有歌曲')
      } else if (this.playingList.length === 1) {
        this.$toast('播放列表只有一首歌')
      } else {
        // 再根据播放模式判断
        if (this.playModel === 0 || this.playModel === 2) {
          // 顺序播放 type等于0上一曲 否则下一曲
          this.orderPlay(type)
        } else if (this.playModel === 1) {
          // 随机播放
          this.randomPlay()
        } else this.orderPlay(type) // 防止卡死
      }
    },
    // 切换听歌模式
    changePlayModel() {
      const model = (this.playModel + 1) % 3
      // 先关闭循环播放
      this.$store.dispatch('saveIsLoop', false)
      this.$store.dispatch('savePlayModel', model)
    },
    // 顺序播放
    orderPlay(type) {
      const nowIndex = this.playingList.findIndex(item => this.nowSongDetail.id === item.id)
      // console.log(nowIndex)
      let toggleIndex
      // type等于0 是上一曲 否则下一曲
      // 根据当前歌曲索引来判断要切换的歌曲索引
      switch (nowIndex) {
        // 没找到歌曲
        case -1:
          toggleIndex = 0
          break
        // 在第一首时
        case 0:
          toggleIndex = type === 0 ? this.playingList.length - 1 : nowIndex + 1
          break
        // 在最后一首时
        case this.playingList.length - 1:
          toggleIndex = type === 0 ? nowIndex - 1 : 0
          break
        // 默认
        default:
          toggleIndex = type === 0 ? nowIndex - 1 : nowIndex + 1
          break
      }
      // 找到对应歌曲数据
      // console.log(toggleIndex)
      const togglesong = this.playingList[toggleIndex]
      // console.log(togglesong)
      // 获取新的url
      this.getSongUrlBy(togglesong)
    },
    // .2随机模式
    randomPlay() {
      // 获得一个随机索引号
      const randomIndex = getRandom(0, this.playingList.length - 1)
      // 根据随机索引号拿到随机歌曲
      const randomSong = this.playingList[randomIndex]
      // 获取歌曲url
      this.getSongUrlBy(randomSong)
    },
    // .3 单曲循环
    loopPlay() {
      // 把音频标签的loop设为true
      if (!this.isPlaying) {
        this.$store.dispatch('changePlayState', true)
      }
      this.$store.dispatch('saveIsLoop', true)
      this.$refs.audio.play()
    },
    // 喜欢歌曲
    // 获取喜欢的歌曲id列表
    getLikSongListBy() {
      getLikSongList(this.userInfo.userId).then(res => {
        this.$store.dispatch('saveLikeSongIds', res.data.ids)
        this.islike = this.likeSongIds.includes(this.nowSongDetail.id)
      })
    },
    // 判断是否在喜欢的歌曲id列表中
    // 判断用户登录状态和喜欢的歌曲id列表是否为空
    isLikeNowSong() {
      // 没有登录直接为false
      if (!this.isLogin) {
        this.islike = false
      } else if (this.likeSongIds.length !== 0) {
        // 喜欢的音乐id列表不为空直接判断
        this.islike = this.likeSongIds.includes(this.nowSongDetail.id)
      } else {
        // 如果登录了 音乐id列表还为空的话从新获取喜欢的音乐id列表
        this.getLikSongListBy()
      }
    },
    // 点击喜欢按钮的回调
    likeNowSongBy() {
      // 先判断登录状态
      if (!this.$store.state.isLogin) {
        this.$toast('登录后才能收藏')
        return
      }
      const like = !this.islike
      likeNowSong(this.nowSongDetail.id, like).then(res => {
        // 从新获取喜欢的音乐id列表
        this.getLikSongListBy()
        if (like === true) {
          this.$toast('已添加到我喜欢的音乐')
        } else {
          this.$toast('取消喜欢成功')
        }
      })
    },
    // 打开评论界面
    goComment() {
      // 关闭歌曲详情页
      this.$store.dispatch('showSongDetail')
      this.$nextTick(() => {
        this.$router.push({
          path: '/comment',
          query: {
            id: this.nowSongDetail.id,
            name: this.nowSongDetail.name
          }
        })
      })
    },
    isAuthorNum(id) {
      if (this.nowSongDetail.song) {
        if (this.nowSongDetail.song.artists.length > 1) {
          this.authorShow = true
        } else {
          this.goSongerDetail(id)
        }
      } else {
        if (this.nowSongDetail.ar.length > 1) {
          this.authorShow = true
        } else {
          this.goSongerDetail(id)
        }
      }
    },
    goSongerDetail(id) {
      // 关闭歌曲详情页
      this.authorShow = false
      this.$store.dispatch('showSongDetail')
      this.$nextTick(() => {
        this.$router.push({
          path: '/songer',
          query: {
            id: id,
            show: true
          }
        })
      })
    },
    showPlayList() {
      this.$store.dispatch('showPlaylist')
    },
    // 拖拽的移动距离
    onProgressChanging(progress) {
      // progressChanging置为true，防止自增时间影响
      this.progressChanging = true
      if (this.nowSongDetail.song) {
        this.currentTime = (this.nowSongDetail.song.duration / 1000) * progress
      } else {
        this.currentTime = (this.nowSongDetail.dt / 1000) * progress
      }
    },
    // 松手后的移动距离
    onProgressChanged(progress) {
      // 拖拽完毕，将自增打开
      this.progressChanging = false
      // 将歌曲时间改成拖拽的进度条所对应的进度
      if (this.nowSongDetail.song) {
        this.$refs.audio.currentTime = this.currentTime = (this.nowSongDetail.song.duration / 1000) * progress
      } else {
        this.$refs.audio.currentTime = this.currentTime = (this.nowSongDetail.dt / 1000) * progress
      }
      // 拖拽后如果是暂停状态，改成播放状态
      if (!this.isPlaying) {
        this.$store.dispatch('changePlayState', true)
      }
      this.playLyric()
    },
    // 同步内外层的角度
    syncTransform(wrapper, inner) {
      // 通过getComputedStyle动态计算外层的旋转角度
      const wrappertranform = getComputedStyle(wrapper).transform
      // 通过getComputedStyle动态计算内层的旋转角度
      const innerTransform = getComputedStyle(inner).transform
      // 将内层和外层的角度一起赋值给外层，因为，当内层旋转后，是相对外层的角度进行旋转，当外层有初始角度，此时就要把二者都赋值给外层
      wrapper.style.transform = wrappertranform === 'none' ? innerTransform : innerTransform.concat('', wrappertranform)
    }
  },
  mounted() {
    if (this.songUrl) {
      this.$refs.audio.src = this.songUrl
      this.getLyricByIds()
    }
    // 拿到整个屏幕的高度
    // const scrHeight = window.screen.availHeight
    // 浏览器页面可视页面高度
    const scrHeight = document.documentElement.clientHeight
    // console.log(document.documentElement.clientHeight)
    // padding-top的高度
    this.ptHeight = Math.ceil((scrHeight - 245) * 0.4)
    // console.log(ptHeight)
    // 实际ui的高度
    this.ulHeight = scrHeight - 245 - this.ptHeight
  }
}
</script>

<style lang="less" scoped>
.author-list {
  padding: 0.4rem;
  .author-h3 {
    font-size: 0.4267rem;
    padding-bottom: 0.4rem;
    color: #666;
    border-bottom: 1px solid #eee;
  }
  .author-p {
    color: #333;
    font-size: 0.4267rem;
    height: 1.0667rem;
    line-height: 1.0667rem;
    padding: 0.2667rem 0;
  }
}
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: #222;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(0.5333rem);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 0.6667rem;
      .back {
        position: absolute;
        top: 0.4rem;
        left: 0.4rem;
        z-index: 50;
        color: #eee;
        font-size: 0.8rem;
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 1.0667rem;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 0.48rem;
        color: #fff;
      }
      .subtitle {
        margin: 0 2.6667rem;
        line-height: 0.5333rem;
        text-align: center;
        font-size: 0.32rem;
        color: #fff;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 2.1333rem;
      bottom: 5.2667rem;
      // 文本不会换行
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 0.2667rem solid rgba(255, 255, 255, 0.1);
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
        // .playing-lyric-wrapper {
        //   position: absolute;
        //   top: 8.2667rem;
        //   left: 10%;
        //   width: 80%;
        //   overflow: hidden;
        //   text-align: center;
        //   .playing-lyric {
        //     height: 0.5333rem;
        //     line-height: 0.5333rem;
        //     font-size: 0.3733rem;
        //     color: rgba(255, 255, 255, 0.797);
        //     text-overflow: ellipsis;
        //     overflow: hidden;
        //     white-space: nowrap;
        //   }
        // }
        .lyric {
          width: 100%;
          position: absolute;
          top: 0.2667rem;
          left: 0;
          // padding-top: 40%;
          // 滚动条
          overflow: hidden;
          color: rgba(255, 255, 255, 0.797);
          font-size: 0.32rem;
          font-weight: normal;
          text-align: center;
          .lyric-li {
            transition: all 1s cubic-bezier(0.165, 0.84, 0.44, 1);
          }
          .each {
            width: 9.2rem;
            margin: 0 0.4rem;
            height: 1.3333rem;
            line-height: 1.3333rem;
            text-align: center;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            // text-overflow: ellipsis;
            // overflow: hidden;
            // display: -webkit-box;
            // -webkit-box-orient: vertical;
            // -webkit-line-clamp: 2;
          }
          .choose {
            height: 1.3333rem;
            line-height: 1.3333rem;
            font-size: 0.4267rem;
          }
          // 修改滚动条样式
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
        }
      }
    }
    .bottom {
      position: fixed;
      width: 100%;
      bottom: 0;
      padding-bottom: 1rem;
      text-align: center;
      color: #eee;
      .btn {
        height: 0.8rem;
        margin: 0.2667rem 0;
        font-size: 0.8rem;
        .btn-left1 {
          margin-right: 0.5333rem;
        }
        .btn-left {
          color: rgb(227, 89, 89);
          margin-right: 0.5333rem;
        }
        .btn-center {
          margin: 0 0.5333rem;
        }
        .btn-right {
          margin-left: 0.5333rem;
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 0.2667rem 0;
        .time {
          color: #eee;
          font-size: 0.32rem;
          flex: 0 0 1.0667rem;
          line-height: 0.8rem;
          width: 1.0667rem;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .playlist {
        margin: 0.2667rem 0.2667rem;
        display: flex;
        align-items: center;
        i {
          flex: 1;
          font-size: 0.8rem;
        }
      }
    }
  }
}
.v-enter-active,
.v-leave-active {
  transition: all 0.6s;
  .top,
  .bottom,
  .middle-l {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
}
.v-enter {
  .top {
    transform: translate3d(0, -2.6667rem, 0);
  }
  .bottom {
    transform: translate3d(0, 2.6667rem, 0);
  }
  .middle-l {
    transform: translate3d(-4rem, 12rem, 0) scale(0.1) scale(1);
  }
}
.v-leave-to {
  opacity: 0;
  .top {
    transform: translate3d(0, -2.6667rem, 0);
  }
  .bottom {
    transform: translate3d(0, 2.6667rem, 0);
  }
  .middle-l {
    transform: translate3d(-4rem, 12rem, 0) scale(0.1);
  }
}
</style>
