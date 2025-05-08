<template>
 <CapacityBarchart flex-1></CapacityBarchart>
 <DailyAbnormalPiecharts flex-1></DailyAbnormalPiecharts>
  </template>
  
  <script setup>

  import CapacityBarchart from './CapacityBarchart.vue'
  import DailyAbnormalPiecharts from './DailyAbnormal.vue'

  </script>
  
  <style scoped>
  .box {
    width: 100vw;
    height: 100vh;
  }
  
  
  
  
  .picture{
    margin-top: 1vh;
    display: flex;
    justify-content: space-around;
  }
  
  </style>
  