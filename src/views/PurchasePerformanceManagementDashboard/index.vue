<template>
    <body>
  <dv-full-screen-container>
    <dv-border-box11 title="浙江阿波罗科技运动有限公司" :title-width="400" >
      <div class="w-full h-full flex flex-col pl-4 pr-4 gap-4">
        <Header class="h-[20vh]"></Header>
        <Line1 class="h-[18vh]"></Line1>
        <Line2 class="h-[15vh]"></Line2>
        <Line3 class="h-[15vh]"></Line3>
        <Line4 class="h-[20vh]"></Line4>
      </div>
    </dv-border-box11>
  </dv-full-screen-container>
  </body>
  </template>
  
  
<script setup >
import BorderBox from '@/components/datav/BorderBox.vue'
// import Line1 from './Line1/index.vue'
import Header from './header/index.vue'
import Line1 from './Line1/index.vue'
import Line2 from './Line2/index.vue'
import Line3 from './Line3/index.vue'
import Line4 from './Line4/index.vue'
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