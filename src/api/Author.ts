import { get, post, response } from '../utils/RequestUtils'
import { userInfo } from './User'

const urlPrefix = '/author'

export interface authorInfo {
  id: number
  userId: number
  inviteCode: string
  authorImage: string
  penName: string
  telPhone: string
  chatAccount: string
  email: string
  workDirection: number
  status: number
  createTime: string
  updateTime: string
  words: number
  bookNum: number
  intro: string
}

export interface People {
  authorInfo: authorInfo
  userInfo: userInfo
  isAuthor: boolean
}

/**
 * 获取作者信息
 * @param id
 * @returns
 */
export async function authorSession(
  id: string,
  isAuthor: number
): response<People> {
  return await get(urlPrefix + '/getSession', { id, isAuthor })
}

/**
 * 获取作者相关作品
 * @param id
 * @returns
 */
export async function authorOfBook(
  id: string,
  page: number,
  num: number
): response<{
  bookInfo: any[]
  total: string
}> {
  return await get(urlPrefix + '/getAuthorBook', { id, page, num })
}

export interface hotAuthor extends authorInfo {
  hotBookName: string
  hotBookId: number
  hotBookIntroduce: string
  newBookName: string
  newBookId: number
  newBookIntroduce: string
}
/**
 * 获取热门作者
 * @param pageSzie 页码
 * @param limit 数据条数
 * @returns 热门作者
 */
export async function getHotAuthor(
  pageSzie: number,
  limit: number
): response<hotAuthor[]> {
  return await get(urlPrefix + '/getHot', { pageSzie, limit })
}

/**
 * 关注作者
 * @param authorId 作者id
 * @returns {string}
 */
export async function followAuthor(authorId: number): response<string> {
  return post(urlPrefix + '/user/followAuthor', authorId)
}

/**
 * 取消关注作者
 * @param authorId 作者id
 * @returns {string}
 */
export async function removeFollow(authorId: number): response<string> {
  return post(urlPrefix + '/user/removeFollow', authorId)
}

/**
 * 用户关注作者列表
 * @param pageSzie 页码(default=1)
 * @param limit 数据数(default=10)
 * @returns 关注作者列表
 */
export async function userFollowAuthor(
  pageSzie?: number,
  limit?: number
): response<{
  list: authorInfo[]
  total: number
}> {
  return get(urlPrefix + '/user/getAuthors', { pageSzie, limit })
}
