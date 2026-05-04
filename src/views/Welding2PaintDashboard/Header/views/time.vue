<template>
  <div class="current-time">{{ currentTime }}</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const currentTime = ref('')
const updateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
let timer: NodeJS.Timeout
onMounted(() => { updateTime(); timer = setInterval(updateTime, 1000) })
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.current-time {
  color: #00d4ff;
  font-size: 1.2vw;
  font-family: 'Courier New', monospace;
  text-align: center;
  text-shadow: 0 0 5px rgba(0, 212, 255, 0.5);
}
</style>
