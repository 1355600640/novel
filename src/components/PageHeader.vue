<template>
  <div id="hearder">
    <div @click="router.push('/')" class="logo cursor-pointer">
      <img src="../../public/book.svg" alt="" />
      <span class="text-xl italic font-bold font-mono">清风文学网</span>
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
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { mainStore } from '../store'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const useMianStore = mainStore()
const { user } = storeToRefs(useMianStore)
const router = useRouter()

let search = ref('')

onMounted(() => {
  if (localStorage.getItem('novel_token')) useMianStore.getUser()
})
</script>
<style lang="scss" scoped>
#hearder {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10%;
  padding: 20px 0;
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
  .search :deep .arco-btn {
    background-color: rgb(var(--qing-color));
    &:hover {
      background-color: rgb(40 102 246 / 87%);
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
