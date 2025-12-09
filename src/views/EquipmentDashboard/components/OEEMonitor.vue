<template>
  <div class="oee-monitor">
    <div class="title">关键设备OEE监控</div>
    <div class="gauge-container">
      <div ref="chartRef" class="gauge-chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useEcharts } from '@/utils/useEcharts'
import { useOeeStore } from '@/store/oee'

const chartRef = ref<HTMLElement | null>(null)
const { initChart, setOption } = useEcharts(chartRef)

const oeeStore = useOeeStore()
const { avgOee } = storeToRefs(oeeStore)

const oeeValue = ref(0)

const createGaugeOption = (value: number) => {
  return {
    series: [
      {
        type: 'gauge',
        center: ['50%', '50%'],
        radius: '90%',
        min: 0,
        max: 100,
        progress: {
          show: true,
          roundCap: true,
          width: 12,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#00d4ff' },
                { offset: 0.5, color: '#00ff88' },
                { offset: 1, color: '#ffaa00' }
              ]
            }
          }
        },
        pointer: {
          show: true,
          length: '60%',
          width: 6,
          itemStyle: {
            color: '#00d4ff'
          }
        },
        axisLine: {
          lineStyle: {
            width: 18,
            color: [[1, 'rgba(0, 238, 255, 0.1)']]
          }
        },
        axisTick: {
          distance: -20,
          splitNumber: 5,
          lineStyle: {
            color: '#999',
            width: 1
          }
        },
        splitLine: {
          distance: -20,
          length: 14,
          lineStyle: {
            color: '#999',
            width: 2
          }
        },
        axisLabel: {
          distance: -12,
          formatter: (value: number) => Math.floor(value),
          color: '#fff',
          fontSize: 12
        },
        anchor: {
          show: true,
          size: 20,
          itemStyle: {
            borderColor: '#00d4ff',
            borderWidth: 2
          }
        },
        detail: {
          valueAnimation: true,
          fontSize: 28,
          offsetCenter: [0, '70%'],
          formatter: (value: number) => Math.floor(value) + '%',
          color: '#00d4ff',
          fontWeight: 'bold'
        },
        data: [
          {
            value: value,
            name: 'OEE'
          }
        ]
      }
    ]
  }
}

onMounted(() => {
  nextTick(() => {
    initChart()
    const option = createGaugeOption(oeeValue.value)
    setOption(option)
  })
})

// 监听平均 OEE 更新仪表盘
watch(avgOee, (val) => {
  oeeValue.value = val
  nextTick(() => {
    const option = createGaugeOption(oeeValue.value)
    setOption(option)
  })
}, { immediate: true })

onMounted(async () => {
  await oeeStore.fetchOee()
  oeeValue.value = avgOee.value
  const option = createGaugeOption(oeeValue.value)
  setOption(option)
})
</script>

<style scoped>
.oee-monitor {
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

.gauge-container {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gauge-chart {
  width: 100%;
  height: 100%;
  max-width: 400px;
  max-height: 400px;
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .title {
    font-size: 20px;
  }
}
</style>


