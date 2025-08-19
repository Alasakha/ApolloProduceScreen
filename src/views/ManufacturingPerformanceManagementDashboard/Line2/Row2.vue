<template>
  <div class="row2-container flex-1">
    <!-- A类客户各部门直通率 -->
    <div class="section-header">
      <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">
        <!-- A类客户各部门直通率 -->
        <span v-if="manufacturingStore.state.loading" class="loading-indicator">加载中...</span>
        <span v-if="manufacturingStore.state.error" class="error-indicator" :title="manufacturingStore.state.error">❌</span>
      </div>
      
      <!-- 月度/年度切换 -->
      <div class="period-toggle">
        <button 
          class="toggle-btn" 
          :class="{ active: currentPeriod === 'monthly' }"
          @click="currentPeriod = 'monthly'"
        >
          月度
        </button>
        <button 
          class="toggle-btn" 
          :class="{ active: currentPeriod === 'yearly' }"
          @click="currentPeriod = 'yearly'"
        >
          年度
        </button>
      </div>
    </div>
    
    <div class="departments-grid">
      <!-- A类客户金工一部涂装 -->
      <div class="department-section">
        <div class="department-title text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base">A类客户金工一部涂装</div>
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">目标</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ currentPaintingData.target }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ currentPaintingData.actual }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">达成率</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAchievementClass(currentPaintingData.achievement)">
              {{ currentPaintingData.achievement }}%
            </div>
          </div>
        </div>
        <!-- <div class="action-buttons">
          <button class="reason-btn" @click="showReasonDialog('painting')">
            填写原因/对策
          </button>
        </div> -->
      </div>

      <!-- A类客户总装一课 -->
      <div class="department-section">
        <div class="department-title text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base">A类客户总装一课</div>
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">目标</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ currentAssemblyCourse1Data.target }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ currentAssemblyCourse1Data.actual }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">达成率</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAchievementClass(currentAssemblyCourse1Data.achievement)">
              {{ currentAssemblyCourse1Data.achievement }}%
            </div>
          </div>
        </div>
        <!-- <div class="action-buttons">
          <button class="reason-btn" @click="showReasonDialog('assembly1')">
            填写原因/对策
          </button>
        </div> -->
      </div>

      <!-- A类客户总装二课 -->
      <div class="department-section">
        <div class="department-title text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base">A类客户总装二课</div>
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">目标</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ currentAssemblyCourse2Data.target }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ currentAssemblyCourse2Data.actual }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">达成率</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAchievementClass(currentAssemblyCourse2Data.achievement)">
              {{ currentAssemblyCourse2Data.achievement }}%
            </div>
          </div>
        </div>
        <!-- <div class="action-buttons">
          <button class="reason-btn" @click="showReasonDialog('assembly2')">
            填写原因/对策
          </button>
        </div> -->
      </div>
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
import { useManufacturingPerformanceStore } from '@/store/manufacturingPerformance'
import ReasonDialog from '@/components/ReasonDialog.vue'

// 使用制造绩效store
const manufacturingStore = useManufacturingPerformanceStore()

// 当前显示周期 (月度/年度)
const currentPeriod = ref('monthly')

// 当前显示的数据
const currentPaintingData = computed(() => {
  return currentPeriod.value === 'monthly' 
    ? manufacturingStore.aCustomerPaintingMonthlyData
    : manufacturingStore.aCustomerPaintingYearlyData
})

const currentAssemblyCourse1Data = computed(() => {
  return currentPeriod.value === 'monthly'
    ? manufacturingStore.aCustomerAssemblyCourse1MonthlyData
    : manufacturingStore.aCustomerAssemblyCourse1YearlyData
})

const currentAssemblyCourse2Data = computed(() => {
  return currentPeriod.value === 'monthly'
    ? manufacturingStore.aCustomerAssemblyCourse2MonthlyData
    : manufacturingStore.aCustomerAssemblyCourse2YearlyData
})

// 获取达成率样式类
const getAchievementClass = (value) => {
  if (value >= 100) return 'achievement-excellent'
  if (value >= 98) return 'achievement-good'
  if (value >= 95) return 'achievement-normal'
  return 'achievement-warning'
}

// 组件挂载时启动数据获取
onMounted(() => {
  manufacturingStore.startAutoRefresh()
})

// 组件卸载时停止自动刷新
onUnmounted(() => {
  manufacturingStore.stopAutoRefresh()
})

// 填写原因对话框状态
const reasonDialogVisible = ref(false)
const currentMetricInfo = ref({})

// 显示填写原因对话框
const showReasonDialog = (type) => {
  let data, name
  const period = currentPeriod.value === 'monthly' ? '月度' : '年度'
  
  switch (type) {
    case 'painting':
      data = currentPaintingData.value
      name = 'A类客户金工一部涂装'
      break
    case 'assembly1':
      data = currentAssemblyCourse1Data.value
      name = 'A类客户总装一课'
      break
    case 'assembly2':
      data = currentAssemblyCourse2Data.value
      name = 'A类客户总装二课'
      break
  }
  
  currentMetricInfo.value = {
    name: `${name}${period}直通率`,
    period: period,
    target: data.target,
    actual: data.actual,
    achievement: data.achievement
  }
  
  reasonDialogVisible.value = true
}

// 处理原因提交
const handleReasonSubmit = (data) => {
  console.log('提交的原因/对策数据:', data)
  // 这里可以调用API保存数据
  // 可以显示成功提示
}
</script>

<style scoped>
.row2-container {
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 6px;
  padding: 8px;
  backdrop-filter: blur(5px);
  color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 4px;
  position: relative;
}

.section-title {
  font-weight: bold;
  color: #00d4ff;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 8px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.loading-indicator {
  color: #ffd700;
  font-size: 10px;
}

.error-indicator {
  color: #ff4444;
  font-size: 12px;
  cursor: help;
}

.period-toggle {
  display: flex;
  gap: 4px;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.toggle-btn {
  padding: 2px 8px;
  border: 1px solid rgba(0, 150, 255, 0.3);
  background: rgba(0, 0, 0, 0.2);
  color: #8cc8ff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 10px;
}

.toggle-btn:hover {
  background: rgba(0, 150, 255, 0.2);
  color: #00d4ff;
}

.toggle-btn.active {
  background: rgba(0, 150, 255, 0.4);
  color: #00d4ff;
  border-color: #00d4ff;
}

.departments-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: calc(100% - 70px);
  flex: 1;
}

.department-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.department-title {
  color: #00d4ff;
  text-align: center;
  margin-bottom: 4px;
  font-weight: bold;
  padding: 3px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.metrics-row {
  display: flex;
  gap: 4px;
  flex: 1;
}

.metric-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  border-left: 2px solid #00d4ff;
  transition: all 0.3s ease;
}

.metric-item:hover {
  background: rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.metric-label {
  color: #8cc8ff;
  margin-bottom: 2px;
  text-align: center;
}

.metric-value {
  color: #fff;
  text-align: center;
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