<!-- DvLoading.vue -->
<template>
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="spinner"></div>
        <div class="text">Loading...</div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    isLoading: {
      type: Boolean,
      required: true
    }
  });
  </script>
  
  <style scoped>
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }
  
  .loading-content {
    text-align: center;
    color: #fff;
  }
  
  .spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  .text {
    margin-top: 10px;
    font-size: 16px;
  }
  </style>