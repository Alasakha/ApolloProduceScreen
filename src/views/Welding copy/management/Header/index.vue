<template>
  <!-- 留出标题的高度 -->
   <!-- <div class="h-[3vh] w-full flex justify-center items-center"></div> -->
  <div class="h-[7vh] w-full flex justify-center items-center pl-1">
  <Currenttime class="flex-1"></Currenttime>
  <logo class="flex-1"></logo>
  <HeaderTitle class="flex-2"></HeaderTitle>
  <weather class="flex-2"></weather> 
  </div>
</template>

<script setup lang="ts">
import logo from './views/logo.vue';
import HeaderTitle from './views/title.vue';
import weather from './views/weather.vue';
import Currenttime from './views/time.vue';
</script>

<style scoped>

</style>