<template>
    <div class="h-[35vh] w-full grid grid-cols-3 gap-4 pl-4 pr-4">
        <Chart1></Chart1>
        <Chart2></Chart2>
        <Chart3></Chart3>
    </div>
</template>

<script setup lang="ts">
// import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
// import { useEcharts } from '@/utils/useEcharts'
// import { createOption } from './chart'
import Chart1 from './chart1.vue'
import Chart2 from './chart2.vue'
import Chart3 from './chart3.vue'
</script>