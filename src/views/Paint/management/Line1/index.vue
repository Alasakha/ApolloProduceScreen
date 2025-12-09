<template>
    <div class="line2 flex h-[40%] w-full p-4 gap-4">
      <Data></Data>
      <Efficency></Efficency>  
      <!-- 原来的当日小时产能 -->
      <!-- <Eourly></Eourly> -->
      <OneProdLine></OneProdLine>
      <!-- <WorkOrderClosingRate :prod-line="workOrderProdLine" /> -->
    </div>
  </template>
  
  <script setup>
    import { ref } from 'vue'
    import Data from './data.vue'
    import Efficency from './efficiency.vue'
    import OneProdLine from './oneProdLine.vue'
    // import WorkOrderClosingRate from '../components/WorkOrderClosingRate.vue'  
    // import Eourly from './hourlyProduct.vue'
    const workOrderProdLine = ref('金工二部涂装')
  </script>
  
  <style scoped>

  </style>