module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ['Android >= 4.0', 'iOS >= 8']
    },
    'postcss-pxtorem': {
      rootValue: 37.5,
      // 75配合selectorBlackList: ['van']使用
      // rootValue: 75,
      propList: ['*']
      // selectorBlackList: ['van']
      // selectorBlackList:['van'] 这一行, 它的意是就是说  有van标记的标签, 不对其进行转换
    }
  }
}
// postcss技术:webpack的插件(转化/降级css的代码)
// postcss-pxtorem插件:把px都转成rem
// 能够把所有的元素的px单位转换成Rem
// rootValue:转换px的基准值
