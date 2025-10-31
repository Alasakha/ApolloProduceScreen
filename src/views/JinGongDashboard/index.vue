<!-- 金工绩效看板入口文件 -->
<template>
<body>
  <Header></Header>
  
  <div class="dashboard-container">
    <!-- <div class="dashboard-title">
      <h1>金工一部/二部绩效管理看板</h1>
    </div> -->
    
    <div class="dashboard-content">
      <!-- 左侧金工一部 -->
      <div class="department-section">
        <div class="department-header">
          <h2>金工一部</h2>
        </div>
        <div class="panels-container">
          <PerformancePanel
            v-for="panel in department1Panels"
            :key="panel.id"
            :title="panel.title"
            :description="panel.description"
            :chart-title="panel.chartTitle"
            :chart-type="panel.chartType"
            :chart-data="panel.chartData"
            :chart-type-description="panel.chartTypeDescription"
          />
        </div>
      </div>
      
      <!-- 右侧金工一部 -->
      <div class="department-section">
        <div class="department-header">
          <h2>金工二部</h2>
        </div>
        <div class="panels-container">
          <PerformancePanel
            v-for="panel in department2Panels"
            :key="panel.id"
            :title="panel.title"
            :description="panel.description"
            :chart-title="panel.chartTitle"
            :chart-type="panel.chartType"
            :chart-data="panel.chartData"
            :chart-type-description="panel.chartTypeDescription"
          />
        </div>
      </div>
    </div>
  </div>
</body>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from './Header/index.vue'
import PerformancePanel from './components/PerformancePanel.vue'

// 左侧金工一部的面板数据
const department1Panels = ref([
  {
    id: '1',
    title: '工单结单率',
    description: [
      { label: 'A类:月度累计排产工单', value: '1,250' },
      { label: '累计准交工单', value: '1,180' },
      { label: '结单率', value: '94.4%' },
      { label: '常规:月度累计排产工单', value: '2,100' },
      { label: '累计准交工单', value: '1,980' },
      { label: '结单率', value: '94.3%' }
    ],
    chartTitle: '工单结单率趋势',
    chartType: 'bar' as const,
    chartData: {
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        {
          name: 'A类标准',
          type: 'bar',
          data: [95, 96, 94, 95, 96, 95],
          itemStyle: { color: '#10b981' }
        },
        {
          name: 'A类实际',
          type: 'bar',
          data: [94, 95, 93, 94, 95, 94],
          itemStyle: { color: '#3b82f6' }
        },
        {
          name: '常规标准',
          type: 'bar',
          data: [94, 95, 93, 94, 95, 94],
          itemStyle: { color: '#f59e0b' }
        },
        {
          name: '常规实际',
          type: 'bar',
          data: [93, 94, 92, 93, 94, 93],
          itemStyle: { color: '#ef4444' }
        }
      ]
    },
    chartTypeDescription: '柱状图(每月标准和实际)'
  },
  {
    id: '2',
    title: '直通率',
    description: [
      { label: 'A类:冲压月度累计合格率', value: '98.5%' },
      { label: '喷涂月度累计合格率', value: '97.2%' },
      { label: '直通率', value: '95.7%' },
      { label: '常规:冲压月度累计合格率', value: '97.8%' },
      { label: '喷涂月度累计合格率', value: '96.5%' },
      { label: '直通率', value: '94.3%' }
    ],
    chartTitle: '直通率趋势',
    chartType: 'bar' as const,
    chartData: {
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        {
          name: 'A类标准',
          type: 'bar',
          data: [96, 97, 95, 96, 97, 96],
          itemStyle: { color: '#10b981' }
        },
        {
          name: 'A类实际',
          type: 'bar',
          data: [95, 96, 94, 95, 96, 95],
          itemStyle: { color: '#3b82f6' }
        },
        {
          name: '常规标准',
          type: 'bar',
          data: [95, 96, 94, 95, 96, 95],
          itemStyle: { color: '#f59e0b' }
        },
        {
          name: '常规实际',
          type: 'bar',
          data: [94, 95, 93, 94, 95, 94],
          itemStyle: { color: '#ef4444' }
        }
      ]
    },
    chartTypeDescription: '柱状图(每月标准和实际)'
  },
  {
    id: '3',
    title: '产量计划达成率',
    description: [
      { label: 'A类:月度计划数', value: '15,000' },
      { label: 'A类:月度累计完成数', value: '14,250' },
      { label: 'A类:月度达成率', value: '95.0%' },
      { label: '常规:月度计划数', value: '12,000' },
      { label: '常规:月度累计完成数', value: '11,400' },
      { label: '常规:月度达成率', value: '95.0%' }
    ],
    chartTitle: '产量计划达成率',
    chartType: 'bar' as const,
    chartData: {
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        {
          name: '计划数',
          type: 'bar',
          data: [15000, 15000, 15000, 15000, 15000, 15000],
          itemStyle: { color: '#6b7280' }
        },
        {
          name: '完成数',
          type: 'bar',
          data: [14250, 14300, 14150, 14400, 14200, 14250],
          itemStyle: { color: '#10b981' }
        }
      ]
    },
    chartTypeDescription: '柱状图(每月计划和实际)'
  },
  {
    id: '4',
    title: '喷涂TOP质量问题',
    description: [
      { label: 'A类:总不良数', value: '125' },
      { label: 'A类:主要问题类型', value: '3种' },
      { label: 'A类:质量均租分布', value: '95.5%' },
      { label: '常规:总不良数', value: '98' },
      { label: '常规:主要问题类型', value: '3种' },
      { label: '常规:质量均租分布', value: '95.2%' }
    ],
    chartTitle: '质量问题分布',
    chartType: 'pie' as const,
    chartData: {
      series: [
        { name: '表面缺陷', value: 45, itemStyle: { color: '#ef4444' } },
        { name: '颜色偏差', value: 35, itemStyle: { color: '#f59e0b' } },
        { name: '厚度不均', value: 25, itemStyle: { color: '#3b82f6' } },
        { name: '其他', value: 20, itemStyle: { color: '#6b7280' } }
      ]
    },
    chartTypeDescription: '饼图(显示不良数和占比)'
  }
])

// 右侧金工一部的面板数据
const department2Panels = ref([
  {
    id: '1',
    title: '工单结单率',
    description: [
      { label: 'A类:月度累计排产工单', value: '1,180' },
      { label: '累计准交工单', value: '1,120' },
      { label: '结单率', value: '94.9%' },
      { label: '常规:月度累计排产工单', value: '1,950' },
      { label: '累计准交工单', value: '1,850' },
      { label: '结单率', value: '94.9%' }
    ],
    chartTitle: '工单结单率趋势',
    chartType: 'bar' as const,
    chartData: {
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        {
          name: 'A类标准',
          type: 'bar',
          data: [95, 96, 94, 95, 96, 95],
          itemStyle: { color: '#10b981' }
        },
        {
          name: 'A类实际',
          type: 'bar',
          data: [94, 95, 93, 94, 95, 94],
          itemStyle: { color: '#3b82f6' }
        },
        {
          name: '常规标准',
          type: 'bar',
          data: [94, 95, 93, 94, 95, 94],
          itemStyle: { color: '#f59e0b' }
        },
        {
          name: '常规实际',
          type: 'bar',
          data: [93, 94, 92, 93, 94, 93],
          itemStyle: { color: '#ef4444' }
        }
      ]
    },
    chartTypeDescription: '柱状图(每月标准和实际)'
  },
  {
    id: '2',
    title: '直通率',
    description: [
      { label: 'A类:喷涂月度累计检验数', value: '1,200' },
      { label: '喷涂月度累计合格数', value: '1,150' },
      { label: '直通率', value: '95.8%' },
      { label: '常规:喷涂月度累计检验数', value: '2,100' },
      { label: '喷涂月度累计合格数', value: '2,000' },
      { label: '直通率', value: '95.2%' }
    ],
    chartTitle: '直通率趋势',
    chartType: 'bar' as const,
    chartData: {
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        {
          name: 'A类标准',
          type: 'bar',
          data: [96, 97, 95, 96, 97, 96],
          itemStyle: { color: '#10b981' }
        },
        {
          name: 'A类实际',
          type: 'bar',
          data: [95, 96, 94, 95, 96, 95],
          itemStyle: { color: '#3b82f6' }
        },
        {
          name: '常规标准',
          type: 'bar',
          data: [95, 96, 94, 95, 96, 95],
          itemStyle: { color: '#f59e0b' }
        },
        {
          name: '常规实际',
          type: 'bar',
          data: [94, 95, 93, 94, 95, 94],
          itemStyle: { color: '#ef4444' }
        }
      ]
    },
    chartTypeDescription: '柱状图(每月标准和实际)'
  },
  {
    id: '3',
    title: '人效达成率',
    description: [
      { label: 'A类:月度累计排产天数', value: '22' },
      { label: 'A类:月度累计达成天数', value: '21' },
      { label: 'A类:月度达成率', value: '95.5%' },
      { label: '常规:月度累计排产天数', value: '20' },
      { label: '常规:月度累计达成天数', value: '19' },
      { label: '常规:月度达成率', value: '95.0%' }
    ],
    chartTitle: '人效达成率',
    chartType: 'bar' as const,
    chartData: {
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        {
          name: '计划天数',
          type: 'bar',
          data: [22, 22, 22, 22, 22, 22],
          itemStyle: { color: '#6b7280' }
        },
        {
          name: '达成天数',
          type: 'bar',
          data: [21, 21, 20, 22, 21, 21],
          itemStyle: { color: '#10b981' }
        }
      ]
    },
    chartTypeDescription: '柱状图(每月计划和实际)'
  },
  {
    id: '4',
    title: '喷涂TOP质量问题',
    description: [
      { label: 'A类:总不良数', value: '98' },
      { label: 'A类:主要问题类型', value: '3种' },
      { label: 'A类:质量均租分布', value: '95.2%' },
      { label: '常规:总不良数', value: '85' },
      { label: '常规:主要问题类型', value: '3种' },
      { label: '常规:质量均租分布', value: '94.8%' }
    ],
    chartTitle: '质量问题分布',
    chartType: 'pie' as const,
    chartData: {
      series: [
        { name: '表面缺陷', value: 35, itemStyle: { color: '#ef4444' } },
        { name: '颜色偏差', value: 28, itemStyle: { color: '#f59e0b' } },
        { name: '厚度不均', value: 20, itemStyle: { color: '#3b82f6' } },
        { name: '其他', value: 15, itemStyle: { color: '#6b7280' } }
      ]
    },
    chartTypeDescription: '饼图(显示不良数和占比)'
  }
])

onMounted(() => {
  console.log('金工绩效看板已加载')
})
</script>

<style scoped>
body{
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
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.dashboard-content {
  width: 100%;
  display: flex;
  gap: 6px;
  height: 100%;
}

.department-section {
  flex: 1;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 6px;
  border: 1px solid rgba(0, 150, 255, 0.3);
  height: 93%;
  overflow: hidden;
}

.department-header {
  background: rgba(0, 150, 255, 0.2);
  border-radius: 3px;
  padding: 4px 8px;
  margin-bottom: 6px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
}

.department-header h2 {
  color: #00d4ff;
  font-size: 17px;
  font-weight: bold;
  margin: 0;
}

.panels-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 6px;
  height: calc(100% - 40px);
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .department-header h2 {
    font-size: 19px;
  }
  
  .panels-container {
    gap: 8px;
  }
}
</style>