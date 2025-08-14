<template>
  <div class="progress-card">
    <div class="card-header">
      <h3 class="card-title">{{ title }}</h3>
      <div class="status-indicator">
        <span class="status-dot running"></span>
        <span class="status-dot maintenance"></span>
        <span class="status-dot offline"></span>
      </div>
    </div>
    
    <div class="card-content">
      <div class="progress-list">
        <div 
          v-for="(item, index) in items" 
          :key="index"
          class="progress-item"
          :class="`status-${item.status}`"
        >
          <div class="item-header">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-status" :class="`status-${item.status}`">
              {{ getStatusText(item.status) }}
            </span>
          </div>
          
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: `${item.progress}%` }"
                :class="`status-${item.status}`"
              ></div>
            </div>
            <span class="progress-text">{{ item.progress }}%</span>
          </div>
          
          <div class="item-details">
            <div class="detail-item">
              <span class="detail-label">运行时间:</span>
              <span class="detail-value">{{ getRuntime(item.status) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">效率:</span>
              <span class="detail-value">{{ getEfficiency(item.progress) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  }
})

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    running: '运行中',
    maintenance: '维护中',
    offline: '离线'
  }
  return statusMap[status] || '未知'
}

// 获取运行时间
const getRuntime = (status) => {
  if (status === 'running') {
    return '8.5h'
  } else if (status === 'maintenance') {
    return '2.0h'
  } else {
    return '0.0h'
  }
}

// 获取效率评级
const getEfficiency = (progress) => {
  if (progress >= 90) return '优秀'
  if (progress >= 70) return '良好'
  if (progress >= 50) return '一般'
  return '需改进'
}
</script>

<style scoped>
.progress-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.progress-card:hover {
  border-color: rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.status-indicator {
  display: flex;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.running {
  background: #00ff96;
  box-shadow: 0 0 8px rgba(0, 255, 150, 0.6);
}

.status-dot.maintenance {
  background: #ff9600;
  box-shadow: 0 0 8px rgba(255, 150, 0, 0.6);
}

.status-dot.offline {
  background: #ff0066;
  box-shadow: 0 0 8px rgba(255, 0, 102, 0.6);
}

.card-content {
  height: calc(100% - 60px);
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
}

.progress-item:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(5px);
}

.progress-item.status-running {
  border-color: rgba(0, 255, 150, 0.3);
}

.progress-item.status-maintenance {
  border-color: rgba(255, 150, 0, 0.3);
}

.progress-item.status-offline {
  border-color: rgba(255, 0, 102, 0.3);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.item-name {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.item-status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.item-status.status-running {
  background: rgba(0, 255, 150, 0.2);
  color: #00ff96;
}

.item-status.status-maintenance {
  background: rgba(255, 150, 0, 0.2);
  color: #ff9600;
}

.item-status.status-offline {
  background: rgba(255, 0, 102, 0.2);
  color: #ff0066;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

.progress-fill.status-running {
  background: linear-gradient(90deg, #00ff96, #00cc7a);
}

.progress-fill.status-maintenance {
  background: linear-gradient(90deg, #ff9600, #ff7a00);
}

.progress-fill.status-offline {
  background: linear-gradient(90deg, #ff0066, #cc0052);
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-text {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  min-width: 40px;
  text-align: right;
}

.item-details {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  color: rgba(255, 255, 255, 0.6);
}

.detail-value {
  color: #00ffff;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .progress-card {
    padding: 15px;
  }
  
  .card-title {
    font-size: 14px;
  }
  
  .progress-item {
    padding: 12px;
  }
  
  .item-details {
    flex-direction: column;
    gap: 8px;
  }
}
</style> 