<template>
  <div class="flex w-screen bg-blue-900 opacity-50 h-[10vh] justify-center items-center ">
    <div class="flex-1 justify-center items-center text-4xl flex text-white">{{ dateStr }}</div>

    <div class="text-5xl font-bold bg-gradient-to-r text-cyan-100  z-1000 flex-1 justify-center items-center flex">
    注塑生产管理看板
    </div>

    <div class="flex-1 flex justify-center items-center"><Time></Time></div>

  </div>
</template>

<script setup lang="ts">
import Time from './time.vue'
import { useDateTime } from "./time.ts";
const { dateStr } = useDateTime();
</script>

<style></style>