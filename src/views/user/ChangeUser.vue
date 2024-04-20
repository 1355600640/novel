<template>
  <div id="change-user">
    <a-tabs default-active-key="1" :lazy-load="true">
      <a-tab-pane key="1" title="基本信息">
        <upDateUserSession />
      </a-tab-pane>
      <a-tab-pane key="2" title="修改头像">
        <UpdateUserAvatar />
      </a-tab-pane>
      <a-tab-pane key="3" title="修改密码">
        <UpdateUserPassword />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import upDateUserSession from './changUser/UpdateUserSession.vue'
import UpdateUserAvatar from './changUser/UpdateUserAvatar.vue'
import UpdateUserPassword from './changUser/UpdateUserPassword.vue'

onMounted(() => {})
</script>
<style lang="scss" scoped>
#change-user {
  background-color: white;
  padding: 30px 20px;
  box-sizing: border-box;
  border-radius: 12px;
}
</style>
