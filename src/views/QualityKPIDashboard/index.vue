<template>
    <body>
  <dv-full-screen-container>
    <dv-border-box11 title="浙江阿波罗科技运动有限公司" :title-width="400" >
        <Header></Header>
        <Line1></Line1>

    </dv-border-box11>
  </dv-full-screen-container>
  </body>
  </template>
  
  
<script setup >
import BorderBox from '@/components/datav/BorderBox.vue'
import Line1 from './Line1/index.vue'
import Header from './header/index.vue'
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