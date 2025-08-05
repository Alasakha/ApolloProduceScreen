<template>
  <div class="h-[25vh] w-full p-2">
    <dv-border-box-2>
      <div class="flex flex-col h-full">
        <!-- 标题 -->
        <div class="text-center py-2">
          <span class="text-[#00eeff] text-2xl font-bold">82522504270042水表</span>
        </div>

        <!-- 内容区域 -->
        <div class="flex flex-1 p-4">
          <!-- 总用水量 -->
          <div class="flex-1 flex flex-col items-center">
            <div class="text-[#00eeff] text-xl mb-4">总用水量</div>
            <div class="flex items-center mb-2">
              <span class="text-white mr-2">标准值：</span>
              <dv-digital-flop :config="standardTotalConfig" />
            </div>
            <div class="flex items-center">
              <span class="text-white mr-2">实际值：</span>
              
              <dv-digital-flop :config="actualTotalConfig" />
            </div>
            <div class="text-white mt-2">
              同比：<span :class="{
                'text-red-500': dayDiff > 0,
                'text-green-500': dayDiff < 0
              }">{{dayDiff > 0 ? '↑' : '↓'}}{{Math.abs(dayDiff)}}m³</span>
            </div>
            <dv-water-level-pond :config="waterConfig1" style="width:100px;height:100px;margin-top:10px" />
          </div>

          <!-- 月用水量 -->
          <div class="flex-1 flex flex-col items-center">
            <div class="text-[#00eeff] text-xl mb-4">月用水量</div>
            <div class="flex items-center mb-2">
              <span class="text-white mr-2">标准值：</span>
              <dv-digital-flop :config="standardMonthConfig" />
            </div>
            <div class="flex items-center">
              <span class="text-white mr-2">实际值：</span>
              <dv-digital-flop :config="actualMonthConfig" />
            </div>
            <div class="text-white mt-2">
              同比：<span :class="{
                'text-red-500': monthDiff > 0,
                'text-green-500': monthDiff < 0
              }">{{monthDiff > 0 ? '↑' : '↓'}}{{Math.abs(monthDiff)}}m³</span>
            </div>
            <dv-water-level-pond :config="waterConfig2" style="width:100px;height:100px;margin-top:10px" />
          </div>

          <!-- 日用水量 -->
          <div class="flex-1 flex flex-col items-center">
            <div class="text-[#00eeff] text-xl mb-4">日用水量</div>
            <div class="flex items-center mb-2">
              <span class="text-white mr-2">标准值：</span>
              <dv-digital-flop :config="standardDayConfig" />
            </div>
            <div class="flex items-center">
              <span class="text-white mr-2">实际值：</span>
              <dv-digital-flop :config="actualDayConfig" />
            </div>
            <div class="text-white mt-2">
              同比：<span :class="{
                'text-red-500': dayDiff > 0,
                'text-green-500': dayDiff < 0
              }">{{dayDiff > 0 ? '↑' : '↓'}}{{Math.abs(dayDiff)}}m³</span>
            </div>
            <dv-water-level-pond :config="waterConfig3" style="width:100px;height:100px;margin-top:10px" />
          </div>
        </div>
      </div>
    </dv-border-box-2>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

// 总用水量数据
const standardTotal = ref(1000)
const actualTotal = ref(800)

const standardTotalConfig = reactive({
  number: [standardTotal.value],
  content: '{nt}m³',
  style: { fontSize: 24, fill: '#00eeff' }
})

const actualTotalConfig = reactive({
  number: [actualTotal.value],
  content: '{nt}m³',
  style: { fontSize: 24, fill: '#00eeff' }
})

// 月用水量数据
const standardMonth = ref(300)
const actualMonth = ref(250)
const monthDiff = ref(actualMonth.value - standardMonth.value)

const standardMonthConfig = reactive({
  number: [standardMonth.value],
  content: '{nt}m³',
  style: { fontSize: 24, fill: '#00eeff' }
})

const actualMonthConfig = reactive({
  number: [actualMonth.value],
  content: '{nt}m³',
  style: { fontSize: 24, fill: '#00eeff' }
})

// 日用水量数据
const standardDay = ref(50)
const actualDay = ref(45)
const dayDiff = ref(actualDay.value - standardDay.value)

const standardDayConfig = reactive({
  number: [standardDay.value],
  content: '{nt}m³',
  style: { fontSize: 24, fill: '#00eeff' }
})

const actualDayConfig = reactive({
  number: [actualDay.value],
  content: '{nt}m³',
  style: { fontSize: 24, fill: '#00eeff' }
})

// 水位图配置
const waterConfig1 = reactive({
  data: [actualTotal.value / standardTotal.value * 100],
  shape: 'round',
  waveHeight: 0.3,
  waveNum: 2,
  colors: ['#00eeff', '#0066ff'],
  borderWidth: 2,
  borderColor: '#0066ff',
  borderRadius: 5
})

const waterConfig2 = reactive({
  data: [actualMonth.value / standardMonth.value * 100],
  shape: 'round',
  waveHeight: 0.3,
  waveNum: 2,
  colors: ['#00eeff', '#0066ff'],
  borderWidth: 2,
  borderColor: '#0066ff',
  borderRadius: 5
})

const waterConfig3 = reactive({
  data: [actualDay.value / standardDay.value * 100],
  shape: 'round',
  waveHeight: 0.3,
  waveNum: 2,
  colors: ['#00eeff', '#0066ff'],
  borderWidth: 2,
  borderColor: '#0066ff',
  borderRadius: 5
})

// 更新数据
const updateData = () => {
  // 更新总用水量
  standardTotal.value = Math.floor(Math.random() * 2000 + 800)
  actualTotal.value = Math.floor(Math.random() * 2000 + 800)
  standardTotalConfig.number = [standardTotal.value]
  actualTotalConfig.number = [actualTotal.value]
  waterConfig1.data = [actualTotal.value / standardTotal.value * 100]

  // 更新月用水量
  standardMonth.value = Math.floor(Math.random() * 500 + 200)
  actualMonth.value = Math.floor(Math.random() * 500 + 200)
  monthDiff.value = actualMonth.value - standardMonth.value
  standardMonthConfig.number = [standardMonth.value]
  actualMonthConfig.number = [actualMonth.value]
  waterConfig2.data = [actualMonth.value / standardMonth.value * 100]

  // 更新日用水量
  standardDay.value = Math.floor(Math.random() * 100 + 30)
  actualDay.value = Math.floor(Math.random() * 100 + 30)
  dayDiff.value = actualDay.value - standardDay.value
  standardDayConfig.number = [standardDay.value]
  actualDayConfig.number = [actualDay.value]
  waterConfig3.data = [actualDay.value / standardDay.value * 100]
}

let timer: number | null = null

onMounted(() => {
  updateData()
  timer = window.setInterval(updateData, 3000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped>
:deep(.dv-digital-flop) {
  width: 120px;
  height: 30px;
}
</style>