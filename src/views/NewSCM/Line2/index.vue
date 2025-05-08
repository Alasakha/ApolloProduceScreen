<template>
    <!-- 留出标题的高度 -->

    <div class="h-[40vh] w-full flex justify-center items-center pl-4 pr-4">
    <Left class="left flex-1"></Left>

    <Right class="right flex-2 flex-col"></Right>  
    </div>
  </template>
  
  <script setup lang="ts">
    import Left from './leftcontent/index.vue'
    import Right from './rightcontent/index.vue'
  </script>
  
  <style scoped>
  
  </style>