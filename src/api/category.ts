import { get, response } from '../utils/RequestUtils'

const urlPrefix = '/category'

type catgeList = {
  count:number,
  bookList:any[]
}

export async function getCategoryName(): response<any[]> {
  return await get(urlPrefix + '/getNameAll')
}

export async function getCategoryForId(param: any): response<catgeList> {
  return await get(urlPrefix + '/getCategory', param)
}
