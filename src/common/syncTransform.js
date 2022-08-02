// 同步内外层的角度
export function syncTransform(wrapper, inner) {
  // 通过getComputedStyle动态计算外层的旋转角度
  const wrappertranform = getComputedStyle(wrapper).transform
  // 通过getComputedStyle动态计算内层的旋转角度
  const innerTransform = getComputedStyle(inner).transform
  // 将内层和外层的角度一起赋值给外层，因为，当内层旋转后，是相对外层的角度进行旋转，当外层有初始角度，此时就要把二者都赋值给外层
  wrapper.style.transform = wrappertranform === 'none' ? innerTransform : innerTransform.concat('', wrappertranform)
  return wrapper.style.transform
}
