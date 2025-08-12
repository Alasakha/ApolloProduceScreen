<template>
  <div class="line3-container">
    <!-- Part1: PLI新产品采购计划总体情况 -->
    <div class="part-section">
      <Part1 />
    </div>

    <!-- Part2: 按采购工程师分类情况
    <div class="part-section">
      <Part2 />
    </div> -->

    <!-- Part3: PLI项目详细明细
    <div class="part-section">
      <Part3 />
    </div> -->
  </div>
</template>

<script setup>
import Part1 from './Part1.vue'
// import Part2 from './Part2.vue'
// import Part3 from './Part3.vue'
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