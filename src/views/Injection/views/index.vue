<template>

<body>
  <dv-border-box13 title="dv-border-box-13">
      <div dv-bg>
        <Header></Header>
        <Middle></Middle>
        <Bottom></Bottom>
      </div>
    </dv-border-box13>

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
 linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), 
   url('@/assets/background.jpg') no-repeat center center;
 background-size: cover;
 transform-origin: center center;
 position: relative;
 transition: transform 0.3s ease-in-out;
}
</style>