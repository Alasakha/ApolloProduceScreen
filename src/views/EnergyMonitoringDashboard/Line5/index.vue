<template>
  <div class="energy-trend-container ml-4 mr-4">
    <!-- 大标题 -->
    <div class="main-header">
      <h1 class="main-title text-xl">月度能耗趋势</h1>
      <div class="data-time">
        数据时间：{{ new Date().toLocaleString() }}
      </div>
    </div>
    
    <!-- 三个柱状图区域 -->
    <div class="charts-container">
      <!-- 电能检测 -->
      <EnergyChart
        title="电能"
        :data="monthlyData.electric"
        :month-labels="monthLabels"
        color="#007bff"
        unit="kWh"
      />

      <!-- 气能监测 -->
      <EnergyChart
        title="气能"
        :data="monthlyData.gas"
        :month-labels="monthLabels"
        color="#ff9f00"
        unit="m³"
      />

      <!-- 水能监测 -->
      <EnergyChart
        title="水能"
        :data="monthlyData.water"
        :month-labels="monthLabels"
        color="#00ff9f"
        unit="m³"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getElectricPowerYear, getGasPower } from '@/api/enery'
import EnergyChart from './components/EnergyChart.vue'

// 六个月的数据
const monthlyData = ref({
  electric: {
    standard: [1200, 1300, 1250, 1350, 1400, 1450], // 六个月电力标准用量
    actual: [1150, 1280, 1200, 1320, 1380, 1420]     // 六个月电力实际用量
  },
  gas: {
    standard: [800, 850, 820, 880, 900, 920],        // 六个月气标准用量
    actual: [780, 830, 800, 860, 880, 900]           // 六个月气实际用量
  },
  water: {
    standard: [600, 650, 620, 680, 700, 720],        // 六个月水标准用量
    actual: [580, 630, 600, 660, 680, 700]          // 六个月水实际用量
  }
})

// 月份标签
const monthLabels = ['1月', '2月', '3月', '4月', '5月', '6月']

// 获取数据
const fetchData = async () => {
  try {
    // 获取电能数据
    const electricData = await getElectricPowerYear()
    if (electricData && electricData.data) {
      // 处理电能数据
      console.log('电能数据:', electricData.data)
    }
    
    // 获取气能数据
    const gasData = await getGasPower('2024-01')
    if (gasData && gasData.data) {
      // 处理气能数据
      console.log('气能数据:', gasData.data)
    }
  } catch (error) {
    console.error('获取数据失败:', error)
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
  gap: 20px;
  justify-content: space-between;
  align-items: stretch;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .charts-container {
    flex-direction: column;
    gap: 30px;
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