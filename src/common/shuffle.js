export function shuffle(source) {
  // 遍历添加到arr
  const arr = source.slice()
  for (let i = 0; i < arr.length; i++) {
    // 生成一个随机数
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1))
}
// 交换数组中的两个数据
function swap(arr, i, j) {
  const t = arr[i]
  arr[i] = arr[j]
  arr[j] = t
}
export default {
  install(Vue) {
    Vue.filter('shuffle', shuffle)
  }
}
