<template>
  <body>
<dv-full-screen-container>

  <dv-border-box11 title="浙江阿波罗科技运动有限公司" :title-width="400" >
    <div class="w-full h-[4vh] " ></div>
    <Header></Header>
    <Stock></Stock>
    <Line3></Line3>
    <Line4> </Line4>
  </dv-border-box11>
</dv-full-screen-container>
</body>
</template>


<script setup >

import Header from './Header/index.vue'
import Stock from './Stock/index.vue'
import Line3 from './3line/index.vue'
import Line4 from './4line/index.vue'
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