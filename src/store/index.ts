import { defineStore } from 'pinia'
import { getNewToken, getUserSession } from '../api/User'
import { userInfoDto, userLogout } from '../api/User'
import Cookie from '../utils/Cookie'
import { stringToDate } from '../utils/commonUtils'
export const mainStore = defineStore('main', {
  state() {
    type dataType = {
      user: userInfoDto
      imgUrl: string
      pageButton: string
      userImage: string
      mainImage: string
    }
    let data: dataType = {
      user: {} as userInfoDto,
      imgUrl: 'http://image.qingfengn.cn/book',
      pageButton: '',
      userImage: 'http://image.qingfengn.cn',
      mainImage: 'http://image.qingfengn.cn',
    }
    return { ...data }
  },
  getters: {
    getPageButton(state) {
      return state.pageButton
    },
  },
  actions: {
    getUser() {
      getUserSession().then((r: any) => {
        this.user = r.data.data
        this.user.birthday = stringToDate(this.user.birthday, 'date')
      })
    },
    /**
     * 用户登出
     */
    async clearUser() {
      let session: any = {}
      await userLogout().then((r) => {
        session = r.data
        Cookie.clearCookie('novel_token')
        localStorage.removeItem('novel_token_long')
        this.user = {} as any
      })
      return session
    },
    // 重新获取Token
    async toGetNewToken() {
      await getNewToken().then((r) => {
        if (r.data.status === 200) {
          console.log(1)
          Cookie.setCookie(
            {
              novel_token: r.data.data.token,
            },
            1
          )
          localStorage.setItem('novel_token_long', r.data.data.tokenLong)
        }
      })
    },
  },
})
