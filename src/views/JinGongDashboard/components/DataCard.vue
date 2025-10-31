<template>
  <div class="data-card" :class="cardClass">
    <div class="card-header">
      <h3 class="card-title">{{ title }}</h3>
      <div class="card-icon" v-if="icon">
        <i :class="icon"></i>
      </div>
    </div>
    <div class="card-content">
      <div class="main-value">
        <span class="value">{{ formattedValue }}</span>
        <span class="unit" v-if="unit">{{ unit }}</span>
      </div>
      <div class="sub-info" v-if="subtitle || trend">
        <span class="subtitle" v-if="subtitle">{{ subtitle }}</span>
        <span class="trend" :class="trendClass" v-if="trend">
          <i :class="trendIcon"></i>
          {{ trend }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: number | string
  unit?: string
  subtitle?: string
  trend?: string
  trendType?: 'up' | 'down' | 'stable'
  icon?: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'medium',
  trendType: 'stable'
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})

const cardClass = computed(() => {
  return [
    `card-${props.type}`,
    `card-${props.size}`
  ]
})

const trendClass = computed(() => {
  return `trend-${props.trendType}`
})

const trendIcon = computed(() => {
  switch (props.trendType) {
    case 'up':
      return 'fas fa-arrow-up'
    case 'down':
      return 'fas fa-arrow-down'
    default:
      return 'fas fa-minus'
  }
})
</script>

<style scoped>
.data-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.data-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 500;
}

.card-icon {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
}

.card-content {
  text-align: center;
}

.main-value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 8px;
}

.value {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  margin-right: 4px;
}

.unit {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.sub-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.6);
}

.trend {
  display: flex;
  align-items: center;
  gap: 4px;
}

.trend-up {
  color: #4ade80;
}

.trend-down {
  color: #f87171;
}

.trend-stable {
  color: #94a3b8;
}

/* 卡片类型样式 */
.card-primary .value {
  color: #3b82f6;
}

.card-success .value {
  color: #10b981;
}

.card-warning .value {
  color: #f59e0b;
}

.card-danger .value {
  color: #ef4444;
}

.card-info .value {
  color: #06b6d4;
}

/* 卡片尺寸 */
.card-small {
  padding: 12px;
}

.card-small .value {
  font-size: 18px;
}

.card-small .card-title {
  font-size: 12px;
}

.card-large {
  padding: 20px;
}

.card-large .value {
  font-size: 32px;
}

.card-large .card-title {
  font-size: 16px;
}
</style>
