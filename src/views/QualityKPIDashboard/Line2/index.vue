<template>
    <!-- 留出标题的高度 -->
     <!-- <div class="h-[3vh] w-full flex justify-center items-center"></div> -->
    <div class="h-[20vh] w-full flex justify-center items-center pl-4 pr-4 mt-1 gap-4">
        <Left></Left>
        <Right></Right>
    </div>
  </template>
  
  <script setup lang="ts">
import Left from './leftcontent.vue'
import Right from './rightcontent.vue'
  </script>
  
  <style scoped>
  
  </style>