<template>
  <body>
    <Header></Header>
    
    <div class="dashboard-container">
      <div class="dashboard-content">
        <!-- 第一列 -->
        <div class="column-left">
          <!-- 设备管理数据 -->
          <div class="section-top">
            <EquipmentData />
          </div>
          <!-- 关键设备稼动率 -->
          <div class="section-middle">
            <EquipmentUtilizationRate @open-charts-dialog="openChartsDialog" />
          </div>
          <!-- 易发生故障设备统计 -->
          <div class="section-bottom">
            <FaultTrendChart />
          </div>
        </div>

        <!-- 第二列 -->
        <div class="column-middle">
          <!-- 设备信息展示 -->
          <div class="section-top">
            <EquipmentInfo :selected-equipment="selectedEquipment" />
          </div>
          <!-- 设备图示 -->
          <div class="section-bottom">
            <EquipmentGallery @equipment-select="handleEquipmentSelect" />
          </div>
        </div>

        <!-- 第三列 -->
        <div class="column-right">
          <!-- 关键设备OEE监控 -->
          <div class="section-top">
            <OEEMonitor />
          </div>
          <!-- 关键设备OEE状况滚动 -->
          <div class="section-middle">
            <OEEScroll />
          </div>
          <!-- 设备异常故障排行 -->
          <div class="section-bottom">
            <FaultRanking />
          </div>
        </div>
      </div>
    </div>

    <!-- 各车间稼动率图表对话框 -->
    <EquipmentUtilizationRateCharts
      v-model:visible="chartsDialogVisible"
      :initial-workshop="chartsInitialWorkshop"
      @close="closeChartsDialog"
    />
  </body>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from './Header/index.vue'
import EquipmentData from './components/EquipmentData.vue'
import EquipmentUtilizationRate from './components/EquipmentUtilizationRate.vue'
import EquipmentUtilizationRateCharts from './components/EquipmentUtilizationRateCharts.vue'
import FaultTrendChart from './components/FaultTrendChart.vue'
import EquipmentInfo from './components/EquipmentInfo.vue'
import EquipmentGallery from './components/EquipmentGallery.vue'
import OEEMonitor from './components/OEEMonitor.vue'
import OEEScroll from './components/OEEScroll.vue'
import FaultRanking from './components/FaultRanking.vue'

const selectedEquipment = ref<any>(null)

// 图表对话框相关（渲染逻辑已迁移到 EquipmentUtilizationRateCharts 组件）
const chartsDialogVisible = ref(false)
const chartsInitialWorkshop = ref('all')

const openChartsDialog = (workshopCode?: string) => {
  chartsInitialWorkshop.value = workshopCode || 'all'
  chartsDialogVisible.value = true
}

const closeChartsDialog = () => {
  chartsDialogVisible.value = false
}

const handleEquipmentSelect = (equipment: any) => {
  selectedEquipment.value = equipment
}

// 过滤车间数据 等逻辑已迁移到子组件

// 提供给子组件使用的方法
const openChartsDialogFromChild = () => {
  openChartsDialog()
}

// 向外暴露方法，供子组件调用
defineExpose({
  openChartsDialog: openChartsDialogFromChild
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
  overflow: hidden;
}

.dashboard-content {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 6px;
}

.column-left,
.column-middle,
.column-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 6px;
  border: 1px solid rgba(0, 150, 255, 0.3);
}

.section-top,
.section-middle,
.section-bottom {
  flex: 1;
  min-height: 0;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  padding: 8px;
  border: 1px solid rgba(0, 150, 255, 0.2);
}

.column-left .section-top {
  flex: 0 0 33%;
}

.column-left .section-middle {
  flex: 0 0 34%;
}

.column-left .section-bottom {
  flex: 0 0 33%;
}

.column-right .section-top {
  flex: 0 0 35%;
}

.column-right .section-middle {
  flex: 0 0 30%;
}

.column-right .section-bottom {
  flex: 0 0 35%;
}

/* 图表对话框样式 */
.charts-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 500px;
  padding: 16px;
}

.workshop-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.workshop-selector .el-select .el-input__inner {
  background: rgba(0, 0, 0, 0.3);
  color: #8cc8ff;
  border-color: rgba(0, 212, 255, 0.3);
  font-size: 14px;
  height: 36px;
}

.workshop-charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  width: 100%;
}

.workshop-chart-card {
  background: rgba(0, 150, 255, 0.08);
  border: 1px solid rgba(0, 150, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 520px;
}

.workshop-title {
  color: #00d4ff;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
}

.workshop-chart {
  flex: 1;
  min-height: 420px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .dashboard-container {
    padding: 8px;
  }

  .dashboard-content {
    gap: 8px;
  }

  .column-left,
  .column-middle,
  .column-right {
    gap: 8px;
    padding: 8px;
  }
}
</style>
