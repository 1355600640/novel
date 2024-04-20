import { get, post, response } from '../utils/RequestUtils'
import { pageData } from './Common'
import { userInfo } from './User'

const urlPrefix = '/sys'

export interface sysSession {
  id: string
  title: string
  content: string
  level: string
  createTime: string
  deleted: number
  userInfo:userInfo
  sessionUrl:string
  remark:string
}

/**
 * 获取系统消息
 * @param pageSize 页码
 * @param limit 数据数
 * @returns 消息列表
 */
export async function sysSessionOfUser(
  pageSize: number,
  limit: number,
  type: number
): response<pageData<sysSession>> {
  return get(urlPrefix + '/user/sysSession', { pageSize, limit, type })
}

/**
 * 删除系统消息
 * @param ids 消息id
 * @returns
 */
export async function removeSession(ids: string[]): response<string> {
  return post(urlPrefix + '/user/removeSysSession', ids)
}

export type NoReadSystemLogNumberDto = {
  noReadLike:number
  noReadSystem:number
  noReadComment:number

}

export async function noReadSessionNumber():response<NoReadSystemLogNumberDto> {
  return get(urlPrefix + '/user/noRead')
}
