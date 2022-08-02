<template>
  <div class="main">
    <van-icon name="cross" class="crossIcon" @click="back" />
    <div class="body">
      <img src="../Layout/music.png">
      <div class="form">
        <p class="select">
          <span class="phone select-p" ref="phoneRef" @click="phoneLogin">手机登录</span>
          <span class="email" ref="emailRef" @click="emailLogin">邮箱登录</span>
        </p>
        <van-form @submit="onSubmit" @failed="onFailed" v-if="show==='phone'">
          <van-field v-model="phone" label="手机号" label-width="51px" name="pattern" clearable :rules="[{pattern, required: true, message: '请输入正确的手机号' }]" />
          <van-field v-model="password1" label="密码" label-width="51px" type="password" clearable name="validator" :rules="[{validator, required: true, message: '密码必须由数字、字母两种字符组成，长度在8-15位之间' }]" />
          <div class="btn">
            <van-button plain hairline type="info" color="#ee0a24" native-type="submit">&nbsp;登&nbsp;&nbsp;录&nbsp;</van-button>
          </div>
        </van-form>
        <van-form @submit="onSubmit" @failed="onFailed" v-if="show==='email'">
          <van-field v-model="email" label="邮箱" label-width="51px" name="pattern" clearable :rules="[{pattern, required: true, message: '请输入正确的邮箱号' }]" />
          <van-field v-model="password2" label="密码" label-width="51px" type="password" clearable name="validator" :rules="[{validator, required: true, message: '密码应为字母，数字，特殊符号(~!@#$%^&*()_.)，两种及以上组合，8-16位字符串' }]" />
          <div class="btn">
            <van-button plain hairline type="info" color="#ee0a24" native-type="submit">&nbsp;登&nbsp;&nbsp;录&nbsp;</van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script>
import { phoneLogin, emailLogin } from '@/api/login.js'
export default {
  name: 'LoginPage',
  created() {
    this.$store.dispatch('saveMiniPlayState', false)
  },
  data() {
    return {
      // 手机号
      phone: '',
      // 手机号登录的密码
      password1: '',
      // 网易邮箱
      email: '',
      // 网易邮箱登录的密码
      password2: '',
      // 控制form框的键
      show: 'phone'
    }
  },
  computed: {
    // 正则验证
    pattern() {
      return this.show === 'phone' ? /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/ : /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    }
  },
  methods: {
    back() {
      this.$store.dispatch('saveMiniPlayState', true)
      this.$router.back()
    },
    // 密码验证
    validator(val) {
      return /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*()_.]+)$)^[\w~!@#$%^&*()_.]{8,16}$/.test(val)
    },
    phoneLogin() {
      this.show = 'phone'
      this.$refs.phoneRef.className = 'phone select-p'
      this.$refs.emailRef.className = 'email'
    },
    emailLogin() {
      this.show = 'email'
      this.$refs.phoneRef.className = 'phone'
      this.$refs.emailRef.className = 'email select-p'
    },
    // 提交事件
    onSubmit() {
      if (this.show === 'phone') {
        // console.log(this.phone, this.password1)
        phoneLogin(this.phone, this.md5(this.password1))
          .then(res => {
            if (res.data.code === 502) {
              this.$toast(res.data.msg + ',请检查后再试')
            } else {
              const cookie = res.data.cookie
              localStorage.setItem('cookie', cookie)
              this.$store.dispatch('updateLogin', true)
              this.$store.dispatch('saveMiniPlayState', true)
              this.$toast('登录成功')
              this.$router.replace('/user')
            }
          })
          .catch(res => {
            this.$toast(res.data.msg)
          })
      }
      if (this.show === 'email') {
        emailLogin(this.phone, this.md5(this.password2))
          .then(res => {
            if (res.data.code === 502) {
              this.$toast(res.data.msg + ',请检查后再试')
            } else {
              const cookie = res.data.cookie
              localStorage.setItem('cookie', cookie)
              this.$store.dispatch('updateLogin', true)
              this.$store.dispatch('saveMiniPlayState', true)
              this.$toast('登录成功')
              this.$router.replace('/user')
            }
          })
          .catch(res => {
            this.$toast(res.data.msg)
          })
      }
    },
    // 提交失败事件
    onFailed() {
      if (this.show === 'phone') {
        this.$toast('手机号或密码输入有误，请检查后在试')
      } else {
        this.$toast('邮箱号或密码输入有误，请检查后在试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #ee0a24;
  .crossIcon {
    position: absolute;
    top: 0.4rem;
    left: 0.4rem;
    color: rgb(234, 203, 203);
    z-index: 10;
  }
  .body {
    position: relative;
    width: 100%;
    img {
      position: absolute;
      top: 2.6667rem;
      left: 50%;
      width: 2.1333rem;
      transform: translateX(-50%);
    }
    .select {
      color: #eee;
      text-align: center;
      font-size: 0.4267rem;
      margin-bottom: 1.0667rem;
      .phone {
        margin-right: 0.5333rem;
      }
      .select-p {
        padding: 0.1333rem;
        background-color: #fff;
        color: #ee0a24;
        border: 1px solid #eee;
      }
    }
    .form {
      width: 70%;
      position: fixed;
      top: 37%;
      left: 50%;
      transform: translateX(-50%);
    }
    .btn {
      width: 5.3333rem;
      margin: 0.6333rem 0 0 2.3333rem;
      .van-button__text {
        font-size: 0.57333rem;
      }
    }
  }
}
</style>
