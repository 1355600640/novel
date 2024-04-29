import { get,  response } from '../utils/RequestUtils'
const urlPrefix = '/home'

type randData = {
  type: String
  num: Number
}

type lastUpdatedDateType = {
  mode: Number
  type?: String
}

/**
 * 获取首页推荐内容
 * @param type 类型
 * @returns
 */
export async function recommend(type?: String): response<any> {
  return await get(urlPrefix + '/recommend', { type })
}

/**
 * 获取榜单内容
 * @param data
 * @returns
 */
export async function ranking(data: randData): response<any> {
  return await get(urlPrefix + '/ranking', data)
}

/**
 * 获取最近更新文章
 * @returns
 */
export async function lastUpdated(data: lastUpdatedDateType): response<any> {
  return await get(urlPrefix + '/lastUpdated', data)
}

/**
 *
 * @returns 获取系统公告
 */
export async function announcement(): response<any> {
  return await get(urlPrefix + '/announcement')
}
