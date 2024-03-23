import { Message } from '@arco-design/web-vue'
import axios from 'axios'
import Cookie from '../utils/Cookie'
import { mainStore } from '../store'
import router from '../router/index'
import { nextTick } from 'vue'

const instance = axios.create({
  withCredentials: false,
  timeout: 15000,
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    let longToken = localStorage.getItem('novel_token_long'),
      token = Cookie.getCookie('novel_token')
    if (!config.url?.includes('/api')) config.url = '/api' + config.url
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    } else if (longToken) {
      config.headers.Authorization = 'Long-Bearer ' + longToken
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(async (response) => {
  const useMianStore = mainStore()
  if (response.status === 200) {
    if (response.data.status !== 200) {
      Message.clear()
      // Message.error(response.data.message || '参数错误')
      // 获取新Token
      if (response.data.status === 405) {
        let longToken = localStorage.getItem('novel_token_long'),
          token = Cookie.getCookie('novel_token')
        Cookie.clearCookie('novel_token')
        if (longToken && token)
          return useMianStore.toGetNewToken().then(async (r) => {
            const resp = await instance.request(response.config)
            return resp
          })
      }
      // 长Token失效重新登录
      else if (response.data.status === 406) {
        Message.clear()
        localStorage.removeItem('novel_token_long')
        Cookie.clearCookie('novel_token_')
        router.push('/login').then(() => {
          nextTick(() => {
            console.log(Message);
            Message.error(response.data.message)
          })
        })
      }
    }
  }
  return response
})

export default instance
