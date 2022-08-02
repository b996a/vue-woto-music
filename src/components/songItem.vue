<template>
  <div>
    <van-cell-group class="paly-list" v-for="(item,index) in list " :key="index" @click="PlayMusic(item)">
      <div class="number_list" v-if="paixu===1">
        <span v-if="index<3" style="color:red;">0{{index+1}}</span>
        <span v-else-if="index<9&&index>=3">0{{index+1}}</span>
        <span v-else>{{index+1}}</span>
      </div>
      <div class="cell">
        <h3 class="cell-h3">{{item.name}}</h3>
        <p class="cell-p">{{getAuthor[index]}}</p>
      </div>
      <span class="paly-icon">
        <van-icon name="more-o" @click.stop="showPopup(item.id,index) " />
      </span>
    </van-cell-group>
    <van-popup v-model="show" round position="bottom" v-for="item in SongList" :key="item.id">
      <div class="header">
        <div class="details">
          <div class="left-detail">
            <img :src="item.al.picUrl" class="img" v-lazy='item.al.picUrl'>
          </div>
          <div class="right-detail">
            <p class="song" v-if="item.alia[0]">歌曲：{{item.name}}-{{item.alia[0]}}</p>
            <p class="song" v-else>歌曲：{{item.name}}</p>
            <p class="author">{{SongAuthor}}</p>
          </div>
        </div>
      </div>
      <div class="bd">
        <ul>
          <li @click="nextplay(item)">
            <van-icon name="play-circle-o" />
            <p>下一首播放</p>
          </li>
          <li @click="onComment(item.id)  ">
            <van-icon name="comment-o" />
            <p>评论</p>
          </li>
          <li @click="isAuthorNum(item.ar[0].id) ">
            <van-icon name="contact" />
            <p class="Songer">歌手：{{SongAuthor}}</p>
          </li>
          <li v-if="clearBtn" @click="clearItem(item.id) ">
            <van-icon name="close" />
            <p>清除播放记录</p>
          </li>
        </ul>
      </div>
    </van-popup>
    <div v-if="authorShow">
      <div class="bgc" @click="closeAuthorList"></div>
      <div class="authorList">
        <p class="authorList-p">请选择要查看的歌手</p>
        <p class="authorList-author" v-for="item in Song.ar" :key="item.id" @click="onSonger(item.id)">{{item.name}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSongById, checkMusic, getSongUrl } from '@/api/paly.js'
import { author } from '@/common/author.js'
export default {
  name: 'songItem',
  props: {
    list: Array,
    paixu: Number,
    noplayall: Boolean,
    clearBtn: Boolean
  },
  data() {
    return {
      show: false,
      // 歌曲详情
      SongList: [],
      Song: {},
      SongAuthor: '',
      authorShow: false
    }
  },
  watch: {
    authorShow(newAuthorShow) {
      if (newAuthorShow) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    }
  },
  computed: {
    ...mapGetters(['nowSongDetail']),
    getAuthor() {
      return author(this.list)
    }
  },
  methods: {
    nextplay(song) {
      this.show = false
      if (this.nowSongDetail.id === song.id) return
      this.$toast('已添加到下一首播放')
      this.$store.dispatch('addPlayinglist', song)
    },
    // 路由导向评论页面
    onComment(id) {
      this.show = false
      this.$nextTick(() => {
        this.$router.push({
          path: '/comment',
          query: {
            id
          }
        })
      })
    },
    isAuthorNum(id) {
      this.show = false
      if (this.Song.ar.length > 1) {
        this.authorShow = true
      } else {
        this.onSonger(id)
      }
    },
    closeAuthorList() {
      this.authorShow = false
    },
    // 路由导向歌手页面
    onSonger(id) {
      this.authorShow = false
      this.$nextTick(() => {
        this.$router.push({
          path: '/songer',
          query: {
            id: id
          }
        })
      })
    },
    clearItem(id) {
      this.show = false
      this.$store.dispatch('deleteHistory', id)
    },
    // 获取歌曲详情
    getSongByIds(id) {
      getSongById(id).then(res => {
        this.SongList = res.data.songs
        this.Song = res.data.songs[0]
        // console.log(this.SongList)
        // console.log(this.Song)
      })
    },
    showPopup(id, index) {
      this.getSongByIds(id)
      // console.log(this.getAuthor)
      this.SongAuthor = this.getAuthor[index]
      setTimeout(() => {
        this.show = true
      }, 150)
    },
    PlayMusic(Song) {
      checkMusic(Song.id)
        .then(res => {
          getSongUrl(Song.id).then(res => {
            this.$store.dispatch('saveSongUrl', res.data.data[0].url)
          })
          // 更新播放状态
          this.$store.dispatch('changePlayState', true)
          // console.log(Song)
          // 提交vuex保存当前歌曲详情
          this.$store.dispatch('saveSongDetail', Song)
          // console.log(Song)
          if (!this.noplayall) {
            this.$store.dispatch('addAllSong', this.list)
          } else {
            this.$store.dispatch('addPlayinglist', Song)
          }
        })
        .catch(() => {
          this.$toast('暂时无法播放，换首试试')
          this.$store.dispatch('deleteSong', Song.id)
        })
      // 打开歌曲详情页
      this.$store.dispatch('showSongDetail')
    }
  }
}
</script>

<style lang="less" scoped>
.bgc {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2001;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}
.authorList {
  position: fixed;
  top: 35%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  border-radius: 0.2667rem;
  z-index: 2002;
  background-color: #eee;
  padding: 0.4rem;
  box-sizing: border-box;
  .authorList-p {
    color: #666;
    font-size: 0.5333rem;
    margin-bottom: 0.4rem;
  }
  .authorList-author {
    color: #333;
    font-size: 0.4267rem;
    padding: 0.2667rem;
    height: 1.0667rem;
    line-height: 1.0667rem;
  }
}
.paly-list {
  position: relative;
  display: flex;
  padding-left: 0.2667rem;
  height: 1.6rem;
  .number_list {
    font-size: 0.4533rem;
    line-height: 0.4533rem;
    align-self: center;
    padding-right: 0.2667rem;
  }
  .cell {
    .cell-h3 {
      color: #444;
      width: 8rem;
      font-size: 0.4267rem;
      margin-top: 0.2667rem;
      margin-bottom: 0.1333rem;
      // 省略超出的字数
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .cell-p {
      color: #444;
      width: 8rem;
      font-size: 0.3467rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .paly-icon {
    position: absolute;
    top: 0.4rem;
    right: 0.3467rem;
    color: #aaaaaa;
    font-size: 0.64rem;
    align-self: center;
  }
}
.header {
  position: relative;
  overflow: hidden;
  padding: 0.5333rem 0.2667rem 0.8rem 0.4rem;
  border-bottom: 1px solid #ddd;
}
.details {
  height: 1.7067rem;
  display: flex;
  .left-detail {
    width: 1.7067rem;
    height: 1.7067rem;
    border-radius: 0.2133rem;
    border: 1px solid #eee;
    overflow: hidden;
    .img {
      width: 1.7067rem;
      height: 1.7067rem;
    }
  }
  .right-detail {
    color: #333;
    margin-left: 0.4rem;
    .song {
      font-size: 0.4267rem;
    }
    .author {
      margin-top: 0.1333rem;
      font-size: 0.32rem;
      color: #666;
    }
  }
}
.bd {
  li {
    display: flex;
    height: 1.3333rem;
    line-height: 1.3333rem;
    padding-left: 0.4rem;
    border-bottom: 1px solid #ddd;
    p {
      padding-left: 0.2667rem;
      font-size: 0.4267rem;
      width: 90%;
    }
    .van-icon {
      font-size: 24px;
      line-height: 1.3333rem;
    }
    .Songer {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.like {
  color: rgb(227, 89, 89);
}
</style>
