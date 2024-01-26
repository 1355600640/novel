import { get, post, response } from '../utils/RequestUtils'

const urlPrefix = '/author'

export type authorInfo = {
  id: number
  userId: number
  inviteCode: string
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
