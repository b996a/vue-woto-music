<template>
  <div>
    <!-- 下拉框 -->
    <van-dropdown-menu :overlay='false'>
      <van-dropdown-item v-model="area" :options="option1" />
      <van-dropdown-item v-model="type" :options="option2" />
    </van-dropdown-menu>
    <p class="title">热门歌手</p>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div v-for="(item,i) in songerList" :key="i">
        <div class="list" @click="toSongerDetails(item.id) ">
          <div>
            <img :src="item.picUrl" class="pic" v-lazy='item.picUrl'>
          </div>
          <div class="list-p">
            <h3>{{item.name}}</h3>
            <p class="btn"></p>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import { getSongerList } from '@/api/Songer.js'
export default {
  name: 'SongerList',
  created() {
    this.getSongerLists()
  },
  data() {
    return {
      area: '',
      type: '',
      option1: [
        { text: '华语', value: 7 },
        { text: '欧美', value: 96 },
        { text: '日本', value: 8 },
        { text: '韩国', value: 16 },
        { text: '其他', value: 0 },
        { text: '选择', value: '' }
      ],
      option2: [
        { text: '男', value: 1 },
        { text: '女', value: 2 },
        { text: '乐队/组合', value: 3 },
        { text: '选择', value: '' }
      ],
      // 歌手数据
      songerList: [],
      // 加载的数据条数
      limit: 30,
      // 页码
      offset: 1,
      // 加载更多的控制
      loading: true,
      // 所以数据是否加载完毕
      finished: false
    }
  },
  methods: {
    // 获取歌手列表
    getSongerLists(type, area) {
      getSongerList(this.limit, this.offset, type, area)
        .then(res => {
          // this.songerList = res.data.artists
          this.songerList = [...this.songerList, ...res.data.artists]
          this.loading = false
          if (res.data.artists.length === 0) {
            this.finished = true
          }
          // console.log(this.songerList)
        })
        .catch(err => err)
    },
    onLoad() {
      this.offset++
      this.getSongerLists(this.type, this.area)
    },
    // 跳转到歌手页面
    toSongerDetails(id) {
      this.$router.push({
        path: '/songer',
        query: {
          id: id
        }
      })
    }
  },
  watch: {
    area(newvalue) {
      this.songerList = []
      // console.log(this.type, newvalue)
      this.getSongerLists(this.type, newvalue)
    },
    type(newvalue) {
      this.songerList = []
      // console.log(newvalue, this.area)
      this.getSongerLists(newvalue, this.area)
    }
  }
}
</script>

<style lang="less" scoped>
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
.tag {
  display: flex;
  .tag1 {
    flex: 5;
    text-align: center;
    color: #dd001b;
    border: 1px solid #eee;
    border-radius: 15%;
  }
}

.list {
  display: flex;
  margin-bottom: 0.2667rem;
  .pic {
    width: 1.3333rem;
    height: 1.3333rem;
    margin-left: 0.2667rem;
    border-radius: 100%;
  }
  .list-p {
    position: relative;
    width: 100%;
    line-height: 1.3333rem;
    margin-left: 0.32rem;
    font-size: 0.4267rem;
    .btn {
      position: absolute;
      top: 0.24rem;
      right: 0;
      height: 0.8rem;
      line-height: 0.8rem;
      width: 0.0533rem;
      background-color: #d33a31;
    }
  }
}
</style>
