import { defineStore } from 'pinia'
import { getUserSession } from '../api/user'
export const mainStore = defineStore('main', {
  state() {
    return {
      user: new Map(),
      imgUrl:'/api/images/book'
    }
  },
  getters: {},
  actions: {
    getUser() {
      getUserSession().then((r) => {
        this.user = r.data.data
      })
    },
  },
})
