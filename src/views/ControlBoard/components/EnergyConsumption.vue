<template>
  <div class="energy-consumption">
    <div class="component-header">
      <div class="header-icon">⚡</div>
      <div class="header-title">单位产值综合能耗</div>
      <div class="header-status" :class="energyStatus">
        <span class="status-dot"></span>
        {{ energyStatusText }}
      </div>
    </div>
    
    <div class="content-area">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在加载能耗数据...</div>
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
      <template v-else-if="energyData">
        <div class="energy-metrics">
          <div class="metric-card">
            <div class="metric-icon">🔌</div>
            <div class="metric-value">{{ energyData.electricity }}</div>
            <div class="metric-unit">kWh/台</div>
            <div class="metric-label">耗电量</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">💧</div>
            <div class="metric-value">{{ energyData.water }}</div>
            <div class="metric-unit">m³/台</div>
            <div class="metric-label">耗水量</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">🔥</div>
            <div class="metric-value">{{ energyData.gas }}</div>
            <div class="metric-unit">m³/台</div>
            <div class="metric-label">耗气量</div>
          </div>
        </div>
        

      </template>
      
      <!-- 无数据状态 -->
      <div v-else class="no-data-state">
        <div class="no-data-icon">⚡</div>
        <div class="no-data-text">暂无能耗数据</div>
        <button class="retry-button" @click="retryFetch">
          🔄 重新加载
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getEnergy } from '@/api/control'
import { eventBus } from '@/utils/eventbus'
// 能耗数据
const energyData = ref(null)
const loading = ref(false)
const error = ref(null)
const retryCount = ref(0)
const maxRetries = 3
const lastUpdateTime = ref('')

// 计算综合能耗指数
const totalEnergyIndex = computed(() => {
  if (!energyData.value) return 0
  
  const { electricity, water, gas } = energyData.value
  // 简单的加权计算，可以根据实际需求调整权重
  return ((electricity * 0.5) + (water * 0.3) + (gas * 0.2)).toFixed(1)
})

// 计算能耗状态
const energyStatus = computed(() => {
  if (loading.value) return 'loading'
  if (error.value) return 'error'
  
  const index = parseFloat(totalEnergyIndex.value)
  if (index <= 100) return 'excellent'
  if (index <= 150) return 'good'
  if (index <= 200) return 'warning'
  return 'critical'
})

const energyStatusText = computed(() => {
  const statusMap = {
    loading: '加载中...',
    error: '加载失败',
    excellent: '优秀',
    good: '良好',
    warning: '注意',
    critical: '严重'
  }
  return statusMap[energyStatus.value]
})

// 获取能耗数据
const fetchEnergyData = async (isRetry = false) => {
  if (loading.value && !isRetry) return
  
  try {
    loading.value = true
    error.value = null
    
    console.log(`🔄 ${isRetry ? '重试' : '首次'}获取能耗数据...`)
    const response = await getEnergy()
    console.log('能耗数据响应:', response)
    
    if (response && response.code === 200 && response.data) {
      energyData.value = response.data
      retryCount.value = 0 // 重置重试计数
      lastUpdateTime.value = new Date().toLocaleTimeString()
      console.log('✅ 能耗数据获取成功:', response.data)
    } else {
      throw new Error(`API响应异常: ${response?.message || '未知错误'}`)
    }
  } catch (err) {
    console.error('获取能耗数据失败:', err)
    
    // 检查是否是网络错误或服务器错误
    const isNetworkError = err.code === 'NETWORK_ERROR' || err.code === 'ECONNABORTED'
    const isServerError = err.response?.status === 500 || err.response?.status === 502 || err.response?.status === 503
    
    if (isNetworkError || isServerError) {
      error.value = '服务器连接异常，使用模拟数据'
      console.warn('服务器连接异常，使用模拟数据')
      // 立即使用模拟数据
      energyData.value = {
        electricity: 125.6,
        water: 8.7,
        gas: 15.2
      }
      lastUpdateTime.value = new Date().toLocaleTimeString()
    } else {
      error.value = err.message || '网络请求失败'
      
      // 重试逻辑
      if (retryCount.value < maxRetries && !isRetry) {
        retryCount.value++
        console.log(`🔄 第${retryCount.value}次重试...`)
        setTimeout(() => fetchEnergyData(true), 2000 * retryCount.value) // 递增延迟
      } else if (retryCount.value >= maxRetries) {
        console.warn('重试次数已达上限，使用模拟数据')
        // 使用模拟数据作为备用
        energyData.value = {
          electricity: 125.6,
          water: 8.7,
          gas: 15.2
        }
        lastUpdateTime.value = new Date().toLocaleTimeString()
      }
    }
  } finally {
    loading.value = false
  }
}

// 手动重试
const retryFetch = () => {
  retryCount.value = 0
  fetchEnergyData()
}

let dataUpdateTimer = null

// 模拟数据更新
onMounted(() => {
  fetchEnergyData()
  eventBus.on('energy-data-updated', fetchEnergyData)
})

onUnmounted(() => {
  eventBus.off('energy-data-updated', fetchEnergyData)
})
</script>

<style scoped>
.energy-consumption {
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
  padding: 16px;
  background: rgba(0, 212, 255, 0.1);
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}

.header-icon {
  font-size: 20px;
}

.header-title {
  color: var(--primary-blue);
  font-size: 16px;
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
  background: var(--success);
}

.header-status.good .status-dot {
  background: var(--primary-blue);
}

.header-status.warning .status-dot {
  background: var(--warning);
}

.header-status.critical .status-dot {
  background: var(--error);
}

.header-status.loading .status-dot {
  background: var(--deep-blue-light);
  animation: pulse 1.5s ease-in-out infinite;
}

.header-status.error .status-dot {
  background: var(--error);
}

.content-area {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.loading-state, .error-state, .no-data-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--text-secondary);
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
  color: var(--error);
  margin-bottom: 20px;
  max-width: 300px;
  word-break: break-word;
}

.retry-button {
  background: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
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
  background: linear-gradient(135deg, var(--secondary-blue), var(--secondary-blue-dark));
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 212, 255, 0.4);
}

.retry-button:active {
  transform: translateY(0);
}

.energy-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.metric-card {
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.metric-card:hover {
  background: rgba(0, 212, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.4);
  transform: translateY(-2px);
}

.metric-icon {
  font-size: 28px;
  margin-bottom: 12px;
}

.metric-value {
  font-size: 28px;
  font-weight: bold;
  color: var(--primary-blue);
  margin: 12px 0;
}

.metric-unit {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.metric-label {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.summary-info {
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-label {
  font-size: 14px;
  color: var(--text-muted);
}

.summary-value {
  font-size: 14px;
  color: var(--primary-blue);
  font-weight: 600;
}

.no-data-icon {
  font-size: 60px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.no-data-text {
  font-size: 16px;
  color: var(--text-muted);
  margin-bottom: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .energy-metrics {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .metric-card {
    padding: 16px;
  }
  
  .metric-value {
    font-size: 24px;
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