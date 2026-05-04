import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(() => {
  return {
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
      server: {
      host: '0.0.0.0',
      port: 5174,
      strictPort: false,
      proxy: {
        // 单独代理生产计划接口到 10998（开发时绕过 CORS）
        '/api/sales-order': {
          target: 'http://192.168.1.167:8085',
          changeOrigin: true,
          rewrite: (path) => path,
        },
        // 其他 /api 走原来的 8085
        


        '/api/report': {
          target: 'http://192.168.1.197:10999',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/report/, '/apollo/report'),
          // ... 其他配置保持不变
        }
      }
    }
  }
})
