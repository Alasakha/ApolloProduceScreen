<template>
  <el-dialog
   :model-value="visible"
  @update:model-value="handleClose"
    title="待机设备详情"
    width="60vw"
    class="waiting-dialog"
    :before-close="handleClose"
    destroy-on-close
  >
    <div class="dialog-content">
      <div class="detail-content">
        <div class="header-section">
          <div class="icon-wrapper">
            <div class="waiting-icon">⏸️</div>
          </div>
          <div class="title-section">
            <h2 class="main-title">待机设备监控</h2>
            <p class="subtitle">设备状态与可用性概览</p>
          </div>
          <div class="stats-summary">
            <div class="summary-item">
              <span class="summary-label">待机设备</span>
              <span class="summary-value">{{ waitingDeviceCount }}</span>
            </div>

          </div>
        </div>
        
        <div class="waiting-info" v-if="waitingDeviceCount === 0">
          <div class="no-waiting-card">
            <div class="no-waiting-icon">✅</div>
            <div class="no-waiting-title">所有设备正在运行</div>
            <div class="no-waiting-desc">当前没有设备处于待机状态，生产线运行良好</div>
          </div>
        </div>
        
        <div v-else class="waiting-devices">
          <div class="devices-grid">
            <div 
              v-for="(device, index) in showData" 
              :key="index"
              class="waiting-device-card"
              @click="openDeviceDetailDialog(device)"
            >
              <div class="device-header">
                <div class="device-status">
                  <div class="status-indicator waiting"></div>
                  <span class="status-text">待机中</span>
                </div>
                <div class="device-id">设备编号：{{ device.macNo }}</div>
                <div class="device-id">设备名称：{{ device.machineName || '暂无' }}</div>
                <div class="device-id">任务总量：{{ device.num || '暂无' }}</div>
              </div>
              
              <div class="device-actions flex items-center justify-between">
                <div>待机原因：{{ device.reason || '暂未填写' }}</div>
                <div class="action-buttons">
                  <button class="action-btn primary" @click.stop="openReasonDialog(device)">
                    
                    <span class="btn-icon">📝</span>
                    填写原因
                  </button>
                </div>
              </div>

              </div>
            </div>
          </div>
        </div>
      </div>

  </el-dialog>

  <!-- 填写原因弹窗 - 移到主弹窗外部 -->
  <el-dialog
    v-model="reasonDialogVisible"
    title="填写原因说明"
    width="50%"
    :close-on-click-modal="false"
    :before-close="handleReasonDialogClose"
    destroy-on-close
    append-to-body
  >
    <div class="reason-dialog-content">
      <div class="dialog-header mb-6">
        <div class="header-icon">📝</div>
        <div class="header-text">
          <h3 class="header-title">填写设备原因说明</h3>
          <p class="header-subtitle">请详细描述设备当前状态的原因</p>
        </div>
      </div>
      
      <div class="form-content">
        <!-- 设备信息 -->
        <div class="device-info mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div class="info-row flex items-center justify-between mb-2">
            <span class="info-label text-blue-700 font-medium">设备编号：</span>
            <span class="info-value text-blue-900 font-semibold">{{ selectedDevice?.macNo || '未知' }}</span>
          </div>
          <div class="info-row flex items-center justify-between">
            <span class="info-label text-blue-700 font-medium">设备名称：</span>
            <span class="info-value text-blue-900 font-semibold">{{ selectedDevice?.machineName || '未知' }}</span>
          </div>
        </div>
        
        <!-- 原因选择 -->
        <div class="reason-input-section mb-6">
          <label class="input-label block text-gray-700 font-medium mb-3">原因说明 *</label>
          <el-radio-group v-model="selectedReason" class="w-full">
            <div class="reason-options">
              <el-radio label="1、无计划" class="reason-option">1、无计划</el-radio>
              <el-radio label="2、缺人" class="reason-option">2、缺人</el-radio>
              <el-radio label="3、人员请假" class="reason-option">3、人员请假</el-radio>
              <el-radio label="4、缺料" class="reason-option">4、缺料</el-radio>
              <el-radio label="5、设备故障" class="reason-option">5、设备故障</el-radio>
              <el-radio label="6、夹具故障" class="reason-option">6、夹具故障</el-radio>
              <el-radio label="7、系统故障" class="reason-option">7、系统故障</el-radio>
              <el-radio label="8、换模 换型" class="reason-option">8、换模 换型</el-radio>
              <el-radio label="9、其他" class="reason-option">9、其他</el-radio>
            </div>
          </el-radio-group>
          
          <!-- 其他原因输入框 -->
          <div v-if="selectedReason === '9、其他'" class="other-reason-input mt-4">
            <el-input
              v-model="otherReason"
              type="textarea"
              :rows="3"
              placeholder="请详细描述其他原因..."
              class="w-full"
              :maxlength="200"
              show-word-limit
            />
          </div>
        </div>
        
        <!-- 提交状态 -->
        <div v-if="feedbackMessage" class="feedback-section mb-4">
          <div class="feedback-content p-3 rounded-lg border" :class="feedbackType === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'">
            <div class="flex items-center">
              <span class="feedback-icon mr-2" :class="feedbackType === 'success' ? 'text-green-600' : 'text-red-600'">
                {{ feedbackType === 'success' ? '✅' : '❌' }}
              </span>
              <span class="feedback-text" :class="feedbackType === 'success' ? 'text-green-700' : 'text-red-700'">
                {{ feedbackMessage }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dialog-actions flex justify-end gap-3 pt-4 border-t border-gray-200">
        <el-button @click="closeReasonDialog" :disabled="submittingReason">取消</el-button>
        <el-button 
          type="primary" 
          @click="submitReason" 
          :loading="submittingReason"
          :disabled="!selectedReason || (selectedReason === '9、其他' && !otherReason.trim())"
        >
          提交原因
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {  ref, watch } from 'vue'
import { getStampingStandb } from '@/api/getStampWeldinfo'
import { ElMessage } from 'element-plus'
import { getRawMaterialMonitoringAdd } from '@/api/getnewInjection'
interface Props {
  visible: boolean
  data?: any[]
  prodLine: string
  type: number
}
const visible = defineModel<boolean>('visible', { default: false })
const showData = ref([])
const waitingDeviceCount = ref(0)

// 设备详情弹窗相关状态
const selectedDevice = ref(null)


// 填写原因弹窗相关状态
const reasonDialogVisible = ref(false)
const selectedReason = ref('')
const otherReason = ref('')
const feedbackMessage = ref('')
const feedbackType = ref('success')
const submittingReason = ref(false)

const fetchData = async () => {
  const res = await getStampingStandb(props.prodLine, props.type)
  showData.value = res.data
  waitingDeviceCount.value = res.data.length
}


const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  prodLine: '',
  type: 0
})


watch(() => visible.value, (newVisible) => {
  if (newVisible) {
    fetchData()
  }
})


const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()



const handleClose = () => {
  // 如果填写原因弹窗是打开的，先关闭它
  if (reasonDialogVisible.value) {
    reasonDialogVisible.value = false
    selectedDevice.value = null
    selectedReason.value = ''
    otherReason.value = ''
    feedbackMessage.value = ''
  }
  
  emit('update:visible', false)
}

// 打开设备详情弹窗（暂时只记录日志）
const openDeviceDetailDialog = (device: any) => {
  selectedDevice.value = device
  console.log('点击设备:', device)
  // TODO: 可以在这里添加设备详情弹窗的逻辑
}

// 打开填写原因弹窗
const openReasonDialog = (device: any) => {
  selectedDevice.value = device
  
  // 回写功能：根据设备已有的原因设置选择状态
  const currentReason = device.reason || ''
  console.log('设备当前原因:', currentReason) // 调试信息
  
  // 预定义的原因选项
  const predefinedReasons = [
    '1、无计划',
    '2、缺人',
    '3、人员请假', 
    '4、缺料',
    '5、设备故障',
    '6、夹具故障',
    '7、系统故障',
    '8、换模 换型'
  ]
  
  // 检查是否是预定义的原因
  if (predefinedReasons.includes(currentReason)) {
    selectedReason.value = currentReason
    otherReason.value = ''
    console.log('匹配预定义原因:', currentReason) // 调试信息
  } else if (currentReason.trim()) {
    // 如果是其他原因，设置为"其他"选项并填入具体内容
    selectedReason.value = '9、其他'
    otherReason.value = currentReason
    console.log('设置为其他原因:', currentReason) // 调试信息
  } else {
    // 如果没有原因，清空所有选择
    selectedReason.value = ''
    otherReason.value = ''
    console.log('清空选择') // 调试信息
  }
  
  feedbackMessage.value = '' // 清空反馈信息
  feedbackType.value = 'success'
  reasonDialogVisible.value = true
}

// 关闭填写原因弹窗
const closeReasonDialog = () => {
  reasonDialogVisible.value = false
  selectedDevice.value = null
  selectedReason.value = ''
  otherReason.value = ''
  feedbackMessage.value = ''
}

// 处理填写原因弹窗的关闭事件（包括ESC键）
const handleReasonDialogClose = (done: () => void) => {
  // 如果正在提交中，不允许关闭
  if (submittingReason.value) {
    return
  }
  
  // 如果有未保存的更改，可以提示用户
  const currentReason = selectedReason.value === '9、其他' ? otherReason.value : selectedReason.value
  if (currentReason.trim() && currentReason !== selectedDevice.value?.reason) {
    ElMessage.warning('有未保存的更改，请确认是否关闭')
  }
  
  // 执行关闭
  closeReasonDialog()
  done()
}

// 提交原因
const submitReason = async () => {
  if (!selectedDevice.value || !selectedReason.value) return
  
  // 如果选择的是"其他"，需要检查是否填写了其他原因
  if (selectedReason.value === '9、其他' && !otherReason.value.trim()) {
    ElMessage.warning('请填写其他原因')
    return
  }

  submittingReason.value = true
  try {
    // 确定最终的原因文本
    const finalReason = selectedReason.value === '9、其他' ? otherReason.value : selectedReason.value
    
    // 调用API接口提交原因
    const res = await getRawMaterialMonitoringAdd(selectedDevice.value.macNo, finalReason)
    if(res.code === 200){
    feedbackMessage.value = '提交成功！'
    feedbackType.value = 'success'
    }else{
      feedbackMessage.value = '提交失败，请稍后再试。'
      feedbackType.value = 'error'
    }
    // 更新本地数据
    if (selectedDevice.value) {
      selectedDevice.value.reason = finalReason
    }
    
    // 延迟关闭弹窗并刷新数据
    setTimeout(() => {
      closeReasonDialog()
      fetchData() // 刷新数据
    }, 2000)
    
  } catch (error) {
    feedbackMessage.value = '提交失败，请稍后再试。'
    feedbackType.value = 'error'
    console.error('提交原因失败:', error)
  } finally {
    submittingReason.value = false
  }
}
</script>

<style scoped>
.waiting-dialog :deep(.el-dialog) {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
}

.waiting-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #2a2a2a, #333);
  border-bottom: 1px solid #444;
  padding: 20px 24px;
  border-radius: 12px 12px 0 0;
}

.waiting-dialog :deep(.el-dialog__title) {
  color: #fbbf24;
  font-size: 20px;
  font-weight: 600;
}

.waiting-dialog :deep(.el-dialog__close) {
  color: #999;
  font-size: 18px;
}

.waiting-dialog :deep(.el-dialog__close):hover {
  color: #fbbf24;
}

.waiting-dialog :deep(.el-dialog__body) {
  padding: 24px;
  background: #1a1a1a;
  max-height: 70vh;
  overflow-y: auto;
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
  background: linear-gradient(135deg, #d97706, #fbbf24);
  border-radius: 12px;
}

.icon-wrapper {
  margin-right: 20px;
}

.waiting-icon {
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

.stats-summary {
  display: flex;
  gap: 24px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
}

.summary-value {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.summary-value.ready {
  color: #10b981;
}

.no-waiting-card {
  text-align: center;
  padding: 60px 40px;
  background: linear-gradient(135deg, #065f46, #10b981);
  border-radius: 12px;
  border: 1px solid #10b981;
}

.no-waiting-icon {
  font-size: 64px;
  margin-bottom: 20px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.no-waiting-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #fff;
}

.no-waiting-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
}

.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.waiting-device-card {
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.waiting-device-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.waiting-device-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: #fbbf24;
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.device-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.status-indicator.waiting {
  background: #fbbf24;
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 12px;
  color: #fbbf24;
  font-weight: 600;
}

.device-id {
  font-size: 14px;
  font-weight: 600;
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
}

.device-details {
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.detail-label {
  font-size: 13px;
  color: #999;
  font-weight: 500;
}

.detail-value {
  font-size: 13px;
  color: #fff;
  font-weight: 500;
  max-width: 150px;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-value.completed {
  color: #10b981;
}

.detail-value.idle {
  color: #60a5fa;
}

.detail-value.waiting {
  color: #fbbf24;
}

.device-actions {
  margin-bottom: 16px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: linear-gradient(135deg, #10b981, #22d3ee);
  color: #fff;
}

.action-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.action-btn.secondary {
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  border: 1px solid #60a5fa;
}

.action-btn.secondary:hover {
  background: rgba(96, 165, 250, 0.2);
}

.btn-icon {
  font-size: 14px;
}

.last-production {
  border-top: 1px solid #333;
  padding-top: 12px;
}

.production-title {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  font-weight: 600;
}

.production-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.production-item {
  font-size: 11px;
  color: #666;
}

.waiting-summary {
  margin-top: 32px;
}

.summary-card {
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 24px;
}

.summary-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 20px 0;
  border-bottom: 1px solid #444;
  padding-bottom: 12px;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.analysis-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #1a1a1a;
  border-radius: 8px;
  border: 1px solid #333;
}

.analysis-icon {
  font-size: 24px;
  opacity: 0.8;
}

.analysis-content {
  flex: 1;
}

.analysis-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
  font-weight: 500;
}

.analysis-value {
  font-size: 14px;
  font-weight: 600;
  color: #fbbf24;
}

/* 设备详情弹窗样式 */
.device-detail-content {
  color: #333;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #e0f2fe, #b3e5fc);
  border-radius: 12px;
  border: 1px solid #81d4fa;
}

.device-icon {
  font-size: 48px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.device-title h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 700;
  color: #1976d2;
}

.device-subtitle {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.detail-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section {
  border-left: 4px solid #2196f3;
  padding-left: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1976d2;
  margin: 0 0 16px 0;
  border-bottom: 2px solid #e3f2fd;
  padding-bottom: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.info-label {
  font-weight: 600;
  color: #666;
}

.info-value {
  font-weight: 600;
  color: #333;
}

.info-value.status-waiting {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  flex: 1;
  min-width: 120px;
}

/* 填写原因弹窗样式 */
.reason-dialog-content {
  color: #333;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #e0f2fe, #b3e5fc);
  border-radius: 12px;
  border: 1px solid #81d4fa;
}

.header-icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.header-title {
  font-size: 20px;
  font-weight: 700;
  color: #1976d2;
  margin: 0 0 8px 0;
}

.header-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.form-content {
  padding: 0 4px;
}

.device-info {
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-weight: 600;
  color: #1e40af;
}

.info-value {
  font-weight: 700;
  color: #1e3a8a;
}

.reason-input-section {
  margin-bottom: 24px;
}

.input-label {
  font-weight: 600;
  color: #374151;
}

/* 原因选择样式 */
.reason-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 12px;
}

.reason-option {
  margin: 0 !important;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  transition: all 0.3s ease;
  cursor: pointer;
}

.reason-option:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.reason-option.is-checked {
  background: #dbeafe;
  border-color: #3b82f6;
  color: #1e40af;
}

.other-reason-input {
  margin-top: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.feedback-section {
  margin-bottom: 16px;
}

.feedback-content {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.dialog-actions {
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}
</style>