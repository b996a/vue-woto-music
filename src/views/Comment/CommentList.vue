<template>
  <div>
    <van-nav-bar left-arrow @click-left="back" v-if="name" :title="'正在播放的歌曲：'+nowSongDetail.name">
    </van-nav-bar>
    <van-nav-bar left-arrow @click-left="back1" v-else title="评论">
    </van-nav-bar>
    <van-tabs v-model="activeName" sticky line-width="1.3333rem" border title-active-color="#DD001B" @change="saveAct">
      <van-tab title="精彩评论" name="Hot">
        <p class="title">精彩评论</p>
        <div v-for="(item,i) in HotCommentList " :key="i" class="box">
          <div class="wrap">
            <div class="img_wrap">
              <img :src="item.user.avatarUrl" alt="" v-lazy='item.user.avatarUrl' />
            </div>
            <div class="content_wrap">
              <div class="header_wrap">
                <div class="info_wrap">
                  <p>{{item.user.nickname}}</p>
                  <p>{{item.timeStr}}</p>
                </div>
                <div>
                  {{item.likedCount|formatNum}}
                  <van-icon name="good-job-o" />
                </div>
              </div>
              <div class="footer_wrap">{{item.content}}</div>
            </div>
          </div>
        </div>
        <van-empty description="暂无精彩评论" v-if="!HotCommentList.length>0" />
      </van-tab>
      <van-tab title="最新评论" name="New">
        <p class="title">最新评论</p>
        <van-pull-refresh v-model="isLoading" :disabled="finished" @refresh="onRefresh">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <div v-for="(item,i) in CommentList " :key="i" class="box">
              <div class="wrap">
                <div class="img_wrap">
                  <img :src="item.user.avatarUrl" alt="" v-lazy='item.user.avatarUrl' />
                </div>
                <div class="content_wrap">
                  <div class="header_wrap">
                    <div class="info_wrap">
                      <p>{{item.user.nickname}}</p>
                      <p>{{item.timeStr}}</p>
                    </div>
                    <div>
                      {{item.likedCount|formatNum}}
                      <van-icon name="good-job-o" />
                    </div>
                  </div>
                  <div class="footer_wrap">{{item.content}}</div>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
        <van-empty description="暂无最新评论" v-if="!CommentList.length>0" />
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { getCommentList } from '@/api/Comment.js'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeName: '',
      // 最新评论数据
      CommentList: [],
      // 热门评论数据
      HotCommentList: [],
      // 歌曲id
      id: this.$route.query.id,
      name: this.$route.query.name,
      // 获得的评论数
      limit: 20,
      // 起始评论位置
      // 页码
      page: 1,
      // 加载更多的控制
      loading: true,
      // 所以数据是否加载完毕
      finished: false,
      // 是否正在下拉刷新
      isLoading: false
    }
  },
  created() {
    this.$store.dispatch('saveMiniPlayState', false)
    this.getCommentLists()
    this.activeName = sessionStorage.getItem('CommentName')
  },
  computed: { ...mapGetters(['playingList', 'nowSongDetail']) },
  methods: {
    back() {
      // 打开歌曲详情页
      this.$store.dispatch('showSongDetail')
      this.$store.dispatch('saveMiniPlayState', true)
      this.$router.back()
    },
    back1() {
      this.$store.dispatch('saveMiniPlayState', true)
      this.$router.back()
    },
    saveAct() {
      // console.log(this.activeName)
      sessionStorage.setItem('CommentName', this.activeName)
    },
    // 获取评论数据
    getCommentLists(isRefresh) {
      getCommentList(this.id, this.limit, this.page).then(res => {
        if (this.HotCommentList.length === 0) {
          this.HotCommentList = res.data.hotComments
        }
        // 判断是上拉刷新，还是下拉刷新
        if (isRefresh) {
          // 新数据在上
          this.CommentList = [...res.data.comments, ...this.CommentList]
          this.isloading = false
        } else {
          // 新数据在下
          this.CommentList = [...this.CommentList, ...res.data.comments]
          this.loading = false
        }
        if (res.data.comments.length === 0) {
          this.finished = true
        }
        // console.log(this.CommentList)
        // console.log(this.HotCommentList)
      })
    },
    // 上拉加载的处理函数
    onLoad() {
      this.page++
      this.getCommentLists()
    },
    // 下拉刷新的处理函数
    onRefresh() {
      // 必须设置一个定时器,不然会在加载中卡住
      setTimeout(() => {
        // Toast('刷新成功');
        this.isLoading = false
        // console.log('触发了下拉刷新！')
        // this.CommentList = []
        // 1. 让页码值 +1
        this.page++
        // 2. 重新请求接口获取数据
        this.getCommentLists(true)
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  padding: 0.266667rem 0.24rem;
  margin: 0 0 0 0;
  background-color: #eee;
  color: #333;
  font-size: 15px;
}
.box {
  margin-top: 10px;
}
/*容器样式*/
.wrap {
  display: flex;
}
.img_wrap {
  width: 0.8rem;
  height: 0.8rem;
  margin-right: 0.266667rem;
}
.img_wrap img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  width: 0.8rem;
  height: 0.8rem;
  padding-left: 0.2667rem;
}
.content_wrap {
  flex: 1;
  padding-left: 0.2667rem;
}
/*右侧头部*/
.header_wrap {
  display: flex;
  padding: 0 0.2667rem 0 0;
}
.info_wrap {
  flex: 1;
  margin-bottom: 0.1333rem;
}

.info_wrap p:first-child {
  font-size: 0.373333rem;
  color: #666;
}
.info_wrap p:last-of-type {
  font-size: 0.24rem;
  color: #999;
}
.header_wrap div:last-of-type {
  color: #999;
  font-size: 0.293333rem;
}
/*评论内容*/
.footer_wrap {
  position: relative;
  font-size: 0.4rem;
  line-height: 0.5867rem;
  color: #333;
  padding-bottom: 0.1333rem;
  padding-right: 0.2667rem;
  &::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    height: 0.0267rem;
    width: 100%;
    background-color: #f4f4f4;
  }
}
</style>
