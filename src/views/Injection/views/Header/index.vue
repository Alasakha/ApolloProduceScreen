<template>
  <div class=" w-screen h-[7vh] flex justify-center items-center">
    <!-- 背景层 -->

    <!-- 内容层 -->
    
      
   <div class="flex-1 flex justify-center items-center  ">
      <img src="@/assets/APOLLO.png" alt="" class="w-[50%]">
      </div>
     
   
      
      <!-- 标题单独提取，不受 opacity 影响 -->
      <div class="tracking-wide text-5xl font-bold bg-gradient-to-t from-cyan-500 to-white text-transparent bg-clip-text
      flex  justify-center items-end flex-1">
        <div class="tracking-widest">注塑生产管理看板</div>
    </div>
  
   
      <div class="flex-1 flex justify-center items-center justify-around
      text-3xl font-bold bg-gradient-to-t from-cyan-500 to-white text-transparent bg-clip-text
      tracking-wide w-full h-full pl-4 pr-4 ">
      <dv-border-box1 >
        <div class="text-xl flex justify-around  item-center text-white flex-col w-full h-full">
         
          {{ dateStr }}
          <div class="flex justify-center ">
            <Time></Time>
          </div>
          
        </div>
         
      </dv-border-box1>
      </div>
    </div>
</template>

<script setup lang="ts">
import Time from './time.vue'
import { useDateTime } from "./time";
const { dateStr } = useDateTime();
</script>

<style></style>