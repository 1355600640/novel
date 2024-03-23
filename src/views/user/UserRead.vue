<!-- 用户关注书籍/作者信息 -->
<template>
  <div id="user-read">
    <a-tabs @change="updateBookList" :default-active-key="pageData.activeKey">
      <a-tab-pane :key="1" title="最近阅读">
        <div class="book-list-content">
          <Bookshelf
            style="width: 100%"
            :bookshelf="localBooks || []"
            v-model:content-loading="contentLoading"
            v-model:selectedKeys="selectedKeys"
          />
        </div>
        <div class="mt-5 ml-4 text-xs text-gray-500">
          {{ `每页${pageData.limit}条,共${pageData.total}条` }}
        </div>
        <a-divider :margin="15" />
        <div class="ml-4 text-xs text-gray-500">
          * 最多显示最近阅读的前100本书
        </div>
      </a-tab-pane>
      <a-tab-pane :key="2" title="我的书架">
        <div class="bookshelf-menus">
          <div
            @click="changeBookStatus(0)"
            :class="{ select: bookStatus == 0 }"
          >
            全部
          </div>
          <div
            @click="changeBookStatus(1)"
            :class="{ select: bookStatus == 1 }"
          >
            连载
          </div>
          <div
            @click="changeBookStatus(2)"
            :class="{ select: bookStatus == 2 }"
          >
            已完结
          </div>
        </div>
        <Bookshelf
          style="width: 100%; margin-top: 20px"
          v-model:bookshelf="bookshelf"
          v-model:content-loading="contentLoading"
          v-model:selectedKeys="selectedKeys"
          :localOrBookshelf="true"
        />
        <div class="mt-5 ml-4 text-xs text-gray-500">
          {{ `每页${pageData.limit}条,共${pageData.total}条` }}
        </div>
        <a-divider :margin="15" />
        <div class="select mt-5 flex text-base justify-between">
          <a-checkbox
            @change="toSelectAll"
            class="ml-1"
            :model-value="selectAll"
            :indeterminate="
              selectedKeys.length > 0 && selectedKeys.length < bookshelf.length
            "
            :disabled="bookshelf.length == 0"
            >全选</a-checkbox
          >
          <div
            @click="removeSelect"
            class="cursor-pointer hover:text-blue-500 transition-all text-gray-600"
          >
            <icon-delete class="mr-1" /><span class="text-sm">删除</span>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane :key="3" title="我的关注">
        <a-spin
          :loading="contentLoading"
          style="width: 100%"
          :style="authors?.length == 0 ? 'min-height: 200px' : ''"
        >
          <div v-if="authors && authors?.length > 0">
            <UserFollow
              @refreshFollow="removeFollowById"
              v-for="item in authors"
              :key="item.id"
              :author="item"
            />
          </div>
          <error
            v-else
            :in-content="true"
            style="height: 300px"
            session="暂无书籍"
          />
        </a-spin>
      </a-tab-pane>
    </a-tabs>
    <div class="book-page">
      <a-pagination
        :total="pageData.total"
        :current="pageData.pageSize"
        :page-size="pageData.limit"
        @change="updatePage"
      >
        <template #page-item-step="{ type }">
          {{ type === 'previous' ? '上一页' : '下一页' }}
        </template>
      </a-pagination>
    </div>
  </div>
</template>
<script lang="ts" setup>
import error from '../../views/404.vue'
import UserFollow from '../../components/user/UserFollow.vue'
import Bookshelf from '../../components/user/Bookshelf.vue'
import { ref, onMounted } from 'vue'
import {
  UserReadDto,
  localRead,
  userBookshelf,
  removeBookshelf,
} from '../../api/BookInfo'
interface UserReadDto2 extends UserReadDto {
  key: number
}
let pageData = ref({
    total: 0,
    pageSize: 1,
    limit: 10,
    activeKey: 1,
  }),
  localBooks = ref<UserReadDto[]>(),
  bookshelf = ref<UserReadDto2[]>([]),
  contentLoading = ref(false),
  selectedKeys = ref<string[]>([]),
  selectAll = ref(false),
  bookStatus = ref(0)

import { oldDataToNow } from '../../utils/commonUtils'
/**
 * 获取历史阅读记录
 */
const getLocalReadBooks = async () => {
  contentLoading.value = true
  localRead(pageData.value.pageSize, pageData.value.limit).then(
    (r) => {
      if (r.data.status === 200) {
        localBooks.value = r.data.data.list.map((r) => {
          r.updateTime = oldDataToNow(r.updateTime)
          return r
        })
        pageData.value.total = r.data.data.total % 101
      }
      contentLoading.value = false
    },
    () => {
      contentLoading.value = false
    }
  )
}

/**
 * 获取用户书架的书籍
 */
const getBookshelfOfBooks = async () => {
  contentLoading.value = true
  userBookshelf(
    pageData.value.pageSize,
    pageData.value.limit,
    bookStatus.value
  ).then(
    (r) => {
      if (r.data.status == 200) {
        bookshelf.value = r.data.data.list.map((r) => {
          r.updateTime = oldDataToNow(r.updateTime)
          ;(r as UserReadDto2).key = r.id as any
          return r as UserReadDto2
        })
        pageData.value.total = r.data.data.total % 101
      }
      contentLoading.value = false
    },
    () => {
      contentLoading.value = false
    }
  )
}

/**
 * 跳转页码
 */
const updatePage = (page: number) => {
  pageData.value.pageSize = page
  updateBookList(pageData.value.activeKey)
}

/**
 * 全选
 */
const toSelectAll = () => {
  selectAll.value = !selectAll.value
  if (selectAll.value) {
    selectedKeys.value =
      bookshelf.value?.map((r) => {
        return r.id as string
      }) || []
  } else {
    selectedKeys.value = []
  }
}

/**
 * 获取关注列表
 */
import { userFollowAuthor, authorInfo, removeFollow } from '../../api/Author'
import { Message } from '@arco-design/web-vue'
let authors = ref<authorInfo[]>()
const getUserFollowAuthor = async () => {
  contentLoading.value = true
  await userFollowAuthor(pageData.value.pageSize, pageData.value.limit).then(
    (r) => {
      authors.value = r.data.data.list
      pageData.value.total = parseInt(r.data.data.total + '')
      contentLoading.value = false
    },
    () => {
      contentLoading.value = false
    }
  )
}

/**
 * 取消关注作者
 * @param id 作者id
 */
const removeFollowById = (id: number | string) => {
  contentLoading.value = true
  removeFollow(id as number).then(
    (r) => {
      if (r.data.status == 200) {
        getUserFollowAuthor()
      } else {
        Message.error('取消关注失败')
        contentLoading.value = false
      }
    },
    () => (contentLoading.value = false)
  )
}

import { watch } from 'vue'
watch(selectedKeys, (newData: any[]) => {
  selectAll.value = newData.length == bookshelf.value.length
})

/**
 * 删除选中的书籍列表
 */
const removeSelect = () => {
  if (selectedKeys.value.length == 0) return
  contentLoading.value = true
  removeBookshelf(selectedKeys.value).then(
    (r) => {
      if (r.data.status == 200) {
        getBookshelfOfBooks()
        selectedKeys.value = []
      }
      contentLoading.value = false
    },
    () => {
      contentLoading.value = false
    }
  )
}

/**
 *
 * @param index 切换选项
 */
const updateBookList = (index: number | string) => {
  pageData.value.activeKey = index as number
  switch (index) {
    case 1:
      getLocalReadBooks()
      break
    case 2:
      getBookshelfOfBooks()
      break
    case 3:
      getUserFollowAuthor()
      break
  }
}

/**
 * 切换书架书本状态
 * @param status 书本状态
 */
const changeBookStatus = (status: number) => {
  bookStatus.value = status
  getBookshelfOfBooks()
}

onMounted(() => {
  getLocalReadBooks()
})
</script>
<style lang="scss" scoped>
#user-read {
  border-radius: 12px;
  background: white;
  box-sizing: border-box;
  padding: 20px 20px;
  :deep .arco-tabs-nav-type-line .arco-tabs-tab {
    margin: 0 1.5rem 0 0 !important;
  }
  :deep .arco-tabs-content {
    // padding: 20px 30px;
    box-sizing: border-box;
    .arco-tabs-nav {
      padding: 0 20px;
      box-sizing: border-box;
      .arco-tabs-nav-tab-list {
        padding: 10px 0;
      }
    }
  }

  .book-page {
    margin: 20px 0;
    :deep .arco-pagination {
      justify-content: center;
    }
  }

  .bookshelf-menus {
    display: flex;
    padding: 0 10px;
    gap: 20px;
    > div {
      padding: 8px 18px;
      background-color: #f7f8fb;
      color: rgba(0, 0, 0, 0.85);
      border-radius: 6px;
      cursor: pointer;
    }
    .select {
      background-color: rgb(var(--qing-color));
      color: white;
    }
  }

  .book-list-content {
    width: 100%;
    overflow: hidden;
  }
}
</style>
