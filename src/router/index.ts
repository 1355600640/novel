import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: { pageHeader: true, noLogin: true, navigationBar: true },
    component: () => import('../views/home.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: { pageHeader: false, noLogin: true, navigationBar: false },
    component: () => import('../views/login.vue'),
  },
]
const router = createRouter({
  history: createWebHistory('/'),
  routes,
})
/**
 * 路由错误回调
 */
router.onError((handler) => {
  console.log('error:', handler)
})

router.beforeEach((to, from, next) => {
  if (!to.meta.noLogin && !localStorage.getItem('novel_token')) {
    next('/login')
  }
  if (to.name == 'login' && localStorage.getItem('novel_token')) {
    next('/')
  }
  next()
})

export default router
