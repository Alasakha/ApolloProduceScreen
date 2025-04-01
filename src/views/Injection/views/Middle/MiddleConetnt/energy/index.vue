<template>
  <div class="w-full h-[26vh] bg-cover bg-center flex flex-col justify-center items-center gap-1 p-2">
    <!-- 总耗电量 -->
    <div class="flex flex-col items-center  border border-cyan-400 rounded-lg bg-[#08101b] w-2/3 sm:w-1/2 md:w-1/3">
      <p class="text-base text-cyan-300">当日总耗电量</p>
      <p class="text-lg font-bold text-white">
        5200.50 <span class="text-xs opacity-70">KWH</span>
      </p>
      <p class="text-sm text-gray-300">
        环比: <span class="text-orange-400 font-bold">4% ↑</span>
      </p>
      <div class="top-0 left-0 w-full h-full border border-cyan-400 opacity-40"></div>
    </div>

    <!-- 设备电量列表 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 w-full max-w-lg">
      <div v-for="(device, index) in devices" :key="index" class="relative flex flex-col items-center p-3 border border-cyan-400 rounded-lg bg-[#08101b]">
        <p class="text-sm text-cyan-300">{{ device.name }}</p>
        <p class="text-lg font-bold text-white">{{ device.value }} <span class="text-xs opacity-70">KWH</span></p>
        <p class="text-sm text-gray-300">
          环比: 
          <span :class="device.change > 0 ? 'text-orange-400' : 'text-yellow-400'" class="font-bold">
            {{ Math.abs(device.change) }}% {{ device.change > 0 ? '↑' : '↓' }}
          </span>
        </p>
        <div class="absolute top-0 left-0 w-full h-full border border-cyan-400 opacity-40"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const devices = ref([
  { name: '设备 A', value: 1200.5, change: 3 },
  { name: '设备 B', value: 980.2, change: -2 },
  { name: '设备 C', value: 1500.8, change: 5 },
  { name: '设备 D', value: 1520.0, change: -1 }
]);
</script>
