import { get, post, response, fileUpload } from '../utils/RequestUtils'
import { stringToDate } from '../utils/commonUtils'

const urlPrefix = '/user'

type loginUser = {
  username: string
  password: string
}

type regist = {
  username: string
  password: string
  surePassword: string
  code: string
}

/**
 * 登录
 * @param data
 * @returns
 */
export function loginUser(data: loginUser): response<any> {
  return post(urlPrefix + '/login', data)
}

/**
 *
 * @param data 验证码
 * @returns
 */
export function code(data: any): response<any> {
  return get(urlPrefix + '/verificationCode', data)
}

/**
 * 用户注册
 * @param data  用户信息
 * @returns
 */
export function registUser(data: regist): response<any> {
  return post(urlPrefix + '/register', data)
}

export interface userInfo {
  id: number
  username: string
  password: string
  userPhoto: string
  nickName: string
  salt: string
  userSex: number
  accountBalance: number
  status: number
  createTime: string
  updateTime: string
  intro: string
  fansNumber:number
  follow:number
  ipAddress:string
}

/**
 * @param followUser 关注的作者数
 * @param likeBook 关注的书籍
 * @param userUpvote 收获的点赞
 */
export interface userInfoDto extends userInfo {
  followUser: number
  likeBook: number
  userUpvote: number
  birthday: string
  readSystemNumber:number
  userNoReadSystem:number
}
/**
 * 获取用户信息
 * @returns
 */
export async function getUserSession(): response<userInfoDto> {
  return get(urlPrefix + '/getUserSession', null)
}

/**
 * 退出登录
 * @returns 登出信息
 */
export async function userLogout(): response<string> {
  return post(urlPrefix + '/logout', null)
}

/**
 * 获取新token
 * @returns {roken:string} token
 */
export async function getNewToken(): response<any> {
  return get(urlPrefix + '/getToken')
}

/**
 * 更改用户信息
 * @param params 用户信息
 * @returns
 */
export async function updateUserInfo(data: userInfoDto) {
  console.log(data.birthday, stringToDate(data.birthday, 'all'))
  data.birthday = stringToDate(data.birthday, 'all')

  return post(urlPrefix + '/content/updateInfo', data)
}

/**
 * 更新用户头像
 * @param data 头像file
 * @returns
 */
export async function updateUserAvatar(data: File): response<string> {
  return fileUpload(urlPrefix + '/content/updateUserPhoto', data)
}
type passwordT = {
  password: string
  oldPassword:string
  code: string
}
export async function updateUserPassword(data: passwordT): response<string> {
  return post(urlPrefix + '/content/updatePassword', data)
}
