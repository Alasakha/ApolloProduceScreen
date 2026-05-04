<template>
  <div class="machine-card">
    <div class="card-header">
      <div class="header-left">
        <span class="card-number">{{ index + 1 }}</span>
        <span class="card-title">{{ card.name }}</span>
      </div>
      <span class="card-status" :class="'status-' + card.status">
        {{ statusText[card.status] }}
      </span>
    </div>

    <div class="card-content">
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">今日计划</span>
          <span class="info-value">{{ card.todayPlan }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">已完成</span>
          <span class="info-value completed">{{ card.completed }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">计划时长</span>
          <span class="info-value">{{ card.planHours }}h</span>
        </div>
        <div class="info-item">
          <span class="info-label">已加工</span>
          <span class="info-value">{{ card.processedHours }}h</span>
        </div>
      </div>

      <div class="progress-section">
        <div class="progress-header">
          <span>完成率</span>
          <span class="progress-value">{{ card.completionRate }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: card.completionRate + '%' }"></div>
        </div>
      </div>

      <div class="current-product">
        <div class="product-label">当前生产品名/工序</div>
        <div class="product-info">
          <div class="product-name">{{ card.currentProduct }}</div>
          <div class="product-process">{{ card.currentProcess }}</div>
        </div>
      </div>

      <div class="production-detail">
        <div class="detail-row">
          <span class="detail-label">计划数:</span>
          <span class="detail-value">{{ card.planQty }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">已完成:</span>
          <span class="detail-value">{{ card.doneQty }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  card: {
    name: string
    status: 'running' | 'fault' | 'standby' | 'adjusting'
    todayPlan: number
    completed?: number
    planHours: number
    processedHours: number
    completionRate: number
    currentProduct: string
    currentProcess?: string
    planQty: number
    doneQty: number
    processName?: string
    alarm?: string
  }
  index: number
}>()

const statusText: Record<string, string> = {
  running: '运行',
  fault: '故障',
  standby: '待机',
  adjusting: '调机'
}
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
}

.card-title {
  color: #ffffff;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-status {
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
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

.card-content {
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 30, 60, 0.4);
  padding: 3px;
  border-radius: 3px;
}

.info-label {
  color: #88ccff;
  font-size: 8px;
}

.info-value {
  color: #ffffff;
  font-size: 11px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
}

.info-value.completed {
  color: #00ff88;
}

.progress-section {
  background: rgba(0, 30, 60, 0.4);
  padding: 4px;
  border-radius: 3px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
  color: #88ccff;
  font-size: 9px;
}

.progress-value {
  color: #00ff88;
  font-weight: bold;
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

.current-product {
  background: rgba(0, 50, 100, 0.3);
  padding: 4px;
  border-radius: 3px;
  border-left: 2px solid #00d4ff;
}

.product-label {
  color: #88ccff;
  font-size: 8px;
  margin-bottom: 2px;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-name {
  color: #ffffff;
  font-size: 10px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-process {
  color: #00d4ff;
  font-size: 9px;
}

.production-detail {
  display: flex;
  justify-content: space-between;
  background: rgba(0, 30, 60, 0.4);
  padding: 3px 4px;
  border-radius: 3px;
}

.detail-row {
  display: flex;
  gap: 3px;
  font-size: 9px;
}

.detail-label {
  color: #88ccff;
}

.detail-value {
  color: #ffffff;
  font-weight: bold;
}
</style>
