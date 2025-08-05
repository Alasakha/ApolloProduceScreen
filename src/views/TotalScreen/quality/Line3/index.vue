<template>
    <!-- 留出标题的高度 -->
     <!-- <div class="h-[3vh] w-full flex justify-center items-center"></div> -->
    <div class="h-[37vh] w-full flex justify-center items-center pl-1 mt-8 gap-4">
      <Jianyan class="flex-1"></Jianyan>
      <LaiLiao class="flex-1"></LaiLiao>  
      <ZhuangPei class="flex-1"></ZhuangPei>
      <BaoZhuang class="flex-1"></BaoZhuang>
        <CuoRou class="flex-1"></CuoRou>

    </div>
  </template>
  
  <script setup lang="ts">

import CuoRou from './views/CuoRou.vue'
import LaiLiao from './views/LaiLiao.vue'
import ZhuangPei from './views/ZhuangPei2.vue'
import BaoZhuang from './views/BaoZhuang2.vue'
import Jianyan from './views/jianyan.vue'
  </script>
  
  <style scoped>
  
  </style>