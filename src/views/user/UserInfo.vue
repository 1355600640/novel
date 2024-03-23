<!-- 用户信息 -->
<template>
  <div id="userInfo">
    <div class="user-top">
      <div class="user-session">
        <div class="user-session-content">
          <ImgLoading
            :have-tr="true"
            :url="userImage + user.userPhoto"
            :isHave="true"
            class="user-image"
          />
          <div class="user-content">
            <div class="text-xl font-bold">{{ user.nickName }}</div>
            <div class="user-count">
              <div>
                <span>关注用户</span>
                {{ user.followUser }}
              </div>
              <div class="divider"></div>
              <div>
                <span>书架书籍</span>
                {{ user.likeBook }}
              </div>
              <div class="divider"></div>
              <div>
                <span>获赞</span>
                {{ user.userUpvote }}
              </div>
            </div>
          </div>
        </div>
        <!-- TODO 个人主页 -->
        <div class="a-hover cursor-pointer">
          个人主页<icon-right class="ml-1" />
        </div>
      </div>
      <div class="user-intro mt-14">
        简介:{{ user.intro || '这个人潇洒不羁爱自由，没写什么介绍~' }}
      </div>
    </div>
    <div class="user-account">
      <div class="user-account-session">
        <div class="account-title">
          <div class="text-xl">
            <i class="iconfont icon-yue"></i>
            帐号余额
          </div>
          <!-- TODO -->
          <div class="cursor-pointer">明细<icon-caret-right /></div>
        </div>
        <div class="gap-xl account-count flex flex-col items-center">
          <div class="text-3xl font-bold">{{ user.accountBalance }}</div>
          <div class="text-gray-600 text-xs">书币</div>
        </div>
        <div class="user-account-operate"><button>充值</button></div>
      </div>
      <div class="user-account-session">
        <div class="account-title">
          <div class="text-xl">
            <i class="iconfont icon-xiaoxi"></i>
            系统消息
          </div>
        </div>
        <!-- TODO -->
        <div class="gap-xl account-count flex flex-col items-center">
          <div class="text-3xl font-bold">0</div>
          <div class="text-gray-600 text-xs">未读系统消息</div>
        </div>
        <div class="user-account-operate"><button>查看详情</button></div>
      </div>
    </div>
    <div class="user-read mt-5">
      <UserRead />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { mainStore } from '../../store'
import { storeToRefs } from 'pinia'
import ImgLoading from '../../components/ImgLoading.vue'
import UserRead from './UserRead.vue'
let store = mainStore()
let { user, userImage } = storeToRefs(store)
</script>
<style lang="scss" scoped>
#userInfo {
  .user-top {
    background: white;
    padding: 30px 25px;
    border-radius: 12px;
    .user-session {
      display: flex;
      justify-content: space-between;
      .user-session-content {
        display: flex;
        gap: 20px;
        .user-image {
          width: 90px !important;
          height: 90px !important;
          border-radius: 50%;
        }
        .user-content {
          display: flex;
          justify-content: center;
          flex-direction: column;
          .user-count {
            display: flex;
            margin-top: 30px;
            align-items: center;
            color: #2d3035;
            > div span {
              color: #8d8e91;
              margin-right: 5px;
            }
            .divider {
              height: 80%;
              width: 1px;
              background-color: #ececec;
              margin: 0 20px;
            }
          }
        }
      }
    }
  }
  .user-account {
    overflow: hidden;
    margin-top: 20px;
    display: flex;
    gap: 30px;
    .user-account-session {
      border-radius: 12px;
      display: flex;
      flex: 1;
      gap: 20px;
      flex-direction: column;
      padding: 20px 10px;
      justify-content: center;

      &:first-child {
        background: linear-gradient(180deg, #fff5ec, #fffcf9 21%, #fff 45%);
        i {
          color: #ffb63c;
        }
      }
      &:nth-child(2) {
        background: linear-gradient(180deg, #f1fcff, #f7fdff 13%, #fff 45%);
        i {
          color: #99ecd5;
        }
      }
      .account-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .user-account-operate {
        display: flex;
        justify-content: center;
        button {
          border: 1px solid #dcdfe6;
          padding: 10px 0;
          width: 160px;
          border-radius: 16px;
          transition: all 0.3s ease;
          &:hover {
            border-color: rgb(var(--qing-color));
            color: rgb(var(--qing-color));
          }
        }
      }
    }
  }
}
</style>
