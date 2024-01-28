<!-- 书本分类页 -->
<template>
  <div id="category">
    <div class="left-category">
      <div v-for="item in pageList" :key="item.stats" class="category-child">
        <div>{{ item.title }}</div>
        <div class="category-list">
          <div
            class="cursor-pointer a-hover"
            v-for="(child, index) in item.list"
            :key="index"
            :class="{'select-item':(pageData as any)[item.stats] ==  (child.id | index)}"
            @click="showList(item, index, child)"
          >
            {{ child.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="right-book-list">
      <div class="sort">
        <div class="sort-list">
          <span
            @click="
              () => {
                pageData.page = 1
                pageData.comment = 0
                pageData.browse = pageData.browse == 1 ? 2 : 1
                getBookList()
              }
            "
            :class="{ 'main-color': pageData.browse > 0 }"
            class="cursor-pointer"
            >人气排序
            <div v-if="pageData.browse > 0">
              <icon-arrow-down v-if="pageData.browse == 1" />
              <icon-arrow-up v-else />
            </div>
          </span>
          <span
            @click="
              () => {
                pageData.page = 1
                pageData.browse = 0
                pageData.comment = pageData.comment == 1 ? 2 : 1
                getBookList()
              }
            "
            :class="{ 'main-color': pageData.comment > 0 }"
            class="cursor-pointer"
            >评分
            <div v-if="pageData.comment > 0">
              <icon-arrow-down v-if="pageData.comment == 1" />
              <icon-arrow-up v-else />
            </div>
          </span>
        </div>
        <div>
          共 <span class="font-bold">{{ pageData.count }}</span> 本相关作品
        </div>
      </div>
      <a-spin style="width: 100%" :loading="pageData.loading" tip="加载中">
        <div v-if="bookList?.length > 0" class="book_list">
          <book-card
            v-for="(item, index) in bookList"
            :key="item.id"
            :item="item"
            :index="index"
            :format="false"
          />
        </div>
        <div v-else class="no-book">
          <error session="暂没有书籍" />
        </div>
      </a-spin>

      <div v-if="bookList?.length > 0" class="category-paginatio">
        <a-pagination
          :total="pageData.count - 0"
          :page-size="pageData.total"
          :current="pageData.page"
          @change="toPage"
          show-jumper
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BookCard from '../components/BookCard.vue'
import { getCategoryForId, getCategoryName } from '../api/Category'
import { ref, Ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import error from './404.vue'
const route = useRoute(),
  router = useRouter()
let pageData = ref({
  id: 0,
  page: 1,
  total: 15,
  timeSort: 0,
  status: 0,
  isCharge: 0,
  words: 0,
  count: 0,
  comment: 0,
  browse: 1,
  loading: false,
})
type pageListType = {
  title: string
  stats: string
  list: any[]
}
let pageList: Ref<pageListType[]> = ref([
  { title: '分类', stats: 'id', list: [] },
  {
    title: '状态',
    stats: 'status',
    list: [
      { name: '全部', id: 0 },
      { name: '连载', id: 1 },
      { name: '完本', id: 2 },
    ],
  },
  {
    title: '属性',
    stats: 'isCharge',
    list: [
      { name: '全部', id: 0 },
      { name: '免费', id: 1 },
      { name: 'VIP', id: 2 },
    ],
  },
  {
    title: '字数',
    stats: 'words',
    list: [
      { name: '全部' },
      { name: '30万字以下' },
      { name: '30-50万字' },
      { name: '50-100万字' },
      { name: '100-200万字' },
      { name: '200万字以上' },
    ],
  },
  {
    title: '更新时间',
    stats: 'timeSort',
    list: [
      { name: '全部' },
      { name: '三日内' },
      { name: '七日内' },
      { name: '半月内' },
      { name: '一月内' },
    ],
  },
])
let bookList: Ref<any[]> = ref([])
const getBookList = () => {
  pageData.value.loading = true
  getCategoryForId({
    ...pageData.value,
    id: pageData.value.id,
    isCharge: pageData.value.isCharge - 1,
    status: pageData.value.status - 1,
  }).then((r) => {
    pageData.value.loading = false
    bookList.value = r.data.data.bookList
    pageData.value.count = r.data.data.count
  })
}
const getCategory = async () => {
  await getCategoryName().then((r) => {
    pageList.value[0].list = [{ name: '全部', id: '0' }, ...r.data.data]
  })
}

const showList = (parant: pageListType, index: number, child: any) => {
  pageData.value.page = 1
  if (parant.stats == 'id') {
    router.push(`/category/${child.id}`)
  } else {
    ;(pageData as any)[parant.stats] = child.id
    getBookList()
  }
}
const toPage = (pageNum: number): void => {
  pageData.value.page = pageNum
  getBookList()
}

const nameIsString = (
  list: any[],
  routeValue: string,
  defaultValue: any,
  listChildName?: string,
  name?: string
): any => {
  let data
  if (isNaN(parseInt(routeValue as string)) && routeValue) {
    for (let category of list) {
      if ((listChildName ? category[listChildName] : category) === routeValue) {
        data = category.id
        break
      }
    }
  } else
    data = parseInt(routeValue as string) + (name && name == 'id' ? 0 : 1) || 0
  return data ? data : defaultValue
}
watch(route, () => {
  pageData.value.page = 1
  ;(pageData as any)[pageList.value[0].stats] = route.params.index as string
  getBookList()
})
onMounted(() => {
  if (route.query.serialize) {
    pageData.value.status = parseInt(route.query.serialize as string) + 1
  }
  const getValue = ['status', 'isCharge', 'words', 'timeSort']
  getCategory().then(() => {
    pageData.value.id = nameIsString(
      pageList.value[0].list,
      route.params?.index as string,
      0,
      'name',
      'id'
    )
  })
  for (let name = 0; name < getValue.length; name++) {
    ;(pageData as any)[getValue[name]] = nameIsString(
      pageList.value[name + 1].list,
      route.query[getValue[name]] as string,
      0,
      'name'
    )
  }

  // pageData.isCharge = parseInt(route.params?.isCharge as string) || 0
  // pageData.words = parseInt(route.params?.words as string) || 0
  // pageData.timeSort = parseInt(route.params?.timeSort as string) || 0
  getBookList()
})
</script>
<style lang="scss" scoped>
#category {
  width: 80%;
  margin: 30px auto 80px;
  display: flex;
  gap: 50px;
  min-width: 1000px;
  .left-category {
    display: flex;
    width: 20%;
    box-sizing: border-box;
    padding-right: 20px;
    flex-direction: column;
    gap: 20px;
    background: white;
    box-sizing: border-box;
    padding: 20px 15px;
    border-radius: 16px;
    .category-child {
      font-size: 12px;
      > div:first-child {
        font-weight: 700;
      }
      .category-list {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        > div {
          padding: 5px 3px;
        }
        .select-item {
          color: white;
          background: rgb(var(--qing-color));
        }
      }
    }
  }

  .right-book-list {
    width: 75%;
    box-sizing: border-box;
    background: white;
    box-sizing: border-box;
    padding: 0 20px 0;
    // border-radius: 16px;
    .sort {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      border-bottom: 1px solid #efecec;
      padding: 15px 12px;
      box-sizing: border-box;
      .sort-list {
        gap: 10px;
        display: flex;
        > span {
          display: flex;
          gap: 5px;
          justify-content: center;
        }
      }
    }

    .book_list {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 30px 15px;
      min-height: 300px;
      width: 100%;
      // :deep .hoot-book-item {
      //   transition: all 0.3s ease;
      //   &:hover {
      //     background-color: #efecec;
      //   }
      // }
    }

    .no-book {
      width: 100%;
      height: 300px;
    }

    .category-paginatio {
      margin: 30px auto;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
