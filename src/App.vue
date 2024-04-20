<template>
  <div ref="app" id="app" class="bright">
    <PageHeader v-if="route.meta.pageHeader" />
    <NavigationBar v-if="route.meta.navigationBar" />
    <div class="app-center">
      <router-view
        v-if="!$route.meta.keepAlive"
        :key="$route.fullPath"
        v-slot="{ Component }"
      >
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
      <router-view v-else="$route.meta.keepAlive"></router-view>
      <page-footer v-show="!$route.meta.displayBottom" />
    </div>
    <PageButton />
  </div>
</template>
<script lang="ts" setup>
import PageHeader from './components/home/PageHeader.vue'
import NavigationBar from './components/home/NavigationBar.vue'
import PageFooter from './components/home/PageFooter.vue'
import PageButton from './components/home/PageButton.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
const route = useRoute()
const app = ref()
</script>
<style lang="scss">
@import './assets/style/common.scss';
@import './assets/style/BrightSubject.scss';
#app {
  width: 100%;
  min-height: 100%;
  min-width: 1200px;
  position: relative;
  overflow: hidden;
  // display: flex;
  // flex-direction: column;
  overflow-y: auto;
  .app-center {
    flex: 1;
    // display: flex;
    // flex-direction: column;

    > div {
      &:first-child {
        flex: 1;
      }
    }
  }
}
</style>
