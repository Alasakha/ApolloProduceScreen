<template>
  <div class="department-performance">
    <div class="department-header">
      <h2 class="department-title">{{ departmentName }}</h2>
      <div class="department-status" :class="statusClass">
        <span class="status-dot"></span>
        {{ statusText }}
      </div>
    </div>
    
    <div class="performance-grid">
      <!-- 关键指标卡片 -->
      <div class="metrics-section">
        <div class="section-title">关键指标</div>
        <div class="metrics-grid">
          <DataCard
            v-for="metric in metrics"
            :key="metric.key"
            :title="metric.title"
            :value="metric.value"
            :unit="metric.unit"
            :subtitle="metric.subtitle"
            :trend="metric.trend"
            :trend-type="metric.trendType"
            :type="metric.type"
            :size="metric.size"
          />
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="charts-section">
        <div class="charts-grid">
          <!-- 趋势图 -->
          <div class="chart-item">
            <Chart
              title="趋势分析"
              type="line"
              :data="trendData"
              height="180px"
              :show-actions="true"
              :actions="trendActions"
              :active-action="activeTrendAction"
              @action-click="handleTrendAction"
            />
          </div>
          
          <!-- 饼图 -->
          <div class="chart-item">
            <Chart
              title="分布情况"
              type="pie"
              :data="pieData"
              height="180px"
            />
          </div>
        </div>
      </div>

      <!-- 详细数据表格 -->
      <div class="table-section">
        <div class="section-title">详细数据</div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th v-for="column in tableColumns" :key="column.key">
                  {{ column.title }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in tableData" :key="row.id">
                <td v-for="column in tableColumns" :key="column.key">
                  <span :class="getCellClass(row, column.key)">
                    {{ formatCellValue(row[column.key], column.type) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DataCard from './DataCard.vue'
import Chart from './Chart.vue'

interface Metric {
  key: string
  title: string
  value: number | string
  unit?: string
  subtitle?: string
  trend?: string
  trendType?: 'up' | 'down' | 'stable'
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'small' | 'medium' | 'large'
}

interface TableColumn {
  key: string
  title: string
  type?: 'number' | 'percentage' | 'text'
}

interface TableRow {
  id: string
  [key: string]: any
}

interface Props {
  departmentName: string
  status: 'good' | 'warning' | 'danger'
  metrics: Metric[]
  trendData: any
  pieData: any
  tableColumns: TableColumn[]
  tableData: TableRow[]
}

const props = defineProps<Props>()

const activeTrendAction = ref('day')

const trendActions = [
  { key: 'day', label: '日' },
  { key: 'week', label: '周' },
  { key: 'month', label: '月' }
]

const statusClass = computed(() => {
  return `status-${props.status}`
})

const statusText = computed(() => {
  switch (props.status) {
    case 'good':
      return '运行良好'
    case 'warning':
      return '需要注意'
    case 'danger':
      return '异常'
    default:
      return '未知'
  }
})

const handleTrendAction = (action: string) => {
  activeTrendAction.value = action
  // 这里可以触发数据更新
}

const getCellClass = (row: TableRow, key: string) => {
  const value = row[key]
  if (typeof value === 'number') {
    if (value > 0) return 'positive'
    if (value < 0) return 'negative'
  }
  return ''
}

const formatCellValue = (value: any, type?: string) => {
  if (value === null || value === undefined) return '--'
  
  switch (type) {
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : value
    case 'percentage':
      return typeof value === 'number' ? `${value.toFixed(1)}%` : value
    default:
      return value
  }
}
</script>

<style scoped>
.department-performance {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.department-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.department-title {
  font-size: 24px;
  color: #fff;
  margin: 0;
  font-weight: 600;
}

.department-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-good {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-good .status-dot {
  background: #10b981;
}

.status-warning {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-warning .status-dot {
  background: #f59e0b;
}

.status-danger {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.status-danger .status-dot {
  background: #ef4444;
}

.performance-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 20px;
}

.metrics-section {
  grid-column: 1 / -1;
}

.section-title {
  font-size: 18px;
  color: #fff;
  margin-bottom: 16px;
  font-weight: 500;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.charts-section {
  grid-column: 1 / -1;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.chart-item {
  min-height: 200px;
}

.table-section {
  grid-column: 1 / -1;
}

.table-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 12px 16px;
  text-align: left;
  font-weight: 500;
  font-size: 14px;
}

.data-table td {
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 14px;
}

.data-table tr:hover {
  background: rgba(255, 255, 255, 0.05);
}

.positive {
  color: #10b981;
}

.negative {
  color: #ef4444;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

@media (max-width: 768px) {
  .performance-grid {
    grid-template-columns: 1fr;
  }
  
  .department-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
