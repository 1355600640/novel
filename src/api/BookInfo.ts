import { get, post, response } from '../utils/RequestUtils'
import { authorInfo } from './Author'
const urlPrefix = '/bookInfo'

export type bookContentT = {
  bookChapter: any
  content: string
  bookInfo: BookInfo
  chapterNum: number
}
export interface BookInfo {
  id: number | string
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

export interface UserReadHistory {
  id: number
  userId: number
  bookId: number
  preContentId: string
  createTime: string
  updateTime: string
}

export interface bookInfoDto {
  bookInfo: BookInfo
  fristPageName: string
  fristPageContent: string
  authorInfo: authorInfo
  followAuthor: boolean
  userReadHistory: UserReadHistory
  inBookshelf: boolean
}
/**
 * 获取书本信息
 * @param id 书本id
 * @returns
 */
export async function bookInfo(id: string): response<bookInfoDto> {
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
): response<mapType<BookInfo>> {
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
): response<BookInfo[]> {
  return get(urlPrefix + '/hotSearch', { pageSize, limit })
}

export interface UserReadDto extends BookInfo {
  preContentId: number
  preContentName: string
  preContentNum: number
}

/**
 * 获取历史阅读记录
 * @param pageSize 页码
 * @param limit 数据数
 * @returns 书本信息
 */
export async function localRead(
  pageSize: number,
  limit: number
): response<mapType<UserReadDto>> {
  return get(urlPrefix + '/user/localRead', { pageSize, limit })
}

/**
 * 书架列表
 * @param pageSize 页码
 * @param limit 数据数
 * @returns 书本信息
 */
export async function userBookshelf(
  pageSize: number,
  limit: number,
  bookStatus: number,
  userId?: number
): response<mapType<UserReadDto>> {
  return get(urlPrefix + '/userBookshelf', {
    bookStatus,
    pageSize,
    limit,
    userId,
  })
}

/**
 * 收藏书本
 * @param bookId 书本id
 * @returns {string}
 */
export async function inserBookshelf(bookId: string): response<string> {
  return post(urlPrefix + '/user/inserBookshelf', bookId)
}

/**
 * 删除书本阅读历史
 * @param bookId 书本id列表
 * @returns {string}
 */
export async function removeUserRead(bookIds: string[]): response<string> {
  return post(urlPrefix + '/user/removeUserRead', bookIds)
}

/**
 * 删除收藏书本
 * @param bookId 书本id列表
 * @returns {string}
 */
export async function removeBookshelf(bookIds: string[]): response<string> {
  return post(urlPrefix + '/user/removeBookshelf', bookIds)
}
