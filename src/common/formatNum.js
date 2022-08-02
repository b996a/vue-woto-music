export function formatNum(num) {
  if (num > 100000000) {
    num = (num / 100000000).toFixed(2)
    return num + '亿'
  } else if (num > 10000) {
    num = (num / 10000).toFixed(0)
    return num + '万'
  } else return num
}
export default {
  install(Vue) {
    Vue.filter('formatNum', formatNum)
  }
}
