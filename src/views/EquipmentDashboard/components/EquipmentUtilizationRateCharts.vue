<!-- 展示关键设备稼动率(昨日) 的 dialog 图表(柱状图) -->
<template>
  <div v-if="visible" class="eu-dialog-overlay" @keydown.esc="close" tabindex="0">
    <div class="eu-dialog" role="dialog" aria-modal="true" :aria-label="title">
      <div class="eu-header">
        <span class="eu-title">{{ title }}</span>
        <button class="eu-close" @click="close" aria-label="关闭对话框">×</button>
      </div>
      <div class="eu-body">
        <!-- 内置图表内容（已迁移） -->
        <div class="charts-content">
          <div class="workshop-selector">
            <el-select
              v-model="selectedWorkshopFilter"
              placeholder="选择车间"
              size="small"
              @change="renderWorkshopCharts"
              style="width: 200px;"
            >
            <el-option label="全部车间" value="all"></el-option>
              <el-option
                v-for="workshop in availableWorkshops"
                :key="workshop"
                :label="workshopLabel(workshop)"
                :value="workshop"
              ></el-option>
            </el-select>
          </div>

          <div class="workshop-charts-grid">
            <div
              v-for="(_, workshopName) in (selectedWorkshopFilter === 'all' ? workshopData : { [selectedWorkshopFilter]: workshopData[selectedWorkshopFilter] || [] })"
              :key="workshopName"
              class="workshop-chart-card"
            >
              <div class="workshop-title">{{ workshopLabel(workshopName) }}设备稼动率</div>
              <div class="workshop-chart" :ref="el => setChartRef(el, workshopName)"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="eu-footer">
        <button class="eu-btn" @click="close">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { getMachineOee } from '@/api/equipment'
import * as echarts from 'echarts'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '各车间稼动率（昨日）' },
  initialWorkshop: { type: String, default: 'all' }
})
const emit = defineEmits(['update:visible', 'close'])

// 状态
const selectedWorkshopFilter = ref('all')
const workshopData = ref<Record<string, any[]>>({})
const availableWorkshops = ref<string[]>([])
const chartRefs = ref<Record<string, HTMLElement>>({})
const chartInstances = ref<Record<string, any>>({})
const resizeHandlers = ref<Record<string, () => void>>({})
// 车间代码到中文映射
const workshopLabelMap: Record<string, string> = {
  全部: '全部车间',
  CY: '冲压(CY)',
  HJ: '焊接(HJ)',
  JG2: '金工二部(JG2)',
  ZHS: '注塑(ZHS)'
}

const workshopLabel = (code: string) => {
  return workshopLabelMap[code] || code
}

const setChartRef = (el: any, workshopName: string) => {
  if (el && el instanceof HTMLElement) {
    chartRefs.value[workshopName] = el
  }
}

const fetchAndRender = async () => {
  const res = await getMachineOee()
  if (res && res.code === 200) {
    if (Array.isArray(res.data)) {
      workshopData.value = { 全部: res.data }
    } else if (res.data && typeof res.data === 'object') {
      workshopData.value = res.data as Record<string, any[]>
    } else {
      workshopData.value = {}
    }
  } else {
    workshopData.value = {}
  }

  const dataKeys = Object.keys(workshopData.value)
  availableWorkshops.value = dataKeys.filter(k => k !== '全部')
  // 如果父组件传入初始车间则使用之（点击卡片时会传入），否则默认为全部
  selectedWorkshopFilter.value = props.initialWorkshop || 'all'
  renderWorkshopCharts()
}

const renderWorkshopCharts = () => {
  nextTick(() => {
    const filtered = selectedWorkshopFilter.value === 'all' ? workshopData.value : { [selectedWorkshopFilter.value]: workshopData.value[selectedWorkshopFilter.value] || [] }
    Object.entries(filtered).forEach(([workshopName, devices]) => {
      const chartRef = chartRefs.value[workshopName]
      if (chartRef && Array.isArray(devices)) {
        if (chartInstances.value[workshopName]) {
          chartInstances.value[workshopName].dispose()
        }
        const chartInstance = echarts.init(chartRef)
        const names = devices.map(d => d.mac_name || d.mac_no || '未知设备')
        const normalizeOperation = (op: any) => {
          if (typeof op !== 'number' || Number.isNaN(op)) return NaN
          // Heuristic:
          // - if op <= 1.5 treat as fraction (e.g. 1.15 -> 115%)
          // - if op > 1.5 and <= 100 assume already percentage (e.g. 58 -> 58%)
          // - otherwise fallback to op*100
          // if (op <= 1.5) return op * 100
          // if (op > 1.5 && op <= 100) return op
          return op * 100
        }
        const rates = devices.map(d => normalizeOperation(d.operation))
        const option = {
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#00d4ff',
            textStyle: { color: '#ffffff' }
          },
          grid: {
            left: '5%',
            right: '5%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: names,
            axisLabel: {
              color: '#8cc8ff',
              rotate: names.length > 10 ? 45 : 0,
              fontSize: 12
            },
            axisLine: { lineStyle: { color: '#00d4ff' } }
          },
          yAxis: {
            type: 'value',
            // max: 100,
            axisLabel: {
              color: '#8cc8ff',
              formatter: '{value}%'
            },
            axisLine: { lineStyle: { color: '#00d4ff' } },
            splitLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.1)' } }
          },
          series: [{
            data: rates.map(v => {
              const value = Number.isFinite(v) ? Number(v.toFixed(1)) : NaN
              const color = (value < 85 || value > 120) ? '#ff4d4f' : '#00ff88'
            
              return { value: Number.isFinite(value) ? value : 0, itemStyle: { color } }
            }),
            type: 'bar',
            barWidth: '60%',
            itemStyle: {
              borderRadius: [4, 4, 0, 0]
            },
            label: {
              show: true,
              position: 'top',
              color: '#00d4ff',
              formatter: '{c}%',
              fontSize: 12
            },
            emphasis: {
              itemStyle: {
                shadowColor: 'rgba(0, 212, 255, 0.5)',
                shadowBlur: 10
              }
            }
          }]
        }
        chartInstance.setOption(option)
        chartInstances.value[workshopName] = chartInstance
        const resizeHandler = () => chartInstance.resize()
        window.addEventListener('resize', resizeHandler)
        resizeHandlers.value[workshopName] = resizeHandler
      }
    })
  })
}

watch(() => props.visible, (val) => {
  if (val) {
    fetchAndRender()
  } else {
    // 清理图表实例与监听器
    Object.entries(chartInstances.value).forEach(([k, inst]) => {
      const h = resizeHandlers.value[k]
      if (h) window.removeEventListener('resize', h)
      inst && inst.dispose()
    })
    chartInstances.value = {}
    chartRefs.value = {}
    resizeHandlers.value = {}
  }
})

// 当父组件传入初始车间时，切换到对应车间并渲染
watch(() => props.initialWorkshop, (nw) => {
  if (nw && props.visible) {
    selectedWorkshopFilter.value = nw === 'all' ? 'all' : nw
    renderWorkshopCharts()
  }
})

onBeforeUnmount(() => {
  Object.values(chartInstances.value).forEach(inst => inst && inst.dispose())
  Object.values(resizeHandlers.value).forEach(h => h && window.removeEventListener('resize', h))
})

const close = () => {
  emit('update:visible', false)
  emit('close')
}
</script>

<style scoped>
.eu-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.eu-dialog {
  background: linear-gradient(135deg, rgba(0, 20, 40, 0.98) 0%, rgba(0, 40, 80, 0.98) 100%);
  width: 99%;
  max-width: none;
  height: 96vh;
  max-height: none;
  border-radius: 12px;
  border: 1px solid rgba(0, 212, 255, 0.3);
  box-shadow:
    0 0 50px rgba(0, 212, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.eu-dialog::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(0, 255, 136, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.eu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: linear-gradient(90deg, rgba(0, 40, 80, 0.9) 0%, rgba(0, 60, 120, 0.9) 100%);
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
  position: relative;
  z-index: 1;
}

.eu-title {
  font-weight: 700;
  font-size: 20px;
  color: #00d4ff;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
  letter-spacing: 1px;
}

.eu-close {
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 6px;
  width: 32px;
  height: 32px;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  color: #8cc8ff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.eu-close:hover {
  background: rgba(0, 212, 255, 0.2);
  border-color: rgba(0, 212, 255, 0.5);
  color: #00d4ff;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
}

.eu-body {
  flex: 1;
  padding: 0;
  background: transparent;
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

.eu-body::-webkit-scrollbar {
  width: 6px;
}

.eu-body::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

.eu-body::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.5);
  border-radius: 3px;
}

.eu-body::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 212, 255, 0.7);
}

.chart-placeholder {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8cc8ff;
  border: 2px dashed rgba(0, 212, 255, 0.3);
  background: rgba(0, 20, 40, 0.5);
  border-radius: 8px;
  font-size: 16px;
  margin: 20px;
}

/* 图表区域样式 */
.charts-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* 让内容撑满对话框可用高度，以便图表可以增高 */
  flex: 1;
  min-height: 600px;
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
  align-items: start;
}

.workshop-chart-card {
  background: rgba(0, 150, 255, 0.08);
  border: 1px solid rgba(0, 150, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  /* 加高卡片以利用对话框空白区域 */
  min-height: 760px;
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
  /* 增大图表容器高度以填满卡片 */
  min-height: 640px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.eu-footer {
  padding: 16px 24px;
  text-align: right;
  border-top: 1px solid rgba(0, 212, 255, 0.3);
  background: linear-gradient(90deg, rgba(0, 40, 80, 0.9) 0%, rgba(0, 60, 120, 0.9) 100%);
  position: relative;
  z-index: 1;
}

.eu-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid rgba(0, 212, 255, 0.3);
  background: linear-gradient(135deg, rgba(0, 40, 80, 0.8) 0%, rgba(0, 60, 120, 0.8) 100%);
  color: #8cc8ff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.eu-btn:hover {
  background: linear-gradient(135deg, rgba(0, 60, 120, 0.9) 0%, rgba(0, 80, 160, 0.9) 100%);
  border-color: rgba(0, 212, 255, 0.5);
  color: #00d4ff;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
}

/* 大屏适配 */
@media (min-width: 1920px) {
  .eu-dialog {
    width: 98%;
    height: 95vh;
    max-height: 1000px;
  }

  .eu-title {
    font-size: 24px;
  }

  .eu-header,
  .eu-footer {
    padding: 24px 32px;
  }
}
</style>