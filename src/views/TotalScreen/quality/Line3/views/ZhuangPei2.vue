<template>
  <div class="w-full h-full flex flex-col">
    
    <dv-border-box8 :dur="5" class="w-full h-full flex">
      <h1 class="text-white text-2xl font-bold mt-4">{{dialogTitle}}</h1>
      <div class="w-full h-full flex flex-col mt-2">
        <h1 class="text-white text-sm font-bold flex justify-center">总装一课</h1>
        
        <!-- 统计卡片 - 第一行 -->
        <div class="stats-container mb-2">
          <div class="stat-card">
            <div class="card-icon">📊应检数</div>
            <div class="stat-value">{{totalCount1}}</div>
          </div>
          <div class="stat-card">
            <div class="card-icon">✅已检验</div>
            <div class="stat-value">{{checkedCount1}}</div>
          </div>
          <div class="stat-card">
            <div class="card-icon">📈完成率</div>
            <div class="stat-value">{{progressRate1}}%</div>
          </div>
        </div>
        
        <h1 class="text-white text-sm font-bold flex justify-center mt-2">上线检验</h1>
        
        <!-- 统计卡片 - 第三行 -->
        <div class="stats-container mb-2">
          <div class="stat-card">
            <div class="card-icon">📊应检数</div>
            <div class="stat-value">{{totalCount3}}</div>
          </div>
          <div class="stat-card">
            <div class="card-icon">✅已检验</div>
            <div class="stat-value">{{checkedCount3}}</div>
            <div class="stat-label"></div>
          </div>
          <div class="stat-card">
            <div class="card-icon">📈完成率</div>
            <div class="stat-value">{{progressRate3}}%</div>
          </div>
        </div>

        <h1 class="text-white text-sm font-bold flex justify-center mt-2">总装二课</h1>
        
        <!-- 统计卡片 - 第二行 -->
        <div class="stats-container mb-2">
          <div class="stat-card">
            <div class="card-icon">📊应检数</div>
            <div class="stat-value">{{totalCount2}}</div>
          </div>
          <div class="stat-card">
            <div class="card-icon">✅已检验</div>
            <div class="stat-value">{{checkedCount2}}</div>
          </div>
          <div class="stat-card">
            <div class="card-icon">📈完成率</div>
            <div class="stat-value">{{progressRate2}}%</div>
          </div>
        </div>
        

        
        <!-- <div ref="chartRef1" class="w-full h-[25%]"></div> -->
        
        <!-- <div ref="chartRef2" class="w-full h-[25%]"></div> -->
      </div>

    </dv-border-box8>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch, computed } from 'vue'
import { useEcharts } from '@/utils/useEcharts'
import { createOption } from './jindu'
import { getCheckTotalDone, getCheckTotalDoneJcx } from '@/api/getQuiltyinfo'

const dialogTitle = ref('装配检验超时');
const chartRef1 = ref(null)
const chartRef2 = ref(null)
const chart1 = useEcharts(chartRef1)
const chart2 = useEcharts(chartRef2)
let cleanup = null

// 响应式数据
const chartData1 = ref([])
const chartLabels1 = ref([])
const chartData2 = ref([])
const chartLabels2 = ref([])

// 统计数据
const totalCount1 = ref(0)
const checkedCount1 = ref(0)
const totalCount2 = ref(0)
const checkedCount2 = ref(0) 
const totalCount3 = ref(0)
const checkedCount3 = ref(0)

// 计算完成率
const progressRate1 = computed(() => {
  if (totalCount1.value === 0) return 0
  return Math.round((checkedCount1.value / totalCount1.value) * 100)
})

const progressRate2 = computed(() => {
  if (totalCount2.value === 0) return 0
  return Math.round((checkedCount2.value / totalCount2.value) * 100)
})

const progressRate3 = computed(() => {
  if (totalCount3.value === 0) return 0
  return Math.round((checkedCount3.value / totalCount3.value) * 100)
})

const drawChart = () => {
const option1 = createOption(chartData1.value,chartLabels1.value)
const option2 = createOption(chartData2.value,chartLabels2.value)

nextTick(() => {
  chart1.setOption(option1)
  chart2.setOption(option2)
})
}

// 监听数据变化
watch([chartData1, chartLabels1], () => {
  drawChart()
}, { deep: true })
watch([chartData2, chartLabels2], () => {
  drawChart()
}, { deep: true })

const fetchData = async () => {
  const res = await getCheckTotalDone()
  if(res.code === 200 && Array.isArray(res.data)){
    const target = res.data.find(item => item.workCenterName === '汽油车组装车间')
    if(target){
      chartData1.value = [target.total, target.checkTotal]
      chartLabels1.value = ['应检数', '检验数']
      // 更新统计数据
      totalCount1.value = target.total || 0
      checkedCount1.value = target.checkTotal || 0
    }
    
    const target2 = res.data.find(item => item.workCenterName === '电动车组装')
    if(target2){
      chartData2.value = [target2.total, target2.checkTotal]
      chartLabels2.value = ['应检数', '检验数']
      // 更新统计数据
      totalCount2.value = target2.total || 0
      checkedCount2.value = target2.checkTotal || 0
    }
      drawChart()
    }
  }

// 获取今日其他不良数据
const fetchData3 = async () => {
  try {
    const res = await getCheckTotalDoneJcx()
    if (res.code === 200 && res.data) {
      totalCount3.value = Number(res.data.total ?? 0)
      checkedCount3.value = Number(res.data.checkTotal ?? 0)
    }
  } catch (error) {
    console.error('获取今日其他不良数据失败:', error)
  }
}

onMounted(async () => {
  await chart1.initChart()
  await chart2.initChart()
  await fetchData()
  await fetchData3()
  drawChart()
})

onBeforeUnmount(() => {
  if (cleanup) cleanup()
})
</script>

<style scoped>
/* 统计卡片样式 */
.stats-container {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
  padding: 0.125rem;
}

.stat-card {
  flex: 1;
  background: linear-gradient(135deg, rgba(35, 167, 220, 0.1) 0%, rgba(35, 167, 220, 0.05) 100%);
  border: 1px solid rgba(35, 167, 220, 0.3);
  border-radius: 6px;
  padding: 0.75rem;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(35, 167, 220, 0.1);
}

.stat-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(35, 167, 220, 0.2);
  border-color: rgba(35, 167, 220, 0.5);
}

.card-icon {
  margin-bottom: 0.125rem;
  opacity: 0.8;
  color: #fff;
}

.stat-value {
  font-size: 13px;
  font-weight: bold;
  color: #23a7dc;
  margin-bottom: 0.125rem;
}

.stat-label {
  font-size: 9px;
  color: #a0aec0;
  font-weight: 500;
}

/* 响应式断点 - 使用 @media 查询 */
/* sm: ≥ 640px */
@media (min-width: 640px) {
  .stat-value {
    font-size: 12px;
  }
  .stat-label {
    font-size: 12px;
  }
}

/* md: ≥ 768px */
@media (min-width: 768px) {
  .stat-value {
    font-size: 14px;
  }
  .stat-label {
    font-size: 14px;
  }
}

/* lg: ≥ 1024px */
@media (min-width: 1024px) {
  .stat-value {
    font-size: 16px;
  }
  .stat-label {
    font-size: 16px;
  }
}

/* xl: ≥ 1280px */
@media (min-width: 1280px) {
  .stat-value {
    font-size: 18px;
  }
  .stat-label {
    font-size: 18px;
  }
}

/* 2xl: ≥ 1536px */
@media (min-width: 1536px) {
  .stat-value {
    font-size: 20px;
  }
  .stat-label {
    font-size: 20px;
  }
}

/* 3xl: ≥ 1920px */
@media (min-width: 1920px) {
  .stat-value {
    font-size: 12px;
  }
  .stat-label {
    font-size: 16px;
  }
}

/* 4xl: ≥ 2560px */
@media (min-width: 2260px) {
  .stat-value {
    font-size: 30px;
  }
  .stat-label {
    font-size: 30px;
  }
}
</style>