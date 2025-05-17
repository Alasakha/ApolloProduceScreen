<template>
  <div class="rate">
    <dv-border-box10>
      <h1>rate</h1>
      <div ref="chartRef" class="chart-container"></div>
    </dv-border-box10>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useEcharts } from '@/utils/useEcharts';
// import {export3DChart} from './charts'

// const chartRef = ref(null);
// const { initChart, setOption } = useEcharts(chartRef);

// const dataList = [
//     {
//         name: '打车费',
//         val: 1230,//存储数据的地方
//         itemStyle: {
//             color: 'rgba(56, 136, 235, 1)',
//         },
//     },
//     {
//         name: '住宿费',
//         val: 300,//存储数据的地方
//         itemStyle: {
//             color: 'rgba(113, 70, 3, 1)',
//         },
//     },
//         {
//         name: '住宿费',
//         val: 300,//存储数据的地方
//         itemStyle: {
//             color: 'rgba(113, 70, 159, 1)',
//         },
//     },
//         {
//         name: '住宿费',
//         val: 300,//存储数据的地方
//         itemStyle: {
//             color: 'rgba(113, 70, 2, 1)',
//         },
//     },
//     {
//         name: '办公费',
//         val: 800,//存储数据的地方
//         itemStyle: {
//             color: 'rgba(237, 171, 87, 1)',
//         },
//     },
//     {
//         name: '差旅费',
//         val: 500,//存储数据的地方
//         itemStyle: {
//             color: 'rgba(231, 89, 77, 1)',
//         },
//     },
// ];
// const option = export3DChart(dataList)


// onMounted(() => {
//   initChart();
  
//   setOption(option);
// });
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>
