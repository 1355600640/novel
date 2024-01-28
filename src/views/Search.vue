<template>
  <div id="search">
    <div class="search-content">
      <a-spin v-if="!pageData.nodata" :loading="pageData.loading">
        <div class="content">
          <div class="sort-list">
            <div
              :class="{ select: sortOrder == item.value }"
              class="sort-type"
              @click="sortSearch(item.value)"
              v-for="item in sortList"
              :key="item.value"
            >
              {{ item.key }}
            </div>
          </div>
          <div class="search-session mt-7">
            共搜索到<span class="select">{{ pageData.total }}</span
            >部与“<span class="select">{{ pageData.searchName }}”</span>
            相关结果
          </div>
          <div class="search-book-list mt-5">
            <BookRankList
              v-for="(item, index) in pageData.list"
              :key="item.id"
              :rank-data="item"
              :index="index"
              :not-show-number="true"
              :not-show-set-bookshelf="true"
              :no-hover="true"
              :isRead="true"
            />
          </div>
        </div>
        <div class="flex justify-center mt-10">
          <a-pagination
            @change="changePageSize"
            :total="pageData.total"
            :current="pageData.pageSize"
            :page-size="pageData.limit"
          />
        </div>
      </a-spin>
      <error style="flex: 7" v-else session="没有任何内容" />
      <div class="hot-search">
        <div class="content">
          <div class="content-session text-base">大家都在搜</div>
          <div class="hot-book-list mt-5">
            <div class="book-info" v-for="item in hotBook" :key="item.id">
              <div class="book-left cursor-pointer">
                <ImgLoading
                  @click="$router.push(`/detail/${item.id}`)"
                  style="width: 100%; height: auto"
                  :url="item.picUrl"
                  :haveTr="true"
                />
              </div>
              <div class="book-righ">
                <div
                  v-html="item.bookName"
                  class="text-sm cursor-pointer"
                ></div>
                <div class="flex gap-1 mt-2 mb-4">
                  <div
                    @click="$router.push(`/people/${item.authorId}`)"
                    class="cursor-pointer"
                    v-html="item.authorName"
                  ></div>
                  <div class="halving-line">|</div>
                  <div
                    @click="$router.push(`/category/${item.categoryId}`)"
                    class="cursor-pointer"
                    v-html="item.categoryName"
                  ></div>
                </div>
                <div
                  :title="item.bookDesc"
                  v-html="item.bookDesc"
                  class="text-overflow-n"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ImgLoading from '../components/ImgLoading.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { bookInfo, toSearch, hotSearch } from '../api/BookInfo'
import BookRankList from '../components/rank/BookRankList.vue'
import error from './404.vue'
const route = useRoute()
let pageData = ref<{
  pageSize: number
  limit: number
  list: bookInfo[]
  searchName: string
  total: number
  loading: boolean
  nodata: boolean
}>({
  pageSize: 1,
  limit: 20,
  list: [],
  searchName: '',
  total: 0,
  loading: false,
  nodata: false,
})
let sortList = ref([
  {
    key: '默认',
    value: 0,
  },
  {
    key: '总字数',
    value: 1,
  },
  {
    key: '订阅数',
    value: 2,
  },
  {
    key: '点击数',
    value: 3,
  },
  {
    key: '更新时间',
    value: 4,
  },
])
let sortOrder = ref(0)
/**
 * TODO 类型排序
 */
const sortSearch = (sort: number): undefined => {
  sortOrder.value = sort
  getSearchValue()
}
import { markerKeys, removeOfFrontSpace } from '../utils/commonUtils'
/**
 * 获取搜索到的书本列表
 */
const getSearchValue = async () => {
  pageData.value.loading = true
  const { pageSize, limit, searchName } = pageData.value
  await toSearch({
    sortOrder: sortOrder.value,
    pageSize,
    limit,
    keyword: searchName,
  }).then(
    (r) => {
      pageData.value.loading = false
      if (r.data.status == 200) {
        pageData.value.list = r.data.data.list?.map((r) => {
          r.bookDesc = removeOfFrontSpace(r.bookDesc)
          r.bookName = markerKeys(r.bookName, searchName, 'span', ['red'])
          r.authorName = markerKeys(r.authorName, searchName, 'span', ['red'])
          r.categoryName = markerKeys(r.categoryName, searchName, 'span', [
            'red',
          ])
          r.bookDesc = markerKeys(r.bookDesc, searchName, 'span', ['red'])
          return r
        })
        pageData.value.total = r.data.data.total
        pageData.value.nodata =
          !pageData.value.list || pageData.value.list.length == 0
      }
    },
    () => {
      pageData.value.loading = false
    }
  )
}
let hotBook = ref<bookInfo[]>()
/**
 * 获取热门搜索
 */
const getHotSearch = async () => {
  hotSearch(1, 5).then((r) => {
    if (r.data.status == 200) {
      hotBook.value = r.data.data.map((r) => {
        r.bookDesc = removeOfFrontSpace(r.bookDesc)
        return r
      })
    }
  })
}

/**
 * 跳转页码
 * @param pageSzie 页码
 */
const changePageSize = (pageSzie: number) => {
  pageData.value.pageSize = pageSzie
  getSearchValue().then(() => {
    document.documentElement.scrollTo(0, 0)
  })
}
onMounted(() => {
  if (route.query.keyword) {
    pageData.value.searchName = route.query.keyword as string
    getSearchValue()
  } else pageData.value.nodata = true
  getHotSearch()
})
</script>
<style lang="scss" scoped>
#search {
  width: 80%;
  margin: 35px auto;
  border-radius: 16px;
  overflow: hidden;
  background-color: white;
  padding: 40px 30px;
  .search-content {
    display: flex;
    gap: 100px;
    .arco-spin {
      flex: 7;
      .content {
        .sort-list {
          display: flex;
          gap: 40px;
          font-size: 16px;
          border-bottom: 1px solid #e6e8eb;
          color: #666;
          padding-bottom: 15px;
          > div {
            cursor: pointer;
          }
        }
        .select {
          color: #e60000;
        }
        :deep .red {
          color: red;
        }
        .search-session {
          color: #999;
        }
        .search-book-list {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
      }
    }
    .hot-search {
      flex: 3;
      margin-top: 135px;
      .content {
        border-radius: 16px;
        box-sizing: border-box;
        padding: 20px 25px;
        border: 1px solid #e6e8eb;
        overflow: hidden;
        .hot-book-list {
          display: flex;
          gap: 15px;
          flex-direction: column;
          .book-info {
            display: flex;
            gap: 10px;
            .book-left {
              flex: 3;
              border-radius: 12px;
              overflow: hidden;
            }
            .book-righ {
              flex: 6;
              font-size: 12px;
              display: flex;
              flex-direction: column;
              --limit: 2;
              color: #666;
            }
          }
        }
      }
    }
  }
}
</style>
