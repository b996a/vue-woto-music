// 封装要发起的请求
import request from '@/utils/request.js'

const cookie = encodeURIComponent(localStorage.getItem('cookie'))
// 封装网络请求方法
// 推荐歌单
export function getRecommendMusics(limit) {
  return request({
    url: '/personalized',
    params: {
      limit: limit
    }
    // timestamp: Date.parse(new Date())
  })
}
// 推荐新音乐
export function getRecommendNewMusic(limit) {
  return request({
    url: '/personalized/newsong',
    params: {
      limit: limit
    }
  })
}
// 每日推荐
export function getRecommendSong() {
  return request({
    url: '/recommend/songs',
    params: {
      cookie: cookie
    }
  })
}
// 每日推荐歌单
export function getRecommendList() {
  return request({
    url: '/recommend/resource',
    params: {
      cookie: cookie
    }
  })
}
// 精品歌单
export function getBoutiqueList(limit, before) {
  return request({
    url: '/top/playlist/highquality',
    params: {
      limit,
      before,
      cookie: cookie
    }
  })
}
// 获取轮播图数据
export function getBannerList() {
  return request({
    url: '/banner',
    params: {
      type: 1
    }
  })
}
