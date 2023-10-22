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
  bookInfo: any,
  chapterNum:number
}

export async function bookInfo(id: string): response<bookInfoType> {
  return await get(urlPrefix + '/getBookInfo', { id })
}

export async function bookCatalogue(id: string): response<string[]> {
  return await get(urlPrefix + '/getCatalogue', { id })
}

export async function bookContent(
  id: string,
  page: string
): response<bookContentT> {
  return await get(urlPrefix + '/getChapter', { id, page })
}
