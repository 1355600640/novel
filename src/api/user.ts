import { get, post, response } from '../utils/RequestUtils'

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
export function loginUser(data: loginUser): response {
  return post('/user/login', data)
}

/**
 *
 * @param data 验证码
 * @returns
 */
export function code(data: any): response {
  return get('/user/verificationCode', data)
}

/**
 * 用户注册
 * @param data  用户信息
 * @returns
 */
export function registUser(data: regist): response {
  return post('/user/register', data)
}

/**
 * 获取用户信息
 * @returns
 */
export function getUserSession(): response {
  return get('/user/getUserSession', null)
}
