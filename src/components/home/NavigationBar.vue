<template>
  <div id="navigationBar" ref="navigationBar">
    <div class="center">
      <div
        v-for="(text, i) in urlList"
        @click="clickTab(i, $event)"
        :class="'head_tab' + i"
      >
        {{ text.name }}
      </div>
      <span class="move"></span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { reactive } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const urlList = reactive([
  {
    name: '首页',
    url: '/',
  },
  { name: '全部作品', url: '/category' },
  { name: '排行', url: '/rank' },
  // { name: '作者', url: '/category' },
  { name: '完本', url: '/category?serialize=1' },
])
// const urls = reactive([])
let index = ref(0)
let navigationBar = ref(null)
const router = useRouter()
const clickTab = (i: number, e: Event) => {
  index.value = i
  router.push(urlList[i].url)
  setMove(e.target as HTMLElement)
}

onMounted(() => {
  index.value = 1
  setMove(document.querySelector('.head_tab0') as HTMLElement)
})

const setMove = (e: HTMLElement) => {
  ;((navigationBar as any).value as HTMLElement).style.setProperty(
    '--moveWidth',
    e.offsetWidth - 10 + 'px'
  )
  ;((navigationBar as any).value as HTMLElement).style.setProperty(
    '--moveLeft',
    e.offsetLeft + 5 + 'px'
  )
}
</script>
<style lang="scss" scoped>
#navigationBar {
  // background: rgb(6 64 198 / 90%);
  --moveWidth: 10px;
  --moveLeft: 0px;
  background-color: rgb(45 51 66 / 90%);
  height: 50px;
  width: 100%;
  box-sizing: border-box;
  padding: 0 22%;

  .center {
    position: relative;
    display: flex;
    // justify-content: center;
    align-items: center;
    gap: 10px;
    > div {
      padding: 0 30px;
      color: white;
      cursor: pointer;
      position: relative;
      line-height: 50px;
      transition: all 0.3s ease;
      min-width: 30px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      &::after {
        content: ' ';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: white;
        display: none;
      }
      &:hover::after {
        display: block;
      }
      &:hover {
        background-color: rgb(43 48 60 / 90%);
      }
    }
    .move {
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      width: var(--moveWidth);
      transform: translateX(var(--moveLeft));
      height: 3px;
      background: white;
      transition: all 0.3s ease;
    }
  }
}
</style>
