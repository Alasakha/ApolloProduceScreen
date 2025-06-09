<template>
  <div class="h-full pl-[1vw] pr-[1vw]">
    <!-- 设备状态 -->
    <DashboardCard class="h-full">
      <template #title>设备状态</template>
      <div class="flex h-full"><charts/></div>
    </DashboardCard>
  </div>
</template>

<script setup lang="ts">
import DashboardCard from "@/components/DashboardCard.vue";
import charts from './Status/index.vue'
</script> 