import { get, post, response } from '../utils/RequestUtils'

const urlPrefix = '/category'

export async function getCategoryName(): response<any[]> {
  return await get(urlPrefix + '/getNameAll')
}
