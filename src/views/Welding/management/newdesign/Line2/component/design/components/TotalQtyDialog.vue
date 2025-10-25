<template>
<el-dialog
      :model-value="visible"
      @update:model-value="handleClose"
             title="任务总数量详情"
      width="90%"
      top="5vh"
      :before-close="handleClose"
      class="process-dialog"
    >
      <div class="dialog-content">
        <!-- 加载状态 -->
                 <div v-if="loading" class="flex items-center justify-center h-64">
           <div class="text-cyan-400 text-lg">正在加载任务详情...</div>
         </div>
        
        <!-- 错误状态 -->
        <div v-else-if="error" class="flex items-center justify-center h-64">
          <div class="text-red-400 text-lg">{{ error }}</div>
        </div>
        
                 <!-- 任务详情卡片 -->
        <div v-else class="process-details">
          <div 
            v-for="(item, index) in apiProcessData" 
            :key="index"
            class="detail-card"
          >
            <!-- 卡片头部 -->
            <div class="card-header">
              <div class="device-info">
                <h3 class="device-number">设备编号：{{ item.macNo || '未知设备' }}</h3>
                <p class="device-name">{{ item.machineName || '-' }}</p>
              </div>
              <div class="task-count">
                <span class="count-number">{{ item.num || 0 }}</span>
                <span class="count-label">任务总数</span>
              </div>
            </div>
            
                        <!-- 关键信息 -->
            <div class="key-info">
              <div class="info-item">
                <span class="info-label">品名</span>
                <span class="info-value">{{ item.item_description || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">规格</span>
                <span class="info-value">{{ item.item_specification || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">加工工序</span>
                <span class="info-value">{{ item.processName || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">作业人员</span>
                <span class="info-value">{{ item.employeeName || '-' }}</span>
              </div>
            </div>
            
            <!-- 工单信息区域 -->
            <div class="work-order-section">
              <div class="work-info">
                <span class="work-label">工单数量</span>
                <span class="work-value">{{ item.plan_qty || '-' }}</span>
              </div>
            </div>
            
            <!-- 工单信息 -->
            <div class="order-info">
              <div class="order-item">
                <span class="order-label">工单号</span>
                <span class="order-value">{{ item.workNo || '-' }}</span>
              </div>
              <div class="order-item">
                <span class="order-label">订单号</span>
                <span class="order-value">{{ item.udf021 || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { getStampingTaskAll } from '@/api/getStampWeldinfo'
const loading = ref(false)
  const error = ref('')
  const apiProcessData = ref([])
interface Props {
  data?: any[]
  prodLine?: string
  type?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  prodLine: () => '',
  type: () => ''
})

const visible = defineModel<boolean>('visible', { default: false })


const handleClose = () => {
  visible.value = false
}



  // 监听弹窗显示状态，显示时获取数据
  watch(() => visible.value, (newVisible) => {
  if (newVisible) {
    console.log('TotalQtyDialog - visible 变化:', newVisible)
    console.log('TotalQtyDialog - props.data:', props.data)
    console.log('TotalQtyDialog - props.prodLine:', props.prodLine)
    console.log('TotalQtyDialog - props.type:', props.type)
    fetchProcessData()
  }
})

// 获取API数据
const fetchProcessData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await getStampingTaskAll(props.prodLine, props.type)
    console.log('TotalQtyDialog API response:', response)
    // API返回的是包含data属性的对象，需要提取data数组
    const responseData = response?.data || []
    // 显示所有任务数据，不进行过滤
    apiProcessData.value = responseData
    console.log('TotalQtyDialog - 设置 apiProcessData:', apiProcessData.value)

  } catch (err) {
    error.value = '获取工序数据失败'
    console.error('获取工序数据失败:', err)
  } finally {
    loading.value = false
    console.log('=== fetchProcessData 执行完成 ===')
  }
}
</script>

<style scoped>
.total-qty-dialog :deep(.el-dialog) {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  z-index: 9999 !important;
}

.total-qty-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #2a2a2a, #333);
  border-bottom: 1px solid #444;
  padding: 20px 24px;
  border-radius: 12px 12px 0 0;
}

.total-qty-dialog :deep(.el-dialog__title) {
  color: #22d3ee;
  font-size: 20px;
  font-weight: 600;
}

.total-qty-dialog :deep(.el-dialog__close) {
  color: #999;
  font-size: 18px;
}

.total-qty-dialog :deep(.el-dialog__close):hover {
  color: #22d3ee;
}

.total-qty-dialog :deep(.el-dialog__body) {
  padding: 24px;
  background: #1a1a1a;
}

.dialog-content {
  width: 100%;
}

.detail-content {
  color: #fff;
}

.header-section {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  padding: 20px;
  background: linear-gradient(135deg, #1e3a8a, #22d3ee);
  border-radius: 12px;
}

.icon-wrapper {
  margin-right: 20px;
}

.quantity-icon {
  font-size: 48px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.title-section {
  flex: 1;
}

.main-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #fff;
}

.subtitle {
  font-size: 14px;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #333;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: currentColor;
}

.stat-card.primary {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  color: #22d3ee;
}

.stat-card.success {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  color: #10b981;
}

.stat-card.warning {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  color: #f59e0b;
}

.stat-card.info {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  color: #8b5cf6;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: currentColor;
}

.stat-icon {
  font-size: 32px;
  margin-right: 16px;
  opacity: 0.8;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin-bottom: 8px;
  font-weight: 500;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-unit {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.progress-section {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #333;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.progress-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.progress-percentage {
  font-size: 18px;
  font-weight: 700;
  color: #22d3ee;
}

.progress-bar-container {
  margin-bottom: 12px;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: #404040;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22d3ee, #10b981);
  border-radius: 6px;
  transition: width 0.6s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-details {
  text-align: center;
  font-size: 14px;
  color: #999;
  font-weight: 500;
}

/* 精简卡片布局 */
.process-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
  max-height: 70vh;
  overflow-y: auto;
  padding: 4px;
}

.detail-card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 280px;
}

.detail-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  border-color: #22d3ee;
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #333;
}

.device-info {
  flex: 1;
}

.device-number {
  color: #22d3ee;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.device-name {
  color: #999;
  font-size: 14px;
  margin: 0;
}

.task-count {
  text-align: center;
  background: linear-gradient(135deg, #22d3ee, #10b981);
  border-radius: 8px;
  padding: 8px 12px;
  min-width: 60px;
}

.count-number {
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
}

.count-label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 10px;
  margin-top: 2px;
}

/* 关键信息 */
.key-info {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.info-label {
  color: #999;
  font-size: 13px;
  font-weight: 500;
}

.info-value {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  max-width: 200px;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 工单信息区域 */
.work-order-section {
  margin-bottom: 16px;
  padding: 12px;
  background: #2a2a2a;
  border-radius: 8px;
  border: 1px solid #404040;
}

.work-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.work-label {
  color: #999;
  font-size: 13px;
  font-weight: 500;
}

.work-value {
  color: #22d3ee;
  font-size: 16px;
  font-weight: 700;
}



/* 工单信息 */
.order-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.order-item {
  background: #2a2a2a;
  border: 1px solid #404040;
  border-radius: 6px;
  padding: 8px 12px;
  text-align: center;
}

.order-label {
  display: block;
  color: #999;
  font-size: 12px;
  margin-bottom: 4px;
}

.order-value {
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>