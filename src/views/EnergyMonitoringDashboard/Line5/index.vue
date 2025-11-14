<template>
  <div class="energy-trend-container ml-4 mr-4">
    <!-- 大标题 -->
    <div class="main-header">
      <h1 class="main-title text-xl">近六周气水电能耗趋势</h1>
      <div class="data-time">
        数据时间：{{ new Date().toLocaleString() }}
      </div>
    </div>
    
    <!-- 三个柱状图区域 -->
    <div class="charts-container">
      <!-- 气能监测 -->
      <EnergyChart
        title="气能"
        :data="gasWaterData.gas"
        :week-labels="weekLabels"
        color="#00d4ff"
        unit="m³"
        chart-type="weekly"
        :standard-value="635"
      />

      <!-- 水能监测 -->
      <EnergyChart
        title="水能"
        :data="gasWaterData.water"
        :week-labels="weekLabels"
        color="#00d4ff"
        unit="吨"
        chart-type="weekly"
        :standard-value="600"
      />

      <!-- 电能监测 -->
      <EnergyChart
        title="电能"
        :data="electricData"
        :week-labels="weekLabels"
        color="#00d4ff"
        unit="kWh"
        chart-type="weekly"
        :standard-value="48000"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSixWeekGasWater, getSixWeekElectric } from '@/api/enery'
import EnergyChart from './components/EnergyChart.vue'
import type { SixWeekGasWaterItem, SixWeekElectricItem } from '@/api/enery'

// 气水数据
const gasWaterData = ref({
  gas: {
    weeklyIncrement: [] as number[]  // 每周气能增量
  },
  water: {
    weeklyIncrement: [] as number[]  // 每周水能增量
  }
})

// 电能数据
const electricData = ref({
  weeklyIncrement: [] as number[]  // 每周电能增量
})

// 周标签
const weekLabels = ref<string[]>([])

// 获取数据
const fetchData = async () => {
  try {
    // 获取气能数据 (气参数: 000025061803)
    const gasData = await getSixWeekGasWater('000025061803')
    if (gasData && gasData.data) {
      console.log('气能数据:', gasData.data)
      processGasWaterData(gasData.data, 'gas')
    }
    
    // 获取水能数据 (水参数: 82522504270042)
    const waterData = await getSixWeekGasWater('82522504270042')
    if (waterData && waterData.data) {
      console.log('水能数据:', waterData.data)
      processGasWaterData(waterData.data, 'water')
    }

    // 获取电能数据
    const electricDataResponse = await getSixWeekElectric()
    if (electricDataResponse && electricDataResponse.data) {
      console.log('电能数据:', electricDataResponse.data)
      processElectricData(electricDataResponse.data)
    }
  } catch (error) {
    console.error('获取能耗数据失败:', error)
  }
}

// 处理气水数据
const processGasWaterData = (data: SixWeekGasWaterItem[], type: 'gas' | 'water') => {
  if (data && data.length > 0) {
    // 按周数排序
    const sortedData = data.sort((a, b) => a.week_num - b.week_num)
    
    // 提取周标签和增量数据
    const labels = sortedData.map(item => `第${item.week_num}周`)
    const increments = sortedData.map(item => item.weekly_increment)
    
    // 更新周标签（只需要设置一次）
    if (weekLabels.value.length === 0) {
      weekLabels.value = labels
    }
    
    // 更新对应类型的数据
    gasWaterData.value[type].weeklyIncrement = increments
    
    console.log(`${type}数据处理完成:`, {
      labels,
      increments
    })
  }
}

// 处理电能数据
const processElectricData = (data: SixWeekElectricItem[]) => {
  if (data && data.length > 0) {
    // 按周数排序
    const sortedData = data.sort((a, b) => a.week_num - b.week_num)
    
    // 提取周标签和增量数据
    const labels = sortedData.map(item => `第${item.week_num}周`)
    const increments = sortedData.map(item => item.weekly_increment)
    
    // 更新周标签（如果还没有设置）
    if (weekLabels.value.length === 0) {
      weekLabels.value = labels
    }
    
    // 更新电能数据
    electricData.value.weeklyIncrement = increments
    
    console.log('电能数据处理完成:', {
      labels,
      increments
    })
  }
}

onMounted(async () => {
  await fetchData()
})
</script>

<style scoped>
.energy-trend-container {
  /* padding: 15px; */
  background: linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(26,79,172,0.7) 100%);
  max-height: 28vh;
  color: #fff;
}

.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 16px;
  border: 1px solid rgba(0, 123, 255, 0.3);
  backdrop-filter: blur(10px);
}

.main-title {
  font-weight: 400;
  color: #01d7ed;
  /* margin: 0 0 15px 0; */
  text-shadow: 0 0 20px rgba(0, 123, 255, 0.5);
  letter-spacing: 2px;
}

.data-time {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
}

.charts-container {
  display: flex;
  gap: 15px;
  justify-content: space-between;
  align-items: stretch;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .charts-container {
    flex-direction: column;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .energy-trend-container {
    padding: 15px;
  }
  
  .main-title {
    font-size: 24px;
  }
  
  .charts-container {
    gap: 20px;
  }
}
</style>