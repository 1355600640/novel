import { createRouter, createWebHistory } from 'vue-router'
import { Message } from '@arco-design/web-vue'

const routes = []
const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/home',
      redirect: '/',
    },
    {
      path: '/',
      name: 'home',
      meta: {
        pageHeader: true,
        noLogin: true,
        navigationBar: true,
        showCategory: true,
      },
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        pageHeader: false,
        noLogin: true,
        navigationBar: false,
        displayBottom: true,
      },
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/detail/:id?/:key?',
      name: 'detail',
      props: true,
      meta: {
        pageHeader: true,
        noLogin: true,
        navigationBar: false,
        showCategory: true,
      },
      component: () => import('../views/Detail.vue'),
    },
    {
      path: '/chapter/:id?/:page?',
      name: 'chapter',
      meta: { pageHeader: true, noLogin: true, navigationBar: false },
      component: () => import('../views/Chapter.vue'),
    },
  ],
})
/**
 * 路由错误回调
 */
router.onError((handler) => {
  console.log('error:', handler)
})

router.beforeEach((to, from, next) => {
  if (!to.meta.noLogin && !localStorage.getItem('novel_token')) {
    next({
      name: 'login',
    })
    Message.error({
      content: '请先登录',
      duration: 3000,
    })
  }
  if (to.name == 'login' && localStorage.getItem('novel_token')) {
    next('/')
  }
  next()
  window.scrollTo(0, 0)
})

export default router
