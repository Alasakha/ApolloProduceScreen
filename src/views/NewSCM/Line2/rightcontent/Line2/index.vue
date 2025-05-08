<script setup>
import { ref, reactive, computed, watch } from 'vue';
import leftpie from './leftpie.vue'
import rightpie from './rightpie.vue'
</script>

<template>

  <div class="line1 flex h-full w-full">
    <leftpie class="flex-1"></leftpie>
    <rightpie class="flex-1"></rightpie>
  </div>

</template>

<style scoped>

</style>