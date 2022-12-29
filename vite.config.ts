import { defineConfig, SplitVendorChunkCache } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: any) {
          // if (id.includes('node_modules')) {
          //   const arr = id.toString().split('node_modules/')[1].split('/')
          //   switch (arr[0]) {
          //     case '@vue':
          //       return arr[0]

          //     default:
          //       return 'vendor'
          //   }
          // }
        }
      }
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => {
            /* @ts-ignore */
            return tag.startsWith('icon-')
          }
        }
      }
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    splitVendorChunkPlugin()
  ],
})
