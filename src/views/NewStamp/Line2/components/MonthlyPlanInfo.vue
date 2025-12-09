<template>
  <div class="monthly-plan-info h-full flex items-center justify-around">
    <div class="metric-item">
      <span class="label">月度计划总数:</span>
      <span class="value">{{ planData.totalPlan }}</span>
    </div>
    <div class="metric-item">
      <span class="label">完成数:</span>
      <span class="value">{{ planData.completed }}</span>
    </div>
    <div class="metric-item">
      <span class="label">完成率:</span>
      <span class="value">{{ planData.completionRate }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { eventBus } from '@/utils/eventbus'
import { getMonthProduction } from '@/api/getStampinfo'

const planData = ref({
  totalPlan: 10000,
  completed: 8000,
  completionRate: 80
})

const fetchData = async () => {
  try {
    // TODO: 根据实际需求传入 prodLine 参数
    const res = await getMonthProduction('1001')
    if (res.code === 200 && res.data) {
      const total = res.data.pcTotal || 0
      const done = res.data.done || 0
      planData.value = {
        totalPlan: total,
        completed: done,
        completionRate: total > 0 ? Math.round((done / total) * 100) : 0
      }
    }
  } catch (error) {
    console.error('获取月度计划信息失败:', error)
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
.monthly-plan-info {
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

