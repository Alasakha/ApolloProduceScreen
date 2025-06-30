<template>
  <div class="order-card-glow">
    <!-- 梯形标题 -->
    <div class="order-card-title">
      <span>{{ orderName }}</span>
    </div>
    <!-- 右上角角标 -->
    <div v-if="status" class="order-card-badge">{{ status }}</div>
    <!-- 主体内容 -->
    <div class="order-card-main simple-main">
      <div class="simple-row"><span>开机时长：</span><span>{{ dayRunTime }}</span></div>
      <div class="simple-row"><span>激光功率：</span><span>{{ pparams }} kW</span></div>
      <div class="simple-row"><span>切割速度：</span><span>{{ spen }}</span></div>
      <div class="simple-row"><span>计划数：</span><span>{{ totalQty }}</span></div>
      <div class="simple-row"><span>完成数：</span><span>{{ doneQty }}</span></div>
    </div>
  </div>
</template>

<script setup>
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
.simple-main {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 10px 10px 10px;
}
.simple-row {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  color: #fff;
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Microsoft YaHei", "Source Han Sans SC", "Noto Sans SC", Arial, sans-serif;
}
</style>
