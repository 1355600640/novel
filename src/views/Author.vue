<!-- 作者页 -->
<template>
  <div id="people">
    <!-- 作者信息 -->
    <div class="people-session">
      <div class="author-img">
        <div class="author-img-el">
          <ImgLoading
            :url="
              '/api/images' +
              (people.isAuthor
                ? people?.authorInfo?.authorImage
                : people?.userInfo?.userPhoto)
            "
            :is-have="true"
            :have-tr="true"
          />
        </div>
      </div>
      <div class="author-about">
        <div class="autor-penName">
          {{
            people.isAuthor
              ? people?.authorInfo?.penName
              : people?.userInfo?.nickName
          }}
        </div>
        <div class="author-tags" v-if="people.isAuthor">
          <div>
            <img
              :src="store.mainImage + '/userIcon/authorizationAuthor.png'"
              alt=""
            />
            <span>金牌作者</span>
          </div>
        </div>
        <div class="author-about-session" v-if="people.isAuthor">
          <div>
            <span>本站作品</span><span>{{ people.authorInfo.bookNum }}</span>
          </div>
          <span> </span>
          <div>
            <span>累计字数</span
            ><span>{{ normNumber(people.authorInfo.words, 1) }}</span>
          </div>
          <span> </span>
          <div>
            <span>创作天数</span
            ><span>{{ dateToNum(people.authorInfo.createTime) }}</span>
          </div>
        </div>
        <div class="user-about-session" v-else>
          <div class="session-item">
            <span>关注TA</span><span>{{ people?.userInfo?.fansNumber }}</span>
          </div>
          <div class="divider"></div>
          <div class="session-item">
            <span>关注</span><span>{{ people?.userInfo?.follow }}</span>
          </div>
        </div>
        <div class="author-intro">
          <span class="font-bold">简介: </span>
          <span v-if="people.isAuthor">
            {{ people?.authorInfo?.intro || '暂无作者简介~' }}
          </span>
          <span v-else>
            {{ people?.userInfo?.intro || 'Ta还有点神秘哦~' }}
          </span>
        </div>
      </div>
      <div class="author-notice">
        <ul>
          <li>
            ·
            {{
              stringToDate(
                people.isAuthor
                  ? people?.authorInfo?.createTime
                  : people?.userInfo?.createTime,
                'date'
              )
            }}加入本网站
          </li>
        </ul>
      </div>
    </div>
    <div class="author-works">
      <a-tabs
        :lazy-load="true"
        @change="changeTab"
        :default-active-key="!route.params.isAuthor ? 1 : 2"
      >
        <a-tab-pane v-if="people.isAuthor" :key="1" title="作品">
          <a-spin tip="加载中..." :loading="loading" class="loading" dot>
            <div class="book-list">
              <div class="book" v-for="item in bookList" :key="item.id">
                <ImgLoading style="width: 82px" :url="item.picUrl" />
                <div class="book-sesssion">
                  <div
                    class="cursor-pointer a-hover book-name font-bold text-base"
                  >
                    {{ item.bookName }}
                  </div>
                  <div class="book-status">
                    、
                    <span>{{
                      item.bookStatus == 1 ? '已完结' : '连载中'
                    }}</span>
                    <span class="br"></span>
                    <span>{{ item.categoryName }}</span>
                  </div>
                  <div title="item.bookDes" class="book-intro">
                    {{ item.bookDesc }}
                  </div>
                  <div class="book-new-page">
                    <span>最新章节:</span>
                    <span
                      @click="
                        $router.push(
                          `/chapter/${item.id}?pageId=${item.lastChapterId}`
                        )
                      "
                      >{{ item.lastChapterName }}</span
                    >
                  </div>
                </div>
                <div
                  class="text-sm read-book text-overflow"
                  @click="$router.push(`/chapter/${item.id}/0`)"
                >
                  立即阅读
                </div>
              </div>
            </div>
            <div v-if="pageSession.total > pageSession.num" class="page">
              <a-pagination
                :total="pageSession.total"
                :current="pageSession.page"
                :page-size="pageSession.num"
              />
            </div>
          </a-spin>
        </a-tab-pane>
        <a-tab-pane :key="2" title="在读">
          <a-spin tip="加载中..." :loading="loading" class="loading" dot>
            <div class="book-list">
              <div class="book" v-for="item in bookshelf" :key="item.id">
                <ImgLoading style="width: 82px" :url="item.picUrl" />
                <div class="book-sesssion">
                  <div
                    class="cursor-pointer a-hover book-name font-bold text-base"
                  >
                    {{ item.bookName }}
                  </div>
                  <div class="book-status">
                    <span>{{ item.authorName }}</span>
                    <span class="br"></span>
                    <span>{{
                      item.bookStatus == 1 ? '已完结' : '连载中'
                    }}</span>
                    <span class="br"></span>
                    <span>{{ item.categoryName }}</span>
                    ·
                    <span>{{ normNumber(item.wordCount, 1) }}字</span>
                  </div>
                  <div title="item.bookDes" class="book-intro">
                    {{ item.bookDesc }}
                  </div>
                  <div class="book-new-page">
                    <span>最新章节:</span>
                    <span
                      @click="
                        $router.push(
                          `/chapter/${item.id}?pageId=${item.lastChapterId}`
                        )
                      "
                      >{{ item.lastChapterName }}</span
                    >
                  </div>
                </div>
                <div
                  class="text-sm read-book text-overflow"
                  @click="$router.push(`/chapter/${item.id}/0`)"
                >
                  立即阅读
                </div>
              </div>
            </div>
          </a-spin>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { authorSession, People, authorOfBook } from '../api/Author'
import { ref, reactive, Ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { normNumber, dateToNum, stringToDate } from '../utils/commonUtils'
import ImgLoading from '../components/ImgLoading.vue'
import { mainStore } from '../store'
let store = mainStore()
const route = useRoute()

let people: Ref<People> = ref({} as People)
let bookList: Ref<any[]> = ref([])
let pageSession = reactive({
  page: 1,
  num: 8,
  total: 0,
})
let loading = ref(true)
// 获取作者信息
const getAuthorSession = async (authodId: string, isAuthor: number) => {
  return await authorSession(authodId, isAuthor).then((r) => {
    if (Object.keys(r.data.data).length == 0) {
      Message.error('没有作者信息')
    } else {
      people.value = r.data.data
    }
  })
}

// 获取作者相关作品
const getAuthorOfBook = (authorId: string) => {
  loading.value = true
  authorOfBook(authorId, pageSession.page, pageSession.num).then((r) => {
    loading.value = false
    bookList.value = (r.data.data.bookInfo as any[]).map((r) => {
      const dom = document.createElement('div')
      dom.innerHTML = r.bookDesc
      r.bookDesc = dom.innerText.trim()
      return r
    })
    pageSession.total = parseInt(r.data.data.total)
  })
}

const changeTab = (key: number | string) => {
  pageSession = {
    page: 1,
    num: 8,
    total: 0,
  }
  if ((key as number) == 1) {
    const authodId: string = route.params.id as string
    getAuthorOfBook(authodId)
  } else if ((key as number) == 2) {
    getUserBookList()
  }
}

import { userBookshelf, UserReadDto } from '../api/BookInfo'
let bookshelf = ref<UserReadDto[]>([] as UserReadDto[])
// 获取用户书架列表
const getUserBookList = async () => {
  loading.value = true
  return await userBookshelf(
    pageSession.page,
    pageSession.num,
    0,
    people.value.userInfo.id
  ).then((r) => {
    loading.value = false
    if (r.status == 200) {
      bookshelf.value = r.data.data.list.map((r) => {
        const dom = document.createElement('div')
        dom.innerHTML = r.bookDesc
        r.bookDesc = dom.innerText.trim()
        return r
      })
      pageSession.total = r.data.data.total
    }
  })
}

onMounted(() => {
  const authodId: string = route.params.id as string,
    isAuthor = parseInt(route.params.isAuthor as string) || 1
  getAuthorSession(authodId, isAuthor).then(() => {
    if (people.value.isAuthor) getAuthorOfBook(authodId)
    else getUserBookList()
  })
})
</script>
<style lang="scss" scoped>
@import '../assets/style/function.scss';
#people {
  width: 80%;
  margin: 25px auto 80px;
  .loading {
    width: 100%;
  }
  .arco-spin-loading {
    height: 300px;
  }
  :deep .arco-spin-tip {
    margin-top: 30px;
  }
  .people-session {
    display: flex;
    // align-items: center;
    padding: 30px 60px;
    background-color: white;
    border-radius: 12px;
    gap: 30px;
    .author-img {
      width: 90px;
      overflow: hidden;
      display: flex;
      // align-items: center;
      > .author-img-el {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        overflow: hidden;
      }
    }
    .author-about {
      min-width: 460px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      width: 60%;
      .autor-penName {
        font-size: 22px;
        font-weight: 700;
      }

      .author-tags {
        display: flex;
        > div {
          display: flex;
          align-items: center;
          background-color: rgba(28, 28, 28, 0.05);
          padding: 5px;
          border-radius: 9999px;
          font-size: 12px;
          img {
            width: 20px;
          }
        }
      }
      .author-about-session {
        display: flex;
        gap: 10px;
        align-items: center;
        > div {
          position: relative;
          > span:last-child {
            font-size: 18px;
            font-weight: 900;
            margin-left: 10px;
          }
        }
        > span {
          margin: 0 20px;
          border: 1px solid #d8d8d8;
          height: 12px;
          width: 1px;
          display: block;
        }
      }
      .user-about-session {
        display: flex;
        align-items: center;
        .divider {
          height: 60%;
          width: 1.5px;
          background: #d8d8d8;
          margin: 0 25px;
        }
        .session-item {
          > span {
            &:first-child {
              font-size: 12px;
              color: #999999;
              margin-right: 5px;
            }
            &:last-child {
              font-size: 18px;
              font-weight: 700;
            }
          }
        }
      }
    }
    .author-notice {
      font-size: 12px;
      text-align: right;
      flex: 1;
      display: flex;
      justify-content: flex-end;
      > ul {
        display: flex;
        flex-direction: column;
        list-style-type: disc;
        gap: 10px;
        > li {
          @include omit(1);
        }
      }
    }
  }

  .author-works {
    margin-top: 40px;
    border-radius: 12px;
    overflow: hidden;
    background-color: white;
    padding: 25px 35px;
    box-sizing: border-box;

    :deep .arco-tabs-tab {
      .arco-tabs-tab-title {
        &:hover {
          color: rgb(var(--qing-color));
        }
      }
      &:hover .arco-tabs-tab-title::before {
        background-color: white;
      }
    }

    .book-list {
      display: flex;
      flex-direction: column;
      gap: 30px;
      .book {
        display: flex;
        align-items: center;
        gap: 20px;
        .book-sesssion {
          width: 80%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          > div {
            display: flex;
            align-items: center;
          }
          .book-status {
            gap: 10px;
            font-size: 12px;
          }
          .book-intro {
            @include omit(1);
          }

          .book-new-page {
            font-size: 12px;
            > span {
              &:first-child {
                color: #999999;
                margin-right: 10px;
              }
              &:last-child {
                cursor: pointer;
                transition: all 0.3s ease;
                &:hover {
                  color: rgb(var(--qing-color));
                }
              }
            }
          }
        }
        .br {
          border: 1px solid #d8d8d8;
          height: 12px !important;
          display: inline-block;
          position: relative;
        }
        .read-book {
          width: 100px;
          cursor: pointer;
          text-align: center;
          line-height: 35px;
          border-radius: 9999px;
          border: 1px solid rgb(var(--qing-color));
          color: rgb(var(--qing-color));
          transition: all 0.3s ease;
          @include omit(1);
          // width: 80px;
          &:hover {
            background: rgb(var(--qing-color));
            color: white;
          }
        }
      }
    }
    .page {
      display: flex;
      justify-content: center;
      margin: 20px 30px;
    }
  }
}
</style>
