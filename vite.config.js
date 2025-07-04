import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import postCssNested from 'postcss-nested'
import autoprefixer from 'autoprefixer'
import generateMeta from './.vite/plugins/generateMeta'
import autoCollectProxy from './.vite/plugins/autoCollectProxy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    AutoImport({
      imports: [
        'vue',
        {
          lodash: [
            // 使用 '*' 导入全部（慎用，可能增加打包体积）
            ['*', '_'], // 将所有函数挂载到 `_` 对象上
          ],
        },
      ],
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        // 自动注册图标组件
        IconsResolver({
          prefix: false,
          enabledCollections: ['ep'],
        }),
      ],
    }),
    Icons(),
    generateMeta(),
    autoCollectProxy(),
  ],
  server: {
    proxy: {},
  },
  css: {
    postcss: {
      map: true,
      plugins: [postCssNested, autoprefixer],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
