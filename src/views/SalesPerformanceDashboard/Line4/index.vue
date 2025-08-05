<template>
  <div class="flex gap-4 h-[20vh]">
    <div class="w-2/3 ">
      <LeftContent @update:chartData="updateChartData" />
    </div>
    <div class="w-1/3 ">
      <RightContent :chartData="chartData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftContent from './leftcontent.vue'
import RightContent from './rightcontent.vue'
import { ref } from 'vue'

const chartData = ref<[string, string, number, number][]>([])

const updateChartData = (data: [string, string, number, number][]) => {
  chartData.value = data
}
</script>