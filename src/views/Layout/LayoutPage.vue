<template>
  <div :class="playingList.length>0?'main':''">
    <van-nav-bar title="Music">
      <template #left>
        <img src="./music.png" class="music-icon">
      </template>
      <template #right>
        <van-icon name="manager-o" size="18" @click="toUser" />
      </template>
    </van-nav-bar>
    <div class="tabs">
      <van-tabs line-width="1.3333rem" border title-active-color="#DD001B" background='#eee' v-model="activeName" @change="saveAct">
        <van-tab title="推荐" name="home" replace to="/layout/home"></van-tab>
        <van-tab title="歌手" name="songerlist" replace to="/layout/songerlist"></van-tab>
        <van-tab title="排行" name="rinklist" replace to="/layout/rinklist"></van-tab>
        <van-tab title="搜索" name="search" replace to="/layout/search"></van-tab>
      </van-tabs>
    </div>
    <div>
      <!-- 组件缓存 -->
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <!-- <div class="beianhao" :class="playingList.length>0?'main':''">
      <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=43030302000153" style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"><img src="@/assets/备案图标.png" style="float:left;" />
        <p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">湘公网安备 43030302000153号</p>
      </a>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'LayoutPage',
  created() {
    this.activeName = sessionStorage.getItem('layoutPage')
  },
  data() {
    return {
      activeName: ''
    }
  },
  computed: { ...mapGetters(['playingList', 'isLogin']) },
  methods: {
    toUser() {
      if (this.isLogin) {
        this.$router.push('/user')
      } else {
        this.$toast('登录后可查看')
        this.$router.push('/login')
      }
    },
    saveAct() {
      // console.log(this.activeName)
      sessionStorage.setItem('layoutPage', this.activeName)
    }
  }
}
</script>

<style lang="less" scoped>
.music-icon {
  height: 0.96rem;
}
.tabs {
  position: sticky;
  top: -0.0267rem;
  z-index: 10;
  box-shadow: 0 -1px #ffffff;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}
// .beianhao {
//   height: 1.2rem;
//   width: 100%;
//   text-align: center;
//   line-height: 1.2rem;
//   font-size: 0.32rem;
// }
.main {
  // margin-top: 0.4rem;
  margin-bottom: 1.6rem;
}
</style>
