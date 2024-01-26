import { Message } from '@arco-design/web-vue'
import { response } from '../utils/RequestUtils'
import axios from 'axios'
const instance = axios.create({
  withCredentials: false,
  timeout: 15000,
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    config.url = '/api' + config.url
    if (localStorage.getItem('novel_token')) {
      config.headers.Authorization =
        'Bearer ' + localStorage.getItem('novel_token')
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use((response) => {
  if (response.status === 200) {
    if (response.data.status !== 200) {
      Message.error(response.data.message || '参数错误')
      if (response.data.status === 405) {
        // 跳转到登录页
        history.pushState({ page: 'login' }, 'login', '/login')
      }
    }
  }
  return response
})

export default instance
