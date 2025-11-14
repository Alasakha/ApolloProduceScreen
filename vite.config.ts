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
    proxy: {
      // 代理 /api/report 请求到目标服务器
      '/api/report': {
        target: 'http://192.168.1.197:10999',
        changeOrigin: true,
        secure: false, // 如果是 https，可能需要设置为 false
        rewrite: (path) => path.replace(/^\/api\/report/, '/apollo/report'), // 将 /api/report 重写为 /apollo/report
        cookieDomainRewrite: '', // 保持 cookie 域名
        cookiePathRewrite: '/', // 保持 cookie 路径
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // 转发所有重要的请求头
            const headersToForward = [
              'cookie',
              'authorization',
              'content-type',
              'accept',
              'user-agent'
            ]
            
            headersToForward.forEach(headerName => {
              const headerValue = req.headers[headerName] || req.headers[headerName.toLowerCase()]
              if (headerValue) {
                proxyReq.setHeader(headerName, headerValue)
              }
            })
            
            // 特别处理 Authorization 头（可能在不同的大小写形式）
            const authHeader = req.headers.authorization || 
                             req.headers.Authorization || 
                             req.headers['authorization']
            if (authHeader) {
              proxyReq.setHeader('Authorization', authHeader)
            }
            
            // 特别处理 Cookie 头
            const cookieHeader = req.headers.cookie || 
                               req.headers.Cookie || 
                               req.headers['cookie']
            if (cookieHeader) {
              proxyReq.setHeader('Cookie', cookieHeader)
            }
            
            // 调试日志
            console.log('=== Proxy Request Debug ===')
            console.log('Original URL:', req.url)
            console.log('Proxy URL:', proxyReq.path)
            console.log('Method:', req.method)
            console.log('Headers:', {
              authorization: authHeader ? '***present***' : 'missing',
              cookie: cookieHeader ? '***present***' : 'missing',
              contentType: req.headers['content-type'] || req.headers['Content-Type']
            })
            console.log('==========================')
          })
          
          proxy.on('proxyRes', (proxyRes, _req, _res) => {
            console.log('=== Proxy Response Debug ===')
            console.log('Status:', proxyRes.statusCode)
            console.log('Response Headers:', proxyRes.headers)
            console.log('============================')
          })
          
          proxy.on('error', (err, _req, _res) => {
            console.error('Proxy error:', err)
          })
        }
      }
    }
  }
  }
})
