import { get, post, response } from '../utils/RequestUtils'

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
}

/**
 * 获取作者信息
 * @param id
 * @returns
 */
export async function authorSession(id: string): response<authorInfo> {
  return await get(urlPrefix + '/getSession', { id })
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
