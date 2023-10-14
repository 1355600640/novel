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
    if (response.data.errorCode !== 200) {
      if (response.data.errorCode === 405) {
        // 跳转到登录页
      }
    }
  }
  return response
})

export default instance
