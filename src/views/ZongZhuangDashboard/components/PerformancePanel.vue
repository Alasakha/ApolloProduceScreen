<template>
  <div class="performance-panel">
    <div class="panel-header">
      <h3 class="panel-title">{{ title }}</h3>
    </div>
    <div class="panel-content">
      <!-- 普通模式：显示数据区域和图表 -->
      <template v-if="!isTopQualityMode">
        <!-- A类数据区域 -->
        <div class="data-section class-a-data">
          <div class="data-category">
            <h4 class="category-title">A类</h4>
            <div class="data-items">
              <div v-for="(item, index) in description.slice(0, 3)" :key="index" class="data-item">
                <span class="item-label">{{ item.label }}:</span>
                <span class="item-value">{{ item.value }}</span>
              </div>
            </div>
          </div>
          <div v-if="!hideRegular" class="data-category">
            <h4 class="category-title">常规</h4>
            <div class="data-items">
              <div v-for="(item, index) in description.slice(3)" :key="index" class="data-item">
                <span class="item-label">{{ item.label }}:</span>
                <span class="item-value">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 图表区域 -->
        <div class="chart-section" v-if="!isDualPieChart">
          <Chart
            :title="chartTitle"
            :type="chartType"
            :data="chartData"
            height="100%"
            :show-actions="false"
          />
        </div>
        
        <!-- 双饼图区域 -->
        <div class="dual-chart-section" v-if="isDualPieChart">
          <div class="pie-chart-item">
            <Chart
              :title="chartTitle"
              :type="chartType"
              :data="chartData"
              height="100%"
              :show-actions="false"
            />
          </div>
          <div class="pie-chart-item">
            <Chart
              :title="secondChartTitle"
              :type="secondChartType"
              :data="secondChartData"
              height="100%"
              :show-actions="false"
            />
          </div>
        </div>
      </template>
      
      <!-- TOP质量问题模式：只显示双饼图 -->
      <template v-else>
        <div class="top-quality-charts">
          <div class="pie-chart-item">
            <Chart
              :title="chartTitle"
              :type="chartType"
              :data="chartData"
              height="100%"
              :show-actions="false"
            />
          </div>
          <div class="pie-chart-item">
            <Chart
              :title="secondChartTitle"
              :type="secondChartType"
              :data="secondChartData"
              height="100%"
              :show-actions="false"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from './Chart.vue'

interface DescriptionItem {
  label: string
  value: string
}

interface Props {
  title: string
  description: DescriptionItem[]
  chartTitle: string
  chartType: 'line' | 'bar' | 'pie' | 'gauge'
  chartData: any
  chartTypeDescription: string
  chartHeight?: string
  // 双饼图相关props
  isDualPieChart?: boolean
  secondChartTitle?: string
  secondChartType?: 'line' | 'bar' | 'pie' | 'gauge'
  secondChartData?: any
  // TOP质量问题模式
  isTopQualityMode?: boolean
  // 隐藏常规部分
  hideRegular?: boolean
}

withDefaults(defineProps<Props>(), {
  chartHeight: '200px',
  isDualPieChart: false,
  secondChartTitle: '',
  secondChartType: 'pie' as const,
  secondChartData: () => ({}),
  isTopQualityMode: false,
  hideRegular: false
})
</script>

<style scoped>
.performance-panel {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  padding: 4px;
  border: 1px solid rgba(0, 150, 255, 0.2);
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  margin-bottom: 4px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 2px;
}

.panel-title {
  font-size: 13px;
  color: #00d4ff;
  margin: 0;
  font-weight: bold;
  text-align: center;
}

.panel-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  height: 100%;
}

/* A类数据区域 */
.data-section {
  display: flex;
  gap: 16px;
  flex: 0 0 auto;
  margin-bottom: 12px;
  min-height: 120px;
}

.data-category {
  flex: 1;
  background: rgba(0, 150, 255, 0.1);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 6px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.data-section:has(.data-category:only-child) .data-category {
  max-width: 100%;
}

.category-title {
  color: #00d4ff;
  font-size: 14px;
  font-weight: bold;
  margin: 0 0 10px 0;
  text-align: center;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 6px;
}

.data-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  min-height: 20px;
}

.item-label {
  color: #8cc8ff;
  font-size: 12px;
  flex: 1;
  text-align: left;
}

.item-value {
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  flex: 0 0 auto;
  margin-left: 8px;
}

/* 图表区域 */
.chart-section {
  flex: 1;
  min-height: 0;
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 150, 255, 0.2);
  border-radius: 4px;
  padding: 4px;
  display: flex;
  flex-direction: column;
}

/* 双饼图区域 */
.dual-chart-section {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 4px;
  height: 100%;
}

/* TOP质量问题模式：全屏双饼图 */
.top-quality-charts {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 6px;
  height: 100%;
}

.pie-chart-item {
  flex: 1;
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 150, 255, 0.2);
  border-radius: 4px;
  padding: 2px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}


/* 大屏优化 */
@media (min-width: 1920px) {
  .panel-title {
    font-size: 16px;
  }
  
  .category-title {
    font-size: 16px;
  }
  
  .item-label,
  .item-value {
    font-size: 14px;
  }
  
  .data-section {
    gap: 20px;
    min-height: 140px;
  }
  
  .chart-section {
    min-height: 0;
  }
}
</style>
