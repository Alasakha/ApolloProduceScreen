<template>
  <div class="part1-container flex-1">
    <!-- 常规客户总直通率 -->
    <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">
      常规客户
      <span v-if="loading" class="loading-indicator">加载中...</span>
      <span v-if="error" class="error-indicator" :title="error">❌</span>
    </div>
    
    <!-- 年度和月度数据放在同一行 -->
    <div class="data-row h-[30%]">

      <!-- 月度数据 -->
      <div class="data-section">
        <div class="period-title">
          <span class="text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-sm">月度总直通率</span>
          <div class="action-buttons">
            <button class="detail-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showDetail">查看详情</button>
            <button class="reason-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showReasonDialog">填写原因/对策</button>
          </div>
        </div>
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">目标</div>
            <div class="metric-value text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl font-bold">{{ regularData.totalPassRate.target }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际</div>
            <div class="metric-value text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl font-bold">{{ regularData.totalPassRate.actual }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">达成率</div>
            <div class="metric-value text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl font-bold" :class="getAchievementClass(regularData.totalPassRate.achievement)">
              {{ regularData.totalPassRate.achievement }}%
            </div>
          </div>
        </div>
      </div>

      <!-- 年度数据 -->
      <div class="data-section">
        <div class="period-title">
          <span class="text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base">年度总直通率</span>
          <div class="header-actions">
            <button class="detail-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showAnnualDetail">查看详情</button>
          </div>
        </div>
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">年度目标</div>
            <div class="metric-value text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl font-bold">{{ regularData.annualData.target }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">年度累计</div>
            <div class="metric-value text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl font-bold">{{ regularData.annualData.plan }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">达成率</div>
            <div class="metric-value text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl font-bold" :class="getAchievementClass(regularData.annualData.achievement)">
              {{ regularData.annualData.achievement }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="showDetailDialog" class="dialog-overlay" @click="closeDetail">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>常规客户总直通率详情</h3>
          <button class="close-btn" @click="closeDetail">×</button>
        </div>
        <div class="dialog-body">
          <div class="detail-item">
            <span class="detail-label">当前目标：</span>
            <span class="detail-value">{{ regularData.totalPassRate.target }}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">实际完成：</span>
            <span class="detail-value">{{ regularData.totalPassRate.actual }}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">达成情况：</span>
            <span class="detail-value" :class="getAchievementClass(regularData.totalPassRate.achievement)">
              {{ regularData.totalPassRate.achievement }}%
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">差值：</span>
            <span class="detail-value">{{ (regularData.totalPassRate.actual - regularData.totalPassRate.target).toFixed(1) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 年度详情弹窗 -->
    <div v-if="showAnnualDetailDialog" class="dialog-overlay" @click="closeAnnualDetail">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>常规客户年度数据详情</h3>
          <button class="close-btn" @click="closeAnnualDetail">×</button>
        </div>
        <div class="dialog-body">
          <div class="detail-item">
            <span class="detail-label">年度目标：</span>
            <span class="detail-value">{{ regularData.annualData.target }}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">年度计划：</span>
            <span class="detail-value">{{ regularData.annualData.plan }}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">达成情况：</span>
            <span class="detail-value" :class="getAchievementClass(regularData.annualData.achievement)">
              {{ regularData.annualData.achievement }}%
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">差值：</span>
            <span class="detail-value">{{ (regularData.annualData.plan - regularData.annualData.target).toFixed(1) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="data-row h-full w-full">
      <chart3></chart3>
      <!-- <chart3></chart3> -->
    </div>
    <!-- 填写原因对话框 -->
    <ReasonDialog
      :visible="reasonDialogVisible"
      :metric-info="currentMetricInfo"
      @close="reasonDialogVisible = false"
      @submit="handleReasonSubmit"
      :code="code"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useProductionDataStore } from '@/store/productionData'
import ReasonDialog from '@/components/ReasonDialog.vue'
import { fillInReason } from '@/api/produceperformance'
import { ElMessage } from 'element-plus'
import Chart3 from '../Bottom/Chart3.vue'
const code = 'FTY_NORMAL_MONTH'
// 使用 Pinia store
const productionStore = useProductionDataStore()

// 计算属性：处理后的客户数据
const regularData = computed(() => {
  // 月度数据（常规客户总直通率）- 使用store中的数据
  const totalPassRate = {
    target: productionStore.monthlyNormalTarget,
    actual: productionStore.monthlyNormalActual,
    achievement: productionStore.monthlyNormalAchievement
  }
  
  // 年度数据（常规客户年度数据）- 使用store中的数据
  const annualData = {
    target: productionStore.yearlyNormalTarget,
    plan: productionStore.yearlyNormalActual,
    achievement: productionStore.yearlyNormalAchievement
  }

  return { totalPassRate, annualData }
})

// 弹窗状态
const showDetailDialog = ref(false)
const showAnnualDetailDialog = ref(false)
const reasonDialogVisible = ref(false)
const currentMetricInfo = ref({})

// 获取达成率样式类
const getAchievementClass = (value) => {
  if (value >= 100) return 'achievement-excellent'
  if (value >= 98) return 'achievement-good'
  if (value >= 95) return 'achievement-normal'
  return 'achievement-warning'
}

// 显示详情
const showDetail = () => {
  showDetailDialog.value = true
}

// 关闭详情
const closeDetail = () => {
  showDetailDialog.value = false
}

// 显示年度详情
const showAnnualDetail = () => {
  showAnnualDetailDialog.value = true
}

// 关闭年度详情
const closeAnnualDetail = () => {
  showAnnualDetailDialog.value = false
}

// 显示原因对策弹窗
const showReasonDialog = () => {
  currentMetricInfo.value = {
    name: '常规客户总直通率',
    period: '月度',
    target: regularData.value.totalPassRate.target,
    actual: regularData.value.totalPassRate.actual,
    achievement: regularData.value.totalPassRate.achievement
  }
  reasonDialogVisible.value = true
}

// 处理原因提交
const handleReasonSubmit = (data) => {
  fillInReason(code, data.reason, data.solution).then(res => {
    if (res.code === 200) {
      ElMessage.success('提交成功')
    } else {
      ElMessage.error('提交失败')
    }
  })
}

// 组件挂载时启动store的自动刷新
onMounted(() => {
  productionStore.startAutoRefresh()
})

// 组件卸载时停止自动刷新
onUnmounted(() => {
  productionStore.stopAutoRefresh()
})
</script>

<style scoped>
.part1-container {
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

.section-title {
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 8px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 4px;
}

.data-row {
  display: flex;
  gap: 6px;
  margin-bottom: 3px;
}

.data-section {
  flex: 1;
  margin-bottom: 0;
}

.period-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  padding-bottom: 2px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.2);
}

.period-title span {
  color: #00d4ff;
  font-weight: bold;
}

.action-buttons,
.header-actions {
  display: flex;
  gap: 4px;
}

.detail-btn,
.reason-btn {
  padding: 2px 4px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.detail-btn {
  background: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
  border: 1px solid rgba(0, 212, 255, 0.3);
}

.detail-btn:hover {
  background: rgba(0, 212, 255, 0.3);
  border-color: #00d4ff;
}

.reason-btn {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
  border: 1px solid rgba(0, 255, 136, 0.3);
}

.reason-btn:hover {
  background: rgba(0, 255, 136, 0.3);
  border-color: #00ff88;
}

.metrics-row {
  display: flex;
  justify-content: space-between;
  gap: 6px;
  align-items: center;
}

.metric-item {
  flex: 1;
  text-align: center;
  padding: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.metric-label {
  height: 30%;
  color: #8cc8ff;
  margin-bottom: 2px;
}

.metric-value {
  height: 70%;
  font-weight: bold;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
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

.loading-indicator {
  color: #00d4ff;
  font-size: 10px;
  margin-left: 8px;
  animation: pulse 1.5s infinite;
}

.error-indicator {
  margin-left: 8px;
  cursor: pointer;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* 弹窗样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background: rgba(0, 30, 60, 0.95);
  border: 1px solid rgba(0, 150, 255, 0.5);
  border-radius: 8px;
  padding: 20px;
  min-width: 400px;
  max-width: 500px;
  backdrop-filter: blur(10px);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 10px;
}

.dialog-header h3 {
  color: #00d4ff;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #ff6666;
}

.dialog-body {
  color: #fff;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.detail-label {
  color: #8cc8ff;
}

.detail-value {
  font-weight: bold;
}
</style>