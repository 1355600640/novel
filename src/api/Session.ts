import { get, post, response } from '../utils/RequestUtils'
import { pageData } from './Common'

const urlPrefix = '/sys'

export interface sysSession {
  id: string
  title: string
  content: string
  level: string
  createTime: string
  deleted: number
}

/**
 * 获取系统消息
 * @param pageSize 页码
 * @param limit 数据数
 * @returns 消息列表
 */
export async function sysSessionOfUser(
  pageSize: number,
  limit: number
): response<pageData<sysSession>> {
  return get(urlPrefix + '/user/sysSession', { pageSize, limit })
}

/**
 * 删除系统消息
 * @param ids 消息id
 * @returns
 */
export async function removeSession(ids: string[]): response<string> {
  return post(urlPrefix + '/user/removeSysSession', ids)
}
