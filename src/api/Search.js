import request from '@/utils/request'
// 热搜列表(简略)
export function searchHot() {
  return request({
    url: '/search/hot'
  })
}
// 搜索歌曲
export function search(keywords, limit, offset, type) {
  return request({
    url: '/cloudsearch',
    params: {
      keywords: keywords,
      limit: limit,
      offset: (offset - 1) * limit,
      type: type
    }
  })
}
// 搜索建议
export function searchSuggest(keywords) {
  return request({
    url: '/search/suggest',
    params: {
      keywords: keywords,
      type: 'mobile'
    }
  })
}
