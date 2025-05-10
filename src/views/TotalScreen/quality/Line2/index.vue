<template>
    <!-- 留出标题的高度 -->
     <!-- <div class="h-[3vh] w-full flex justify-center items-center"></div> -->
    <div class="h-[40vh] w-full flex justify-center items-center pl-1 mt-8 gap-4">
        <Left></Left>
        <Middle></Middle>
        <Right></Right>
    </div>
  </template>
  
  <script setup lang="ts">
import Left from './views/left.vue'
import Middle from './views/middle.vue'
import Right from './views/right.vue'
  </script>
  
  <style scoped>
  
  </style>