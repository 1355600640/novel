<template>
  <a-image
    width="100%"
    height="100%"
    :preview="false"
    :src="imgUrl + props.url"
  >
    <template #error>
      <a-image
        width="100%"
        height="100%"
        :preview="false"
        src="../assets/image/loading.png"
      >
      </a-image>
    </template>
    <template #loader>
      <q-loading height="100%" width="100%" text="加载中..." />
    </template>
  </a-image>
</template>
<script lang="ts" setup>
import { mainStore } from '../store'
import { storeToRefs } from 'pinia'
import qLoading from '../components/QLoading.vue'
const useMainStore = mainStore()
const { imgUrl } = storeToRefs(useMainStore)
const props = defineProps(['url'])
</script>
<style lang="scss" scoped>
.arco-image {
  position: relative;
  :deep img {
    height: 100%;
  }
  &::after {
    content: ' ';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background: url('../assets/image/bookBorder.png') no-repeat top left;
  }
}
</style>
