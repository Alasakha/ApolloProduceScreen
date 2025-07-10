<template>
  <div class="order-card-glow">
    <!-- 梯形标题 -->
    <div class="order-card-title">
      <span>{{ orderName }}</span>
    </div>
    <!-- 右上角角标 -->
    <div v-if="status" class="order-card-badge">{{ status }}</div>
    <!-- 主体内容 -->
    <div class="order-card-main">
      <div class="data-grid">
        <!-- 上排三个框 -->
        <div class="data-box">
          <div class="box-label">开机时长</div>
          <div class="box-value">{{ dayRunTime }}</div>
        </div>
        <div class="data-box">
          <div class="box-label">焊接电流</div>
          <div class="box-value">{{ pparams }} kW</div>
        </div>
        <div class="data-box">
          <div class="box-label">焊接电压</div>
          <div class="box-value">{{ spen }}</div>
        </div>
        <!-- 下排两个框 -->
        <div class="data-box">
          <div class="box-label">焊接速度</div>
          <div class="box-value">{{ totalQty }}</div>
        </div>
        <div class="data-box">
          <div class="box-label">计划数</div>
          <div class="box-value">{{ totalQty }}</div>
        </div>
        <div class="data-box">
          <div class="box-label">完成数</div>
          <div class="box-value">{{ doneQty }}</div>
        </div>
      </div>
      <!-- 进度条 -->
      <div class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <div class="progress-text">进度条: {{ progressPercent }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  orderName: {
    type: String,
    default: ""
  },
  totalQty: {
    type: [Number, String],
    default: 0
  },
  doneQty: {
    type: [Number, String],
    default: 0
  },
  status: {
    type: String,
    default: ""
  },
  dayRunTime: {
    type: [Number, String],
    default: "暂无"
  },
  pparams: {
    type: [Number, String],
    default: "暂无"
  },
  spen: {
    type: String,
    default: "暂无"
  }
})

// 计算进度百分比
const progressPercent = computed(() => {
  const total = Number(props.totalQty) || 0
  const done = Number(props.doneQty) || 0
  return total > 0 ? Math.round((done / total) * 100) : 0
})
</script>

<style scoped>
.order-card-glow {
  width: 100%;
  background: rgba(255, 255, 255, 0.13);
  border-radius: 16px;
  box-shadow:
    0 0 24px 4px #2575fc,
    0 0 0 2px #2575fc inset;
  border: 2px solid #2575fc;
  position: relative;
  overflow: visible;
}
.order-card-title {
  width: 100%;
  height: 38px;
  background: linear-gradient(90deg, #2575fc 60%, #00eaff 100%);
  clip-path: polygon(10% 100%, 90% 100%, 100% 0, 0 0);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2px;
  box-shadow: 0 2px 12px #00eaff99;
  position: relative;
  z-index: 2;
}
.order-card-badge {
  position: absolute;
  top: 10px;
  right: 18px;
  background: linear-gradient(135deg, #ffb300 80%, #fffbe6 100%);
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  padding: 4px 16px 4px 12px;
  border-radius: 8px 8px 8px 0;
  box-shadow: 0 2px 8px #ffb30055;
  transform: rotate(12deg);
  z-index: 3;
  border: 1.5px solid #fffbe6;
}
.data-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 10px;
  padding: 15px;
}
.data-box {
  border: 1px solid rgba(124, 231, 253, 0.5);
  border-radius: 4px;
  padding: 8px;
  background: rgba(37, 117, 252, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.box-label {
  font-size: 14px;
  color: rgb(93, 220, 255);
  margin-bottom: 4px;
}
.box-value {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}
.progress-section {
  padding: 0 15px 15px;
}
.progress-bar {
  height: 6px;
  background: rgba(37, 117, 252, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 5px;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffd000, #02da0d);
  transition: width 0.3s ease;
}
.progress-text {
  font-size: 12px;
  color: #ffffff;
  text-align: right;
}
</style>
