<template>
  <div id="update-user-sessio">
    <a-form
      @submit="handleSubmit"
      auto-label-width
      :model="from"
      :style="{ width: '600px' }"
    >
      <a-form-item field="username" label="账号:">
        {{ from.username }}
      </a-form-item>
      <a-form-item field="nickname" label="账户昵称:">
        <a-input
          :style="{ width: '320px' }"
          placeholder="请输入您的昵称(3-12个字)"
          allow-clear
          size="large"
          v-model:model-value="from.nickName"
        />
      </a-form-item>
      <a-form-item field="birthday" label="出生日期:">
        <a-date-picker
          size="large"
          style="width: 200px"
          v-model:model-value="from.birthday"
          position="top"
        />
      </a-form-item>
      <a-form-item field="userSex" label="性别:">
        <a-space>
          <a-radio-group size="large" v-model:model-value="from.userSex">
            <a-radio :value="0">男</a-radio>
            <a-radio :value="1">女</a-radio>
          </a-radio-group>
        </a-space>
      </a-form-item>
      <a-form-item field="intro" label="个性签名:">
        <a-textarea
          placeholder="请输入个人签名"
          v-model:model-value="from.intro"
          :max-length="100"
          show-word-limit
          style="width: 253px"
          :auto-size="{ minRows: 5 }"
        />
      </a-form-item>
      <a-form-item>
        <div class="from-operate">
          <a-button @click="$router.push('/user')">取消修改</a-button>
          <a-button html-type="submit">保存修改</a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { Message } from '@arco-design/web-vue'
import { mainStore } from '../../../store'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { updateUserInfo } from '../../../api/User'
import router from '../../../router'
let store = mainStore()
let { user } = storeToRefs(store)
let from = ref(user)

/**
 * 提交表单
 */
const handleSubmit = async () => {
  updateUserInfo(from.value).then((r) => {
    if (r.data.status == 200) {
      Message.success('修改成功')
      store.getUser()
      setTimeout(() => {
        router.push('/user')
      }, 200)
    } else {
      Message.error('修改失败')
    }
  })
}
</script>
<style lang="scss" scoped>
#update-user-sessio {
  :deep .arco-tabs-tab-title {
    font-size: 16px;
    font-weight: 700;
  }
  :deep .arco-row {
    margin-bottom: 30px;
    .arco-form-item-label-col {
      justify-content: flex-start;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
        'Noto Color Emoji';
    }
  }
  .from-operate {
    display: flex;
    gap: 20px;
    > button {
      font-size: 14px;
      width: 114px;
      text-align: center;
      height: 34px;
      border-radius: 14px;
      font-weight: 700;
      &:first-child {
        width: 113px;
        height: 33px;
        background: white;
        outline: 1px solid rgb(var(--qing-color));
        color: rgb(var(--qing-color));
        transition: all 0.3s ease;
        &:hover {
          color: white;
          border-color: rgb(var(--qing-color));
          background-color: rgb(var(--qing-color));
        }
      }
      &:last-child {
        color: white;
        background: linear-gradient(320deg, rgb(var(--qing-color)), skyblue);
        border: 1px solid white;
      }
    }
  }
}
</style>
