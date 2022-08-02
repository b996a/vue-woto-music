<template>
  <div>
    <div v-for="item in Toplist" :key="item.id">
      <div class="box">
        <div class="bd" @click="toDetail(item.id,item.name,item.coverImgUrl,item.playCount,item.description) ">
          <div class="header">
            <h3>{{item.name}}</h3>
            <p class="header-p">{{item.updateFrequency}}</p>
          </div>
          <div class="list">
            <div class="list-left">
              <img :src="item.coverImgUrl" class="pic" v-lazy='item.coverImgUrl'>
              <p class="playcount">
                <van-icon name="service-o" />
                {{item.playCount|formatNum}}
              </p>
            </div>
            <div class="list-right">
              <div v-if="item.tracks.length>0">
                <p class="list-p">1 {{item.tracks[0].first}}-{{item.tracks[0].second}}</p>
                <p class="list-p">2 {{item.tracks[1].first}}-{{item.tracks[1].second}}</p>
                <p class="list-p">3 {{item.tracks[2].first}}-{{item.tracks[2].second}}</p>
              </div>
              <div v-else-if="item.description" class="van-multi-ellipsis--l3 text">
                {{item.description}}
              </div>
              <div v-else class="text">
                暂无介绍
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToplistDetail } from '@/api/Ranking.js'
export default {
  name: 'RinkList',
  created() {
    this.getToplistDetails()
  },
  data() {
    return {
      Toplist: []
    }
  },
  methods: {
    getToplistDetails() {
      getToplistDetail().then(res => {
        this.Toplist = res.data.list
        // console.log(this.Toplist)
      })
    },
    toDetail(id, name, picUrl, playCount, description) {
      this.$router.push({
        path: '/rinkdetails',
        query: {
          id: id,
          name: name,
          picUrl: picUrl,
          playCount: playCount,
          description: description
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  height: 4rem;
  padding: 0.2667rem 0.4rem;
  border-radius: 100%;
  .bd {
    background-color: #eee;
    border: 1px solid #eee;
    border-radius: 0.4rem;
  }
  .header {
    position: relative;
    display: flex;
    text-align: left;
    height: 1.3333rem;
    line-height: 1.3333rem;
    padding-left: 0.4rem;
    h3 {
      font-size: 0.5333rem;
    }
    .header-p {
      position: absolute;
      top: 0;
      right: 0.4rem;
      font-size: 0.32rem;
      color: #666;
    }
  }
  .list {
    height: 2.6667rem;
    display: flex;
    .list-left {
      width: 2.6667rem;
      margin-left: 0.4rem;
      position: relative;
      .playcount {
        position: absolute;
        right: 6px;
        top: 0;
        z-index: 3;
        padding-left: 15px;
        color: #fff;
        font-size: 10px;
        background-position: 0;
        background-repeat: no-repeat;
        background-size: 11px 10px;
        text-shadow: 1px 0 0 rgb(0 0 0 / 15%);
      }
      .pic {
        width: 2.2667rem;
        height: 2.2667rem;
        border-radius: 0.4rem;
        overflow: hidden;
        border: 1px solid rgba(0, 0, 0, 0.25);
      }
    }
    .list-right {
      width: 100%;
      padding: 0.08rem 0.4rem;
      .list-p {
        width: 5.7333rem;
        font-size: 0.4267rem;
        margin-bottom: 0.2667rem;
        // 省略超出的字数
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .text {
        font-size: 0.3733rem;
      }
    }
  }
}
</style>
