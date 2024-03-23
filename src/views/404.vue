<template>
  <div id="error" ref="error">
    <div class="center">
      <div class="no-last-update">
        <div class="icon-book">
          <i
            class="iconfont icon-bishuamoji3 animate__slideInDown animate__animated"
          ></i>
          <i
            class="iconfont icon-shufabichu39 animate__slideInRight animate__animated"
          ></i>
          <i
            class="iconfont icon-bishuamoji3 animate__animated animate__slideInDown"
          ></i>
          <div>
            <i
              class="iconfont icon-shufabichu41 animate__slideInRight animate__animated"
            ></i>
          </div>
          <i class="iconfont icon-shufabichu39"></i>
          <i
            class="iconfont icon-bishuamoji37 animate__animated animate__fadeIn"
          ></i>
          <i class="iconfont icon-tushuguan"></i>
        </div>
        <div class="bright-text animate__animated animate__backInRight">
          {{ session ? session : '非常抱歉，你要找的页面不存在~' }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue'
const error: Ref<HTMLElement> = ref(null as any)
type Props = {
  session: string
  inContent?: boolean
}
const { session, inContent } = defineProps<Props>()
onMounted(() => {
  const pageHeader = document.querySelector('#pageHeader')
  const footer = document.querySelector('.footer')

  // if (pageHeader && footer && !inContent)
  //   error.value.style.height =
  //     document.body.clientHeight -
  //     pageHeader?.clientHeight -
  //     footer?.clientHeight +
  //     'px'
})
</script>
<style lang="scss" scoped>
#error {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  padding: 20px 0;
  .center {
    width: 70%;
    height: 100%;
    background: white;
    margin: 0 auto;
    .no-last-update {
      height: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      > i {
        font-size: 80px;
        line-height: 80px;
        color: rgb(var(--qing-color));
      }
      font-size: 18px;
      .icon-book {
        position: relative;
        color: #2196f3;
        $i-width: 80px;
        height: 160px;
        width: $i-width;
        i {
          font-size: $i-width;
          line-height: $i-width;
          position: absolute;
          z-index: 2;
        }
        > i:nth-child(1) {
          top: calc($i-width/4);
          left: 0;
        }
        > i:nth-child(2) {
          right: calc($i-width/-2 + 10px);
          top: calc($i-width/2 + 10px);
          height: calc($i-width/2);
          overflow: hidden;
        }
        > i:nth-child(3) {
          top: calc($i-width/2 + 10px);
          right: 0;
        }
        > div {
          position: absolute;
          right: calc($i-width/-2 + 17px);
          top: $i-width + 10px;
          height: calc($i-width/2 + 10px);
          overflow: hidden;
          width: $i-width;
          i {
            margin-top: calc($i-width/-2 + 10px) !important;
          }
        }
        > i:nth-child(5) {
          transform: scaley(1.8);
          top: calc($i-width/2 + 10px);
          animation: lastIcon 1.2s cubic-bezier(0.215, 0.61, 0.355, 1);
          @keyframes lastIcon {
            0% {
              transform: translateY(-300px) scaleY(3);
            }
            60% {
              transform: translateY(10px) scaleY(1.8);
            }
            75% {
              transform: translateY(-5px) scaleY(1.8);
            }
            90% {
              transform: translateY(5px) scaleY(1.8);
            }
            100% {
              transform: translateY(0) scaleY(1.8);
            }
          }
        }
        > i:nth-child(6) {
          font-size: 40px;
          right: 0;
          animation-delay: 0.3s;
        }
        > i:last-child {
          font-size: 160px;
          top: 50%;
          left: 50%;
          color: #dcdddf;
          z-index: 1;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
}
</style>
