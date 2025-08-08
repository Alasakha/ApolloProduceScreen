<template>
  <div class="row2-container flex-1">
    <!-- A类客户各部门直通率 -->
    <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">A类客户各部门直通率</div>
    <div class="departments-grid">
      <!-- A类客户金工一部涂装 -->
      <div class="department-section">
        <div class="department-title text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base">A类客户金工一部涂装</div>
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">目标</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ customerData.painting.target }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ customerData.painting.actual }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">达成率</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAchievementClass(customerData.painting.achievement)">
              {{ customerData.painting.achievement }}%
            </div>
          </div>
        </div>
      </div>

      <!-- A类客户总装一课 -->
      <div class="department-section">
        <div class="department-title text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base">A类客户总装一课</div>
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">目标</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ customerData.assemblyCourse1.target }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ customerData.assemblyCourse1.actual }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">达成率</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAchievementClass(customerData.assemblyCourse1.achievement)">
              {{ customerData.assemblyCourse1.achievement }}%
            </div>
          </div>
        </div>
      </div>

      <!-- A类客户总装二课 -->
      <div class="department-section">
        <div class="department-title text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-base">A类客户总装二课</div>
        <div class="metrics-row">
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">目标</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ customerData.assemblyCourse2.target }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ customerData.assemblyCourse2.actual }}%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">达成率</div>
            <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAchievementClass(customerData.assemblyCourse2.achievement)">
              {{ customerData.assemblyCourse2.achievement }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Mock数据
const customerData = ref({
  // A类客户金工一部涂装直通率
  painting: {
    target: 96.0,
    actual: 94.2,
    achievement: 98.1
  },
  // A类客户总装一课直通率
  assemblyCourse1: {
    target: 95.5,
    actual: 96.8,
    achievement: 101.4
  },
  // A类客户总装二课直通率
  assemblyCourse2: {
    target: 94.5,
    actual: 91.3,
    achievement: 96.6
  }
})

// 获取达成率样式类
const getAchievementClass = (value) => {
  if (value >= 100) return 'achievement-excellent'
  if (value >= 98) return 'achievement-good'
  if (value >= 95) return 'achievement-normal'
  return 'achievement-warning'
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

.section-title {
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 8px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 4px;
}

.departments-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: calc(100% - 30px);
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
</style>