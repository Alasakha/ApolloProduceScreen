<template>
  <div class="line2-key-machine mt-2" style="height: 6vh; min-height: 50px;">
    <div class="grid grid-cols-6 gap-2 h-full">
      <dv-border-box-12 class="data-box">
        <Datacard title="月度目标" EnlishTitle="Target" value="85%" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box">
        <Datacard title="月度实际稼动率" EnlishTitle="MonthOperation" :value="keyMachineData.monthOperation + '%'" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box">
        <Datacard title="月度达标率" EnlishTitle="MonthRatio" :value="keyMachineData.monthRatio + '%'" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box">
        <Datacard title="今日目标" EnlishTitle="Target" value="85%" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box">
        <Datacard title="今日实际稼动率" EnlishTitle="DayOperation" :value="keyMachineData.dayOperation + '%'" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box">
        <Datacard title="今日达标率" EnlishTitle="DayRatio" :value="keyMachineData.dayRatio + '%'" />
      </dv-border-box-12>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Datacard from '@/views/Injection/views/Line2/components/Datacard.vue'
import { getKeyMachineOperation } from '@/api/getInjection'

const keyMachineData = ref({
  monthOperation: 0,
  monthRatio: 0,
  dayOperation: 0,
  dayRatio: 0
})

const fetchData = async () => {
  try {
    const res = await getKeyMachineOperation(2)
    if (res && res.code === 200 && Array.isArray(res.data)) {
      const monthItem = res.data.find(item => item.label === 'MONTH')
      const dayItem = res.data.find(item => item.label === 'DAY')
      if (monthItem) {
        keyMachineData.value.monthOperation = Math.round(parseFloat(monthItem.operation) * 100) 
        keyMachineData.value.monthRatio = Math.round(parseFloat(monthItem.ratio) * 100) 
      }
      if (dayItem) {
        keyMachineData.value.dayOperation = Math.round(parseFloat(dayItem.operation) * 10000) / 100
        keyMachineData.value.dayRatio = Math.round(parseFloat(dayItem.ratio) * 10000) / 100
      }
    }
  } catch (error) {
    console.error('获取关键设备稼动率失败:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.data-box {
  height: 100%;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}
</style>
