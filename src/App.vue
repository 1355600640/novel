<template>
  <div id="app" class="bright">
    <PageHeader v-if="route.meta.pageHeader" />
    <NavigationBar v-if="route.meta.navigationBar" />
    <router-view :key="$route.fullPath" v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <page-footer v-show="!$route.meta.displayBottom" />
    <backTop />
  </div>
</template>
<script lang="ts" setup>
import PageHeader from './components/PageHeader.vue'
import NavigationBar from './components/NavigationBar.vue'
import PageFooter from './components/PageFooter.vue'
import backTop from './components/BackTop.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
<style lang="scss">
@import url('./assets/style/common.scss');
@import url('./assets/style/BrightSubject.scss');
#app {
  width: 100%;
  min-width: 1000px;
  min-height: 100vh;
  position: relative;
}
</style>
