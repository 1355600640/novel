<template>
  <div class="loading" ref="loading">
    <div v-if="props.loading == true || props.loading == null">
      <div class="qing-loading"></div>
      <div class="loading-text">{{ props.text }}</div>
    </div>
    <slot v-else></slot>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue'
const props = defineProps(['text', 'width', 'height', 'loading'])
const loading: Ref<HTMLElement> = ref(null as any)
onMounted(() => {
  const number = /^[0-9]*$/
  if (typeof props.width == 'number' || number.test(props.width as string))
    loading.value.style.width = props.width + 'px'
  else loading.value.style.width = props.width as string
  if (typeof props.height == 'number' || number.test(props.height as string))
    loading.value.style.height = props.height + 'px'
  else loading.value.style.height = props.height as string
})
</script>
<style lang="scss" scoped>
$loadingWidth: 25px;
.loading {
  background: white;
  position: relative;
  text-align: center;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
}
.qing-loading {
  width: 100%;
  height: $loadingWidth;
  background: transparent;
  position: relative;
  animation: loadingAni linear 1s infinite;
}
@keyframes loadingAni {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.qing-loading::after {
  content: ' ';
  border: 2px solid #000000;
  width: $loadingWidth;
  height: $loadingWidth;
  display: block;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.qing-loading::before {
  content: ' ';
  width: 10px;
  height: 10px;
  z-index: 9;
  background-color: white;
  display: block;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-left: calc($loadingWidth/2);
}
.loading-text {
  padding-top: 10px;
  // font-size: 12px;
}
</style>
