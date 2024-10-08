import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vitePluginForArco } from '@arco-plugins/vite-vue'

// https://vitejs.dev/config/
// p
export default defineConfig({
  plugins: [
    vue(),
    vitePluginForArco({
      style: 'css',
    }),
  ],
  server: {
    proxy: {
      '/api': {
        // target: 'http://www.qingfengn.cn:8802',
        target: 'http://localhost:8802',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  // css: {
  //   postcss: {
  //     plugins: [
  //       autoprefixer({
  //         overrideBrowserslist: [
  //           'Android 4.1',
  //           'iOS 7.1',
  //           'Chrome > 31',
  //           'ff > 31',
  //           'ie >= 8',
  //         ],
  //       }),
  //       postCssPxToRem({
  //         // 自适应，px>rem转换
  //         rootValue: 75, // 75表示750设计稿，37.5表示375设计稿
  //         propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
  //         selectorBlackList: ['norem'], // 过滤掉norem-开头的class，不进行rem转换
  //       }),
  //     ],
  //   },
  // },
})
