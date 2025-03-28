<template>
  <div class="bg-[url(@/assets/energy.png)] w-full h-[30vh] bg-cover bg-center relative w-full flex justify-center items-center gap-10 p-4 ">
<!-- 总耗电量 -->
<div class="relative flex flex-col items-center p-4 border border-cyan-400 rounded-lg bg-[#08101b]">
      <!-- 设备名称 -->
      <p class="text-lg text-cyan-300">当日总耗电量</p>
      <!-- 数值 -->
      <p class="text-3xl font-bold text-white">1500.10 <span class="text-sm opacity-70">KWH</span></p>
      <!-- 环比 -->
      <p class="text-base text-gray-300">
        环比: <span class="text-orange-400 font-bold">2% ↑</span>
      </p>
      <!-- 科技装饰线 -->
      <div class="absolute top-0 left-0 w-full h-full border border-cyan-400 opacity-40"></div>
    </div>

    <!-- 总耗气量 -->
    <div class="relative flex flex-col items-center p-4 border border-cyan-400 rounded-lg bg-[#08101b]">
      <!-- 设备名称 -->
      <p class="text-lg text-cyan-300">当日总耗气量</p>
      <!-- 数值 -->
      <p class="text-3xl font-bold text-white">780 <span class="text-sm opacity-70">m³</span></p>
      <!-- 环比 -->
      <p class="text-base text-gray-300">
        环比: <span class="text-yellow-400 font-bold">6% ↓</span>
      </p>
      <!-- 科技装饰线 -->
      <div class="absolute top-0 left-0 w-full h-full border border-cyan-400 opacity-40"></div>
    </div>
  </div>
</template>


<script setup >
import {ref} from 'vue'

</script>