<template>
  <div class="part2-container">


    <!-- 常规客户金工一部涂装直通率 -->
    <div class="department-section">
      <div class="section-title-with-toggle text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">
        <div class="title-text">常规客户金工一部涂装</div>
        <div class="period-toggle">
          <button 
            class="toggle-btn" 
            :class="{ active: currentPeriod === 'monthly' }"
            @click="currentPeriod = 'monthly'"
          >月度</button>
          <button 
            class="toggle-btn" 
            :class="{ active: currentPeriod === 'yearly' }"
            @click="currentPeriod = 'yearly'"
          >年度</button>
        </div>
      </div>
      <div class="data-cards-row">
        <DataCard 
          title="目标" 
          :value="regularData.painting.target" 
          unit="%" 
          :titleFontSize="0.6"
          :valueFontSize="0.9"
          :squareHeight="70"
          backgroundcolor1="#23A7DC"
          backgroundcolor2="#0a8ebd"
          color="#00FFFF"
        />
        <DataCard 
          title="实际" 
          :value="regularData.painting.actual" 
          unit="%" 
          :titleFontSize="0.6"
          :valueFontSize="0.9"
          :squareHeight="70"
          backgroundcolor1="#23A7DC"
          backgroundcolor2="#0a8ebd"
          color="#00FFFF"
        />
        <DataCard 
          title="达成率" 
          :value="regularData.painting.achievement" 
          unit="%" 
          :titleFontSize="0.6"
          :valueFontSize="0.9"
          :squareHeight="70"
          :backgroundcolor1="getAchievementColor(regularData.painting.achievement).color1"
          :backgroundcolor2="getAchievementColor(regularData.painting.achievement).color2"
          :color="getAchievementColor(regularData.painting.achievement).textColor"
        />
      </div>
      <!-- <div class="action-buttons">
        <button class="reason-btn" @click="showReasonDialog('painting')">
          填写原因/对策
        </button>
      </div> -->
    </div>

    <!-- 常规客户总装一课直通率 -->
    <div class="department-section">
      <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">常规客户总装一课</div>
      <div class="data-cards-row">
        <DataCard 
          title="目标" 
          :value="regularData.assemblyCourse1.target" 
          unit="%" 
          :titleFontSize="0.6"
          :valueFontSize="0.9"
          :squareHeight="70"
          backgroundcolor1="#23A7DC"
          backgroundcolor2="#0a8ebd"
          color="#00FFFF"
        />
        <DataCard 
          title="实际" 
          :value="regularData.assemblyCourse1.actual" 
          unit="%" 
          :titleFontSize="0.6"
          :valueFontSize="0.9"
          :squareHeight="70"
          backgroundcolor1="#23A7DC"
          backgroundcolor2="#0a8ebd"
          color="#00FFFF"
        />
        <DataCard 
          title="达成率" 
          :value="regularData.assemblyCourse1.achievement" 
          unit="%" 
          :titleFontSize="0.6"
          :valueFontSize="0.9"
          :squareHeight="70"
          :backgroundcolor1="getAchievementColor(regularData.assemblyCourse1.achievement).color1"
          :backgroundcolor2="getAchievementColor(regularData.assemblyCourse1.achievement).color2"
          :color="getAchievementColor(regularData.assemblyCourse1.achievement).textColor"
        />
      </div>
      <!-- <div class="action-buttons">
        <button class="reason-btn" @click="showReasonDialog('assembly1')">
          填写原因/对策
        </button>
      </div> -->
    </div>

    <!-- 常规客户总装二课直通率 -->
    <div class="department-section">
      <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">常规客户总装二课</div>
      <div class="data-cards-row">
        <DataCard 
          title="目标" 
          :value="regularData.assemblyCourse2.target" 
          unit="%" 
          :titleFontSize="0.6"
          :valueFontSize="0.9"
          :squareHeight="70"
          backgroundcolor1="#23A7DC"
          backgroundcolor2="#0a8ebd"
          color="#00FFFF"
        />
        <DataCard 
          title="实际" 
          :value="regularData.assemblyCourse2.actual" 
          unit="%" 
          :titleFontSize="0.6"
          :valueFontSize="0.9"
          :squareHeight="70"
          backgroundcolor1="#23A7DC"
          backgroundcolor2="#0a8ebd"
          color="#00FFFF"
        />
        <DataCard 
          title="达成率" 
          :value="regularData.assemblyCourse2.achievement" 
          unit="%" 
          :titleFontSize="0.6"
          :valueFontSize="0.9"
          :squareHeight="70"
          :backgroundcolor1="getAchievementColor(regularData.assemblyCourse2.achievement).color1"
          :backgroundcolor2="getAchievementColor(regularData.assemblyCourse2.achievement).color2"
          :color="getAchievementColor(regularData.assemblyCourse2.achievement).textColor"
        />
      </div>
      <!-- <div class="action-buttons">
        <button class="reason-btn" @click="showReasonDialog('assembly2')">
          填写原因/对策
        </button> -->
    </div>
    
    <!-- 填写原因对话框 -->
    <ReasonDialog
      :visible="reasonDialogVisible"
      :metric-info="currentMetricInfo"
      @close="reasonDialogVisible = false"
      @submit="handleReasonSubmit"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ReasonDialog from '@/components/ReasonDialog.vue'
import DataCard from '@/components/DataCardrow.vue'
import { useManufacturingPerformanceStore } from '@/store/manufacturingPerformance'

const perfStore = useManufacturingPerformanceStore()

// 当前显示周期 (月度/年度)
const currentPeriod = ref('monthly')

// 从 store 映射所需的数据（根据周期切换月度/年度）
const regularData = computed(() => {
  const useMonthly = currentPeriod.value === 'monthly'
  return {
    painting: useMonthly ? perfStore.paintingMonthlyData : perfStore.paintingYearlyData,
    assemblyCourse1: useMonthly ? perfStore.assemblyCourse1MonthlyData : perfStore.assemblyCourse1YearlyData,
    assemblyCourse2: useMonthly ? perfStore.assemblyCourse2MonthlyData : perfStore.assemblyCourse2YearlyData
  }
})

// 获取达成率样式类
const getAchievementClass = (value) => {
  if (value >= 100) return 'achievement-excellent'
  if (value >= 98) return 'achievement-good'
  if (value >= 95) return 'achievement-normal'
  return 'achievement-warning'
}

// 获取达成率颜色配置
const getAchievementColor = (value) => {
  if (value >= 100) {
    return { color1: '#00ff88', color2: '#00cc6a', textColor: '#00ff88' }
  }
  if (value >= 98) {
    return { color1: '#00d4ff', color2: '#0099cc', textColor: '#00d4ff' }
  }
  if (value >= 95) {
    return { color1: '#ffffff', color2: '#cccccc', textColor: '#ffffff' }
  }
  return { color1: '#ff4444', color2: '#cc3333', textColor: '#ff4444' }
}

// 填写原因对话框状态
const reasonDialogVisible = ref(false)
const currentMetricInfo = ref({})

// 显示填写原因对话框
const showReasonDialog = (type) => {
  let data, name
  switch (type) {
    case 'painting':
      data = regularData.value.painting
      name = '常规客户金工一部涂装'
      break
    case 'assembly1':
      data = regularData.value.assemblyCourse1
      name = '常规客户总装一课'
      break
    case 'assembly2':
      data = regularData.value.assemblyCourse2
      name = '常规客户总装二课'
      break
  }
  
  currentMetricInfo.value = {
    name: `${name}直通率`,
    period: currentPeriod.value === 'monthly' ? '月度' : '年度',
    target: data.target,
    actual: data.actual,
    achievement: data.achievement
  }
  reasonDialogVisible.value = true
}

// 处理原因提交
const handleReasonSubmit = (data) => {
  console.log('提交的原因/对策数据:', data)
}

onMounted(() => {
  perfStore.startAutoRefresh()
})

onUnmounted(() => {
  perfStore.stopAutoRefresh()
})
</script>

<style scoped>
.part2-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  color: #fff;
}

.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spacer {
  width: 100px; /* Adjust as needed */
}

.period-toggle {
  display: flex;
  gap: 6px;
}

.toggle-btn {
  padding: 2px 8px;
  background: rgba(0, 150, 255, 0.2);
  color: #00d4ff;
  border: 1px solid rgba(0, 150, 255, 0.5);
  border-radius: 4px;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn.active {
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  color: #fff;
}

.department-section {
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 6px;
  padding: 6px;
  backdrop-filter: blur(5px);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-title {
  justify-content: center;
  align-items: center;
  display: flex;
  /* font-size: 11px; */
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 4px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 3px;
}

.section-title-with-toggle {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 4px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 3px;
}

.data-cards-row {
  display: flex;
  gap: 4px;
  flex: 1;
}

/* 达成率颜色样式 */
.achievement-excellent {
  color: #00ff88;
}

.achievement-good {
  color: #00d4ff;
}

.achievement-normal {
  color: #fff;
}

.achievement-warning {
  color: #ff4444;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 4px;
}

.reason-btn {
  padding: 2px 6px;
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  color: #fff;
  border: none;
  border-radius: 3px;
  font-size: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.reason-btn:hover {
  background: linear-gradient(135deg, #00b8e6 0%, #0088b3 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 212, 255, 0.3);
}
</style>