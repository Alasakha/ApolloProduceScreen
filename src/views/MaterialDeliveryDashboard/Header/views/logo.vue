<template>
  <div class="logo-container">
    <img src="@/assets/APOLLO.png" alt="Logo" class="logo-img" v-if="logoExists" />
    <div class="logo-text" v-else>APOLLO</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const logoExists = ref(true)
</script>

<style scoped>
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.logo-img {
  height: 80%;
  object-fit: contain;
}

.logo-text {
  font-size: 2vw;
  color: #00d4ff;
  font-weight: bold;
  letter-spacing: 0.3vw;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}
</style>
