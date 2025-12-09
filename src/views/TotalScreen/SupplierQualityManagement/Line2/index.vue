<template>
    <!-- 留出标题的高度 -->
     <!-- <div class="h-[3vh] w-full flex justify-center items-center"></div> -->
    <div class="h-[40vh] w-full flex justify-center items-center pl-4 pr-4 mt-2 gap-4">
        <div class="flex-[2] h-full">
            <Left></Left>
        </div>
        <!-- <Middle></Middle> -->
        <div class="flex-[3] h-full">
            <Right></Right>
        </div>
        <!-- <MonthAbnormal> </MonthAbnormal>
        <MonthResponsibilty> </MonthResponsibilty> -->
    </div>
  </template>
  
  <script setup lang="ts">
import Left from './views/left.vue'
// import Middle from './views/middle.vue'
import Right from './views/right.vue'
// import MonthAbnormal from './views/mothAbnormal.vue'
// import MonthResponsibilty from './views/monthResponsibilty.vue'
  </script>
  
  <style scoped>
  
  </style>