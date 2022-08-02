// /**
//  * 时间格式化
//  * @param date  时间  Date对象
//  * @param fmt  格式 ‘yyyy-MM-dd HH:mm:ss’
//  * @returns {*} 格式化后的时间  "2018-09-06 10:15:59"
//  * @constructor
//  */
export function FormData(date) {
  const nowTime = +new Date()
  const s = new Date(date)
  const y = s.getFullYear()
  const m = s.getMonth() + 1 < 10 ? '0' + (s.getMonth() + 1) : s.getMonth() + 1
  const dd = s.getDate() < 10 ? '0' + s.getDate() : s.getDate()
  const hh = s.getHours() < 10 ? '0' + s.getHours() : s.getHours()
  const mm = s.getMinutes() < 10 ? '0' + s.getMinutes() : s.getMinutes()
  // const ss = s.getSeconds() < 10 ? '0' + s.getSeconds() : s.getSeconds()
  // const enddate = y + '-' + m + '-' + dd + ' ' + hh + ':' + mm + ':' + ss
  // return enddate
  if (nowTime - date < 86400000 && nowTime - date > 3600000) return hh + ':' + mm
  else if (nowTime - date > 86400000 && nowTime - date < 172800000) return '昨天' + hh + ':' + mm
  else if (nowTime - date < 3600000) return mm + '分钟前'
  else return y + '年' + m + '月' + dd + '日'
}

export default {
  install(Vue) {
    Vue.filter('FormData', FormData)
    // Vue.filter('minFormDate', minFormDate)
  }
}
