<template>
  <div class="grid grid-rows-2 gap-4 h-full">
    <!-- 点检统计分析 -->
    <DashboardCard class="flex-1">
      <template #title>生产计划达成率</template>
      <div>这里放图表或数据...</div>
    </DashboardCard>

    <!-- 设备状态 -->
    <DashboardCard class="flex-1">
      <template #title>产品合格率</template>
      <div>设备数据...</div>
    </DashboardCard>

  </div>
</template>

<script setup lang="ts">
import DashboardCard from "@/components/DashboardCard.vue";
</script>