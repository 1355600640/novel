<template>
  <div id="session">
    <a-tabs
      default-active-key="1"
      @change="changeTabs"
      v-model:active-key="pageData.selectTabs"
    >
      <template #extra>
        <div class="extra">
          <div class="cursor-pointer remove-all" @click="removeByList">
            <i class="iconfont icon-qingchu text-xl"></i> 一键清空
          </div>
        </div>
      </template>
      <a-tab-pane key="1" title="系统消息">
        <div class="session-list">
          <a-spin :loading="pageData.loading">
            <div
              v-if="pageData.list.length > 0"
              class="session"
              v-for="item in pageData.list"
              :key="item.id"
            >
              <div class="session-title">{{ item.title }}</div>
              <div class="session-content">{{ item.content }}</div>
              <div class="session-other flex justify-between">
                <div class="session-time font-sans">{{ item.createTime }}</div>
                <div
                  @click="toRemoveSysSession([item.id])"
                  class="session-operate cursor-pointer flex items-center"
                >
                  <icon-delete class="text-xl" />删除
                </div>
              </div>
            </div>
            <div v-if="pageData.list.length > 0" class="flex justify-center">
              <span
                @click="pageData.haveMore ? getSysSessionOfUser(true) : ''"
                class="more"
                :class="{ 'hava-more': pageData.haveMore }"
              >
                <span v-if="pageData.haveMore">查看更多<icon-down /></span>
                <span v-else>没有更多内容了</span>
              </span>
            </div>
            <div v-else class="no_data">
              <icon-email class="text-7xl" />
              <div class="text-base">暂无消息</div>
            </div>
          </a-spin>
        </div>
      </a-tab-pane>
      <!-- TODO -->
      <a-tab-pane key="2" title="查看回复"></a-tab-pane>
      <a-tab-pane key="3" title="查看点赞"></a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
import { sysSessionOfUser, sysSession, removeSession } from '../../api/Session'
import { ref, onMounted } from 'vue'
import { stringToDate } from '../../utils/commonUtils'
import { Message } from '@arco-design/web-vue'
let pageData = ref<{
  total: number
  pageSize: number
  limit: number
  list: sysSession[]
  loading: boolean
  haveMore: boolean
  selectTabs: string
}>({
  total: 0,
  pageSize: 1,
  limit: 10,
  list: [],
  loading: false,
  haveMore: true,
  selectTabs: '1',
})

/**
 * 获取系统消息
 * @param more 是否加载更多
 */
const getSysSessionOfUser = async (more?: boolean) => {
  pageData.value.loading = true
  if (more) {
    pageData.value.pageSize += 1
  } else pageData.value.pageSize = 1
  sysSessionOfUser(pageData.value.pageSize, pageData.value.limit).then(
    (r) => {
      if (r.data.status === 200) {
        let data = r.data.data.list.map((r) => {
          r.createTime = stringToDate(r.createTime, 'all')
          return r
        })
        if (more) {
          pageData.value.list = [...pageData.value.list, ...data]
        } else pageData.value.list = data
        pageData.value.total = r.data.data.total
        pageData.value.haveMore =
          r.data.data.total > pageData.value.pageSize * pageData.value.limit
      }
      pageData.value.loading = false
    },
    () => (pageData.value.loading = false)
  )
}

/**
 * 批量删除
 */
const removeByList = async () => {
  let ids = pageData.value.list.map((r) => {
    return r.id
  })
  toRemoveSysSession(ids)
}

/**
 * 删除消息列表
 * @param ids 消息id列表
 */
const toRemoveSysSession = async (ids: string[]) => {
  pageData.value.loading = true
  removeSession(ids).then(
    async (r) => {
      if (r.data.status == 200) {
        await getSysSessionOfUser()
        Message.success('删除成功')
      }
      pageData.value.loading = false
    },
    () => (pageData.value.loading = false)
  )
}

const changeTabs = (key: string | number) => {
  switch (key) {
    case '1':
      getSysSessionOfUser()
      break
  }
}

onMounted(() => {
  getSysSessionOfUser()
})
</script>
<style lang="scss" scoped>
#session {
  border-radius: 12px;
  background: white;
  box-sizing: border-box;
  padding: 25px;
  :deep .arco-tabs-tab-title {
    font-weight: 700;
    font-size: 1rem;
  }
  :deep .arco-tabs-content {
    padding-top: 0;
  }

  .extra {
    display: flex;
    gap: 20px;
    .remove-all {
      &:hover {
        color: rgb(var(--qing-color));
      }
    }
  }
  .session-list {
    display: flex;
    flex-direction: column;
    .session {
      display: flex;
      border-bottom: 1px solid hsla(0, 0%, 93%, 0.7);
      padding: 24px 0;
      flex-direction: column;
      .session-title {
        color: #333;
        font-size: 16px;
        font-weight: 500;
      }
      .session-content {
        background: #f7f8fb;
        border-radius: 12px;
        color: #666;
        font-weight: 700;
        padding: 16px;
        box-sizing: border-box;
        margin: 8px 0px 24px;
      }
      .session-other {
        .session-time {
          color: #999;
        }
        .session-operate {
          color: #666;
          font-size: 16px;
          &:hover {
            color: rgb(var(--qing-color));
          }
        }
      }
    }
    .more {
      margin: 40px auto 20px;
      text-align: center;
      color: #666;
    }
    .hava-more {
      cursor: pointer;
      &:hover {
        color: rgb(var(--qing-color));
      }
    }
  }
  .no_data {
    height: 420px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    > svg {
      color: rgb(var(--qing-color));
    }
    > div {
      color: #666;
    }
  }
}
</style>
