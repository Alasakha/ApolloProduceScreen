<template>
  <div class="left-content h-full flex  gap-4">
    <!-- 生产计划图表 -->
        <div class="flex-1">
          <daohuo/>
         
        </div>
        <div class="flex-1">
          <Ruku/>
        </div>
        <div class="flex-1">
          <ZaiTu/>
        </div>
  </div>
</template>


<script setup lang="ts">
import ZaiTu from '@/views/Metalworking/LineTwo/views/charts/charts2.vue';
import daohuo from './charts/charts.vue';
import Ruku from '@/views/Metalworking/LineFour/views/charts/charts2.vue';
</script>

<style scoped>
.left-content {
  width: 100%;
  height: 100%;
  padding: 10px;
}
</style>
