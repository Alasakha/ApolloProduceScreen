<template>
  <div class="line3-container">
    <!-- Part1: 常规客户总直通率和年度数据 -->
    <div class="part-section">
      <Part1 />
    </div>

    <!-- Part2: 常规客户各部门直通率数据 -->
    <div class="part-section">
      <Part2 />
    </div>

    <!-- Part3: 常规客户各部门TOP前三问题占比 -->
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
.line3-container {
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