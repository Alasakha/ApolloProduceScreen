<template>
  <div class="quality-metrics">
    <div class="component-header">
      <div class="header-icon">✅</div>
      <div class="header-title">产品质量</div>
    </div>
    
    <div class="content-area">
      <!-- 常规客户总直通率 -->
      <div class="total-passrate-section">
        <div class="section-header">
          <div class="section-title">常规客户总直通率</div>
          <!-- <div class="header-actions">
            <button class="detail-btn" @click="showDetail">查看详情</button>
            <button class="reason-btn" @click="showReasonDialog">填写原因/对策</button>
          </div> -->
        </div>
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label">目标</div>
            <div class="metric-value">{{ regularData.totalPassRate.target }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">实际</div>
            <div class="metric-value">{{ regularData.totalPassRate.actual }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">达成率</div>
            <div class="metric-value" :class="getAchievementClass(regularData.totalPassRate.achievement)">
              {{ regularData.totalPassRate.achievement }}%
            </div>
          </div>
        </div>
      </div>

      <!-- 常规客户年度数据 -->
      <div class="annual-data-section">
        <div class="section-header">
          <div class="section-title">常规客户年度数据</div>
          <!-- <div class="header-actions">
            <button class="detail-btn" @click="showAnnualDetail">查看详情</button>
          </div> -->
        </div>
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label">年度目标</div>
            <div class="metric-value">{{ regularData.annualData.target }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">年度累计</div>
            <div class="metric-value">{{ regularData.annualData.plan }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">达成率</div>
            <div class="metric-value" :class="getAchievementClass(regularData.annualData.achievement)">
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
            <span class="detail-label">年度累计：</span>
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

    <!-- 填写原因对话框 -->
    <ReasonDialog
      :visible="reasonDialogVisible"
      :metric-info="currentMetricInfo"
      @close="reasonDialogVisible = false"
      @submit="handleReasonSubmit"
    />
    
    <!-- SVG渐变定义 -->
    <svg width="0" height="0">
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:var(--primary-blue);stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProductionDataStore } from '@/store/productionData'
import ReasonDialog from '@/components/ReasonDialog.vue'
import { fillInReason } from '@/api/produceperformance'

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



// 模拟数据更新
onMounted(() => {
  productionStore.startAutoRefresh()
  
  // 移除未使用的模拟数据更新逻辑
  // 数据现在通过 Pinia store 自动更新
})

// 组件卸载时停止自动刷新
onUnmounted(() => {
  productionStore.stopAutoRefresh()
})
</script>

<style scoped>
.quality-metrics {
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 常规客户总直通率和年度数据样式 */
.total-passrate-section,
.annual-data-section {
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 6px;
  padding: 10px;
  backdrop-filter: blur(5px);

}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 6px;
}

.section-title {
  font-weight: bold;
  color: var(--primary-blue);
  flex: 1;
  text-align: left;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.metrics-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
}

.metric-item {
  flex: 1;
  text-align: center;
  padding: 8px 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  border-left: 3px solid var(--primary-blue);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 60px;
}

.metric-label {
  color: var(--text-secondary);
  margin-bottom: 4px;
  font-size: 11px;
}

.metric-value {
  font-weight: bold;
  color: var(--text-primary);
  font-size: 14px;
}

.detail-btn,
.reason-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 10px;
}

.detail-btn {
  background: rgba(0, 212, 255, 0.2);
  color: var(--primary-blue);
  border: 1px solid var(--primary-blue);
}

.detail-btn:hover {
  background: rgba(0, 212, 255, 0.3);
  transform: translateY(-1px);
}

.reason-btn {
  background: rgba(255, 165, 0, 0.2);
  color: var(--warning);
  border: 1px solid var(--warning);
}

.reason-btn:hover {
  background: rgba(255, 165, 0, 0.3);
  transform: translateY(-1px);
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
  color: var(--primary-blue);
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
  color: var(--text-primary);
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
  color: var(--text-secondary);
}

.detail-value {
  font-weight: bold;
}

/* 达成率颜色样式 */
.achievement-excellent {
  color: var(--success);
}

.achievement-good {
  color: var(--primary-blue);
}

.achievement-normal {
  color: var(--text-primary);
}

.achievement-warning {
  color: var(--error);
}

.component-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px;
  background: rgba(0, 212, 255, 0.1);
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}

.header-icon {
  font-size: 20px;
}

.header-title {
  color: var(--primary-blue);
  font-size: 16px;
  font-weight: 600;
  flex: 1;
}



.content-area {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.metric-card {
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.section-title {
  color: var(--primary-blue);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

</style> 