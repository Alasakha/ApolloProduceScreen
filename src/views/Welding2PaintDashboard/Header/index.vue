<template>
  <div class="header-container">
    <div class="header-left">
      <Logo></Logo>
    </div>
    <div class="header-center">
      <Title></Title>
    </div>
    <div class="header-right">
      <Time></Time>
      <Weather></Weather>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from './views/logo.vue'
import Title from './views/title.vue'
import Time from './views/time.vue'
import Weather from './views/weather.vue'
</script>

<style scoped>
.header-container {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: rgba(0, 30, 60, 0.8);
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  box-sizing: border-box;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}
</style>
