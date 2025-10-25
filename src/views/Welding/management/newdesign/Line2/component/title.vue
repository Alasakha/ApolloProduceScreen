<template>
  <div class="title-container">
    <div class="title-bar">
      <h2 class="title-text">{{ title }}</h2>
    </div>
    <div class="content-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>

<style scoped>
.title-container {
  width: 100%;
  background: transparent;
  border: 2px solid #1565c0; /* 蓝色边框线 */
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
}

.title-bar {
  background: rgba(21, 101, 192, 0.1); /* 淡蓝色底色 */
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 2px solid #1565c0; /* 标题下方蓝色分割线 */
}

.title-text {
  color: #72f0f5; /* 蓝色文字，与边框颜色一致 */
  font-size: 18px;
  font-weight: bold;
  font-family: 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  margin: 0;
  text-align: center;
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgba(21, 101, 192, 0.3);
}

.content-wrapper {
  background: transparent;
  padding: 0;
  height: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title-text {
    font-size: 16px;
  }
  
  .title-bar {
    height: 45px;
  }
}

@media (max-width: 480px) {
  .title-text {
    font-size: 14px;
  }
  
  .title-bar {
    height: 40px;
  }
}

/* 可选的主题变体 */
.title-container.theme-dark {
  border-color: #0d47a1; /* 更深的蓝色边框 */
}

.title-container.theme-dark .title-bar {
  background: rgba(13, 71, 161, 0.1); /* 深蓝色淡底色 */
  border-bottom-color: #0d47a1;
}

.title-container.theme-dark .title-text {
  color: #0d47a1;
}

.title-container.theme-green {
  border-color: #2e7d32; /* 绿色边框 */
}

.title-container.theme-green .title-bar {
  background: rgba(46, 125, 50, 0.1); /* 绿色淡底色 */
  border-bottom-color: #2e7d32;
}

.title-container.theme-green .title-text {
  color: #2e7d32;
}

.title-container.theme-orange {
  border-color: #ef6c00; /* 橙色边框 */
}

.title-container.theme-orange .title-bar {
  background: rgba(239, 108, 0, 0.1); /* 橙色淡底色 */
  border-bottom-color: #ef6c00;
}

.title-container.theme-orange .title-text {
  color: #ef6c00;
}
</style>
