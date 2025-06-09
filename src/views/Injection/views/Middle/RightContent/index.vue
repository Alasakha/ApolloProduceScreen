<template>
  <div class="grid  h-full">

        <!-- 点检统计分析 -->
        <DashboardCard class="flex-1 h-full">
      <template #title>产品合格率</template>
      <!-- <Statistic/> -->
       <PassRate></PassRate>
    </DashboardCard>
       <!-- 设备状态 -->
       <!-- <DashboardCard class="flex-1">
      <template #title>当日异常次数和占比</template>
      <div><Category/></div>
    </DashboardCard> -->


 

  </div>
</template>

<script setup lang="ts">
import DashboardCard from "@/components/DashboardCard.vue";
import PassRate from '../LeftContent/ProduceRate/index.vue'

// import Statistic from './Statistic/index.vue'
</script>