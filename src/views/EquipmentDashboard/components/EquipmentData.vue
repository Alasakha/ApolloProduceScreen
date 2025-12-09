<template>
  <div class="equipment-data">
    <div class="title">设备管理数据</div>
    <div class="data-grid">
      <div class="data-item">
        <div class="item-label">正在运行(台)</div>
        <div class="item-value">{{ data.running }}</div>
      </div>
      <div class="data-item">
        <div class="item-label">待机设备(台)</div>
        <div class="item-value">{{ data.standby }}</div>
      </div>
      <div class="data-item">
        <div class="item-label">异常设备(台)</div>
        <div class="item-value">{{ data.abnormal }}</div>
      </div>
      <div class="data-item highlight">
        <div class="item-label">完成点检数(台)</div>
        <div class="item-value">{{ data.completedInspection }}</div>
      </div>
      <div class="data-item highlight">
        <div class="item-label">未点检数(台)</div>
        <div class="item-value">{{ data.uninspected }}</div>
      </div>
      <div class="data-item">
        <div class="item-label">设备总量(台)</div>
        <div class="item-value">{{ data.total }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getMachineInspection,
  getKeyMachineStatus,
  type MachineInspectionData
} from '@/api/equipment'

interface EquipmentStats {
  running: number
  standby: number
  abnormal: number
  total: number
  completedInspection: number
  uninspected: number
}

const data = ref<EquipmentStats>({
  running: 45,
  standby: 12,
  abnormal: 3,
  total: 60,
  completedInspection: 55,
  uninspected: 5
})

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const resolveCount = (fallback: number, ...candidates: unknown[]) => {
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.length
    }
    const parsed = Number(candidate)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return fallback
}

const applyInspectionData = (payload: MachineInspectionData) => {
  data.value = {
    running: resolveCount(data.value.running, payload.runningCount, payload.running),
    standby: resolveCount(data.value.standby, payload.standbyCount, payload.standby),
    abnormal: resolveCount(data.value.abnormal, payload.repairCount, payload.repair, payload.abnormal),
    total: resolveCount(data.value.total, payload.total),
    completedInspection: toNumber(payload.checkCount, data.value.completedInspection),
    uninspected: toNumber(payload.uncheckCount, data.value.uninspected)
  }
}

const fetchMachineInspectionData = async () => {
  try {
    const response = await getMachineInspection()
    if (response?.data) {
      applyInspectionData(response.data)
    }
  } catch (error) {
    console.error('获取设备点检数据失败', error)
  }
}

const fetchKeyMachineStatusData = async () => {
  try {
    const response = await getKeyMachineStatus()
    if (response?.data) {
      applyInspectionData(response.data)
    }
  } catch (error) {
    console.error('获取关键设备状态失败', error)
  }
}

onMounted(() => {
  fetchMachineInspectionData()
  fetchKeyMachineStatusData()
})
</script>

<style scoped>
.equipment-data {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.title {
  color: #00d4ff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
}

.data-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 8px;
}

.data-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px 8px;
  background: rgba(0, 150, 255, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(0, 150, 255, 0.2);
  transition: all 0.3s;
}

.data-item:hover {
  background: rgba(0, 150, 255, 0.2);
  border-color: rgba(0, 212, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 212, 255, 0.2);
}

.data-item.highlight {
  background: rgba(255, 165, 0, 0.15);
  border-color: rgba(255, 165, 0, 0.3);
}

.item-label {
  color: #ffffff;
  font-size: 13px;
  text-align: center;
  margin-bottom: 8px;
  line-height: 1.2;
}

.item-value {
  color: #00d4ff;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .title {
    font-size: 20px;
  }
  
  .item-label {
    font-size: 15px;
  }
  
  .item-value {
    font-size: 28px;
  }
}
</style>


