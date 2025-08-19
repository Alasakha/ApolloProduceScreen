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

              </div>
            </div>
          </div>
        </div>
      </div>

  </el-dialog>
</template>

<script setup lang="ts">
import {  ref, watch } from 'vue'
import { getStampingStandb } from '@/api/getStampWeldinfo'
interface Props {
  visible: boolean
  data?: any[]
  prodLine: string
  type: number
}
const visible = defineModel<boolean>('visible', { default: false })
const showData = ref([])
const fetchData = async () => {
  const res = await getStampingStandb(props.prodLine, props.type)
  showData.value = res.data
  waitingDeviceCount.value = res.data.length
  console.log(res)
}

const waitingDeviceCount = ref(0)

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
  emit('update:visible', false)
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
</style>