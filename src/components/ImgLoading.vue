<template>
  <a-image
    :src="(isHave ? '' : imgUrl) + (url || '')"
    show-loader
    width="100%"
    height="100%"
    :preview="false"
    :class="{ isShadow: isShadow, noTr: haveTr }"
  >
    <template #error>
      <img
        style="
          height: 100%;
          max-width: none;
          position: absolute;
          transform: translateX(-50%);
          left: 50%;
        "
        :src="useMainStore.mainImage + '/book/loading.png'"
        alt=""
      />
    </template>
  </a-image>
</template>
<script lang="ts" setup>
import { mainStore } from '../store'
import { storeToRefs } from 'pinia'
// import qLoading from '../components/QLoading.vue'
const useMainStore = mainStore()
const { imgUrl } = storeToRefs(useMainStore)
type props = {
  url: string | undefined
  isShadow?: boolean
  isHave?: boolean
  haveTr?: boolean
}
const { url, isShadow } = defineProps<props>()
</script>
<style lang="scss" scoped>
.arco-image:not(.noTr):hover :deep img {
  transform: scale(1.2);
}
.arco-image :deep img {
  transition: all 0.3s ease;
}
.arco-image {
  position: relative;
  overflow: hidden;
  :deep img {
    height: 100%;
    min-width: 100%;
  }
}
.arco-image-loading {
  // width: 100% !important;
  height: 100%;
}
.arco-image:not(
    .arco-image-loading-error,
    .isShadow,
    .arco-image-loading
  )::after {
  content: ' ';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: url('../assets/image/bookBorder.png') no-repeat top left;
}
.arco-image-overlay {
  height: 100%;
  width: 100%;
}
.arco-image-loader {
  width: 100%;
  height: 100%;
}
</style>
