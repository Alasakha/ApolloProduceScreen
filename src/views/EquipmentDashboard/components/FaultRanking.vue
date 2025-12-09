<template>
  <div class="fault-ranking">
    <div class="title">设备异常故障排行 (月份)</div>
    <div class="ranking-container">
      <div class="total-badge">
        <div class="badge-icon">⚠️</div>
        <div class="badge-text">设备异常 {{ totalFaults }}次</div>
      </div>
      <div ref="chartRef" class="chart"></div>
    </div>
    
    <!-- 明细 Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="90%"
      class="detail-dialog"
      :destroy-on-close="true"
    >
      <el-table
        v-loading="loading"
        :data="detailData"
        border
        style="width: 100%"
        max-height="60vh"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="ta001" label="设备编号" width="100" />
        <el-table-column prop="ta002" label="工单号" width="120" />
        <el-table-column prop="startTime" label="开始时间" width="160" />
        <el-table-column prop="endTime" label="结束时间" width="160" />
        <el-table-column prop="startPeopleName" label="开始人员" width="100" />
        <el-table-column prop="startRemark" label="开始备注" min-width="150" show-overflow-tooltip />
        <el-table-column prop="endPeopleName" label="结束人员" width="100" />
        <el-table-column prop="endRemark" label="结束备注" min-width="150" show-overflow-tooltip />
        <el-table-column prop="dutyDeptName" label="责任部门" width="150" />
        <el-table-column prop="udf01" label="备注" min-width="150" show-overflow-tooltip />
        <el-table-column prop="responseTime" label="响应时间" width="160" />
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <span class="total-count">共 {{ detailData.length }} 条</span>
          <el-button @click="dialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useEcharts } from '@/utils/useEcharts'
import { getMachineAbnormalPie, getMachineAbnormalDetail, type MachineAbnormalDetailItem } from '@/api/equipment'

const chartRef = ref<HTMLElement | null>(null)
const { initChart, setOption, onClick } = useEcharts(chartRef)

const totalFaults = ref(0)
const faultData = ref<any[]>([])

// Dialog 相关
const dialogVisible = ref(false)
const dialogTitle = ref('设备异常明细')
const detailData = ref<MachineAbnormalDetailItem[]>([])
const loading = ref(false)

const fetchData = async () => {
  try {
    const res = await getMachineAbnormalPie()
    if (res.code === 200 && res.data) {
      faultData.value = res.data
      // 计算总故障次数
      totalFaults.value = res.data.reduce((sum: number, item: any) => sum + (item.num || 0), 0)
    }
  } catch (error) {
    console.error('获取设备异常数据失败:', error)
  }
}

// 图表点击事件处理
const handleChartClick = (params: any) => {
  console.log('图表点击事件:', params)
  // 对于横向柱状图，需要通过 dataIndex 获取对应的 category
  let category = ''
  if (params.dataIndex !== undefined && faultData.value[params.dataIndex]) {
    category = faultData.value[params.dataIndex].category
  } else if (params.name) {
    // 备用方案：如果 params.name 存在，直接使用
    category = params.name
  }
  
  if (category) {
    openDetailDialog(category)
  }
}

// 打开明细 Dialog
const openDetailDialog = (category: string) => {
  dialogTitle.value = `${category} - 设备异常明细`
  dialogVisible.value = true
  fetchDetailData(category)
}

// 获取明细数据
const fetchDetailData = async (category: string) => {
  loading.value = true
  try {
    const res = await getMachineAbnormalDetail(category)
    if (res.code === 200 && res.data) {
      detailData.value = res.data
    } else {
      ElMessage.warning(res.message || '获取明细数据失败')
      detailData.value = []
    }
  } catch (error) {
    console.error('获取设备异常明细失败:', error)
    ElMessage.error('获取明细数据失败')
    detailData.value = []
  } finally {
    loading.value = false
  }
}

const createChartOption = (data: any[]) => {
  if (!data || data.length === 0) {
    return {}
  }
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      textStyle: {
        color: '#fff'
      },
      formatter: (params: any) => {
        const param = params[0]
        return `${param.name}<br/>故障次数: ${param.value}次`
      }
    },
    grid: {
      left: '15%',
      right: '10%',
      top: '10%',
      bottom: '10%'
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        color: '#fff',
        fontSize: 12,
        formatter: '{value}次'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: data.map(item => item.category),
      axisLabel: {
        color: '#fff',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        }
      }
    },
    series: [
      {
        type: 'bar',
        data: data.map(item => item.num),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#00d4ff' },
              { offset: 1, color: '#0066ff' }
            ]
          }
        },
        label: {
          show: true,
          position: 'right',
          color: '#fff',
          fontSize: 12,
          formatter: '{c}次'
        },
        barWidth: '50%'
      }
    ]
  }
}

// 监听数据变化，更新图表
watch(faultData, (newData) => {
  if (newData && newData.length > 0) {
    nextTick(() => {
      const option = createChartOption(newData)
      setOption(option)
      // 绑定点击事件
      onClick(handleChartClick)
    })
  }
}, { deep: true })

onMounted(async () => {
  await nextTick()
  initChart()
  await fetchData()
})
</script>

<style scoped>
.fault-ranking {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.title {
  color: #00d4ff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
}

.ranking-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.total-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 165, 0, 0.2);
  border-radius: 4px;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 165, 0, 0.3);
}

.badge-icon {
  font-size: 14px;
}

.badge-text {
  color: #ffaa00;
  font-size: 12px;
  font-weight: bold;
}

.chart {
  flex: 1;
  min-height: 0;
  width: 100%;
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .title {
    font-size: 18px;
  }
  
  .badge-text {
    font-size: 12px;
  }
  
.badge-icon {
  font-size:18px;
  }
}

/* Dialog 样式 */
.detail-dialog :deep(.el-dialog__header) {
  background: rgba(0, 212, 255, 0.1);
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
  padding: 15px 20px;
}

.detail-dialog :deep(.el-dialog__title) {
  color: #00d4ff;
  font-size: 18px;
  font-weight: bold;
}

.detail-dialog :deep(.el-dialog__body) {
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
}

.detail-dialog :deep(.el-table) {
  background: transparent;
  color: #fff;
}

.detail-dialog :deep(.el-table th) {
  background: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
  border-color: rgba(0, 212, 255, 0.3);
}

.detail-dialog :deep(.el-table td) {
  background: transparent;
  color: #fff;
  border-color: rgba(255, 255, 255, 0.1);
}

.detail-dialog :deep(.el-table tr:hover > td) {
  background: rgba(0, 212, 255, 0.1);
}

.detail-dialog :deep(.el-table--border) {
  border-color: rgba(0, 212, 255, 0.3);
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-count {
  color: #00d4ff;
  font-size: 14px;
}
</style>


