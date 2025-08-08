<template>
  <div class="line4-container">
    <!-- Part1: A类客户订单准交率 -->
    <div class="part-section">
      <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">A类客户订单准交率</div>
      <div class="metrics-content">
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">目标</div>
            <div class="metric-value target text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.aCustomer.target }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">已入库工单数</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.aCustomer.stockOrders }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">准交工单数</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.aCustomer.onTimeOrders }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">准交率</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getDeliveryClass(deliveryData.aCustomer.onTimeRate)">
              {{ deliveryData.aCustomer.onTimeRate }}%
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
              {{ deliveryData.aCustomer.todayRate }}%
            </div>
          </div>
          <div class="action-item">
            <button class="action-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="viewDetails('aCustomer')">
              查看详情/填写原因对策
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Part2: 常规客户订单准交率 -->
    <div class="part-section">
      <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">常规客户订单准交率</div>
      <div class="metrics-content">
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">目标</div>
            <div class="metric-value target text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.regularCustomer.target }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">已入库工单数</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.regularCustomer.stockOrders }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">准交工单数</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.regularCustomer.onTimeOrders }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">准交率</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getDeliveryClass(deliveryData.regularCustomer.onTimeRate)">
              {{ deliveryData.regularCustomer.onTimeRate }}%
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
              {{ deliveryData.regularCustomer.todayRate }}%
            </div>
          </div>
          <div class="action-item">
            <button class="action-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="viewDetails('regularCustomer')">
              查看详情/填写原因对策
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Part3: 制造费用占比 -->
    <div class="part-section">
      <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">制造费用占比</div>
      <div class="metrics-content">
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">目标</div>
            <div class="metric-value target text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.manufacturingCost.target }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际制费</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.manufacturingCost.actualCost }}万</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际收入</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ deliveryData.manufacturingCost.actualRevenue }}万</div>
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
            <button class="action-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="viewDetails('manufacturingCost')">
              查看详情/填写原因对策
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Mock数据
const deliveryData = ref({
  aCustomer: {
    target: 95.0,
    stockOrders: 125,
    onTimeOrders: 118,
    onTimeRate: 94.4,
    plannedToday: 45,
    actualToday: 42,
    todayRate: 93.3
  },
  regularCustomer: {
    target: 90.0,
    stockOrders: 89,
    onTimeOrders: 82,
    onTimeRate: 92.1,
    plannedToday: 32,
    actualToday: 29,
    todayRate: 90.6
  },
  manufacturingCost: {
    target: 12.5,
    actualCost: 186.7,
    actualRevenue: 1453.2,
    actualRatio: 12.8
  }
})

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
</script>

<style scoped>
.line4-container {
  display: flex;
  gap: 8px;
  height: 100%;
  color: #fff;
}

.part-section {
  flex: 1;
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 6px;
  padding: 8px;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
}

.section-title {
  /* font-size: 11px; */
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 6px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 3px;
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

/* 响应式调整 */
@media (max-width: 1200px) {
  .metric-label {
    /* font-size: 7px; */
  }
  
  .metric-value {
    /* font-size: 10px; */
  }
  
  .action-btn {
    /* font-size: 6px; */
    padding: 2px 4px;
  }
}
</style>