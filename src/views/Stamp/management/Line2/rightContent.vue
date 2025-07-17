<template>
    <div class="line2-container h-[60%]">
      <div class="w-full grid grid-cols-2 gap-4">
       <div class="flex flex-col">
        <DataCard
          v-for="(device) in devices1"
          :key="device.frame"
          :frame="device.frame"
          :customer-no="device.customerNo"
          :model-spec="device.modelSpec"
          :plan-count="device.planCount"
          :auto-weld-progress="device.autoWeldProgress"
          :manual-weld-count="device.manualWeldCount"
          :catogory="device.catogory"
        />
      </div>
      <div class="flex flex-col">
        <DataCard
          v-for="(device) in devices2"
          :key="device.frame"
          :frame="device.frame"
          :customer-no="device.customerNo"
          :model-spec="device.modelSpec"
          :plan-count="device.planCount"
          :auto-weld-progress="device.autoWeldProgress"
          :manual-weld-count="device.manualWeldCount"
          :catogory="device.catogory"
        />
      </div>
      <!-- <div class="flex flex-col">
        <DataCard
          v-for="(device) in devices3"
          :key="device.frame"
          :frame="device.frame"
          :customer-no="device.customerNo"
          :model-spec="device.modelSpec"
          :plan-count="device.planCount"
          :auto-weld-progress="device.autoWeldProgress"
          :manual-weld-count="device.manualWeldCount"
          :catogory="device.catogory"
        />
      </div> -->
       </div>

    </div>
  </template>   
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import DataCard from '@/components/Stamp/DataCard2.vue'
  


  const devices1 = ref([
  {
      catogory: '车架大梁左',
      frame: '1号站节拍测量',
      customerNo: 'CUS20240301-001',
      modelSpec: 'A型/标准',
      planCount: 100,
      autoWeldProgress: 80,
      manualWeldCount: 5,
      planNum:10,
    },
    {
      catogory: '车架',
      frame: '2号站节拍测量',
      customerNo: 'CUS20240301-002',
      modelSpec: 'B型/加长',
      planCount: 120,
      autoWeldProgress: 95,
      manualWeldCount: 2,
      planNum:10,
    },
      {
        catogory: '车架',
        frame: '3号站节拍测量',
        customerNo: 'CUS20240301-003',
        modelSpec: 'A型/特制',
        planCount: 80,
        autoWeldProgress: 75,
        manualWeldCount: 2,
        planNum:10,
      },
      {
        catogory: '车架',
        frame: '3号站节拍测量',
        customerNo: 'CUS20240301-003',
        modelSpec: 'A型/特制',
        planCount: 80,
        autoWeldProgress: 75,
        manualWeldCount: 2,
        planNum:10,
      },
  ])

  const devices2 = ref([
    {
      catogory: '车架',
      frame: '1号站节拍测量',
      customerNo: 'CUS20240301-001',
      modelSpec: 'A型/标准',
      planCount: 100,
      autoWeldProgress: 80,
      manualWeldCount: 5,
      planNum:10,
    },
    {
      catogory: '车架',
      frame: '2号站节拍测量',
      customerNo: 'CUS20240301-002',
      modelSpec: 'B型/加长',
      planCount: 120,
      autoWeldProgress: 95,
      manualWeldCount: 3,
      planNum:10
    },
      {
        catogory: '车架',
        frame: '3号站节拍测量',
        customerNo: 'CUS20240301-003',
        modelSpec: 'A型/特制',
        planCount: 80,
        autoWeldProgress: 75,
        manualWeldCount: 2,
        planNum:10,
      },
      {
        catogory: '车架',
        frame: '3号站节拍测量',
        customerNo: 'CUS20240301-003',
        modelSpec: 'A型/特制',
        planCount: 80,
        autoWeldProgress: 75,
        manualWeldCount: 2,
        planNum:10,
      },
  ])
  </script>
  
  <style scoped>
  .line2-container {
    padding: 0.5rem 0.5rem 0 0;
    width: 100%;
  }
  </style> 