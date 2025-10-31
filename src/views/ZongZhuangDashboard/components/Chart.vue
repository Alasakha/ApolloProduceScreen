<template>
  <div class="chart-container" :class="containerClass">
    <div class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
      <div class="chart-actions" v-if="showActions">
        <button 
          v-for="action in actions" 
          :key="action.key"
          @click="handleAction(action.key)"
          class="action-btn"
          :class="{ active: activeAction === action.key }"
        >
          {{ action.label }}
        </button>
      </div>
    </div>
    <div class="chart-content">
      <div ref="chartRef" class="chart" :style="{ height: chartHeight }"></div>
      <div v-if="chartError" class="chart-error">
        <p>图表加载失败</p>
        <button @click="retryInit" class="retry-btn">重试</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue'

interface ChartAction {
  key: string
  label: string
}

interface Props {
  title: string
  type: 'line' | 'bar' | 'pie' | 'gauge'
  data: any
  options?: any
  height?: string
  showActions?: boolean
  actions?: ChartAction[]
  activeAction?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '200px',
  showActions: false,
  actions: () => [],
  activeAction: ''
})

const emit = defineEmits<{
  actionClick: [key: string]
}>()

const chartRef = ref<HTMLElement>()
let chartInstance: any = null
const chartError = ref(false)

const containerClass = computed(() => {
  return `chart-${props.type}`
})

const chartHeight = computed(() => {
  return props.height
})

const initChart = async () => {
  if (!chartRef.value) return
  
  try {
    chartError.value = false
    
    // 动态导入ECharts
    const echarts = await import('echarts')
    
    chartInstance = echarts.init(chartRef.value)
    updateChart()
  } catch (error) {
    console.error('Chart initialization failed:', error)
    chartError.value = true
  }
}

const updateChart = () => {
  if (!chartInstance) {
    console.warn('Chart instance not available')
    return
  }
  
  try {
    const option = getChartOption()
    chartInstance.setOption(option, true)
  } catch (error) {
    console.error('Chart update failed:', error)
    chartError.value = true
  }
}

const getChartOption = () => {
  const baseOption = {
    backgroundColor: 'transparent',
    textStyle: {
      color: '#fff'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      textStyle: {
        color: '#fff'
      }
    }
  }

  switch (props.type) {
    case 'line':
      return {
        ...baseOption,
        xAxis: {
          type: 'category',
          data: props.data.categories || [],
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#fff' }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#fff' },
          splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
        },
        series: props.data.series || []
      }
    
    case 'bar':
      return {
        ...baseOption,
        xAxis: {
          type: 'category',
          data: props.data.categories || [],
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#fff' }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#fff' },
          splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
        },
        series: props.data.series || []
      }
    
    case 'pie':
      return {
        ...baseOption,
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          data: props.data.series || [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    
    case 'gauge':
      return {
        ...baseOption,
        series: [{
          type: 'gauge',
          center: ['50%', '60%'],
          radius: '80%',
          data: props.data.series || [],
          detail: {
            valueAnimation: true,
            formatter: '{value}%',
            color: '#fff',
            fontSize: 16
          },
          axisLine: {
            lineStyle: {
              width: 8,
              color: [
                [0.3, '#67e0e3'],
                [0.7, '#37a2da'],
                [1, '#fd666d']
              ]
            }
          },
          pointer: {
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -30,
            splitNumber: 5,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          splitLine: {
            distance: -30,
            length: 30,
            lineStyle: {
              width: 4,
              color: '#999'
            }
          },
          axisLabel: {
            color: '#fff',
            distance: 40,
            fontSize: 12
          }
        }]
      }
    
    default:
      return baseOption
  }
}

const handleAction = (key: string) => {
  emit('actionClick', key)
}

const retryInit = () => {
  initChart()
}

const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  nextTick(() => {
    initChart()
    window.addEventListener('resize', resizeChart)
  })
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  window.removeEventListener('resize', resizeChart)
})

watch(() => props.data, updateChart, { deep: true })
watch(() => props.options, updateChart, { deep: true })
</script>

<style scoped>
.chart-container {
  background: transparent;
  border-radius: 3px;
  padding: 2px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
  flex: 0 0 auto;
}

.chart-title {
  font-size: 11px;
  color: #00d4ff;
  margin: 0;
  font-weight: bold;
}

.chart-actions {
  display: flex;
  gap: 2px;
}

.action-btn {
  padding: 1px 3px;
  background: rgba(0, 212, 255, 0.2);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 2px;
  color: #00d4ff;
  font-size: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(0, 212, 255, 0.3);
  border-color: #00d4ff;
}

.action-btn.active {
  background: #00d4ff;
  color: #000;
  border-color: #00d4ff;
}

.chart-content {
  width: 100%;
  flex: 1;
  position: relative;
  min-height: 0;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 0;
}

.chart-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

.chart-error p {
  margin: 0 0 4px 0;
  font-size: 8px;
}

.retry-btn {
  padding: 2px 4px;
  background: #00d4ff;
  color: #000;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  font-size: 6px;
  transition: background 0.3s ease;
}

.retry-btn:hover {
  background: #00b8e6;
}
</style>