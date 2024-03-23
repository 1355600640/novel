<template>
  <div id="user">
    <div class="left_menus">
      <div
        :class="{ select: selectMenus == index }"
        class="menu"
        v-for="(item, index) in menus"
        :key="index"
        @click="toPage(index)"
      >
        {{ item }}
      </div>
      <div class="dvider"></div>
      <div
        @click="toPage(menus.length)"
        :class="{ select: selectMenus == menus.length }"
        class="user-menus"
      >
        编辑个人资料
      </div>
    </div>
    <div class="user-content">
      <RouterView />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
let selectMenus = ref(0)
const menus = ['个人中心', '我的书架', '我的账户', '我的消息']
const toPage = (index: number) => {
  let page = ''
  switch (index) {
    case 0:
      page = ''
      break
    case 1:
      page = 'userRead'
      break
    case 2:
      page = 'userAccount'
      break
    case 3:
      page = 'session'
      break
    case menus.length:
      page = 'changeUser'
      break
  }
  router.push('/user/' + page)
  selectMenus.value = index
}
watch(
  () => route.fullPath,
  () => {
    selectMenus.value = route.meta.pageItem as number
  }
)
onMounted(() => {
  selectMenus.value = route.meta.pageItem as number
})
caches
</script>
<style lang="scss" scoped>
#user {
  display: flex;
  width: 80%;
  margin: 15px auto;
  gap: 15px;
  :deep .arco-tabs-nav-type-line .arco-tabs-tab {
    margin: 0 40px 0 0 !important;
  }

  .left_menus {
    background: white;
    padding: 25px 0;
    font-size: 16px;
    border-radius: 12px;
    flex: 2;
    > div {
      padding: 18px 0px 18px 21px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      box-sizing: border-box;
      cursor: pointer;
      // transition: all 0.3s ease;
      &:hover {
        color: rgb(var(--qing-color));
      }
    }
    .select {
      color: rgb(var(--qing-color));
      // background: linear-gradient(89deg, rgb(115 170 247 / 39%), white 60%);
      border-left: 5px solid #3286ff;
      padding: 18px 0px 18px 16px;
    }
    .menu {
    }
    .dvider {
      padding: 0;
      background: #ececec;
      margin: 20px auto;
      width: 85%;
      height: 1px;
      cursor: default;
    }
  }
  .user-content {
    flex: 10;
    overflow: hidden;
  }
}
</style>
