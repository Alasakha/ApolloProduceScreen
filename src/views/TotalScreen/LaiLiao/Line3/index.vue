<template>
    <!-- 留出标题的高度 -->
     <!-- <div class="h-[3vh] w-full flex justify-center items-center"></div> -->
    <div class="h-[40vh] w-full flex justify-center items-center pl-2 mt-2 gap-8 pr-2 ">
      <Jianyan class="flex-1"></Jianyan>
      <CuoRou class="flex-1"></CuoRou>
      <!-- <LaiLiao class="flex-2"></LaiLiao>   -->
      <!-- <ZhuangPei class="flex-1"></ZhuangPei>
      <BaoZhuang class="flex-1"></BaoZhuang> -->
   

    </div>
  </template>
  
  <script setup lang="ts">

import CuoRou from './views/CuoRou.vue'
// import LaiLiao from './views/LaiLiao.vue'
// import ZhuangPei from './views/ZhuangPei2.vue'
// import BaoZhuang from './views/BaoZhuang2.vue'
import Jianyan from './views/jianyan.vue'
  </script>
  
  <style scoped>
  
  </style>