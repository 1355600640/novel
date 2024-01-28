<template>
  <div id="rank">
    <a-spin style="flex: 2" :loading="loadings.category" tip="加载中">
      <RankCategoryView
        :category-list="categoryList"
        :select-category="selectCategory"
      />
    </a-spin>
    <a-spin style="flex: 8" :loading="loadings.content" tip="加载中">
      <div class="rank_view">
        <div class="rank_list" v-if="selectCategory.categoryId == 0">
          <div
            class="rank-book-list"
            v-for="(item, index) in defalutOfValue"
            :key="item.title"
          >
            <div class="title" :class="'gradation-' + (index + 1)">
              <div class="title-icon"><i class="iconfont icon-guiye"></i></div>
              <div>{{ item.title }}</div>
              <div class="title-icon"><i class="iconfont icon-guiye"></i></div>
            </div>
            <BookList :rank-list="item.list" />
            <div class="text-right pr-1">
              <span
                @click="
                  $router.push(
                    `/rank?categoryId=${item.categoryId}&rankType=${item.rankType}`
                  )
                "
                class="cursor-pointer hover:font-bold hover:text-red-600 text-neutral-400 more pr-3 text-sm"
              >
                更多<icon-right
              /></span>
            </div>
          </div>
        </div>
        <div class="rank_of_page" v-else>
          <div
            class="rank-title"
            :class="`gradation-${selectCategory.rankType % 7}`"
          >
            <div class="rank-title-left">
              <div class="title-icon"><i class="iconfont icon-guiye"></i></div>
              <div>{{ selectCategory.rankName }}</div>
              <div class="title-icon"><i class="iconfont icon-guiye"></i></div>
            </div>
            <div class="rank-title-right">
              <div class="time"><icon-schedule />{{ time }}</div>
              <div :title="selectCategory.rankName" class="cursor-default">
                规则说明
              </div>
            </div>
            <div
              class="title-background"
              :class="`gradation-${selectCategory.rankType % 7}`"
            ></div>
          </div>
          <div class="book-category" v-if="selectCategory.categoryId == 1">
            <div class="category-list">
              <div
                @click="toBookCategory(0)"
                :class="{ 'main-color': selectBookCategory == 0 }"
                class="book-category-name text-overflow-n a-hover"
              >
                全部
              </div>
              <div
                @click="toBookCategory(item.id)"
                :class="{ 'main-color': selectBookCategory == item.id }"
                v-for="item in categoryNames"
                class="book-category-name text-overflow-n a-hover"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div
            v-if="$route.query.categoryId?.valueOf() == 1"
            class="rank-books"
          >
            <BookRankList
              v-for="(item, index) in pageData.list"
              :key="item.id"
              :rank-data="item"
              :index="index + (pageData.pageSize - 1) * pageData.limit + 1"
              v-if="selectCategory.categoryId == 1"
            />
          </div>
          <div class="author-list"></div>
          <div class="page-menus">
            <a-pagination
              v-bind:total="pageData.total"
              v-bind:current="pageData.pageSize"
              v-bind:page-size="pageData.limit"
              :page-size-options="pageSzieOptions"
              show-total
              show-jumper
              show-page-size
              @change="changePageSize"
              @page-size-change="changePageLimit"
            />
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script lang="ts" setup>
import BookRankList from '../components/rank/BookRankList.vue'
import { ref, Ref, onMounted, watch } from 'vue'
import BookList from '../components/BookList.vue'
import RankCategoryView from '../components/rank/RankCategory.vue'
import { useRoute, useRouter } from 'vue-router'
import { getCategoryName } from '../api/Category'
import {
  rankBooks,
  rankCategoies,
  rankCategory,
  defaultValue,
} from '../api/Rank'
const route = useRoute(),
  router = useRouter()
const loadings = ref({
  category: false,
  content: false,
})
let categoryList: Ref<Map<any, rankCategory[]>> = ref(new Map() as any)
type PageData = {
  pageSize: number
  limit: number
  list: any[]
  total: number
}
let pageData: Ref<PageData> = ref({
  pageSize: 1,
  limit: 20,
  total: 0,
  list: [],
} as PageData)
let pageSzieOptions = ref([pageData.value.limit, 50, 100, 200])
let selectCategory = ref({
  categoryId: 0,
  rankType: 0,
  rankName: '',
})
watch(route, () => {
  changeRankData()
})

// 获取排行榜分类
let getRankCategoies = async () => {
  loadings.value.category = true
  await rankCategoies().then(
    (r) => {
      r.data.data.forEach((r) => {
        categoryList.value.set(r.rankTitle, [
          ...(categoryList.value.get(r.rankTitle) || []),
          r,
        ])
      })
      loadings.value.category = false
    },
    () => {
      loadings.value.category = false
    }
  )
}

/**
 * 获取排行版书本
 * @param id 排行榜编号
 * @param rankValue 排行榜分类
 */
let getRankBook = async (id: number, rankValue: number, categoryId: number) => {
  loadings.value.content = true
  await rankBooks({
    id,
    pageSize: pageData.value.pageSize,
    limit: pageData.value.limit,
    rankValue,
    categoryId,
  }).then(
    (r) => {
      if (r.data.status !== 200) {
        router.push('/rank')
        return
      }
      if (selectCategory.value.categoryId == 1)
        pageData.value.list = r.data.data.list.map((r) => {
          const div = document.createElement('div')
          div.innerHTML = r.bookDesc
          r.bookDesc = div.innerText.trim()
          return r
        })
      else pageData.value.list = r.data.data.list
      pageData.value.total = parseInt(r.data.data.num + '')
      loadings.value.content = false
    },
    () => {
      loadings.value.content = false
    }
  )
}

let defalutOfValue = ref()
/**
 * 获取默认排行榜
 */
const getDefalut = async () => {
  loadings.value.content = true
  await defaultValue({
    pageSize: 0,
    limit: 10,
  }).then(
    (r) => {
      defalutOfValue.value = r.data.data
      loadings.value.content = false
    },
    () => {
      loadings.value.content = false
    }
  )
}

let selectBookCategory = ref(0)
/**
 * 切换选项展示对应的排行榜/默认榜单
 */
const changeRankData = () => {
  let categoryId: number = route.query.categoryId as unknown as number
  let rankType: number = route.query.rankType as unknown as number
  if (categoryId && rankType) {
    selectBookCategory.value = 0
    // 获取所有分类名
    if (!categoryNames.value || categoryNames.value?.length == 0) {
      getAllCategoryName()
    }
    let keys = categoryList.value.keys()
    let keyValue = keys.next()
    // 找出对应排名id值
    outerloop: while (!keyValue.done) {
      let categoryValue = categoryList.value.get(keyValue.value) || []
      for (let category of categoryValue) {
        if (category.id == rankType && category.rankValue == categoryId) {
          selectCategory.value = {
            rankName: category.rankName,
            categoryId,
            rankType,
          }
          break outerloop
        }
      }
      keyValue = keys.next()
    }
  } else {
    selectCategory.value = {
      categoryId: 0,
      rankType: 0,
      rankName: '',
    }
  }
  if (selectCategory.value.categoryId != 0)
    getRankBook(rankType, categoryId, selectBookCategory.value)
  else getDefalut()
}

/**
 * 获取所有分类名
 */
let categoryNames = ref<any[]>()
const getAllCategoryName = () => {
  getCategoryName().then((r) => {
    categoryNames.value = r.data.data
  })
}

const toBookCategory = (id: number) => {
  selectBookCategory.value = id
  pageData.value.pageSize = 1
  getRankBook(
    selectCategory.value.rankType,
    selectCategory.value.categoryId,
    selectBookCategory.value
  )
}

/**
 * 页码发生改变
 * @param current 页码
 */
const changePageSize = (current: number) => {
  pageData.value.pageSize = current
  getRankBook(
    selectCategory.value.rankType,
    selectCategory.value.categoryId,
    selectBookCategory.value
  )
  document.documentElement.scrollTo(0, 0)
}

/**
 * 数据条数发生改变
 * @param pageSize 数据条数
 */
const changePageLimit = (pageSize: number) => {
  pageData.value.limit = pageSize
  getRankBook(
    selectCategory.value.rankType,
    selectCategory.value.categoryId,
    selectBookCategory.value
  )
}
let time = ref<string>()
onMounted(() => {
  const date = new Date()
  time.value =
    date.getFullYear() +
    '-' +
    ((date.getMonth() >= 9 ? '' : '0') + (date.getMonth() + 1))
  getRankCategoies().then(() => {
    changeRankData()
  })
})
</script>
<style lang="scss" scoped>
#rank {
  width: 85%;
  margin: 0 auto;
  display: flex;
  gap: 30px;
  padding: 30px 0;

  .rank_view {
    flex: 7;
    min-height: 500px;
    width: 100%;
    .rank-title {
      display: flex;
      justify-content: space-between;
      padding: 50px 45px;
      position: relative;
      background: none;
      .rank-title-left {
        display: flex;
        z-index: 3;
        align-items: center;
        > div {
          overflow: hidden;
          > i {
            // width: 200%;
            display: block;
            font-size: 18px;
          }
          &:first-child {
            height: 200%;
            > i {
              transform: translate(50%, 50%) scale(2);
            }
          }
          &:nth-child(2) {
            font-weight: 700;
            font-size: 20px;
            margin: 0 15px;
          }
          &:last-child {
            height: 200%;
            i {
              transform: translate(-50%, 50%) scale(2);
            }
          }
        }
      }
      .rank-title-right {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #666;
        gap: 30px;
        z-index: 3;
        .time {
          font-size: 13px;
          display: flex;
          gap: 2px;
        }
      }
      .title-background {
        // background: red;
        position: absolute;
        width: 100%;
        height: 100%;
        padding-bottom: 20px;
        left: 0;
        top: 0;
        z-index: 2;
      }
    }

    .rank_list {
      border-radius: 12px;
      overflow: hidden;
      display: grid;
      gap: 30px 20px;
      grid-template-columns: 1fr 1fr 1fr;
      .rank-book-list {
        background: white;
        min-width: 300px;
        padding-bottom: 20px;

        .title {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 25px 0;
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
          padding: 20px 24px;
        }
      }
    }
    .rank_of_page {
      border-radius: 6px;
      overflow: hidden;
      background-color: #ffffff;
      .rank-books {
        padding: 20px 50px 50px;

        position: relative;
        display: flex;
        flex-direction: column;
        gap: 30px;
        // margin-top: 20px;
      }
      .book-category {
        padding: 0 50px;

        --limit: 1;
        margin-bottom: 10px;
        .category-list {
          padding-bottom: 20px;
          gap: 30px;
          display: flex;
          border-bottom: 1px solid #f1f2f4;
          > div {
            cursor: pointer;
          }
        }
      }

      .page-menus {
        display: flex;
        justify-content: center;
        padding-bottom: 50px;
      }
    }
  }
}
</style>
