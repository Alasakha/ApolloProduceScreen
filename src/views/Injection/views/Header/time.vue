<template>
  <div class="text-white flex justify-around w-[60%]">
    <div class="text-3xl ">{{ weekStr }}</div>
    <div class="text-3xl ">{{ timeStr }}</div>

  </div>
</template>

<script setup>
import { useDateTime } from "./time.ts";
const { weekStr, timeStr } = useDateTime();
</script>