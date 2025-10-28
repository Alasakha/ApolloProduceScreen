<template>
  <div v-if="visible" class="dialog-overlay" @click="handleOverlayClick">
    <div class="dialog-container" @click.stop>
      <!-- 对话框标题 -->
      <div class="dialog-header">
        <div class="dialog-title">
          <span class="title-text">任务详细信息</span>
          <span class="title-subtitle">{{ orderName }}</span>
        </div>
        <button class="close-btn" @click="closeDialog">
          <span class="close-icon">×</span>
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在加载详细信息...</div>
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
          <div class="section-title">任务详情列表 ({{ detailData.length }} 项)</div>
          <div class="task-grid">
            <div v-for="(task, index) in detailData" :key="index" class="task-card">
            <!-- 任务标题 -->
            <div class="task-header">
              <div class="task-title">
                <span class="task-number">任务 {{ index + 1 }}</span>
                <span class="task-status" :class="getTaskStatusClass(task)">
                  {{ getTaskStatus(task) }}
                </span>
              </div>
            </div>

            <!-- 基本信息 -->
            <div class="task-info">
              <div class="info-row">
                <div class="info-item">
                  <span class="info-label">规格:</span>
                  <span class="info-value">{{ task.item_spec || '暂无数据' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">工单单号:</span>
                  <span class="info-value">{{ (task.ty001 || '') +'-'+ (task.ty002 || '') || '暂无数据' }}</span>
                </div>
              </div> 
              <div class="info-row">
                <div class="info-item">
                  <span class="info-label">品名:</span>
                  <span class="info-value">{{ task.item_name || '暂无数据' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">品号:</span>
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
                  <div class="quantity-value completed">{{ task.qty || 0 }}</div>
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
          <div class="section-title">汇总信息</div>
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
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { getplanDetail } from '@/api/getInjection.js'

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
  },
  ta006: {
    type: [String, Number],
    default: ''
  }
})

const emit = defineEmits(['close'])

const loading = ref(false)
const error = ref('')
const detailData = ref(null)

// 监听对话框显示状态
watch(() => props.visible, (newVal) => {
  if (newVal) {
    fetchDetailData()
  } else {
    // 关闭时重置数据
    detailData.value = null
    error.value = ''
  }
})

// 获取详细信息
const fetchDetailData = async () => {
    console.log(props.machineCode)
  if (!props.machineCode) {
    error.value = '缺少设备代码参数'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await getplanDetail(props.machineCode)
    if (response && response.data) {
      if (Array.isArray(response.data) && response.data.length > 0) {
        detailData.value = response.data
      } else {
        error.value = '未找到对应的任务详细信息'
      }
    } else {
      error.value = '获取数据失败'
    }
  } catch (err) {
    console.error('获取任务详细信息失败:', err)
    error.value = '网络请求失败，请检查网络连接'
  } finally {
    loading.value = false
  }
}

// 获取任务状态
const getTaskStatus = (task) => {
  const completed = task.qty || 0
  const total = task.ty004 || 0
  
  // 如果品号匹配，且已完成数量大于0，则状态为"进行中"
  if (props.ta006 && task.item_no && String(task.item_no) === String(props.ta006)) {
    if (completed > 0) {
      return '进行中'
    }
  }
  
  // 其他任务按原逻辑判断
  if (completed === 0) return '未开始'
  if (completed >= total) return '已完成'
  return '进行中'
}

// 获取任务状态样式类
const getTaskStatusClass = (task) => {
  const completed = task.qty || 0
  const total = task.ty004 || 0
  
  // 如果品号匹配，且已完成数量大于0，则状态样式为"进行中"
  if (props.ta006 && task.item_no && String(task.item_no) === String(props.ta006)) {
    if (completed > 0) {
      return 'status-in-progress'
    }
  }
  
  // 其他任务按原逻辑判断
  if (completed === 0) return 'status-not-started'
  if (completed >= total) return 'status-completed'
  return 'status-in-progress'
}

// 计算总计划数
const getTotalPlanned = () => {
  if (!detailData.value || !Array.isArray(detailData.value)) return 0
  return detailData.value.reduce((sum, task) => sum + (task.ty004 || 0), 0)
}

// 计算总完成数
const getTotalCompleted = () => {
  if (!detailData.value || !Array.isArray(detailData.value)) return 0
  return detailData.value.reduce((sum, task) => sum + (task.qty || 0), 0)
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
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.dialog-container {
  background: linear-gradient(135deg, rgba(0, 40, 90, 0.95) 0%, rgba(0, 20, 50, 0.95) 100%);
  border: 2px solid #2575fc;
  border-radius: 20px;
  box-shadow: 
    0 0 30px 8px rgba(37, 117, 252, 0.3),
    0 0 0 2px #00eaff inset;
  width: 90%;
  /* max-width: 800px; */
  max-height: 90vh;
  overflow: hidden;
  position: relative;
}

.dialog-header {
  background: linear-gradient(90deg, #2575fc 60%, #00eaff 100%);
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #00eaff;
}

.dialog-title {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.title-text {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.title-subtitle {
  color: #e0f7fa;
  font-size: 16px;
  opacity: 0.9;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.close-icon {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}

.dialog-content {
  padding: 30px;
  max-height: calc(90vh - 100px);
  overflow-y: auto;
}

.loading-container,
.error-container {
  padding: 60px 30px;
  text-align: center;
  color: #fff;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 234, 255, 0.3);
  border-top: 4px solid #00eaff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 18px;
  color: #00eaff;
}

.error-icon {
  font-size: 48px;
  color: #ff6b6b;
  margin-bottom: 20px;
}

.error-text {
  font-size: 18px;
  color: #ff6b6b;
  margin-bottom: 20px;
}

.retry-btn {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
}

.info-section {
  margin-bottom: 30px;
}

.section-title {
  color: #00eaff;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #00eaff;
  text-shadow: 0 0 8px rgba(0, 234, 255, 0.5);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.info-item {
  background: rgba(0, 40, 90, 0.4);
  border: 1px solid #2575fc;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  color: #b0e0ff;
  font-weight: bold;
  font-size: 16px;
}

.info-value {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.3);
}

.quantity-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.quantity-item {
  background: rgba(0, 40, 90, 0.4);
  border: 1px solid #2575fc;
  border-radius: 8px;
  padding: 8px;
  text-align: center;
  box-shadow: 0 0 8px rgba(37, 117, 252, 0.2);
}

.quantity-label {
  color: #b0e0ff;
  font-size: 11px;
  margin-bottom: 4px;
  font-weight: bold;
}

.quantity-value {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.3);
}

.quantity-value.completed {
  color: #4ade80;
  text-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
}

.quantity-value.remaining {
  color: #fbbf24;
  text-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
}

.quantity-value.progress {
  color: #00eaff;
  text-shadow: 0 0 8px rgba(0, 234, 255, 0.5);
}

.progress-section {
  margin-top: 30px;
}

.progress-label {
  color: #00eaff;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  text-shadow: 0 0 8px rgba(0, 234, 255, 0.5);
}

.progress-bar {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #2575fc;
  border-radius: 6px;
  height: 12px;
  overflow: hidden;
  margin-bottom: 4px;
  box-shadow: 0 0 6px rgba(37, 117, 252, 0.3) inset;
}

.progress-fill {
  background: linear-gradient(90deg, #4ade80 0%, #00eaff 100%);
  height: 100%;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 6px rgba(74, 222, 128, 0.5);
}

.progress-text {
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.3);
}

/* 任务列表样式 */
.task-list {
  margin-bottom: 30px;
}

.task-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.task-card {
  background: rgba(0, 40, 90, 0.3);
  border: 2px solid #2575fc;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 0 15px rgba(37, 117, 252, 0.2);
  transition: all 0.3s ease;
  height: fit-content;
}

.task-card:hover {
  border-color: #00eaff;
  box-shadow: 0 0 25px rgba(0, 234, 255, 0.3);
  transform: translateY(-2px);
}

.task-header {
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #2575fc;
}

.task-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-number {
  color: #00eaff;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(0, 234, 255, 0.5);
}

.task-status {
  padding: 3px 8px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.3);
}

.status-not-started {
  background: rgba(107, 114, 128, 0.3);
  color: #9ca3af;
  border: 1px solid #6b7280;
}

.status-in-progress {
  background: rgba(251, 191, 36, 0.3);
  color: #fbbf24;
  border: 1px solid #fbbf24;
}

.status-completed {
  background: rgba(74, 222, 128, 0.3);
  color: #4ade80;
  border: 1px solid #4ade80;
}

.task-info {
  margin-bottom: 10px;
}

.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 6px;
}

.task-quantity {
  margin-bottom: 10px;
}

.task-progress {
  margin-top: 8px;
}

/* 汇总信息样式 */
.summary-section {
  background: rgba(0, 40, 90, 0.4);
  border: 2px solid #00eaff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 234, 255, 0.2);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
}

.summary-item {
  background: rgba(0, 40, 90, 0.4);
  border: 2px solid #2575fc;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 0 15px rgba(37, 117, 252, 0.2);
}

.summary-label {
  color: #b0e0ff;
  font-size: 14px;
  margin-bottom: 10px;
  font-weight: bold;
}

.summary-value {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}

.summary-value.completed {
  color: #4ade80;
  text-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
}

.summary-value.remaining {
  color: #fbbf24;
  text-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
}

.summary-value.progress {
  color: #00eaff;
  text-shadow: 0 0 8px rgba(0, 234, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .task-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dialog-container {
    width: 95%;
    margin: 20px;
  }
  
  .dialog-header {
    padding: 15px 20px;
  }
  
  .title-text {
    font-size: 20px;
  }
  
  .dialog-content {
    padding: 20px;
  }
  
  .task-grid {
    grid-template-columns: 1fr;
  }
  
  .info-row {
    grid-template-columns: 1fr;
  }
  
  .quantity-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .quantity-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>