<template>
  <div class="grid grid-rows-2 gap-4 h-full">

        <!-- 点检统计分析 -->
        <DashboardCard class="flex-1">
      <template #title>故障统计分析</template>
      <Statistic/>
    </DashboardCard>
       <!-- 设备状态 -->
       <DashboardCard class="flex-1">
      <template #title>故障类型统计</template>
      <div><Category/></div>
    </DashboardCard>


 

  </div>
</template>

<script setup lang="ts">
import DashboardCard from "@/components/DashboardCard.vue";
import Category from './Category/index.vue'
import Statistic from './Statistic/index.vue'
</script>