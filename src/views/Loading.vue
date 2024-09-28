<template>
  <div id="loading">
    <div>加载中...</div>
  </div>
</template>
<script lang="ts" setup></script>
<style lang="scss" scoped>
#loading {
  height: 500px;
  width: 100%;
  text-align: center;
  > div {
    display: flex;
    justify-items: center;
    align-items: center;
  }
}
</style>
