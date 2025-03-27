<template>

<body>
  <Header></Header>
  <Middle></Middle>
  <Bottom></Bottom>
</body>
</template>

<script setup lang="ts">
import Header from'@/views/Injection/views/Header/index.vue'
import Middle from '@/views/Injection/views/Middle/index.vue'
import Bottom from '@/views/Injection/views/Bottom/index.vue'
</script>


<style scoped>
body{
 width: 100vw;
 height: 100vh;
 background: 
   url('@/assets/screen1.png') no-repeat center center;
 background-size: cover;
 transform-origin: center center;
 position: relative;
 transition: transform 0.3s ease-in-out;
}


</style>