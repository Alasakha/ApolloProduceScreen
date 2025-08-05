<template>
  <div class="grid grid-cols-2 gap-4 h-[20vh]">
    <LeftContent @update:chartData="updateChartData" />
    <RightContent :chartData="chartData" />
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