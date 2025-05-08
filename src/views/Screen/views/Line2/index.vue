<template>
    <div class="line2 flex h-[35%] w-full p-4 gap-4">
      <Eourly></Eourly>
        <Data></Data>
        <Efficency></Efficency>  
    </div>
  </template>
  
  <script setup>
    import Data from './views/data.vue'
    import Efficency from './views/efficiency.vue'
    import Eourly from './views/hourlyProduct.vue'
  </script>
  
  <style scoped>

  </style>