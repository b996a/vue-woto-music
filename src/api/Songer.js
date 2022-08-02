import request from '@/utils/request'
// 热门歌手
export function getSongerList(limit, offset, type, area) {
  return request({
    url: '/artist/list',
    params: {
      limit: limit,
      offset: (offset - 1) * limit,
      type: type,
      area: area,
      initial: -1
    }
  })
}
// 获取歌手详情
export function getSonger(id) {
  return request({
    url: '/artist/detail',
    params: {
      id: id
    }
  })
}
// 歌手热门 50 首歌曲
export function getSongerHot(id) {
  return request({
    url: '/artist/top/song',
    params: {
      id: id
    }
  })
}
