<template>
  <div class="rd-module">
    <div class="component-header">
      <div class="header-icon">🔬</div>
      <div class="header-title">研发模块</div>
      <div class="header-status" :class="rdStatus">
        <span class="status-dot"></span>
        {{ rdStatusText }}
      </div>
    </div>
    
    <div class="content-area">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在加载研发数据...</div>
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
      <template v-else-if="rdData">
        <div class="main-stats">
          <div class="stat-card rnd-projects">
            <div class="stat-icon">📋</div>
            <div class="stat-value">{{ rdData.yf }}</div>
            <div class="stat-label">在研项目数</div>
          </div>
          
          <div class="stat-card patents ">
            <div class="stat-icon">📜</div>
            <div class="stat-value">{{ totalPatents }}</div>
            <div class="stat-label">专利总数</div>

          </div>
        </div>


        <div class="patent-breakdown">
              <div class="patent-item">
                <span class="patent-type">境外专利</span>
                <span class="patent-count">{{ rdData.jw }}</span>
              </div>
              <div class="patent-item">
                <span class="patent-type">发明专利</span>
                <span class="patent-count">{{ rdData.fm }}</span>
              </div>
              <div class="patent-item">
                <span class="patent-type">外观专利</span>
                <span class="patent-count">{{ rdData.wg }}</span>
              </div>
              <div class="patent-item">
                <span class="patent-type">实用新型</span>
                <span class="patent-count">{{ rdData.sy }}</span>
              </div>
            </div>

      </template>
      
      <!-- 无数据状态 -->
      <div v-else class="no-data-state">
        <div class="no-data-icon">🔬</div>
        <div class="no-data-text">暂无研发数据</div>
        <button class="retry-button" @click="retryFetch">
          🔄 重新加载
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getRd } from '@/api/control'
import { eventBus } from '@/utils/eventbus'

// 研发数据
const rdData = ref(null)
const loading = ref(false)
const error = ref(null)
const retryCount = ref(0)
const maxRetries = 3
const lastUpdateTime = ref('')

// 计算专利总数
const totalPatents = computed(() => {
  if (!rdData.value) return 0
  
  const { jw, fm, wg, sy, yf } = rdData.value
  return parseInt(jw || 0) + parseInt(fm || 0) + parseInt(wg || 0) + parseInt(sy || 0)
})

// 计算研发状态
const rdStatus = computed(() => {
  if (loading.value) return 'loading'
  if (error.value) return 'error'
  
  const total = parseInt(rdData.value?.total || 0)
  if (total >= 30) return 'excellent'
  if (total >= 20) return 'good'
  if (total >= 10) return 'warning'
  return 'critical'
})

const rdStatusText = computed(() => {
  const statusMap = {
    loading: '加载中...',
    error: '加载失败',
    excellent: '优秀',
    good: '良好',
    warning: '注意',
    critical: '严重'
  }
  return statusMap[rdStatus.value]
})

// 获取研发数据
const fetchRdData = async (isRetry = false) => {
  if (loading.value && !isRetry) return
  
  try {
    loading.value = true
    error.value = null
    
    console.log(`🔄 ${isRetry ? '重试' : '首次'}获取研发数据...`)
    const response = await getRd()
    console.log('研发数据响应:', response)
    
    if (response && response.code === 200 && response.data) {
      rdData.value = response.data
      retryCount.value = 0 // 重置重试计数
      lastUpdateTime.value = new Date().toLocaleTimeString()
      console.log('✅ 研发数据获取成功:', response.data)
    } else {
      throw new Error(`API响应异常: ${response?.message || '未知错误'}`)
    }
  } catch (err) {
    console.error('获取研发数据失败:', err)
    error.value = err.message || '网络请求失败'
    
    // 重试逻辑
    if (retryCount.value < maxRetries && !isRetry) {
      retryCount.value++
      console.log(`🔄 第${retryCount.value}次重试...`)
      setTimeout(() => fetchRdData(true), 2000 * retryCount.value) // 递增延迟
    } else if (retryCount.value >= maxRetries) {
      console.warn('重试次数已达上限，使用模拟数据')
      // 使用模拟数据作为备用
      rdData.value = {
        total: '28',
        jw: '21',
        fm: '26',
        wg: '60',
        sy: '86'
      }
      lastUpdateTime.value = new Date().toLocaleTimeString()
    }
  } finally {
    loading.value = false
  }
}

// 手动重试
const retryFetch = () => {
  retryCount.value = 0
  fetchRdData()
}

onMounted(() => {
  fetchRdData()
  eventBus.on('rd-data-updated', fetchRdData)
})

onUnmounted(() => {
  eventBus.off('rd-data-updated', fetchRdData)
})
</script>

<style scoped>
.rd-module {
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
  background: #00ff00;
}

.header-status.good .status-dot {
  background: var(--primary-blue);
}

.header-status.warning .status-dot {
  background: #ffaa00;
}

.header-status.critical .status-dot {
  background: #ff0000;
}

.content-area {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 5px;
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

.main-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-card {
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  position: relative;
}

.stat-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: var(--primary-blue);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stat-source {
  font-size: 10px;
  color: var(--text-primary);
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
  color: #10B981;
}

.trend-arrow {
  font-size: 14px;
}

.patent-breakdown {
  color: var(--text-primary);
  display: flex;
  flex-direction: row; /* 横向排列 */
  gap: 8px;
  margin-top: 12px;
  width: 100%;
  flex-wrap: wrap; /* 允许换行 */
}

.patent-item {
  display: flex;
  flex-direction: column; /* 内部垂直排列 */
  align-items: center;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  border-bottom: 2px solid rgba(0, 212, 255, 0.6);
  flex: 1; /* 平均分配宽度 */
  min-width: 60px; /* 最小宽度 */
}

.patent-type {
  font-size: 10px;
  color: var(--text-primary);
  margin-bottom: 4px;
  text-align: center;
}

.patent-count {
  font-size: 14px;
  color: var(--primary-blue);
  font-weight: 600;
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
  color: #9CA3AF;
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
  color: #9CA3AF;
  margin-bottom: 20px;
}

.project-status {
  flex: 1;
}
.section-title {
  color: var(--primary-blue);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.status-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.status-icon.planning {
  background: rgba(0, 212, 255, 0.2);
  border: 2px solid rgba(0, 212, 255, 0.5);
}

.status-icon.development {
  background: rgba(245, 158, 11, 0.2);
  border: 2px solid rgba(245, 158, 11, 0.5);
}

.status-icon.testing {
  background: rgba(0, 102, 255, 0.2);
  border: 2px solid rgba(0, 102, 255, 0.5);
}

.status-icon.completed {
  background: rgba(16, 185, 129, 0.2);
  border: 2px solid rgba(16, 185, 129, 0.5);
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.status-name {
  font-size: 12px;
  color: var(--text-muted);
}

.status-count {
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 600;
}

.innovation-metrics {
  flex: 1;
}

.metrics-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.metric-label {
  font-size: 12px;
  color: var(--text-muted);
  min-width: 80px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-blue);
  margin: 8px 0;
}

.metric-bar {
  flex: 1;
  height: 6px;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-blue), #3B82F6);
  transition: width 0.3s ease;
}

.recent-achievements {
  flex: 1;
}

.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(0, 212, 255, 0.2);
  border: 2px solid rgba(0, 212, 255, 0.5);
  border-radius: 6px;
  margin-bottom: 8px;
}

.achievement-item.patent {
  border-left-color: var(--primary-blue);
}

.achievement-item.project {
  border-left-color: #F59E0B;
}

.achievement-item.award {
  border-left-color: var(--secondary-blue);
}

.achievement-item.info {
  border-left-color: var(--primary-blue);
}

.achievement-icon {
  font-size: 16px;
}

.achievement-content {
  flex: 1;
}

.achievement-title {
  font-size: 12px;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 2px;
}

.achievement-desc {
  font-size: 10px;
  color: var(--text-muted);
}



/* 响应式设计 */
@media (max-width: 768px) {
  .main-stats {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .stat-card {
    padding: 6px;

  }
  
  .stat-value {
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