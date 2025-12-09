<template>
  <div class="equipment-card" @click="handleClick">
    <div class="card-header">
      <div class="equipment-name">{{ equipment.name }}--{{ equipment.macName }}</div>
      <div class="status-badge" :class="getStatusClass(equipment.status)">
        {{ equipment.status }}
      </div>
    </div>
    <div class="card-content">
      <div class="info-row">
        <span class="info-label">当前生产品名:</span>
        <span class="info-value">{{ equipment.workOrderName }}</span>
        <span class="info-label">工序名称:</span>
        <span class="info-value">{{ equipment.partNumber }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">今日计划数量:</span>
        <span class="info-value">{{ equipment.todayPlan }}</span>
        <span class="info-label">当前已完成数:</span>
        <span class="info-value">{{ equipment.completed }}</span>
      </div>
    </div>
    <div class="progress-section">
      <div class="progress-header">
        <span class="progress-label">完成进度</span>
        <span class="progress-percent">{{ equipment.progress }}%</span>
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: equipment.progress + '%' }"
          :class="getProgressClass(equipment.progress)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Equipment {
  name: string
  workOrderName: string
  partNumber: string
  status: string
  todayPlan: number
  completed: number
  progress: number
  macName: string
}

interface Props {
  equipment: Equipment
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [equipment: Equipment]
}>()

const handleClick = () => {
  // 点击整个卡片查看详情
  emit('click', props.equipment)
  // TODO: 打开详情弹窗
  console.log('查看设备详情:', props.equipment)
}

const getStatusClass = (status: string) => {
  if (status === '运行中') return 'status-running'
  if (status === '待机') return 'status-idle'
  if (status === '故障') return 'status-fault'
  return 'status-default'
}

const getProgressClass = (progress: number) => {
  if (progress >= 80) return 'progress-high'
  if (progress >= 50) return 'progress-medium'
  return 'progress-low'
}
</script>

<style scoped>
.equipment-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.equipment-card:hover {
  border-color: rgba(0, 212, 255, 0.6);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
  transform: translateY(-2px);
  background: rgba(0, 0, 0, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.2);
}

.equipment-name {
  color: #00d4ff;
  font-size: 13px;
  font-weight: bold;
}

.status-badge {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
}

.status-running {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
  border: 1px solid rgba(0, 255, 136, 0.5);
}

.status-idle {
  background: rgba(255, 170, 0, 0.2);
  color: #ffaa00;
  border: 1px solid rgba(255, 170, 0, 0.5);
}

.status-fault {
  background: rgba(255, 68, 68, 0.2);
  color: #ff4444;
  border: 1px solid rgba(255, 68, 68, 0.5);
}

.status-default {
  background: rgba(140, 200, 255, 0.2);
  color: #8cc8ff;
  border: 1px solid rgba(140, 200, 255, 0.5);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 4px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 16px;
  flex-wrap: nowrap;
}

.info-row > .info-label:first-of-type {
  min-width: 100px;
}

.info-row > .info-label:not(:first-of-type) {
  min-width: 50px;
  margin-left: 6px;
}

.info-label {
  color: #8cc8ff;
  font-size: 10px;
  white-space: nowrap;
  flex-shrink: 0;
}

.info-value {
  color: #fff;
  font-size: 11px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.progress-section {
  margin-bottom: 0;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.progress-label {
  color: #8cc8ff;
  font-size: 10px;
}

.progress-percent {
  color: #00d4ff;
  font-size: 11px;
  font-weight: bold;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid rgba(0, 150, 255, 0.2);
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
  background: linear-gradient(90deg, #00d4ff, #00ff88);
}

.progress-high {
  background: linear-gradient(90deg, #00ff88, #00d4ff);
}

.progress-medium {
  background: linear-gradient(90deg, #00d4ff, #ffaa00);
}

.progress-low {
  background: linear-gradient(90deg, #ffaa00, #ff4444);
}
</style>

