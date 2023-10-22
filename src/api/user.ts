import { get, post, response } from '../utils/RequestUtils'

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

/**
 * 获取用户信息
 * @returns
 */
export function getUserSession(): response<any> {
  return get(urlPrefix + '/getUserSession', null)
}
