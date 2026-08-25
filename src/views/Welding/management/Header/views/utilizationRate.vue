<template>
  <div class="utilization-rate">
    <div class="rate-title">
      <h3>稼动率</h3>
    </div>
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
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin: 0 8px;
  width: 100%;
}

.rate-title {
  background: #279f27;
  padding: 8px 16px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.rate-title h3 {
  margin: 0;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}

.rate-container {
  display: flex;
  flex: 1;
  gap: 12px;
  padding: 12px;
  min-height: 0;
}

.rate-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(0, 150, 255, 0.08);
  border-radius: 6px;
  padding: 10px;
  border: 1px solid rgba(0, 212, 255, 0.2);
}

.item-header {
  color: #00eaff;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
  margin-bottom: 8px;
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
}

.metric-label {
  color: #8cc8ff;
  font-size: 14px;
}

.metric-value {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}
</style>
