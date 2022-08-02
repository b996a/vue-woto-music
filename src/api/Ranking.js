import request from '@/utils/request'
import testCookie from '@/assets/test/test.js'
const cookie = localStorage.getItem('cookie') && localStorage.getItem('cookie') !== 'null' ? encodeURIComponent(localStorage.getItem('cookie')) : testCookie
// 获取歌单中的歌曲数据
export function getListSongs(id, limit, offset) {
  return request({
    url: '/playlist/track/all',
    params: {
      id: id,
      limit: limit,
      offset: (offset - 1) * limit,
      cookie: cookie
    }
  })
}
// 所有榜单内容摘要
export function getToplistDetail() {
  return request({
    url: '/toplist/detail'
  })
}
