import axios from 'axios'
const request = axios.create({
  // baseURL: 'http://localhost:3000'
  baseURL: 'http://124.220.210.84:3000'
  // baseURL: 'http://boboniguang.gnway.cc/daka3'
  // baseURL: 'https://wowotou666.vercel.app/'
})

export default request
