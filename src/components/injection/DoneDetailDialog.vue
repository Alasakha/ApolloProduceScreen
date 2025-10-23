<template>
  <div v-if="visible" class="dialog-overlay" @click="handleOverlayClick">
    <div class="dialog-container" @click.stop>
      <!-- 对话框标题 -->
      <div class="dialog-header">
        <div class="dialog-title">
          <span class="title-text">已完成任务详情</span>
          <span class="title-subtitle">{{ orderName }}</span>
        </div>
        <button class="close-btn" @click="closeDialog">
          <span class="close-icon">×</span>
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在加载已完成任务详情...</div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠</div>
        <div class="error-text">{{ error }}</div>
        <button class="retry-btn" @click="fetchDetailData">重试</button>
      </div>

      <!-- 详细信息内容 -->
      <div v-else-if="detailData && detailData.length > 0" class="dialog-content">
        <!-- 任务列表 -->
        <div class="task-list">
          <div class="section-title">已完成任务详情 ({{ detailData.length }} 项)</div>
          <div class="task-grid">
            <div v-for="(task, index) in detailData" :key="index" class="task-card">
            <!-- 任务标题 -->
            <div class="task-header">
              <div class="task-title">
                <span class="task-number">任务 {{ index + 1 }}</span>
                <span class="task-status status-completed">
                  已完成
                </span>
              </div>
            </div>

            <!-- 基本信息 -->
            <div class="task-info">
              <div class="info-row">
                <div class="info-item">
                  <span class="info-label">品号:</span>
                  <span class="info-value">{{ task.ty009 || '暂无数据' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">客户单号:</span>
                  <span class="info-value">{{ (task.ty001 || '') + (task.ty002 || '') || '暂无数据' }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="info-label">品名:</span>
                  <span class="info-value">{{ task.item_name || '暂无数据' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">工单号:</span>
                  <span class="info-value">{{ task.item_no || '暂无数据' }}</span>
                </div>
              </div>
            </div>

            <!-- 数量信息 -->
            <div class="task-quantity">
              <div class="quantity-grid">
                <div class="quantity-item">
                  <div class="quantity-label">计划总数</div>
                  <div class="quantity-value">{{ task.ty004 || 0 }}</div>
                </div>
                <div class="quantity-item">
                  <div class="quantity-label">已完成数</div>
                  <div class="quantity-value completed">{{ task.cycn || 0 }}</div>
                </div>
                <div class="quantity-item">
                  <div class="quantity-label">剩余数量</div>
                  <div class="quantity-value remaining">{{ (task.ty004 || 0) - (task.qty || 0) }}</div>
                </div>
                <div class="quantity-item">
                  <div class="quantity-label">完成率</div>
                  <div class="quantity-value progress">
                    {{ task.ty004 ? Math.round(((task.qty || 0) / task.ty004) * 100) : 0 }}%
                  </div>
                </div>
              </div>
            </div>

            <!-- 进度条 -->
            <div class="task-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: task.ty004 ? ((task.qty || 0) / task.ty004) * 100 + '%' : '0%' }"
                ></div>
              </div>
              <div class="progress-text">
                {{ task.qty || 0 }} / {{ task.ty004 || 0 }}
              </div>
            </div>
          </div>
          </div>
        </div>

        <!-- 汇总信息 -->
        <div class="summary-section">
          <div class="summary-title">汇总信息</div>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-label">总计划数</div>
              <div class="summary-value">{{ getTotalPlanned() }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">总完成数</div>
              <div class="summary-value completed">{{ getTotalCompleted() }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">总剩余数</div>
              <div class="summary-value remaining">{{ getTotalRemaining() }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">整体完成率</div>
              <div class="summary-value progress">{{ getOverallProgress() }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 无数据状态 -->
      <div v-else class="empty-container">
        <div class="empty-icon">📋</div>
        <div class="empty-text">暂无已完成任务数据</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getDoneDetail } from '@/api/getInjection'

// 组件属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  orderName: {
    type: String,
    default: ''
  },
  machineCode: {
    type: String,
    default: ''
  }
})

// 事件定义
const emit = defineEmits(['close'])

// 响应式数据
const loading = ref(false)
const error = ref('')
const detailData = ref([])

// 监听visible变化，自动获取数据
watch(() => props.visible, (newVisible) => {
  if (newVisible && props.machineCode) {
    fetchDetailData()
  }
})

// 获取已完成任务详情数据
const fetchDetailData = async () => {
  if (!props.machineCode) {
    error.value = '缺少设备编码'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await getDoneDetail(props.machineCode)
    if (response && response.data) {
      if (Array.isArray(response.data) && response.data.length > 0) {
        detailData.value = response.data
      } else {
        error.value = '未找到对应的已完成任务详情'
      }
    } else {
      error.value = '获取数据失败'
    }
  } catch (err) {
    console.error('获取已完成任务详情失败:', err)
    error.value = '网络请求失败，请检查网络连接'
  } finally {
    loading.value = false
  }
}

// 计算总计划数
const getTotalPlanned = () => {
  if (!detailData.value || !Array.isArray(detailData.value)) return 0
  return detailData.value.reduce((sum, task) => sum + (task.ty004 || 0), 0)
}

// 计算总完成数
const getTotalCompleted = () => {
  if (!detailData.value || !Array.isArray(detailData.value)) return 0
  return detailData.value.reduce((sum, task) => sum + (task.cycn || 0), 0)
}

// 计算总剩余数
const getTotalRemaining = () => {
  return getTotalPlanned() - getTotalCompleted()
}

// 计算整体完成率
const getOverallProgress = () => {
  const total = getTotalPlanned()
  if (total === 0) return 0
  return Math.round((getTotalCompleted() / total) * 100)
}

// 关闭对话框
const closeDialog = () => {
  emit('close')
}

// 点击遮罩层关闭
const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    closeDialog()
  }
}
</script>

<style scoped>
/* 复用PlanDetailDialog的样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.dialog-container {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 90vw;
  max-height: 90vh;
  width: 1200px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(90deg, #2d3748 0%, #1a202c 100%);
}

.dialog-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-text {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.title-subtitle {
  font-size: 14px;
  color: #a0aec0;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.close-icon {
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
}

.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text,
.error-text,
.empty-text {
  color: #a0aec0;
  font-size: 16px;
}

.error-icon,
.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.retry-btn {
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  margin-top: 16px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: #3182ce;
}

.dialog-content {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #4299e1;
}

.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.task-card {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.task-header {
  margin-bottom: 16px;
}

.task-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-number {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.task-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-completed {
  background: rgba(72, 187, 120, 0.2);
  color: #48bb78;
  border: 1px solid rgba(72, 187, 120, 0.3);
}

.task-info {
  margin-bottom: 16px;
}

.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: #a0aec0;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
}

.task-quantity {
  margin-bottom: 16px;
}

.quantity-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.quantity-item {
  text-align: center;
  padding: 12px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.quantity-label {
  font-size: 11px;
  color: #a0aec0;
  margin-bottom: 4px;
}

.quantity-value {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.quantity-value.completed {
  color: #48bb78;
}

.quantity-value.remaining {
  color: #f56565;
}

.quantity-value.progress {
  color: #4299e1;
}

.task-progress {
  margin-top: 16px;
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4299e1 0%, #63b3ed 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-size: 12px;
  color: #a0aec0;
}

.summary-section {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 16px;
  text-align: center;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.summary-item {
  text-align: center;
  padding: 16px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-label {
  font-size: 12px;
  color: #a0aec0;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.summary-value.completed {
  color: #48bb78;
}

.summary-value.remaining {
  color: #f56565;
}

.summary-value.progress {
  color: #4299e1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dialog-container {
    width: 95vw;
    max-height: 95vh;
  }
  
  .task-grid {
    grid-template-columns: 1fr;
  }
  
  .info-row {
    grid-template-columns: 1fr;
  }
  
  .quantity-grid,
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>