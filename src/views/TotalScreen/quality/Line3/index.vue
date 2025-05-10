<template>
    <!-- 留出标题的高度 -->
     <!-- <div class="h-[3vh] w-full flex justify-center items-center"></div> -->
    <div class="h-[37vh] w-full flex justify-center items-center pl-1 mt-8 gap-4">
        <LeftContent></LeftContent>
        <RightContent></RightContent>
    </div>
  </template>
  
  <script setup lang="ts">
import LeftContent from './views/leftcontent.vue'
import RightContent from './views/rightcontent.vue'
  </script>
  
  <style scoped>
  
  </style>