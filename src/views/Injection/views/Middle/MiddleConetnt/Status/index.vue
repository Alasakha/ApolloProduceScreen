<template>
  <div class="flex w-full">

    <div class="flex flex-col justify-center items-center">
      <Total></Total>
      <h2 class="text-xl text-cyan-300">设备总数</h2>
    </div>

    <div class="flex flex-col justify-center items-center">
      <Run></Run>
      <h2 class="text-xl text-cyan-300">运行数量</h2>
    </div>

    <div class="flex flex-col justify-center items-center">
      <Bad></Bad>
      <h2 class="text-xl text-cyan-300">故障数量</h2>
    </div>

    <div class="flex flex-col justify-center items-center">
      <Stop></Stop>
      <h2 class="text-xl text-cyan-300">闲置数量</h2>
    </div>
  </div>


</template>

<script setup lang="ts">
import Total from './total.vue';
import Stop from './stop.vue'
import Bad from './bad.vue'
import Run from './run.vue'
</script>   


<style scoped>

</style>