<template>
  <div id="update-user-password">
    <a-form
      @submit="handleSubmit"
      auto-label-width
      :model="password"
      :style="{ width: '600px' }"
      :scroll-to-first-error="true"
    >
      <a-form-item label="用户昵称">
        {{ from.username }}
      </a-form-item>
      <a-form-item field="oldPwd" label="旧密码" :rules="fromRule">
        <a-input-password
          :style="{ width: '320px' }"
          placeholder="输入旧密码"
          allow-clear
          size="large"
          v-model:model-value="password.oldPwd"
        />
      </a-form-item>
      <a-form-item field="newPwd" label="新密码" :rules="fromRule">
        <a-input-password
          :style="{ width: '320px' }"
          placeholder="密码6-16位。可包含数字、字母（区分大小写）"
          allow-clear
          size="large"
          v-model:model-value="password.newPwd"
        />
      </a-form-item>
      <a-form-item field="surePwd" label="确认密码" :rules="fromRule">
        <a-input-password
          :style="{ width: '320px' }"
          placeholder="密码6-16位。可包含数字、字母（区分大小写）"
          allow-clear
          size="large"
          v-model:model-value="password.surePwd"
        />
      </a-form-item>
      <a-form-item
        field="authCode"
        label="验证码"
        :rules="[{ required: true, match: /^(\-|\+)?\d+?$/ }]"
      >
        <div class="auth-code">
          <a-input
            :style="{ width: '220px' }"
            placeholder="输入验证码"
            allow-clear
            size="large"
            v-model:model-value="password.authCode"
          />
          <img
            style="cursor: pointer; width: 100px"
            :preview="false"
            :src="pageData.codeUrl"
            height="100%"
            width="200px"
            fit="contain"
            @click="getCode"
            title="看不清？点我切换"
          />
        </div>
      </a-form-item>
      <a-form-item>
        <div class="from-operate">
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
import { ref, onMounted } from 'vue'
import { updateUserPassword, code } from '../../../api/User'
import router from '../../../router'
let store = mainStore()
let { user } = storeToRefs(store)
let from = ref(user)
let password = ref({
  oldPwd: '',
  newPwd: '',
  surePwd: '',
  authCode: '',
})
let pageData = ref({
  codeUrl: '',
  codeCount: 0,
})
let fromRule = ref([
  {
    required: true,
    message: '字母数字开头，密码6-16位。可包含数字、字母（区分大小写）',
    minLength: 6,
    maxLength: 16,
    match: /^[a-zA-Z0-9][a-zA-Z0-9_]{5,15}$/,
  },
])
let getCode = () => {
  code({
    count: pageData.value.codeCount,
    source: 2,
  }).then((r: any) => {
    if (r.data.status == 200) {
      pageData.value.codeUrl = r.data.data
      pageData.value.codeCount++
    } else {
      Message.error(r.data.data)
    }
  })
}
onMounted(() => {
  getCode()
})
const handleSubmit = ({ errors }: { errors: any }) => {
  let message = ''

  if (errors) return
  if (password.value.oldPwd == password.value.newPwd) {
    message = '新密码不能与新密码一致'
  } else if (password.value.newPwd != password.value.surePwd) {
    message = '新密码与确认密码不椅子'
  }

  if (message == '') {
    from.value.password = password.value.newPwd
    console.log(1)

    updateUserPassword({
      password: password.value.newPwd,
      code: password.value.authCode,
      oldPassword: password.value.oldPwd,
    }).then((updateR) => {
      if (updateR.data.status == 200) {
        store.clearUser().then((r) => {
          if (r.status == 200) {
            Message.success(updateR.data.message)
            router.push('/login')
          }
        })
      } else {
        Message.error('修改失败')
      }
    })
  } else {
    Message.error(message)
  }
}
</script>
<style lang="scss" scoped>
#update-user-password {
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
  .auth-code {
    display: flex;
    gap: 20px;
    img {
      border: 1px solid #e0e0e0;
      border-radius: 2px;
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
      // &:last-child {
      //   color: white;
      //   background: linear-gradient(320deg, rgb(var(--qing-color)), skyblue);
      //   border: 1px solid white;
      // }
    }
  }
}
</style>
