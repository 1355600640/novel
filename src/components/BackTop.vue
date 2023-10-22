<template>
  <div
    @click="backTop"
    title="返回顶部"
    :class="backTopShow ? 'showback' : 'hiddenBack'"
    class="backTop"
  >
    <icon-up />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
let backTopShow = ref(false)

const backTop = () => {
  let top = document.documentElement.scrollTop
  const backTopF = setInterval(() => {
    let nowTop = document.documentElement.scrollTop
    if (nowTop <= 0) clearInterval(backTopF)
    else
      document.documentElement.scrollTo(
        document.documentElement.scrollLeft,
        nowTop - top / 60 / 1.5
      )
  }, 1)
}
window.addEventListener('scroll', () => {
  if (document.documentElement.scrollTop > 200) {
    backTopShow.value = true
  } else backTopShow.value = false
})
</script>
<style lang="scss" scoped>
.backTop {
  position: fixed;
  bottom: 100px;
  border-radius: 50%;
  right: 25px;
  background: white;
  width: 50px;
  line-height: 50px;
  text-align: center;
  cursor: pointer;
  display: none;
}
.showback {
  animation: backTopA 0.3s linear;
  display: block;
  @keyframes backTopA {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
}
.hiddenBack {
  animation: backTopAH 0.3s linear;
  display: block;
  animation-fill-mode: forwards;
  @keyframes backTopAH {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      display: none;
    }
  }
}
</style>
