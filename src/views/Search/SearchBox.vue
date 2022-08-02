<template>
  <div>
    <van-search v-model="searchValue" placeholder="搜索歌曲、歌手、专辑" shape='round' @click="rewSearch" @keydown.enter="getSearchResult(searchValue)" />
    <!-- 分割线 -->
    <van-divider />
    <!-- 热门搜索 -->
    <div class="search_warp" v-if="searchResult.length === 0&&searchSuggestList.length===0&&!searchValue">
      <p class="hot_title">热门搜索</p>
      <!-- :key="i"在同一个盒子中同时使用v-for会warning，可以放在两个不同的盒子中分开,避免报错 -->
      <div>
        <span v-for="(item,i) in searchHotList" :key="i" class="search_hot">
          <van-tag plain round type="primary" size="large" color="#d3d4da" text-color="#333" @click="hotWord(item.first) ">{{item.first}}</van-tag>
        </span>
      </div>
      <!-- 历史记录 -->
      <div>
        <van-cell-group v-for="(item,index) in hisSearchList" :key="index" class="suggest_list">
          <span class="icon-left">
            <van-icon name="underway-o" />
          </span>
          <van-cell :title="item" center size="large" @click="getSearchResult(item)">
          </van-cell>
          <span class="cross-icon">
            <van-icon name="cross" @click="deleteHisRecord(index)" />
          </span>
        </van-cell-group>
      </div>
    </div>
    <!-- 搜索建议 -->
    <div class="search_warp" v-else-if='searchResult.length === 0'>
      <h3 class="suggest" @click="getSearchResult(searchValue)">搜索"{{searchValue}}"</h3>
      <van-cell-group v-for="item in searchSuggestList" :key="item.id" class="suggest_list">
        <span class="search-icon">
          <van-icon name="search" />
        </span>
        <van-cell :title="item.keyword" center size="large" @click="getSearchResult(item.keyword)" />
      </van-cell-group>
    </div>
    <!-- 最佳匹配 -->
    <div class="search_warp" v-else>
      <p class="hot_title">最佳匹配</P>
      <!-- 加载更多 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <song-item :list='this.searchResult' :noplayall='true'></song-item>
      </van-list>
    </div>
    <!-- 空状态 -->
    <van-empty image="search" description="没有查询到结果" v-if="searchResult.length === 0&&searchSuggestList.length===0&&searchValue" />
  </div>
</template>

<script>
import { searchHot, search, searchSuggest } from '@/api/Search.js'
export default {
  name: 'SearchBox',
  created() {
    this.searchHots()
    this.getHisRecords()
  },
  data() {
    return {
      searchValue: '',
      // 热搜关键字
      searchHotList: [],
      // 加载的数据类型
      type: 1,
      // 加载的数据条数
      limit: 10,
      // 页码
      offset: 1,
      // 加载更多的控制
      loading: true,
      // 所以数据是否加载完毕
      finished: false,
      // 搜索到的歌曲数据
      searchResult: [],
      // 搜索建议数据
      searchSuggestList: [],
      // 保存定时器
      timer: null,
      // 搜索历史记录
      hisSearchList: []
    }
  },
  methods: {
    searchHots() {
      searchHot().then(res => {
        this.searchHotList = res.data.result.hots
      })
      // console.log(this.searchHotList)
    },
    hotWord(word) {
      this.searchValue = word
      this.getSearchResult(word)
    },
    getSearchResult(value) {
      this.searchValue = value
      search(value, this.limit, this.offset, this.type)
        .then(res => {
          // this.searchResult = res.data.result.songs
          this.searchResult = [...this.searchResult, ...res.data.result.songs]
          // 对结果进行判断，如果没有查到数据，返回未定义时，将结果重新置为空数组，防止上面拿不到数组
          if (!this.searchResult) {
            this.searchResult = []
          }
          this.loading = false
          if (res.data.result.songs.length === 0) {
            this.finished = true
          }
          this.setHisRecords(value)
          // console.log(this.searchResult)
        })
        .catch(err => err)
    },
    // 得到搜索建议
    getSearchSuggest(value) {
      searchSuggest(value)
        .then(res => {
          this.searchSuggestList = res.data.result.allMatch
          if (!this.searchSuggestList) {
            this.searchSuggestList = []
          }
          // console.log(this.searchSuggestList)
        })
        .catch(err => err)
    },
    // 再次点击搜索框时,清空已经搜到的数据,返回搜索建议页面
    rewSearch() {
      this.searchResult = []
      this.offset = 1
    },
    // 初始化历史数据
    getHisRecords() {
      const JSONhisSearchList = localStorage.getItem('historRecords')
      this.hisSearchList = JSON.parse(JSONhisSearchList)
      if (this.hisSearchList === null) {
        this.hisSearchList = []
      }
    },
    // 对历史记录进行去重
    setHisRecords(value) {
      // 最多保留十个数据
      if (this.hisSearchList.length > 10) {
        // 删除最后一个记录
        this.hisSearchList.splice(10, 1)
      }
      // unshift从数组头部插入数据
      this.hisSearchList.unshift(value)
      // console.log(this.hisSearchList)
      // 历史记录去重
      for (let i = 0; i < this.hisSearchList.length; i++) {
        // 获取当前元素后的所有元素
        for (let j = i + 1; j < this.hisSearchList.length; j++) {
          // 判断两个元素的值是否相等
          if (this.hisSearchList[i] === this.hisSearchList[j]) {
            // 如果相等则证明出现了重复的元素，则删除j对应的元素
            this.hisSearchList.splice(j, 1)
            // 当删除了当前j所在的元素以后，后边的元素会自动补位
            // 此时将不会在比较这个元素 所以需要在比较一次j所在的位置的元素 使j自减
            j--
          }
        }
      }
      this.saveHisRecords()
      // console.log(this.hisSearchList)
    },
    // 保存历史记录到本地
    saveHisRecords() {
      const JsonhisSearchList = JSON.stringify(this.hisSearchList)
      localStorage.setItem('historRecords', JsonhisSearchList)
    },
    // 删除历史记录
    deleteHisRecord(index) {
      this.hisSearchList.splice(index, 1)
      this.saveHisRecords()
    },
    // 加载歌曲
    onLoad() {
      this.offset++
      this.getSearchResult(this.searchValue)
    }
  },
  watch: {
    // 搜索框里的值改变(点击/键盘输入)，立即执行
    searchValue(newvalue) {
      // 设置防抖，防止发送数据过快
      // 在一定时间内执行一次
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // 拿到最新的值，进行判断，如果值为空，返回一个空数组
        if (!newvalue) {
          this.searchResult = []
          this.searchSuggestList = []
        } else {
          // this.getSearchResult(newvalue)
          this.getSearchSuggest(newvalue)
        }
      }, 300)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-field__control {
  font-size: 14px;
}
.search_warp {
  padding: 0 0 0 0.1333rem;
}
.van-tag {
  margin: 4px 7px 4px 0;
}
.hot_title {
  margin: 0.4rem 0 0.2667rem 0;
  font-size: 12px;
  color: #666;
}
.search-icon {
  font-size: 0.64rem;
  line-height: 1.3333rem;
}
.cross-icon {
  font-size: 0.48rem;
  color: #c4c4c4;
  align-self: center;
  margin-right: 0.2667rem;
}
.suggest {
  height: 1.3333rem;
  margin-left: 0.2667rem;
  padding-right: 0.2667rem;
  font-size: 0.4rem;
  line-height: 1.3333rem;
  color: #507daf;
}
.suggest_list {
  display: flex;
  padding-left: 0.2667rem;
  .icon-left {
    font-size: 0.48rem;
    color: #c4c4c4;
    align-self: center;
    margin-right: 0.08rem;
  }
}
</style>>
