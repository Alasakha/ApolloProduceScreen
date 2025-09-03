<template>
  <div class="status-card">
    <div class="card-header">
      <h3 class="card-title">{{ title }}</h3>
      <div class="status-summary">
        <span class="summary-item">
          <span class="summary-dot online"></span>
          {{ getOnlineCount() }}在线
        </span>
        <span class="summary-item">
          <span class="summary-dot offline"></span>
          {{ getOfflineCount() }}离线
        </span>
      </div>
    </div>
    
    <div class="card-content">
      <div class="status-list">
        <div 
          v-for="(item, index) in items" 
          :key="index"
          class="status-item"
          :class="`status-${item.status}`"
        >
          <div class="status-icon">
            <div class="icon-circle" :class="`status-${item.status}`">
              <span class="icon-text">{{ getDeviceIcon(item.name) }}</span>
            </div>
          </div>
          
          <div class="status-info">
            <div class="device-name">{{ item.name }}</div>
            <div class="device-status">
              <span class="status-badge" :class="`status-${item.status}`">
                {{ getStatusText(item.status) }}
              </span>
              <span class="uptime">{{ item.uptime }}</span>
            </div>
          </div>
          
          <div class="status-actions">
            <button class="action-btn" @click="viewDetails(item)">
              <span class="btn-icon">👁️</span>
            </button>
            <button class="action-btn" @click="toggleDevice(item)">
              <span class="btn-icon">{{ getToggleIcon(item.status) }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  }
})

// 获取在线设备数量
const getOnlineCount = () => {
  return props.items.filter(item => item.status === 'online').length
}

// 获取离线设备数量
const getOfflineCount = () => {
  return props.items.filter(item => item.status === 'offline').length
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    online: '在线',
    offline: '离线',
    maintenance: '维护中'
  }
  return statusMap[status] || '未知'
}

// 获取设备图标
const getDeviceIcon = (name) => {
  if (name.includes('激光')) return '⚡'
  if (name.includes('冲压')) return '🔨'
  if (name.includes('焊接')) return '🔥'
  if (name.includes('检测')) return '🔍'
  return '⚙️'
}

// 获取切换图标
const getToggleIcon = (status) => {
  return status === 'online' ? '⏸️' : '▶️'
}

// 查看设备详情
const viewDetails = (item) => {
  console.log('查看设备详情:', item)
  // 这里可以触发事件或打开详情弹窗
}

// 切换设备状态
const toggleDevice = (item) => {
  console.log('切换设备状态:', item)
  // 这里可以触发事件或调用API
}
</script>

<style scoped>
.status-card {
  background: var(--bg-card);
  border: 1px solid var(--border-secondary);
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.status-card:hover {
  border-color: var(--border-primary);
  box-shadow: 0 0 20px var(--shadow-primary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.status-summary {
  display: flex;
  gap: 15px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 12px;
}

.summary-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.summary-dot.online {
  background: var(--success);
  box-shadow: 0 0 6px rgba(0, 204, 122, 0.6);
}

.summary-dot.offline {
  background: #ff0066;
  box-shadow: 0 0 6px rgba(255, 0, 102, 0.6);
}

.card-content {
  height: calc(100% - 60px);
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-secondary);
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
}

.status-item:hover {
  background: var(--bg-card);
  transform: translateX(5px);
}

.status-item.status-online {
  border-color: rgba(0, 204, 122, 0.3);
}

.status-item.status-offline {
  border-color: rgba(255, 0, 102, 0.3);
}

.status-item.status-maintenance {
  border-color: rgba(255, 150, 0, 0.3);
}

.status-icon {
  flex-shrink: 0;
}

.icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.icon-circle.status-online {
  background: rgba(0, 204, 122, 0.2);
  border: 2px solid var(--success);
}

.icon-circle.status-offline {
  background: rgba(255, 0, 102, 0.2);
  border: 2px solid #ff0066;
}

.icon-circle.status-maintenance {
  background: rgba(255, 150, 0, 0.2);
  border: 2px solid #ff9600;
}

.icon-text {
  font-size: 18px;
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5));
}

.status-info {
  flex: 1;
  min-width: 0;
}

.device-name {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.device-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-badge {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.status-badge.status-online {
  background: rgba(0, 204, 122, 0.2);
  color: var(--success);
}

.status-badge.status-offline {
  background: rgba(255, 0, 102, 0.2);
  color: #ff0066;
}

.status-badge.status-maintenance {
  background: rgba(255, 150, 0, 0.2);
  color: #ff9600;
}

.uptime {
  color: var(--text-muted);
  font-size: 11px;
  font-family: monospace;
}

.status-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  background: var(--border-secondary);
  border: 1px solid var(--border-secondary);
  border-radius: 6px;
  padding: 6px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: rgba(0, 212, 255, 0.2);
  border-color: var(--primary-blue);
  transform: scale(1.1);
}

.btn-icon {
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .status-card {
    padding: 15px;
  }
  
  .card-title {
    font-size: 14px;
  }
  
  .status-item {
    padding: 12px;
    gap: 12px;
  }
  
  .icon-circle {
    width: 35px;
    height: 35px;
  }
  
  .icon-text {
    font-size: 16px;
  }
  
  .status-actions {
    gap: 6px;
  }
  
  .action-btn {
    padding: 5px;
  }
}
</style> 