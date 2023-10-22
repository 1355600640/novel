<template>
  <div id="chapter">
    <!-- 分类 -->
    <div class="book_category">
      <span class="cursor-pointer" @click="$router.push('/')">首页</span>
      <span><icon-right /></span>
      <!-- TODO 跳转分类 -->
      <span class="cursor-pointer">{{
        pageContent.bookInfo?.categoryName
      }}</span>
      <span><icon-right /></span>
      <span>{{ pageContent.bookInfo?.bookName }}</span>
    </div>
    <!-- 第一章内容显示章节信息 -->
    <div v-if="pageSession.page == '0'" class="frist-page-of-info">
      <div class="book_image">
        <ImgLoading :url="pageContent.bookInfo?.picUrl" />
      </div>
      <div class="book_title text-2xl">
        {{ pageContent.bookInfo?.bookName }}
      </div>
      <div class="book_author" style="color: #666">
        {{ pageContent.bookInfo?.authorName }}
      </div>
      <div class="book_session">
        <div>
          <div>{{ pageContent.bookInfo?.categoryName }}</div>
          <div>类型</div>
        </div>
        <div>
          <div>
            {{ stringToDate(pageContent.bookInfo?.createTime, 'date') }}
          </div>
          <div>首发时间</div>
        </div>
        <div>
          <div>
            {{ normNumber(pageContent.bookInfo?.wordCount as number, 1) }}
          </div>
          <div>字数</div>
        </div>
      </div>
      <div style="color: #999">与众多书友一起开启品质阅读</div>
    </div>
    <div class="page-content">
      <div class="page-title text-center text-3xl pt-20">
        {{ numberToCapital(pageContent.bookChapter?.chapterName) }}
      </div>
      <div class="page-session">
        <div>作者:{{ pageContent.bookInfo?.authorName }}</div>
        <div>本章字数:{{ pageContent.bookChapter?.wordCount }}</div>
        <div>更新时间:{{ pageContent.bookChapter?.updateTime }}</div>
      </div>
      <div class="page-content-text" v-html="pageContent.content"></div>
    </div>
    <div class="button">
      <div @click="toPage(-1)">上一章</div>
      <div
        @click="$router.push({ path: `/detail/${pageSession.bookId}/${2}` })"
      >
        目录
      </div>
      <div @click="toPage(1)">下一章</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { stringToDate, normNumber, numberToCapital } from '../utils/commonUtils'
import ImgLoading from '../components/ImgLoading.vue'
import { bookContent, bookContentT } from '../api/BookInfo'
import { ref, onMounted, Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
const route = useRoute()
const router = useRouter()
type pageSessionType = {
  page: string
  bookId: string
}
let pageContent: Ref<bookContentT> = ref({} as bookContentT)
let pageSession: Ref<pageSessionType> = ref({
  page: '0',
  bookId: '',
})

// 获取章节内容
const getBookContent = async () => {
  // TODO 如果没有章节跳转最近阅读的章节，没有则跳转至第一章
  bookContent(pageSession.value.bookId, pageSession.value.page).then((r) => {
    if (r.data.status === 200) {
      pageContent.value = r.data.data
      pageContent.value.content = pageContent.value.content.replaceAll(
        '<br/><br/>',
        '<br/>'
      )
    }
  })
}
onMounted(() => {
  if (!route.params.id) {
    // router.push('/')
  } else {
    pageSession.value.bookId = route.params.id as string
    pageSession.value.page = (route.params?.page as string) || '0'
    getBookContent()
  }
})

const toPage = (upOrDown: number) => {
  if (pageSession.value.page == '0' && upOrDown === -1) {
    Message.normal('没有上一章！')
  } else if (
    pageContent.value.chapterNum ==
    parseInt(pageContent.value.bookChapter.chapterNum + 1)
  ) {
    Message.normal('没有下一章！')
  } else {
    router.push(
      `/chapter/${pageSession.value.bookId}/${
        parseInt(pageSession.value.page) + upOrDown
      }`
    )
    Message.clear()
  }
}
</script>
<style lang="scss" scoped>
#chapter {
  width: 70%;
  margin: 0 auto 50px;
  .book_category {
    display: flex;
    margin: 20px 0 40px;
    font-size: 12px;
    gap: 5px;
    color: #666;
    > span:last-child {
      color: #999;
    }
  }
  .frist-page-of-info {
    background: white;
    border-radius: 16px;
    padding: 30px 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
    .book_image {
      height: 217px;
    }

    .book_session {
      display: flex;
      > div {
        padding: 0 40px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        > div {
          font-size: 17px;
          &:last-child {
            color: #999;
            font-size: 13px;
          }
        }
        &::after {
          content: ' ';
          position: absolute;
          height: 70%;
          width: 1px;
          background: rgba(0, 0, 0, 0.12);
          right: 0;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
        }
        &:last-child ::after {
          content: none;
        }
      }
    }
  }

  .page-content {
    background-color: white;
    border-radius: 16px;
    padding-bottom: 20px;
    .page-session {
      display: flex;
      gap: 40px;
      justify-content: center;
      font-size: 14px;
      color: #666;
      margin-top: 30px;
      padding-bottom: 15px;
    }
    .page-content-text {
      width: 80%;
      margin: 0 auto;
      border-top: 1px solid #e7e7e7;
      padding-top: 40px;
      font-size: 16px;
      line-height: 40px;
    }
  }
  .button {
    margin-top: 25px;
    background-color: white;
    border-radius: 16px;
    display: flex;
    overflow: hidden;
    > div {
      flex: 1;
      text-align: center;
      line-height: 60px;
      font-size: 16px;
      position: relative;
      cursor: pointer;
      &:hover {
        background: rgb(var(--qing-color));
        color: white;
      }
      &::after {
        content: ' ';
        position: absolute;
        height: 40%;
        width: 1px;
        background: #e7e7e7;
        right: 0;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
      &:last-child ::after {
        content: none;
      }
    }
  }
}
</style>
