<template>
  <div class="flex justify-center items-center w-[80%] space-x-8">
    <!-- 使用背景渐变和文字透明 -->
    <div class="text-3xl bg-gradient-to-t from-cyan-500 to-white text-transparent bg-clip-text">
      {{ weekStr }}
    </div>
    <div class="text-3xl bg-gradient-to-t from-cyan-500 to-white text-transparent bg-clip-text">
      时间：{{ timeStr }}
    </div>
  </div>
</template>

<script setup>
import { useDateTime } from "./time.ts";
const { weekStr, timeStr } = useDateTime();
</script>
