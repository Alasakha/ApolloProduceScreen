<template>
  <div class="h-[20vh] w-full p-2">
    <dv-border-box-2>
      
      <div class="box-content h-[30%]">
        <el-carousel trigger="click" height="100%" :interval="5000" indicator-position="none">
          <el-carousel-item>
            <!-- 样式1：科技感十足 -->
            <!-- <div class="text-center text-[#00eeff] text-3xl font-bold tracking-wider transform hover:scale-105 transition-transform duration-300 mb-2 title-tech">
              今日电表
            </div> -->
            
            <!-- 样式2：优雅现代 -->
            <!-- <div class="text-center text-[#00eeff] text-3xl font-light tracking-widest mb-2 title-elegant">
              今日电表
            </div> -->
            
            <!-- 样式3：未来科幻 -->
            <!-- <div class="text-center text-[#00eeff] text-3xl font-bold uppercase tracking-[0.2em] mb-2 title-future">
              今日电表
            </div> -->

            <Today />
          </el-carousel-item>
          <el-carousel-item>
            <Month />
          </el-carousel-item>
          <el-carousel-item>
            <Year />
          </el-carousel-item>
        </el-carousel>
      </div>
    </dv-border-box-2>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { GaugeChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent } from 'echarts/components'
import { getGaugeBaseOption } from './echarts'
import Today from './Today.vue'
import Month from './Month.vue'
import Year from './year.vue'
import { usePowerStore } from '@/store/power'
use([CanvasRenderer, GaugeChart, TitleComponent, TooltipComponent])
const powerStore = usePowerStore()

// 定义每个仪表盘的初始配置
const TodaygaugeOptions = ref({
  compressor: getGaugeBaseOption('空压机', 0, 100, 65.5, 'kW', ['#00eeff', '#0066ff']),
  injection: getGaugeBaseOption('注塑', 0, 150, 85.5, 'kW', ['#00ff9f', '#00eeff']),
  welding: getGaugeBaseOption('焊接', 0, 80, 45.5, 'kW', ['#ff9f00', '#ff0000']),
  metalwork1: getGaugeBaseOption('金工一楼', 0, 120, 75.5, 'kW', ['#00eeff', '#0066ff']),
  assembly2: getGaugeBaseOption('总装二课', 0, 90, 55.5, 'kW', ['#00ff9f', '#00eeff']),
  metalwork4: getGaugeBaseOption('金工四楼', 0, 100, 60.5, 'kW', ['#ff9f00', '#ff0000']),
  stamping: getGaugeBaseOption('冲压', 0, 200, 125.5, 'kW', ['#00eeff', '#0066ff']),
  dormitory: getGaugeBaseOption('宿舍', 0, 50, 25.5, 'kW', ['#00ff9f', '#00eeff']),
  packaging: getGaugeBaseOption('包装', 0, 70, 35.5, 'kW', ['#ff9f00', '#ff0000']),
  assembly1: getGaugeBaseOption('装配', 0, 110, 70.5, 'kW', ['#00eeff', '#0066ff'])
})

// 模拟数据更新
let timer = null

// 生成随机波动值
const getRandomFluctuation = (baseValue, range) => {
  return (baseValue + Math.random() * range - range/2).toFixed(1)
}

// 更新所有仪表盘数据
const updateGaugeData = () => {
  const baseValues = {
    compressor: 65.5,
    injection: 85.5,
    welding: 45.5,
    metalwork1: 75.5,
    assembly2: 55.5,
    metalwork4: 60.5,
    stamping: 125.5,
    dormitory: 25.5,
    packaging: 35.5,
    assembly1: 70.5
  }

  Object.keys(TodaygaugeOptions.value).forEach(key => {
    TodaygaugeOptions.value[key].series[0].data[0].value = getRandomFluctuation(baseValues[key], 10)
  })
}

onMounted(() => {
  timer = setInterval(updateGaugeData, 2000)
  powerStore.fetchPowerData()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/* 引入在线字体 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100;300;400;500;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');

/* 科技感标题 */
.title-tech {
  font-family: 'Orbitron', sans-serif;
  text-shadow: 0 0 10px #00eeff, 0 0 20px #00eeff;
  position: relative;
}

/* 优雅现代标题 */
.title-elegant {
  font-family: 'Noto Sans SC', sans-serif;
  letter-spacing: 0.5em;
  position: relative;
}

/* 未来科幻标题 */
.title-future {
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(45deg, #00eeff, #0066ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

/* 添加发光动画效果 */
@keyframes glow {
  0% { text-shadow: 0 0 10px #00eeff, 0 0 20px #00eeff; }
  50% { text-shadow: 0 0 15px #00eeff, 0 0 30px #00eeff; }
  100% { text-shadow: 0 0 10px #00eeff, 0 0 20px #00eeff; }
}

.title-tech {
  animation: glow 2s ease-in-out infinite;
}

.box-content {
  padding: 5px;
  height: 100%;
}

.gauge-container {
  height: 100%;
  display: flex;
  justify-content: space-between;
  gap: 5px;
  padding: 5px;
}

.gauge-item {
  width: calc(10% - 5px);
  height: calc(100% - 10px);
  padding: 2px;
}

.empty-page {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #00eeff;
  font-size: 24px;
}



h3 {
  height: 15%;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-carousel) {
  height: 100%;
}

:deep(.el-carousel__container) {
  height: 100%;
}

:deep(.echarts) {
  width: 100% !important;
  height: 85% !important;
}

:deep(.el-carousel__item) {
  height: 100%;
}
</style>