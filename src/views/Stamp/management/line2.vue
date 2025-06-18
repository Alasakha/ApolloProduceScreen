<template>
  <div class="line2-container">
    <div class="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <BorderBox
        v-for="(device) in devices"
        :key="device.name"
        width="100%"
        height="100%"
      >
        <div class="flex flex-col h-full justify-between">
          <!-- 设备名称 -->
          <div class="text-center text-xl font-bold text-[#8DD8FF] mb-2">{{ device.name }}</div>
          <!-- 三栏参数 -->
          <div class="flex flex-row justify-between mb-2 gap-2">
            <!-- 计划/完成 -->
            <div class="flex flex-col items-center flex-1">
              <div class="param-box">
                <div class="param-title">计划数</div>
                <div class="param-value">{{ device.plan }}</div>
              </div>
              <div class="param-box mt-2">
                <div class="param-title">完成数</div>
                <div class="param-value">{{ device.done }}</div>
              </div>
            </div>
            <!-- 状态/开机时长 -->
            <div class="flex flex-col items-center flex-1">
              <div class="param-box">
                <div class="param-title">状态</div>
                <div class="param-value" :class="device.status === '运行' ? 'text-green-400 font-bold' : 'text-red-400 font-bold'">
                  {{ device.status }}
                </div>
              </div>
              <div class="param-box mt-2">
                <div class="param-title">开机时长</div>
                <div class="param-value">{{ device.runTime }}</div>
              </div>
            </div>
            <!-- 功率/切割速度 -->
            <div class="flex flex-col items-center flex-1">
              <div class="param-box">
                <div class="param-title">功率</div>
                <div class="param-value">{{ device.power }}kW</div>
              </div>
              <div class="param-box mt-2">
                <div class="param-title">切割速度</div>
                <div class="param-value">{{ device.speed }}m/min</div>
              </div>
            </div>
          </div>
          <!-- 底部：开机时长+进度条 -->
          <div class="flex items-center w-full mt-2">
            <div class="text-[#8DD8FF] mr-2">进度</div>
            <div class="flex-1 bg-[#1a2a4a] rounded h-4 relative overflow-hidden mx-2">
              <div
                class="bg-gradient-to-r from-[#4E71FF] to-[#00EAFF] h-4 rounded"
                :style="{ width: (device.done/device.plan*100) + '%' }"
              ></div>
            </div>
            <div class="text-[#8DD8FF] font-bold w-10 text-right">{{ Math.round(device.done/device.plan*100) }}%</div>
          </div>
        </div>
      </BorderBox>
    </div>
  </div>
</template>   

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import gsap from 'gsap'
import BorderBox from '@/components/datav/BorderBox.vue'

const devices = ref([
  {
    name: '激光割管1号',
    type: '激光割管',
    count: 2,
    status: '运行',
    runTime: 120,
    power: 80,
    speed: 50,
    plan: 1000,
    done: 800
  },
  {
    name: '激光割管1号',
    type: '激光割管',
    count: 2,
    status: '运行',
    runTime: 120,
    power: 80,
    speed: 50,
    plan: 1000,
    done: 800
  },
  {
    name: '激光割管1号',
    type: '激光割管',
    count: 2,
    status: '运行',
    runTime: 120,
    power: 80,
    speed: 50,
    plan: 1000,
    done: 800
  },
  {
    name: '激光割管1号',
    type: '激光割管',
    count: 2,
    status: '运行',
    runTime: 120,
    power: 80,
    speed: 50,
    plan: 1000,
    done: 800
  },
  {
    name: '激光割管1号',
    type: '激光割管',
    count: 2,
    status: '运行',
    runTime: 120,
    power: 80,
    speed: 50,
    plan: 1000,
    done: 800
  },
  {
    name: '激光割管1号',
    type: '激光割管',
    count: 2,
    status: '运行',
    runTime: 120,
    power: 80,
    speed: 50,
    plan: 1000,
    done: 800
  },
])

// ECharts初始化
const chartRefs = ref<Array<HTMLDivElement | null>>([null, null, null, null, null, null])
const chartInstances = ref<any[]>([])

onMounted(() => {
  nextTick(() => {
    chartRefs.value.forEach((el, idx) => {
      if (el) {
        const chart = echarts.init(el)
        chart.setOption({
          series: [{
            type: 'gauge',
            progress: { show: true, width: 8 },
            axisLine: { lineStyle: { width: 8 } },
            pointer: { show: false },
            detail: { valueAnimation: true, fontSize: 18, color: '#4E71FF' },
            data: [{ value: devices.value[idx].done / devices.value[idx].plan * 100, name: '完成率' }]
          }]
        })
        chartInstances.value[idx] = chart
      }
    })
    // GSAP动画
    gsap.from('.device-card', {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power2.out'
    })
  })
})
</script>

<style scoped>
.line2-container {
  padding: 0.5rem 0.5rem 0 0;
  width: 100%;
}

.data-box {
  height: 40vh;
  padding: 1rem;
}

.device-card {
  background: rgba(30, 60, 120, 0.18);
  border: 1.5px solid #4E71FF;
  border-radius: 16px;
  box-shadow: 0 4px 24px #4E71FF33;
  min-width: 98%;
  max-width: 100%;
  color: #fff;
  transition: box-shadow 0.2s;
}
.device-card:hover {
  box-shadow: 0 8px 32px #8DD8FF55;
}

.param-box {
  border: 2px solid;
  border-image: linear-gradient(90deg, #4E71FF, #00EAFF) 1;
  border-radius: 10px;
  padding: 4px 12px;
  margin-bottom: 2px;
  min-width: 80px;
  background: rgba(30, 60, 120, 0.18);
  box-shadow: 0 2px 8px #4E71FF22;
}
.param-title {
  color: #8DD8FF;
  font-size: 0.95em;
  font-weight: bold;
  text-align: center;
}
.param-value {
  color: #fff;
  font-size: 1.1em;
  text-align: center;
  font-weight: bold;
}
</style> 