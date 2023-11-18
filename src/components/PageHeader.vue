<template>
  <div id="pageHeader">
    <a-affix @change="showCategory">
      <div id="hearder">
        <div @click="router.push('/')" class="logo cursor-pointer">
          <a-image
            :preview="false"
            width="50"
            height="50"
            src="../../public/book.svg"
          />
          <span class="text-xl italic font-bold font-mono">清风文学网</span>
        </div>
        <div
          class="category"
          :style="`--showCategory:${homePageOfShowCategory}`"
          ref="categoryDom"
          v-if="$route.meta.showCategory"
        >
          <div>
            <div
              v-for="(item, index) in headCategory"
              @mouseover="hoverCategory = index + 1"
              @mouseout="hoverCategory = 0"
              :class="{ categoryHover: hoverCategory == index + 1 }"
            >
              <span @click="$router.push(item.href)" class="a-hover">{{
                item.name
              }}</span>
              <div
                style="z-index: 999"
                class="book-category"
                v-if="item.name == '分类'"
              >
                <!-- TODO 分类跳转 -->
                <div>
                  <div
                    @click="$router.push(`/category/${ic.id}`)"
                    class="cursor-pointer"
                    v-for="ic in category"
                  >
                    {{ ic.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="search">
          <a-input-search
            :style="{ width: '320px' }"
            placeholder="书名、作者、关键词"
            v-model="search"
            search-button
          />
        </div>

        <!-- 未登录 -->
        <div class="user">
          <!-- TODO 已登录 -->
          <div v-if="user && Object.keys(user).length > 0" class="is-login">
            <div class="a-hover">
              <i class="iconfont icon-bg-book mr-1.5"></i>我的书架
            </div>
            <div class="a-hover">{{ (user as any).nickName }}</div>
            <div class="a-hover">退出</div>
          </div>
          <div @click="router.push('/login')" v-else class="no-login">登录</div>
        </div>
      </div>
    </a-affix>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, Ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mainStore } from '../store'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { getCategoryName } from '../api/Category'

const useMianStore = mainStore()
const { user } = storeToRefs(useMianStore)
const router = useRouter()
const route = useRoute()

let homePageOfShowCategory = ref(0)
watch(route, () => {
  homePageOfShowCategory.value = route.name == 'home' ? 0 : 1
})

let hoverCategory = ref(0)
const headCategory = reactive([
  { name: '首页', href: '/' },
  { name: '分类', href: '/category' },
  { name: '排行', href: '' },
  { name: '书库', href: '' },
  { name: '完本', href: '' },
])
let category: Ref<any[]> = ref([])
let search = ref('')
const categoryDom = ref()
const getAllCategory = () => {
  // 获取所有分类
  getCategoryName().then((r) => {
    category.value = r.data.data
  })
}
onMounted(() => {
  if (localStorage.getItem('novel_token')) useMianStore.getUser()
  getAllCategory()
  if (route.name !== 'home' && route.meta.showCategory) {
    ;(categoryDom.value as HTMLElement).style.setProperty('--showCategory', '1')
  }
})
const showCategory = (fixed: boolean) => {
  if (route.name == 'home' && route.meta.showCategory)
    (categoryDom.value as HTMLElement).style.setProperty(
      '--showCategory',
      fixed ? '1' : '0'
    )
}
</script>
<style lang="scss" scoped>
#hearder {
  display: flex;
  justify-content: center;
  align-items: center;
  // gap: 10%;
  padding: 10px 0;
  box-shadow: 4px 1px 8px 0px #e0e0e0;
  background: white;
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 50px;
      margin-right: 20px;
    }
  }
  .search {
    padding: 0 10%;
    :deep .arco-btn {
      background-color: rgb(var(--qing-color));
      &:hover {
        background-color: rgb(40 102 246 / 87%);
      }
    }
  }
  .category {
    transform: scaleX(var(--showCategory));
    transition: all 0.3s ease;
    margin-left: 20px;
    position: relative;
    z-index: 99;
    > div {
      display: flex;
      > div {
        padding: 0 10px;
        color: #666;
        position: relative;
        &:hover .book-category {
          display: block !important;
        }
        > span {
          cursor: pointer;
        }
        .book-category {
          display: none !important;
          position: absolute;
          // bottom: 20px;
          left: 50%;
          padding-top: 35px;
          transform: translateX(-50%);
          // z-index: 99999;
          > div {
            background: white;
            border-radius: 16px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            padding: 10px 15px;
            gap: 10px 10px;
            > div {
              padding: 10px 10px;
              width: 80px;
              text-align: center;
              border-radius: 16px;
              line-height: 14px;
              font-size: 14px;
              &:hover {
                background: rgb(var(--qing-color));
                color: white;
              }
            }
          }
        }
        &::after {
          content: none;
          transition: all 0.2s ease;
          transform: scaleX(0) translateX(50%);
          transform-origin: center center;
          position: absolute;
          bottom: -10px;
          right: 50%;
          width: 80%;
          height: 2px;
          background: rgb(var(--qing-color));
        }
      }
      .categoryHover {
        &::after {
          content: ' ';
          transform: scaleX(1) translateX(50%);
        }
      }
    }
  }
  .user {
    .no-login {
      transition: all 0.3s ease;
      cursor: pointer;
      &:hover {
        color: rgb(var(--qing-color));
      }
    }
    .is-login {
      display: flex;
      // gap: 10px;
      align-items: center;
      > * {
        padding-left: 20px;
      }
      > div {
        min-width: 30px;
        cursor: pointer;
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 15px;
        i {
          color: rgb(var(--qing-color));
        }

        &:first-child {
          padding-right: 20px;
          padding-left: 0;
          border-right: 1px solid #e0e0e0;
        }
      }
      span {
        display: block;
        width: 1px;
        height: 100%;
        background: #e0e0e0;
      }
    }
  }
}
</style>
