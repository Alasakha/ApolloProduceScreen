<template>
  <div class="personnel-info h-full flex items-center justify-around">
    <div class="metric-item">
      <span class="label">配置人数:</span>
      <span class="value">{{ personnelData.standardEmpNum }}</span>
    </div>
    <div class="metric-item">
      <span class="label">实际人数:</span>
      <span class="value">{{ personnelData.signNum }}</span>
    </div>
    <div class="metric-item">
      <span class="label">出勤人数:</span>
      <span class="value">{{ personnelData.signNum }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { eventBus } from '@/utils/eventbus'
import { getMetalworkingEfficiencyCy } from '@/api/getStampinfo'
// 这里定义类型（接口）
interface PersonnelData {
  standardEmpNum: number
  signNum: number
  attendance: number}
// 给 ref 明确类型
const personnelData = ref<PersonnelData>({
  standardEmpNum: 0,
  signNum: 0,
  attendance: 0
})

// TODO: 连接真实 API 获取人员数据
const fetchData = async () => {
  try {
    // const res = await getPersonnelInfo()
    // if (res.code === 200) {
    //   personnelData.value = res.data
    // }
    getMetalworkingEfficiencyCy().then((res) => {
      if (res.code === 200) {
        personnelData.value = res.data
      }
    })
  } catch (error) {
    console.error('获取人员信息失败:', error)
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
.personnel-info {
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

