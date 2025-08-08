<template>
  <div class="bottom-container">
    <!-- 三个柱状图 -->
    <div class="charts-container">
      <Chart1 class="chart-item" />
      <Chart2 class="chart-item" />
      <Chart3 class="chart-item" />
    </div>
  </div>
</template>

<script setup>
import Chart1 from './Chart1.vue'
import Chart2 from './Chart2.vue'
import Chart3 from './Chart3.vue'
</script>

<style scoped>
.bottom-container {
  height: 100%;
  color: #fff;
}

.charts-container {
  display: flex;
  gap: 8px;
  height: 100%;
}

.chart-item {
  flex: 1;
  height: 100%;
}
</style>