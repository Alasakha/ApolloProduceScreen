<script setup>
import { ref, reactive, computed, watch } from 'vue';
import caigoudanhuiqianbujishi from './views/caigoudanhuiqianbujishi.vue';
import daohuo from './views/daohuo.vue';
import daohuobujishi from './views/daohuobujishi.vue';
import huiqianbujishi from './views/huiqianbujishi.vue';
</script>

<template>
  <div class="flex h-[25vh] w-full mt-3 " >
<daohuo class="flex-1"></daohuo>
<!-- <daohuobujishi class="flex-1"></daohuobujishi> -->
<!-- <huiqianbujishi class="flex-1"></huiqianbujishi> -->
<caigoudanhuiqianbujishi class="flex-1"></caigoudanhuiqianbujishi>
</div>

</template>

<style scoped>

</style>