<template>
  <div class="grid h-full gap-4 grid-rows-[3fr_2fr] pl-[1vw] pr-[1vw]">
    <!-- 点检统计分析 -->
    <DashboardCard class="">
      <template #title>设备状态</template>
      <div class="flex"><charts></charts></div>
    </DashboardCard>

    <!-- 设备状态 -->
    <DashboardCard class="">
      <template #title>电能</template>  
      <div><Energy></Energy></div>
    </DashboardCard>

  </div>
</template>

<script setup lang="ts">
import DashboardCard from "@/components/DashboardCard.vue";
import charts from './Status/index.vue'
import Energy from './energy/index.vue'
</script>