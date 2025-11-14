<template>
  <div class="h-[6vh] w-full p-2 pt-0">

      <div class="box-content h-full">
        <!-- 年度能耗数据展示 -->
        <div class="energy-dashboard">
          <!-- <div class="dashboard-title">
            <h2 class="title-elegant">年度能耗监控</h2>
          </div> -->
          
          <div class="energy-grid">
            <!-- 电力数据 -->
            <div class="energy-section">
              <div class="section-title">车间总电力消耗</div>
              <div class="data-grid">
                <div class="data-item">
                  <div class="data-label">月</div>
                  <div class="data-value electric">{{ electricData.totalStandard }}</div>
                </div>
                <div class="data-item">
                  <div class="data-label">年</div>
                  <div class="data-value electric">{{ electricData.totalActual }}</div>
                </div>
                
              </div>
            </div>

            <!-- 气体数据 -->
            <div class="energy-section">
              <div class="section-title">总燃气消耗</div>
              <div class="data-grid">
                <div class="data-item">
                  <div class="data-label">月</div>
                  <div class="data-value gas">{{ gasData.totalStandard }}</div>
                </div>
                <div class="data-item">
                  <div class="data-label">年</div>
                  <div class="data-value gas">{{ gasData.totalActual }}</div>
                </div>
               
              </div>
            </div>

            <!-- 水数据 -->
            <div class="energy-section">
              <div class="section-title">总水量消耗</div>
              <div class="data-grid">
                <div class="data-item">
                  <div class="data-label">月</div>
                  <div class="data-value water">{{ waterData.totalStandard }}</div>
                </div>
                <div class="data-item">
                  <div class="data-label">年</div>
                  <div class="data-value water">{{ waterData.totalActual }}</div>
                </div>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getConsume, type ConsumeData } from '@/api/enery'

// 年度数据
const yearlyElectricData = ref<ConsumeData | null>(null) // 改为单个对象，使用consume接口
const yearlyGasData = ref<ConsumeData | null>(null) // 改为单个对象
const yearlyWaterData = ref<ConsumeData | null>(null) // 改为单个对象

// 计算电力数据 - 使用consume接口数据结构
const electricData = computed(() => {
  if (!yearlyElectricData.value) {
    return {
      totalStandard: '0.00',
      totalActual: '0.00',
      totalDiff: '0.00',
      perUnitStandard: '0.00',
      perUnitActual: '0.00',
      perUnitDiff: '0.00'
    }
  }
  
  // numberPower 是月数据，number 是年数据
  const monthlyValue = yearlyElectricData.value.numberPower || 0
  const yearlyValue = parseFloat(yearlyElectricData.value.number || '0')
  const totalUnits = yearlyElectricData.value.cl || 1
  
  return {
    totalStandard: monthlyValue.toFixed(2), // 月数据
    totalActual: yearlyValue.toFixed(2),     // 年数据
    totalDiff: (yearlyValue - monthlyValue).toFixed(2),
    perUnitStandard: '0.00',
    perUnitActual: totalUnits > 0 ? (yearlyValue / totalUnits).toFixed(2) : '0.00',
    perUnitDiff: '0.00'
  }
})

// 计算气体数据
const gasData = computed(() => {
  if (!yearlyGasData.value) {
    return {
      totalStandard: '0.00',
      totalActual: '0.00',
      totalDiff: '0.00',
      perUnitStandard: '0.00',
      perUnitActual: '0.00',
      perUnitDiff: '0.00'
    }
  }
  
  // numberPower 是月数据，number 是年数据
  const monthlyValue = yearlyGasData.value.numberPower || 0
  const yearlyValue = parseFloat(yearlyGasData.value.number || '0')
  const totalUnits = yearlyGasData.value.cl || 1
  
  return {
    totalStandard: monthlyValue.toFixed(2), // 月数据
    totalActual: yearlyValue.toFixed(2),     // 年数据
    totalDiff: (yearlyValue - monthlyValue).toFixed(2),
    perUnitStandard: '0.00',
    perUnitActual: totalUnits > 0 ? (yearlyValue / totalUnits).toFixed(2) : '0.00',
    perUnitDiff: '0.00'
  }
})

// 计算水数据
const waterData = computed(() => {
  if (!yearlyWaterData.value) {
    return {
      totalStandard: '0.00',
      totalActual: '0.00',
      totalDiff: '0.00',
      perUnitStandard: '0.00',
      perUnitActual: '0.00',
      perUnitDiff: '0.00'
    }
  }
  
  // numberPower 是月数据，number 是年数据
  const monthlyValue = yearlyWaterData.value.numberPower || 0
  const yearlyValue = parseFloat(yearlyWaterData.value.number || '0')
  const totalUnits = yearlyWaterData.value.cl || 1
  
  return {
    totalStandard: monthlyValue.toFixed(2), // 月数据
    totalActual: yearlyValue.toFixed(2),     // 年数据
    totalDiff: (yearlyValue - monthlyValue).toFixed(2),
    perUnitStandard: '0.00',
    perUnitActual: totalUnits > 0 ? (yearlyValue / totalUnits).toFixed(2) : '0.00',
    perUnitDiff: '0.00'
  }
})

// 获取年度数据
const fetchYearlyData = async () => {
  try {
    // 获取当月1号的日期
    const today = new Date()
    const firstDayOfMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`
    
    // 获取电力数据 - 使用consume接口，machCode为616506210007
    const electricRes = await getConsume(firstDayOfMonth, '616506210005')
    if (electricRes.code === 200 && electricRes.data) {
      yearlyElectricData.value = electricRes.data
      console.log(yearlyElectricData.value)
      console.log('✅ 电力数据获取成功:', electricRes.data)
    } else {
      console.warn('获取电力数据失败:', electricRes.message)
    }
    
    // 获取用气数据 - 使用consume接口，machCode为000025061801
    const gasRes = await getConsume(firstDayOfMonth, '000025061801')
    if (gasRes.code === 200 && gasRes.data) {
      yearlyGasData.value = gasRes.data
      console.log('✅ 用气数据获取成功:', gasRes.data)
    } else {
      console.warn('获取用气数据失败:', gasRes.message)
    }
    
    // 获取用水数据 - 使用consume接口，machCode为82522504270042
    const waterRes = await getConsume(firstDayOfMonth, '82522504270042')
    if (waterRes.code === 200 && waterRes.data) {
      yearlyWaterData.value = waterRes.data
      console.log('✅ 用水数据获取成功:', waterRes.data)
    } else {
      console.warn('获取用水数据失败:', waterRes.message)
    }
    
  } catch (error) {
    console.error('获取年度数据失败:', error)
  }
}

// 定时器
let timer = null

onMounted(() => {
  fetchYearlyData()
  // 每5分钟更新一次数据
  timer = setInterval(fetchYearlyData, 300000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/* 引入在线字体 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100;300;400;500;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');

/* 优雅现代标题 */
.title-elegant {
  font-family: 'Noto Sans SC', sans-serif;
  letter-spacing: 0.3em;
  position: relative;
  text-shadow: 0 0 10px #00eeff;
}

.box-content {
  padding: 8px;
  padding-top: 0px;
}

/* 能耗仪表盘样式 */
.energy-dashboard {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
}

.dashboard-title {
  text-align: center;
  margin-bottom: 10px;
}

.dashboard-title h2 {
  color: #00eeff;
  font-size: 1.2rem;
  font-weight: 300;
  margin: 0;
  text-shadow: 0 0 8px #00eeff;
}

.energy-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  height: calc(100% - 40px);
}

.energy-section {
  background: rgba(0, 238, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.2);
  border-radius: 4px;
  padding: 8px;
  display: flex;
  /* flex-direction: column; */
}

.section-title {
  color: #00eeff;
  font-size: 1.8rem;
  font-weight: 500;
  text-align: center;
  margin-right: 8px;
  text-shadow: 0 0 5px #00eeff;
  border-right: 1px solid rgba(0, 238, 255, 0.3);
  padding-right: 8px;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  flex: 1;
}

/* 2K及以上分辨率使用此样式 */
@media (min-width: 2000px) {
  .data-item {
    display: flex;
    /* flex-direction: column; */
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    border: 1px solid rgba(0, 238, 255, 0.18);
    box-shadow: 0 2px 8px rgba(0,238,255,0.08);
  }
}
@media (max-width: 1980px) {
  .data-item {
    display: flex;
    /* flex-direction: column; */
    align-items: center;
    justify-content: space-between;
    padding: 4px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
    border: 1px solid rgba(0, 238, 255, 0.1);
  }
}

.data-label {
  color: #00eeff;
  font-size: 1.2rem;
  font-weight: 300;
  margin-bottom: 2px;
  text-align: center;
  opacity: 0.8;
}

.data-value {
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  /* font-family: 'Orbitron', monospace; */
}

/* 不同类型数据的颜色 */
.data-value {
  color: #00eeff;
  text-shadow: 0 0 5px #00eeff;
}

/* .data-value.gas {
  color: #ff9f00;
  text-shadow: 0 0 5px #ff9f00;
}

.data-value.water {
  color: #00ff9f;
  text-shadow: 0 0 5px #00ff9f;
} */

/* 差额颜色 */
.data-value.positive {
  color: #ff6b6b;
  text-shadow: 0 0 5px #ff6b6b;
}

/* .data-value.negative {
  color: #51cf66;
  text-shadow: 0 0 5px #51cf66;
} */

/* 响应式设计 */
@media (max-width: 1279px) {
  .energy-grid {
    grid-template-columns: 1fr;
    gap: 4px;
  }
  
  .data-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .data-label {
    font-size: 0.6rem;
  }
  
  .data-value {
    font-size: 0.7rem;
  }
  
  .section-title {
    font-size: 0.8rem;
  }
}

@media (min-width: 1280px) and (max-width: 1849px) {
  .energy-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
  
  .data-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .data-label {
    font-size: 0.65rem;
  }
  
  .data-value {
    font-size: 0.75rem;
  }
}

@media (min-width: 1850px) and (max-width: 2499px) {
  .energy-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  
  .data-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .data-label {
    font-size: 1.4rem;
  }
  
  .data-value {
    font-size: 1.4rem;
  }
}

@media (min-width: 2500px) {
  .energy-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  .data-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .data-label {
    font-size: 1.4rem;
  }
  
  .data-value {
    font-size: 0.9rem;
  }
  
  .dashboard-title h2 {
    font-size: 1.4rem;
  }
}
</style>