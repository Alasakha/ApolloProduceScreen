<template>
  <div class="weather-widget">
    <span class="weather-icon">☀️</span>
    <span class="weather-info">晴 25°C</span>
  </div>
</template>

<script setup lang="ts">
// 这里可以对接真实的天气API
</script>

<style scoped>
.weather-widget {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #00d4ff;
  font-size: 1.2vw;
}

.weather-icon {
  font-size: 1.5vw;
}
</style>
