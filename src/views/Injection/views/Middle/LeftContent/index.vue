<template>
  <div class="h-full">
    <!-- 点检统计分析 -->
    <DashboardCard class="flex-1 h-full">
  <template #title>生产计划达成率</template>
  <!-- Ensure the parent div takes full height -->
    <PlanCompletedRate></PlanCompletedRate>
</DashboardCard>

    <!-- 设备状态 -->
    <!-- <DashboardCard class="flex-1">
      <template #title>产品合格率</template>
      <PassRate></PassRate>
    </DashboardCard> -->

  </div>
</template>

<script setup lang="ts">
import DashboardCard from "@/components/DashboardCard.vue";
import PlanCompletedRate from '@/views/Injection/views/Middle/LeftContent/ProuceComplete/index.vue'
</script>