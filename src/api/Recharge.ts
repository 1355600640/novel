import { get, post, response } from '../utils/RequestUtils'

const urlPrefix = '/recharge'
/**
 * 用户充值记录
 */
export interface userPayLog {
  id: number
  userId: number
  payChannel: number
  outTradeNo: string
  amount: number
  productType: number
  productId: number
  productName: number
  productValue: number
  payTime: string
  createTime: string
  updateTime: string
}

interface pageData<T> {
  total: string
  list: T[]
}
/**
 * 获取用户充值记录
 * @param pageSzie 页码
 * @param limit 数据数
 * @returns 充值记录
 */
export async function payLog(
  pageSize: number,
  limit: number
): response<pageData<userPayLog>> {
  return get(urlPrefix + '/payLog', { pageSize, limit })
}

export interface userConsumeLog {
  id: number
  userId: number
  amount: number
  productType: number
  productId: number
  producName: string
  producValue: number
  createTime: string
  updateTime: string
}

/**
 * 获取用户消费记录
 * @param pageSzie 页码
 * @param limit 数据数
 * @returns 消费记录
 */
export async function consumeLog(
  pageSize: number,
  limit: number
): response<pageData<userConsumeLog>> {
  return get(urlPrefix + '/consumeLog', { pageSize, limit })
}

export interface rechargeRule {
  id: number
  amount: number
  productValue: number
  productName: string
  giftMount: number
  createTime: string
  updateTime: string
}

/**
 * 获取充值规则
 * @returns 充值规则
 */
export async function rechargeRules(): response<rechargeRule[]> {
  return get(urlPrefix + '/rechargeRule')
}

/**
 * 用户充值
 * @param id 充值类型id
 * @returns 提醒语句
 */
export async function userRecharge(id: number): response<string> {
  return post(urlPrefix + '/userRecharge', id)
}
