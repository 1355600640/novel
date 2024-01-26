<!-- 书本卡片 -->
<template>
  <div
    class="hoot-book-item"
    :class="{ 'cursor-pointer': index > 0, format }"
    :key="item.id"
    @click="$router.push(`/detail/${item.id}`)"
    show-loader
  >
    <img-loading
      style="height: 100%"
      :style="[index == 0 && format ? 'width: 65%' : `width:100%','background:url(${(item as any).picUrl}) no-repeat center center;`]"
      :url="(item as any).picUrl"
    />
    <div class="book-introduce cursor-pointer">
      <span class="text-xl a-hover cursor-pointer" :title="item.bookName">{{
        item.bookName
      }}</span>
      <div
        ref="bookDesc"
        :title="item?.text"
        v-show="index > 0 || !format"
        class="text-slate-400 a-hover"
        v-html="(item.bookDesc as any)"
      />
      <span class="text-xs text-slate-400">
        <span
          @click="toPage(`/people/${item.authorId}`, $event)"
          class="a-hover cursor-pointer"
          >{{ item.authorName }}</span
        >
        <span v-if="index > 0 || !format" class="mx-1">·</span>
        <span
          @click="toPage(`/category/${item.categoryId}`, $event)"
          class="a-hover"
          >{{ index > 0 || !format ? item.categoryName : '' }}</span
        >
      </span>
      <div
        :title="item?.text"
        v-show="index == 0 && format"
        class="text-slate-400"
        v-html="(item.bookDesc as any)"
      />
    </div>
    <a-button
      v-if="index == 0 && format"
      class="text-2xl"
      style="
        background: linear-gradient(324deg, #e60000, #ff6114);
        padding: 17px 32px;
      "
      @click="toPage(`/detail/${item.id}`, $event)"
      type="primary"
      shape="round"
      >书籍详情</a-button
    >
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import ImgLoading from './ImgLoading.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const { item, index, format } = defineProps(['item', 'index', 'format'])
onMounted(() => {
  const dom = document.createElement('html')
  dom.innerHTML = item.bookDesc
  item.text = dom.innerText
  item.bookDesc = dom.innerText.trim()
})
const toPage = (href: string, event: Event): void => {
  event.preventDefault()
  event.stopPropagation()
  router.push(href)
}
</script>
<style lang="scss" scoped>
.hoot-book-item {
  // display: grid;
  height: 140px;
  gap: 10px;

  // grid-template-columns: 1fr 2fr;
  display: flex;
  flex-direction: row;
  div {
    &:first-child {
      width: 32%;
    }
    &:last-child {
      width: 68%;
    }
  }

  @at-root :deep .arco-image {
    box-shadow: 6px 4px 11px #b5b4b4;
    overflow: hidden;
    border-radius: 6px;
    box-sizing: border-box;
    background: url() no-repeat center center;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover .arco-image-img {
      transform-origin: center center;
      transform: scale(1.2);
    }
    .arco-image-img {
      width: 100%;
      transform: scale(1);
      transition: all 0.3s ease;
    }
  }

  .book-introduce {
    justify-content: space-around;
    display: flex;
    flex-direction: column;
    gap: 15px;
    > span:first-child {
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      white-space: normal;
    }
    > div {
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      white-space: normal;
      // text-indent: -2em;
    }
    > span:last-child {
      font-size: 12px;
    }
  }
}
.format:first-child {
  display: flex;
  grid-row: 1/4;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(#edf3f7, #ffffff);
  gap: 15px 0;
  box-sizing: border-box;
  padding: 30px 20px;
  :deep .arco-image {
    height: 50% !important;
    width: auto;
  }
  .book-introduce {
    align-items: center;

    > div {
      -webkit-line-clamp: 3;
      text-indent: 0;
    }
  }
}
</style>
