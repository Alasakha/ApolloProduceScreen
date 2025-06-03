<template>
  <div class="stamp-container">
    <!-- 已有的顶部信息栏 -->
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <Line1 />
      <Line2 />
      <Line3 />
      <Line4 />
    </div>
  </div>
</template>

<script setup lang="ts">
import Line1 from './management/line1.vue'
import Line2 from './management/line2.vue'
import Line3 from './management/line3.vue'
import Line4 from './management/line4.vue'
</script>

<style scoped>
.stamp-container {
  width: 100%;
  min-height: 100vh;
  background: #001529;
  padding: 1rem;
}

.main-content {
  margin-top: 1rem;
}
</style> 