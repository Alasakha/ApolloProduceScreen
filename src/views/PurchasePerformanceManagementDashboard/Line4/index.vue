<template>
  <div class="line4-container">
    <!-- Part1: 新供应商开发情况 -->
    <div class="part-section">
      <Part1 />
    </div>

    <!-- Part2: 供应商优化情况 -->
    <div class="part-section">
      <Part2 />
    </div>

    <!-- Part3: E10系统数据状态 -->
    <div class="part-section">
      <Part3 />
    </div>
  </div>
</template>

<script setup>
import Part1 from './Part1.vue'
import Part2 from './Part2.vue'
import Part3 from './Part3.vue'
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
  height: 100%;
}
</style>