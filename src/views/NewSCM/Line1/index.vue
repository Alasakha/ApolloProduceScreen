<script setup>
import { ref, reactive, computed, watch } from 'vue';
import BigScreenTitle from '@/components/title.vue'
import lailiao from './LailiaoRate/index.vue';
import daohuo from './daohuoRate/index.vue';
import huiqian from './huiqianRate/index.vue';

</script>

<template>
  <div class="flex h-[25vh] w-full  p-4 pt-2" >
<lailiao class="flex-1"></lailiao>
<daohuo class="flex-1"></daohuo> 
<huiqian class="flex-1"></huiqian>
</div> 
</template>

<style scoped>

</style>