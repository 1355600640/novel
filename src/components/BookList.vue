<template>
  <div class="book-list" ref="bookList">
    <div class="ranking-list mt-4">
      <div
        class="rankBook-item cursor-pointer"
        v-for="(item, index) in rankList"
        :key="item.id"
        @mouseover="selectBook = index"
        :style="selectBook == index ? 'align-items: normal !important;' : ''"
      >
        <div class="index">
          <span v-if="index >= 3"
            >{{ index + 1 < 10 ? '0' : '' }}{{ index + 1 }}</span
          >
          <img v-else :src="getIcon(index + 1)" alt="" />
        </div>
        <div class="bookname flex flex-col">
          <div @click="$router.push(`/detail/${item.id}`)" class="name a-hover">
            {{ item.bookName }}
          </div>
          <div
            @click="$router.push(`/people/${item.authorId}`)"
            :style="index != selectBook ? 'display:none' : ''"
            style="font-size: 13px"
            class="a-hover bright-text"
          >
            {{ item.authorName }}
          </div>
          <div :style="index != selectBook ? 'display:none' : ''">
            <span style="color: #7952c7" class="mr-2 font-bold">{{
              item.visitCount
            }}</span
            >人气
          </div>
        </div>
        <div class="visitCount">
          <span :class="{ hidden: index == selectBook }">{{
            item.visitCount
          }}</span>
          <div
            class="bookImage"
            :class="{ hidden: index != selectBook }"
            @click="$router.push(`/detail/${item.id}`)"
          >
            <img-loading :is-shadow="true" :url="item.picUrl" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import imgLoading from '../components/ImgLoading.vue'
import { ref, Ref, onMounted } from 'vue'
let bookList: Ref<HTMLElement> = ref(null as any)
function getIcon(index: number) {
  return new URL(`../assets/image/rank${index}.png`, import.meta.url).href
}
onMounted(() => {
  let item = bookList.value?.querySelector('.rankBook-item')
  bookList.value?.style.setProperty(
    '--imageHeight',
    (item?.getBoundingClientRect().height as number) + 10 + 'px'
  )
})
let selectBook = ref(0)
let { rankList } = defineProps(['rankList'])
</script>
<style lang="scss" scoped>
.book-list {
  .ranking-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    .rankBook-item {
      display: flex;
      width: 100%;
      align-items: center;
      gap: 10px;
      $rankImgW: 35px;
      min-height: $rankImgW;

      .index {
        width: $rankImgW;
        text-align: right;
        color: #c6c4c4;
        $indexSize: 16px;
        font-size: $indexSize;
        font-weight: 700;
        line-height: $rankImgW;
        img {
          width: $rankImgW;
          height: $rankImgW;
        }
        span {
          margin-right: calc($rankImgW/2 - $indexSize / 2);
        }
      }
      .bookname {
        flex: 7;
        gap: 7px;
        > div {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: normal;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .name {
          font-size: 15px;
          line-height: $rankImgW;
        }
      }

      > .visitCount {
        overflow: hidden;
        flex: 3;
        text-align: right;
        color: #999;
        img {
          height: 100%;
          border-radius: 6px;
        }
        .bookImage {
          height: var(--imageHeight);
          border-radius: 8px;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
