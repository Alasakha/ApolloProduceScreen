<template>
  <div class="utilization-rate">
    <div class="title">稼动率</div>
    <div class="rate-container">
      <div v-for="item in apiData" :key="item.label" class="rate-item">
        <div class="item-header">{{ item.label === 'MONTH' ? '月度' : '日计划' }}</div>
        <div class="item-content">
          <div class="metric-row">
            <span class="metric-label">实际稼动率</span>
            <span class="metric-value" :style="{ color: getRateColor(parseFloat(item.operation) * 100) }">
              {{ (parseFloat(item.operation) * 100).toFixed(0) }}%
            </span>
          </div>
          <div class="metric-row">
            <span class="metric-label">目标稼动率</span>
            <span class="metric-value">{{ (parseFloat(item.target) * 100).toFixed(0) }}%</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">达标率</span>
            <span class="metric-value" :style="{ color: getRateColor(parseFloat(item.ratio) * 100) }">
              {{ (parseFloat(item.ratio) * 100).toFixed(0) }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getKeyMachineOperation } from '@/api/getInjection'
import { eventBus } from '@/utils/eventbus'

interface Props {
  type?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 3
})

interface MachineData {
  label: string
  target: string
  startup: string
  standard_startup: string
  operation: string
  ratio: string
}

const apiData = ref<MachineData[]>([])

const getRateColor = (rate: number): string => {
  if (rate >= 85) return '#00ff88'
  if (rate >= 70) return '#ffcc00'
  return '#ff4d4f'
}

const fetchData = async () => {
  try {
    const response = await getKeyMachineOperation(props.type)
    if (response && response.data) {
      apiData.value = response.data
    }
  } catch (err) {
    console.error('获取稼动率数据失败:', err)
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
.utilization-rate {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 4px 8px;
}

.title {
  color: #00d4ff;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 4px;
}

.rate-container {
  display: flex;
  flex: 1;
  gap: 8px;
}

.rate-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(0, 150, 255, 0.08);
  border-radius: 4px;
  padding: 4px;
}

.item-header {
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  margin-bottom: 4px;
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

.metric-row.highlight {
  background: rgba(0, 150, 255, 0.15);
  border-radius: 2px;
  margin-top: auto;
}

.metric-label {
  color: #8cc8ff;
  font-size: 10px;
}

.metric-value {
  color: #fff;
  font-size: 12px;
  font-weight: bold;
}
</style>
