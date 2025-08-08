import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue({
    script: {
      defineModel: true
    }
  }),
  tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')  // 为./src配置别名
    }
  },
  // server: {
  //   proxy: {
  //     '/apollo': {
  //       target: 'http://192.168.1.197:10999',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/apollo/, '')
  //     }
  //   }
  // }
})
