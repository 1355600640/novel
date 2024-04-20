<template>
  <div class="rank-book-info">
    <div class="book-rank" v-if="!notShowNumber">
      <div v-if="index > 3" class="font-sans">
        {{ (index < 9 ? '0' : '') + index }}
      </div>
      <img
        v-else
        :src="store.mainImage + `/bookIcon/rank${index}.png`"
        alt=""
      />
    </div>
    <div class="book-info">
      <div
        class="book-image cursor-pointer"
        @click="$router.push(`/detail/${rankData.id}`)"
      >
        <ImgLoading style="height: 100%; width: auto" :url="rankData.picUrl" />
      </div>

      <div class="book-info-session">
        <div
          v-html="rankData.bookName"
          :class="{ 'hover:text-red-600': !noHover }"
          class="book-title text-lg cursor-pointer"
          @click="$router.push(`/detail/${rankData.id}`)"
        ></div>
        <div
          :class="{ noHover: noHover }"
          class="book-tag text-xs text-slate-400"
        >
          <div
            v-html="rankData.authorName"
            @click="$router.push(`/people/${rankData.authorId}`)"
          ></div>
          <span class="bg-slate-400"></span>
          <div
            v-html="rankData.categoryName"
            @click="$router.push(`/category/${rankData.categoryId}`)"
          ></div>
          <span class="bg-slate-400"></span>
          <div
            @click="$router.push(`/category?serialize=${rankData.bookStatus}`)"
          >
            {{ rankData.bookStatus ? '完结' : '连载' }}
          </div>
        </div>
        <div
          @click="$router.push(`/detail/${rankData.id}`)"
          :class="{ 'hover:text-red-600': !noHover }"
          class="book-desc cursor-pointer"
          v-html="rankData.bookDesc"
          :title="removeOfFrontSpace(rankData.bookDesc)"
        ></div>
        <div class="book-chapter text-xs text-slate-400">
          最新章节：<span
            :title="rankData.lastChapterName"
            @click="
              $router.push(
                `/chapter/${rankData.id}?pageId=${rankData.lastChapterId}`
              )
            "
            :class="{ 'hover:text-red-600': !noHover }"
            class="cursor-pointer"
            >{{ rankData.lastChapterName }}</span
          >
        </div>
      </div>
    </div>
    <div class="book-menu ml-6">
      <div class="book-browse cursor-default" v-if="!notShowSetBookshelf">
        <span class="font-bold">{{ rankData.subscription }}</span>
        <span class="text-xs text-slate-400">订阅</span>
      </div>
      <a-button
        class="text-2xl"
        style="
          background: linear-gradient(324deg, #e60000, #ff6114);
          padding: 17px 25px;
        "
        @click="
          $router.push(`/${isRead ? 'chapter' : 'detail'}/${rankData.id}`)
        "
        type="primary"
        shape="round"
        >{{ isRead ? '立即阅读' : '书籍详情' }}</a-button
      >
      <div
        v-if="!rankData.inBookshelf"
        @click="$emit('addBookShelf')"
        class="cursor-pointer text-xs text-slate-500"
      >
        加入书架
      </div>
      <div v-else class="text-xs text-slate-500">已在书架</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ImgLoading from '../ImgLoading.vue'
import { removeOfFrontSpace } from '../../utils/commonUtils'
import { mainStore } from '../../store'
let store = mainStore()

type Props = {
  rankData: any
  index: number
  notShowNumber?: boolean
  notShowSetBookshelf?: boolean
  isRead?: boolean
  noHover?: boolean
}
const { rankData, index, notShowNumber, notShowSetBookshelf, isRead, noHover } =
  defineProps<Props>()

// function getIcon(index: number) {
//   return new URL(`../../assets/image/rank${index}.png`, import.meta.url).href
// }
</script>
<style lang="scss" scoped>
.rank-book-info {
  display: flex;
  align-items: center;
  gap: 20px;
  .book-rank {
    flex: none;
    width: 30px;
    color: #c6c4c4;
    font-weight: 700;
    font-size: 20px;
    img {
      width: 100%;
      height: 30px;
      flex: none;
    }
    div {
      width: 100%;
      line-height: 30px;
      text-align: center;
    }
  }
  .book-info {
    flex: 7;
    display: flex;
    align-items: center;
    gap: 15px;
    height: 128px;
    color: #333;
    .book-image {
      height: 100%;
      width: 96px !important;
      overflow: hidden;
      border-radius: 6px;
      flex: none;
    }
    .book-info-session {
      display: flex;
      flex-direction: column;
      gap: 5px;
      > div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        -webkit-line-clamp: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
      }
      .book-desc {
        -webkit-line-clamp: 2;
      }
      .book-tag {
        display: flex;
        align-items: center;
        > div {
          cursor: pointer;
        }
        &:not(.noHover) div {
          &:hover {
            color: #dc2626;
          }
        }
        span {
          height: 2px;
          width: 2px;
          display: block;
          margin: 0 5px;
        }
      }
    }
  }
  .book-menu {
    display: flex;
    gap: 10px;
    flex-direction: column;
    align-items: center;
    .book-browse {
      display: flex;
      align-items: center;
      gap: 3px;
      color: #e45812;
      font-size: 18px;
    }
  }
}
</style>
