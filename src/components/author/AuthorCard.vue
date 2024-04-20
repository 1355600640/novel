<template>
  <div class="author-card">
    <div class="author-info">
      <div class="author-image">
        <imgLoading
          :url="'/api/images' + author.authorImage"
          :is-have="true"
          :have-tr="true"
        />
      </div>
      <div
        @click="$router.push(`/people/${author.id}`)"
        class="author-name cursor-pointer hover:text-red-600"
      >
        {{ author.penName }}
      </div>
    </div>
    <div class="author-book">
      <span>代表作:</span
      ><span
        @click="$router.push(`/detail/${author.hotBookId}`)"
        class="cursor-pointer hover:text-red-600"
      >
        《{{ author.hotBookName }}》
      </span>
    </div>
    <div class="text-gray-400 author-book-desc text-overflow-n">
      {{ author.hotBookIntroduce }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { hotAuthor } from '../../api/Author'
import imgLoading from '../../components/ImgLoading.vue'
type props = {
  author: hotAuthor
}
const { author } = defineProps<props>()
</script>
<style lang="scss" scoped>
.author-card {
  min-height: 100px;

  border-radius: 6px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  --limit: 2;
  padding: 30px 30px;
  color: 666;
  gap: 15px;


  .author-info {
    display: flex;
    align-items: center;
    gap: 10px;
    .author-image {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
    }
  }
}
</style>
