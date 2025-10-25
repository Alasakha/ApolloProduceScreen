<template>
  <div class="marquee-container">
    <Vue3Marquee
      :duration="20"
      :pause-on-hover="true"
      direction="normal"
      class="marquee-text"
    >
      <div class="marquee-content">
        <span class="icon">⚡</span>
        <span class="text">当日:重要点、安全、通知、信息、注意事项等、滚动条进行显示滚动</span>
      </div>
    </Vue3Marquee>
  </div>
</template>

<script setup lang="ts">
import { Vue3Marquee } from 'vue3-marquee'
</script>

<style scoped>
.marquee-container {
  width: 100%;
  /* background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); */
  border-top: 3px solid #1976d2;
  border-bottom: 3px solid #1976d2;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.marquee-text {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.marquee-content {
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
  font-size: 18px;
  font-weight: 600;
  color: #d32f2f;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.icon {
  font-size: 24px;
  color: #1976d2;
  animation: pulse 2s infinite;
}

.text {
  font-family: 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  letter-spacing: 1px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .marquee-content {
    font-size: 16px;
  }
  
  .icon {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .marquee-content {
    font-size: 14px;
    gap: 8px;
  }
  
  .icon {
    font-size: 18px;
  }
}
</style>
