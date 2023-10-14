import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'animate.css'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'
import { createPinia } from 'pinia'
import router from './router'
import 'swiper/css'


const pinia = createPinia()
const app = createApp(App)
app.use(ArcoVue, {
  // 用于改变使用组件时的前缀名称
  componentPrefix: 'arco',
})
app.use(router).use(ArcoVueIcon).use(pinia)
app.mount('#app')
