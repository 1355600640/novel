import { get, post, response } from '../utils/RequestUtils'
import { pageData } from './Common'
import { userInfo } from './User'

const urlPrefix = '/review'

interface BookComment {
  id: string
  bookId: string
  userId: string
  commentContent: string
  userLike: string
  replyCount: string
  auditStatus: number
  ipAddress: string
  createTime: string
  updateTime: string
}

interface BookCommentReply {
  id: string
  commentId: string
  userId: string
  userLike: string
  replyContent: string
  auditStatus: number
  ipAddress: string
  isReply: number
  relplyUserId: string
  createTime: string
  updateTime: string
}

export interface BookCommentReplyDto extends BookCommentReply {
  userInfo: userInfo
  likeBookComment: boolean
  replyUserName: string
}

export interface ReviewDto extends BookComment {
  bookCommentReply: BookCommentReplyDto[]
  bookCommentReplyNumber: string
  userInfo: userInfo
  likeBookComment: boolean
}

/**
 * 获取评论
 * @param pageSize 页码
 * @param limit 每页数据数
 * @param bookId 书本id
 * @param commentId 评论id
 * @returns
 */
export async function commentList(
  pageSize: number,
  limit: number,
  bookId?: string | null,
  commentId?: string,
  searchId?: string,
  type?: string
): response<pageData<ReviewDto | BookCommentReplyDto>> {
  console.log(searchId, type, 1)

  return await get(urlPrefix + '/getReviews', {
    pageSize,
    limit,
    bookId: bookId == null ? null : bookId,
    commentId,
    searchId: !searchId ? null : searchId,
    type: !type ? null : type,
  })
}

interface bookCommentVo {
  bookId?: string
  commentId?: string
  content: string
  userId?: string
}

/**
 * 发布评论
 * @param params 评论
 * @returns
 */
export async function insertComment(data: bookCommentVo): response<ReviewDto> {
  return await post(urlPrefix + '/user/insertComment', data)
}

/**
 * 回复评论
 * @param params 评论
 * @returns
 */
export async function insertCommentReply(
  data: bookCommentVo
): response<BookCommentReplyDto> {
  return await post(urlPrefix + '/user/insertCommentReply', data)
}

interface LikeBookCommentVo {
  commentId: string
  isReply: boolean
}

/**
 * 删除评论
 * @param data
 * @returns
 */
export async function removeCommentReply(
  data: LikeBookCommentVo
): response<string> {
  return await post(urlPrefix + '/user/removeCommentReply', data)
}

/**
 * 点赞评论
 * @param data
 * @returns
 */
export async function likeBookComment(
  data: LikeBookCommentVo
): response<string> {
  return await post(urlPrefix + '/user/likeBookComment', data)
}

/**
 * 取消点赞
 * @param data
 * @returns
 */
export async function removeBookComment(
  data: LikeBookCommentVo
): response<string> {
  return await post(urlPrefix + '/user/removeBookComment', data)
}
