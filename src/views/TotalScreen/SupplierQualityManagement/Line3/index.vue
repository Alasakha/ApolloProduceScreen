<template>
    <!-- 留出标题的高度 -->
     <!-- <div class="h-[3vh] w-full flex justify-center items-center"></div> -->
    <div class="h-[40vh] w-full flex justify-center items-center  pl-4 pr-4 mt-2 gap-4">
      <Jiaodi class="flex-1"></Jiaodi>
      <LaiLiao class="flex-1"></LaiLiao>  


    </div>
  </template>
  
  <script setup lang="ts">

import LaiLiao from './views/LaiLiao.vue'

import Jiaodi from './views/Jiaodi.vue'
  </script>
  
  <style scoped>
  
  </style>