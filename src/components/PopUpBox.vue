<!-- 弹出框 -->
<template>
  <div
    v-show="boxIn"
    @animationend="animationend"
    id="PopUpBox"
    :class="{ showPop: showBox, hiddenPop: !showBox }"
  >
    <div class="center" :class="{ round }">
      <div v-if="props.title" class="mt-3 title text-center font-bold text-xl">
        {{ props.title }}
      </div>
      <a-divider v-if="props.title" style="margin: 10px 0 20px" />
      <div class="switch" @click="emit('update:showBox', !showBox)">
        <icon-close />
      </div>
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
type Props = {
  showBox: boolean
  title?: string
  round?: boolean
}
const emit = defineEmits()
const props = defineProps<Props>()
let boxIn = ref(props.showBox || false)
watch(
  () => props.showBox,
  (newValue: boolean) => {
    if (newValue) boxIn.value = newValue
  }
)
let animationend = () => {
  if (!props.showBox) boxIn.value = false
}
</script>
<style lang="scss" scoped>
.round {
  border-radius: 12px;
  overflow: hidden;
}
.showPop {
  $animationTime: 0.5s;
  animation: showPop $animationTime ease;
  animation-fill-mode: forwards;
  @keyframes showPop {
    0% {
      background: transparent;
    }
    100% {
      background: rgba(29, 33, 41, 0.6);
    }
  }
  .center {
    animation: centerShow $animationTime ease;
    animation-fill-mode: forwards;
    @keyframes centerShow {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
  }
}
.hiddenPop {
  $animationTime: 0.5s;
  animation: hiddenPop $animationTime ease;
  animation-fill-mode: forwards;
  @keyframes hiddenPop {
    0% {
      background: rgba(29, 33, 41, 0.6);
    }
    100% {
      background: transparent;
    }
  }
  .center {
    animation: hiddenShow $animationTime ease;
    animation-fill-mode: forwards;
    @keyframes hiddenShow {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }
  }
}
#PopUpBox {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(29, 33, 41, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;

  .center {
    background: white;
    min-width: 200px;
    min-height: 200px;
    position: relative;
    .content {
    }
    .switch {
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
      border-radius: 50%;
      transition: all 0.3s ease;
      padding: 5px;
      &:hover {
        background-color: rgb(242, 243, 245);
      }
    }
  }
}
</style>
