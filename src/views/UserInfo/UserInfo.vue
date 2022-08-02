<template>
  <div class="main" :class="playingList.length>0?'main-bottem':''">
    <div class="bgc">
      <img :src="userInfo.backgroundUrl" class="bgc-img">
    </div>
    <div class="back">
      <van-icon name="arrow-left" size="24px" color="#999" @click="$router.back()" />
    </div>
    <div class="header" v-if="userInfo">
      <div class="header-box-img">
        <img :src="userInfo.avatarUrl" class="header-img">
      </div>
      <div class="header-name">{{userInfo.nickname}}</div>
      <div class="header-detail">
        <span class="header-p">{{userInfo.follows}} 关注</span>
        <span class="header-p">{{userInfo.followeds}} 粉丝</span>
        <span class="header-p">Lv.{{level}}</span>
      </div>
    </div>
    <div class="myLike" v-if="myLikePlaylist" @click="goSongListDetail(myLikePlaylist.id,myLikePlaylist.name,myLikePlaylist.coverImgUrl,myLikePlaylist.playCount,myLikePlaylist.highQuality)">
      <div class="myLike-box">
        <img :src="myLikePlaylist.coverImgUrl" class="myLike-img">
      </div>
      <div class="myLike-detail">
        <h3 class="myLike-h3">我喜欢的音乐</h3>
        <p class="myLike-p">{{myLikePlaylist.trackCount}}首</p>
      </div>
    </div>
    <div class="song-detail-tap">
      <van-tabs v-model="active" background='rgba(255, 255, 255, 0)' line-width='60px'>
        <van-tab v-for="index in tapList" :title='index.text' :key="index.id">
        </van-tab>
      </van-tabs>
    </div>
    <div class="song-detail" v-if="active===0">
      <div class="song-detail-header">
        创建歌单({{userCreatePlaylist.length}}个)
      </div>
      <div class="song-detail-body">
        <div v-for="(item,i) in userCreatePlaylist" :key="i">
          <div class="recommend-list" @click="goSongListDetail(item.id,item.name,item.coverImgUrl,item.playCount,item.highQuality) ">
            <div class="recommend">
              <div class="rec-pic">
                <img :src="item.coverImgUrl" alt="" class="pic" v-lazy='item.coverImgUrl'>
              </div>
              <div class="rec-p">
                <h3 class="hd">{{item.name}}</h3>
                <p class="rec-pp">{{item.trackCount}}首歌</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="song-detail" v-if="active===1">
      <div class="song-detail-header">
        收藏歌单({{userCollectPlaylist.length}}个)
      </div>
      <div class="song-detail-body">
        <div v-for="(item,i) in userCollectPlaylist" :key="i">
          <div class="recommend-list" @click="goSongListDetail(item.id,item.name,item.coverImgUrl,item.playCount,item.highQuality) ">
            <div class="recommend">
              <div class="rec-pic">
                <img :src="item.coverImgUrl" class="pic" v-lazy='item.coverImgUrl'>
              </div>
              <div class="rec-p">
                <h3 class="hd">{{item.name}}</h3>
                <p class="rec-pp">{{item.trackCount}}首歌</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btn">
      <p @click="signOut">退出登录</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAccount, getUserDetail, getUserSonglist } from '@/api/user.js'
export default {
  name: 'userInfo',
  created() {
    getAccount().then(res => {
      this.$nextTick(() => {
        const id = res.data.account.id
        this.id = id
        // console.log(res.data)
        this.getUserDetails(id)
        this.getUserSonglists(id)
      })
    })
  },
  data() {
    return {
      active: 0,
      tapList: [
        { id: 1, text: '创建歌单', active: 0 },
        { id: 2, text: '收藏歌单', active: 1 }
      ],
      // 账号id
      id: '',
      level: 0,
      // 用户信息
      userInfo: {},
      // 用户的歌单
      userPlaylist: [],
      // 用户喜欢的音乐
      myLikePlaylist: {},
      // 用户创建的歌单
      userCreatePlaylist: [],
      // 用户收藏的歌单
      userCollectPlaylist: []
    }
  },
  // watch: {
  //   id(newId) {
  //     this.getUserDetails(newId)
  //     this.getUserSonglists(newId)
  //   }
  // },
  computed: { ...mapGetters(['playingList']) },
  methods: {
    signOut() {
      this.$dialog
        .confirm({
          title: '退出登录',
          message: '退出后将无法使用一些功能'
        })
        .then(() => {
          this.$toast('退出登录成功')
          // 更新登录状态
          this.$store.dispatch('updateLogin', false)
          // 清空用户信息
          this.$store.dispatch('saveUserInfo', null)
          // 清空历史记录
          this.$store.dispatch('deleteAllHistory')
          // 清空用户喜欢的音乐id列表
          this.$store.dispatch('saveLikeSongIds', [])
          // 清除cookie
          localStorage.setItem('cookie', null)
          this.$router.back()
        })
        .catch(() => {
          this.$toast('已取消')
        })
    },
    // 拿到用户个人信息
    getUserDetails(id) {
      getUserDetail(id).then(res => {
        this.level = res.data.level
        this.userInfo = res.data.profile
        this.$store.dispatch('saveUserInfo', this.userInfo)
        // console.log(this.userInfo)
      })
    },
    // 拿到用户全部歌单
    getUserSonglists(id) {
      getUserSonglist(id).then(res => {
        this.userPlaylist = res.data.playlist
        // console.log(this.userPlaylist)
        this.getPlaylist(id)
        // console.log(this.myLikePlaylist)
        // console.log(this.userCreatePlaylist)
        // console.log(this.userCollectPlaylist)
      })
    },
    // 对歌单进行分类
    getPlaylist(id) {
      this.userPlaylist.forEach((item, index) => {
        if (item.creator.userId === id) {
          this.userCreatePlaylist.push(this.userPlaylist[index])
        } else {
          this.userCollectPlaylist.push(this.userPlaylist[index])
        }
      })
      this.myLikePlaylist = this.userCreatePlaylist[0]
      this.userCreatePlaylist.splice(0, 1)
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
    }
  }
}
</script>
<style lang="less" scoped>
.main-bottem {
  margin-bottom: 1.6rem;
}
.main {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background-color: rgba(255, 255, 255, 0);
  background-color: rgb(246, 246, 246);
  overflow: scroll;
  .back {
    position: absolute;
    top: 0.4rem;
    left: 0.4rem;
  }
  .btn {
    position: absolute;
    top: 0.4rem;
    right: 0.4rem;
    font-size: 0.4267rem;
    color: #d33a31;
  }
  .bgc {
    position: fixed;
    top: 0;
    left: 0;
    .bgc-img {
      width: 100%;
      height: 100%;
    }
  }
  .header {
    position: absolute;
    top: 2.6667rem;
    left: 50%;
    width: 90%;
    height: 3.4667rem;
    border: 1px solid #eee;
    background-color: rgba(255, 255, 255, 0.647);
    border-radius: 0.4rem;
    transform: translateX(-50%);
    .header-box-img {
      position: absolute;
      top: -40%;
      left: 50%;
      transform: translateX(-50%);
      width: 2.6667rem;
      height: 2.6667rem;
      border-radius: 100%;
      overflow: hidden;
      .header-img {
        width: 2.6667rem;
      }
    }
    .header-name {
      position: absolute;
      top: 1.3333rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.5333rem;
      font-weight: 700;
    }
    .header-detail {
      position: absolute;
      top: 2.1333rem;
      left: 50%;
      width: 6.6667rem;
      text-align: center;
      transform: translateX(-50%);
      .header-p {
        position: relative;
        padding: 0 0.32rem;
        font-size: 0.3733rem;
        color: #888;
        &:nth-child(-n + 2) {
          &::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 0.0267rem;
            height: 100%;
            background-color: #eee;
          }
        }
      }
    }
  }
  .myLike {
    position: absolute;
    top: 6.4rem;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    height: 2.6667rem;
    border: 1px solid #eee;
    background-color: rgba(255, 255, 255, 0.647);
    border-radius: 0.4rem;
    .myLike-box {
      position: absolute;
      top: 0.4rem;
      left: 0.4rem;
      width: 1.8667rem;
      height: 1.8667rem;
      overflow: hidden;
      border-radius: 0.4rem;
      border: 1px solid #eee;
      .myLike-img {
        width: 1.8667rem;
      }
    }
    .myLike-detail {
      position: absolute;
      top: 0.4rem;
      left: 2.6667rem;
      .myLike-h3 {
        font-size: 0.48rem;
        color: #333;
        margin: 0.4rem 0 0 0;
      }
      .myLike-p {
        font-size: 0.32rem;
        color: #666;
      }
    }
  }
  .song-detail-tap {
    position: absolute;
    top: 9.3333rem;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
  }
  .song-detail {
    position: absolute;
    top: 10.6667rem;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    border: 1px solid #eee;
    background-color: rgba(255, 255, 255, 0.647);
    border-radius: 0.4rem;
    .song-detail-header {
      color: #888;
      font-size: 0.32rem;
      margin: 0.4rem 0 0 0.4rem;
    }
    .song-detail-body {
      margin: 0.4rem;
      .recommend-list {
        padding: 0.2133rem 0.2667rem;
        .recommend {
          display: flex;
          .rec-pic {
            width: 1.7067rem;
            height: 1.7067rem;
            border-radius: 0.2667rem;
            overflow: hidden;
            margin-right: 0.2667rem;
            .pic {
              width: 100%;
            }
          }
          .rec-p {
            // width: 100%;
            margin-right: 0.2667rem;
            .hd {
              font-size: 0.4267rem;
              color: #333;
              margin: 0.2667rem 0 0.08rem 0;
              width: 5.3333rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .rec-pp {
              font-size: 0.32rem;
              color: #666;
            }
          }
        }
      }
    }
  }
}
</style>
