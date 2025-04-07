<script setup>
import { ref, reactive, computed, watch } from 'vue';
import Header from './Header/index.vue'
import Row from './Row/index.vue'
import Quality from './Quality/index.vue'
import Goods from './Goods/index.vue'
import Bottom from './Bottom/index.vue'

import { BorderBox11 as DvBorderBox11 } from '@kjgl77/datav-vue3'
</script>

<template>
<body>
  <dv-full-screen-container>

    <dv-border-box11 title="浙江阿波罗科技运动有限公司" :title-width="400" >

        <Header></Header>
     <Row class=""></Row>
     <Quality class="pl-4 pr-4"></Quality>
     <Goods class="pl-4 pr-4" ></Goods>
     <Bottom class="pl-4 pr-4"></Bottom>

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