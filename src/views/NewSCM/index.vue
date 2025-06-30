<script setup>
import { ref, reactive, computed, watch,onMounted } from 'vue';
import Header from './Header/index.vue'
import Line1 from './Line1/index.vue'
import Line2 from './Line2/index.vue'
import Bottom from './Bottom/index.vue'
import { BorderBox11 as DvBorderBox11 } from '@kjgl77/datav-vue3'

onMounted(() => {
  window.dispatchEvent(new Event('resize'));
});
</script>

<template>
<body>
  <dv-full-screen-container>

    <dv-border-box11 title="浙江阿波罗科技运动有限公司" :title-width="400" >

     <Header></Header>
     <Line1></Line1>   
    <Line2></Line2>
    <Bottom></Bottom>
    </dv-border-box11>
  </dv-full-screen-container>
</body>
</template>

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