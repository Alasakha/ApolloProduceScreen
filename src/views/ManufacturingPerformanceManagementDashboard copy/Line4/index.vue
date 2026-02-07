<template>
  <!-- <div class="line4-container"> -->
    <!-- Part1: A类客户订单准交率 -->
    <!-- <div class="part-section">
      <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">A类客户订单准交率</div>
      <div class="metrics-content">
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">本月目标</div>
            <div class="metric-value target text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.aCustomer.target }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">本月已入库工单数</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.aCustomer.stockOrders }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">本月准交工单数</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.aCustomer.onTimeOrders }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">本月准交率</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getDeliveryClass(deliveryData.aCustomer.onTimeRate)">
              {{ deliveryData.aCustomer.onTimeRate.toFixed(1)}}%
            </div>
          </div>
        </div>
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">今日计划准交数</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.aCustomer.plannedToday }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际准交数</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.aCustomer.actualToday }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">准交率</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getDeliveryClass(deliveryData.aCustomer.todayRate)">
              {{ deliveryData.aCustomer.todayRate.toFixed(1) }}%
            </div>
          </div>
          <div class="action-item">
            <button class="action-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showDailyReasonDialog">
              填写今日原因/对策
            </button>
          </div>
          <div class="action-item">
            <button class="action-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showMonthlyReasonDialog">
              填写本月原因/对策
            </button>
          </div>
        </div>
      </div>
    </div> -->

    <!-- Part2: 常规客户订单准交率 -->
    <!-- <div class="part-section">
      <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">常规客户订单准交率</div>
      <div class="metrics-content">
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">本月目标</div>
            <div class="metric-value target text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.regularCustomer.target }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">本月已入库工单数</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.regularCustomer.stockOrders }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">本月准交工单数</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.regularCustomer.onTimeOrders }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">本月准交率</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getDeliveryClass(deliveryData.regularCustomer.onTimeRate)">
              {{ deliveryData.regularCustomer.onTimeRate.toFixed(1) }}%
            </div>
          </div>
        </div>
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">今日计划准交数</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.regularCustomer.plannedToday }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际准交数</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.regularCustomer.actualToday }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">准交率</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getDeliveryClass(deliveryData.regularCustomer.todayRate)">
              {{ deliveryData.regularCustomer.todayRate.toFixed(1) }}%
            </div>
          </div>
          <div class="action-item">
            <button class="action-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showNormalDailyReasonDialog">
              填写今日原因/对策
            </button>
          </div>
          <div class="action-item">
            <button class="action-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showNormalMonthlyReasonDialog">
              填写本月原因/对策
            </button>
          </div>
        </div>
      </div>
    </div> -->

    <!-- Part3: 制造费用占比 -->
    <!-- <div class="part-section">
      <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">制造费用占比</div>
      <div class="metrics-content">
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">目标</div>
            <div class="metric-value target text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.manufacturingCost.target }}万元</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际制费</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.manufacturingCost.actualCost }}万元</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际收入</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.manufacturingCost.actualRevenue }}万元</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际占比</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getCostClass(deliveryData.manufacturingCost.actualRatio)">
              {{ deliveryData.manufacturingCost.actualRatio }}%
            </div>
          </div>
        </div>
        <div class="metrics-row single-row">
          <div class="action-item full-width">
            <button class="action-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showManufacturingCostDailyReasonDialog()">
              查看详情/填写原因对策
            </button>
          </div>
        </div>
      </div>
    </div>   -->
  <!-- </div> -->
  
  <!-- Part4: 车间直通率月度趋势（点击月度显示 top3 问题） -->
  <div class="part-section">
    <div class="section-title">车间直通率月度目标/实际趋势（按车间分，点击月份查看 top3 问题）</div>
    <div class="workshop-grid">
      <!-- 四列横向并排，每列为一个车间，内含两个紧凑图（A类 & 常规） -->
      <div class="workshop-card" v-for="wk in ['金工一部','金工二部','总装一课','总装二课']" :key="wk">
        <div class="workshop-name">{{ wk }}</div>
        <div class="workshop-mini-grid">
          <WorkshopCombined :workshop="wk" mode="both" :title="`${wk} 目标/实际（A类 & 常规）`" :compact="true" />
        </div>
      </div>
    </div>  
  </div>
  <ReasonDialog
      :visible="reasonDialogVisible"
      :metric-info="currentMetricInfo"
      :code="codeRef"
      @close="reasonDialogVisible = false"
      @submit="handleReasonSubmit"
    />
    <ReasonDialog_produce
      :visible="reasonDialogVisible_produce"
      :metric-info="currentMetricInfo_produce"
      :code="codeRef_produce"
      @close="reasonDialogVisible_produce = false"
      @submit="handleReasonSubmitProduce"
    />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useProductionDataStore } from '@/store/productionData'
import ReasonDialog from '../component/ReasonDialog.vue'
import ReasonDialog_produce from '../component/ReasonDialog_produce.vue'
import { fillInReason } from '@/api/produceperformance'
import WorkshopTrend from './WorkshopTrend.vue'
import WorkshopCombined from './WorkshopCombined.vue'
const reasonDialogVisible = ref(false)
const reasonDialogVisible_produce = ref(false)
const codeRef = ref('')
const codeRef_produce = ref('')
// 使用生产数据store
const productionStore = useProductionDataStore()
const currentMetricInfo = ref({})
const currentMetricInfo_produce = ref({})
// 启动数据获取和自动刷新
onMounted(() => {
  productionStore.startAutoRefresh()
})

// 清理定时器
onUnmounted(() => {
  productionStore.stopAutoRefresh()
})

// 准交率数据 - 使用store中的真实数据
const deliveryData = computed(() => ({
  aCustomer: {
    target: 95.0, // 目标值暂时使用固定值，后续可以从配置获取
    // 月度数据（第一行）
    stockOrders: productionStore.onTimeMonthlyATotal, // 月度工单总数
    onTimeOrders: productionStore.onTimeMonthlyACompleteNum, // 月度已入库工单数
    onTimeRate: productionStore.onTimeMonthlyARate, // 月度准交率
    // 今日数据（第二行）
    plannedToday: productionStore.onTimeDailyATotal, // 今日工单总数
    actualToday: productionStore.onTimeDailyACompleteNum, // 今日已入库工单数
    todayRate: productionStore.onTimeDailyARate // 今日准交率
  },
  regularCustomer: {
    target: 90.0, // 目标值暂时使用固定值
    // 月度数据（第一行）
    stockOrders: productionStore.onTimeMonthlyNormalTotal, // 月度工单总数
    onTimeOrders: productionStore.onTimeMonthlyNormalCompleteNum, // 月度已入库工单数
    onTimeRate: productionStore.onTimeMonthlyNormalRate, // 月度准交率
    // 今日数据（第二行）
    plannedToday: productionStore.onTimeDailyNormalTotal, // 今日工单总数
    actualToday: productionStore.onTimeDailyNormalCompleteNum, // 今日已入库工单数
    todayRate: productionStore.onTimeDailyNormalRate // 今日准交率
  },
  manufacturingCost: {
    target: productionStore.manufacturingCost?.目标 ? productionStore.manufacturingCost.目标.toLocaleString() : '--',
    actualCost: productionStore.manufacturingCost?.实际制造费 ? productionStore.manufacturingCost.实际制造费.toLocaleString() : '--',
    actualRevenue: productionStore.manufacturingCost?.实际收入 ? productionStore.manufacturingCost.实际收入.toLocaleString() : '--',
    actualRatio: productionStore.manufacturingCostRatio || 0
  }
}))

// 去掉旧的ref定义，现在使用computed

// 获取交货率样式类
const getDeliveryClass = (value) => {
  if (value >= 95) return 'delivery-excellent'
  if (value >= 90) return 'delivery-good'
  if (value >= 85) return 'delivery-normal'
  return 'delivery-warning'
}

// 获取成本占比样式类
const getCostClass = (value) => {
  if (value <= 10) return 'delivery-excellent'
  if (value <= 12) return 'delivery-good'
  if (value <= 15) return 'delivery-normal'
  return 'delivery-warning'
}

// 查看详情功能
const viewDetails = (type) => {
  console.log(`查看${type}详情和填写原因对策`)
  // 这里可以实现跳转到详情页面或打开模态框的逻辑
}

// 填写今日原因/对策（A类准交率）
const showDailyReasonDialog = () => {
  currentMetricInfo.value = {
    name: 'A类客户订单准交率',
    period: '今日',
    target: deliveryData.value.aCustomer.target,
    actual: Number(deliveryData.value.aCustomer.onTimeRate.toFixed(1)),
  }
  codeRef.value = 'ONTIME_A_DAY'
  reasonDialogVisible.value = true
}

// 填写本月原因/对策（A类准交率）
const showMonthlyReasonDialog = () => {
  currentMetricInfo.value = {
    name: 'A类客户订单准交率',
    period: '本月',
    target: deliveryData.value.aCustomer.target,
    actual: Number(deliveryData.value.aCustomer.onTimeRate.toFixed(1)),
  }
  codeRef.value = 'ONTIME_A_MONTH'
  reasonDialogVisible.value = true
}

// 填写今日原因/对策（常规准交率）
const showNormalDailyReasonDialog = () => {
  currentMetricInfo.value = {
    name: '常规客户订单准交率',
    period: '今日',
    target: deliveryData.value.regularCustomer.target,
    actual: Number(deliveryData.value.regularCustomer.onTimeRate.toFixed(1)),
  }
  codeRef.value = 'ONTIME_NORMAL_DAY'
  reasonDialogVisible.value = true
}
const showNormalMonthlyReasonDialog = () => {
  currentMetricInfo.value = {
    name: '常规客户订单准交率',
    period: '本月',
    target: deliveryData.value.regularCustomer.target,
    actual: Number(deliveryData.value.regularCustomer.onTimeRate.toFixed(1)),
  }
  codeRef.value = 'ONTIME_NORMAL_MONTH'
  reasonDialogVisible.value = true
}

// 填写今日原因/对策（制造费用占比）
const showManufacturingCostDailyReasonDialog = () => {
  currentMetricInfo_produce.value = {
    name: '制造费用占比',
    period: '今日',
    target: deliveryData.value.manufacturingCost.target,
    actual: Number(deliveryData.value.manufacturingCost.actualRatio.toFixed(1)),
  }
  codeRef_produce.value = 'COST'
  reasonDialogVisible_produce.value = true
}







// 提交原因/对策
const handleReasonSubmit = (data) => {
  fillInReason(codeRef.value, data.reason, data.solution)
    .then((res) => {
      if (res.code === 200) {
        ElMessage.success('提交成功')
      } else {
        ElMessage.error('提交失败')
      }
    })
    .catch(() => {
      ElMessage.error('提交失败')
    })
}

// 提交制造费用占比原因/对策
const handleReasonSubmitProduce = (data) => {
  fillInReason(codeRef_produce.value, data.reason, data.solution)
    .then((res) => {
      if (res.code === 200) {
        ElMessage.success('提交成功')
      } else {
        ElMessage.error('提交失败')
      }
    })
    .catch(() => {
      ElMessage.error('提交失败')
    })
}
</script>

<style scoped>
.line4-container {
  display: flex;
  gap: 8px;
  color: #fff;
  height: 100%;
}

.part-section {
  /* flex: 1; */
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 6px;
  padding: 8px;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  height: 80vh;
}

.section-title {
  /* font-size: 11px; */
  font-weight: bold;
  color: #00d4ff;
  /* margin-bottom: 6px; */
  text-align: center;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 3px;
  font-size: 12px;
}

.metrics-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.metrics-row {
  display: flex;
  gap: 4px;
  flex: 1;
}

.metrics-row.single-row {
  flex: 0;
  margin-top: 2px;
}

.metric-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  border-left: 2px solid #00d4ff;
  transition: all 0.3s ease;
}

.metric-label {
  /* font-size: 8px; */
  color: #8cc8ff;
  margin-bottom: 2px;
  text-align: center;
  line-height: 1.2;
}

.metric-value {
  /* font-size: 11px; */
  font-weight: bold;
  color: #fff;
  text-align: center;
  line-height: 1.1;
}

.metric-value.target {
  color: #00d4ff;
  border-left-color: #00ff88;
}

.action-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-item.full-width {
  flex: 1;
}

.action-btn {
  background: rgba(0, 150, 255, 0.2);
  border: 1px solid rgba(0, 150, 255, 0.5);
  color: #00d4ff;
  padding: 3px 6px;
  border-radius: 3px;
  /* font-size: 7px; */
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  line-height: 1.2;
}

.action-btn:hover {
  background: rgba(0, 150, 255, 0.3);
  border-color: rgba(0, 150, 255, 0.8);
  color: #fff;
  transform: translateY(-1px);
}

.delivery-excellent {
  color: #00ff88;
}

.delivery-good {
  color: #00d4ff;
}

.delivery-normal {
  color: #fff;
}

.delivery-warning {
  color: #ff4444;
}

.workshop-grid {
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-top: 8px;
  flex: 1;
  min-height: 0;
}

.workshop-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(0,0,0,0.05);
  padding: 6px;
  border-radius: 4px;
  min-height: 0;
  width: 100%;
}
.workshop-name {
  color: #8cc8ff;
  font-weight: 600;
  text-align: center;
  font-size: 12px;
}
.workshop-mini-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
  height: 100%;
  min-height: 0;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .metric-label {
    line-height: 1.2;
  }
  
  .metric-value {
    line-height: 1.1;
  }
  
  .action-btn {
    /* font-size: 6px; */
    padding: 2px 4px;
  }
}
</style>