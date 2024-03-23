<!-- 用户关注作者列表 -->
<template>
  <div id="user-follow">
    <div class="user-session flex gap-3">
      <div
        @click="$router.push(`/people/${author.id}`)"
        class="cursor-pointer author-avatar"
      >
        <ImgLoading
          :isHave="true"
          :have-tr="true"
          :url="userImage + author?.authorImage"
        />
      </div>
      <div class="author-content flex flex-col justify-between">
        <div
          @click="$router.push(`/people/${author.id}`)"
          class="author-nickname text-base font-bold cursor-pointer"
        >
          {{ author?.penName }}
        </div>
        <div class="author-intro text-xs text-neutral-500">
          {{ author?.intro || '这个人潇洒不羁爱自由，没写什么介绍~' }}
        </div>
      </div>
    </div>
    <div class="operate">
      <button @click="emit('refreshFollow', author.id)">取消关注</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ImgLoading from '../../components/ImgLoading.vue'
import { authorInfo } from '../../api/Author'
type Props = {
  author: authorInfo
}
import { mainStore } from '../../store'
import { storeToRefs } from 'pinia'
let store = mainStore()
let { userImage } = storeToRefs(store)
const { author } = defineProps<Props>()
const emit = defineEmits()
</script>
<style lang="scss" scoped>
#user-follow {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 15px;
  .user-session {
    .author-avatar {
      height: 60px;
      width: 60px;
      overflow: hidden;
      border-radius: 50%;
    }
  }
  .operate {
    display: flex;
    align-items: center;
    button {
      border: 0.0625rem solid #dcdfe6;
      padding: 8px 20px;
      border-radius: 1rem;
      transition: all 0.3s ease;
      &:hover {
        color: rgb(var(--qing-color));
        border-color: rgb(var(--qing-color));
      }
    }
  }
}
</style>
