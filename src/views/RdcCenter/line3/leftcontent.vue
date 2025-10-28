<template>
  <div class="w-[30%] h-[30vh]">
    <dv-border-box12 >  
      <div class="content-wrapper">
        <!-- 标题 -->
        <div class="title mb-4">本月爆品上新达成情况</div>
        
        <!-- 饼图和按钮区域 -->
        <div class="chart-container">
          <div ref="chartRef" class="chart"></div>
          <div class="button-wrapper">
            <el-button 
              type="primary" 
              class="detail-btn" 
              @click="dialogVisible = true"
            >
              查看详情
            </el-button>
          </div>
        </div>

        <!-- Element Plus 对话框 -->
        <el-dialog
          v-model="dialogVisible"
          title="本月爆品上新达成情况详细"
          width="80%"
          :close-on-click-modal="false"
          class="task-dialog"
          @close="handleDialogClose"
        >
          <!-- 筛选条件 -->
          <div class="filter-wrapper">
            <el-select
              v-model="filterStatus"
              placeholder="选择完成状态"
              clearable
              class="filter-item"
              @change="handleFilterChange"
            >
              <el-option label="已完成" value="已完成" />
              <el-option label="未完成" value="未完成" />
            </el-select>
            <el-input
              v-model="filterPno"
              placeholder="输入项目编号"
              clearable
              class="filter-item"
              @input="handleFilterChange"
            />
          </div>
          
          <el-table
            :data="filteredTaskList"
            style="width: 100%"
            :header-cell-style="headerStyle"
            :cell-style="cellStyle"
            height="500"
          >
            <el-table-column prop="pno" label="项目编号" width="180" />
            
            <el-table-column prop="projname" label="项目名称" width="200" />
            <el-table-column prop="taskname" label="任务名称" />
            <el-table-column prop="scwctime" label="计划完成时间" width="180">
              <template #default="scope">
                {{ formatDate(scope.row.scwctime) }}
              </template>
            </el-table-column>
            <el-table-column prop="scwctime" label="变更完成时间" width="180">
              <template #default="scope">
                {{ formatDate(scope.row.scwctime) }}
              </template>
            </el-table-column>
            <el-table-column prop="completetime" label="实际完成时间" width="180">
              <template #default="scope">
                {{ formatDate(scope.row.completetime) }}
              </template>
            </el-table-column>
            <el-table-column prop="sts" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.state !== 'C' ? 'danger' : 'success'">
                  {{ scope.row.state === 'C' ? '已完成' : '未完成' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </div>
    </dv-border-box12>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getYsComplete } from '@/api/getPmcinfo'

const chartRef = ref()
let chart: echarts.ECharts | null = null
const dialogVisible = ref(false)
const taskList = ref([])

// 筛选条件
const filterStatus = ref('')
const filterPno = ref('')

// 筛选后的数据
const filteredTaskList = computed(() => {
  let result = taskList.value
  
  // 按状态筛选
  if (filterStatus.value) {
    if (filterStatus.value === '已完成') {
      result = result.filter(item => item.state === 'C')
    } else if (filterStatus.value === '未完成') {
      result = result.filter(item => item.state !== 'C')
    }
  }
  
  // 按项目编号筛选
  if (filterPno.value) {
    result = result.filter(item => 
      item.pno && item.pno.includes(filterPno.value)
    )
  }
  
  return result
})

// 筛选变化处理
const handleFilterChange = () => {
  // 数据已通过computed自动更新
}

// 弹窗关闭时重置筛选
const handleDialogClose = () => {
  filterStatus.value = ''
  filterPno.value = ''
}

// 简化表格样式
const headerStyle = {
  fontSize: '16px',
  fontWeight: 'normal'
}

const cellStyle = {
  fontSize: '14px'
}

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return dateStr.split(' ')[0]
}

// 初始化图表
const initChart = (data: any[]) => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  
  // 根据state字段统计完成和未完成数量
  const completedCount = data.filter(item => item.state === 'C').length
  const uncompletedCount = data.filter(item => item.state !== 'C').length
  
  const option = {
    color: ['#4CAF50', '#e7141b'], // 已完成绿色，未完成红色
    series: [
      { 
        grid: {
          left: '3%',
          right: '4%',
          bottom: '5%',
          containLabel: true
        },
        type: 'pie',
        radius: ['60%', '80%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: `{a|${completedCount}}\n{b|已完成}\n{c|${uncompletedCount}}\n{d|未完成}`,
          rich: {
            a: {
              fontSize: 24,
              color: '#4CAF50',
              fontWeight: 'bold'
            },
            b: {
              fontSize: 12,
              color: '#4CAF50',
              padding: [2, 0]
            },
            c: {
              fontSize: 24,
              color: '#e7141b',
              fontWeight: 'bold'
            },
            d: {
              fontSize: 12,
              color: '#e7141b',
              padding: [2, 0]
            }
          }
        },
        data: [
          { value: completedCount, name: '已完成' },
          { value: uncompletedCount, name: '未完成' }
        ]
      }
    ]
  }
  
  chart.setOption(option)
}

// 获取数据
const fetchData = async () => {
  try {
    const res = await getYsComplete()
    if (res.code === 200) {
      taskList.value = res.data
      initChart(res.data)
    }
  } catch (error) {
    console.error('获取数据失败：', error)
  }
}

onMounted(() => {
  fetchData()
  window.addEventListener('resize', () => chart?.resize())
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', () => chart?.resize())
})
</script>

<style scoped>
.content-wrapper {
  width: 100%;
  height: 100%;
  padding: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 1.6rem;
  color: #00eaff;
  text-align: center;
  flex: none;
}

.chart-container {
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 0;
}

.chart {
  width: 100%;
  height: 100%;
}

.button-wrapper {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 1;
}

.detail-btn {
  font-size: 14px;
}

/* 精简对话框样式，主要保留必要的大屏风格 */
.task-dialog .el-dialog {
  border-radius: 8px;
}

/* 只保留未完成状态的红色样式 */
.task-dialog .el-tag--danger {
  background: rgba(255, 75, 75, 0.1);
  border-color: rgba(255, 75, 75, 0.3);
  color: #ff4b4b;
}

/* 保留基础的滚动条样式 */
.task-dialog .el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.task-dialog .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.3);
  border-radius: 3px;
}

.task-dialog .el-table__body-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

/* 筛选区域样式 */
.filter-wrapper {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-item {
  flex: 1;
  max-width: 300px;
}


</style>
