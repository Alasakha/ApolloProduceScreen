<template>
  111
  <el-dialog
    :model-value="visible"
    @update:model-value="handleClose"
    title="工序详情"
    width="90%"
    top="5vh"
    :before-close="handleClose"
    class="process-dialog"
  >
    <div class="dialog-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="text-cyan-400 text-lg">正在加载工序详情...</div>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="flex items-center justify-center h-64">
        <div class="text-red-400 text-lg">{{ error }}</div>
      </div>
      
      <!-- 工序详情卡片 -->
      <div v-else class="process-details grid grid-cols-2 gap-4">
        <div 
          v-for="(item, index) in processCards" 
          :key="index"
          class="detail-card"
        >
          <!-- 卡片头部 -->
          <div class="detail-header">
        
            <h3 class="detail-title">{{ item.processName }}</h3>
          </div>
          
          <!-- 九个参数网格 -->
          <div class="params-grid">
            <!-- 设备编号 -->
            <div class="param-box">
              <div class="param-label">设备编号</div>
              <div class="param-value">{{ item.macNo || '-' }}</div>
            </div>
            
            <!-- 设备名称 -->
            <div class="param-box">
              <div class="param-label">设备名称</div>
              <div class="param-value">{{ item.machineName || '-' }}</div>
            </div>
            
            <!-- 品名 -->
            <div class="param-box">
              <div class="param-label">品名</div>
              <div class="param-value">{{ item.itemName || '-' }}</div>
            </div>
            
            <!-- 规格 -->
            <div class="param-box">
              <div class="param-label">规格</div>
              <div class="param-value">{{ item.itemSpec || '-' }}</div>
            </div>
            
            <!-- 工单数量 -->
            <div class="param-box">
              <div class="param-label">任务总数量</div>
              <div class="param-value">{{ item.planQty || '-' }}</div>
            </div>
            
              <!-- 加工工序 -->
              <div class="param-box">
                <div class="param-label">已完成数量</div>
                <div class="param-value">{{ item.num || '-' }}</div>
              </div>
            
            <!-- 工单号 -->
            <div class="param-box">
              <div class="param-label">工单号</div>
              <div class="param-value">{{ item.workNo || '-' }}</div>
            </div>
            


            
            <!-- 订单号 -->
            <div class="param-box">
              <div class="param-label">订单号</div>
              <div class="param-value">{{ item.orderNo || '-' }}</div>
            </div>
          </div>
          
          <!-- 进度条区域 -->
          <div class="progress-area">
            <div class="progress-label">进度条</div>
            <div class="progress-container">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: item.progress + '%' }"
                ></div>
              </div>
              <div class="progress-text">{{ item.progress }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { getStampingAll, type StampingAllItem } from '@/api/getStampWeldinfo'

interface ProcessCard {
  // 基础信息
  processName: string        // 工序名称
  status: string            // 状态
  progress: number          // 进度百分比
  plan_qty: number
  // 九个关键参数
  macNo: string            // 设备编号
  machineName: string      // 设备名称  
  itemName: string         // 品名
  itemSpec: string         // 规格
  planQty: string          // 工单数量
  workOrder: string        // 加工工序
  workNo: string           // 工单号
  employeeName: string     // 操作员工
  orderNo: string          // 订单号

  // API原始数据字段
  isDoing?: string         // 是否在做
  num?: string            // 数量
}

interface Props {
  visible: boolean
  selectedCard?: {
    title?: string
    orderName?: string
    // 其他卡片信息
  }
  prodLine?: string
  type?: string  // 新增 type 参数
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

// API数据状态
const loading = ref(false)
const error = ref('')
const apiProcessData = ref<StampingAllItem[]>([])



// 获取API数据
const fetchProcessData = async () => {

  


  loading.value = true
  error.value = ''
  
  try {
    const response = await getStampingAll(props.prodLine, props.type)
    console.log('response', response)
    apiProcessData.value = response.data || []

  } catch (err) {
    error.value = '获取工序数据失败'
    console.error('获取工序数据失败:', err)
  } finally {
    loading.value = false
    console.log('=== fetchProcessData 执行完成 ===')
  }
}

// 监听弹窗显示状态，显示时获取数据
watch(() => props.visible, (newVisible) => {

  if (newVisible) {

    fetchProcessData()
  }
})

// 将API数据转换为ProcessCard格式
const convertApiDataToCards = (apiData: StampingAllItem[]): ProcessCard[] => {
  return apiData.map(item => {
    // 计算进度
    const totalQty = parseFloat(item.plan_qty) || 0
    const doneQty = parseFloat(item.num) || 0
    const progress = totalQty > 0 ? Math.round((doneQty / totalQty) * 100) : 0
    
    
    return {
      // 基础信息
      processName: item.processName || '未知工序',
      status: status,
      progress: progress,
      
      // 九个关键参数
      macNo: item.macNo || '-',                           // 设备编号
      machineName: item.machineName || item.macNo || '-', // 设备名称，如果为空则使用设备编号
      itemName: item.processName  || '-', // 品名，优先使用item_description
      itemSpec: item.item_specification || '-',           // 规格  
      planQty: item.plan_qty || '-',                      // 任务总数量
      workOrder: item.processName || '-',                 // 加工工序，使用processName
      workNo: item.workNo || '-',                         // 工单号
      employeeName: item.employeeName || '-',             // 操作员工
      orderNo: item.te001te002 || '-',                    // 订单号，使用te001te002字段
      plan_qty:item.plan_qty || 0,
      // API原始数据字段
      isDoing: item.isDoing,
      num: item.num
    }
  })
}

// 计算最终显示的工序卡片数据
const processCards = computed<ProcessCard[]>(() => {
console.log('是否执行')
console.log('apiProcessData.value', apiProcessData.value.length)
  if (apiProcessData.value.length > 0) {
    console.log('convertApiDataToCards', convertApiDataToCards(apiProcessData.value))
    return convertApiDataToCards(apiProcessData.value)
  }
  
  // 如果没有API数据，返回空数组
  return []
})

const handleClose = () => {
  emit('update:visible', false)
}


</script>

<style scoped>
.process-dialog :deep(.el-dialog) {
  background: #1a1a1a;
  border: 1px solid #333;
}

.process-dialog :deep(.el-dialog__header) {
  background: #2a2a2a;
  border-bottom: 1px solid #333;
  padding: 15px 20px;
}

.process-dialog :deep(.el-dialog__title) {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}

.process-dialog :deep(.el-dialog__close) {
  color: #999;
}

.process-dialog :deep(.el-dialog__close):hover {
  color: #fff;
}

.process-dialog :deep(.el-dialog__body) {
  padding: 20px;
  background: #1a1a1a;
}

.dialog-content {
  width: 100%;
  height: 100%;
}

.process-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  max-height: 75vh;
  overflow-y: auto;
  padding: 4px;
}

.detail-card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.detail-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  border-color: #555;
}

.detail-card::before {
  display: none;
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #333;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
  animation: pulse 2s infinite;
}

.status-running { background: #00ff88; }
.status-standby { background: #ffa500; }
.status-completed { background: #00bfff; }
.status-error { background: #ff4757; }
.status-unknown { background: #666; }

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

.detail-title {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.params-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.param-box {
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  transition: all 0.3s ease;
}

.param-box:hover {
  background: #333;
  border-color: #555;
  transform: translateY(-2px);
}

.param-label {
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.param-value {
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  word-break: break-all;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.progress-area {
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 20px;
}

.progress-label {
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.progress-fill {
  height: 100%;
  background: #4CAF50;
  transition: width 0.5s ease;
  border-radius: 6px;
}

.progress-text {
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  min-width: 50px;
  text-align: right;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}



/* 响应式设计 */
@media (max-width: 768px) {
  .params-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .param-box {
    padding: 12px;
  }
  
  .param-value {
    font-size: 14px;
  }
  
  .detail-card {
    padding: 16px;
  }
  
  .progress-area {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .params-grid {
    grid-template-columns: 1fr;
  }
}

/* 滚动条样式 */
.process-details::-webkit-scrollbar {
  width: 8px;
}

.process-details::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.process-details::-webkit-scrollbar-thumb {
  background: #4a4a4a;
  border-radius: 4px;
}

.process-details::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style>