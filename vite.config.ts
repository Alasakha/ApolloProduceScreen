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
    host: '127.0.0.1', // 强制使用 IPv4，避免 IPv6 权限问题
    port: 5174, // 使用 5174 端口，避免与已占用的 5173 冲突
    strictPort: false, // 如果端口被占用，自动尝试下一个可用端口
  }
  }
})
