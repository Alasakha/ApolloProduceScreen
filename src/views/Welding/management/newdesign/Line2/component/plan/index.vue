<template>
  <div class="plan-container">
    <!-- 生产计划进度 -->
    <div class="section">
      <div class="section-title">生产计划进度</div>
      <div class="data-items">
        <div class="data-item">
          <span class="label">月度计划数</span>
          <span class="value">{{ monthlyPlan }}</span>
        </div>
        <div class="data-item">
          <span class="label">已完成数</span>
          <span class="value">{{ monthlyCompleted }}</span>
        </div>
        <div class="data-item">
          <span class="label">完成率</span>
          <span class="value">{{ monthlyRate }}%</span>
        </div>
      </div>
    </div>

    <!-- 日计划完成情况 -->
    <div class="section">
      <div class="section-title">日计划完成情况</div>
      <div class="data-items">
        <div class="data-item">
          <span class="label">计划数</span>
          <span class="value">{{ dailyPlan }}</span>
        </div>
        <div class="data-item">
          <span class="label">已完成数</span>
          <span class="value">{{ dailyCompleted }}</span>
        </div>
        <div class="data-item">
          <span class="label">完成率</span>
          <span class="value">{{ dailyRate }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Mock 数据
const monthlyPlan = ref(1200)
const monthlyCompleted = ref(980)
const monthlyRate = ref(82)

const dailyPlan = ref(45)
const dailyCompleted = ref(38)
const dailyRate = ref(84)
</script>

<style scoped>
.plan-container {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-between;
  overflow: hidden;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-height: 0;
}

.section-title {
  color: #72f0f5;
  font-size: 13px;
  font-weight: 600;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(114, 240, 245, 0.3);
  line-height: 1.2;
}

.data-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  flex: 1;
}

.data-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(114, 240, 245, 0.1);
  border: 1px solid rgba(114, 240, 245, 0.3);
  border-radius: 4px;
  min-width: 80px;
  flex: 1;
  transition: all 0.3s ease;
}

.data-item:hover {
  background: rgba(114, 240, 245, 0.2);
  border-color: rgba(114, 240, 245, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(114, 240, 245, 0.2);
}

.data-item .label {
  color: #72f0f5;
  font-size: 11px;
  font-weight: 400;
  opacity: 0.9;
  line-height: 1.2;
}

.data-item .value {
  color: #72f0f5;
  font-size: 16px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(21, 101, 192, 0.3);
  line-height: 1.2;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .plan-container {
    padding: 6px 10px;
    gap: 8px;
  }
  
  .section-title {
    font-size: 12px;
  }
  
  .data-items {
    gap: 6px;
  }
  
  .data-item {
    padding: 5px 10px;
    min-width: 70px;
  }
  
  .data-item .label {
    font-size: 10px;
  }
  
  .data-item .value {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .plan-container {
    padding: 5px 8px;
    gap: 6px;
  }
  
  .data-items {
    flex-direction: column;
    align-items: stretch;
  }
  
  .data-item {
    flex-direction: row;
    justify-content: space-between;
    padding: 6px 10px;
  }
}
</style>
