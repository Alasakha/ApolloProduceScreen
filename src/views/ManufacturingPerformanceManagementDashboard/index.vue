<template>
    <body>
  <dv-full-screen-container>
    <dv-border-box11 title="浙江阿波罗科技运动有限公司" :title-width="400" >
      <div class="w-full h-full flex flex-col pl-4 pr-4 gap-4">
        <Header class="h-[20vh]"></Header>
        <Line2 class="h-[18vh]"></Line2>
        <Line3 class="h-[12vh]"></Line3>
        <Line4 class="h-[18vh]"></Line4>
        <Bottom class="h-[20vh]"></Bottom>
      </div>
    </dv-border-box11>
  </dv-full-screen-container>
  </body>
  </template>
  
  
  <script setup >
import Header from './Header/index.vue'
import Line2 from './Line2/index.vue'
import Line3 from './Line3/index.vue'
import Line4 from './Line4/index.vue'
import Bottom from './Bottom/index.vue'
</script>
  
  
  
  <style scoped>
  body{
  width: 100vw;
  height: 100vh;
  background: 
  linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), 
   url('@/assets/background.jpg') no-repeat center center;
  background-size: cover;
  transform-origin: center center;
  position: relative;
  transition: transform 0.3s ease-in-out;
  }
  </style>