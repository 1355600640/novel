<template>
  <div class="detail">
    <div class="bookCategory">
      <div class="cursor-pointer a-hover" @click="$router.push('/')">首页</div>
      <icon-right class="dark-text" />
      <div
        @click="$router.push('/category/' + bookSession.bookInfo?.categoryId)"
        class="cursor-pointer a-hover"
      >
        {{ bookSession.bookInfo?.categoryName }}
      </div>
      <icon-right class="dark-text" />
      <div>{{ bookSession.bookInfo?.bookName }}</div>
    </div>
    <div class="bookSession">
      <div class="bookEasySession">
        <div class="book-image">
          <ImgLoading
            style="width: 100%; height: 100%"
            :url="bookSession.bookInfo?.picUrl"
          />
        </div>
        <div class="book-content-session">
          <div style="font-size: 30px" class="font-bold flex content-center">
            {{ bookSession.bookInfo?.bookName }}
            <span :class="{ 'vip-tags': bookSession.bookInfo?.isVip }"></span>
          </div>
          <div class="book-tags">
            <div
              @click="
                $router.push('/category/' + bookSession.bookInfo?.categoryId)
              "
              style="border-color: rgb(250, 174, 34); color: rgb(250, 174, 34)"
            >
              {{ bookSession.bookInfo?.categoryName }}
            </div>
            <div
              @click="
                $router.push(
                  `/category?status=${bookSession.bookInfo?.bookStatus}`
                )
              "
              :style="[
                `border-color:${
                  bookSession.bookInfo?.bookStatus == 0 ? '#2687d9' : 'red'
                }`,
                `color:${
                  bookSession.bookInfo?.bookStatus == 0 ? '#2687d9' : 'red'
                }`,
              ]"
            >
              {{ bookSession.bookInfo?.bookStatus == 1 ? '已完结' : '连载' }}
            </div>
          </div>
          <div class="book-statistics">
            <div>
              {{
                bookSession.bookInfo?.visitCount > 10000
                  ? parseInt(
                      (bookSession.bookInfo?.visitCount / 1000).toFixed(0)
                    ) / 10
                  : bookSession.bookInfo?.visitCount
              }}<span
                >{{
                  bookSession.bookInfo?.visitCount > 10000 ? '万' : ''
                }}总点击</span
              >
            </div>
            <span></span>
            <div>
              {{
                bookSession.bookInfo?.wordCount > 10000
                  ? parseInt(
                      (bookSession.bookInfo?.wordCount / 1000).toFixed(0)
                    ) / 10
                  : bookSession.bookInfo?.wordCount
              }}<span
                >{{
                  bookSession.bookInfo?.wordCount / 10000 > 0 ? '万' : ''
                }}字数</span
              >
            </div>
          </div>
          <div class="book-time">
            <span>最新章节:</span>
            <span
              class="ml-2 a-hover cursor-pointer"
              @click="
                $router.push(
                  `/chapter/${bookSession.bookInfo?.id}?pageId=${bookSession.bookInfo?.lastChapterId}`
                )
              "
              :class="{ 'vip-tags': catelogue[catelogue.length]?.isVip }"
              >{{ bookSession.bookInfo?.lastChapterName }}</span
            >
            <span class="ml-5">{{
              stringToDate(bookSession.bookInfo?.lastChapterUpdateTime, 'all')
            }}</span>
          </div>
          <div class="book-button">
            <button
              @click="
                $router.push(
                  `/chapter/${
                    bookSession.bookInfo.id +
                    (bookSession!.userReadHistory?.preContentId
                      ? `?pageId=${bookSession!.userReadHistory?.preContentId}`
                      : '')
                  }`
                )
              "
            >
              {{
                bookSession!.userReadHistory?.preContentId
                  ? '继续阅读'
                  : '立即阅读'
              }}
            </button>
            <button
              :class="{ 'in-bookshelf': bookSession.inBookshelf }"
              @click="toBookshelf"
            >
              {{ bookSession.inBookshelf ? '已在书架' : '加入书架' }}
            </button>
            <button
              @click="$router.push(`/review?id=${bookSession.bookInfo.id}`)"
            >
              查看评论
            </button>
          </div>
        </div>
      </div>
      <div class="author-session">
        <div
          class="author-img cursor-pointer"
          @click="$router.push(`/people/${bookSession.bookInfo?.authorId}`)"
        >
          <!-- <a-image src="" width="100%" height="100%" /> -->
          <img
            style="width: 100%; height: 100%"
            :src="store.mainImage + '/user/default-avatar.jpg'"
            alt=""
          />
        </div>
        <div
          @click="$router.push(`/people/${bookSession.bookInfo?.authorId}`)"
          class="text-base cursor-pointer"
        >
          {{ bookSession.bookInfo?.authorName }}
        </div>
        <div class="flex items-center gap-1 cursor-pointer a-hover">
          <img
            style="width: 25px"
            :src="store.mainImage + '/userIcon/4605684.png'"
            alt=""
          />
          <span
            @click="$router.push(`/people/${bookSession.bookInfo?.authorId}`)"
            >作者百科</span
          >
        </div>
        <!-- <div></div> -->
        <button @click="toFollowAuthor">
          {{ bookSession.followAuthor ? '已关注' : '关注' }}
        </button>
      </div>
    </div>
    <div class="book-content">
      <div class="book-session-content">
        <a-tabs
          default-active-key="1"
          :active-key="defaultKey"
          @tab-click="(index) => (defaultKey = index as string)"
        >
          <a-tab-pane key="1" title="作品信息">
            <div class="Work-information">
              <div class="Introduction-of-works">
                <div class="text-2xl font-bold">作品简介</div>
                <div
                  class="mt-4 text-base"
                  v-html="bookSession.bookInfo?.bookDesc"
                ></div>
              </div>
              <div class="chapter-one">
                <div class="text-xl font-bold">
                  {{ numberToCapital(bookSession.fristPageName) }}
                </div>
                <div
                  class="chater-one-content"
                  v-html="bookSession.fristPageContent"
                ></div>
                <!-- 跳转第二章 -->
                <div class="flex items-center">
                  <button
                    @click="
                      $router.push(`/chapter/${bookSession.bookInfo.id}&page=1`)
                    "
                    class="flex items-center"
                  >
                    继续阅读<icon-right class="next-page" />
                  </button>
                </div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" :title="`目录${catelogue.length}`">
            <div class="book-catalogue mb-10">
              <div>
                <span>正文</span>
                <span class="ml-2">共{{ catelogue.length }}章</span>
                <span class="mx-2">·</span>
                <span>本卷共{{ bookSession.bookInfo?.wordCount }}字</span>
              </div>
              <div class="book-catalogue-list">
                <div
                  class="a-hover cursor-pointer"
                  v-for="item in catelogue"
                  :key="item.id"
                  @click="
                    $router.push(
                      `/chapter/${bookSession.bookInfo?.id}/${item.chapterNum}`
                    )
                  "
                >
                  {{ numberToCapital(item.chapterName) }}
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="other-book">
        <div class="rank-book-list" :key="ranBooks?.title">
          <div class="title" :class="'gradation-1'">
            <div class="title-icon"><i class="iconfont icon-guiye"></i></div>
            <div>{{ ranBooks?.title }}</div>
            <div class="title-icon"><i class="iconfont icon-guiye"></i></div>
          </div>
          <BookList :rank-list="ranBooks?.list" />
          <div class="text-right pr-1">
            <span
              @click="
                $router.push(
                  `/rank?categoryId=${ranBooks?.categoryId}&rankType=${ranBooks?.rankType}`
                )
              "
              class="cursor-pointer hover:font-bold hover:text-red-600 text-neutral-400 more pr-3 text-sm"
            >
              更多<icon-right
            /></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BookList from '../components/BookList.vue'
import { stringToDate, numberToCapital } from '../utils/commonUtils'
import ImgLoading from '../components/ImgLoading.vue'
import {
  bookInfo,
  bookInfoDto,
  bookCatalogue,
  inserBookshelf,
  removeBookshelf,
} from '../api/BookInfo'
import { defaultValue } from '../api/Rank'
import { onMounted, ref, Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { mainStore } from '../store'
let store = mainStore()
const route = useRoute()
const router = useRouter()
let bookSession = ref<bookInfoDto>({} as bookInfoDto)
let catelogue: Ref<any[]> = ref([])
let defaultKey = ref('1')
// 获取书本详情
const getBookInfo = (bookId: string) => {
    bookInfo(bookId).then((r) => {
      if (r.data.status == 200) {
        bookSession.value = r.data.data
      }
    })
  },
  ranBooks = ref({} as any)

/**
 * 获取排行榜
 */
const getRank = async () => {
  await defaultValue({
    pageSize: 0,
    limit: 10,
  }).then((r) => {
    console.log(r.data.data)

    ranBooks.value = r.data.data[0]
  })
}

// 获取书本目录
const getBookCatelogue = (bookId: string) => {
  bookCatalogue(bookId).then((r) => {
    if (r.data.status == 200) {
      catelogue.value = r.data.data
    }
  })
}

/**
 * 加入/移出书架
 */
const toBookshelf = () => {
  let func
  if (!store.user.id) {
    Message.error('请先登录账号')
    return
  }
  if (!bookSession.value.inBookshelf) {
    func = inserBookshelf(bookSession.value.bookInfo.id + '')
  } else {
    func = removeBookshelf([bookSession.value.bookInfo.id + ''])
  }
  func.then((r) => {
    if (r.data.status == 200) {
      bookSession.value.inBookshelf = !bookSession.value.inBookshelf
      getBookInfo(bookSession.value.bookInfo.id + '')
      Message.success(
        bookSession.value.inBookshelf ? '加入书架成功' : '移出书架成功'
      )
    } else
      Message.success(
        bookSession.value.inBookshelf ? '加入书架失败' : '移出书架失败'
      )
  })
}

import { removeFollow, followAuthor } from '../api/Author'
/**
 * 关注/取消作者
 */
const toFollowAuthor = () => {
  let func
  if (!store.user.id) {
    Message.error('请先登录账号')
    return
  }
  if (!bookSession.value.followAuthor) {
    func = followAuthor(bookSession.value.authorInfo.id)
  } else func = removeFollow(bookSession.value.authorInfo.id)
  func.then((r) => {
    if (r.data.status == 200) {
      bookSession.value.followAuthor = !bookSession.value.followAuthor
      getBookInfo(bookSession.value.bookInfo.id + '')
      Message.success(
        bookSession.value.followAuthor ? '关注作者成功' : '取消关注作者成功'
      )
    } else
      Message.success(
        bookSession.value.followAuthor ? '关注作者失败' : '取消关注作者失败'
      )
  })
}
onMounted(() => {
  const bookId = route.params.id as string
  if (!bookId) {
    router.push('/')
  }
  getBookInfo(bookId)
  getBookCatelogue(bookId)
  getRank()
  if (route.params.key) {
    defaultKey.value = route.params.key + ''
  }
})
</script>
<style lang="scss" scoped>
.detail {
  width: 78%;
  margin: 0 auto 50px;
  .bookCategory {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 40px 0;
    color: #7b7b7b;
    font-size: 14px;
  }
  .bookSession {
    display: grid;
    grid-template-columns: 7fr 3fr;
    gap: 10px;
    .bookEasySession {
      display: flex;
      gap: 30px;
      .book-image {
        width: 25%;
        box-sizing: border-box;
        // overflow: hidden;

        position: relative;
        &::before {
          content: ' ';
          position: absolute;
          width: 100%;
          height: 92%;
          background: white;
          border: 1px solid #d0d3d6;
          top: 10px;
          border-radius: 6px;
          left: 10px;
        }
        &:hover :deep > div img {
          transform: scale(1.1);
        }
        > div {
          box-shadow: 1px 3px 0.5625rem #c2c2c2;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          :deep img {
            transition: all 0.3s ease;
          }
        }
      }
      .book-content-session {
        display: flex;
        flex-direction: column;
        gap: 30px;
        flex-direction: column;
        .book-tags {
          display: flex;
          flex-direction: row;
          gap: 10px;
          > div {
            cursor: pointer;
            border: 1px solid;
            padding: 5px 8px;
            border-radius: 6px;
            font-size: 14px;
          }
        }
        .book-statistics {
          display: flex;
          align-items: center;
          gap: 15px;
          > span {
            width: 1px;
            height: 70%;
            background-color: #999;
          }
          > div {
            font-size: 16px;
            > span {
              font-size: 12px;
              color: #999;
              margin-left: 3px;
            }
          }
        }

        .book-time {
          display: flex;
          align-items: center;
          @at-root .vip-tags {
            display: flex;
            align-items: center;
            &::before {
              content: ' ';
              display: block;
              width: 25px;
              height: 25px;
              background: url('../assets/image/vip.png') no-repeat center center;
              background-size: 100% 100%;
            }
          }
        }
        .book-button {
          display: flex;
          gap: 20px;

          .in-bookshelf {
            border: 1px solid #dcdddf !important;
            color: #999 !important;
          }
          > button {
            border-radius: 16px;
            padding: 10px 25px;
            color: white;

            &:first-child {
              transition: all 0.6s ease;
              background: linear-gradient(90deg, red, #ff8d00);
              position: relative;
              background-size: 100%;

              &:hover {
                background-size: 200%;
              }
              // &:hover::after {
              //   width: 100%;
              // }
              // &:hover::before {
              //   width: 0%;
              //   right: 0;
              // }
            }
            &:nth-child(2) {
              background: white;
              border: 1px solid rgb(var(--qing-color));
              color: rgb(var(--qing-color));
            }
            &:nth-child(3) {
              background: white;
              background-color: rgb(var(--qing-color));
              color: white;
            }
          }
        }
      }
    }
    .author-session {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      border: 1px solid white;
      border-radius: 16px;
      gap: 10px;
      background: linear-gradient(133deg, #dceeff, white);
      .author-img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
      }
      button {
        border: 1px solid red;
        color: #999;
        padding: 8px 25px;
        transition: all 0.3s ease;
        border-radius: 16px;
        color: red;
        &:hover {
          color: rgb(var(--qing-color));
          border-color: rgb(var(--qing-color));
        }
      }
    }
  }

  .book-content {
    margin-top: 40px;
    gap: 30px;
    display: flex;
    .book-session-content {
      flex: 8;
      padding: 20px 35px;
      background: white;
      border-radius: 16px;
      box-sizing: border-box;
      :deep .arco-tabs-tab-title {
        font-size: 20px;
      }
      :deep .arco-tabs-tab-active {
        color: rgb(78, 89, 105);
      }
      .Work-information {
        box-sizing: border-box;
        padding: 20px 0;
        .Introduction-of-works > div:last-child {
          line-height: 30px;
          border-bottom: 1px solid #c2c2c2;
          padding-bottom: 30px;
        }
        .chapter-one {
          margin-top: 30px;
          .chater-one-content {
            font-size: 16px;
            margin-top: 30px;
            line-height: 25px;
          }
          button {
            padding: 12px 50px;
            border: 1px solid #7b7b7b;
            color: #7b7b7b;
            border-radius: 22px;
            margin: 20px auto 0;
            transition: all 0.3s ease;
            font-size: 16px;
            &:hover {
              color: rgb(var(--qing-color));
              border-color: rgb(var(--qing-color));
            }
            &:hover .next-page {
              animation: nextPage 1s ease;
              @keyframes nextPage {
                0% {
                  transform: translateX(0%);
                }
                25% {
                  transform: translateX(25%);
                }
                50% {
                  transform: translateX(0%);
                }
                75% {
                  transform: translateX(25%);
                }
                100% {
                  transform: translateX(0%);
                }
              }
            }
          }
        }
      }
      .book-catalogue {
        margin-top: 20px;
        > div:first-child {
          display: flex;
          align-items: center;
          > span {
            font-size: 14px;
            color: #7b7b7b;
            &:first-child {
              font-weight: 700;
              font-size: 20px;
              color: rgb(var(--qing-color));
            }
          }
        }

        .book-catalogue-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          margin-top: 30px;
          font-size: 13px;
          row-gap: 20px;
          font-size: 16px;
          color: #666;
        }
      }
    }
    .other-book {
      flex: 3;
      font-size: 14px;
      border-radius: 16px;
      overflow: hidden;
      .rank-book-list {
        background: white;
        padding-bottom: 20px;

        .title {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 15px 0;
          font-size: 20px;
          > div {
            overflow: hidden;
            > i {
              width: 200%;
              display: block;
              font-size: 36px;
            }
            &:first-child {
            }
            &:nth-child(2) {
              font-weight: 700;
              margin: 0 15px;
            }
            &:last-child {
              i {
                transform: translateX(-50%);
              }
            }
          }
        }
        .book-list {
          overflow: hidden;
          box-sizing: border-box;
          padding: 0px 24px 10px;
        }
      }
    }
  }
}
</style>
