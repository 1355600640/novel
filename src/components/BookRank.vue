<template>
  <div class="book_list">
    <div class="box-border mt-10 title text-2xl font-serif font-bold">
      {{ recommendName }}
    </div>
    <div class="center">
      <!-- 热门推荐 -->
      <a-spin :loading="props.recommendBook.length == 0">
        <div class="hoot-book">
          <div class="hoot-book-list">
            <book-card
              v-for="(item, index) in props.recommendBook"
              :key="item.id"
              :item="item"
              :index="index"
              :format="true"
            />
          </div>
        </div>
      </a-spin>
      <!-- 点击榜单 -->
      <a-spin :loading="props.rankList.length == 0">
        <div class="book-ranking">
          <div class="box-border title text-2xl font-serif font-bold">
            {{ rankName }}
          </div>
          <div class="ranking-list mt-4">
            <div
              class="rankBook-item cursor-pointer"
              v-for="(item, index) in props.rankList"
              :key="item.id"
              @mouseover="selectBook = index"
              :style="
                selectBook == index ? 'align-items: normal !important;' : ''
              "
            >
              <div class="index">
                <span v-if="index >= 3"
                  >{{ index + 1 < 10 ? '0' : '' }}{{ index + 1 }}</span
                >
                <img v-else :src="getIcon(index + 1)" alt="" />
              </div>
              <div class="bookname flex flex-col">
                <div
                  @click="$router.push(`/detail/${item.id}`)"
                  class="name a-hover"
                >
                  {{ item.bookName }}
                </div>
                <div
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
                  style="height: 100%; border-radius: 8px; overflow: hidden"
                  :class="{ hidden: index != selectBook }"
                  @click="$router.push(`/detail/${item.id}`)"
                >
                  <img-loading :url="item.picUrl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-spin>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BookCard from './BookCard.vue'
import imgLoading from '../components/ImgLoading.vue'
import { ref } from 'vue'
let selectBook = ref(0)
function getIcon(index: number) {
  return new URL(`../assets/image/rank${index}.png`, import.meta.url).href
}
const props = defineProps([
  'rankList',
  'recommendBook',
  'rankName',
  'recommendName',
])
</script>
<style lang="scss" scoped>
.book_list {
  .center {
    display: grid;
    grid-template-columns: 8fr 2fr;
    gap: 20px;
    .book-ranking {
      min-height: calc(140 * 3px);
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
            flex: 3;
            text-align: right;
            color: #999;
            img {
              height: 100%;
              border-radius: 6px;
            }
          }
        }
      }
    }
    .hoot-book {
      min-height: 300px;
      .hoot-book-list {
        margin-top: 25px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 50px 40px;
      }
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
}
</style>
