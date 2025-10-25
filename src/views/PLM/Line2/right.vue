<template>
    <div class="w-[30%] h-[35vh]">
      <dv-border-box12 >  
        <div class="content-wrapper">
          <!-- 标题 -->
          <div class="title mb-4">今日任务完成情况</div>
          
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
              <el-button 
                type="warning" 
                class="detail-btn warning-btn" 
                @click="warningDialogVisible = true"
              >
                预警计划
              </el-button>
            </div>
          </div>
  
          <!-- Element Plus 对话框 -->
          <el-dialog
            v-model="dialogVisible"
            title="未完成任务详情"
            width="80%"
            :close-on-click-modal="false"
            class="task-dialog"
          >
            <el-table
              :data="taskList"
              style="width: 100%"
              :header-cell-style="headerStyle"
              :cell-style="cellStyle"
              height="500"
            >
              <el-table-column prop="pno" label="项目编号" width="180" />
              <el-table-column prop="projName" label="项目名称" width="200" />
              <el-table-column prop="taskName" label="任务名称" />
              <el-table-column prop="executant" label="责任人" width="120" />
              <el-table-column label="预期完成时间" width="180">
                <template #default="scope">
                  {{ formatDate(scope.row.expectTime) }}
                </template>
              </el-table-column>
              <el-table-column label="完成时间" width="180">
                <template #default="scope">
                  {{ formatDate(scope.row.scwctime) || '-' }}
                </template>
              </el-table-column>
              <el-table-column label="变更时间" width="180">
                <template #default="scope">
                  {{ formatDate(scope.row.changeTime) || '-' }}
                </template>
              </el-table-column>
              <el-table-column prop="sts" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="scope.row.sts === '未完成' ? 'danger' : 'success'">
                    {{ scope.row.sts }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>

          <!-- 预警计划对话框 -->
          <el-dialog
            v-model="warningDialogVisible"
            title="预警计划详情"
            width="80%"
            :close-on-click-modal="false"
            class="warning-dialog"
          >
            <el-table
              :data="warningList"
              style="width: 100%"
              :header-cell-style="headerStyle"
              :cell-style="cellStyle"
              height="500"
            >
              <el-table-column prop="pno" label="项目编号" width="180" />
              <el-table-column prop="projName" label="项目名称" width="200" />
              <el-table-column prop="taskName" label="任务名称" />
              <el-table-column prop="executant" label="责任人" width="120" />
              <el-table-column label="预期完成时间" width="180">
                <template #default="scope">
                  {{ formatDate(scope.row.expectTime) }}
                </template>
              </el-table-column>
              <el-table-column label="完成时间" width="180">
                <template #default="scope">
                  {{ formatDate(scope.row.scwctime) || '-' }}
                </template>
              </el-table-column>
              <el-table-column label="变更时间" width="180">
                <template #default="scope">
                  {{ formatDate(scope.row.changeTime) || '-' }}
                </template>
              </el-table-column>
              <el-table-column prop="sts" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="scope.row.sts === '未完成' ? 'danger' : 'success'">
                    {{ scope.row.sts }}
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
  import { ref, onMounted, onUnmounted } from 'vue'
  import * as echarts from 'echarts'
  import { getDailyCompleteInfo, getPlmWarnInfo } from '@/api/getPMLinfo'
  
  const chartRef = ref()
  let chart: echarts.ECharts | null = null
  const dialogVisible = ref(false)
  const warningDialogVisible = ref(false)
  const taskList = ref([])
  const warningList = ref([])
  
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
    const total = data.length
    const unfinished = data.filter(item => item.sts === '未完成').length
    
    const option = {
      color: ['#e7141b', '#4CAF50'],
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
            formatter: `{a|${unfinished}}\n{b|未完成}\n{c|${total - unfinished}}\n{d|已完成}`,
            rich: {
              a: {
                fontSize: 24,
                color: '#e7141b',
                fontWeight: 'bold'
              },
              b: {
                fontSize: 12,
                color: '#e7141b',
                padding: [2, 0]
              },
              c: {
                fontSize: 24,
                color: '#4CAF50',
                fontWeight: 'bold'
              },
              d: {
                fontSize: 12,
                color: '#4CAF50',
                padding: [2, 0]
              }
            }
          },
          data: [
            { value: unfinished, name: '未完成' },
            { value: total - unfinished, name: '已完成' }
          ]
        }
      ]
    }
    
    chart.setOption(option)
  }
  
  // 获取数据
  const fetchData = async () => {
    try {
      const res = await getDailyCompleteInfo()
      if (res.code === 200) {
        taskList.value = res.data
        initChart(res.data)
      }
    } catch (error) {
      console.error('获取数据失败：', error)
    }
  }

  // 获取预警数据
  const fetchWarningData = async () => {
    try {
      const res = await getPlmWarnInfo()
      if (res.code === 200) {
        warningList.value = res.data
      }
    } catch (error) {
      console.error('获取预警数据失败：', error)
    }
  }
  
  onMounted(() => {
    fetchData()
    fetchWarningData()
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
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .detail-btn {
    font-size: 14px;
  }

  .warning-btn {
    background: rgba(255, 193, 7, 0.1);
    border-color: rgba(255, 193, 7, 0.3);
    color: #ffc107;
  }

  .warning-btn:hover {
    background: rgba(255, 193, 7, 0.2);
    border-color: rgba(255, 193, 7, 0.5);
  }

  /* 精简对话框样式，主要保留必要的大屏风格 */
  .task-dialog .el-dialog,
  .warning-dialog .el-dialog {
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
  </style>
