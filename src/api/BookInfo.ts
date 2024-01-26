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
