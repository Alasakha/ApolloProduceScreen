<script setup>
import { ref, reactive, computed, watch } from 'vue';
import nonconformance from './views/Nonconformance .vue'
import Poorqualityofpurchasedgoods from './views/Poorqualityofpurchasedgoods.vue'
import Qualifiedrate from './views/Qualifiedrate.vue'

</script>

<template>
  <div class="index h-[25vh] flex space-x-4">
    <Qualifiedrate class="flex-1"></Qualifiedrate>
    <nonconformance class="flex-1"></nonconformance>
    <Poorqualityofpurchasedgoods class="flex-1"></Poorqualityofpurchasedgoods>
  </div>
</template>

<style scoped>

</style>