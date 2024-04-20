<!-- 书本评论页 -->
<template>
  <div id="review">
    <div class="review-center">
      <div class="title-position">
        <div>当前位置：</div>
        <div class="position-href-list">
          <div class="position-href">
            <div @click="$router.push('/')" class="cursor-pointer">首页</div>
            <icon-right />
          </div>
          <div class="position-href">
            <div
              @click="
                $router.push(`/category/${bookSession.bookInfo.categoryId}`)
              "
              class="cursor-pointer"
            >
              {{ bookSession?.bookInfo?.categoryName }}
            </div>
            <icon-right />
          </div>
          <div
            @click="$router.push(`/detail/${bookSession.bookInfo.id}`)"
            class="position-href"
          >
            <div class="cursor-pointer">
              {{ bookSession?.bookInfo?.bookName }}
            </div>
            <icon-right />
          </div>
          <div class="position-href">
            <div>评论详情</div>
          </div>
        </div>
      </div>
      <!-- 书本信息 -->
      <div class="book-session">
        <a-spin
          :loading="pageData.infoLoading"
          tip="加载中"
          style="min-height: 200px"
        >
          <div class="book-info">
            <div v-show="bookSession.bookInfo">
              <ImgLoading
                style="width: 100%"
                :is-shadow="true"
                :have-tr="true"
                :url="bookSession?.bookInfo?.picUrl"
              />
              <div
                :title="bookSession?.bookInfo?.bookName"
                style="--limit: 1"
                class="book-title text-center leading-7 text-xl font-bold"
              >
                {{ bookSession?.bookInfo?.bookName }}
              </div>
              <span class="book-author text-sm">
                {{ bookSession?.bookInfo?.authorName }}
                <span class="text-xs">著</span>
              </span>
              <div
                class="book-session-of-number flex justify-center gap-1 text-xs"
              >
                <div>
                  订阅数 <span>{{ bookSession?.bookInfo?.subscription }}</span>
                </div>
                <div>
                  浏览数 <span>{{ bookSession?.bookInfo?.browse }}</span>
                </div>
              </div>
              <a-button
                class="operate"
                @click="$router.push(`/detail/${bookSession.bookInfo.id}`)"
              >
                书籍详情
              </a-button>
            </div>
          </div>
        </a-spin>
        <!-- 评论信息 -->
        <div class="book-comments">
          <div class="book-comment-title font-bold text-base">精彩评论</div>
          <a-spin v-if="bookComment?.length" :loading="pageData.commentLoading">
            <div class="book-comment-list">
              <div
                class="book-comment-item"
                v-for="item in bookComment"
                :key="item.id"
              >
                <div class="comment-user">
                  <ImgLoading
                    :is-shadow="true"
                    :have-tr="true"
                    :url="store.userImage + item?.userInfo?.userPhoto"
                    :isHave="true"
                  />
                </div>
                <div class="comment-session">
                  <div
                    class="user-nickName cursor-pointer"
                    @click="$router.push(`/people/${item?.userInfo?.id}/2`)"
                  >
                    {{ item.userInfo?.nickName }}
                  </div>
                  <div
                    class="comment-content"
                    :class="{ 'has-review': $route.query.comment == item.id }"
                  >
                    {{ item.commentContent }}
                  </div>
                  <div class="comment-from items-center">
                    <div class="comment-ip-from flex gap-2">
                      <div>{{ dateToString(item.createTime) }}</div>
                      <div>{{ item.ipAddress }}</div>
                    </div>
                    <div class="user-like flex justify-between gap-2">
                      <div class="flex justify-between gap-2">
                        <icon-heart
                          v-if="!item.likeBookComment"
                          @click="likeComment(item.id, true, item)"
                          class="like-icon no-like cursor-pointer"
                        />
                        <icon-heart-fill
                          @click="removeLikeComment(item.id, true, item)"
                          class="like-icon like cursor-pointer like"
                          v-else
                        />
                        <div>{{ item.userLike }}</div>
                      </div>
                      <div
                        @click="showReply(item, item, 0)"
                        class="cursor-pointer"
                      >
                        回复
                      </div>
                      <div
                        class="cursor-pointer"
                        @click="removeComment(item.id, true)"
                        v-if="item.userInfo.id == store.user.id"
                      >
                        删除
                      </div>
                    </div>
                  </div>
                  <!-- 回复评论 -->
                  <a-spin
                    v-if="item.bookCommentReply.length > 0"
                    :loading="pageData.replyCommentLoading"
                  >
                    <div class="comment-reply">
                      <div
                        class="comment-reply-item flex gap-3"
                        v-for="reply in item.showReply
                          ? item.bookCommentReply
                          : item.bookCommentReply.slice(0, 3)"
                        :key="reply.id"
                      >
                        <div class="reply-user-photo">
                          <ImgLoading
                            :is-shadow="true"
                            :have-tr="true"
                            :url="store.userImage + reply?.userInfo?.userPhoto"
                            :isHave="true"
                          />
                        </div>
                        <div class="reply-session">
                          <div class="reply-content flex gap-2">
                            <div
                              @click="
                                $router.push(`/people/${reply?.userInfo?.id}/2`)
                              "
                              :title="reply?.userInfo?.nickName"
                              class="cursor-pointer overflow"
                            >
                              {{ reply?.userInfo?.nickName }}:
                            </div>
                            <div
                              class="main-color cursor-pointer"
                              @click="
                                $router.push(`/people/${reply?.relplyUserId}/2`)
                              "
                              v-if="reply.isReply"
                            >
                              @{{ reply.replyUserName }}
                            </div>
                            <div
                              :class="{
                                'has-review':
                                  $route.query.insertReplyComment == reply.id,
                              }"
                            >
                              {{ reply.replyContent }}
                            </div>
                          </div>
                          <div class="comment-from mt-3 items-center">
                            <div class="comment-ip-from flex gap-2">
                              <div>{{ dateToString(reply.createTime) }}</div>
                              <div>{{ reply.ipAddress }}</div>
                            </div>
                            <div class="user-like flex justify-between gap-2">
                              <div class="flex justify-between gap-2">
                                <icon-heart
                                  v-if="!reply.likeBookComment"
                                  @click="likeComment(reply.id, false, reply)"
                                  class="like-icon no-like cursor-pointer"
                                />
                                <icon-heart-fill
                                  @click="
                                    removeLikeComment(reply.id, false, reply)
                                  "
                                  class="like-icon like cursor-pointer like"
                                  v-else
                                />
                                <div>{{ reply.userLike }}</div>
                              </div>
                              <div
                                @click="showReply(item, reply, 1)"
                                class="cursor-pointer"
                              >
                                回复
                              </div>
                              <div
                                class="cursor-pointer"
                                @click="removeComment(reply.id, false)"
                                v-if="reply.userInfo.id == store.user.id"
                              >
                                删除
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a-spin>
                  <!-- 评论翻页 -->
                  <div
                    v-if="parseInt(item.bookCommentReplyNumber) > 3"
                    class="comment-reply-number"
                  >
                    <div v-if="!item.showReply">
                      共{{ item.bookCommentReplyNumber }}条回复,
                      <span
                        class="a-hover cursor-pointer"
                        @click="item.showReply = true"
                        >点击查看</span
                      >
                    </div>
                    <div
                      class="comment-reply-page flex gap-2"
                      v-else-if="
                        Math.ceil(
                          parseInt(item.bookCommentReplyNumber) / pageData.limit
                        ) > 1
                      "
                    >
                      <div>
                        共{{
                          Math.ceil(
                            parseInt(item.bookCommentReplyNumber) /
                              pageData.limit
                          )
                        }}页
                      </div>
                      <div class="comment-page flex gap-2">
                        <div
                          @click="commentReplyLast(item)"
                          v-if="item.page > 1"
                        >
                          上一页
                        </div>
                        <div
                          @click="commentReplyPage(1, item)"
                          v-if="showLast(item)"
                        >
                          1
                        </div>
                        <div v-if="showLast(item)">...</div>
                        <div
                          @click="commentReplyPage(pageNum(item, index), item)"
                          :class="{
                            'main-color': item.page == pageNum(item, index),
                          }"
                          v-for="index in item.maxPage > 6 ? 5 : item.maxPage"
                        >
                          <div>
                            {{ pageNum(item, index) }}
                          </div>
                        </div>
                        <div v-if="showNext(item)">...</div>
                        <div
                          @click="commentReplyPage(item.maxPage, item)"
                          v-if="showNext(item)"
                        >
                          {{ item.maxPage }}
                        </div>
                        <div
                          @click="commentReplyNext(item)"
                          v-if="item.page < item.maxPage && item.maxPage > 1"
                        >
                          下一页
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-show="pageData.showReplyInput == item.id"
                    class="user-of-comment-reply flex px-5 py-4 bg-white gap-5"
                  >
                    <div
                      class="user-image w-10 h-10 rounded-full overflow-hidden"
                    >
                      <ImgLoading
                        :is-shadow="true"
                        :have-tr="true"
                        :url="
                          store.userImage +
                          (store.user.userPhoto
                            ? store.user.userPhoto
                            : '/user/default-avatar.jpg')
                        "
                        :isHave="true"
                      />
                    </div>
                    <div class="user-comment flex-1 flex gap-2">
                      <a-input
                        class="flex-1"
                        :placeholder="pageData.replyUserName"
                        size="large"
                        allow-clear
                        v-model:model-value="pageData.userReplyContent"
                      />
                      <a-button
                        @click="addBookComment(1)"
                        :class="{
                          'publish-comment-in': pageData.replyUserName,
                        }"
                        class="publish-comment"
                        >发布</a-button
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-spin>
          <a-empty class="empty flex justify-center flex-col gap-2" v-else>
            <template #image>
              <icon-book class="text-6xl" />
            </template>
            暂无评论列表
          </a-empty>
          <div
            ref="commentLoading"
            v-if="pageData.limit * pageData.pageSize < pageData.total"
            class="flex justify-center my-10 commentLoading"
          >
            <a-spin tip="加载中" />
          </div>
          <!-- <div v-else class="text-center my-8">没有更多评论</div> -->
          <!-- 底部回复栏 -->
          <a-affix class="bottom-affix" :offsetBottom="0" style="right: 0">
            <div
              class="border-t border-solid border-gray-300 user-comment-of-book-reply flex px-5 py-4 bg-white gap-5"
            >
              <div class="user-image w-10 h-10 rounded-full overflow-hidden">
                <ImgLoading
                  :is-shadow="true"
                  :have-tr="true"
                  :url="
                    store.userImage +
                    (store.user.userPhoto
                      ? store.user.userPhoto
                      : '/user/default-avatar.jpg')
                  "
                  :isHave="true"
                />
              </div>
              <div class="user-comment flex-1 flex gap-2">
                <a-input
                  class="flex-1"
                  placeholder="在评论区分享你的见解吧"
                  size="large"
                  allow-clear
                  v-model:model-value="pageData.replyContent"
                />
                <a-button
                  @click="addBookComment(0)"
                  :class="{ 'publish-comment-in': pageData.replyContent }"
                  class="publish-comment"
                  >发布</a-button
                >
              </div>
            </div>
          </a-affix>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as bookCommentApi from '../api/BookComment'
import { bookInfoDto, bookInfo } from '../api/BookInfo'
import { useRoute } from 'vue-router'
import ImgLoading from '../components/ImgLoading.vue'
import { dateToString } from '../utils/commonUtils'
import { mainStore } from '../store'
import Message from '@arco-design/web-vue/es/message'
let store = mainStore()
const route = useRoute()
interface ReviewDto extends bookCommentApi.ReviewDto {
  showReply: boolean
  limit: number
  page: number
  maxPage: number
}
let bookSession = ref<bookInfoDto>({} as bookInfoDto)
let bookComment = ref<ReviewDto[]>([])
let pageData = ref({
  infoLoading: false,
  commentLoading: false,
  replyCommentLoading: false,
  pageSize: 1,
  limit: 10,
  total: 0,
  allLoading: false,
  showReply: -1,
  replyContent: '',
  showReplyInput: '',
  replyUserName: '',
  userReplyContent: '',
  ReplyId: '',
  isReply: 0,
  replyUserId: '',
  commentFather: {},
  searchId: '',
})

const pageNum = (item: ReviewDto, index: number) => {
  return (item.page <= 4 && item.page <= item.maxPage - 5) || item.maxPage <= 6
    ? index
    : item.page > item.maxPage - 5
    ? item.maxPage - 5 + index
    : item.page - 3 + index
}

const showLast = (item: ReviewDto) => {
  return (
    (item.page > 4 ||
      item.page >
        Math.ceil(
          parseInt(item.bookCommentReplyNumber) / pageData.value.limit
        ) -
          5) &&
    item.maxPage > 6
  )
}

const showNext = (item: ReviewDto) => {
  return item.page <= item.maxPage - 5 && item.maxPage > 6
}

/**
 * 回复评论上一页
 */
const commentReplyLast = (item: ReviewDto) => {
  item.page -= 1
  getBookComments(item.page, item.limit, item.id)
}

/**
 * 回复评论下一页
 */
const commentReplyNext = (item: ReviewDto) => {
  item.page += 1
  getBookComments(item.page, item.limit, item.id)
}

/**
 * 根据页码翻页
 */
const commentReplyPage = (index: number, item: ReviewDto) => {
  item.page = index
  getBookComments(item.page, item.limit, item.id)
}

/**
 * 显示回复输入框
 */
const showReply = (
  father: ReviewDto,
  item: ReviewDto | bookCommentApi.BookCommentReplyDto,
  isReply: number
) => {
  if (!store.user) {
    Message.warning('请先登录账号')
    return
  }
  pageData.value.showReplyInput = father.id
  pageData.value.replyUserName = '回复 @' + item.userInfo.nickName + ':'
  pageData.value.userReplyContent = ''
  pageData.value.ReplyId = father.id
  pageData.value.replyUserId = isReply ? item.userInfo.id + '' : ''
  pageData.value.isReply = isReply
  pageData.value.commentFather = father
  // addBookComment(1)
}

/**
 * 发表评论
 * @param isReply 评论
 */
const addBookComment = (isReply: number) => {
  // 普通书本评论
  let func
  if (isReply) {
    // 判断评论内容是否为空
    if (!pageData.value.userReplyContent.trim()) {
      Message.normal('你还没有评论')
      return
    }
    func = bookCommentApi.insertCommentReply({
      commentId: pageData.value.ReplyId,
      content: pageData.value.userReplyContent,
      userId: pageData.value.replyUserId,
    })
  } else {
    if (!store.user) {
      Message.warning('请先登录账号')
      return
    } else if (!pageData.value.replyContent.trim()) {
      Message.normal('你还没有评论')
      return
    }
    func = bookCommentApi.insertComment({
      bookId: bookSession.value.bookInfo.id as string,
      content: pageData.value.replyContent,
    })
  }
  // 判断是否登录
  func.then((r) => {
    if (r.data.status == 200) {
      Message.success('发布评论成功')
      // 插入发布的评论
      if (isReply) {
        ;(pageData.value.commentFather as ReviewDto).bookCommentReply.unshift(
          r.data.data as bookCommentApi.BookCommentReplyDto
        )
        pageData.value.userReplyContent = ''
      } else {
        bookComment.value.unshift(r.data.data as ReviewDto)
        pageData.value.replyContent = ''
      }
    }
  })
}

/**
 * 获取书本信息
 */
const getBookInfo = async () => {
  const bookId = route.query['id'] as string
  pageData.value.infoLoading = true
  return await bookInfo(bookId).then((r) => {
    if (r.data.status == 200) {
      bookSession.value = r.data.data
    }
    pageData.value.infoLoading = false
  })
}

// 获取书本评论、回复的评论
const getBookComments = async (
  pageSize: number,
  limit: number,
  commentId?: string,
  searchId?: string,
  type?: string
) => {
  // pageData.value.loading = true
  const bookId = route.query['id'] as string

  if (!commentId) {
    pageData.value.commentLoading = true
  } else pageData.value.replyCommentLoading = true
  return await bookCommentApi
    .commentList(
      pageSize,
      limit,
      commentId ? null : bookId,
      commentId,
      !searchId ? '' : searchId,
      !type ? '' : type
    )
    .then((r) => {
      if (r.data.status == 200) {
        if (!commentId) {
          // 获取书本评论
          let nowComment = r.data.data.list.map((item: any) => {
            let data: ReviewDto = item as any
            data.showReply = false
            data.limit = 10
            data.page = 1
            data.maxPage = Math.ceil(
              parseInt(item.bookCommentReplyNumber) / pageData.value.limit
            )
            return data
          })
          if (
            pageData.value.limit * pageData.value.pageSize >
            bookComment.value.length
          )
            bookComment.value = [...bookComment.value, ...nowComment]
          else bookComment.value = nowComment
          pageData.value.total = r.data.data.total
          pageData.value.commentLoading = false
        } else {
          // 根据被回复评论id，增加回复评论
          bookComment.value = bookComment.value?.map((comment) => {
            if (comment.id == commentId) {
              comment.bookCommentReply = r.data.data
                .list as bookCommentApi.BookCommentReplyDto[]
              comment.bookCommentReplyNumber = r.data.data.total + ''
            }
            return comment
          })
          pageData.value.replyCommentLoading = false
        }
      }
    })
}

/**
 * @param commentId 评论id
 * @param isReply 是否是回复评论
 * @param item 点赞评论对象
 * 点赞评论
 */
const likeComment = (
  commentId: string,
  isReply: boolean,
  item: ReviewDto | bookCommentApi.BookCommentReplyDto
) => {
  if (!store.user) Message.warning('请先登录账号')
  else {
    bookCommentApi
      .likeBookComment({
        commentId,
        isReply,
      })
      .then((r) => {
        if (r.data.status == 200) {
          item.userLike = parseInt(item.userLike) + 1 + ''
          item.likeBookComment = true
        }
      })
  }
}

/**
 * @param commentId 评论id
 * @param isReply 是否是回复评论
 * @param item 点赞评论对象
 * 取消点赞评论
 */
const removeLikeComment = (
  commentId: string,
  isReply: boolean,
  item: ReviewDto | bookCommentApi.BookCommentReplyDto
) => {
  bookCommentApi
    .removeBookComment({
      commentId,
      isReply,
    })
    .then((r) => {
      if (r.data.status == 200) {
        item.userLike = parseInt(item.userLike) + -1 + ''
        item.likeBookComment = false
      }
    })
}

/**
 * 删除评论
 * @param commentId 评论id
 * @param isReply 是否是普通评论
 */
const removeComment = (commentId: string, isReply: boolean) => {
  bookCommentApi
    .removeCommentReply({
      commentId,
      isReply,
    })
    .then((r) => {
      if (r.data.status == 200) {
        getBookComments(pageData.value.pageSize, pageData.value.limit).then(
          (r) => {
            Message.success('删除成功')
          }
        )
      }
    })
}

const commentLoading = ref<HTMLElement>(null as any)

onMounted(() => {
  let type
  if (route.query.comment || route.query.insertReplyComment) {
    pageData.value.searchId =
      (route.query.comment as string) ||
      (route.query.insertReplyComment as string)
    type = route.query.comment ? 'comment' : 'insertReplyComment'
  }
  pageData.value.allLoading = true
  Promise.all([
    getBookInfo(),
    getBookComments(
      pageData.value.pageSize,
      pageData.value.limit,
      undefined,
      pageData.value.searchId,
      type
    ),
  ]).then(() => {
    pageData.value.allLoading = false
    const observer = new IntersectionObserver((entries: any[]) => {
      if (entries[0].isIntersecting) {
        pageData.value.pageSize += 1
        getBookComments(pageData.value.pageSize, pageData.value.limit)
        if (
          pageData.value.pageSize * pageData.value.limit >
          pageData.value.total
        )
          observer.disconnect()
      }
    })

    observer.observe(commentLoading.value)
  })
})
</script>
<style lang="scss" scoped>
#review {
  background-color: white;
  margin-bottom: 30px;
  .review-center {
    width: 85%;
    margin: 0 auto;
    .title-position {
      display: flex;
      align-items: center;
      padding: 30px 0;
      .position-href-list {
        display: flex;
        align-items: center;
        font-size: 12px;
        .position-href {
          color: #666;
          display: flex;
          align-items: center;
          > * {
            &:last-child {
              margin: 0 6px;
            }
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }

    .book-session {
      display: flex;
      gap: 30px;
      $sessionW: 185px;
      flex-basis: 0;
      .book-info {
        border: 1px solid #f0f0f0;
        box-sizing: content-box;
        padding: 20px 30px;

        width: $sessionW;
        > div {
          display: flex;
          align-items: center;
          flex-direction: column;
          gap: 10px;
          > div {
            width: $sessionW;
          }
          .book-author {
            color: #333;
            > span {
              color: #999;
            }
          }
          .operate {
            background: white;
            border: 0.0625rem solid rgb(var(--qing-color));
            color: rgb(var(--qing-color));
            padding: 15px 25px;
            border-radius: 12px;
          }
          .book-session-of-number {
            > div {
              color: #999;
              span {
                color: #333;
                font-weight: 700;
              }
              &:last-child {
                margin-left: 5px;
              }
            }
          }
        }
      }
      .book-comments {
        flex: 1 1 0;
        overflow: hidden;
        .book-comment-title {
          background-color: #f1f2f4;
          // padding-bottom: 5px;
          padding: 10px;
        }
        color: #18191c;

        .book-comment-list {
          display: flex;
          flex-direction: column;
          gap: 22px;
          padding-top: 40px;
          .book-comment-item {
            box-sizing: border-box;
            // padding: 22px 0 0;
            display: flex;
            gap: 15px;

            .comment-user {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              overflow: hidden;
            }
            .comment-session {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 15px;
              padding-bottom: 20px;
              border-bottom: 1px solid #e3e5e7;
              .user-nickName {
                font-weight: 700;
                font-size: 16px;
              }

              .comment-from {
                display: flex;
                gap: 20px;
                font-size: 12px;
                .user-like {
                  > * {
                    line-height: 20px;
                  }
                  .like-icon {
                    font-size: 20px;
                  }
                  .like {
                    color: red;
                  }
                  .no-like {
                    color: #999;
                  }
                }
              }
              .comment-reply {
                display: flex;
                flex-direction: column;
                .comment-reply-item {
                  margin-top: 20px;
                  &:first-child {
                    margin-top: 0;
                  }
                  .reply-user-photo {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    overflow: hidden;
                  }
                  .reply-session {
                    flex: 1;
                    flex-basis: 0;
                    .reply-content {
                      flex: 1;
                      > div {
                        &:first-child {
                          max-width: 100px;
                        }
                        &:last-child {
                          flex: 1;
                          flex-basis: 0;
                        }
                      }
                    }
                  }
                }
              }
              .comment-reply-number {
                .comment-reply-page {
                  .comment-page {
                    > div {
                      cursor: pointer;
                      &:hover {
                        color: rgb(var(--qing-color));
                      }
                    }
                  }
                }
              }
            }
          }
        }
        .empty {
          height: 500px;
        }
        @media screen and (max-width: 1520px) {
          .bottom-affix {
            :deep .arco-affix {
              right: 0;
            }
          }
        }

        .user-comment-of-book-reply {
          @at-root .publish-comment {
            height: 100%;
            background: #7fd6f5;
            color: white;
            width: 80px;
            &:hover {
              color: white;
              background: #00aeec;
            }
          }
          @at-root .publish-comment-in {
            background: #00aeec !important;
          }
        }
      }
    }
  }
  .has-review {
    animation: showHas 3s ease;
    @keyframes showHas {
      0% {
        background-color: white;
      }
      25% {
        background-color: #f1f2f4;
      }
      50% {
        background-color: white;
      }
      75% {
        background-color: #f1f2f4;
      }
      100% {
        background-color: white;
      }
    }
  }
}
</style>
