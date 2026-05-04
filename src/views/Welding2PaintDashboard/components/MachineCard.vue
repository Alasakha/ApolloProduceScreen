<template>
  <div class="machine-card" :class="{ 'detail-mode': isDetailMode }">
    <!-- 卡片头部 -->
    <div class="card-header">
      <div class="header-left">
        <span class="card-number">{{ index + 1 }}</span>
        <span class="card-title">{{ card.name }}</span>
        <span class="card-model" v-if="card.model">{{ card.model }}</span>
      </div>
      <div class="header-right">
        <span class="card-status" :class="'status-' + card.status">
          {{ statusText[card.status] }}
        </span>
      </div>
    </div>

    <!-- 简洁模式 -->
    <div v-if="!isDetailMode" class="card-simple">
      <div class="simple-row">
        <div class="simple-item">
          <span class="simple-label">计划</span>
          <span class="simple-value">{{ card.planQty }}</span>
        </div>
        <div class="simple-item">
          <span class="simple-label">完成</span>
          <span class="simple-value completed">{{ card.doneQty }}</span>
        </div>
        <div class="simple-item">
          <span class="simple-label">进度</span>
          <span class="simple-value rate">{{ card.completionRate }}%</span>
        </div>
      </div>
      <div class="simple-product">
        <span class="product-text">{{ card.currentProduct }}</span>
      </div>
      <div class="simple-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: card.completionRate + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- 详细模式 -->
    <div v-else class="card-detail">
      <!-- 基本信息 -->
      <div class="detail-row">
        <div class="detail-item">
          <span class="detail-label">今日计划</span>
          <span class="detail-value">{{ card.todayPlan }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">计划时长</span>
          <span class="detail-value">{{ card.planHours }}h</span>
        </div>
      </div>

      <!-- 当前产品 -->
      <div class="detail-section">
        <div class="section-label">当前生产品名</div>
        <div class="section-value">{{ card.currentProduct || '--' }}</div>
      </div>

      <!-- 计划与完成 -->
      <div class="detail-row">
        <div class="detail-item">
          <span class="detail-label">计划数</span>
          <span class="detail-value">{{ card.planQty }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">已完成数</span>
          <span class="detail-value completed">{{ card.doneQty }}</span>
        </div>
      </div>

      <!-- 温度信息 -->
      <div class="detail-row">
        <div class="detail-item">
          <span class="detail-label">标准温度</span>
          <span class="detail-value">{{ card.standardTemp }}°C</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">实际温度</span>
          <span class="detail-value" :class="{ 'temp-warning': isTempWarning }">
            {{ card.actualTemp }}°C
          </span>
        </div>
      </div>

      <!-- 完成率进度条 -->
      <div class="detail-section progress-section">
        <div class="progress-header">
          <span class="section-label">完成率</span>
          <span class="progress-value">{{ card.completionRate }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: card.completionRate + '%' }"></div>
        </div>
      </div>

      <!-- 时间和稼动率 -->
      <div class="detail-row">
        <div class="detail-item">
          <span class="detail-label">已加工</span>
          <span class="detail-value">{{ card.processedHours }}h</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">稼动率</span>
          <span class="detail-value highlight">{{ card.activationRate }}%</span>
        </div>
      </div>

      <!-- 工序名称 -->
      <div class="detail-section">
        <div class="section-label">工序名称</div>
        <div class="section-value process">{{ card.processName || '--' }}</div>
      </div>

      <!-- 超差报警 -->
      <div v-if="card.alarm" class="alarm-section">
        <span class="alarm-icon">⚠</span>
        <span class="alarm-text">{{ card.alarm }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface MachineCard {
  name: string
  model?: string
  status: 'running' | 'fault' | 'standby' | 'adjusting'
  todayPlan: number
  planHours: number
  currentProduct?: string
  planQty: number
  doneQty: number
  standardTemp: number
  actualTemp: number
  completionRate: number
  processedHours: number
  activationRate: number
  processName?: string
  alarm?: string
}

const props = defineProps<{
  card: MachineCard
  index: number
  isDetailMode: boolean
}>()

const statusText: Record<string, string> = {
  running: '运行',
  fault: '故障',
  standby: '待机',
  adjusting: '调机'
}

const isTempWarning = computed(() => {
  return props.card.actualTemp > props.card.standardTemp + 5 || 
         props.card.actualTemp < props.card.standardTemp - 5
})
</script>

<style scoped>
.machine-card {
  min-width: 180px;
  max-width: 180px;
  background: rgba(0, 50, 100, 0.4);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.machine-card.detail-mode {
  min-width: 220px;
  max-width: 220px;
}

/* 头部样式 */
.card-header {
  background: rgba(0, 100, 150, 0.3);
  padding: 6px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 150, 255, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.card-number {
  background: #00d4ff;
  color: #0a1628;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  flex-shrink: 0;
}

.card-title {
  color: #ffffff;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-model {
  color: #88ccff;
  font-size: 8px;
  background: rgba(0, 150, 255, 0.2);
  padding: 1px 3px;
  border-radius: 2px;
  flex-shrink: 0;
}

.card-status {
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
  flex-shrink: 0;
}

.status-running {
  background: rgba(0, 200, 100, 0.3);
  color: #00ff88;
  border: 1px solid rgba(0, 200, 100, 0.5);
}

.status-fault {
  background: rgba(200, 50, 50, 0.3);
  color: #ff6b6b;
  border: 1px solid rgba(200, 50, 50, 0.5);
}

.status-standby {
  background: rgba(100, 100, 100, 0.3);
  color: #88ccff;
  border: 1px solid rgba(100, 100, 100, 0.5);
}

.status-adjusting {
  background: rgba(200, 150, 50, 0.3);
  color: #ffd700;
  border: 1px solid rgba(200, 150, 50, 0.5);
}

/* 简洁模式 */
.card-simple {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.simple-row {
  display: flex;
  gap: 4px;
}

.simple-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 30, 60, 0.4);
  padding: 4px;
  border-radius: 3px;
}

.simple-label {
  color: #88ccff;
  font-size: 8px;
}

.simple-value {
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
}

.simple-value.completed {
  color: #00ff88;
}

.simple-value.rate {
  color: #ffd700;
}

.simple-product {
  background: rgba(0, 50, 100, 0.3);
  padding: 4px 6px;
  border-radius: 3px;
  border-left: 2px solid #00d4ff;
}

.product-text {
  color: #ffffff;
  font-size: 10px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.simple-progress {
  padding: 0 4px;
}

.progress-bar {
  height: 6px;
  background: rgba(0, 50, 100, 0.5);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff 0%, #00ff88 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* 详细模式 */
.card-detail {
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-row {
  display: flex;
  gap: 4px;
}

.detail-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 30, 60, 0.4);
  padding: 3px;
  border-radius: 3px;
}

.detail-label {
  color: #88ccff;
  font-size: 8px;
}

.detail-value {
  color: #ffffff;
  font-size: 11px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
}

.detail-value.completed {
  color: #00ff88;
}

.detail-value.highlight {
  color: #ffd700;
}

.detail-value.temp-warning {
  color: #ff6b6b;
  animation: blink 1s infinite;
}

@keyframes blink {
  50% { opacity: 0.5; }
}

.detail-section {
  background: rgba(0, 50, 100, 0.3);
  padding: 4px 6px;
  border-radius: 3px;
}

.section-label {
  color: #88ccff;
  font-size: 8px;
  margin-bottom: 2px;
}

.section-value {
  color: #ffffff;
  font-size: 10px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.section-value.process {
  color: #00d4ff;
}

.progress-section {
  margin: 2px 0;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.progress-value {
  color: #00ff88;
  font-size: 11px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
}

.alarm-section {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(200, 50, 50, 0.3);
  border: 1px solid rgba(200, 50, 50, 0.5);
  border-radius: 3px;
  padding: 3px 4px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.alarm-icon {
  color: #ff6b6b;
  font-size: 10px;
}

.alarm-text {
  color: #ff6b6b;
  font-size: 8px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
