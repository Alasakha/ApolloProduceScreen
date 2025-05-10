<template>
  <div class="h-[40vh] w-full flex flex-col justify-center items-stretch px-4 space-y-1">
    <div class="flex-1 min-h-0">
      <Line1 class="w-full h-full" />
    </div>
    <div class="flex-1 min-h-0">
      <Line2 class="w-full h-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Line1 from './Line1/index.vue'
import Line2 from './Line2/index.vue'
</script>