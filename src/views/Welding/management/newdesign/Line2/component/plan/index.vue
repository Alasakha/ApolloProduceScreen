<template>
  <div class="plan-container">
    <!-- 标题和参数卡片在同一行 -->
    <div class="header-row">
      <div class="table-title">日生产计划(总)完成情况</div>
      <div class="dashboard-cards">
        <div class="card">
          <div class="card-number">{{ dashboardData.total }}</div>
          <div class="card-label">总数</div>
        </div>
        <div class="card">
          <div class="card-number">{{ dashboardData.completed }}</div>
          <div class="card-label">完成</div>
        </div>
        <div class="card">
          <div class="card-number">{{ dashboardData.efficiency }}%</div>
          <div class="card-label">效率</div>
        </div>
      </div>
    </div>

    <!-- 数据表格 - 占满剩余高度 -->
    <div class="table-container">
      <div class="table-wrapper">
        <table class="plan-table">
          <thead>
            <tr class="table-header">
              <th>产品</th>
              <th>车型</th>
              <th>计划</th>
              <th>人效</th>
              <th>实际</th>
              <th>差额</th>
              <th>完成率</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(row, index) in tableData" 
              :key="index"
              :class="['table-row', `row-${row.color}`]"
            >
              <td>{{ row.product }}</td>
              <td>{{ row.model }}</td>
              <td>{{ row.plan }}</td>
              <td>人效</td>
              <td :class="{ 'text-red': row.actual < row.plan }">{{ row.actual }}</td>
              <td :class="{ 'text-red': row.difference > 0 }">{{ row.difference }}</td>
              <td>{{ row.completionRate }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义接口
interface DashboardData {
  total: number
  completed: number
  efficiency: number
}

interface TableRowData {
  product: string
  model: string
  plan: number
  actual: number
  difference: number
  completionRate: number
  color: 'orange' | 'blue' | 'green'
}

// 定义 props
interface Props {
  dashboardData: DashboardData
  tableData: TableRowData[]
}

// 接收父组件传入的数据
withDefaults(defineProps<Props>(), {
  dashboardData: () => ({
    total: 0,
    completed: 0,
    efficiency: 0
  }),
  tableData: () => []
})
</script>

<style scoped>
.plan-container {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 0px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.dashboard-cards {
  display: flex;
  gap: 12px;
}

.card {
    display: flex;
  background: #1565c0;
  border-radius: 6px;
  padding: 8px 12px;
  text-align: center;
  min-width: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.card-number {
  color: white;
  font-size: 18px;
  font-weight: bold;
  line-height: 1;
}

.card-label {
  color: white;
  font-size: 10px;
  margin-top: 2px;
  opacity: 0.9;
}

.table-title {
  color: #72f0f5;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(21, 101, 192, 0.3);
  flex: 1;
}

.table-container {
  width: 100%;
  flex: 1;
  overflow: hidden;
  min-height: 0;
  position: relative;
}

.table-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
}

.plan-table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  overflow: hidden;
  table-layout: fixed;
}

.table-header {
  background: #f5f5f5;
  color: #333;
  font-weight: bold;
  flex-shrink: 0;
}

.table-header th {
  padding: 8px 12px;
  text-align: center;
  border: 1px solid #ddd;
  font-size: 12px;
}

.table-row {
  color: white;
  font-weight: 500;
}

.table-row td {
  padding: 8px 12px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 12px;
}

.row-orange {
  background: #ff9800;
}

.row-blue {
  background: #2196f3;
}

.row-green {
  background: #4caf50;
}

.text-red {
  color: #f44336 !important;
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-row {
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
  
  .dashboard-cards {
    justify-content: center;
  }
  
  .card {
    min-width: 50px;
    padding: 6px 8px;
  }
  
  .card-number {
    font-size: 16px;
  }
  
  .card-label {
    font-size: 9px;
  }
  
  .table-title {
    font-size: 14px;
  }
  
  .table-header th,
  .table-row td {
    padding: 6px 8px;
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .plan-container {
    padding: 12px;
  }
  
  .dashboard-cards {
    gap: 8px;
  }
  
  .card {
    min-width: 45px;
    padding: 4px 6px;
  }
  
  .card-number {
    font-size: 14px;
  }
  
  .card-label {
    font-size: 8px;
  }
  
  .table-header th,
  .table-row td {
    padding: 4px 6px;
    font-size: 10px;
  }
}
</style>
