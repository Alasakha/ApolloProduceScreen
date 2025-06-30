<template>

<body>
  <dv-border-box11 title="浙江阿波罗运动科技股份有限公司" :title-width="400" :animate="false">
      <div dv-bg>
        <div class="w-full h-[5vh]"></div>
        <Header></Header>
        <Line2></Line2>
        <!-- <Middle></Middle> -->

        <Bottom></Bottom>
      </div>
    </dv-border-box11>
</body>
</template>

<script setup lang="ts">
import Header from'@/views/Injection/views/Header/index.vue'
// import Middle from '@/views/Injection/views/Middle/index.vue'
import Bottom from '@/views/Injection/views/Bottom/index.vue'
import Line2 from './Line2/index.vue'
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