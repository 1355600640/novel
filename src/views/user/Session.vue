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
        <template #title>
          <a-badge
            :text="pageData.noReadSession.noReadSystem + ''"
            :offset="[10, 0]"
          >
            系统消息
          </a-badge>
        </template>
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
          </a-spin>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" title="查看点赞">
        <template #title>
          <a-badge
            :text="pageData.noReadSession.noReadLike + ''"
            :offset="[10, 0]"
          >
            查看点赞
          </a-badge>
        </template>
        <div class="like-content">
          <div class="like-list">
            <div
              class="like-session"
              v-for="item in pageData.list"
              :key="item.id"
            >
              <div class="user-content">
                <div class="user-image">
                  <ImgLoading
                    :is-shadow="true"
                    :have-tr="true"
                    :url="store.userImage + item.userInfo.userPhoto"
                    :isHave="true"
                  />
                </div>
                <div class="like-conteng">
                  <div class="user-name">{{ item.userInfo.nickName }}</div>
                  <div>
                    赞了你的评论
                    <span>{{ dateToString(item.createTime) }}</span>
                  </div>
                </div>
              </div>
              <div
                @click="routerReview('like', item.sessionUrl, item.remark)"
                class="cursor-pointer a-hover"
              >
                查看点赞
              </div>
            </div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" title="查看回复">
        <template #title>
          <a-badge
            :text="pageData.noReadSession.noReadComment + ''"
            :offset="[10, 0]"
          >
            查看回复
          </a-badge>
        </template>
        <div class="like-content">
          <div class="like-list">
            <div
              class="like-session"
              v-for="item in pageData.list"
              :key="item.id"
            >
              <div class="user-content">
                <div class="user-image">
                  <ImgLoading
                    :is-shadow="true"
                    :have-tr="true"
                    :url="store.userImage + item.userInfo.userPhoto"
                    :isHave="true"
                  />
                </div>
                <div class="like-conteng">
                  <div class="user-name">{{ item.userInfo.nickName }}</div>
                  <div>
                    回复了你的评论
                    <span class="ml-3">{{
                      dateToString(item.createTime)
                    }}</span>
                  </div>
                </div>
              </div>
              <div
                @click="routerReview('comment', item.sessionUrl, item.remark)"
                class="cursor-pointer a-hover"
              >
                查看回复
              </div>
            </div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <div v-if="pageData.list.length > 0" class="mt-5 flex justify-center">
      <span
        @click="pageData.haveMore ? getSysSessionOfUser(true) : ''"
        class="more"
        :class="{ 'hava-more': pageData.haveMore }"
      >
        <span v-if="pageData.haveMore">查看更多<icon-down /></span>
        <span v-else>没有更多内容了</span>
      </span>
    </div>
    <div v-else class="no_data mt-5">
      <icon-email class="text-7xl" />
      <div class="text-base">暂无消息</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  sysSessionOfUser,
  sysSession,
  NoReadSystemLogNumberDto,
  removeSession,
  noReadSessionNumber,
} from '../../api/Session'
import { ref, onMounted } from 'vue'
import { stringToDate } from '../../utils/commonUtils'
import { Message } from '@arco-design/web-vue'
import ImgLoading from '../../components/ImgLoading.vue'
import { dateToString } from '../../utils/commonUtils'
import { mainStore } from '../../store'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(),
  route = useRoute()
let store = mainStore()
let pageData = ref<{
  total: number
  pageSize: number
  limit: number
  list: sysSession[]
  loading: boolean
  haveMore: boolean
  selectTabs: string
  noReadSession: NoReadSystemLogNumberDto
}>({
  total: 0,
  pageSize: 1,
  limit: 10,
  list: [],
  loading: false,
  haveMore: true,
  selectTabs: '2',
  noReadSession: {
    noReadLike: 0,
    noReadSystem: 0,
    noReadComment: 0,
  },
})

const getNoReadSessionNumber = async () => {
  return await noReadSessionNumber().then((r) => {
    if (r.data.status == 200) pageData.value.noReadSession = r.data.data
  })
}

/**
 * 获取系统消息
 * @param more 是否加载更多
 */
const getSysSessionOfUser = async (more?: boolean) => {
  pageData.value.loading = true
  if (more) {
    pageData.value.pageSize += 1
  } else pageData.value.pageSize = 1
  await sysSessionOfUser(
    pageData.value.pageSize,
    pageData.value.limit,
    parseInt(pageData.value.selectTabs)
  ).then(
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

/**
 * 跳转评论页
 * @param {'like'|'comment'} type 类型
 */
const routerReview = (
  type: 'like' | 'comment',
  url: string,
  idSession: string
) => {
  if (type == 'like') {
    router.push(url + '&comment=' + idSession.split('comment:')[1])
  } else
    router.push(
      url + '&insertReplyComment=' + idSession.split('insertReplyComment:')[1]
    )
}

const changeTabs = (key: string | number) => {
  router.push(`/user/session?type=${key}`)
  getSysSessionOfUser().then(() => {
    getNoReadSessionNumber()
  })
}

onMounted(() => {
  if (route.query.type) {
    pageData.value.selectTabs = route.query.type as string
  }
  getNoReadSessionNumber().then(() => {
    getSysSessionOfUser()
  })
})
</script>
<style lang="scss" scoped>
#session {
  min-height: 363px;
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
  .like-content {
    .like-list {
      display: flex;
      flex-direction: column;
      .like-session {
        display: flex;
        padding: 10px 0;
        justify-content: space-between;
        align-items: center;
        .user-content {
          gap: 10px;
          display: flex;

          .user-image {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            overflow: hidden;
          }
          .like-conteng {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-sizing: border-box;
            padding: 5px 0;
          }
        }
      }
    }
  }
}
</style>
