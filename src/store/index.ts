import { defineStore } from 'pinia'
import { getUserSession } from '../api/User'
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
      getUserSession().then((r:any) => {
        this.user = r.data.data
      })
    },
  },
})
