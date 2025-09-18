<template>
  <div class="h-[20vh] w-full p-2">

      <div class="box-content h-full">
        <!-- 年度能耗数据展示 -->
        <div class="energy-dashboard">
          <div class="dashboard-title">
            <h2 class="title-elegant">年度能耗监控</h2>
          </div>
          
          <div class="energy-grid">
            <!-- 电力数据 -->
            <div class="energy-section">
              <div class="section-title">电力消耗</div>
              <div class="data-grid">
                <div class="data-item">
                  <div class="data-label">总标准</div>
                  <div class="data-value electric">{{ electricData.totalStandard }}</div>
                </div>
                <div class="data-item">
                  <div class="data-label">总实际</div>
                  <div class="data-value electric">{{ electricData.totalActual }}</div>
                </div>
                <div class="data-item">
                  <div class="data-label">总差额</div>
                  <div class="data-value" :class="parseFloat(electricData.totalDiff) >= 0 ? 'positive' : 'negative'">
                    {{ parseFloat(electricData.totalDiff) > 0 ? '+' : '' }}{{ electricData.totalDiff }}
                  </div>
                </div>
                <div class="data-item">
                  <div class="data-label">每台标准</div>
                  <div class="data-value electric">{{ electricData.perUnitStandard }}</div>
                </div>
                <div class="data-item">
                  <div class="data-label">每台实际</div>
                  <div class="data-value electric">{{ electricData.perUnitActual }}</div>
                </div>
                <div class="data-item">
                  <div class="data-label">每台差额</div>
                  <div class="data-value" :class="parseFloat(electricData.perUnitDiff) >= 0 ? 'positive' : 'negative'">
                    {{ parseFloat(electricData.perUnitDiff) > 0 ? '+' : '' }}{{ electricData.perUnitDiff }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 气体数据 -->
            <div class="energy-section">
              <div class="section-title">气体消耗</div>
              <div class="data-grid">
                <div class="data-item">
                  <div class="data-label">总标准</div>
                  <div class="data-value gas">{{ gasData.totalStandard }}</div>
                </div>
                <div class="data-item">
                  <div class="data-label">总实际</div>
                  <div class="data-value gas">{{ gasData.totalActual }}</div>
                </div>
                <div class="data-item">
                  <div class="data-label">总差额</div>
                  <div class="data-value" :class="parseFloat(gasData.totalDiff) >= 0 ? 'positive' : 'negative'">
                    {{ parseFloat(gasData.totalDiff) > 0 ? '+' : '' }}{{ gasData.totalDiff }}
                  </div>
                </div>
                <div class="data-item">
                  <div class="data-label">每台标准</div>
                  <div class="data-value gas">{{ gasData.perUnitStandard }}</div>
                </div>
                <div class="data-item">
                  <div class="data-label">每台实际</div>
                  <div class="data-value gas">{{ gasData.perUnitActual }}</div>
                </div>
                <div class="data-item">
                  <div class="data-label">每台差额</div>
                  <div class="data-value" :class="parseFloat(gasData.perUnitDiff) >= 0 ? 'positive' : 'negative'">
                    {{ parseFloat(gasData.perUnitDiff) > 0 ? '+' : '' }}{{ gasData.perUnitDiff }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 水数据 -->
            <div class="energy-section">
              <div class="section-title">水消耗</div>
              <div class="data-grid">
                <div class="data-item">
                  <div class="data-label">总标准</div>
                  <div class="data-value water">{{ waterData.totalStandard }}</div>
                </div>
                <div class="data-item">
                  <div class="data-label">总实际</div>
                  <div class="data-value water">{{ waterData.totalActual }}</div>
                </div>
                <div class="data-item">
                  <div class="data-label">总差额</div>
                  <div class="data-value" :class="parseFloat(waterData.totalDiff) >= 0 ? 'positive' : 'negative'">
                    {{ parseFloat(waterData.totalDiff) > 0 ? '+' : '' }}{{ waterData.totalDiff }}
                  </div>
                </div>
                <div class="data-item">
                  <div class="data-label">每台标准</div>
                  <div class="data-value water">{{ waterData.perUnitStandard }}</div>
                </div>
                <div class="data-item">
                  <div class="data-label">每台实际</div>
                  <div class="data-value water">{{ waterData.perUnitActual }}</div>
                </div>
                <div class="data-item">
                  <div class="data-label">每台差额</div>
                  <div class="data-value" :class="parseFloat(waterData.perUnitDiff) >= 0 ? 'positive' : 'negative'">
                    {{ parseFloat(waterData.perUnitDiff) > 0 ? '+' : '' }}{{ waterData.perUnitDiff }}
                  </div>
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
import { getElectricPowerYear, getGasPower } from '@/api/enery'

// 年度数据
const yearlyElectricData = ref([])
const yearlyGasData = ref([])
const yearlyWaterData = ref([])

// 计算电力数据
const electricData = computed(() => {
  const totalStandard = yearlyElectricData.value.reduce((sum, item) => sum + (item.standardConsumption || 0), 0)
  const totalActual = yearlyElectricData.value.reduce((sum, item) => sum + (item.numberPower || 0), 0)
  const totalDiff = totalActual - totalStandard
  
  const totalUnits = yearlyElectricData.value.reduce((sum, item) => sum + (item.cl || 1), 0)
  const perUnitStandard = totalUnits > 0 ? (totalStandard / totalUnits).toFixed(2) : '0.00'
  const perUnitActual = totalUnits > 0 ? (totalActual / totalUnits).toFixed(2) : '0.00'
  const perUnitDiff = (parseFloat(perUnitActual) - parseFloat(perUnitStandard)).toFixed(2)
  
  return {
    totalStandard: totalStandard.toFixed(2),
    totalActual: totalActual.toFixed(2),
    totalDiff: totalDiff.toFixed(2),
    perUnitStandard,
    perUnitActual,
    perUnitDiff
  }
})

// 计算气体数据
const gasData = computed(() => {
  const totalStandard = yearlyGasData.value.reduce((sum, item) => sum + (item.standardConsumption || 0), 0)
  const totalActual = yearlyGasData.value.reduce((sum, item) => sum + (item.numberPower || 0), 0)
  const totalDiff = totalActual - totalStandard
  
  const totalUnits = yearlyGasData.value.reduce((sum, item) => sum + (item.cl || 1), 0)
  const perUnitStandard = totalUnits > 0 ? (totalStandard / totalUnits).toFixed(2) : '0.00'
  const perUnitActual = totalUnits > 0 ? (totalActual / totalUnits).toFixed(2) : '0.00'
  const perUnitDiff = (parseFloat(perUnitActual) - parseFloat(perUnitStandard)).toFixed(2)
  
  return {
    totalStandard: totalStandard.toFixed(2),
    totalActual: totalActual.toFixed(2),
    totalDiff: totalDiff.toFixed(2),
    perUnitStandard,
    perUnitActual,
    perUnitDiff
  }
})

// 计算水数据
const waterData = computed(() => {
  const totalStandard = yearlyWaterData.value.reduce((sum, item) => sum + (item.standardConsumption || 0), 0)
  const totalActual = yearlyWaterData.value.reduce((sum, item) => sum + (item.numberPower || 0), 0)
  const totalDiff = totalActual - totalStandard
  
  const totalUnits = yearlyWaterData.value.reduce((sum, item) => sum + (item.cl || 1), 0)
  const perUnitStandard = totalUnits > 0 ? (totalStandard / totalUnits).toFixed(2) : '0.00'
  const perUnitActual = totalUnits > 0 ? (totalActual / totalUnits).toFixed(2) : '0.00'
  const perUnitDiff = (parseFloat(perUnitActual) - parseFloat(perUnitStandard)).toFixed(2)
  
  return {
    totalStandard: totalStandard.toFixed(2),
    totalActual: totalActual.toFixed(2),
    totalDiff: totalDiff.toFixed(2),
    perUnitStandard,
    perUnitActual,
    perUnitDiff
  }
})

// 获取年度数据
const fetchYearlyData = async () => {
  try {
    // 获取年度电力数据
    const electricRes = await getElectricPowerYear()
    if (electricRes.code === 200 && Array.isArray(electricRes.data)) {
      yearlyElectricData.value = electricRes.data
    }
    
    // 获取年度气体数据
    const gasRes = await getGasPower(new Date().toISOString().split('T')[0])
    if (gasRes.code === 200 && Array.isArray(gasRes.data)) {
      yearlyGasData.value = gasRes.data
    }
    
    // 水数据暂时使用电力数据作为示例，实际应该调用水数据接口
    yearlyWaterData.value = electricRes.data || []
    
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
  height: 100%;
}

/* 能耗仪表盘样式 */
.energy-dashboard {
  height: 100%;
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
  flex-direction: column;
}

.section-title {
  color: #00eeff;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 8px;
  text-shadow: 0 0 5px #00eeff;
  border-bottom: 1px solid rgba(0, 238, 255, 0.3);
  padding-bottom: 4px;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  flex: 1;
}

.data-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  border: 1px solid rgba(0, 238, 255, 0.1);
}

.data-label {
  color: #00eeff;
  font-size: 0.7rem;
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
  font-family: 'Orbitron', monospace;
}

/* 不同类型数据的颜色 */
.data-value.electric {
  color: #00eeff;
  text-shadow: 0 0 5px #00eeff;
}

.data-value.gas {
  color: #ff9f00;
  text-shadow: 0 0 5px #ff9f00;
}

.data-value.water {
  color: #00ff9f;
  text-shadow: 0 0 5px #00ff9f;
}

/* 差额颜色 */
.data-value.positive {
  color: #ff6b6b;
  text-shadow: 0 0 5px #ff6b6b;
}

.data-value.negative {
  color: #51cf66;
  text-shadow: 0 0 5px #51cf66;
}

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
    gap: 8px;
  }
  
  .data-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .data-label {
    font-size: 0.7rem;
  }
  
  .data-value {
    font-size: 0.8rem;
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
    font-size: 0.8rem;
  }
  
  .data-value {
    font-size: 0.9rem;
  }
  
  .dashboard-title h2 {
    font-size: 1.4rem;
  }
}
</style>