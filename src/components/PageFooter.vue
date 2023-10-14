<template>
  <div class="footer">
    <div>
      <div>友情链接:</div>
      <a href="http://www.baidu.com">百度</a>
      <a href="https://blog.csdn.net/">csdn</a>
      <a href="">github</a>
    </div>
    <div>Copyright (C) xxyopen.com All rights reserved 清风文学网版权所有</div>
  </div>
</template>
<script lang="ts" setup></script>
<style lang="scss" scoped>
.footer {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  padding-bottom: 30px;
  > div:first-child {
    display: flex;
    gap: 20px;
    justify-content: center;
    a:hover{
      color: rgb(var(--qing-color));
      font-weight: 700;
    }
  }
}
</style>
