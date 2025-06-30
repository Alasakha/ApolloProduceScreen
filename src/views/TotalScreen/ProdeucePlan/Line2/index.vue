<template>
<div class=" flex">
    <BasicData class="pl-4"></BasicData>
    <EffiectOfPerson></EffiectOfPerson>
    <ProductNum/>      
</div>

</template>
  
  
  <script setup>
  import { ref, onMounted,onBeforeUnmount } from 'vue';
  import BasicData from './views/BasicData.vue'
  import EffiectOfPerson from './views/EffiectofPerson.vue';
  import ProductNum from './views/ProdectNum.vue'
  </script>
  
  
  <style scoped>

  
  </style>