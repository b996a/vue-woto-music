/* 格式化日期 */
export function formatDate1(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}
export function FormData(date) {
  const s = new Date(date)
  const y = s.getFullYear()
  const m = s.getMonth() + 1 < 10 ? '0' + (s.getMonth() + 1) : s.getMonth() + 1
  const dd = s.getDate() < 10 ? '0' + s.getDate() : s.getDate()
  const hh = s.getHours() < 10 ? '0' + s.getHours() : s.getHours()
  const mm = s.getMinutes() < 10 ? '0' + s.getMinutes() : s.getMinutes()
  const ss = s.getSeconds() < 10 ? '0' + s.getSeconds() : s.getSeconds()
  const enddate = y + '-' + m + '-' + dd + ' ' + hh + ':' + mm + ':' + ss
  return enddate
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
