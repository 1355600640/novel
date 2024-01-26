<template>
  <div class="rank_category font-sans">
    <div class="hot_rank" @click="$router.push('/rank')">
      <i class="iconfont icon-remen" />
      <span>人气榜单</span>
    </div>
    <div
      v-for="categoryName in categoryList.keys()"
      :key="categoryName"
      class="rank_book_category rank_category_list"
    >
      <div class="rank_cagtegory_title">{{ categoryName }}</div>
      <div class="rank_category_items">
        <div
          :class="{ select: selectCategory.rankType == item.id }"
          class="rank_category_item"
          v-for="item in categoryList.get(categoryName)"
          :key="item.id"
          @click="
            $router.push(
              `/rank?categoryId=${item.rankValue}&rankType=${item.id}`
            )
          "
        >
          {{ item.rankName }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
type Props = {
  categoryList: Map<string, any>
  selectCategory: {
    categoryId: number
    rankType: number
  }
}
const { categoryList, selectCategory } = defineProps<Props>()
</script>
<style lang="scss" scoped>
.rank_category {
  background: white;
  padding: 30px 45px;
  flex: 1;
  min-height: 500px;
  border-radius: 12px;
  overflow: hidden;
  .hot_rank {
    line-height: 24px;
    font-size: 17px;
    color: #e60000;
    cursor: pointer;
    i {
      font-size: 21px;
      color: red;
    }
    padding-bottom: 30px;
  }

  .rank_book_category {
    padding: 30px 0 20px;
    border-top: 1px solid #efefef;
    color: #333;

    .rank_cagtegory_title {
      font-size: 18px;
      margin-bottom: 20px;
    }
    .rank_category_items {
      width: 100%;
      display: flex;
      font-size: 14px;
      flex-direction: column;
      overflow: hidden;
      .select {
        color: #e60000 !important;
        background-color: rgba(230, 0, 0, 0.05);
        border-radius: 6px;
      }
      > div {
        flex: 1;
        box-sizing: border-box;
        padding: 0 17px;
        line-height: 36px;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:hover {
          @extend .select;
        }
      }
    }
  }
}
</style>
