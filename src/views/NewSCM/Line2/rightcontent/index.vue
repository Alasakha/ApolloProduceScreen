<script setup>
import { ref, reactive, computed, watch } from 'vue';
import Line1 from './Line1/index.vue'
import Line2 from './Line2/index.vue'

</script>

<template>

  <div class="flex flex-col h-full w-full">
    <Line2 class="flex-1"></Line2>
    <Line1 class="flex-1"></Line1>
    
  </div>

</template>

<style scoped>

</style>