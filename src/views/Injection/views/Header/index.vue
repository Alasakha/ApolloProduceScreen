<template>
  <div class="relative w-screen h-[10vh] flex justify-center items-center">
    <!-- 背景层 -->
    <div class="absolute inset-0 bg-blue-900 opacity-50"></div>

    <!-- 内容层 -->
    <div class="flex w-full h-full justify-between items-center relative z-10">
      <div class="flex-1 flex justify-center items-center 
      text-3xl font-bold bg-gradient-to-t from-cyan-500 to-white text-transparent bg-clip-text
      tracking-wide">
        {{ dateStr }}
      </div>

      <!-- 标题单独提取，不受 opacity 影响 -->
      <div class="tracking-wide text-5xl font-bold bg-gradient-to-t from-cyan-500 to-white text-transparent bg-clip-text">
        注塑生产管理看板
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