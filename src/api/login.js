import request from '../utils/request'
import testCookie from '@/assets/test/test.js'
const cookie = localStorage.getItem('cookie') && localStorage.getItem('cookie') !== 'null' ? encodeURIComponent(localStorage.getItem('cookie')) : testCookie
// 手机登录
export function phoneLogin(phone, password) {
  return request({
    url: '/login/cellphone',
    params: {
      phone: phone,
      md5_password: password,
      cookie: cookie
    }
    // timestamp: Date.parse(new Date())
  })
}
// 邮箱登录
export function emailLogin(email, password) {
  return request({
    url: '/login',
    params: {
      email: email,
      md5_password: password
    }
    // timestamp: Date.parse(new Date())
  })
}
// 刷新登录状态
export function loginState() {
  return request({
    url: '/login/status'
  })
}
