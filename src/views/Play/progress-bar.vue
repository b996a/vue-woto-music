<template>
  <div class="progress-bar" @click="onClick">
    <div class="bar-inner">
      <div class="progress" :style="progressStyle" ref="progress"></div>
      <div class="progress-btn-wrapper" :style="btnStyle" @touchstart.prevent='onTouchStart' @touchmove.prevent='onTouchMove' @touchend.prevent='onTouchEnd'>
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressbtnWidth = 6
export default {
  name: 'progress-bar',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  created() {
    // 当需要全局访问，又不需要响应式的数据的时候，我们可以定义在created中，减少性能损耗
    this.touch = {}
  },
  emit: ['progress-changing', 'progress-changed'],
  data() {
    return {
      offset: 0
    }
  },
  watch: {
    progress(newProgress) {
      this.setOffset(newProgress)
    }
  },
  computed: {
    progressStyle() {
      // 将偏移量赋值给进度条
      return `width:${this.offset}px`
    },
    btnStyle() {
      // // 将偏移量赋值给按钮
      return `transform:translateX(${this.offset}px)`
    }
  },
  methods: {
    setOffset(progress) {
      // 拿到整体长度，减去按钮长度
      const barWidth = this.$el.clientWidth - progressbtnWidth
      // console.log(this.$el)当前挂载的实例的根节点
      // 得到的宽度乘以传过来的时间比得到偏移量
      this.offset = barWidth * progress
      // console.log(this.offset)
    },
    onTouchStart(e) {
      // 拿到开始横坐标的位置
      this.touch.x1 = e.touches[0].pageX
      // console.log(e)
      // 进度条的初始宽度
      this.touch.beginWidth = this.$refs.progress.clientWidth - progressbtnWidth
    },
    onTouchMove(e) {
      // 拿到移动时的横坐标减去初始得到拖拽的距离
      const delta = e.touches[0].pageX - this.touch.x1
      // 位移之后进度条的宽度
      const tempWidth = this.touch.beginWidth + delta
      // 去除按钮后的根节点的宽度
      const barWidth = this.$el.clientWidth - progressbtnWidth
      // console.log(tempWidth, barWidth)
      // 把progress限制在0~1之间
      // 求出进度条的比例
      const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
      this.offset = barWidth * progress
      // 向外暴露一个事件
      this.$emit('progress-changing', progress)
    },
    onTouchEnd() {
      const barWidth = this.$el.clientWidth - progressbtnWidth
      const progress = this.$refs.progress.clientWidth / barWidth
      this.$emit('progress-changed', progress)
    },
    onClick(e) {
      // getBoundingClientRect()用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置。
      // getBoundingClientRect()是DOM元素到浏览器可视范围的距离（不包含文档卷起的部分）。
      const rect = this.$el.getBoundingClientRect()
      const barWidth = this.$el.clientWidth - progressbtnWidth
      const offsetWidth = e.pageX - rect.left
      const progress = offsetWidth / barWidth
      this.$emit('progress-changed', progress)
    }
    // rectObject.top：元素上边到视窗上边的距离;
    // rectObject.right：元素右边到视窗左边的距离;
    // rectObject.bottom：元素下边到视窗上边的距离;
    // rectObject.left：元素左边到视窗左边的距离;
    // rectObject.width：是元素自身的宽
    // rectObject.height是元素自身的高
  }
}
</script>

<style lang="less" scoped>
.progress-bar {
  height: 0.7rem;
  .bar-inner {
    position: relative;
    top: 0.3733rem;
    height: 0.0267rem;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: #eee;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -0.2133rem;
      top: -0.3467rem;
      width: 0.8rem;
      height: 0.8rem;
      .progress-btn {
        position: relative;
        top: 0.26rem;
        left: 0.1867rem;
        box-sizing: border-box;
        width: 0.2133rem;
        height: 0.2133rem;
        // border: 3px solid #fff;
        border-radius: 50%;
        background: #eee;
      }
    }
  }
}
</style>
