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
          <BookList :rank-list="props.rankList" />
        </div>
      </a-spin>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BookCard from './BookCard.vue'
import BookList from './BookList.vue'
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
    }
    .hoot-book {
      min-height: 300px;
      .hoot-book-list {
        margin-top: 25px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 50px 40px;
        > div:first-child {
          box-shadow: 9px 9px 14px #e9e9e9c9;
          border-radius: 6px;
        }
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
