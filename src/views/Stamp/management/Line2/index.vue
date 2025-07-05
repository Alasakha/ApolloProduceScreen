<template>
    <div class="line2-container">
      <div class="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <DataCard
          v-for="(device) in devices"
          :key="device.name"
          :order-name="device.name"
          :status="device.status"
          :day-run-time="`${device.runTime}分钟`"
          :pparams="device.power"
          :spen="`${device.speed} m/min`"
          :total-qty="device.plan"
          :done-qty="device.done"
        />
      </div>
    </div>
  </template>   
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import DataCard from '@/components/Stamp/DataCard.vue'
  
  const devices = ref([
    {
      name: '激光割管1号',
      status: '运行',
      runTime: 120,
      power: 80,
      speed: 50,
      plan: 1000,
      done: 800
    },
    {
      name: '激光割管2号',
      status: '运行',
      runTime: 95,
      power: 75,
      speed: 48,
      plan: 1200,
      done: 950
    },
    {
      name: '激光割管3号',
      status: '停机',
      runTime: 0,
      power: 0,
      speed: 0,
      plan: 800,
      done: 750
    },
    {
      name: '激光割管4号',
      status: '运行',
      runTime: 180,
      power: 85,
      speed: 52,
      plan: 1500,
      done: 1200
    },
    {
      name: '激光割管5号',
      status: '运行',
      runTime: 150,
      power: 82,
      speed: 51,
      plan: 1100,
      done: 900
    },
    {
      name: '激光割管6号',
      status: '运行',
      runTime: 200,
      power: 88,
      speed: 53,
      plan: 1300,
      done: 1100
    }
  ])
  </script>
  
  <style scoped>
  .line2-container {
    padding: 0.5rem 0.5rem 0 0;
    width: 100%;
  }
  </style> 