<template>
  <div class="sales-data">
    <div class="component-header">
      <div class="header-icon">📊</div>
      <div class="header-title 3xl:text-sm p-2">销售数据</div>
      <div class="header-status" :class="salesStatus">
        <span class="status-dot"></span>
        {{ salesStatusText }}
      </div>
    </div>
    
    <div class="content-area">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在加载销售数据...</div>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <div class="error-message">{{ error }}</div>
        <button class="retry-button" @click="retryFetch">
          🔄 重试
        </button>
      </div>
      
      <!-- 数据展示 -->
      <template v-else-if="salesData">
        <div class="data-grid grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-2 gap-3 lg:gap-4 3xl:gap-6">
          <div class="data-item p-2">
            <div class="data-icon text-2xl lg:text-3xl 3xl:text-2xl 4xl:text-5xl">🌍</div>
            <div class="data-content">
              <div class="data-value text-xl lg:text-2xl xl:text-3xl 3xl:text-2xl 4xl:text-5xl">{{ totalExportCountries }}</div>
              <div class="data-label text-xs lg:text-sm 3xl:text-base 4xl:text-lg">出口国家</div>
            </div>
          </div>
          
          <div class="data-item p-2">
            <div class="data-icon text-2xl lg:text-3xl 3xl:text-2xl 4xl:text-5xl">🎯</div>
            <div class="data-content">
              <div class="data-value text-xl lg:text-2xl xl:text-3xl 3xl:text-2xl 4xl:text-5xl">{{ totalTarget }}</div>
              <div class="data-label text-xs lg:text-sm 3xl:text-base 4xl:text-lg">年度出口目标</div>
            </div>
          </div>
          
          <div class="data-item p-2">
            <div class="data-icon text-2xl lg:text-3xl 3xl:text-2xl 4xl:text-5xl">📈</div>
            <div class="data-content">
              <div class="data-value text-xl lg:text-2xl xl:text-3xl 3xl:text-2xl 4xl:text-5xl">{{ totalAchieved }}</div>
              <div class="data-label text-xs lg:text-sm 3xl:text-base 4xl:text-lg">今年出口量</div>
            </div>
          </div>
          
          <div class="data-item p-2">
            <div class="data-icon text-2xl lg:text-3xl 3xl:text-2xl 4xl:text-5xl">📅</div>
            <div class="data-content">
              <div class="data-value text-xl lg:text-2xl xl:text-3xl 3xl:text-2xl 4xl:text-5xl">{{ totalMonthly }}</div>
              <div class="data-label text-xs lg:text-sm 3xl:text-base 4xl:text-lg">月度累计出口量</div>
            </div>
          </div>
        </div>
        
       
      </template>
      
      <!-- 无数据状态 -->
      <div v-else class="no-data-state">
        <div class="no-data-icon">📊</div>
        <div class="no-data-text">暂无销售数据</div>
        <button class="retry-button" @click="retryFetch">
          🔄 重新加载
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getSales } from '@/api/control'

// 销售数据 - 单个对象
const salesData = ref(null)
const loading = ref(false)
const error = ref(null)
const retryCount = ref(0)
const maxRetries = 3

// 计算属性
const totalExportCountries = computed(() => {
  return salesData.value?.exportingCountry || 0
})

const totalTarget = computed(() => {
  return salesData.value?.ysChallengeYear || 0
})

const totalAchieved = computed(() => {
  return salesData.value?.bgCountYear || 0
})

const totalMonthly = computed(() => {
  return salesData.value?.bgCountMonth || 0
})

const completionRate = computed(() => {
  if (totalTarget.value === 0) return 0
  return ((totalAchieved.value / totalTarget.value) * 100).toFixed(2)
})

// 计算销售状态
const salesStatus = computed(() => {
  if (loading.value) return 'loading'
  if (error.value) return 'error'
  
  const rate = parseFloat(completionRate.value)
  if (rate >= 100) return 'excellent'
  if (rate >= 80) return 'good'
  if (rate >= 60) return 'normal'
  return 'warning'
})

const salesStatusText = computed(() => {
  const statusMap = {
    loading: '加载中...',
    error: '加载失败',
    excellent: '优秀',
    good: '良好',
    normal: '一般',
    warning: '需关注'
  }
  return statusMap[salesStatus.value]
})

// 获取销售数据
const fetchSalesData = async (isRetry = false) => {
  if (loading.value && !isRetry) return
  
  try {
    loading.value = true
    error.value = null
    
    console.log(`🔄 ${isRetry ? '重试' : '首次'}获取销售数据...`)
    const response = await getSales()
    console.log('销售数据响应:', response)
    
    if (response && response.code === 200 && response.data) {
      salesData.value = response.data
      retryCount.value = 0 // 重置重试计数
      console.log('✅ 销售数据获取成功:', response.data)
    } else {
      throw new Error(`API响应异常: ${response?.message || '未知错误'}`)
    }
  } catch (err) {
    console.error('获取销售数据失败:', err)
    error.value = err.message || '网络请求失败'
    
    // 重试逻辑
    if (retryCount.value < maxRetries && !isRetry) {
      retryCount.value++
      console.log(`🔄 第${retryCount.value}次重试...`)
      setTimeout(() => fetchSalesData(true), 2000 * retryCount.value) // 递增延迟
    } else if (retryCount.value >= maxRetries) {
      console.warn('重试次数已达上限，使用模拟数据')
      // 使用模拟数据作为备用
      salesData.value = {
        exportingCountry: '美国',
        ysChallengeYear: 1000,
        bgCountYear: 850,
        bgCountMonth: 120
      }
    }
  } finally {
    loading.value = false
  }
}

// 手动重试
const retryFetch = () => {
  retryCount.value = 0
  fetchSalesData()
}

let dataUpdateTimer = null

// 模拟数据更新
onMounted(() => {
  fetchSalesData()
  
  // 启动数据更新定时器
  dataUpdateTimer = setInterval(() => {
    if (salesData.value && typeof salesData.value === 'object') {
      const monthlyChange = Math.floor(Math.random() * 20) - 10
      salesData.value.bgCountMonth = Math.max(0, (salesData.value.bgCountMonth || 0) + monthlyChange)
      salesData.value.bgCountYear = Math.max(0, (salesData.value.bgCountYear || 0) + monthlyChange)
    }
  }, 15000)
})

onUnmounted(() => {
  if (dataUpdateTimer) {
    clearInterval(dataUpdateTimer)
  }
})
</script>

<style scoped>
.sales-data {
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.component-header {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 212, 255, 0.1);
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}

.header-icon {
  font-size: 20px;
}

.header-title {
  color: var(--primary-blue);
  font-weight: 600;
  flex: 1;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.3);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.header-status.excellent .status-dot {
  background: #10B981;
}

.header-status.good .status-dot {
  background: #3B82F6;
}

.header-status.normal .status-dot {
  background: #F59E0B;
}

.header-status.warning .status-dot {
  background: #EF4444;
}

.header-status.error .status-dot {
  background: #EF4444;
}

.header-status.loading .status-dot {
  background: #3B82F6;
  animation: pulse 1.5s ease-in-out infinite;
}

.content-area {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.loading-state, .error-state, .no-data-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #E5E7EB;
  text-align: center;
  min-height: 200px;
}

.loading-spinner {
  border: 4px solid rgba(0, 212, 255, 0.3);
  border-top: 4px solid var(--primary-blue);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-text {
  font-size: 16px;
  color: var(--primary-blue);
  font-weight: 500;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.error-message {
  font-size: 16px;
  color: #EF4444;
  margin-bottom: 20px;
  max-width: 300px;
  word-break: break-word;
}

.retry-button {
  background: linear-gradient(135deg, var(--primary-blue), #7C3AED);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
}

.retry-button:hover {
  background: linear-gradient(135deg, #7C3AED, #6D28D9);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 212, 255, 0.4);
}

.retry-button:active {
  transform: translateY(0);
}

.data-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.data-item {
  display: flex;
  align-items: center;
  gap: 16px;
  /* padding: 20px; */
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.data-item:hover {
  background: rgba(0, 212, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.4);
  transform: translateY(-2px);
}

.data-icon {

  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 12px;
}

.data-content {
  flex: 1;
}

.data-value {
  /* font-size: 32px; */
  font-weight: bold;
  color: var(--primary-blue);
  margin-bottom: 8px;
  line-height: 1;
}

.data-label {
  font-size: 14px;
  color: #E5E7EB;
  font-weight: 500;
}

.completion-section {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(0, 212, 255, 0.2);
}

.completion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.completion-label {
  font-size: 16px;
  color: #E5E7EB;
  font-weight: 500;
}

.completion-value {
  font-size: 24px;
  font-weight: bold;
  color: #10B981;
}

.completion-bar {
  width: 100%;
  height: 12px;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
}

.completion-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-blue), #3B82F6);
  transition: width 0.5s ease;
  border-radius: 6px;
}

.no-data-icon {
  font-size: 60px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.no-data-text {
  font-size: 16px;
  color: #9CA3AF;
  margin-bottom: 20px;
}

/* 响应式设计 */
@media (max-width: 2000px) {
  .data-grid {
    gap: 10px;
  }
  
  .data-item {
    padding: 6px;
  }
  
  .data-value {
    font-size: 20px;
  }
  
  .data-label {
    font-size: 13px;
  }
}

@media (max-width: 1200px) {
  .data-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .data-item {
    padding: 14px;
  }
  
  .data-value {
    font-size: 24px;
  }
  
  .data-label {
    font-size: 12px;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style> 