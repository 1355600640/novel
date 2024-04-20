<template>
  <div id="author-rank">
    <a-table
      :pagination="false"
      :hoverable="false"
      :bordered="false"
      :data="rankData"
    >
      <template #columns>
        <a-table-column :width="100" title="排名" :ellipsis="true">
          <template #cell="{ rowIndex }">
            <div class="rank-index">
              <div v-if="rowIndex + 1 > 3" class="font-sans">
                {{ (rowIndex < 9 ? '0' : '') + (rowIndex + 1) }}
              </div>
              <img
                v-else
                :src="store.mainImage + `/bookIcon/rank${rowIndex + 1}.png`"
                alt=""
              />
            </div>
          </template>
        </a-table-column>
        <a-table-column :width="200" title="昵称" :ellipsis="true">
          <template #cell="{ record }">
            <div class="author-photo">
              <img :src="store.userImage + record.authorImage" alt="" />
              <div class="text-overflow">
                <span :title="record.penName">{{ record.penName }}</span>
              </div>
            </div>
          </template>
        </a-table-column>
        <a-table-column
          title="作者字数"
          :ellipsis="true"
          data-index="words"
        ></a-table-column>
        <a-table-column
          title="最新作品"
          :ellipsis="true"
          data-index="newestBookName"
        ></a-table-column>
        <a-table-column title="操作">
          <template #cell="{ record }">
            <a-button
              class="text-2xl"
              style="
                background: linear-gradient(324deg, #e60000, #ff6114);
                padding: 17px 25px;
              "
              type="primary"
              shape="round"
              @click="$router.push(`/people/${record.id}`)"
              >查看详情</a-button
            >
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { mainStore } from '../../store'
let store = mainStore()
type Props = {
  rankData: {
    authorImage: string
    penName: string
    id: string
    words: string
    newestBookName: string
  }[]
}
const { rankData } = defineProps<Props>()
</script>
<style lang="scss" scoped>
#author-rank {
  margin-bottom: 30px;
  :deep .arco-table-td {
    border: 0;
  }
  :deep .arco-table-th {
    background: white;
    color: #909399;
  }
  :deep .arco-table-cell {
    padding: 25px 20px;
  }
  .rank-index {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 40px;
      height: 40px;
    }
    font-size: 20px;
    color: #c6c4c4;
    font-weight: 700;
  }
  .author-photo {
    display: flex;
    gap: 20px;
    img {
      width: 46px;
      height: 46px;
      border-radius: 50%;
    }
    align-items: center;
    div {
      width: 100px;
      height: 28px;
      line-height: 28px;
    }
  }
}
</style>
