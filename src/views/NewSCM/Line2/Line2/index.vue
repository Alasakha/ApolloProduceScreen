<template>
  <div class="flex w-full">
    <Left :guolv-data="guolvData" class="w-1/4"></Left>
    <Right @updateGuolvData="guolvData = $event" class="w-3/4"></Right>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Left from './leftcontent.vue'
import Right from './rightcontent.vue'

const guolvData = ref([])
</script>

<style scoped>
</style>ss