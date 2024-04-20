<template>
  <div class="page-button-list">
    <div
      @click="pageButton = 'bookCatalogue'"
      class="book-catalogue"
      v-if="$route.meta.showButtonCatalogue"
    >
      <i class="iconfont icon-tingshu-mulu"></i>
      <span class="readText">目录</span>
    </div>
    <div
      @click="pageButton = 'bookInfo'"
      class="book-info"
      v-if="$route.meta.showButtonInfo"
    >
      <i class="iconfont icon-xiangqing1"></i>
      <span class="readText">书详情</span>
    </div>
    <div
      @click="pageButton = 'bookReview'"
      class="book-review"
      v-if="$route.meta.showButtonReview"
    >
      <i class="iconfont icon-31pinglun"></i>
      <span class="readText">评论</span>
    </div>
    <div
      v-if="$route.meta.showButtonRead"
      :class="isRead ? 'main-color' : ''"
      class="read-aloud"
      @click="readText"
      ref="readAloud"
    >
      <i class="iconfont icon-buzhilangdurenwulangdu"></i>
      <span class="readText">朗读</span>
    </div>
    <div
      @click="backTop"
      :title="backText ? backText : '返回顶部'"
      :class="backTopShow ? 'showback' : 'hiddenBack'"
      class="backTop"
    >
      <i class="iconfont icon-fanhuidingbu"></i>
      <span>顶部</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { mainStore } from '../../store'
import { storeToRefs } from 'pinia'
import { onBeforeMount, ref } from 'vue'
const useMianStore = mainStore()
let { pageButton } = storeToRefs(useMianStore)
let isRead = ref(false)
const readText = () => {
  if (!isRead.value) playRead()
  else pauseRead()
  isRead.value = !isRead.value
}
// 开始阅读
const playRead = () => {
  pageButton.value = 'playReadBook'
}

// 暂停阅读
const pauseRead = () => {
  pageButton.value = 'pauseReadBook'
}
const { backText } = defineProps({
  backText: String,
})
let backTopShow = ref(false)

const backTop = () => {
  let top = document.documentElement.scrollTop
  const backTopF = setInterval(() => {
    let nowTop = document.documentElement.scrollTop
    if (nowTop <= 0) clearInterval(backTopF)
    else
      document.documentElement.scrollTo(
        document.documentElement.scrollLeft,
        nowTop - top / 60 / 1.5
      )
  }, 1)
}

window.addEventListener('scroll', () => {
  if (document.documentElement.scrollTop > 200) {
    // document.documentElement.style.setProperty('--showTop', )
    backTopShow.value = true
  } else backTopShow.value = false
})
onBeforeMount(() => {
  window.speechSynthesis.cancel()
})
</script>
<style lang="scss" scoped>
.page-button-list {
  position: fixed;
  display: flex;
  gap: 10px;
  flex-direction: column;
  right: 25px;
  bottom: 100px;
  div {
    cursor: pointer;
    --height: 60px;
    background: white;
    height: var(--height);
    width: 60px;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    gap: 5px;
    font-size: 13px !important;
    align-items: center;
    flex-direction: column;
    i {
      font-size: 16px;
    }
    &:hover {
      color: rgb(var(--qing-color)) !important;
    }
  }
  .showback {
    animation: backTopA 0.3s linear;
    display: flex;
    @keyframes backTopA {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }
  .hiddenBack {
    animation: backTopAH 0.3s linear;
    display: flex;
    animation-fill-mode: forwards;
    @keyframes backTopAH {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
        display: none;
      }
    }
  }
  .backTop {
    border-radius: 6px;
    background: white;
    text-align: center;
    cursor: pointer;
    opacity: 0;
    --limit: 1;
    font-size: 14px;
    animation-duration: 0.2s;
    animation-fill-mode: forwards;
  }
  .read-aloud {
    text-align: center;
    font-size: 14px;
    bottom: calc(var(--backBottom) * 1px + 60px);
    right: calc(var(--backRight) * 1px);

    // color: inherit;
    cursor: pointer;
    // transition: all 0.3s ease;
    animation-duration: 0.2s;
    animation-fill-mode: forwards;
    -webkit-animation-fill-mode: forwards;
    &:hover {
      color: rgb(var(--qing-color));
    }
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
