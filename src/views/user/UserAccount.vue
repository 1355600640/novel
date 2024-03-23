<!-- 用户账户 -->
<template>
  <div id="user-account">
    <div class="account-session">
      <div class="account-center">
        <div class="title text-xl font-bold">我的账户</div>
        <div class="account-content">
          <div>
            <div>
              <span class="text-4xl">{{ user.accountBalance }}</span>
              <span class="ml-1 text-sm bright-text">书币</span>
            </div>
          </div>
          <div class="recharge">
            <a-button disabled @click="openRecharge" class="disable-button"
              >充值</a-button
            >
          </div>
        </div>
      </div>
    </div>
    <div class="account-record">
      <a-tabs
        @change="changeTabs"
        default-active-key="1"
        v-model:active-key="pageData.selectTabs"
      >
        <a-tab-pane :key="1" title="充值记录">
          <div>
            <a-table
              @page-change="pageChange"
              v-model:pagination="pagination"
              :data="pageData.payLogs"
              page-position="bottom"
            >
              <template #columns>
                <a-table-column title="充值金额" data-index="amount">
                  <template #cell="{ record }">￥{{ record.amount }}</template>
                </a-table-column>
                <a-table-column
                  title="书币"
                  data-index="productValue"
                ></a-table-column>
                <a-table-column title="充值方式" data-index="email">
                  <template #cell="{ record }">
                    {{ record.payChannel ? '支付宝' : '微信' }}
                  </template>
                </a-table-column>
                <a-table-column
                  title="充值时间"
                  data-index="payTime"
                ></a-table-column>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane :key="2" title="消费记录">
          <div>
            <a-table
              @page-change="pageChange"
              v-model:pagination="pagination"
              :data="pageData.consumeLogs"
              page-position="bottom"
            >
              <template #columns>
                <a-table-column title="消费金额" data-index="amount">
                  <template #cell="{ record }">{{ record.amount }}</template>
                </a-table-column>
                <a-table-column title="消费方式" data-index="productValue">
                  <template #cell="{ record }">{{
                    record.productType == 0 ? '小说' : ''
                  }}</template>
                </a-table-column>
                <a-table-column title="章节名" data-index="producName">
                </a-table-column>
                <a-table-column
                  title="消费时间"
                  data-index="createTime"
                ></a-table-column>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <PopUpBox v-model:showBox="showPay" round>
      <a-spin :loading="pageData.loading">
        <div class="recharge-rules">
          <div class="rule-title">
            <span class="text-xl font-bold">书币充值</span>
            <span class="ml-5 text-sm"
              >余额 <span>{{ user.accountBalance }}</span> 书币</span
            >
          </div>
          <div class="content mt-3">
            <div
              :class="{ 'select-rule': pageData.selectRule?.id == item.id }"
              class="rule"
              v-for="item in pageData.rules"
              :key="item.id"
              @click="pageData.selectRule = item"
            >
              <div>
                <span class="rule-amount">{{ item.amount / 100 }} </span
                ><span class="text-sm font-medium">元</span>
              </div>
              <div>
                <span>{{ item.productValue }}</span>
                <span class="text-xs ml-0.5" v-if="item.giftMount > 0"
                  >+{{ item.giftMount }}</span
                >
                书币
              </div>
            </div>
          </div>
          <div class="select-rule-of-pay">
            <div class="title text-xl font-bold mt-5">选择支付方式</div>
            <div class="pay-icon">
              <icon-wechatpay
                title="微信"
                :class="{ 'select-icon-1': pageData.selectPayType == 1 }"
                @click="pageData.selectPayType = 1"
              />
              <icon-alipay-circle
                title="支付宝"
                :class="{ 'select-icon-2': pageData.selectPayType == 2 }"
                @click="pageData.selectPayType = 2"
              />
            </div>
            <div class="select-rule-of-button">
              <button @click="toRecharge">立即充值</button>
            </div>
          </div>
        </div>
      </a-spin>
    </PopUpBox>
  </div>
</template>
<script lang="ts" setup>
import { mainStore } from '../../store'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import PopUpBox from '../../components/PopUpBox.vue'
import {
  payLog,
  consumeLog,
  userPayLog,
  userConsumeLog,
  rechargeRules,
  rechargeRule,
  userRecharge,
} from '../../api/Recharge'
import { Message } from '@arco-design/web-vue'
let store = mainStore()
let { user } = storeToRefs(store)
let pageData = ref<{
  payLogs: userPayLog[]
  consumeLogs: userConsumeLog[]
  rules: rechargeRule[]
  selectRule: rechargeRule
  selectPayType: number
  loading: boolean
  selectTabs: number
}>({
  payLogs: [],
  consumeLogs: [],
  rules: [],
  selectRule: {} as any,
  selectPayType: 1,
  loading: false,
  selectTabs: 1,
})
import { stringToDate } from '../../utils/commonUtils'

let pagination = ref({
  total: 0,
  current: 1,
  pageSize: 10,
})
let showPay = ref<boolean>(false)

/**
 * 获取用充值记录
 */
const getUserPayLog = () => {
  payLog(pagination.value?.current, pagination.value?.pageSize).then((r) => {
    if (r.data.status == 200) {
      pagination.value.total = parseInt(r.data.data.total)
      pageData.value.payLogs = r.data.data.list.map((r) => {
        stringToDate(r.payTime, 'all')
        return r
      })
    }
  })
}

/**
 * 获取消费记录
 */
const getUserConsumeLog = () => {
  consumeLog(pagination.value?.current, pagination.value?.pageSize).then(
    (r) => {
      if (r.data.status == 200) {
        pagination.value.total = parseInt(r.data.data.total)
        pageData.value.consumeLogs = r.data.data.list.map((r) => {
          stringToDate(r.createTime, 'all')
          return r
        })
      }
    }
  )
}

/**
 * 打开充值框
 */
const openRecharge = () => {
  showPay.value = !showPay.value
  getRechargeRules()
}

/**
 * 获取充值规则
 */
const getRechargeRules = async () => {
  pageData.value.loading = true
  rechargeRules().then(
    (r) => {
      if (r.data.status == 200) {
        pageData.value.rules = r.data.data
        pageData.value.selectRule = r.data.data[0]
      }
      pageData.value.loading = false
    },
    () => (pageData.value.loading = false)
  )
}

/**
 * 用户充值
 */
const toRecharge = async () => {
  pageData.value.loading = true
  userRecharge(pageData.value.selectRule.id).then(
    (r) => {
      if (r.data.status == 200) {
        store.getUser()
        Message.success('充值成功')
      } else Message.error('充值失败')
      pageData.value.loading = false
    },
    () => (pageData.value.loading = false)
  )
}

/**
 * 切换标签数据
 */
const changeTabs = () => {
  switch (pageData.value.selectTabs) {
    case 1:
      getUserPayLog()
      break
    case 2:
      getUserConsumeLog()
      break
  }
}

const pageChange = (page: number) => {
  pagination.value.current = page
  changeTabs()
}

onMounted(() => {
  getUserPayLog()
})
</script>
<style lang="scss" scoped>
#user-account {
  .account-session {
    border-radius: 12px;
    background-color: white;
    .account-center {
      background: linear-gradient(
        349deg,
        hsla(0, 0%, 100%, 0) 21%,
        rgba(255, 252, 249, 0.31) 67%,
        #fff5ec
      );
      padding: 20px 30px;
      // .title {
      //   font-size: 18px;
      //   font-weight: 700;
      // }
      .account-content {
        margin-top: 50px;
        display: flex;
        justify-content: space-between;
        .recharge {
          > button {
            width: 100px;
            text-align: center;
            line-height: 30px;
            border-radius: 12px;
            font-size: 14px;
            &:is(.arco-btn-disabled) {
              border: 1px solid rgb(0 63 208 / 52%);
              background: white;
            }
            &:not(.arco-btn-disabled) {
              background: white;
              color: rgb(var(--qing-color));
              border: 1px solid rgb(var(--qing-color));
              &:hover {
                background-color: rgb(var(--qing-color));
                color: white;
              }
            }
          }
        }
      }
    }
  }
  .account-record {
    border-radius: 12px;
    margin-top: 20px;
    box-sizing: border-box;
    padding: 30px 20px;
    background: white;
    :deep .arco-tabs-tab-title {
      font-weight: 700;
      font-size: 16px;
    }
    :deep .arco-tabs-nav-type-line .arco-tabs-tab {
      margin: 0 1.5rem 0 0 !important;
    }
  }
  .recharge-rules {
    padding: 20px 30px;
    .title {
    }
    .content {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      .rule {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 20px 30px;
        gap: 10px;
        border: 1px solid #dcdddf;
        border-radius: 12px;
        > div {
          &:first-child {
            color: #333;
            font-weight: 700;
            font-size: 28px;
          }
        }
      }
      .select-rule {
        border-color: rgb(var(--qing-color));
        .rule-amount {
          color: rgb(var(--qing-color));
        }
      }
    }

    .select-rule-of-pay {
      .pay-icon {
        display: flex;
        gap: 10px;
        margin: 10px 0 10px;
        > * {
          cursor: pointer;
          font-size: 20px;
        }
        .select-icon-1 {
          color: #09bb07;
        }
        .select-icon-2 {
          color: #02a9f1;
        }
      }
      .select-rule-of-button {
        text-align: center;
        > button {
          padding: 10px 50px;
          text-align: center;
          border-radius: 10px;
          font-size: 16px;
          background-color: rgb(var(--qing-color));
          color: white;
        }
      }
    }
  }
}
</style>
