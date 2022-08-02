import request from '@/utils/request'

const cookie = encodeURIComponent(localStorage.getItem('cookie'))
// 获取账号信息
export function getAccount() {
  return request({
    url: '/user/account',
    params: {
      cookie: cookie
    }
  })
}
// 获取用户详情
export function getUserDetail(uid) {
  return request({
    url: '/user/detail',
    params: {
      uid,
      cookie: cookie,
      timestamp: Date.parse(new Date())
    }
  })
}
// 获取用户歌单
export function getUserSonglist(uid) {
  return request({
    url: '/user/playlist',
    params: {
      uid,
      cookie: cookie,
      timestamp: Date.parse(new Date()),
      limit: 1000
    }
  })
}
// 喜欢当前歌曲
export function likeNowSong(id, like) {
  return request({
    url: '/like',
    params: {
      id,
      like,
      cookie: cookie,
      timestamp: Date.parse(new Date())
    }
  })
}
// 获取用户喜欢的歌曲列表
export function getLikSongList(uid) {
  return request({
    url: '/likelist',
    params: {
      uid,
      cookie: cookie,
      timestamp: Date.parse(new Date())
    }
  })
}
