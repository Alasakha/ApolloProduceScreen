<template>
  <div class="relative w-screen h-[10vh] flex justify-center items-center">
    <!-- 背景层 -->
    <div class="absolute inset-0 "></div>

    <!-- 内容层 -->
    <div class="flex w-full h-full justify-between items-center relative z-10">
      
      <div class="flex-1 flex justify-center items-center justify-around
      text-3xl font-bold bg-gradient-to-t from-cyan-500 to-white text-transparent bg-clip-text
      tracking-wide">
        {{ dateStr }} <img src="@/assets/APOLLO.png" alt="" class="w-[50%]">
      </div>

      <!-- 标题单独提取，不受 opacity 影响 -->
      <div class="tracking-wide text-5xl font-bold bg-gradient-to-t from-cyan-500 to-white text-transparent bg-clip-text
      flex  justify-center items-end flex-1">
        <div>注塑生产管理看板</div>
    </div>
  
      <div class="flex-1 flex justify-center items-center  ">
       <Time></Time>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Time from './time.vue'
import { useDateTime } from "./time";
const { dateStr } = useDateTime();
</script>

<style></style>