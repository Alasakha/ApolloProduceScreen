<template>
  <div class="progress-bar-card">
    <div class="card-header">
      <h4 class="card-title">{{ title }}</h4>
      <div class="progress-value">{{ progress }}%</div>
    </div>
    
    <div class="progress-container">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${progress}%` }"
          :class="`color-${color}`"
        >
          <div class="progress-glow"></div>
        </div>
      </div>
      
      <div class="progress-labels">
        <span class="label-start">0%</span>
        <span class="label-end">100%</span>
      </div>
    </div>
    
    <div class="card-footer">
      <div class="status-indicator" :class="`status-${getStatusClass()}`">
        <span class="status-icon">{{ getStatusIcon() }}</span>
        <span class="status-text">{{ getStatusText() }}</span>
      </div>
      
      <div class="trend-indicator" :class="getTrendClass()">
        <span class="trend-icon">{{ getTrendIcon() }}</span>
        <span class="trend-value">{{ getTrendValue() }}</span>
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
  progress: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'info', 'danger'].includes(value)
  }
})

// 获取状态等级
const getStatusClass = () => {
  if (props.progress >= 90) return 'excellent'
  if (props.progress >= 70) return 'good'
  if (props.progress >= 50) return 'normal'
  return 'poor'
}

// 获取状态图标
const getStatusIcon = () => {
  const status = getStatusClass()
  const iconMap = {
    excellent: '🌟',
    good: '✅',
    normal: '⚠️',
    poor: '❌'
  }
  return iconMap[status]
}

// 获取状态文本
const getStatusText = () => {
  const status = getStatusClass()
  const textMap = {
    excellent: '优秀',
    good: '良好',
    normal: '一般',
    poor: '需改进'
  }
  return textMap[status]
}

// 获取趋势等级
const getTrendClass = () => {
  // 模拟趋势数据，实际项目中可以从props传入
  const trend = Math.random() > 0.5 ? 'up' : 'down'
  return trend
}

// 获取趋势图标
const getTrendIcon = () => {
  return getTrendClass() === 'up' ? '📈' : '📉'
}

// 获取趋势值
const getTrendValue = () => {
  const trend = getTrendClass()
  const value = Math.floor(Math.random() * 10) + 1
  return trend === 'up' ? `+${value}%` : `-${value}%`
}
</script>

<style scoped>
.progress-bar-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.progress-bar-card:hover {
  border-color: rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.progress-value {
  color: #00ffff;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.progress-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.progress-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.progress-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

.progress-glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6));
  filter: blur(2px);
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 颜色主题 */
.progress-fill.color-primary {
  background: linear-gradient(90deg, #0096ff, #00ffff);
}

.progress-fill.color-success {
  background: linear-gradient(90deg, #00ff96, #00cc7a);
}

.progress-fill.color-warning {
  background: linear-gradient(90deg, #ff9600, #ffcc00);
}

.progress-fill.color-info {
  background: linear-gradient(90deg, #0096ff, #00ffff);
}

.progress-fill.color-danger {
  background: linear-gradient(90deg, #ff0066, #ff3366);
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.status-indicator.status-excellent {
  color: #00ff96;
}

.status-indicator.status-good {
  color: #00cc7a;
}

.status-indicator.status-normal {
  color: #ff9600;
}

.status-indicator.status-poor {
  color: #ff0066;
}

.status-icon {
  font-size: 14px;
}

.status-text {
  font-weight: 500;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.trend-indicator.trend-up {
  background: rgba(0, 255, 150, 0.2);
  color: #00ff96;
}

.trend-indicator.trend-down {
  background: rgba(255, 0, 102, 0.2);
  color: #ff0066;
}

.trend-icon {
  font-size: 12px;
}

.trend-value {
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .progress-bar-card {
    padding: 15px;
  }
  
  .card-title {
    font-size: 13px;
  }
  
  .progress-value {
    font-size: 16px;
  }
  
  .progress-bar {
    height: 10px;
  }
  
  .card-footer {
    margin-top: 15px;
    padding-top: 12px;
  }
}

/* 动画效果 */
.progress-bar-card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 悬停时的光效 */
.progress-bar-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), transparent);
  transition: left 0.6s;
}

.progress-bar-card:hover::before {
  left: 100%;
}
</style> 