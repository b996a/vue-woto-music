<template>
  <div class="pic">
    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item,i) in banner " :key="i">
        <img :src="item.pic" style="width:100%;height: 3.8933rem;" v-lazy='item.pic'>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import { getBannerList } from '@/api/Home.js'

export default {
  name: 'H-banner',
  created() {
    this.getBanner()
  },
  data() {
    return {
      banner: []
    }
  },
  methods: {
    getBanner() {
      getBannerList().then(res => {
        this.banner = res.data.banners
        // console.log(this.banner)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.pic {
  border-radius: 0.2667rem;
  overflow: hidden;
  height: 3.8933rem;
  margin-top: 0.2133rem;
}
/deep/.van-swipe__indicator {
  width: 0.2667rem;
  height: 0.08rem;
  border-radius: 20%;
}
</style>
