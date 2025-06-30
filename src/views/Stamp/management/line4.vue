<template>
  <div class="line4-container">
    <div class="grid grid-cols-2 gap-4">
      <!-- 左侧设备信息 -->
      <dv-border-box-12 class="data-box">
        <div class="box-content flex justify-around">
          <div class="equipment-info">
            <div class="info-title">设备总数</div>
            <div class="info-value">{{ equipmentData.total }}</div>
          </div>
          <div class="equipment-info">
            <div class="info-title">已点检数</div>
            <div class="info-value">{{ equipmentData.checked }}</div>
          </div>
          <div class="equipment-info">
            <div class="info-title">点检率</div>    
            <div class="info-value">{{ equipmentData.rate }}%</div>
          </div>
        </div>
      </dv-border-box-12>

      <!-- 右侧生产异常饼图 -->
      <dv-border-box-12 class="data-box">
        <div class="box-content">
          <div class="info-title">生产异常饼图</div>
          <div class="chart-container" v-if="hasAbnormalData">
            <div ref="abnormalPieRef" class="chart"></div>
          </div>
          <div v-else class="no-data">
            暂无数据
          </div>
        </div>
      </dv-border-box-12>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getEquipmentInfo, getAbnormalPieChart, type EquipmentInfo, type AbnormalPieChartData } from '@/api/getStampinfo'
import { useRoute } from 'vue-router'
import { eventBus } from '@/utils/eventbus'
import { useEcharts } from '@/utils/useEcharts'
import * as echarts from 'echarts';

const route = useRoute()
const prodLine = route.query.prodLine as string

const equipmentData = ref<EquipmentInfo>({
  total: 0,
  rate: 0,
  checked: 0
})

const abnormalData = ref<AbnormalPieChartData[]>([])
const hasAbnormalData = ref(false)
const abnormalPieRef = ref(null)
const pieChart = useEcharts(abnormalPieRef)

const fetchEquipmentData = async () => {
  try {
    const res = await getEquipmentInfo(prodLine)
    if (res.code === 200) {
      equipmentData.value = res.data
    }
  } catch (error) {
    console.error('获取设备数据失败:', error)
  }
}

const fetchAbnormalData = async () => {
  try {
    const res = await getAbnormalPieChart(prodLine)
    if (res.code === 200) {
      abnormalData.value = res.data
      hasAbnormalData.value = abnormalData.value && abnormalData.value.length > 0
      if (hasAbnormalData.value) {
        initPieChart()
      }
    }
  } catch (error) {
    console.error('获取生产异常数据失败:', error)
    hasAbnormalData.value = false
  }
}

const initPieChart = () => {
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        color: '#fff',
        formatter: '{b}\n{d}%'
      },
      data: abnormalData.value.map(item => ({
        name: item.name,
        value: item.value,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 1, color: '#188df0' }
          ])
        }
      }))
    }]
  }
  
  pieChart.initChart()
  pieChart.setOption(option)
}

// 刷新数据
const refreshData = () => {
  fetchEquipmentData()
  fetchAbnormalData()
}

onMounted(() => {
  refreshData()
  // 订阅刷新事件
  eventBus.on('refreshData', refreshData)
})
</script>

<style scoped>
.line4-container {
  padding: 0.5rem;
}

.data-box {
  height: 15vh;
  padding: 1rem;
}

.box-content {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.equipment-info {
  text-align: center;
  padding: 0 1rem;
}

.info-title {
  font-size: 1.1rem;
  color: #00eaff;
  margin-bottom: 0.5rem;
  text-align: center;
}

.info-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
}

.chart-container {
  flex: 1;
  width: 100%;
  height: calc(100% - 2rem);
}

.chart {
  width: 100%;
  height: 100%;
}

.no-data {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #4CAF50;
  font-size: 1.2rem;
}
</style> 