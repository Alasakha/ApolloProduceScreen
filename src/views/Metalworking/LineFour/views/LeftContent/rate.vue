<template>
  <div class="check-info-wrap">
    <CheckInfoItem label="设备总数" :value="80" />
    <CheckInfoItem label="已点检数" :value="60" />
    <CheckInfoItem label="点检率" :value="'75%'" />
  </div>
</template>

<script setup>
import CheckInfoItem from './components/card.vue';
</script>

<style scoped>
.check-info-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>