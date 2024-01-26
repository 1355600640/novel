import { get, post, response } from '../utils/RequestUtils'

const urlPrefix = '/rank'

export type rankCategory = {
  id: number
  rankName: string
  rankValue: number
  rankTitle: string
  createTime: string
  updateTime: string
}

/**
 * 获取排行榜分类
 * @returns
 */
export async function rankCategoies(): response<rankCategory[]> {
  return await get(urlPrefix + '/rankCategory')
}

/**
 * 获取排行榜书本
 * @param params
 * @returns
 */
export async function rankBooks(params: {
  id: number
  pageSize: number
  limit: number
  rankValue: number
  categoryId: number
}): response<{
  num: number
  list: any[]
}> {
  return await get(urlPrefix + '/rankOfBooks', params)
}

/**
 * 获取分类所有分类n本
 * @param params
 */
export async function defaultValue(params: {
  pageSize: number
  limit: number
}): response<
  {
    title: string
    list: any[]
  }[]
> {
  return await get(urlPrefix + '/default', params)
}
