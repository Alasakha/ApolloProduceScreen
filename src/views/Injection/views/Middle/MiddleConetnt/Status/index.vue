<template>
  <div class="flex w-full">

    <div class="flex flex-col justify-center items-center">
      <Total></Total>
      <h2>设备总数</h2>
    </div>

    <div class="flex flex-col justify-center items-center">
      <Run></Run>
      <h2>运行数量</h2>
    </div>

    <div class="flex flex-col justify-center items-center">
      <Bad></Bad>
      <h2>故障数量</h2>
    </div>

    <div class="flex flex-col justify-center items-center">
      <Stop></Stop>
      <h2>关机数量</h2>
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