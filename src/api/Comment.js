import request from '@/utils/request.js'
// 获取歌曲评论
export function getCommentList(id, limit, page) {
  return request({
    url: '/comment/music',
    params: {
      id: id,
      limit: limit,
      offset: (page - 1) * limit
    }
  })
}
