<template>
  <div id="home">
    <div class="banner">
      <div class="banner_left">
        <div class="swiper-box-left">
          <Swiper
            ref="swiper_left"
            class="banner_swiper_left"
            :autoplay="{
              delay: 6000,
            }"
            :allow-touch-move="false"
            :modules="modules"
            :loop="true"
            :slides-per-view="1"
            @swiper="onSwiper"
            @transition-start="sliderMove"
            :navigation="{
              nextEl: '.banner-pre',
              prevEl: '.banner-next',
            }"
            effect="coverflow"
          >
            <SwiperSlide v-for="i in homeBanner.carousel" :key="(i as any).id">
              <div class="swiper_item">
                <div class="swiper_conetent">
                  <div
                    class="swiper_image"
                    @click="$router.push(`/detail/${i.id}`)"
                  >
                    <img-loading :url="(i as any).picUrl" />
                  </div>
                  <div class="book_session flex flex-col justify-between">
                    <div
                      @click="$router.push(`/detail/${i.id}`)"
                      class="text-color-tr text-xl text-center"
                    >
                      {{ (i as any).bookName }}
                    </div>
                    <div
                      @click="router.push(`/people/${(i as any).authorId}`)"
                      class="text-color-tr text-base text-slate-600"
                    >
                      {{ (i as any).authorName }}
                    </div>
                    <div
                      @click="$router.push(`/detail/${i.id}`)"
                      class="book_intro"
                      style="color: #6b7280"
                      v-html="(i as any).bookDesc"
                    ></div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
          <button class="banner-next banner_swiper_but">
            <icon-left />
          </button>
          <button class="banner-pre banner_swiper_but">
            <icon-right />
          </button>
        </div>
      </div>
      <!-- 本周推荐 -->
      <div class="banner_center">
        <div class="banner_title font-serif text-2xl">
          <i class="iconfont icon-liebiao3 text-2xl mr-2"></i>
          <span>本周强推</span>
        </div>
        <div class="banner_center_image"></div>
        <a-spin
          :loading="
            homeBanner.weekRecommend && homeBanner.weekRecommend.length == 0
          "
          tip="加载中..."
          style="width: 100%"
        >
          <div class="banner_book">
            <div
              class="book_item"
              v-for="book in homeBanner.weekRecommend"
              :key="book.id"
            >
              <!--  跳转分类 -->
              <div
                @click="$router.push(`/category/${book.categoryId}`)"
                :title="book.categoryName"
                class="text-slate-400"
              >
                「{{ book.categoryName }}」
              </div>
              <div
                @click="router.push(`/detail/${book.id}`)"
                :title="book.bookName"
                class="w-36 ml-1"
              >
                {{ book.bookName }}
              </div>
            </div>
          </div>
        </a-spin>
      </div>
      <!-- 首页公告 -->
      <div class="banner_right">
        <div class="banner_announcement_title flex items-center">
          <i class="iconfont icon-laba1 text-2xl" style="color: #d32441"></i>
          <span style="color: #d11f43" class="ml-2">公告</span>
        </div>
        <div class="banner_announcement_item flex flex-col gap-5 mt-5">
          <!-- TODO 公告跳转 -->
          <div class="" v-for="item in homeBanner.announcement" :key="item.id">
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
    <!-- 点击榜单 and 热门推荐 -->
    <bookRank
      ref="hotBook"
      class="pb-10"
      rank-name="点击榜单"
      recommend-name="热门推荐"
      :rank-list="homeBanner.rank.clickBook"
      :recommend-book="homeBanner.recommend.hotBook"
    />
    <!-- 精品推荐 -->
    <bookRank
      class="premiumBook"
      ref="premiumBook"
      rank-name="新书榜单"
      recommend-name="精品推荐"
      :rank-list="homeBanner.rank.newsBook"
      :recommend-book="homeBanner.recommend.premiumBook"
    />
    <!-- 最近更新 -->
    <div ref="bookModules" class="book-modules mt-10">
      <a-tabs
        @change="changeLastUpdate"
        class="modules-tabs font-serif"
        :default-active-key="0"
      >
        <a-tab-pane :key="0" title="最近更新"> </a-tab-pane>
        <a-tab-pane :key="1" title="最近完结"> </a-tab-pane>
      </a-tabs>
      <div class="category-book">
        <div :class="{ 'tag-hover': selectCategory == 0 }">全部</div>
        <div
          :class="{ 'tag-hover': selectCategory == index + 1 }"
          @click="toggleModulesCategory(index + 1)"
          v-for="(item, index) in category"
          :key="item.id"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="completed mt-5">
        <a-table
          class="lastUpdate"
          :bordered="false"
          :columns="bookModulesColumns"
          :data="homeBanner.modelBook"
          :stripe="true"
          :hoverable="false"
          :pagination="false"
        >
          <template #columns>
            <a-table-column
              :width="120"
              :tooltip="true"
              :ellipsis="true"
              title="类别"
              data-index="categoryName"
            >
              <template #cell="{ record }">
                <span class="tableCategory">{{ record.categoryName }}</span>
              </template>
            </a-table-column>
            <a-table-column
              :width="325"
              :tooltip="true"
              :ellipsis="true"
              title="书名"
              data-index="bookName"
            >
              <template #cell="{ record }">
                <span
                  @click="$router.push(`/detail/${record.id}`)"
                  class="a-hover cursor-pointer"
                >
                  {{ record.bookName }}
                </span>
              </template>
            </a-table-column>
            <a-table-column
              :width="225"
              :tooltip="true"
              :ellipsis="true"
              title="章节名称"
              data-index="lastChapterName"
            >
              <template #cell="{ record }">
                <span
                  @click="$router.push(`/chapter/${record.id}/${record.num}`)"
                  class="a-hover cursor-pointer"
                >
                  {{ numberToCapital(record.lastChapterName) }}
                </span>
              </template>
            </a-table-column>
            <a-table-column
              :tooltip="true"
              :ellipsis="true"
              title="字数"
              data-index="wordCount"
            >
              <template #cell="{ record }">
                <span
                  >{{
                    record.wordCount >= 10000
                      ? parseInt(record.wordCount / 10000 + '') + '万'
                      : record.wordCount
                  }}字</span
                >
              </template>
            </a-table-column>
            <a-table-column
              :width="100"
              :tooltip="true"
              :ellipsis="true"
              title="作者"
              data-index="authorName"
            >
              <template #cell="{ record }">
                <span class="a-hover cursor-pointer">
                  {{ record.authorName }}字
                </span>
              </template>
            </a-table-column>
            <a-table-column
              :tooltip="true"
              :ellipsis="true"
              title="更新时间"
              data-index="lastChapterUpdateTime"
            ></a-table-column>
          </template>
          <template #empty>
            <div v-show="bookModulesStatus == 1" class="no-last-update">
              <div class="icon-book">
                <i
                  class="iconfont icon-bishuamoji3 animate__slideInDown animate__animated"
                ></i>
                <i
                  class="iconfont icon-shufabichu39 animate__slideInRight animate__animated"
                ></i>
                <i
                  class="iconfont icon-bishuamoji3 animate__animated animate__slideInDown"
                ></i>
                <div>
                  <i
                    class="iconfont icon-shufabichu41 animate__slideInRight animate__animated"
                  ></i>
                </div>
                <i class="iconfont icon-shufabichu39"></i>
                <i
                  class="iconfont icon-bishuamoji37 animate__animated animate__fadeIn"
                ></i>
                <i class="iconfont icon-tushuguan"></i>
              </div>
              <div class="bright-text">暂无书籍~</div>
            </div>
          </template>
        </a-table>
      </div>
    </div>
    <!-- TODO 人气作家 -->
    <div></div>
  </div>
</template>
<script lang="ts" setup>
import bookRank from '../components/BookRank.vue'
import { recommend, announcement, ranking, lastUpdated } from '../api/Home'
import { Ref, onMounted, ref, reactive } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import typeSwiper from 'swiper'
import { Autoplay, Navigation, EffectCoverflow } from 'swiper/modules'
import imgLoading from '../components/ImgLoading.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const modules = [Autoplay, Navigation, EffectCoverflow]
type banner = {
  carousel: any[]
  announcement: any[]
  weekRecommend: any[]
  rank: {
    clickBook: any[]
    newsBook: any[]
  }
  recommend: {
    hotBook: any[]
    premiumBook: any[]
  }
  modelBook: any[]
}
let homeBanner: Ref<banner> = ref({
  carousel: [],
  announcement: [],
  weekRecommend: [],
  rank: {
    clickBook: [],
    newsBook: [],
  },
  recommend: {
    hotBook: [],
    premiumBook: [],
  },
  modelBook: [],
})
const swiper_left: Ref<typeSwiper> = ref() as Ref<typeSwiper>
let swiperIndex = ref(0)

let bookModulesColumns = ref([
  {
    title: '类别',
    dataIndex: 'categoryName',
  },
  {
    title: '书名',
    dataIndex: 'bookName',
  },
  {
    title: '章节名称',
    dataIndex: 'lastChapterName',
  },
  {
    title: '字数',
    dataIndex: 'wordCount',
  },
  {
    title: '作者',
    dataIndex: 'authorName',
  },
])
import { stringToDate, numberToCapital } from '../utils/commonUtils'
const getLastUpdate = async (mode: Number, type?: String) => {
  await lastUpdated({ mode, type }).then((r) => {
    if (r.data.status == 200) {
      homeBanner.value.modelBook = r.data.data.map(
        (r: { lastChapterUpdateTime: string | number | Date }) => {
          r.lastChapterUpdateTime = stringToDate(
            r.lastChapterUpdateTime as string,
            'all'
          )
          return r
        }
      )
    }
  })
}

/**
 * 获取榜单和推荐
 * @param commend 推荐序号
 * @param rank 榜单序号
 * @param rankNum 榜单数据数量
 */
const getRecommendAndRank = async (
  commend: String,
  rank: String,
  rankNum: number,
  commendName: 'premiumBook' | 'hotBook',
  bankName: 'newsBook' | 'clickBook'
) => {
  let count = 0
  // 获取推荐 3/4
  const commendP = new Promise((res) => {
    recommend(commend).then((r) => {
      if (r.data.status == 200) {
        homeBanner.value.recommend[commendName] = r.data.data.map((r) => {
          const div = document.createElement('div')
          div.innerHTML = r.bookDesc
          r.bookDesc = div.innerText.trim()
          return r
        })
        res(true)
      }
    })
  })
  // 获取榜单 0/1
  const rankP = new Promise((res) => {
    ranking({ type: rank, num: rankNum }).then((r) => {
      if (r.data.status == 200) {
        homeBanner.value.rank[bankName] = r.data.data.map((r) => {
          const div = document.createElement('div')
          div.innerHTML = r.bookDesc
          r.bookDesc = div.innerText.trim()
          return r
        })
        res(true)
      }
    })
  })
  await new Promise((res) => {
    commendP.then(() => {
      count++
      if (count == 2) res(true)
    })
    rankP.then(() => {
      count++
      if (count == 2) res(true)
    })
  })
  return true
}

// 获取首页顶部信息
const getHomeData = () => {
  // 获取轮播
  recommend().then((r) => {
    if (r.data.status == 200) homeBanner.value.carousel = r.data.data
  })
  // 获取本周强推
  recommend('2').then((r) => {
    if (r.data.status == 200) homeBanner.value.weekRecommend = r.data.data
  })
  // 获取系统公告
  announcement().then((r) => {
    if (r.data.status == 200) homeBanner.value.announcement = r.data.data
  })
}
// 等swiper加载之后，装载到swiper_left丄1�7
const onSwiper = (swiper: typeSwiper) => {
  swiper_left.value = swiper
}
// 大轮播图切换后，切换小轮播图状��1�7
const sliderMove = (swiper: typeSwiper) => {
  swiperIndex.value = swiper.realIndex
}

const hotBook = ref<InstanceType<typeof bookRank>>()
const premiumBook = ref<InstanceType<typeof bookRank>>()
const bookModules = ref<InstanceType<typeof Element>>()
let bookModulesStatus: Ref<string | Number> = ref(0)
let modulesStatus: String | Number = -1
let scrollRequestStatus = {
  recommend: false,
  premiumBook: false,
}
import { getCategoryName } from '../api/Category'
let category = reactive([] as any[])

const scrollToShow = () => {
  // 热门推荐懒加载
  const ob = new IntersectionObserver(
    () => {
      scrollRequestStatus.recommend = true
      getRecommendAndRank('3', '0', 10, 'hotBook', 'clickBook').then(() => {})
    },
    {
      threshold: 0,
    }
  )
  // 精品推荐懒加载
  ob.observe(hotBook.value?.$el)
  const ob_2 = new IntersectionObserver(
    () => {
      scrollRequestStatus.premiumBook = true
      getRecommendAndRank('4', '1', 10, 'premiumBook', 'newsBook').then(
        () => {}
      )
    },
    {
      threshold: 0,
    }
  )
  ob_2.observe(premiumBook.value?.$el)
  // 最近更新/完结懒加载
  const ob_3 = new IntersectionObserver(
    () => {
      modulesStatus = bookModulesStatus.value
      getLastUpdate(bookModulesStatus.value as number)
    },
    {
      threshold: 0,
    }
  )
  if (bookModules.value) ob_3.observe(bookModules.value)
}
onMounted(() => {
  getHomeData()
  // 获取所有分类
  getCategoryName().then((r) => {
    category = r.data.data
  })
  scrollToShow()
})

// 切换最近更新/完结
const changeLastUpdate = (index: string | number): void => {
  bookModulesStatus.value = index
  getLastUpdate(index as number)
}

const selectCategory: Ref<number> = ref(0)
const toggleModulesCategory = (index: number) => {
  selectCategory.value = index
  getLastUpdate(bookModulesStatus.value as number, index + '')
}
</script>
<style lang="scss" scoped>
#home {
  box-sizing: border-box;
  margin: 30px auto;
  width: 80%;
  box-sizing: border-box;
  padding: 20px;
  border-radius: 6px;
  --color-fill-1: #f6f8fa;

  .banner {
    display: flex;
    background: white;
    gap: 20px;
    padding: 20px 20px;
    border-radius: 16px;
    box-sizing: border-box;
    .banner_left {
      display: flex;
      $swiper_box_height: 320px;
      .swiper-box-left {
        // $swiper_left__img_width: 240px;
        // width: $swiper_left__img_width;
        position: relative;
        width: 240px;
        overflow: hidden;
        &:hover .banner_swiper_but {
          opacity: 1;
        }
        .banner_swiper_but {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          line-height: 50px;
          text-align: center;
          z-index: 9999;
          background: rgba(34, 34, 34, 0.8);
          border-radius: 4px;
          color: white;
          opacity: 0;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .banner-next {
          left: 0;
        }
        .banner-pre {
          right: 0;
        }
        .banner_swiper_left {
          .swiper_item {
            cursor: pointer;
            padding-top: 40px;
            .swiper_conetent {
              background: linear-gradient(180deg, #000000, #fff 58%);
              border: 1px solid white;
              border-radius: 12px;
              .swiper_image {
                position: relative;
                border-radius: 16px;
                overflow: hidden;
                width: 180px;
                height: 240px;
                margin: -40px auto 0;
                filter: drop-shadow(6px 7px 10px #1f1a1a5c);

                div {
                  height: 100%;
                  width: 180px;
                  cursor: pointer;
                  :deep .arco-image-img {
                    width: 100%;
                    height: 100%;
                  }
                }
              }

              .book_session {
                margin-top: 20px;
                gap: 15px;
                text-align: center;
                box-sizing: border-box;
                padding: 20px 15px;
                .book_intro {
                  text-align: left;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 5;
                  -webkit-box-orient: vertical;
                  white-space: normal;
                  line-height: 16px;
                }
              }
            }
          }
        }
      }
      .swiper-box-right {
        $swiper_right__img_width: 6 0px;
        // width: $swiper_right__img_width;
        height: $swiper_box_height;
        margin-left: 15px;
        overflow: hidden;

        .swiper_item {
          border: 2px solid transparent;
          padding: 5px;
          transition: all 0.3s ease;
          box-sizing: border-box;
          transform: rotateZ(0);
          height: calc($swiper_box_height / 4) - 10;
          cursor: pointer;
          .book_session > div {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 12px;
            line-height: 20px;
          }
        }
        .banner_swiper_right {
          height: $swiper_box_height;
          img {
            height: 100%;
            cursor: pointer;
          }
          :deep .swiper-wrapper {
            // gap: 10px;
            .swiper_action .swiper_item {
              border: 2px solid rgb(var(--qing-color));
            }
          }
        }
      }
    }
    .banner_center {
      width: 620px;
      .banner_title {
        // text-align: center;
        // font-size: 18px;
        font-weight: 700;
      }

      .banner_center_image {
        width: 100%;
        height: 100px;
        background: url('../../public/b3b2e712c31070d2e3a7d43ac83fc4ce.jpeg')
          no-repeat center center;
        background-size: 200% auto;
        margin: 20px 0;
      }
      .banner_book {
        min-height: 300px;
        margin-top: 15px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px 10px;
        .book_item {
          display: flex;
          font-size: 14px;
          > div {
            transition: all 0.3s ease;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:hover {
              color: rgb(var(--qing-color));
            }
          }
        }
      }
    }
    .banner_right {
      overflow: hidden;
      // min-width: 200px;
      .banner_announcement_title {
        font-size: 18px;
        font-weight: 700;
        border-bottom: 1px solid rgb(227 227 227 / 77%);
        padding: 5px 0;
      }
      .banner_announcement_item div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: all 0.3s ease;
        cursor: pointer;
        &:hover {
          color: rgb(var(--qing-color));
        }
      }
    }
  }
  .book-modules {
    .completed {
      height: calc(40.8 * 15px + 40px);
    }
    .modules-tabs {
      // width: 0%;
      .lastUpdate {
        min-height: 500px;
        font-family: Inter, '-apple-system', BlinkMacSystemFont, 'PingFang SC',
          'Hiragino Sans GB', 'noto sans', 'Microsoft YaHei', 'Helvetica Neue',
          Helvetica, Arial, sans-seri;
        font-size: 14px !important;
      }
      :deep .arco-table-cell {
        min-height: 500px;
      }
      :deep .arco-table-cell {
        padding: 15px 1rem;
      }
      :deep .arco-scrollbar {
        .arco-table-tr .arco-table-td:nth-last-child(2),
        .arco-table-tr .arco-table-td:nth-last-child(3),
        .arco-table-tr .arco-table-td:nth-last-child(1) {
          color: #999;
        }
      }
      .tableCategory {
        border: 1px solid #dcdddf;
        text-align: center;
        padding: 3px 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        &:hover {
          border-color: rgb(var(--qing-color));
        }
      }
    }
    @at-root .no-last-update {
      height: calc(40.8 * 15px);
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      > i {
        font-size: 80px;
        line-height: 80px;
        color: rgb(var(--qing-color));
      }
      font-size: 18px;
      .icon-book {
        position: relative;
        color: #2196f3;
        $i-width: 80px;
        height: 160px;
        width: $i-width;
        i {
          font-size: $i-width;
          line-height: $i-width;
          position: absolute;
          z-index: 2;
        }
        > i:nth-child(1) {
          top: calc($i-width/4);
          left: 0;
        }
        > i:nth-child(2) {
          right: calc($i-width/-2 + 10px);
          top: calc($i-width/2 + 10px);
          height: calc($i-width/2);
          overflow: hidden;
        }
        > i:nth-child(3) {
          top: calc($i-width/2 + 10px);
          right: 0;
        }
        > div {
          position: absolute;
          right: calc($i-width/-2 + 17px);
          top: $i-width + 10px;
          height: calc($i-width/2 + 10px);
          overflow: hidden;
          width: $i-width;
          i {
            margin-top: calc($i-width/-2 + 10px) !important;
          }
        }
        > i:nth-child(5) {
          transform: scaley(1.8);
          top: calc($i-width/2 + 10px);
          animation: lastIcon 1.2s cubic-bezier(0.215, 0.61, 0.355, 1);
          @keyframes lastIcon {
            0% {
              transform: translateY(-300px) scaleY(3);
            }
            60% {
              transform: translateY(10px) scaleY(1.8);
            }
            75% {
              transform: translateY(-5px) scaleY(1.8);
            }
            90% {
              transform: translateY(5px) scaleY(1.8);
            }
            100% {
              transform: translateY(0) scaleY(1.8);
            }
          }
        }
        > i:nth-child(6) {
          font-size: 40px;
          right: 0;
          animation-delay: 0.3s;
        }
        > i:last-child {
          font-size: 160px;
          top: 50%;
          left: 50%;
          color: #dcdddf;
          z-index: 1;
          transform: translate(-50%, -50%);
        }
      }
    }
    :deep .arco-tabs-nav-tab {
      justify-content: center;
      .arco-tabs-tab {
        margin: 0 50px;
        padding: 15px 10px;
        font-size: 18px;
        font-weight: 700;
      }
    }
    :deep .arco-table-td-content {
      font-size: 14px;
    }
    :deep .arco-tabs-nav::before {
      content: none !important;
    }
    .category-book {
      display: flex;
      gap: 20px;
      > div {
        background-color: #ebf0f4;
        padding: 8px 20px;
        border-radius: 6px;
        cursor: pointer;
        &:hover {
          @extend .tag-hover;
        }
      }
      .tag-hover {
        outline: 1px solid rgb(var(--qing-color));
        background: white;
      }
    }
  }
}
</style>
