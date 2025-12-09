<template>
  <div class="right-column h-full flex flex-col gap-3">
    <!-- 1. 换型监控 -->
    <div class="section">
      <ModelChangeMonitor />
    </div>

    <!-- 2. 质量数据监控 -->
    <div class="section">
      <QualityMonitor />
    </div>

    <!-- 3. 三个饼图 -->
    <div class="section pie-charts-section">
      <PieChartsGroup />
    </div>

    <!-- 4. 焊接次日生产欠料 -->
    <div class="section flex-1">
      <MaterialShortageCarousel />
    </div>
  </div>
</template>

<script setup lang="ts">
import ModelChangeMonitor from './ModelChangeMonitor.vue'
import QualityMonitor from './QualityMonitor.vue'
import PieChartsGroup from './PieChartsGroup.vue'
import MaterialShortageCarousel from './MaterialShortageCarousel.vue'
</script>

<style scoped>
.right-column {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 8px;
  padding: 12px;
}

.section {
  flex-shrink: 0;
}

.pie-charts-section {
  min-height: 200px;
}
</style>

