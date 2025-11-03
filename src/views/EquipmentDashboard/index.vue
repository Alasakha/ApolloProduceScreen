<template>
  <body>
    <Header></Header>
    
    <div class="dashboard-container">
      <!-- 顶部KPI指标区域 -->
      <div class="kpi-section">
        <KPIStats
          :pending-repair="kpiData.pendingRepair"
          :need-inspection="kpiData.needInspection"
          :waiting-parts="kpiData.waitingParts"
          :not-inspected="kpiData.notInspected"
          :completed-repair="kpiData.completedRepair"
          :inspected="kpiData.inspected"
        />
      </div>

      <!-- 底部图表区域 2x2网格 -->
      <div class="charts-section">
        <div class="chart-grid">
          <!-- 左上：设备状态实时滚动条 -->
          <div class="chart-item">
            <StatusScrollBar />
          </div>

          <!-- 右上：设备故障占比 -->
          <div class="chart-item">
            <FaultRatioChart />
          </div>

          <!-- 左下：设备故障类型统计 -->
          <div class="chart-item">
            <FaultTypeChart />
          </div>

          <!-- 右下：易发故障设备统计 -->
          <div class="chart-item">
            <FrequentFaultChart />
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from './Header/index.vue'
import KPIStats from './components/KPIStats.vue'
import StatusScrollBar from './components/StatusScrollBar.vue'
import FaultRatioChart from './components/FaultRatioChart.vue'
import FaultTypeChart from './components/FaultTypeChart.vue'
import FrequentFaultChart from './components/FrequentFaultChart.vue'

// KPI数据
const kpiData = ref({
  pendingRepair: 12,
  needInspection: 8,
  waitingParts: 5,
  notInspected: 3,
  completedRepair: 45,
  inspected: 42
})

onMounted(() => {
  // TODO: 调用API获取真实数据
  console.log('设备管理看板已加载')
})
</script>



<style scoped>
body {
  width: 100vw;
  height: 100vh;
  background: 
    linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), 
    url('@/assets/background.jpg') no-repeat center center;
  background-size: cover;
  transform-origin: center center;
  position: relative;
  transition: transform 0.3s ease-in-out;
  overflow-x: hidden;
}

.dashboard-container {
  padding: 6px;
  height: calc(100vh - 7vh);
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
}

.kpi-section {
  flex: 0 0 auto;
  width: 100%;
}

.charts-section {
  flex: 1;
  width: 100%;
  min-height: 0;
}

.chart-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 6px;
  height: 100%;
}

.chart-item {
  height: 100%;
  min-height: 0;
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .dashboard-container {
    padding: 8px;
    gap: 8px;
  }

  .chart-grid {
    gap: 8px;
  }
}
</style>