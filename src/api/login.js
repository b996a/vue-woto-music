import request from '../utils/request'

// 手机登录
export function phoneLogin(phone, password) {
  return request({
    url: '/login/cellphone',
    params: {
      phone: phone,
      md5_password: password
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
