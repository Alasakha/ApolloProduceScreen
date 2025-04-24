<template>
    <div class="info-card">
      <div class="label">{{ label }}</div>
      <div class="value">{{ value }}</div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    label: String,
    value: [String, Number],
  });
  </script>
  
  <style scoped>
  .info-card {
    width: 160px;
    height: 100px;
    background: rgba(0, 255, 255, 0.08);
    border: 1px solid #00ffff;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 8px;
    font-family: 'Arial', sans-serif;
    transition: transform 0.3s;
  }
  .info-card:hover {
    transform: scale(1.05);
  }
  .label {
    font-size: 16px;
    color: #aaa;
  }
  .value {
    font-size: 28px;
    font-weight: bold;
    color: #00ffff;
    margin-top: 6px;
  }
  </style>
  