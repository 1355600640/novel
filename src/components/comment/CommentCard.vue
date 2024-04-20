<!-- 评论卡片 -->
<template>
  <div class="commentCard"></div>
</template>
<script lang="ts" setup>
import { ReviewDto } from '../../api/BookComment'
type Props = {
  comment: ReviewDto
  showIndex?: number
}
</script>
<style lang="scss" scoped>
.commentCard {
}
</style>
