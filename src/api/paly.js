import request from '../utils/request'
import testCookie from '@/assets/test/test.js'
const cookie = localStorage.getItem('cookie') && localStorage.getItem('cookie') !== 'null' ? encodeURIComponent(localStorage.getItem('cookie')) : testCookie

// 播放页 - 获取歌曲详情
export function getSongById(id) {
  return request({
    url: `/song/detail?ids=${id}`
  })
}

// 播放页 - 获取歌词
export function getLyricById(id) {
  return request({
    url: `/lyric?id=${id}`
  })
}
// 检查歌曲是否可用
export function checkMusic(id) {
  return request({
    url: `/check/music?id=${id}`
  })
}
// 获取歌曲url
export function getSongUrl(id) {
  return request({
    url: `/song/url?id=${id}`,
    params: {
      cookie: cookie
    }
  })
}
