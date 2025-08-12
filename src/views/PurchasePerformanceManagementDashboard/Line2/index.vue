<template>
  <div class="line2-container flex">
    <!-- 分管责任人占比 -->
    <Manager1 />
    
    <!-- 分管责任人占比 -->
    <Manager2 />
    
    <!-- 分管责任人占比 -->
    <Manager3 />
  </div>
</template>

<script setup>
import Manager1 from './Manager1.vue'
import Manager2 from './Manager2.vue'
import Manager3 from './Manager3.vue'
</script>

<style scoped>
.line2-container {
  display: flex;
  gap: 6px;
  height: 100%;
  width: 100%;
}
</style>