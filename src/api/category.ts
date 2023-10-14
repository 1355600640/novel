import { get, post, response } from '../utils/RequestUtils'

export async function getCategoryName():response<any[]> {
  return await get('/category/getNameAll')
}
