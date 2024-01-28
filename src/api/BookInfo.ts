import { get, post, response } from '../utils/RequestUtils'

const urlPrefix = '/bookInfo'

export type bookInfoType = {
  bookInfo: any
  fristPageName: string
  fristPageContent: string
  AuthorInfo: any
}

export type bookContentT = {
  bookChapter: any
  content: string
  bookInfo: any
  chapterNum: number
}

/**
 * 获取书本信息
 * @param id 书本id
 * @returns
 */
export async function bookInfo(id: string): response<bookInfoType> {
  return await get(urlPrefix + '/getBookInfo', { id })
}

/**
 * 获取书本目录
 * @param id 书本id
 * @returns
 */
export async function bookCatalogue(id: string): response<string[]> {
  return await get(urlPrefix + '/getCatalogue', { id })
}

/**
 * 获取书本章节内容
 * @param param 书本详情
 * @returns
 */
export async function bookContent(param: any): response<bookContentT> {
  return await get(urlPrefix + '/getChapter', { ...param })
}

type searchType = {
  keyword: string
  pageSize: number
  limit: number
  sortOrder: number
}
type mapType<T> = {
  total: number
  list: T[]
}
export type bookInfo = {
  id: number
  workDirection: number
  categoryId: number
  categoryName: string
  picUrl: string
  bookName: string
  authorId: number
  authorName: string
  bookDesc: string
  score: number
  bookStatus: number
  visitCount: number
  wordCount: number
  commentCount: number
  lastChapterId: number
  lastChapterName: string
  lastChapterUpdateTime: string
  isVip: number
  subscription: number
  browse: number
  createTime: string
  updateTime: string
}
/**
 * 搜索
 * @param params {
 * keyword: string
   pageSize: number
   limit: number
   sortOrder: number} 搜索值
 * @returns 书本列表
 */
export async function toSearch(
  params: searchType
): response<mapType<bookInfo>> {
  return await get(urlPrefix + '/search', params)
}

/**
 * 热门搜索
 * @param pageSize 页码
 * @param limit 条数
 * @returns 书本列表
 */
export async function hotSearch(
  pageSize: number,
  limit: number
): response<bookInfo[]> {
  return get(urlPrefix + '/hotSearch', { pageSize, limit })
}
