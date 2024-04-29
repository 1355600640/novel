<template>
  <div ref="loginView" id="login">
    <div class="centerView">
      <div @transitionstart="animationstart" class="table">
        <!-- 登录页面 -->
        <div
          @transitionstart="(e) => e.stopPropagation()"
          class="login"
          v-show="!data.regist"
        >
          <div class="text-center pb-6 text-2xl font-bold">登录</div>
          <a-form
            class="login-from"
            :model="loginForm"
            :style="{ width: '100%' }"
            :rules="rules"
            @submit-success="login"
          >
            <a-form-item field="账号" label="账号">
              <a-input
                v-model="loginForm.username"
                placeholder="请输入你的账号"
                autocomplete
              />
            </a-form-item>
            <a-form-item field="密码" label="密码">
              <a-input-password
                v-model="loginForm.password"
                placeholder="请输入你的密码"
                autocomplete
              />
            </a-form-item>
            <a-form-item
              :wrapper-col-style="{
                'justify-content': 'center',
              }"
              :hide-label="true"
            >
              <a-button
                @click="updateOverlayP(false, $event, true)"
                size="large"
                shape="round"
                html-type="submit"
              >
                登录
              </a-button>
            </a-form-item>
          </a-form>
        </div>
        <!-- 注册页面 -->
        <div
          @transitionstart="(e) => e.stopPropagation()"
          @animationend="e=>(e.target as Element).classList.remove('buttonClick')"
          class="regist"
          v-show="data.regist"
        >
          <div class="text-center pb-6 text-2xl font-bold">注册</div>
          <a-form
            :rules="rules"
            class="regist-from"
            :model="form"
            @submit-success="regist"
          >
            <a-form-item field="username" label="账号">
              <a-input
                tabindex="1"
                v-model="form.username"
                placeholder="请输入你的账号"
                autocomplete
              />
            </a-form-item>
            <a-form-item field="password" label="密码">
              <a-input-password
                tabindex="2"
                v-model="form.password"
                placeholder="请输入你的密码"
                autocomplete
              />
            </a-form-item>
            <a-form-item field="surePassword" label="确认密码">
              <a-input-password
                tabindex="3"
                v-model="form.surePassword"
                placeholder="请再次输入你的密码"
                autocomplete
              />
            </a-form-item>
            <a-form-item field="code" label="验证码">
              <a-input
                tabindex="4"
                v-model="form.code"
                placeholder="请输入验证码"
              />
              <img
                style="cursor: pointer; width: 100px"
                :preview="false"
                :src="data.codeUrl"
                class="pl-5"
                height="100%"
                width="200px"
                fit="contain"
                @click="getCode"
                title="看不清？点我切换"
              />
            </a-form-item>
            <a-form-item
              :wrapper-col-style="{
                'justify-content': 'center',
                'margin-top': '10px',
              }"
              :hide-label="true"
            >
              <a-button
                @click="updateOverlayP(false, $event, true)"
                size="large"
                shape="round"
                html-type="submit"
              >
                注册
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
      <div class="overlay">
        <div>
          <a-button
            @animationend="(e:MouseEvent) => (e.target as Element).classList.remove('buttonClick')"
            @click="updateOverlayP(false, $event)"
            size="large"
            shape="round"
            >登录</a-button
          >
          <a-button
            @animationend="(e:MouseEvent) => (e.target as Element).classList.remove('buttonClick')"
            @click="updateOverlayP(true, $event)"
            size="large"
            shape="round"
            >注册</a-button
          >
        </div>
        <div class="return-login">
          <div title="返回首页" @click="router.back()" class="return-icon">
            <icon-undo />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { code, loginUser, registUser } from '../api/User'
import { onMounted, reactive, ref, Ref } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
const router = useRouter()
let data = reactive({
  regist: false,
  codeUrl: '',
  codeCount: 0,
  returnCode: false,
})
let form = ref({
  username: '',
  password: '',
  surePassword: '',
  code: '',
})
let loginForm = ref({
  username: '',
  password: '',
})
const loginView: Ref<HTMLElement> = ref(null as any)
/**用户名验证 */
let userNameRule = (value: any, callback: Function) => {
  const reg = /^(\w){6,}$/
  if (!reg.test(value)) {
    callback('只能包含字母、数字和下划线')
  }
}
const rules = {
  username: [
    { required: true, message: '请填写用户名' },
    {
      validator: userNameRule,
      message: '请输入6位数以上，以字母、数字和下划线组成的',
    },
  ],
  password: [
    { required: true, message: '请填写密码' },
    {
      minLength: 6,
      message: '请输入6位数以上的密码',
    },
  ],
  surePassword: [
    { required: true, message: '请再次填写密码' },
    {
      minLength: 6,
      message: '请输入6位数以上的密码',
    },
  ],
  code: [{ required: true, message: '请填写验证码' }],
}

/**登录 */
import cookie from '../utils/Cookie'
let login = () => {
  loginUser(loginForm.value).then((r: any) => {
    if (r.data.status == 200) {
      cookie.setCookie(
        {
          novel_token: r.data.data.Token,
        },
        1
      )
      localStorage.setItem('novel_token_long', r.data.data.LongToken)
      router.push('/')
      Message.success('登录成功')
    } else Message.error(r.data.message)
  })
}

/**注册 */
let regist = () => {
  if (form.value.password !== form.value.surePassword) {
    Message.error('两次密码不一致')
  } else {
    registUser(form.value).then((r: any) => {
      if (r.data.status == 200) {
        Message.success('注册成功')
        updateOverlayP(false)
        form.value = {
          username: '',
          password: '',
          surePassword: '',
          code: '',
        }
        getCode()
      } else {
        getCode()
      }
    })
  }
}

/** 获取验证码 */
let getCode = () => {
  if (!data.returnCode) {
    data.returnCode = true
    code({
      count: data.codeCount,
    }).then(
      (r: any) => {
        if (r.data.status == 200) {
          data.codeUrl = r.data.data
          data.codeCount++
        } else {
          Message.error(r.data.data)
        }
        data.returnCode = false
      },
      () => {
        data.returnCode = false
      }
    )
  }
}

/**
 * 点击按钮切换登录/注册页
 */
const animationstart = (e: TransitionEvent) => {
  e.stopPropagation()
  e.preventDefault()
  setTimeout(() => {
    data.regist = !data.regist
  }, 150)
}

/**
 * 点击按钮切换显示登录/注册页面动画
 * @param  black 登录/注册
 * @param e
 */
const updateOverlayP = (
  black: boolean,
  e?: MouseEvent,
  isSumbit?: true
): void => {
  if (isSumbit == null) {
    loginView.value?.style.setProperty('--overlayL', black ? '0%' : '100%')
    loginView.value?.style.setProperty('--backposi', black ? 'left' : 'right')
    loginView.value?.style.setProperty('--buttonMove', black ? '0%' : '50%')
    loginView.value?.style.setProperty('--returnButton', black ? '1' : '0')
  }

  if (e != null) (e.target as Element).classList.add('buttonClick')
}

onMounted(() => {
  // 获取验证码
  getCode()
})
</script>
<style scoped lang="scss">
#login {
  --blue: #0367a6;
  --lightblue: #008997;
  --overlayL: 100%;
  --buttonMove: 50%;
  --buttonTransitionDuration: 600;
  --returnButton: 0;
  --backposi: right;
  $transitionSetting: all calc(var(--buttonTransitionDuration) * 1ms) ease;
  background: url('/background.jpg') no-repeat center center;
  background-size: 100% 100%;
  // transition: all .3s linear;
  height: 100vh;
  width: 100%;
  .centerView {
    border-radius: 16px;
    box-shadow: 0px 8px 17px #2b2b2bcf;
    position: relative;
    width: 55%;
    height: calc(60% / 16 * 12);
    top: 50%;
    left: 50%;
    min-width: 700px;
    min-height: calc(500px / 16 * 12);
    transform: translate(-50%, -50%);
    overflow: hidden;
    background: rgb(225 225 225);
    // padding-top: 50%;
    .table {
      position: absolute;
      left: 0;
      height: 100%;
      width: 50%;
      transform: translateX(calc(100% - calc(var(--overlayL))));
      transition: $transitionSetting;
      > div {
        overflow: hidden;
        box-sizing: border-box;
        padding: 30px 40px;
        display: flex;
        flex-direction: column;
        :deep .arco-form {
          .arco-image-loading-error {
            width: 50px !important;
          }
          .arco-form-item-layout-horizontal:last-child {
            justify-content: center !important;
            .arco-form-item-content {
              justify-content: center !important;
            }
          }
          .arco-form-item-label {
            // font-size: 0.8vw;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .arco-form-item-label-col {
            flex: 0 0 30% !important;
            width: 30%;
          }
          .arco-form-item-wrapper-col {
            flex: 0 0 70% !important;
            width: 70%;
          }
        }
      }
      .login {
        height: 100%;
        .login-from {
          flex: 1;
          display: flex;
          justify-content: center;
        }
      }
    }
    .overlay {
      will-change: transform;
      width: 50%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      transform: translateX(var(--overlayL)) translateZ(0);
      background: url('/background.jpg') no-repeat center var(--backposi);
      background-size: 200% 100%;
      // background-position: (var(--overlayL), 0);
      transition: $transitionSetting;
      overflow: hidden;
      z-index: 999;
      > div:first-child {
        position: relative;
        left: 0;
        width: 200%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        transition: $transitionSetting;
        transform: translateX(
            calc(calc(var(--buttonMove)) - calc(var(--overlayL)))
          )
          translateZ(0);
        will-change: transform;
        @at-root button {
          padding: 22px 60px;
          background-image: linear-gradient(
            90deg,
            var(--blue),
            var(--lightblue)
          ) !important;
          color: white !important;

          // animation-play-state: paused;
        }
        @at-root .buttonClick {
          animation: buttonClick 0.3s ease;
        }
        @keyframes buttonClick {
          0% {
            transform: scale(0.95);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      }
      .return-login {
        $icon-width: 50px;
        $return-padding: 20px;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        box-sizing: border-box;
        padding: $return-padding;
        transition: $transitionSetting;
        transform: translateX(
            calc(
              100% - var(--overlayL) - ($icon-width + $return-padding * 2) *
                var(--returnButton)
            )
          )
          translateZ(0);
        > .return-icon {
          color: #999999;
          background: white;
          border-radius: 16px;
          // padding: 10px;
          width: $icon-width;
          line-height: 30px;
          text-align: center;
          cursor: pointer;
          transition: $transitionSetting;
        }
        .return-icon:hover {
          background: #066ecb;
          color: white;
        }
      }
      @if var(--overlayL) == 100% {
        .return-login {
          left: calc(calc(100% - calc(var(--overlayL)))) !important;
        }
      }
    }
  }
}
</style>
