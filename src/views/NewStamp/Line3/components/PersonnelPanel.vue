<template>
  <div class="personnel-panel">
    <div class="panel-title">{{ title }}</div>
    <div class="personnel-content">
      <div class="personnel-item">
        <span class="label">配置人数:</span>
        <span class="value">{{ data.configured }}</span>
      </div>
      <div class="personnel-item">
        <span class="label">现有人数:</span>
        <span class="value">{{ data.current }}</span>
      </div>
      <div class="personnel-item">
        <span class="label">白班出勤人数:</span>
        <span class="value">{{ data.dayShift }}</span>
      </div>
      <div class="personnel-item">
        <span class="label">夜班出勤人数:</span>
        <span class="value">{{ data.nightShift }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  data: {
    configured: number
    current: number
    dayShift: number
    nightShift: number
  }
}

defineProps<Props>()
</script>

<style scoped>
.personnel-panel {
  background: rgba(0, 150, 255, 0.1);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 4px;
  padding: 10px;
}

.panel-title {
  color: #00d4ff;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
}

.personnel-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.personnel-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.label {
  color: #8cc8ff;
  font-size: 12px;
  white-space: nowrap;
}

.value {
  color: #00d4ff;
  font-size: 14px;
  font-weight: bold;
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .label {
    font-size: 13px;
  }

  .value {
    font-size: 16px;
  }
}
</style>

