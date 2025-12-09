<template>
  <div class="equipment-info h-full flex items-center justify-around">
    <div class="metric-item">
      <span class="label">设备总数:</span>
      <span class="value">{{ equipmentData.total }}</span>
    </div>
    <div class="metric-item">
      <span class="label">开机数:</span>
      <span class="value">{{ equipmentData.running }}</span>
    </div>
    <div class="metric-item">
      <span class="label">开机率:</span>
      <span class="value">{{ operatingRate }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { eventBus } from '@/utils/eventbus'
import { getCyDoingMachine } from '@/api/getStampWeldinfo'

interface EquipmentOverview {
  total: number
  running: number
}

const equipmentData = ref<EquipmentOverview>({
  total: 0,
  running: 0
})

const operatingRate = computed(() => {
  if (equipmentData.value.total === 0) return 0
  return Math.round((equipmentData.value.running / equipmentData.value.total) * 100)
})

const fetchData = async () => {
  try {
    const res = await getCyDoingMachine()
    if (res.code === 200 && res.data) {
      equipmentData.value = {
        total: res.data.total ?? 0,
        running: res.data.doingCount ?? 0
      }
    }
  } catch (error) {
    console.error('获取设备信息失败:', error)
  }
}

onMounted(() => {
  fetchData()
  eventBus.on('refreshData', fetchData)
})

onBeforeUnmount(() => {
  eventBus.off('refreshData', fetchData)
})
</script>

<style scoped>
.equipment-info {
  background: rgba(0, 150, 255, 0.1);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 4px;
  padding: 0 1vw;
  height: 100%;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.label {
  color: #8cc8ff;
  font-size: 12px;
}

.value {
  color: #00d4ff;
  font-size: 16px;
  font-weight: bold;
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .label {
    font-size: 14px;
  }

  .value {
    font-size: 18px;
  }
}
</style>

