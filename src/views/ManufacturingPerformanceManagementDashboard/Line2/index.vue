<template>
  <div class="line2-container flex ">
    <!-- 第一行：A类客户合计 -->
    <Row1 />
    
    <!-- 第二行：A类部分涂装TOP前三问题占比 -->
    <Row2 />
    
    <!-- 第三行：A类总装 -->
    <Row3 />
  </div>
</template>

<script setup>
import Row1 from './Row1.vue'
import Row2 from './Row2.vue'
import Row3 from './Row3.vue'
</script>

<style scoped>
.line2-container {
  display: flex;
  gap: 6px;
  height: 100%;
  width: 100%;
}
</style>