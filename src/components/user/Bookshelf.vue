<template>
  <div id="bookshelf">
    <a-spin :loading="contentLoading">
      <a-table
        row-key="id"
        v-model:selectedKeys="selectedKeys"
        :data="props.bookshelf"
        :row-selection="
          localOrBookshelf
            ? {
                type: 'checkbox',
                showCheckedAll: false,
                onlyCurrent: false,
              }
            : undefined
        "
        :pagination="false"
        :bordered="false"
        @select="emit('selectBook', selectedKeys)"
      >
        <template #columns>
          <a-table-column :width="100" title="类别">
            <template #cell="{ record }">
              <div class="book-category">{{ record.categoryName }}</div>
            </template>
          </a-table-column>
          <a-table-column
            :width="160"
            title="书名 "
            data-index="bookName"
            :ellipsis="true"
            :tooltip="true"
          ></a-table-column>
          <a-table-column
            :width="160"
            v-if="!localOrBookshelf"
            title="上一次阅读"
            data-index="preContentName"
            :ellipsis="true"
            :tooltip="true"
          ></a-table-column>
          <a-table-column
            :ellipsis="true"
            :tooltip="true"
            :width="160"
            v-else
            title="最新章节"
            data-index="lastChapterName"
          ></a-table-column>
          <a-table-column
            :ellipsis="true"
            :tooltip="true"
            :width="120"
            title="作者"
            data-index="authorName"
          ></a-table-column>
          <a-table-column
            :ellipsis="true"
            :tooltip="true"
            :width="80"
            title="状态"
          >
            <template #cell="{ record }">
              {{ record.bookStatus ? '连载中' : '已完结' }}
            </template>
          </a-table-column>
          <a-table-column :ellipsis="true" :tooltip="true" title="更新时间">
            <template #cell="{ record }">
              {{ oldDataToNow(record.lastChapterUpdateTime) }}
            </template>
          </a-table-column>
          <a-table-column :width="180" title="操作">
            <template #cell="{ record }">
              <div
                @click="
                  $router.push(
                    `/chapter/${record.id}?pageId=${record.preContentId}`
                  )
                "
                class="text-overflow open-book"
              >
                继续阅读
              </div>
            </template>
          </a-table-column>
        </template>
        <template #empty>
          <error style="height: 300px" session="暂无书籍" :inContent="true" />
        </template>
      </a-table>
    </a-spin>
  </div>
</template>
<script lang="ts" setup>
import error from '../../views/404.vue'
import { useVModel } from '../../utils/ToolUtils'
import { oldDataToNow } from '../../utils/commonUtils'
import { computed } from 'vue'
type Props = {
  bookshelf: any[]
  contentLoading: boolean
  selectedKeys: string[]
  localOrBookshelf?: boolean
}
const emit = defineEmits()
const props = defineProps<Props>()
let selectedKeys = useVModel(props, 'selectedKeys', computed, emit)
</script>
<style lang="scss" scoped>
#bookshelf {
  :deep .arco-table-td {
    border: 0 !important;
    // .arco-table-td-content {
    //   overflow: hidden;
    //   text-overflow: ellipsis;
    //   white-space: normal;
    //   -webkit-line-clamp: 1;
    //   display: -webkit-box;
    //   -webkit-box-orient: vertical;
    //   line-height: 20px;
    // }
    .open-book {
      cursor: pointer;
      width: 100px;
      line-height: 30px;
      text-align: center;
      border: 1px solid rgb(236, 236, 236);
      border-radius: 12px;
      transition: all 0.3s ease;
      &:hover {
        color: rgb(var(--qing-color));
        border-color: rgb(var(--qing-color));
      }
    }
    .book-category {
      border: 1px solid rgb(236, 236, 236);
      text-align: center;
      padding: 5px;
    }
  }
}
</style>
