<template>
    <body>
  <dv-full-screen-container>
    <!-- 重试状态提示 -->
    <div v-if="energyStore.isRetrying" class="retry-indicator">
      <div class="retry-content">
        <div class="spinner"></div>
        <span>接口重试中... (第{{ energyStore.retryCount }}次尝试)</span>
      </div>
    </div>
    
    <dv-border-box11 title="浙江阿波罗科技运动有限公司" :title-width="400" >
        <Header></Header>
        <Line1></Line1>
        <Line3 :data="energyStore.monthlyData"></Line3>
        <!-- <line4></line4> -->
        <Line2></Line2>
        <Line5></Line5>
    </dv-border-box11>
  </dv-full-screen-container>
  </body>
  </template>
  
  
<script setup >
import { onMounted, onUnmounted } from 'vue'
import BorderBox from '@/components/datav/BorderBox.vue'
import { useEnergyStore } from '@/store/energy'

import Header from './header/index.vue'
import Line1 from './Line1/index.vue'
import Line2 from './Line2/index.vue'
import Line3 from './Line3/index.vue'
import line4 from './Line4/index.vue'
import Line5 from './Line5/index.vue'

const energyStore = useEnergyStore()
let refreshInterval = null

// 初始化和定时刷新数据
const initializeAndStartRefresh = async () => {
  console.log('🚀 主组件：开始初始化能源数据...')
  
  // 初始化数据
  await energyStore.initializeData()
  
  // 设置定时刷新（每3分钟）
  refreshInterval = window.setInterval(async () => {
    console.log('🔄 主组件：定时刷新数据...')
    await energyStore.initializeData()
  }, 180000*10)
  
  console.log('✅ 主组件：数据初始化和定时刷新设置完成')
}

onMounted(() => {
  initializeAndStartRefresh()
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
    console.log('🛑 主组件：清理定时刷新')
  }
})
</script>
  

  <style scoped>
  body{
  width: 100vw;
  height: 100vh;
  background: 
  linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), 
   url('@/assets/background.jpg') no-repeat center center;
  background-size: cover;
  transform-origin: center center;
  position: relative;
  transition: transform 0.3s ease-in-out;
  }

  /* 重试状态指示器 */
  .retry-indicator {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    background: rgba(255, 165, 0, 0.95);
    border: 2px solid #ff8c00;
    border-radius: 8px;
    padding: 12px 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
  }

  .retry-content {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
    font-weight: 600;
    font-size: 14px;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>